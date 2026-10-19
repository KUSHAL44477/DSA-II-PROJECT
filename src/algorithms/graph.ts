import { GraphNode, GraphEdge } from '../types/parking.js';

/**
 * Weighted Graph using Adjacency List representation.
 * Supports directed edges (one-way driving aisles) and bidirectional edges.
 *
 * Space Complexity: O(V + E)
 */
export class Graph {
  private nodes: Map<string, GraphNode> = new Map();
  private adjacencyList: Map<string, GraphEdge[]> = new Map();

  /**
   * Register a node in the graph.
   */
  public addNode(node: GraphNode): void {
    if (!this.nodes.has(node.id)) {
      this.nodes.set(node.id, node);
      this.adjacencyList.set(node.id, []);
    }
  }

  /**
   * Add a weighted edge between two nodes.
   * If oneWay is true, vehicle may only travel from -> to.
   * If oneWay is false, bidirectional traversal is allowed.
   */
  public addEdge(from: string, to: string, weight: number, oneWay: boolean = false): void {
    if (!this.nodes.has(from) || !this.nodes.has(to)) {
      throw new Error(`Cannot add edge: Both nodes '${from}' and '${to}' must exist in the graph.`);
    }

    if (weight < 0) {
      throw new Error(`Negative edge weights are not permitted in indoor parking graphs (from: ${from}, to: ${to}, weight: ${weight}).`);
    }

    const forwardEdge: GraphEdge = { from, to, weight, oneWay };
    this.adjacencyList.get(from)!.push(forwardEdge);

    if (!oneWay) {
      const backwardEdge: GraphEdge = { from: to, to: from, weight, oneWay: false };
      this.adjacencyList.get(to)!.push(backwardEdge);
    }
  }

  public getNode(id: string): GraphNode | undefined {
    return this.nodes.get(id);
  }

  public hasNode(id: string): boolean {
    return this.nodes.has(id);
  }

  public getAllNodes(): GraphNode[] {
    return Array.from(this.nodes.values());
  }

  public getNodeCount(): number {
    return this.nodes.size;
  }

  public getOutgoingEdges(nodeId: string): GraphEdge[] {
    return this.adjacencyList.get(nodeId) || [];
  }

  public getAdjacencyList(): Map<string, GraphEdge[]> {
    return this.adjacencyList;
  }

  public getEdgeCount(): number {
    let count = 0;
    for (const edges of this.adjacencyList.values()) {
      count += edges.length;
    }
    return count;
  }

  /**
   * Computes Euclidean (straight-line) distance between two nodes.
   * Useful for academic comparisons against true graph route costs.
   */
  public getEuclideanDistance(nodeIdA: string, nodeIdB: string): number {
    const nodeA = this.nodes.get(nodeIdA);
    const nodeB = this.nodes.get(nodeIdB);
    if (!nodeA || !nodeB) {
      throw new Error(`Node not found: ${nodeIdA} or ${nodeIdB}`);
    }

    const dx = nodeA.coordinates.x - nodeB.coordinates.x;
    const dy = nodeA.coordinates.y - nodeB.coordinates.y;
    // Penalty for different floors
    const floorPenalty = Math.abs(nodeA.floor - nodeB.floor) * 15;
    return Math.sqrt(dx * dx + dy * dy) + floorPenalty;
  }

  /**
   * Calculates the exact cumulative weight of a sequence of node IDs.
   */
  public calculatePathCost(pathNodeIds: string[]): number {
    if (pathNodeIds.length <= 1) return 0;
    let totalCost = 0;

    for (let i = 0; i < pathNodeIds.length - 1; i++) {
      const current = pathNodeIds[i];
      const next = pathNodeIds[i + 1];
      const edge = this.getOutgoingEdges(current).find((e) => e.to === next);
      if (!edge) {
        throw new Error(`Discontinuous path: no traversable edge from '${current}' to '${next}'`);
      }
      totalCost += edge.weight;
    }

    return totalCost;
  }
}
