---
title: 「LRUCache算法」—双向链表
mathjax: false
date: 2022-03-16 13:18:22
tags: [algorithm]
slugs: lru-cache
---


当不得不淘汰某些数据时（通常是容量已满），选择最久未被使用的数据进行淘汰。

```java
class LRUCache {
    class Node {
        int k, v;
        Node l, r;
        Node(int _k, int _v) {
            k = _k;
            v = _v;
        }
    }
    int n;
    Node head, tail;
    Map<Integer, Node> map;
    public LRUCache(int capacity) {
        n = capacity;
        map = new HashMap<>();
        head = new Node(-1, -1);
        tail = new Node(-1, -1);
        head.r = tail;
        tail.l = head;
    }

    public int get(int key) {
        if (map.containsKey(key)) {
            Node node = map.get(key);
            refresh(node);
            return node.v;
        }
        return -1;
    }

    public void put(int key, int value) {
        Node node = null;
        if (map.containsKey(key)) {
            node = map.get(key);
            node.v = value;
        } else {
            if (map.size() == n) {
                Node del = tail.l;
                map.remove(del.k);
                delete(del);
            }
            node = new Node(key, value);
            map.put(key, node);
        }
        refresh(node);
    }

    // refresh 操作分两步：
    // 1. 先将当前节点从双向链表中删除（如果该节点本身存在于双向链表中的话）
    // 2. 将当前节点添加到双向链表头部
    void refresh(Node node) {
        delete(node);
        node.r = head.r;
        node.l = head;
        head.r.l = node;
        head.r = node;
    }

    // delete 操作：将当前节点从双向链表中移除
    // 由于我们预先建立 head 和 tail 两位哨兵，因此如果 node.l 不为空，则代表了 node 本身存在于双向链表（不是新节点）
    void delete(Node node) {
        if (node.l != null) {
            Node left = node.l;
            left.r = node.r;
            node.r.l = left;
        }
    }
}
```