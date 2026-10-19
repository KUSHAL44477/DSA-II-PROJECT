import { GraphNode, GraphEdge, Gate } from '../types/parking.js';

/**
 * Multi-floor parking facility layout data.
 *
 * Models a 2-floor commercial parking structure:
 * - Floor 1: Ground Floor with Gate A (North) and Gate B (East).
 * - Floor 2: Upper Deck with Gate C (Ramp West Entrance).
 * - Connected via driving ramp: F1_RAMP <-> F2_RAMP.
 * - Directional rules: Aisle 2 (N2 to N5) is ONE-WAY (Northbound only).
 */

export const DEMO_GATES: Gate[] = [
  {
    id: 'GATE_A',
    label: 'Gate A (North Entrance - Floor 1)',
    floor: 1,
    nodeId: 'N_GATE_A',
    coordinates: { x: 50, y: 10 },
  },
  {
    id: 'GATE_B',
    label: 'Gate B (East Entrance - Floor 1)',
    floor: 1,
    nodeId: 'N_GATE_B',
    coordinates: { x: 190, y: 100 },
  },
  {
    id: 'GATE_C',
    label: 'Gate C (West Ramp Entrance - Floor 2)',
    floor: 2,
    nodeId: 'N_GATE_C',
    coordinates: { x: 10, y: 100 },
  },
];

export const DEMO_GRAPH_NODES: GraphNode[] = [
  // --- Floor 1 Nodes ---
  // Entrance & Main Intersections
  { id: 'N_GATE_A', floor: 1, type: 'gate', coordinates: { x: 50, y: 20 }, label: 'Gate A Entry Point' },
  { id: 'N_INT_1', floor: 1, type: 'aisle_intersection', coordinates: { x: 50, y: 50 }, label: 'North Aisle Hub' },
  { id: 'N_INT_2', floor: 1, type: 'aisle_intersection', coordinates: { x: 120, y: 50 }, label: 'North-East Junction' },
  { id: 'N_GATE_B', floor: 1, type: 'gate', coordinates: { x: 180, y: 100 }, label: 'Gate B Entry Point' },
  { id: 'N_INT_3', floor: 1, type: 'aisle_intersection', coordinates: { x: 120, y: 100 }, label: 'Central Hub' },
  { id: 'N_INT_4', floor: 1, type: 'aisle_intersection', coordinates: { x: 50, y: 100 }, label: 'West Central Hub' },
  { id: 'N_INT_5', floor: 1, type: 'aisle_intersection', coordinates: { x: 50, y: 160 }, label: 'South-West Junction' },
  { id: 'N_INT_6', floor: 1, type: 'aisle_intersection', coordinates: { x: 120, y: 160 }, label: 'South-East Junction' },
  { id: 'F1_RAMP', floor: 1, type: 'ramp', coordinates: { x: 20, y: 100 }, label: 'Floor 1 to Floor 2 Ramp Start' },

  // Slot Access Nodes (Aisle points where cars turn into bays)
  { id: 'ACC_F1_01', floor: 1, type: 'slot_access', coordinates: { x: 70, y: 50 }, label: 'Access Bay F1-S01 & F1-S02' },
  { id: 'ACC_F1_02', floor: 1, type: 'slot_access', coordinates: { x: 95, y: 50 }, label: 'Access Bay F1-E01 & F1-A01' },
  { id: 'ACC_F1_03', floor: 1, type: 'slot_access', coordinates: { x: 120, y: 75 }, label: 'Access Bay F1-S03 & F1-S04' },
  { id: 'ACC_F1_04', floor: 1, type: 'slot_access', coordinates: { x: 50, y: 75 }, label: 'Access Bay F1-S05 (One-way aisle)' },
  { id: 'ACC_F1_05', floor: 1, type: 'slot_access', coordinates: { x: 85, y: 100 }, label: 'Access Bay F1-S06 & F1-E02' },
  { id: 'ACC_F1_06', floor: 1, type: 'slot_access', coordinates: { x: 85, y: 160 }, label: 'Access Bay F1-S07 & F1-S08' },

  // --- Floor 2 Nodes ---
  { id: 'N_GATE_C', floor: 2, type: 'gate', coordinates: { x: 20, y: 100 }, label: 'Gate C Ramp Arrival' },
  { id: 'F2_RAMP', floor: 2, type: 'ramp', coordinates: { x: 30, y: 100 }, label: 'Floor 2 Ramp Hub' },
  { id: 'N_F2_INT_1', floor: 2, type: 'aisle_intersection', coordinates: { x: 60, y: 60 }, label: 'Floor 2 North Hub' },
  { id: 'N_F2_INT_2', floor: 2, type: 'aisle_intersection', coordinates: { x: 140, y: 60 }, label: 'Floor 2 North-East Hub' },
  { id: 'N_F2_INT_3', floor: 2, type: 'aisle_intersection', coordinates: { x: 60, y: 140 }, label: 'Floor 2 South Hub' },
  { id: 'N_F2_INT_4', floor: 2, type: 'aisle_intersection', coordinates: { x: 140, y: 140 }, label: 'Floor 2 South-East Hub' },
  { id: 'ACC_F2_01', floor: 2, type: 'slot_access', coordinates: { x: 100, y: 60 }, label: 'Access Bay F2-S01 & F2-E01' },
  { id: 'ACC_F2_02', floor: 2, type: 'slot_access', coordinates: { x: 100, y: 140 }, label: 'Access Bay F2-S02 & F2-A01' },
  { id: 'ACC_F2_03', floor: 2, type: 'slot_access', coordinates: { x: 140, y: 100 }, label: 'Access Bay F2-S03' },
];

export const DEMO_GRAPH_EDGES: GraphEdge[] = [
  // --- Floor 1 Aisles ---
  // Gate A entry to North Hub
  { from: 'N_GATE_A', to: 'N_INT_1', weight: 30, oneWay: false },

  // North Corridor (Aisle 1): N_INT_1 <-> ACC_F1_01 <-> ACC_F1_02 <-> N_INT_2
  { from: 'N_INT_1', to: 'ACC_F1_01', weight: 20, oneWay: false },
  { from: 'ACC_F1_01', to: 'ACC_F1_02', weight: 25, oneWay: false },
  { from: 'ACC_F1_02', to: 'N_INT_2', weight: 25, oneWay: false },

  // Gate B entry to Central Hub
  { from: 'N_GATE_B', to: 'N_INT_3', weight: 40, oneWay: false },

  // East Corridor: N_INT_2 <-> ACC_F1_03 <-> N_INT_3
  { from: 'N_INT_2', to: 'ACC_F1_03', weight: 25, oneWay: false },
  { from: 'ACC_F1_03', to: 'N_INT_3', weight: 25, oneWay: false },

  // Central Cross Aisle: N_INT_4 <-> ACC_F1_05 <-> N_INT_3
  { from: 'N_INT_4', to: 'ACC_F1_05', weight: 35, oneWay: false },
  { from: 'ACC_F1_05', to: 'N_INT_3', weight: 35, oneWay: false },

  // *** ONE-WAY AISLE CONSTRAINT DEMONSTRATION ***
  // West Aisle: Direction is strictly NORTHBOUND (from N_INT_4 to N_INT_1).
  // A car at N_INT_1 CANNOT drive south directly to ACC_F1_04!
  // It must loop around: N_INT_1 -> N_INT_2 -> N_INT_3 -> N_INT_4 -> ACC_F1_04
  { from: 'N_INT_4', to: 'ACC_F1_04', weight: 25, oneWay: true },
  { from: 'ACC_F1_04', to: 'N_INT_1', weight: 25, oneWay: true },

  // West Ramp Connector
  { from: 'N_INT_4', to: 'F1_RAMP', weight: 30, oneWay: false },

  // South Aisles
  { from: 'N_INT_4', to: 'N_INT_5', weight: 60, oneWay: false },
  { from: 'N_INT_5', to: 'ACC_F1_06', weight: 35, oneWay: false },
  { from: 'ACC_F1_06', to: 'N_INT_6', weight: 35, oneWay: false },
  { from: 'N_INT_3', to: 'N_INT_6', weight: 60, oneWay: false },

  // --- Ramp Floor 1 <-> Floor 2 ---
  { from: 'F1_RAMP', to: 'F2_RAMP', weight: 45, oneWay: false },

  // --- Floor 2 Aisles ---
  { from: 'N_GATE_C', to: 'F2_RAMP', weight: 15, oneWay: false },
  { from: 'F2_RAMP', to: 'N_F2_INT_1', weight: 35, oneWay: false },
  { from: 'F2_RAMP', to: 'N_F2_INT_3', weight: 35, oneWay: false },

  { from: 'N_F2_INT_1', to: 'ACC_F2_01', weight: 40, oneWay: false },
  { from: 'ACC_F2_01', to: 'N_F2_INT_2', weight: 40, oneWay: false },

  { from: 'N_F2_INT_3', to: 'ACC_F2_02', weight: 40, oneWay: false },
  { from: 'ACC_F2_02', to: 'N_F2_INT_4', weight: 40, oneWay: false },

  { from: 'N_F2_INT_2', to: 'ACC_F2_03', weight: 40, oneWay: false },
  { from: 'ACC_F2_03', to: 'N_F2_INT_4', weight: 40, oneWay: false },
];
