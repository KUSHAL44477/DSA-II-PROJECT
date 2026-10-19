import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { AVLTree } from '../src/algorithms/avlTree.js';

describe('Self-Balancing AVL Tree', () => {
  it('should trigger Left-Left (LL) Right Rotation', () => {
    const avl = new AVLTree<number>();
    // Inserting in decreasing order causes left-heavy imbalance -> LL rotation
    avl.insert('30', 30);
    avl.insert('20', 20);
    avl.insert('10', 10);

    assert.equal(avl.isBalanced(), true);
    assert.equal(avl.getRoot()?.key, '20'); // 20 rotated to root
    assert.equal(avl.getRoot()?.left?.key, '10');
    assert.equal(avl.getRoot()?.right?.key, '30');

    const history = avl.getRotationHistory();
    assert.ok(history.some((r) => r.type === 'LL'));
  });

  it('should trigger Right-Right (RR) Left Rotation', () => {
    const avl = new AVLTree<number>();
    // Inserting in increasing order causes right-heavy imbalance -> RR rotation
    avl.insert('10', 10);
    avl.insert('20', 20);
    avl.insert('30', 30);

    assert.equal(avl.isBalanced(), true);
    assert.equal(avl.getRoot()?.key, '20'); // 20 rotated to root
    assert.equal(avl.getRoot()?.left?.key, '10');
    assert.equal(avl.getRoot()?.right?.key, '30');

    const history = avl.getRotationHistory();
    assert.ok(history.some((r) => r.type === 'RR'));
  });

  it('should trigger Left-Right (LR) Double Rotation', () => {
    const avl = new AVLTree<number>();
    avl.insert('30', 30);
    avl.insert('10', 10);
    avl.insert('20', 20); // Zig-zag left-right -> LR rotation

    assert.equal(avl.isBalanced(), true);
    assert.equal(avl.getRoot()?.key, '20');
    assert.equal(avl.getRoot()?.left?.key, '10');
    assert.equal(avl.getRoot()?.right?.key, '30');

    const history = avl.getRotationHistory();
    assert.ok(history.some((r) => r.type === 'LR'));
  });

  it('should trigger Right-Left (RL) Double Rotation', () => {
    const avl = new AVLTree<number>();
    avl.insert('10', 10);
    avl.insert('30', 30);
    avl.insert('20', 20); // Zag-zig right-left -> RL rotation

    assert.equal(avl.isBalanced(), true);
    assert.equal(avl.getRoot()?.key, '20');
    assert.equal(avl.getRoot()?.left?.key, '10');
    assert.equal(avl.getRoot()?.right?.key, '30');

    const history = avl.getRotationHistory();
    assert.ok(history.some((r) => r.type === 'RL'));
  });

  it('should maintain AVL balance invariant on large sequential insertions', () => {
    const avl = new AVLTree<string>();
    for (let i = 1; i <= 30; i++) {
      const key = `BAY-${String(i).padStart(3, '0')}`;
      avl.insert(key, `Slot-${i}`);
      assert.equal(avl.isBalanced(), true, `Tree must remain balanced after inserting ${key}`);
    }

    assert.equal(avl.size(), 30);
    // For 30 elements, height in balanced tree must be <= 6 (1.44 * log2(30) ~ 7)
    assert.ok(avl.getTreeHeight() <= 6);

    // Verify in-order sorting
    const inOrderKeys = avl.inOrder().map((n) => n.key);
    for (let i = 0; i < inOrderKeys.length - 1; i++) {
      assert.ok(inOrderKeys[i].localeCompare(inOrderKeys[i + 1]) < 0);
    }
  });

  it('should rebalance correctly upon deletion', () => {
    const avl = new AVLTree<number>();
    ['40', '20', '60', '10', '30', '50', '70', '25'].forEach((k) => avl.insert(k, Number(k)));

    assert.equal(avl.isBalanced(), true);

    // Deleting 70 triggers rebalancing
    const deleted = avl.delete('70');
    assert.equal(deleted, true);
    assert.equal(avl.contains('70'), false);
    assert.equal(avl.isBalanced(), true);
  });
});
