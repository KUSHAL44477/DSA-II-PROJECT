import {
  ParkingSlot,
  SlotStatus,
  Gate,
  CandidateSlot,
  RecommendationResult,
  OccupancyStats,
  FindNearestParams,
  Coordinates2D,
} from '../types/parking.js';
import { Graph } from '../algorithms/graph.js';
import { Dijkstra } from '../algorithms/dijkstra.js';
import { BinarySearchTree } from '../algorithms/binarySearchTree.js';
import { AVLTree } from '../algorithms/avlTree.js';
import { DEMO_GATES, DEMO_GRAPH_NODES, DEMO_GRAPH_EDGES } from '../data/parkingLayout.js';
import { DEMO_SLOTS } from '../data/demoSlots.js';

/**
 * Authoritative Parking Service and Navigation Coordinator.
 *
 * Coordinates graph topology, slot state management, and real-time
 * path calculation using Dijkstra with Binary Min-Heap frontier.
 *
 * Maintains parallel AVL Tree and BST indexes for balanced slot-ID lookup.
 */
export class ParkingService {
  private graph: Graph;
  private gates: Map<string, Gate> = new Map();
  private slots: Map<string, ParkingSlot> = new Map();

  // Parallel academic search indexes
  private bstIndex: BinarySearchTree<ParkingSlot> = new BinarySearchTree();
  private avlIndex: AVLTree<ParkingSlot> = new AVLTree();

  constructor(
    customSlots?: ParkingSlot[],
    customGates?: Gate[],
    customNodes = DEMO_GRAPH_NODES,
    customEdges = DEMO_GRAPH_EDGES
  ) {
    this.graph = new Graph();
    this.initializeGraph(customNodes, customEdges);
    this.initializeGates(customGates || DEMO_GATES);
    this.initializeSlots(customSlots || DEMO_SLOTS);
  }

  private initializeGraph(nodes: typeof DEMO_GRAPH_NODES, edges: typeof DEMO_GRAPH_EDGES): void {
    for (const node of nodes) {
      this.graph.addNode(node);
    }
    for (const edge of edges) {
      this.graph.addEdge(edge.from, edge.to, edge.weight, edge.oneWay);
    }
  }

  private initializeGates(gates: Gate[]): void {
    for (const gate of gates) {
      this.gates.set(gate.id, gate);
    }
  }

  private initializeSlots(slots: ParkingSlot[]): void {
    for (const slot of slots) {
      const cloned = { ...slot };
      this.slots.set(cloned.id, cloned);
      this.bstIndex.insert(cloned.id, cloned);
      this.avlIndex.insert(cloned.id, cloned);
    }
  }

  public getGraph(): Graph {
    return this.graph;
  }

  public getGates(): Gate[] {
    return Array.from(this.gates.values());
  }

  public getGate(gateId: string): Gate | undefined {
    return this.gates.get(gateId);
  }

  public getAllSlots(): ParkingSlot[] {
    return Array.from(this.slots.values());
  }

  public getSlot(slotId: string): ParkingSlot | undefined {
    return this.slots.get(slotId);
  }

  public getBSTIndex(): BinarySearchTree<ParkingSlot> {
    return this.bstIndex;
  }

  public getAVLIndex(): AVLTree<ParkingSlot> {
    return this.avlIndex;
  }

  /**
   * Updates a slot's status and keeps authoritative map, BST, and AVL trees synchronized.
   */
  public updateSlotStatus(slotId: string, newStatus: SlotStatus): boolean {
    const slot = this.slots.get(slotId);
    if (!slot) return false;

    slot.status = newStatus;
    // Update indexed copies
    this.bstIndex.insert(slotId, { ...slot });
    this.avlIndex.insert(slotId, { ...slot });
    return true;
  }

  /**
   * Computes accurate occupancy metrics across the facility.
   */
  public getOccupancyStats(): OccupancyStats {
    let vacant = 0;
    let occupied = 0;
    let reserved = 0;
    let maintenance = 0;

    for (const slot of this.slots.values()) {
      switch (slot.status) {
        case 'vacant':
          vacant++;
          break;
        case 'occupied':
          occupied++;
          break;
        case 'reserved':
          reserved++;
          break;
        case 'maintenance':
          maintenance++;
          break;
      }
    }

    const totalBays = this.slots.size;
    const occupancyRatePercentage = totalBays > 0 ? ((occupied + reserved) / totalBays) * 100 : 0;

    return {
      totalBays,
      vacant,
      occupied,
      reserved,
      maintenance,
      occupancyRatePercentage: Math.round(occupancyRatePercentage * 10) / 10,
    };
  }

  /**
   * Finds the nearest reachable vacant parking slot using Dijkstra's algorithm.
   *
   * 1. Filters candidates by eligibility (must be 'vacant', match floor and slot type).
   * 2. Runs Dijkstra from the selected entrance gate across all aisle segments.
   * 3. Sorts reachable candidates by actual graph driving cost (not straight-line distance).
   * 4. Returns optimal slot and next K alternative candidates.
   */
  public findNearestSlot(params: FindNearestParams): RecommendationResult {
    const gate = this.gates.get(params.gateId);
    if (!gate) {
      throw new Error(`Entrance Gate '${params.gateId}' not found.`);
    }

    // 1. Run Dijkstra from gate entry node
    const dijkstraResult = Dijkstra.compute(this.graph, gate.nodeId);

    // 2. Filter eligible slots
    const candidates: CandidateSlot[] = [];

    for (const slot of this.slots.values()) {
      // Must be vacant (exclude occupied, reserved, maintenance)
      if (slot.status !== 'vacant') continue;

      // Filter by floor if requested
      if (params.floor !== undefined && slot.floor !== params.floor) continue;

      // Filter by preferred slot type if requested
      if (params.preferredType !== undefined && slot.type !== params.preferredType) continue;

      // Check graph reachability
      const routeCost = dijkstraResult.distances.get(slot.accessNodeId) ?? Infinity;
      if (routeCost === Infinity) continue;

      const pathNodeIds = Dijkstra.reconstructPath(
        dijkstraResult.predecessors,
        gate.nodeId,
        slot.accessNodeId
      );

      if (!pathNodeIds || pathNodeIds.length === 0) continue;

      // Reconstruct geometric coordinates along aisle segments
      const pathCoordinates: Coordinates2D[] = pathNodeIds.map((nodeId) => {
        const node = this.graph.getNode(nodeId)!;
        return { x: node.coordinates.x, y: node.coordinates.y };
      });

      // Straight-line distance from gate for academic comparison
      const straightLineDistance = this.graph.getEuclideanDistance(gate.nodeId, slot.accessNodeId);

      candidates.push({
        slot,
        routeCost,
        pathNodeIds,
        pathCoordinates,
        straightLineDistance: Math.round(straightLineDistance * 10) / 10,
      });
    }

    // 3. Sort candidates by calculated route cost (with tie-breakers)
    candidates.sort((a, b) => {
      if (a.routeCost !== b.routeCost) {
        return a.routeCost - b.routeCost;
      }
      if (a.straightLineDistance !== b.straightLineDistance) {
        return a.straightLineDistance - b.straightLineDistance;
      }
      return a.slot.id.localeCompare(b.slot.id);
    });

    if (candidates.length === 0) {
      return {
        found: false,
        gate,
        recommendedSlot: null,
        alternatives: [],
        totalEligibleVacantBays: 0,
        searchFilter: {
          floor: params.floor,
          preferredType: params.preferredType,
        },
        rationale: `No reachable vacant slot found matching criteria from ${gate.label}.`,
      };
    }

    const recommendedSlot = candidates[0];
    const maxAlt = params.maxAlternatives ?? 3;
    const alternatives = candidates.slice(1, maxAlt + 1);

    const rationale =
      `Selected ${recommendedSlot.slot.id} (Floor ${recommendedSlot.slot.floor}, ` +
      `${recommendedSlot.slot.type.toUpperCase()}) as optimal destination. ` +
      `Lowest driving path cost: ${recommendedSlot.routeCost}m across ${recommendedSlot.pathNodeIds.length} graph nodes ` +
      `(Straight-line geometric distance: ${recommendedSlot.straightLineDistance}m).`;

    return {
      found: true,
      gate,
      recommendedSlot,
      alternatives,
      totalEligibleVacantBays: candidates.length,
      searchFilter: {
        floor: params.floor,
        preferredType: params.preferredType,
      },
      rationale,
    };
  }

  /**
   * Resets all slot statuses and data structures back to default demo layout.
   */
  public resetToDemo(): void {
    this.slots.clear();
    this.bstIndex = new BinarySearchTree();
    this.avlIndex = new AVLTree();
    this.initializeSlots(DEMO_SLOTS);
  }
}
