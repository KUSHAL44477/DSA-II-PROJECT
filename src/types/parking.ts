/**
 * Type definitions for Nearest Parking Slot Finder (DSA-II Academic Project)
 * Domain: Smart Transportation and Indoor Navigation
 */

export type SlotType = 'standard' | 'ev' | 'accessible';
export type SlotStatus = 'vacant' | 'occupied' | 'reserved' | 'maintenance';
export type NodeType = 'gate' | 'aisle_intersection' | 'slot_access' | 'ramp';

export interface Coordinates2D {
  x: number;
  y: number;
}

export interface Coordinates3D extends Coordinates2D {
  floor: number;
}

export interface ParkingSlot {
  id: string;                      // Unique ID (e.g., 'F1-S01', 'F2-E02')
  floor: number;                   // Floor level: 1 (Ground), 2 (Level 2), etc.
  type: SlotType;                  // Standard, EV, Accessible
  status: SlotStatus;              // Current authoritative status
  accessNodeId: string;            // The graph node from which vehicle enters this bay
  coordinates: Coordinates2D;      // Top-down visual coordinate center (m or px)
  width: number;                   // Bay width (meters)
  length: number;                  // Bay length (meters)
}

export interface Gate {
  id: string;                      // e.g., 'GATE_A', 'GATE_B'
  label: string;                   // Display name: 'North Main Gate A'
  floor: number;                   // Floor location
  nodeId: string;                  // Associated graph entry node
  coordinates: Coordinates2D;
}

export interface GraphNode {
  id: string;                      // Unique node identifier
  floor: number;                   // Floor index
  type: NodeType;                  // gate | intersection | slot_access | ramp
  coordinates: Coordinates2D;      // Physical layout coordinates
  label?: string;                  // Optional human-readable description
}

export interface GraphEdge {
  from: string;
  to: string;
  weight: number;                  // Distance or traversal cost (non-negative)
  oneWay: boolean;                 // If true, vehicle may only travel from -> to
}

export interface DijkstraResult {
  startNodeId: string;
  distances: Map<string, number>;
  predecessors: Map<string, string | null>;
  visitedOrder: string[];
}

export interface BFSResult {
  startNodeId: string;
  distancesInHops: Map<string, number>;
  predecessors: Map<string, string | null>;
  visitedOrder: string[];
}

export interface CandidateSlot {
  slot: ParkingSlot;
  routeCost: number;               // Shortest driving path distance from gate
  pathNodeIds: string[];           // Step-by-step graph node IDs
  pathCoordinates: Coordinates2D[];// Reconstructed geometric coordinates along aisle segments
  straightLineDistance: number;    // Euclidean distance for comparison
}

export interface RecommendationResult {
  found: boolean;
  gate: Gate;
  recommendedSlot: CandidateSlot | null;
  alternatives: CandidateSlot[];
  totalEligibleVacantBays: number;
  searchFilter: {
    floor?: number;
    preferredType?: SlotType;
  };
  rationale: string;
}

export interface OccupancyStats {
  totalBays: number;
  vacant: number;
  occupied: number;
  reserved: number;
  maintenance: number;
  occupancyRatePercentage: number;
}

export interface FindNearestParams {
  gateId: string;
  floor?: number;
  preferredType?: SlotType;
  maxAlternatives?: number;
}
