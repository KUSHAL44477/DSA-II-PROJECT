import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { BinarySearchTree } from '../src/algorithms/binarySearchTree.js';

describe('Binary Search Tree (BST)', () => {
  it('should insert and search keys correctly', () => {
    const bst = new BinarySearchTree<number>();
    assert.equal(bst.isEmpty(), true);

    bst.insert('F1-S05', 5);
    bst.insert('F1-S02', 2);
    bst.insert('F1-S08', 8);

    assert.equal(bst.size(), 3);
    assert.equal(bst.search('F1-S02'), 2);
    assert.equal(bst.search('F1-S05'), 5);
    assert.equal(bst.search('F1-S08'), 8);
    assert.equal(bst.search('NONEXISTENT'), null);
  });

  it('should handle all three deletion cases properly', () => {
    const bst = new BinarySearchTree<string>();
    // Construct tree:
    //         50
    //       /    \
    //      30     70
    //     /  \   /  \
    //    20  40 60  80
    const keys = ['50', '30', '70', '20', '40', '60', '80'];
    keys.forEach((k) => bst.insert(k, `val-${k}`));

    assert.equal(bst.size(), 7);

    // --- Case 1: Delete Leaf Node ('20') ---
    const deletedLeaf = bst.delete('20');
    assert.equal(deletedLeaf, true);
    assert.equal(bst.size(), 6);
    assert.equal(bst.contains('20'), false);
    assert.deepEqual(
      bst.inOrder().map((n) => n.key),
      ['30', '40', '50', '60', '70', '80']
    );

    // --- Case 2: Delete Node with 1 Child ('30' has only right child '40') ---
    const deletedSingleChild = bst.delete('30');
    assert.equal(deletedSingleChild, true);
    assert.equal(bst.size(), 5);
    assert.equal(bst.contains('30'), false);
    assert.deepEqual(
      bst.inOrder().map((n) => n.key),
      ['40', '50', '60', '70', '80']
    );

    // --- Case 3: Delete Node with 2 Children (Root '50') ---
    // In-order successor of '50' is '60' (min in right subtree)
    const deletedTwoChildren = bst.delete('50');
    assert.equal(deletedTwoChildren, true);
    assert.equal(bst.size(), 4);
    assert.equal(bst.contains('50'), false);
    assert.deepEqual(
      bst.inOrder().map((n) => n.key),
      ['40', '60', '70', '80']
    );
  });

  it('should perform in-order, pre-order, and post-order traversals', () => {
    const bst = new BinarySearchTree<number>();
    //        B
    //       / \
    //      A   C
    bst.insert('B', 2);
    bst.insert('A', 1);
    bst.insert('C', 3);

    const inOrderKeys = bst.inOrder().map((n) => n.key);
    const preOrderKeys = bst.preOrder().map((n) => n.key);
    const postOrderKeys = bst.postOrder().map((n) => n.key);

    assert.deepEqual(inOrderKeys, ['A', 'B', 'C']);
    assert.deepEqual(preOrderKeys, ['B', 'A', 'C']);
    assert.deepEqual(postOrderKeys, ['A', 'C', 'B']);
  });
});
