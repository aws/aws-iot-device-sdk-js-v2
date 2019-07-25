/* Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*  http://aws.amazon.com/apache2.0
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*/

export class Node<T> {
    constructor(
        public key?: string,
        public value?: T,
        public children: Map<string, Node<T>> = new Map<string, Node<T>>()) {
    }
}

export type KeySplitter = (key: string) => string[];
export enum TrieOp {
    Insert,
    Delete,
    Find,
};


export class Trie<T> {
    protected root = new Node<T>();
    protected split_key: KeySplitter;

    constructor(split: KeySplitter | string) {
        if (typeof (split) === 'string') {
            const delimeter = split;
            split = (key: string) => {
                return key.split(delimeter);
            }
        }
        this.split_key = split;
    }

    protected find_node(key: string, op: TrieOp) {
        const parts = this.split_key(key);
        let current = this.root;
        let parent = undefined;
        for (const part in parts) {
            let child = current.children.get(part);
            if (!child) {
                if (op == TrieOp.Insert) {
                    current.children.set(part, child = new Node(part));
                }
                else {
                    return undefined;
                }
            }
            parent = current;
            current = child;
        }
        if (parent && op == TrieOp.Delete) {
            parent.children.delete(current.key!);
        }
        return current;
    }

    insert(key: string, value: T) {
        let node = this.find_node(key, TrieOp.Insert);
        node!.value = value;
    }

    remove(key: string) {
        this.find_node(key, TrieOp.Delete);
    }

    find(key: string) {
        const node = this.find_node(key, TrieOp.Find);
        return node ? node.value : undefined;
    }
}
