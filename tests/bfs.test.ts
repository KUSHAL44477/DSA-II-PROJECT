import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Graph } from '../src/algorithms/graph.js';
import { BFS } from '../src/algorithms/bfs.js';

describe('Breadth-First Search (BFS)', () => {
  it('should calculate unweighted hop distance correctly', () => {
    const graph = new Graph();
    ['A', 'B', 'C', 'D', 'E'].forEach((id) => {
      graph.addNode({ id, floor: 1, type: 'aisle_intersection', coordinates: { x: 0, y: 0 } });
    });

    // A -> B -> C (2 hops)
    // A -> D -> E -> C (3 hops)
    graph.addEdge('A', 'B', 100);
    graph.addEdge('B', 'C', 100);
    graph.addEdge('A', 'D', 1);
    graph.addEdge('D', 'E', 1);
    graph.addEdge('E', 'C', 1);

    const result = BFS.compute(graph, 'A');
    assert.equal(result.distancesInHops.get('C'), 2);

    const path = BFS.reconstructPath(result.predecessors, 'A', 'C');
    assert.deepEqual(path, ['A', 'B', 'C']);
  });

  it('should mark disconnected nodes as Infinity hops', () => {
    const graph = new Graph();
    graph.addNode({ id: 'Start', floor: 1, type: 'gate', coordinates: { x: 0, y: 0 } });
    graph.addNode({ id: 'Unreachable', floor: 1, type: 'gate', coordinates: { x: 10, y: 10 } });

    const result = BFS.compute(graph, 'Start');
    assert.equal(result.distancesInHops.get('Unreachable'), Infinity);
    assert.equal(BFS.reconstructPath(result.predecessors, 'Start', 'Unreachable'), null);
  });
});
