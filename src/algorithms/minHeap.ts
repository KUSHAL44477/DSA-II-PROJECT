/**
 * Generic Binary Min-Heap Priority Queue.
 *
 * Used as the frontier data structure in Dijkstra's shortest path algorithm.
 * Maintains the Min-Heap property: for any node i (except root), A[parent(i)] <= A[i].
 *
 * Complexities:
 * - Insert: O(log N)
 * - Extract-Min: O(log N)
 * - Peek: O(1)
 * - Space: O(N)
 */
export class MinHeap<T> {
  private heap: T[] = [];
  private comparator: (a: T, b: T) => number;

  /**
   * @param comparator Function returning negative if a < b, 0 if equal, positive if a > b.
   * Default comparator assumes primitive numbers.
   */
  constructor(comparator?: (a: T, b: T) => number) {
    this.comparator = comparator || ((a: any, b: any) => a - b);
  }

  public size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  /**
   * Inspect the minimum element in O(1) time without removing it.
   */
  public peek(): T | undefined {
    return this.heap.length > 0 ? this.heap[0] : undefined;
  }

  /**
   * Insert a new element into the heap. O(log N).
   */
  public insert(item: T): void {
    this.heap.push(item);
    this.heapifyUp(this.heap.length - 1);
  }

  /**
   * Remove and return the minimum element from the heap. O(log N).
   */
  public extractMin(): T | undefined {
    if (this.heap.length === 0) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const minItem = this.heap[0];
    // Move last element to root and sift down
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);
    return minItem;
  }

  /**
   * Updates an item in the heap and restores the heap property.
   */
  public update(predicate: (item: T) => boolean, newItem: T): boolean {
    const index = this.heap.findIndex(predicate);
    if (index === -1) return false;

    const oldItem = this.heap[index];
    this.heap[index] = newItem;

    if (this.comparator(newItem, oldItem) < 0) {
      this.heapifyUp(index);
    } else {
      this.heapifyDown(index);
    }
    return true;
  }

  public toArray(): T[] {
    return [...this.heap];
  }

  public clear(): void {
    this.heap = [];
  }

  /**
   * Sifts an element up until the min-heap invariant is restored.
   */
  private heapifyUp(index: number): void {
    let current = index;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      if (this.comparator(this.heap[current], this.heap[parent]) < 0) {
        this.swap(current, parent);
        current = parent;
      } else {
        break;
      }
    }
  }

  /**
   * Sifts an element down until the min-heap invariant is restored.
   */
  private heapifyDown(index: number): void {
    let current = index;
    const length = this.heap.length;

    while (true) {
      const leftChild = 2 * current + 1;
      const rightChild = 2 * current + 2;
      let smallest = current;

      if (
        leftChild < length &&
        this.comparator(this.heap[leftChild], this.heap[smallest]) < 0
      ) {
        smallest = leftChild;
      }

      if (
        rightChild < length &&
        this.comparator(this.heap[rightChild], this.heap[smallest]) < 0
      ) {
        smallest = rightChild;
      }

      if (smallest !== current) {
        this.swap(current, smallest);
        current = smallest;
      } else {
        break;
      }
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
