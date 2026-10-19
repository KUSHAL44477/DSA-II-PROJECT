export interface BSTNode<T> {
  key: string;
  value: T;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
}

/**
 * Binary Search Tree (BST) indexed by alphanumeric slot/bay ID (e.g. 'F1-S01').
 *
 * Implements search, insert, and textbook deletion addressing all 3 cases:
 * - Case 1: Node has no children (leaf).
 * - Case 2: Node has exactly one child.
 * - Case 3: Node has two children (replaced by in-order successor).
 *
 * Provides In-Order, Pre-Order, and Post-Order traversals.
 */
export class BinarySearchTree<T> {
  private root: BSTNode<T> | null = null;
  private nodeCount: number = 0;

  public getRoot(): BSTNode<T> | null {
    return this.root;
  }

  public size(): number {
    return this.nodeCount;
  }

  public isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * Inserts a key-value pair into the BST.
   * If key already exists, updates value.
   */
  public insert(key: string, value: T): void {
    const newNode: BSTNode<T> = { key, value, left: null, right: null };
    if (!this.root) {
      this.root = newNode;
      this.nodeCount++;
      return;
    }

    let current: BSTNode<T> = this.root;
    while (true) {
      const cmp = key.localeCompare(current.key);
      if (cmp === 0) {
        current.value = value;
        return;
      } else if (cmp < 0) {
        if (current.left === null) {
          current.left = newNode;
          this.nodeCount++;
          return;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          this.nodeCount++;
          return;
        }
        current = current.right;
      }
    }
  }

  /**
   * Search for a value by key. O(h) where h is tree height.
   */
  public search(key: string): T | null {
    let current = this.root;
    while (current !== null) {
      const cmp = key.localeCompare(current.key);
      if (cmp === 0) return current.value;
      current = cmp < 0 ? current.left : current.right;
    }
    return null;
  }

  public contains(key: string): boolean {
    return this.search(key) !== null;
  }

  /**
   * Delete a key from the BST, handling leaf, one-child, and two-children cases.
   */
  public delete(key: string): boolean {
    const initialCount = this.nodeCount;
    this.root = this.deleteNode(this.root, key);
    return this.nodeCount < initialCount;
  }

  private deleteNode(node: BSTNode<T> | null, key: string): BSTNode<T> | null {
    if (node === null) return null;

    const cmp = key.localeCompare(node.key);

    if (cmp < 0) {
      node.left = this.deleteNode(node.left, key);
      return node;
    } else if (cmp > 0) {
      node.right = this.deleteNode(node.right, key);
      return node;
    } else {
      // Key found! Decrement count.
      this.nodeCount--;

      // Case 1: Node has NO children (Leaf)
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2A: Node has only right child
      if (node.left === null) {
        return node.right;
      }

      // Case 2B: Node has only left child
      if (node.right === null) {
        return node.left;
      }

      // Case 3: Node has TWO children
      // Find the in-order successor (minimum node in right subtree)
      const successor = this.findMinNode(node.right);
      node.key = successor.key;
      node.value = successor.value;

      // Increment count temporarily because the recursive call will decrement it for the successor
      this.nodeCount++;
      node.right = this.deleteNode(node.right, successor.key);
      return node;
    }
  }

  private findMinNode(node: BSTNode<T>): BSTNode<T> {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  }

  /**
   * In-Order Traversal (Left, Root, Right).
   * Yields keys in sorted alphanumeric order.
   */
  public inOrder(): { key: string; value: T }[] {
    const result: { key: string; value: T }[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push({ key: node.key, value: node.value });
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Pre-Order Traversal (Root, Left, Right).
   */
  public preOrder(): { key: string; value: T }[] {
    const result: { key: string; value: T }[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      result.push({ key: node.key, value: node.value });
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  /**
   * Post-Order Traversal (Left, Right, Root).
   */
  public postOrder(): { key: string; value: T }[] {
    const result: { key: string; value: T }[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push({ key: node.key, value: node.value });
    };
    traverse(this.root);
    return result;
  }

  /**
   * Computes the height of the tree.
   * Empty tree has height 0; single node tree has height 1.
   */
  public getHeight(): number {
    const computeHeight = (node: BSTNode<T> | null): number => {
      if (!node) return 0;
      return 1 + Math.max(computeHeight(node.left), computeHeight(node.right));
    };
    return computeHeight(this.root);
  }
}
