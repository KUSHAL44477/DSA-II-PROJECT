import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ThreadedBinaryTree } from '../src/algorithms/threadedBinaryTree.js';

describe('Double-Threaded Binary Search Tree', () => {
  it('should initialize empty and handle insertions', () => {
    const tree = new ThreadedBinaryTree<number>();
    assert.equal(tree.isEmpty(), true);
    assert.equal(tree.size(), 0);

    tree.insert('20', 20);
    assert.equal(tree.size(), 1);
    assert.equal(tree.getRoot()?.key, '20');
  });

  it('should correctly set thread pointers and flags', () => {
    const tree = new ThreadedBinaryTree<string>();
    // Insert: 20, 10, 30
    tree.insert('20', 'root');
    tree.insert('10', 'left');
    tree.insert('30', 'right');

    const root = tree.getRoot()!;
    const leftChild = root.left!;
    const rightChild = root.right!;

    // Left child's right thread should point to root (in-order successor)
    assert.equal(leftChild.isRightThread, true);
    assert.equal(leftChild.right, root);

    // Right child's left thread should point to root (in-order predecessor)
    assert.equal(rightChild.isLeftThread, true);
    assert.equal(rightChild.left, root);
  });

  it('should perform stackless in-order traversal across diverse keys', () => {
    const tree = new ThreadedBinaryTree<number>();
    const keys = ['50', '30', '70', '20', '40', '60', '80', '10', '25', '35', '65'];
    keys.forEach((k) => tree.insert(k, Number(k)));

    const inOrderKeys = tree.inOrder().map((n) => n.key);
    const sortedExpected = [...keys].sort((a, b) => a.localeCompare(b));

    assert.deepEqual(inOrderKeys, sortedExpected);
  });
});
