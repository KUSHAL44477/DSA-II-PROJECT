import { ParkingSlot } from '../types/parking.js';

/**
 * Authoritative demo dataset of parking slots across Floor 1 and Floor 2.
 * Includes diverse bay types (standard, EV, accessible) and states
 * (vacant, occupied, reserved, maintenance).
 */
export const DEMO_SLOTS: ParkingSlot[] = [
  // --- Floor 1 Slots ---
  {
    id: 'F1-S01',
    floor: 1,
    type: 'standard',
    status: 'vacant',
    accessNodeId: 'ACC_F1_01',
    coordinates: { x: 70, y: 35 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F1-S02',
    floor: 1,
    type: 'standard',
    status: 'occupied', // Occupied slot directly adjacent to F1-S01
    accessNodeId: 'ACC_F1_01',
    coordinates: { x: 70, y: 65 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F1-E01',
    floor: 1,
    type: 'ev',
    status: 'vacant', // Fast-charging EV slot on Floor 1
    accessNodeId: 'ACC_F1_02',
    coordinates: { x: 95, y: 35 },
    width: 2.8,
    length: 5.0,
  },
  {
    id: 'F1-A01',
    floor: 1,
    type: 'accessible',
    status: 'vacant', // Accessible (disability) slot with extra clearance
    accessNodeId: 'ACC_F1_02',
    coordinates: { x: 95, y: 65 },
    width: 3.5,
    length: 5.0,
  },
  {
    id: 'F1-S03',
    floor: 1,
    type: 'standard',
    status: 'reserved', // VIP / Permit reserved
    accessNodeId: 'ACC_F1_03',
    coordinates: { x: 135, y: 75 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F1-S04',
    floor: 1,
    type: 'standard',
    status: 'maintenance', // Sensor defect / surface repair
    accessNodeId: 'ACC_F1_03',
    coordinates: { x: 105, y: 75 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F1-S05',
    floor: 1,
    type: 'standard',
    status: 'vacant',
    // Located on northbound one-way aisle ACC_F1_04.
    // Near Gate A geometrically, but requires loop around from Gate A!
    accessNodeId: 'ACC_F1_04',
    coordinates: { x: 35, y: 75 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F1-S06',
    floor: 1,
    type: 'standard',
    status: 'occupied',
    accessNodeId: 'ACC_F1_05',
    coordinates: { x: 85, y: 85 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F1-E02',
    floor: 1,
    type: 'ev',
    status: 'occupied',
    accessNodeId: 'ACC_F1_05',
    coordinates: { x: 85, y: 115 },
    width: 2.8,
    length: 5.0,
  },
  {
    id: 'F1-S07',
    floor: 1,
    type: 'standard',
    status: 'vacant',
    accessNodeId: 'ACC_F1_06',
    coordinates: { x: 85, y: 145 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F1-S08',
    floor: 1,
    type: 'standard',
    status: 'vacant',
    accessNodeId: 'ACC_F1_06',
    coordinates: { x: 85, y: 175 },
    width: 2.5,
    length: 5.0,
  },

  // --- Floor 2 Slots ---
  {
    id: 'F2-S01',
    floor: 2,
    type: 'standard',
    status: 'vacant',
    accessNodeId: 'ACC_F2_01',
    coordinates: { x: 100, y: 45 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F2-E01',
    floor: 2,
    type: 'ev',
    status: 'vacant', // EV bay on Floor 2
    accessNodeId: 'ACC_F2_01',
    coordinates: { x: 100, y: 75 },
    width: 2.8,
    length: 5.0,
  },
  {
    id: 'F2-S02',
    floor: 2,
    type: 'standard',
    status: 'occupied',
    accessNodeId: 'ACC_F2_02',
    coordinates: { x: 100, y: 125 },
    width: 2.5,
    length: 5.0,
  },
  {
    id: 'F2-A01',
    floor: 2,
    type: 'accessible',
    status: 'vacant', // Accessible bay on Floor 2
    accessNodeId: 'ACC_F2_02',
    coordinates: { x: 100, y: 155 },
    width: 3.5,
    length: 5.0,
  },
  {
    id: 'F2-S03',
    floor: 2,
    type: 'standard',
    status: 'vacant',
    accessNodeId: 'ACC_F2_03',
    coordinates: { x: 155, y: 100 },
    width: 2.5,
    length: 5.0,
  },
];
