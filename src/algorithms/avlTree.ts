export interface AVLNode<T> {
  key: string;
  value: T;
  height: number;
  left: AVLNode<T> | null;
  right: AVLNode<T> | null;
}

export type RotationType = 'LL' | 'RR' | 'LR' | 'RL';

export interface RotationEvent {
  type: RotationType;
  nodeKey: string;
}

/**
 * Self-Balancing AVL Tree indexed by alphanumeric slot ID.
 *
 * Maintains the strict AVL balance invariant:
 * For every node, |height(left) - height(right)| <= 1.
 *
 * Supported Rotations:
 * - Left-Left (LL): Right rotation
 * - Right-Right (RR): Left rotation
 * - Left-Right (LR): Left-Right double rotation
 * - Right-Left (RL): Right-Left double rotation
 *
 * Worst, Average, and Best Time Complexities:
 * - Search: O(log N)
 * - Insert: O(log N)
 * - Delete: O(log N)
 * - Space: O(N)
 */
export class AVLTree<T> {
  private root: AVLNode<T> | null = null;
  private nodeCount: number = 0;
  private rotationHistory: RotationEvent[] = [];

  public getRoot(): AVLNode<T> | null {
    return this.root;
  }

  public size(): number {
    return this.nodeCount;
  }

  public isEmpty(): boolean {
    return this.root === null;
  }

  public getRotationHistory(): RotationEvent[] {
    return [...this.rotationHistory];
  }

  public clearRotationHistory(): void {
    this.rotationHistory = [];
  }

  private height(node: AVLNode<T> | null): number {
    return node ? node.height : 0;
  }

  private updateHeight(node: AVLNode<T>): void {
    node.height = 1 + Math.max(this.height(node.left), this.height(node.right));
  }

  /**
   * Balance Factor = height(left) - height(right).
   * Positive means left-heavy, negative means right-heavy.
   */
  public getBalanceFactor(node: AVLNode<T> | null): number {
    return node ? this.height(node.left) - this.height(node.right) : 0;
  }

  /**
   * LL Case: Right Rotation on node y.
   *
   *        y                               x
   *       / \     Right Rotation          / \
   *      x   T3   -------------->        T1  y
   *     / \                                 / \
   *    T1  T2                              T2  T3
   */
  private rotateRight(y: AVLNode<T>): AVLNode<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  /**
   * RR Case: Left Rotation on node x.
   *
   *      x                                   y
   *     / \       Left Rotation             / \
   *    T1  y      ------------->           x   T3
   *       / \                             / \
   *      T2  T3                          T1  T2
   */
  private rotateLeft(x: AVLNode<T>): AVLNode<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  /**
   * Inserts a key-value pair and restores AVL balance.
   */
  public insert(key: string, value: T): void {
    let insertedNew = false;

    const insertNode = (node: AVLNode<T> | null): AVLNode<T> => {
      if (node === null) {
        insertedNew = true;
        return {
          key,
          value,
          height: 1,
          left: null,
          right: null,
        };
      }

      const cmp = key.localeCompare(node.key);
      if (cmp === 0) {
        // Key already exists, update value without structural change
        node.value = value;
        return node;
      } else if (cmp < 0) {
        node.left = insertNode(node.left);
      } else {
        node.right = insertNode(node.right);
      }

      // Update height of ancestor node
      this.updateHeight(node);

      // Check balance factor
      const balance = this.getBalanceFactor(node);

      // 4 Rebalancing Cases:

      // 1. Left-Left (LL) Case
      if (balance > 1 && key.localeCompare(node.left!.key) < 0) {
        this.rotationHistory.push({ type: 'LL', nodeKey: node.key });
        return this.rotateRight(node);
      }

      // 2. Right-Right (RR) Case
      if (balance < -1 && key.localeCompare(node.right!.key) > 0) {
        this.rotationHistory.push({ type: 'RR', nodeKey: node.key });
        return this.rotateLeft(node);
      }

      // 3. Left-Right (LR) Case
      if (balance > 1 && key.localeCompare(node.left!.key) > 0) {
        this.rotationHistory.push({ type: 'LR', nodeKey: node.key });
        node.left = this.rotateLeft(node.left!);
        return this.rotateRight(node);
      }

      // 4. Right-Left (RL) Case
      if (balance < -1 && key.localeCompare(node.right!.key) < 0) {
        this.rotationHistory.push({ type: 'RL', nodeKey: node.key });
        node.right = this.rotateRight(node.right!);
        return this.rotateLeft(node);
      }

      return node;
    };

    this.root = insertNode(this.root);
    if (insertedNew) {
      this.nodeCount++;
    }
  }

  /**
   * Search for a value by key. O(log N).
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
   * Deletes a key from the AVL Tree and rebalances along the ancestry path.
   */
  public delete(key: string): boolean {
    let deleted = false;

    const deleteNode = (node: AVLNode<T> | null, targetKey: string): AVLNode<T> | null => {
      if (node === null) return null;

      const cmp = targetKey.localeCompare(node.key);
      if (cmp < 0) {
        node.left = deleteNode(node.left, targetKey);
      } else if (cmp > 0) {
        node.right = deleteNode(node.right, targetKey);
      } else {
        // Node found
        deleted = true;

        if (node.left === null || node.right === null) {
          const temp = node.left ? node.left : node.right;
          if (temp === null) {
            // Leaf node
            return null;
          } else {
            // One child
            return temp;
          }
        } else {
          // Two children: get in-order successor (min in right subtree)
          let successor = node.right;
          while (successor.left !== null) {
            successor = successor.left;
          }
          node.key = successor.key;
          node.value = successor.value;
          node.right = deleteNode(node.right, successor.key);
        }
      }

      // Update height
      this.updateHeight(node);

      // Rebalance
      const balance = this.getBalanceFactor(node);

      // LL
      if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
        this.rotationHistory.push({ type: 'LL', nodeKey: node.key });
        return this.rotateRight(node);
      }

      // LR
      if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
        this.rotationHistory.push({ type: 'LR', nodeKey: node.key });
        node.left = this.rotateLeft(node.left!);
        return this.rotateRight(node);
      }

      // RR
      if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
        this.rotationHistory.push({ type: 'RR', nodeKey: node.key });
        return this.rotateLeft(node);
      }

      // RL
      if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
        this.rotationHistory.push({ type: 'RL', nodeKey: node.key });
        node.right = this.rotateRight(node.right!);
        return this.rotateLeft(node);
      }

      return node;
    };

    this.root = deleteNode(this.root, key);
    if (deleted) {
      this.nodeCount--;
    }
    return deleted;
  }

  /**
   * Verifies that the entire tree satisfies the AVL balance invariant (|BF| <= 1).
   */
  public isBalanced(): boolean {
    const checkBalance = (node: AVLNode<T> | null): boolean => {
      if (!node) return true;
      const bf = Math.abs(this.getBalanceFactor(node));
      if (bf > 1) return false;
      return checkBalance(node.left) && checkBalance(node.right);
    };
    return checkBalance(this.root);
  }

  public inOrder(): { key: string; value: T }[] {
    const result: { key: string; value: T }[] = [];
    const traverse = (node: AVLNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push({ key: node.key, value: node.value });
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  public preOrder(): { key: string; value: T }[] {
    const result: { key: string; value: T }[] = [];
    const traverse = (node: AVLNode<T> | null) => {
      if (!node) return;
      result.push({ key: node.key, value: node.value });
      traverse(node.left);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }

  public postOrder(): { key: string; value: T }[] {
    const result: { key: string; value: T }[] = [];
    const traverse = (node: AVLNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      result.push({ key: node.key, value: node.value });
    };
    traverse(this.root);
    return result;
  }

  public getTreeHeight(): number {
    return this.height(this.root);
  }
}
