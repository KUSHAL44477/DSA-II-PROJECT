# Nearest Parking Slot Finder — AI Project Prompt Pack

Use these prompts in Antigravity, Gemini, Cursor, Claude Code, or another coding agent. Run them in order. The project is an academic DSA-II implementation, so algorithms must be real and demonstrable—not UI-only placeholders.

---

## Prompt 1 — Master Project Build

```text
Act as a senior full-stack developer, UI/UX designer, and Data Structures & Algorithms II instructor. Build a complete, runnable academic web project titled:

NEAREST PARKING SLOT FINDER
Domain: Smart Transportation and Urban Navigation
Course alignment: Data Structures and Algorithms II (DSA-II)

FIRST:
1. Inspect the current workspace, package files, and existing code before changing anything.
2. If a project already exists, preserve its stack and working features. Do not overwrite or delete files blindly.
3. If the workspace is empty, use React + TypeScript + Vite, with CSS and SVG for the interactive indoor parking map. Keep the project self-contained and do not require paid APIs or API keys.
4. Create a concise implementation plan, then implement and run the app. Do not stop after generating a plan or static mockup.

CORE OUTCOME:
A polished, responsive, interactive web app that lets a user choose an entrance/gate, inspect a parking facility map, and find a reachable nearest vacant parking slot using actual route costs.

REQUIRED MODULES:
A. Dashboard:
- Total bays, vacant, occupied, reserved, maintenance, and occupancy percentage.
- Clearly label data as simulated/demo data.
- Refresh values from the application state; do not hardcode counters.

B. Slot Finder:
- Choose entry gate/current start point.
- Choose floor and optional bay type (standard, EV, accessible).
- “Find Nearest Slot” button.
- Show recommended bay ID, floor, type, path distance/cost, and route.
- Offer the next few reachable vacant alternatives, sorted by computed route cost.
- Explain why a bay was chosen and show “No reachable vacant slot” when appropriate.

C. Interactive Parking Map (mandatory):
- Build an actual TOP-DOWN PARKING LAYOUT MAP, not only a list of slots and not an ordinary city map.
- Use SVG, Canvas, or a clear grid layout. Render parking bays, driving aisles, intersections, entrance gates, and floor connectors.
- Each bay must be positioned consistently with its layout coordinates and linked to its route-graph node.
- Show a legend and distinct, accessible visual styles for VACANT, OCCUPIED, RESERVED, MAINTENANCE, selected destination, and calculated route.
- Clicking a bay opens a details panel with its ID, floor, type, status, and distance from the selected gate when computed.
- Hover/focus should expose a tooltip. Do not rely on color alone; use labels, symbols, or patterns as well.
- Draw/overlay the computed path from the selected gate to the recommended bay, following aisle segments. The line must correspond to the graph path returned by the algorithm, not a straight line through parked cars or walls.
- Include floor switching and a compact map legend. Keep map controls usable on mobile.
- Add a “Reset route” control.
- Use demo parking layout data stored locally. No Google Maps key or external map service is needed for indoor navigation.

D. DSA-II Algorithm Lab:
- Display the algorithm used, input, result, and relevant complexity.
- Implement working data structures/algorithms: Graph (adjacency list), Dijkstra with a Min-Heap priority queue, BFS for unweighted shortest paths, a Binary Search Tree for basic bay-ID operations, an AVL Tree for balanced bay-ID indexing, and tree traversals.
- Demonstrate single-threaded or double-threaded binary-tree traversal if feasible; if included, implement and test real thread flags/pointers rather than simulating the output.
- Include small sample operations and resulting output so an instructor can verify each data structure.
- Clearly distinguish demo/teaching visualizations from the algorithm actually used to choose the recommended slot.

E. Slot Administration / Simulation:
- Provide controls to mark a slot occupied, vacant, reserved, or under maintenance.
- Update the map, counters, search results, AVL/BST records, and recommendation state together.
- Prevent the recommendation from returning occupied, reserved, maintenance, incompatible, or unreachable bays.
- Include a reset-to-demo-layout action.
- Persist changes in localStorage only if appropriate, with a reset option.

DATA AND ROUTING RULES:
- Keep demo data in typed local JSON/TypeScript objects.
- Model the driving facility as a weighted graph: nodes represent gates, aisle intersections, and slot access points; edges represent traversable aisle segments and their distance/cost.
- Support one-way edges if shown in the layout.
- Connect every rendered bay to a slot-access graph node.
- Use Dijkstra for non-negative weighted edges. Use BFS only for unweighted/equal-cost edges or as a separately demonstrated algorithm.
- Do not choose slots by Euclidean/straight-line distance when the driving path differs.
- Do not claim the full nearest-slot search is O(1). A Min-Heap peek is O(1), while shortest-path calculation has its own cost (typically O((V + E) log V) with a binary heap).
- Handle edge cases: no vacant bays, all candidates incompatible, unreachable slots, invalid gate/floor, equal-distance ties, state changes after route calculation, and one-way aisles.
- Use stable slot IDs and a single source of truth for status.

QUALITY:
- Create a clean, polished academic dashboard, not a generic landing-page mockup.
- Use clear typography, consistent spacing, restrained colors, responsive layout, loading/empty/error states, and keyboard-accessible controls.
- Avoid giant decorative animations that distract from the map.
- Do not add login/auth or backend infrastructure unless the existing project requires it.
- Add a README with setup/run/test commands, architecture, algorithms, data model, limitations, and a short demo script.
- Do not fabricate test results or performance claims.

DEFINITION OF DONE:
1. Install dependencies and run the app.
2. Run tests, fix failures, and report the exact commands/results.
3. Verify that the map renders actual slot and aisle geometry.
4. Verify that clicking “Find Nearest Slot” computes a path, highlights it on the map, and returns the correct nearest eligible vacant bay according to graph cost.
5. Verify that changing a bay's status immediately affects the next recommendation and dashboard counts.
6. Verify that no route is drawn through walls/slots when the graph says otherwise.
7. Ensure there are no dead buttons, placeholder algorithm functions, console errors, or fake hardcoded search results.
8. Summarize created/modified files and provide the exact local run URL.
```

---

## Prompt 2 — Build the Map View and Route Overlay

```text
Work on the existing Nearest Parking Slot Finder codebase. Inspect the current implementation first and preserve its conventions.

Implement the interactive indoor parking map as a real working feature.

MAP REQUIREMENTS:
- Render a top-down multi-row parking facility using SVG or Canvas. Include parking bays, aisle lanes, aisle intersections, entrance gates, and floor labels.
- Give each map object stable IDs and coordinates. Keep visual layout data separate from routing data, but map each visual bay to a graph slot-access node.
- Use a clear legend for Vacant, Occupied, Reserved, Maintenance, Selected Slot, and Route.
- Show slot IDs legibly at normal zoom; allow zoom/pan or fit-to-map if needed.
- Clicking a slot opens a details panel. Show slot ID, floor, type, current state, graph node, and computed route distance if available.
- Add floor selection, gate/start selection, status/type filters, and reset-route control.
- Add accessible titles/tooltips and keyboard focus/selection where practical.

ROUTING:
- When the user presses “Find Nearest Slot”, run Dijkstra from the selected gate/start node across traversable aisle edges using non-negative edge costs.
- Use an actual Min-Heap priority queue for the Dijkstra frontier. Return distances and predecessor information, then reconstruct the path to each eligible vacant slot.
- Filter out occupied, reserved, maintenance, incompatible, and unreachable slots before ranking candidates.
- Pick the candidate with the lowest calculated driving-path cost, not the smallest geometric distance.
- Highlight the entire resulting aisle route on the map and highlight the destination slot.
- Display route distance/cost, path nodes or turns, and a few alternative candidates sorted by the same computed cost.
- If a slot changes state, invalidate or recompute stale results before showing a recommendation.

IMPORTANT:
- Draw the route from the reconstructed graph path using its layout coordinates. Never draw a direct line through the parking layout as a substitute.
- Include one-way aisle directionality when the map depicts it.
- Provide sample data for at least two gates and two floors, with enough occupied/vacant bays to demonstrate filtering and alternative results.
- Add tests for: nearest candidate, occupied closest slot, incompatible slot, unreachable bay, one-way aisle, tie in distance, and no available bay.

Finish by running the app and tests. Report files changed, test results, and any known limitations. Do not claim completion if the route overlay does not match the actual graph path.
```

---

## Prompt 3 — Implement the DSA-II Algorithms Properly

```text
Audit and implement the algorithms behind Nearest Parking Slot Finder. Preserve the existing UI and avoid redesigning unrelated parts.

Required working implementations:
1. Weighted graph using an adjacency list; directed edges must be supported for one-way aisles.
2. Binary Min-Heap with insert, peek, extract-min, and heapify operations.
3. Dijkstra using the Min-Heap, with distance and predecessor maps; reconstruct a route to each candidate bay.
4. BFS for unweighted shortest-path demonstration.
5. Binary Search Tree indexed by bay ID, with search, insert, and correct deletion cases (leaf, one child, two children).
6. AVL Tree indexed by bay ID, with height/balance calculations and LL, RR, LR, and RL rotations; verify the balance invariant after operations.
7. In-order, pre-order, and post-order traversals.
8. If threaded binary trees are part of the final build, implement real single-/double-threaded traversal and test thread flags. Otherwise document this as a future extension rather than pretending it is complete.

INTEGRATION:
- The map's Find Nearest action must call the real Dijkstra/Min-Heap implementation.
- Slot status changes must update the authoritative slot store and keep all indexes consistent.
- Keep algorithms in separate modules, not embedded in UI click handlers.
- Show small, understandable algorithm outputs in an Algorithm Lab panel.

TESTS:
- Heap ordering and extraction.
- Dijkstra weighted route differs correctly from straight-line distance.
- One-way edge cannot be traversed backwards.
- Route reconstruction returns the right path.
- Occupied/reserved/maintenance or incompatible slots are excluded.
- BST deletion for all three cases.
- AVL rotations and balance after sequential insertions/deletions.
- All traversals return expected sequences.
- Empty graph, unreachable node, tied path costs, and no available slot.

Run all tests and fix failures. State the exact test command and result. Do not fabricate complexity benchmarks.
```

---

## Prompt 4 — Test the App and Verify the Academic Demo

```text
Act as a strict QA engineer and DSA-II evaluator. Test the existing Nearest Parking Slot Finder implementation end-to-end. Do not merely inspect the code; run the application and tests.

Verify these user journeys:
1. Load the demo layout and confirm dashboard counts match the actual bay data.
2. Select Gate A and find the nearest vacant compatible bay.
3. Confirm the route highlight follows the graph path drawn through aisle coordinates.
4. Mark the recommended bay occupied and search again; the new result must exclude it.
5. Select an EV-only or other bay-type filter and verify eligibility.
6. Switch floors and confirm the corresponding layout and bays are shown.
7. Test an unreachable slot and a one-way aisle.
8. Make every slot unavailable and verify the empty state.
9. Exercise heap, Dijkstra, BST, AVL rotations, and traversal demonstrations.
10. Check responsive layout, keyboard interactions, empty states, and browser console errors.

Audit for:
- Dummy buttons, static search results, fake algorithm outputs, stale results, inconsistent counts, and status updates that do not propagate.
- Claims of O(1) whole-search time when a shortest-path calculation is required.
- Routes that cross walls, slots, or inaccessible one-way lanes.
- Broken build, TypeScript errors, failed tests, and missing run instructions.

Fix defects found, rerun tests, and produce a final summary with:
- What actually works.
- Commands run and real test results.
- Remaining limitations.
- How to run the demo.
- A 2–3 minute presentation sequence for the instructor.

Never fabricate a passing test, benchmark, or feature.
```

---

## Prompt 5 — Final UI Polish Without Breaking Algorithms

```text
Polish the existing Nearest Parking Slot Finder UI while preserving all working routing and DSA logic.

Target: a professional academic dashboard with a prominent interactive parking map.
- Desktop: dashboard summary at top, large map as the main workspace, finder controls and selected-slot details beside it or in a clear side panel.
- Mobile: stack controls and map neatly; avoid horizontal page overflow.
- Use consistent spacing, readable slot IDs, clear status labels, focus states, useful tooltips, and restrained transitions.
- Make the highlighted route and destination obvious without making occupied bays hard to distinguish.
- Keep color contrast accessible and do not rely on color alone.
- Include a simple “How the route was chosen” panel showing start gate, graph algorithm, distance/cost, destination, and alternatives.
- Add an Algorithm Lab section for Dijkstra/Min-Heap, BST/AVL, and traversals without crowding the map view.
- Do not add decorative charts unless they use real app state.
- Do not remove features or replace algorithms with mock data.
- Rerun build and tests after UI edits; fix any regressions and list the files changed.
```

---

## Recommended project structure

Adapt this to the repository's existing stack rather than forcing a rewrite.

```text
src/
  components/
    DashboardSummary
    ParkingMap
    MapLegend
    FinderControls
    SlotDetailsPanel
    AlternativesList
    AlgorithmLab
  data/
    parkingLayout
    demoSlots
  algorithms/
    graph
    minHeap
    dijkstra
    bfs
    binarySearchTree
    avlTree
    traversals
  services/
    parkingService
  types/
    parking
  tests/
    dijkstra.test
    minHeap.test
    slotFinder.test
    trees.test
README.md
```

## Suggested demo flow for your presentation

1. Open the dashboard and explain the simulated parking facility and occupancy summary.
2. Select a gate and press **Find Nearest Slot**.
3. Point out the highlighted aisle-by-aisle route and destination bay on the map.
4. Mark that bay occupied, search again, and show the updated recommendation.
5. Demonstrate that an occupied, reserved, incompatible, or unreachable bay is excluded.
6. Open Algorithm Lab and demonstrate Dijkstra/Min-Heap, an AVL rotation, and a tree traversal.
7. Run the tests and explain the measured results without exaggerating performance.
