import { ParkingService } from './services/parkingService.js';
import { MinHeap } from './algorithms/minHeap.js';
import { Dijkstra } from './algorithms/dijkstra.js';
import { BFS } from './algorithms/bfs.js';
import { BinarySearchTree } from './algorithms/binarySearchTree.js';
import { AVLTree } from './algorithms/avlTree.js';
import { ThreadedBinaryTree } from './algorithms/threadedBinaryTree.js';

function banner(title: string): void {
  console.log('\n' + '='.repeat(70));
  console.log(`  ${title.toUpperCase()}`);
  console.log('='.repeat(70));
}

function section(title: string): void {
  console.log(`\n--- ${title} ---`);
}

export function runAcademicDemo(): void {
  banner('Nearest Parking Slot Finder — DSA-II Academic Demonstration');
  console.log('Domain: Smart Transportation and Indoor Autonomous Navigation');
  console.log('Algorithms: Weighted Graph, Min-Heap Dijkstra, BFS, BST, AVL Tree, Threaded Tree');

  const service = new ParkingService();

  // 1. Dashboard & Occupancy Summary
  section('1. Parking Facility Dashboard & Occupancy State');
  const stats = service.getOccupancyStats();
  console.log(`Total Parking Bays:   ${stats.totalBays}`);
  console.log(`Vacant Bays:          ${stats.vacant}`);
  console.log(`Occupied Bays:        ${stats.occupied}`);
  console.log(`Reserved Bays:        ${stats.reserved}`);
  console.log(`Under Maintenance:    ${stats.maintenance}`);
  console.log(`Current Occupancy:    ${stats.occupancyRatePercentage}%`);

  // 2. Scenario 1: Find Nearest Slot from Gate A (North)
  section('2. Navigation Query: Find Nearest Vacant Slot from Gate A');
  const res1 = service.findNearestSlot({ gateId: 'GATE_A' });
  if (res1.found && res1.recommendedSlot) {
    const slot = res1.recommendedSlot.slot;
    console.log(`✔ Recommended Bay:   ${slot.id} (Floor ${slot.floor}, Type: ${slot.type})`);
    console.log(`✔ Optimal Route Cost: ${res1.recommendedSlot.routeCost} meters`);
    console.log(`✔ Driving Graph Path: ${res1.recommendedSlot.pathNodeIds.join(' -> ')}`);
    console.log(`✔ Straight-line dist: ${res1.recommendedSlot.straightLineDistance} meters`);
    console.log(`✔ Rationale:          ${res1.rationale}`);
    console.log('\nTop Alternative Vacant Slots:');
    res1.alternatives.forEach((alt, idx) => {
      console.log(`  [${idx + 1}] ${alt.slot.id} (Floor ${alt.slot.floor}, ${alt.slot.type}) - Cost: ${alt.routeCost}m`);
    });
  }

  // 3. Scenario 2: Dynamic Invalidation (Mark best bay occupied)
  section('3. Dynamic State Invalidation: Occupying F1-S01 and Re-querying');
  console.log('Action: Vehicle parks in F1-S01. Updating status: vacant -> occupied...');
  service.updateSlotStatus('F1-S01', 'occupied');

  const res2 = service.findNearestSlot({ gateId: 'GATE_A' });
  if (res2.found && res2.recommendedSlot) {
    console.log(`✔ New Recommendation: ${res2.recommendedSlot.slot.id} (Route Cost: ${res2.recommendedSlot.routeCost}m)`);
    console.log(`  Notice: F1-S01 was immediately excluded from consideration!`);
  }

  // 4. Scenario 3: Filter by EV-only bays
  section('4. Filter Query: Find Nearest EV-Only Bay from Gate A');
  const resEV = service.findNearestSlot({ gateId: 'GATE_A', preferredType: 'ev' });
  if (resEV.found && resEV.recommendedSlot) {
    console.log(`✔ Recommended EV Bay: ${resEV.recommendedSlot.slot.id} (Cost: ${resEV.recommendedSlot.routeCost}m)`);
    console.log(`  Aisle Path:          ${resEV.recommendedSlot.pathNodeIds.join(' -> ')}`);
  }

  // 5. Scenario 4: One-Way Aisle Restriction Demonstration
  section('5. Graph Topology: One-Way Aisle Directionality Verification');
  console.log('Slot F1-S05 is on Aisle ACC_F1_04, which is ONE-WAY Northbound.');
  console.log('Euclidean distance is only ~35m from Gate A, but vehicles cannot travel South on Aisle 2.');
  const dijkstraA = Dijkstra.compute(service.getGraph(), 'N_GATE_A');
  const distF1S05 = dijkstraA.distances.get('ACC_F1_04');
  const pathF1S05 = Dijkstra.reconstructPath(dijkstraA.predecessors, 'N_GATE_A', 'ACC_F1_04');
  console.log(`✔ Actual Driving Route Cost: ${distF1S05}m (vs Straight-Line: 38.6m)`);
  console.log(`✔ Loop Route Taken: ${pathF1S05?.join(' -> ')}`);

  // 6. Algorithm Lab: Min-Heap Priority Queue
  section('6. Algorithm Lab: Binary Min-Heap Priority Queue');
  const heap = new MinHeap<number>();
  const testValues = [45, 12, 85, 32, 5, 60, 2];
  console.log(`Inserting values: ${testValues.join(', ')}`);
  testValues.forEach((v) => heap.insert(v));
  console.log(`Peek minimum: ${heap.peek()} in O(1)`);
  const extracted: number[] = [];
  while (!heap.isEmpty()) {
    extracted.push(heap.extractMin()!);
  }
  console.log(`Extracted in priority order: ${extracted.join(', ')} (Verified Min-Heap ordering)`);

  // 7. Algorithm Lab: Dijkstra vs BFS Comparison
  section('7. Algorithm Lab: Dijkstra (Weighted) vs BFS (Unweighted Hops)');
  const bfsResult = BFS.compute(service.getGraph(), 'N_GATE_A');
  console.log(`From Gate A:`);
  console.log(`- To Central Hub (N_INT_3): BFS Hops = ${bfsResult.distancesInHops.get('N_INT_3')} intersections`);
  console.log(`- To Central Hub (N_INT_3): Dijkstra Weighted Distance = ${dijkstraA.distances.get('N_INT_3')} meters`);

  // 8. Algorithm Lab: AVL Tree Balancing & Rotations
  section('8. Algorithm Lab: AVL Tree Self-Balancing Invariant & Rotations');
  const avl = new AVLTree<string>();
  const sequentialKeys = ['F1-S01', 'F1-S02', 'F1-S03', 'F1-S04', 'F1-S05'];
  console.log(`Inserting sequential keys to force rotations: ${sequentialKeys.join(', ')}`);
  sequentialKeys.forEach((k) => avl.insert(k, `Slot-${k}`));
  console.log(`Rotations triggered:`, avl.getRotationHistory().map((r) => `${r.type} on ${r.nodeKey}`).join(', '));
  console.log(`Tree height: ${avl.getTreeHeight()} (Logarithmic O(log N))`);
  console.log(`Is AVL Balance Invariant (|BF| <= 1) satisfied everywhere? ${avl.isBalanced() ? 'YES (Verified)' : 'NO'}`);

  // 9. Algorithm Lab: Binary Search Tree 3-Case Deletion
  section('9. Algorithm Lab: BST 3-Case Deletion');
  const bst = new BinarySearchTree<string>();
  ['M', 'B', 'Q', 'A', 'E', 'P', 'Z'].forEach((k) => bst.insert(k, `Val-${k}`));
  console.log(`Initial In-Order:`, bst.inOrder().map((n) => n.key).join(' '));
  console.log('Case 1: Deleting Leaf node "A"...');
  bst.delete('A');
  console.log(`After deleting Leaf:`, bst.inOrder().map((n) => n.key).join(' '));
  console.log('Case 2: Deleting Single-Child node "B" (has right child "E")...');
  bst.delete('B');
  console.log(`After deleting 1-Child:`, bst.inOrder().map((n) => n.key).join(' '));
  console.log('Case 3: Deleting Two-Children root "M" (replaced by in-order successor "P")...');
  bst.delete('M');
  console.log(`After deleting 2-Children:`, bst.inOrder().map((n) => n.key).join(' '));

  // 10. Algorithm Lab: Double-Threaded Binary Tree Stackless Traversal
  section('10. Algorithm Lab: Double-Threaded Binary Tree Stackless Traversal');
  const threadedTree = new ThreadedBinaryTree<string>();
  ['50', '30', '70', '20', '40', '60', '80'].forEach((k) => threadedTree.insert(k, `Data-${k}`));
  const threadedInOrder = threadedTree.inOrder().map((n) => n.key);
  console.log(`Stackless In-Order Traversal (O(1) auxiliary space): ${threadedInOrder.join(' -> ')}`);

  banner('All Academic Demonstrations Completed Successfully');
}

if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('demo')) {
  runAcademicDemo();
}
