import { Graph } from './graph.js';
import { BFSResult } from '../types/parking.js';

/**
 * Breadth-First Search (BFS) for unweighted shortest paths.
 *
 * Demonstrates unweighted graph exploration where distance is measured
 * strictly in edge hops (number of intersections/turns traversed).
 *
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export class BFS {
  public static compute(graph: Graph, startNodeId: string): BFSResult {
    if (!graph.hasNode(startNodeId)) {
      throw new Error(`Start node '${startNodeId}' does not exist in the graph.`);
    }

    const distancesInHops = new Map<string, number>();
    const predecessors = new Map<string, string | null>();
    const visited = new Set<string>();
    const visitedOrder: string[] = [];

    for (const node of graph.getAllNodes()) {
      distancesInHops.set(node.id, Infinity);
      predecessors.set(node.id, null);
    }

    const queue: string[] = [];

    distancesInHops.set(startNodeId, 0);
    visited.add(startNodeId);
    queue.push(startNodeId);

    while (queue.length > 0) {
      const u = queue.shift()!;
      visitedOrder.push(u);
      const currentHops = distancesInHops.get(u)!;

      const edges = graph.getOutgoingEdges(u);
      for (const edge of edges) {
        const v = edge.to;
        if (!visited.has(v)) {
          visited.add(v);
          distancesInHops.set(v, currentHops + 1);
          predecessors.set(v, u);
          queue.push(v);
        }
      }
    }

    return {
      startNodeId,
      distancesInHops,
      predecessors,
      visitedOrder,
    };
  }

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

    if (path[path.length - 1] !== startNodeId) {
      return null;
    }

    return path.reverse();
  }
}
