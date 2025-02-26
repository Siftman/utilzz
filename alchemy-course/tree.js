// Your Goal: Add Node Method

// Create a new method addNode on Tree which will take a new node and add it to the tree.

// Assume that the tree is empty for this stage. Simply set the root to be the node passed into the method.

// // create a new tree and new node
// const tree = new Tree();
// const node = new Node(5);

// // add the node to the tree using addNode
// tree.addNode(node);

// // the new node becomes the tree's root
// console.log(tree.root.data); // 5

class Tree {
    constructor() {
        this.root = null;
        this.currentNode = this.root;
    }
    addNode(node) {
        if (!this.root) {
            this.root = node;
        } else {
            this.addChild(this.root, node);
        }

    }
    addChild(parent, child) {
        if (child.data < parent.data) {
            if (parent.left) {
                this.addChild(parent.left, child);
            } else {
                parent.left = child;
            }
        } else {
            if (parent.right) {
                this.addChild(parent.right, child);
            } else {
                parent.right = child;
            }
        }
    }
    hasNode(node) {
        currentNode = this.root
        while (true) {
            if (currentNode.data == node.data) {
                return true;
            }
            if (node.data < currentNode.data) {
                if (currentNode.left) {
                    currentNode = currentNode.left;
                } else {
                    return false;
                }
            } else {
                if (currentNode.right) {
                    currentNode = currentNode.right;
                } else {
                    return false;
                }
            }
        }
    }
}