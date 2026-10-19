export interface ThreadedNode<T> {
  key: string;
  value: T;
  left: ThreadedNode<T> | null;
  right: ThreadedNode<T> | null;
  isLeftThread: boolean;   // true if left pointer points to in-order predecessor
  isRightThread: boolean;  // true if right pointer points to in-order successor
}

/**
 * Double-Threaded Binary Search Tree.
 *
 * Implements real thread flags and pointers:
 * - When isRightThread is true, right points to in-order successor.
 * - When isLeftThread is true, left points to in-order predecessor.
 *
 * Major DSA-II benefit:
 * In-Order Traversal runs in O(N) time with O(1) auxiliary space!
 * No recursion call-stack and no explicit stack data structure is required.
 */
export class ThreadedBinaryTree<T> {
  private root: ThreadedNode<T> | null = null;
  private nodeCount: number = 0;

  public getRoot(): ThreadedNode<T> | null {
    return this.root;
  }

  public size(): number {
    return this.nodeCount;
  }

  public isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * Inserts a key-value pair and wires the predecessor/successor thread pointers.
   */
  public insert(key: string, value: T): void {
    const newNode: ThreadedNode<T> = {
      key,
      value,
      left: null,
      right: null,
      isLeftThread: true,
      isRightThread: true,
    };

    if (this.root === null) {
      this.root = newNode;
      this.nodeCount++;
      return;
    }

    let parent: ThreadedNode<T> | null = null;
    let current: ThreadedNode<T> | null = this.root;

    while (current !== null) {
      const cmp = key.localeCompare(current.key);
      if (cmp === 0) {
        // Key exists, update value
        current.value = value;
        return;
      }

      parent = current;

      if (cmp < 0) {
        if (!current.isLeftThread) {
          current = current.left;
        } else {
          break;
        }
      } else {
        if (!current.isRightThread) {
          current = current.right;
        } else {
          break;
        }
      }
    }

    if (!parent) return;

    const cmp = key.localeCompare(parent.key);
    if (cmp < 0) {
      // Insert as left child of parent
      newNode.left = parent.left;
      newNode.right = parent;
      newNode.isLeftThread = true;
      newNode.isRightThread = true;

      parent.isLeftThread = false;
      parent.left = newNode;
    } else {
      // Insert as right child of parent
      newNode.left = parent;
      newNode.right = parent.right;
      newNode.isLeftThread = true;
      newNode.isRightThread = true;

      parent.isRightThread = false;
      parent.right = newNode;
    }

    this.nodeCount++;
  }

  /**
   * Finds the in-order successor of a node in O(1) when threaded, or by navigating left subtree.
   */
  public getInOrderSuccessor(node: ThreadedNode<T>): ThreadedNode<T> | null {
    if (node.isRightThread) {
      return node.right;
    }

    // Otherwise, it's the leftmost child of the right subtree
    let current = node.right;
    if (!current) return null;

    while (current !== null && !current.isLeftThread) {
      current = current.left;
    }
    return current;
  }

  /**
   * Stackless In-Order Traversal in O(1) auxiliary space using thread pointers.
   */
  public inOrder(): { key: string; value: T }[] {
    const result: { key: string; value: T }[] = [];
    if (!this.root) return result;

    // 1. Find leftmost node in the entire tree
    let current: ThreadedNode<T> | null = this.root;
    while (current !== null && !current.isLeftThread && current.left !== null) {
      current = current.left;
    }

    // 2. Follow successor threads sequentially
    while (current !== null) {
      result.push({ key: current.key, value: current.value });

      if (current.isRightThread) {
        // Thread pointer directly points to in-order successor!
        current = current.right;
      } else {
        // Go to right child and find its leftmost descendant
        current = current.right;
        while (current !== null && !current.isLeftThread && current.left !== null) {
          current = current.left;
        }
      }
    }

    return result;
  }
}
