# Nearest Parking Slot Finder — DSA-II Academic Core Engine

**Domain:** Smart Transportation and Indoor Urban Navigation  
**Course Alignment:** Data Structures and Algorithms II (DSA-II)  
**Author:** Kushal Maurya  
**Architecture:** Modular TypeScript Core Engine (Algorithmic Backbone & Verification Suite)

---

## 📌 Executive Summary

The **Nearest Parking Slot Finder** solves the indoor vehicular routing and parking bay allocation problem using real data structures and graph algorithms. Unlike trivial systems that calculate proximity using straight-line Euclidean distance, this system models the physical parking facility as a **weighted directed graph** where edges represent drivable aisle segments with physical constraints such as **one-way traffic corridors**, multi-floor driving ramps, and turn penalties.

The system dynamically selects the nearest reachable vacant parking bay from any entrance gate using **Dijkstra's Shortest Path Algorithm** backed by a custom **Binary Min-Heap Priority Queue**. It indexes bays in parallel using **Binary Search Trees (BST)** and **Self-Balancing AVL Trees** for logarithmic lookup and status updates, and demonstrates a **Double-Threaded Binary Search Tree** for $O(1)$ auxiliary space traversal.

> **Note on Architecture:** As per project instructions, the core algorithmic layer, domain data models, state manager, and comprehensive automated test suites are implemented in this repository. The user-interface layer remains completely decoupled.

---

## 🏗️ Implemented Data Structures & Algorithms

### 1. Weighted Graph (Adjacency List)
* **File:** [`src/algorithms/graph.ts`](file:///c:/Users/maury/Downloads/UE5/DSA/src/algorithms/graph.ts)
* **Representation:** Adjacency List using `Map<string, GraphEdge[]>`.
* **Directionality:** Supports both bidirectional aisles and strictly directed edges (one-way aisles).
* **Validation:** Rejects negative edge weights; verifies path continuity and calculates exact cumulative route cost.

### 2. Binary Min-Heap Priority Queue
* **File:** [`src/algorithms/minHeap.ts`](file:///c:/Users/maury/Downloads/UE5/DSA/src/algorithms/minHeap.ts)
* **Implementation:** Array-based binary heap with parent-child index arithmetic (`parent = (i-1)/2`, `left = 2i+1`, `right = 2i+2`).
* **Operations:**
  * `insert(item)`: Sifts up in $O(\log N)$
  * `extractMin()`: Swaps root with tail, pops, and sifts down in $O(\log N)$
  * `peek()`: Returns root element in $O(1)$
  * `update(predicate, item)`: Decreases or updates key in $O(N)$ lookup + $O(\log N)$ heapify

### 3. Dijkstra's Shortest Path Algorithm
* **File:** [`src/algorithms/dijkstra.ts`](file:///c:/Users/maury/Downloads/UE5/DSA/src/algorithms/dijkstra.ts)
* **Frontier:** Uses the custom `MinHeap` for optimal frontier vertex extraction.
* **Outputs:** Distance map and predecessor map.
* **Path Reconstruction:** Reconstructs the exact sequence of graph nodes traversed from start gate to target bay access node.
* **Time Complexity:** $O((V + E) \log V)$ using binary heap.

### 4. Breadth-First Search (BFS)
* **File:** [`src/algorithms/bfs.ts`](file:///c:/Users/maury/Downloads/UE5/DSA/src/algorithms/bfs.ts)
* **Purpose:** Demonstrates unweighted graph exploration where distance is measured strictly in edge hops (turns/intersections).
* **Pedagogical Value:** Demonstrates why Dijkstra is strictly necessary over BFS when aisle segments have variable physical lengths or one-way detour penalties.

### 5. Binary Search Tree (BST)
* **File:** [`src/algorithms/binarySearchTree.ts`](file:///c:/Users/maury/Downloads/UE5/DSA/src/algorithms/binarySearchTree.ts)
* **Indexing:** Indexed by alphanumeric slot ID (e.g. `F1-S01`, `F2-E01`).
* **Deletion:** Complete textbook implementation of all 3 deletion cases:
  1. *Case 1 (Leaf):* Node removed directly.
  2. *Case 2 (One Child):* Node replaced by its single child.
  3. *Case 3 (Two Children):* Node replaced by its in-order successor (minimum in right subtree), with recursive successor deletion.
* **Traversals:** In-Order (sorted order), Pre-Order, and Post-Order.

### 6. Self-Balancing AVL Tree
* **File:** [`src/algorithms/avlTree.ts`](file:///c:/Users/maury/Downloads/UE5/DSA/src/algorithms/avlTree.ts)
* **Invariant:** Strict height-balance invariant: for every node, $|height(left) - height(right)| \le 1$.
* **Rotations:** Full implementations of all 4 rotation cases:
  * **LL (Left-Left):** Single Right Rotation
  * **RR (Right-Right):** Single Left Rotation
  * **LR (Left-Right):** Double Rotation (Left rotate child, Right rotate node)
  * **RL (Right-Left):** Double Rotation (Right rotate child, Left rotate node)
* **Verification:** `isBalanced()` method checks that balance factor $\in \{-1, 0, 1\}$ at every node and subtree.

### 7. Double-Threaded Binary Search Tree
* **File:** [`src/algorithms/threadedBinaryTree.ts`](file:///c:/Users/maury/Downloads/UE5/DSA/src/algorithms/threadedBinaryTree.ts)
* **Implementation:** Real thread flags (`isLeftThread`, `isRightThread`) and pointers.
* **Stackless Traversal:** In-order traversal executes in $O(N)$ time with **$O(1)$ auxiliary space**, requiring neither function recursion nor a stack data structure.

---

## 📊 Algorithmic Complexity Reference

| Structure / Algorithm | Operation | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Binary Min-Heap** | Peek | $O(1)$ | $O(1)$ | $O(1)$ | $O(N)$ |
| | Insert | $O(1)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ |
| | Extract-Min | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ |
| **Dijkstra's Algorithm** | Shortest Path | $O((V + E) \log V)$ | $O((V + E) \log V)$ | $O((V + E) \log V)$ | $O(V)$ |
| **BFS** | Shortest Hops | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ | $O(V)$ |
| **Binary Search Tree** | Search / Insert | $O(1)$ | $O(\log N)$ | $O(N)$ | $O(N)$ |
| | Delete | $O(1)$ | $O(\log N)$ | $O(N)$ | $O(N)$ |
| **AVL Tree** | Search / Insert / Delete | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ |
| | Rotations | $O(1)$ | $O(1)$ | $O(1)$ | $O(1)$ |
| **Threaded Binary Tree**| In-Order Traversal | $O(N)$ | $O(N)$ | $O(N)$ | **$O(1)$ auxiliary** |

---

## 🏢 Facility Topology & Demo Data

The demo dataset models a 2-floor commercial parking structure:
- **Floor 1 (Ground Floor):**
  - `Gate A`: North Main Entrance (`N_GATE_A`)
  - `Gate B`: East Entrance (`N_GATE_B`)
  - **One-Way Aisle:** Aisle `ACC_F1_04` is strictly Northbound. A car entering Gate A must take a multi-aisle loop around the perimeter to enter this bay, proving that route cost differs significantly from straight-line Euclidean distance.
- **Floor 2 (Upper Deck):**
  - `Gate C`: West Ramp Entrance (`N_GATE_C`)
  - Connected to Floor 1 via driving ramp (`F1_RAMP <-> F2_RAMP`, weight: 45m).
- **Slot Types:**
  - `standard`: Regular passenger vehicles (e.g. `F1-S01`, `F2-S01`).
  - `ev`: Electric vehicle charging stations (e.g. `F1-E01`, `F2-E01`).
  - `accessible`: Disability-designated bays with wider clearance (e.g. `F1-A01`, `F2-A01`).
- **Slot States:** `vacant`, `occupied`, `reserved`, `maintenance`.

---

## 🚀 Getting Started & Execution

### Prerequisites
- Node.js (v18+ or v24+ recommended)
- npm

### Installation
```bash
npm install
```

### Run Automated Tests (35 Tests Across 8 Suites)
```bash
npm test
```

### Run Type Checking
```bash
npm run typecheck
```

### Run the Interactive Academic Demonstration CLI
```bash
npm run demo
```

### Compile TypeScript to JavaScript (`dist/`)
```bash
npm run build
```

---

## 🧪 Automated Test Verification

All 35 unit and integration tests execute and pass:

```text
▶ Self-Balancing AVL Tree
  ✔ should trigger Left-Left (LL) Right Rotation
  ✔ should trigger Right-Right (RR) Left Rotation
  ✔ should trigger Left-Right (LR) Double Rotation
  ✔ should trigger Right-Left (RL) Double Rotation
  ✔ should maintain AVL balance invariant on large sequential insertions
  ✔ should rebalance correctly upon deletion
✔ Self-Balancing AVL Tree

▶ Breadth-First Search (BFS)
  ✔ should calculate unweighted hop distance correctly
  ✔ should mark disconnected nodes as Infinity hops
✔ Breadth-First Search (BFS)

▶ Binary Search Tree (BST)
  ✔ should insert and search keys correctly
  ✔ should handle all three deletion cases properly
  ✔ should perform in-order, pre-order, and post-order traversals
✔ Binary Search Tree (BST)

▶ Dijkstra Shortest Path Algorithm
  ✔ should find optimal path on a simple diamond graph
  ✔ should enforce one-way restrictions and not allow backward traversal
  ✔ should demonstrate that driving path differs from Euclidean distance when aisles require detour
  ✔ should handle unreachable destination in disconnected component
✔ Dijkstra Shortest Path Algorithm

▶ Weighted Graph (Adjacency List)
  ✔ should add nodes and prevent duplicates
  ✔ should support bidirectional edges by default
  ✔ should support directed one-way edges
  ✔ should reject negative weights
  ✔ should calculate path costs along sequence of nodes
✔ Weighted Graph (Adjacency List)

▶ Binary Min-Heap Priority Queue
  ✔ should initialize empty with size 0 and peek returning undefined
  ✔ should maintain min-heap property on arbitrary insertions
  ✔ should work with custom objects and comparator
  ✔ should correctly handle decreaseKey/update
✔ Binary Min-Heap Priority Queue

▶ ParkingService & Slot Recommendation Engine
  ✔ should initialize with accurate facility occupancy metrics
  ✔ should recommend nearest vacant slot from Gate A based on graph driving cost
  ✔ should dynamically exclude newly occupied bays upon status update
  ✔ should filter strictly by EV slot type when requested
  ✔ should filter strictly by Accessible slot type when requested
  ✔ should return found: false when all bays are occupied or under maintenance
  ✔ should synchronize updates across BST and AVL Tree indexes
  ✔ should reset to default demo state
✔ ParkingService & Slot Recommendation Engine

▶ Double-Threaded Binary Search Tree
  ✔ should initialize empty and handle insertions
  ✔ should correctly set thread pointers and flags
  ✔ should perform stackless in-order traversal across diverse keys
✔ Double-Threaded Binary Search Tree

ℹ tests 35
ℹ suites 8
ℹ pass 35
ℹ fail 0
```

---

## 📂 Repository File Structure

```text
.
├── Nearest_Parking_Slot_Finder_Prompt_Pack.md  # Original prompt specifications
├── package.json                               # Scripts and dependencies
├── tsconfig.json                              # TypeScript strict configuration
├── .gitignore                                 # Git ignore patterns (node_modules, dist)
├── README.md                                  # Academic documentation
├── src/
│   ├── index.ts                               # Central library exports
│   ├── demo.ts                                # Academic CLI demo runner
│   ├── types/
│   │   └── parking.ts                         # Domain and graph type definitions
│   ├── algorithms/
│   │   ├── graph.ts                           # Weighted Graph (Adjacency List)
│   │   ├── minHeap.ts                         # Binary Min-Heap Priority Queue
│   │   ├── dijkstra.ts                        # Dijkstra with Min-Heap & Path Reconstruction
│   │   ├── bfs.ts                             # Breadth-First Search (Unweighted Hops)
│   │   ├── binarySearchTree.ts                # BST with 3-case deletion & traversals
│   │   ├── avlTree.ts                         # Self-balancing AVL Tree (LL, RR, LR, RL)
│   │   ├── threadedBinaryTree.ts              # Double-Threaded Tree ($O(1)$ space traversal)
│   │   └── traversals.ts                      # Generic tree traversal utilities
│   ├── data/
│   │   ├── parkingLayout.ts                   # Multi-floor graph nodes, gates, edges
│   │   └── demoSlots.ts                       # Parking bays with varied types and states
│   └── services/
│       └── parkingService.ts                  # Authoritative slot store and recommendation engine
└── tests/
    ├── minHeap.test.ts                        # Heap order, extraction, and update tests
    ├── graph.test.ts                          # Adjacency, one-way aisles, and validation tests
    ├── dijkstra.test.ts                       # Shortest path, one-way enforcement, and detour tests
    ├── bfs.test.ts                            # Unweighted hop exploration tests
    ├── binarySearchTree.test.ts               # BST insert, search, 3-case deletion, and traversals
    ├── avlTree.test.ts                        # AVL rotations, height balance, and deletions
    ├── threadedBinaryTree.test.ts             # Thread flags, pointers, and stackless traversals
    └── parkingService.test.ts                 # End-to-end recommendation, filters, and state sync
```
