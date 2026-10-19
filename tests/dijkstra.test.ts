import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Graph } from '../src/algorithms/graph.js';
import { Dijkstra } from '../src/algorithms/dijkstra.js';

describe('Dijkstra Shortest Path Algorithm', () => {
  it('should find optimal path on a simple diamond graph', () => {
    // S -> A (weight 10), S -> B (weight 1)
    // B -> A (weight 2), A -> D (weight 5), B -> D (weight 20)
    // Shortest S -> D: S -> B -> A -> D = 1 + 2 + 5 = 8 (better than S -> A -> D = 15 or S -> B -> D = 21)
    const graph = new Graph();
    ['S', 'A', 'B', 'D'].forEach((id) => {
      graph.addNode({ id, floor: 1, type: 'aisle_intersection', coordinates: { x: 0, y: 0 } });
    });

    graph.addEdge('S', 'A', 10, true);
    graph.addEdge('S', 'B', 1, true);
    graph.addEdge('B', 'A', 2, true);
    graph.addEdge('A', 'D', 5, true);
    graph.addEdge('B', 'D', 20, true);

    const result = Dijkstra.compute(graph, 'S');
    assert.equal(result.distances.get('D'), 8);

    const path = Dijkstra.reconstructPath(result.predecessors, 'S', 'D');
    assert.deepEqual(path, ['S', 'B', 'A', 'D']);
  });

  it('should enforce one-way restrictions and not allow backward traversal', () => {
    const graph = new Graph();
    ['Gate', 'Aisle1', 'Aisle2'].forEach((id) => {
      graph.addNode({ id, floor: 1, type: 'aisle_intersection', coordinates: { x: 0, y: 0 } });
    });

    // Gate -> Aisle1 is bidirectional
    graph.addEdge('Gate', 'Aisle1', 10, false);
    // Aisle2 -> Aisle1 is ONE-WAY (Aisle2 to Aisle1 only)
    graph.addEdge('Aisle2', 'Aisle1', 15, true);

    const fromGate = Dijkstra.compute(graph, 'Gate');
    // Cannot reach Aisle2 because the only edge points into Aisle1
    assert.equal(fromGate.distances.get('Aisle2'), Infinity);

    const path = Dijkstra.reconstructPath(fromGate.predecessors, 'Gate', 'Aisle2');
    assert.equal(path, null);

    // Starting at Aisle2 CAN reach Gate
    const fromAisle2 = Dijkstra.compute(graph, 'Aisle2');
    assert.equal(fromAisle2.distances.get('Gate'), 25);
    const pathFromAisle2 = Dijkstra.reconstructPath(fromAisle2.predecessors, 'Aisle2', 'Gate');
    assert.deepEqual(pathFromAisle2, ['Aisle2', 'Aisle1', 'Gate']);
  });

  it('should demonstrate that driving path differs from Euclidean distance when aisles require detour', () => {
    const graph = new Graph();
    // Wall between Start (0, 0) and Slot (10, 0)
    // Euclidean distance is 10.
    // Driving route must go through intersection (0, 50) and (10, 50): total 50 + 10 + 50 = 110.
    graph.addNode({ id: 'Start', floor: 1, type: 'gate', coordinates: { x: 0, y: 0 } });
    graph.addNode({ id: 'Hub1', floor: 1, type: 'aisle_intersection', coordinates: { x: 0, y: 50 } });
    graph.addNode({ id: 'Hub2', floor: 1, type: 'aisle_intersection', coordinates: { x: 10, y: 50 } });
    graph.addNode({ id: 'Slot', floor: 1, type: 'slot_access', coordinates: { x: 10, y: 0 } });

    graph.addEdge('Start', 'Hub1', 50);
    graph.addEdge('Hub1', 'Hub2', 10);
    graph.addEdge('Hub2', 'Slot', 50);

    const result = Dijkstra.compute(graph, 'Start');
    const drivingCost = result.distances.get('Slot')!;
    const straightLine = graph.getEuclideanDistance('Start', 'Slot');

    assert.equal(drivingCost, 110);
    assert.equal(straightLine, 10);
    assert.ok(drivingCost > straightLine);
  });

  it('should handle unreachable destination in disconnected component', () => {
    const graph = new Graph();
    graph.addNode({ id: 'A', floor: 1, type: 'gate', coordinates: { x: 0, y: 0 } });
    graph.addNode({ id: 'Isolated', floor: 1, type: 'slot_access', coordinates: { x: 100, y: 100 } });

    const result = Dijkstra.compute(graph, 'A');
    assert.equal(result.distances.get('Isolated'), Infinity);
    assert.equal(Dijkstra.reconstructPath(result.predecessors, 'A', 'Isolated'), null);
  });
});
