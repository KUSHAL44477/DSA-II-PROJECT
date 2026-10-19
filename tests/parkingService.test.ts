import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ParkingService } from '../src/services/parkingService.js';

describe('ParkingService & Slot Recommendation Engine', () => {
  it('should initialize with accurate facility occupancy metrics', () => {
    const service = new ParkingService();
    const stats = service.getOccupancyStats();

    assert.equal(stats.totalBays, 16);
    assert.ok(stats.vacant > 0);
    assert.ok(stats.occupied > 0);
    assert.ok(stats.reserved > 0);
    assert.ok(stats.maintenance > 0);
    assert.equal(stats.totalBays, stats.vacant + stats.occupied + stats.reserved + stats.maintenance);
  });

  it('should recommend nearest vacant slot from Gate A based on graph driving cost', () => {
    const service = new ParkingService();
    const result = service.findNearestSlot({ gateId: 'GATE_A' });

    assert.equal(result.found, true);
    assert.ok(result.recommendedSlot);
    assert.equal(result.recommendedSlot?.slot.status, 'vacant');

    // From Gate A (N_GATE_A -> N_INT_1: 30m, N_INT_1 -> ACC_F1_01: 20m) -> 50m to ACC_F1_01
    // F1-S01 is at ACC_F1_01 and is vacant
    assert.equal(result.recommendedSlot?.slot.id, 'F1-S01');
    assert.equal(result.recommendedSlot?.routeCost, 50);
    assert.deepEqual(result.recommendedSlot?.pathNodeIds, ['N_GATE_A', 'N_INT_1', 'ACC_F1_01']);
    assert.ok(result.alternatives.length > 0);
  });

  it('should dynamically exclude newly occupied bays upon status update', () => {
    const service = new ParkingService();

    // First search finds F1-S01
    const res1 = service.findNearestSlot({ gateId: 'GATE_A' });
    assert.equal(res1.recommendedSlot?.slot.id, 'F1-S01');

    // Mark F1-S01 occupied
    const updated = service.updateSlotStatus('F1-S01', 'occupied');
    assert.equal(updated, true);

    // Verify stats updated
    const stats = service.getOccupancyStats();
    assert.ok(stats.occupied > 0);
    assert.equal(service.getSlot('F1-S01')?.status, 'occupied');

    // Second search must NOT return F1-S01
    const res2 = service.findNearestSlot({ gateId: 'GATE_A' });
    assert.equal(res2.found, true);
    assert.notEqual(res2.recommendedSlot?.slot.id, 'F1-S01');
    assert.equal(res2.recommendedSlot?.slot.status, 'vacant');
  });

  it('should filter strictly by EV slot type when requested', () => {
    const service = new ParkingService();
    const result = service.findNearestSlot({ gateId: 'GATE_A', preferredType: 'ev' });

    assert.equal(result.found, true);
    assert.equal(result.recommendedSlot?.slot.type, 'ev');
    assert.equal(result.recommendedSlot?.slot.status, 'vacant');
    // All alternatives must also be EV
    result.alternatives.forEach((alt) => {
      assert.equal(alt.slot.type, 'ev');
    });
  });

  it('should filter strictly by Accessible slot type when requested', () => {
    const service = new ParkingService();
    const result = service.findNearestSlot({ gateId: 'GATE_A', preferredType: 'accessible' });

    assert.equal(result.found, true);
    assert.equal(result.recommendedSlot?.slot.type, 'accessible');
    assert.equal(result.recommendedSlot?.slot.status, 'vacant');
  });

  it('should return found: false when all bays are occupied or under maintenance', () => {
    const service = new ParkingService();

    // Mark all bays occupied
    for (const slot of service.getAllSlots()) {
      service.updateSlotStatus(slot.id, 'occupied');
    }

    const result = service.findNearestSlot({ gateId: 'GATE_A' });
    assert.equal(result.found, false);
    assert.equal(result.recommendedSlot, null);
    assert.equal(result.alternatives.length, 0);
    assert.ok(result.rationale.includes('No reachable vacant slot found'));
  });

  it('should synchronize updates across BST and AVL Tree indexes', () => {
    const service = new ParkingService();
    const bst = service.getBSTIndex();
    const avl = service.getAVLIndex();

    assert.equal(bst.search('F1-S01')?.status, 'vacant');
    assert.equal(avl.search('F1-S01')?.status, 'vacant');

    service.updateSlotStatus('F1-S01', 'reserved');

    assert.equal(bst.search('F1-S01')?.status, 'reserved');
    assert.equal(avl.search('F1-S01')?.status, 'reserved');
  });

  it('should reset to default demo state', () => {
    const service = new ParkingService();
    service.updateSlotStatus('F1-S01', 'maintenance');
    assert.equal(service.getSlot('F1-S01')?.status, 'maintenance');

    service.resetToDemo();
    assert.equal(service.getSlot('F1-S01')?.status, 'vacant');
  });
});
