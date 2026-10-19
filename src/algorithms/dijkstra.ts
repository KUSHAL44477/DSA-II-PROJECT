import { Graph } from './graph.js';
import { MinHeap } from './minHeap.js';
import { DijkstraResult } from '../types/parking.js';

interface HeapEntry {
  nodeId: string;
  distance: number;
}

/**
 * Dijkstra's Shortest Path Algorithm using a custom Binary Min-Heap.
 *
 * Computes optimal path costs from a starting node (such as an entrance gate)
 * to all reachable nodes across indoor parking aisle networks.
 *
 * Time Complexity: O((V + E) log V) where V = nodes, E = aisle segments.
 * Space Complexity: O(V) for distance table, predecessor map, and min-heap.
 */
export class Dijkstra {
  /**
   * Executes Dijkstra's algorithm from startNodeId across graph.
   */
  public static compute(graph: Graph, startNodeId: string): DijkstraResult {
    if (!graph.hasNode(startNodeId)) {
      throw new Error(`Start node '${startNodeId}' does not exist in the graph.`);
    }

    const distances = new Map<string, number>();
    const predecessors = new Map<string, string | null>();
    const visited = new Set<string>();
    const visitedOrder: string[] = [];

    // Initialize distances to infinity and predecessors to null
    for (const node of graph.getAllNodes()) {
      distances.set(node.id, Infinity);
      predecessors.set(node.id, null);
    }

    distances.set(startNodeId, 0);

    // Min-heap prioritizes entries with smaller distance
    const minHeap = new MinHeap<HeapEntry>((a, b) => a.distance - b.distance);
    minHeap.insert({ nodeId: startNodeId, distance: 0 });

    while (!minHeap.isEmpty()) {
      const current = minHeap.extractMin();
      if (!current) break;

      const { nodeId: u, distance: currentDist } = current;

      // Skip stale heap entries if we already discovered a shorter path
      if (visited.has(u)) continue;
      visited.add(u);
      visitedOrder.push(u);

      // Relax outgoing edges
      const edges = graph.getOutgoingEdges(u);
      for (const edge of edges) {
        const v = edge.to;
        if (visited.has(v)) continue;

        const newDist = currentDist + edge.weight;
        const recordedDist = distances.get(v) ?? Infinity;

        if (newDist < recordedDist) {
          distances.set(v, newDist);
          predecessors.set(v, u);
          minHeap.insert({ nodeId: v, distance: newDist });
        }
      }
    }

    return {
      startNodeId,
      distances,
      predecessors,
      visitedOrder,
    };
  }

  /**
   * Reconstructs the exact path from startNodeId to targetNodeId using predecessor pointers.
   * Returns null if targetNodeId is unreachable.
   */
  public static reconstructPath(
    predecessors: Map<string, string | null>,
    startNodeId: string,
    targetNodeId: string
  ): string[] | null {
    if (startNodeId === targetNodeId) {
      return [startNodeId];
    }

    const path: string[] = [];
    let curr: string | null = targetNodeId;

    while (curr !== null) {
      path.push(curr);
      if (curr === startNodeId) break;
      curr = predecessors.get(curr) ?? null;
    }

    // If path does not start with startNodeId, target is unreachable
    if (path[path.length - 1] !== startNodeId) {
      return null;
    }

    // Path was built backwards from target -> start, reverse to get start -> target
    return path.reverse();
  }
}
