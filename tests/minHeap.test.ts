import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MinHeap } from '../src/algorithms/minHeap.js';

describe('Binary Min-Heap Priority Queue', () => {
  it('should initialize empty with size 0 and peek returning undefined', () => {
    const heap = new MinHeap<number>();
    assert.equal(heap.isEmpty(), true);
    assert.equal(heap.size(), 0);
    assert.equal(heap.peek(), undefined);
    assert.equal(heap.extractMin(), undefined);
  });

  it('should maintain min-heap property on arbitrary insertions', () => {
    const heap = new MinHeap<number>();
    const values = [50, 30, 20, 15, 10, 8, 16];
    values.forEach((v) => heap.insert(v));

    assert.equal(heap.size(), values.length);
    assert.equal(heap.peek(), 8);

    const extracted: number[] = [];
    while (!heap.isEmpty()) {
      extracted.push(heap.extractMin()!);
    }

    assert.deepEqual(extracted, [8, 10, 15, 16, 20, 30, 50]);
  });

  it('should work with custom objects and comparator', () => {
    interface Task {
      id: string;
      cost: number;
    }

    const heap = new MinHeap<Task>((a, b) => a.cost - b.cost);
    heap.insert({ id: 'task-3', cost: 100 });
    heap.insert({ id: 'task-1', cost: 20 });
    heap.insert({ id: 'task-2', cost: 50 });

    assert.equal(heap.peek()?.id, 'task-1');

    const first = heap.extractMin();
    assert.equal(first?.id, 'task-1');
    assert.equal(first?.cost, 20);

    const second = heap.extractMin();
    assert.equal(second?.id, 'task-2');

    const third = heap.extractMin();
    assert.equal(third?.id, 'task-3');
    assert.equal(heap.isEmpty(), true);
  });

  it('should correctly handle decreaseKey/update', () => {
    interface NodeCost {
      nodeId: string;
      dist: number;
    }

    const heap = new MinHeap<NodeCost>((a, b) => a.dist - b.dist);
    heap.insert({ nodeId: 'A', dist: 50 });
    heap.insert({ nodeId: 'B', dist: 70 });
    heap.insert({ nodeId: 'C', dist: 90 });

    assert.equal(heap.peek()?.nodeId, 'A');

    // Decrease B from 70 to 10
    const updated = heap.update((item) => item.nodeId === 'B', { nodeId: 'B', dist: 10 });
    assert.equal(updated, true);
    assert.equal(heap.peek()?.nodeId, 'B');
    assert.equal(heap.peek()?.dist, 10);
  });
});
