import { BSTNode } from './binarySearchTree.js';
import { AVLNode } from './avlTree.js';

export type AnyTreeNode<T> = BSTNode<T> | AVLNode<T>;

/**
 * Common traversal utilities for academic comparison and visualization.
 */
export class TreeTraversals {
  /**
   * In-Order Traversal: Left -> Root -> Right
   */
  public static inOrder<T>(root: AnyTreeNode<T> | null): { key: string; value: T }[] {
    const list: { key: string; value: T }[] = [];
    const traverse = (node: AnyTreeNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      list.push({ key: node.key, value: node.value });
      traverse(node.right);
    };
    traverse(root);
    return list;
  }

  /**
   * Pre-Order Traversal: Root -> Left -> Right
   */
  public static preOrder<T>(root: AnyTreeNode<T> | null): { key: string; value: T }[] {
    const list: { key: string; value: T }[] = [];
    const traverse = (node: AnyTreeNode<T> | null) => {
      if (!node) return;
      list.push({ key: node.key, value: node.value });
      traverse(node.left);
      traverse(node.right);
    };
    traverse(root);
    return list;
  }

  /**
   * Post-Order Traversal: Left -> Right -> Root
   */
  public static postOrder<T>(root: AnyTreeNode<T> | null): { key: string; value: T }[] {
    const list: { key: string; value: T }[] = [];
    const traverse = (node: AnyTreeNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      traverse(node.right);
      list.push({ key: node.key, value: node.value });
    };
    traverse(root);
    return list;
  }

  /**
   * Level-Order Traversal (Breadth-First across tree levels)
   */
  public static levelOrder<T>(root: AnyTreeNode<T> | null): { key: string; value: T; level: number }[] {
    const list: { key: string; value: T; level: number }[] = [];
    if (!root) return list;

    const queue: { node: AnyTreeNode<T>; level: number }[] = [{ node: root, level: 0 }];

    while (queue.length > 0) {
      const { node, level } = queue.shift()!;
      list.push({ key: node.key, value: node.value, level });

      if (node.left) queue.push({ node: node.left, level: level + 1 });
      if (node.right) queue.push({ node: node.right, level: level + 1 });
    }

    return list;
  }
}
