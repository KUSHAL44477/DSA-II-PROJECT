import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Graph } from '../src/algorithms/graph.js';

describe('Weighted Graph (Adjacency List)', () => {
  it('should add nodes and prevent duplicates', () => {
    const graph = new Graph();
    graph.addNode({ id: 'N1', floor: 1, type: 'gate', coordinates: { x: 0, y: 0 } });
    graph.addNode({ id: 'N1', floor: 1, type: 'gate', coordinates: { x: 0, y: 0 } });

    assert.equal(graph.getNodeCount(), 1);
    assert.equal(graph.hasNode('N1'), true);
    assert.equal(graph.hasNode('N2'), false);
  });

  it('should support bidirectional edges by default', () => {
    const graph = new Graph();
    graph.addNode({ id: 'A', floor: 1, type: 'aisle_intersection', coordinates: { x: 0, y: 0 } });
    graph.addNode({ id: 'B', floor: 1, type: 'aisle_intersection', coordinates: { x: 10, y: 0 } });

    graph.addEdge('A', 'B', 15, false);

    const outA = graph.getOutgoingEdges('A');
    const outB = graph.getOutgoingEdges('B');

    assert.equal(outA.length, 1);
    assert.equal(outA[0].to, 'B');
    assert.equal(outA[0].weight, 15);

    assert.equal(outB.length, 1);
    assert.equal(outB[0].to, 'A');
    assert.equal(outB[0].weight, 15);
  });

  it('should support directed one-way edges', () => {
    const graph = new Graph();
    graph.addNode({ id: 'A', floor: 1, type: 'aisle_intersection', coordinates: { x: 0, y: 0 } });
    graph.addNode({ id: 'B', floor: 1, type: 'aisle_intersection', coordinates: { x: 10, y: 0 } });

    // A -> B is one-way
    graph.addEdge('A', 'B', 20, true);

    const outA = graph.getOutgoingEdges('A');
    const outB = graph.getOutgoingEdges('B');

    assert.equal(outA.length, 1);
    assert.equal(outA[0].to, 'B');

    // B has no outgoing edge back to A
    assert.equal(outB.length, 0);
  });

  it('should reject negative weights', () => {
    const graph = new Graph();
    graph.addNode({ id: 'A', floor: 1, type: 'aisle_intersection', coordinates: { x: 0, y: 0 } });
    graph.addNode({ id: 'B', floor: 1, type: 'aisle_intersection', coordinates: { x: 10, y: 0 } });

    assert.throws(() => {
      graph.addEdge('A', 'B', -5);
    }, /Negative edge weights are not permitted/);
  });

  it('should calculate path costs along sequence of nodes', () => {
    const graph = new Graph();
    ['A', 'B', 'C'].forEach((id, idx) => {
      graph.addNode({ id, floor: 1, type: 'aisle_intersection', coordinates: { x: idx * 10, y: 0 } });
    });
    graph.addEdge('A', 'B', 12);
    graph.addEdge('B', 'C', 18);

    assert.equal(graph.calculatePathCost(['A', 'B', 'C']), 30);
  });
});
