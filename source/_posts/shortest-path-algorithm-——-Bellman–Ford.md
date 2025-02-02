---
title: shortest path algorithm —— Bellman–Ford
tags: [algorithm]
mathjax: true
date: 2023-11-19 01:30:30
description:
cover:
banner:
slug: shortest-path-algorithm-Bellman–Ford
---

### Bellman–Ford

Bellman–Ford 算法是一种单源最短路径算法，用于计算一个顶点到其他所有顶点的最短路径。

#### 算法思想

Bellman–Ford 算法的基本思想是：**就是不断尝试对图上每一条边进行松弛。我们每进行一轮循环，就对图上所有的边都尝试进行一次松弛操作，当一次循环中没有成功的松弛操作时，算法停止。**

`松弛操作(relaxation)`：松弛操作是指对于一条边`e`，我们试图通过这条边来缩短起点到终点的距离。如果`dis[a] + w < dis[b]`，那么我们就可以通过这条边来缩短起点到终点的距离，即`dis[b] = dis[a] + w`。

#### 算法步骤

1. 初始化：创建一个一维数组`dis`，用于存储起点到各点的最短路径长度，初始化为无穷大，起点到自己的距离为0。

2. 循环：对图上所有的边进行`n-1`轮松弛操作。

3. 判断负环：如果第`n`轮仍然有松弛操作，说明图中存在负环。

4. 返回结果：`dis[i]`即为起点到终点的最短路径长度。

   > 为什么第二步是`n-1`轮松弛操作？
   >
   > 因为最短路径最多包含`n-1`条边，所以进行`n-1`轮松弛操作后，所有的最短路径都会被计算出来。
   >
   > 如果第二步是`n`轮松弛操作，那么就无法判断负环，因为负环的最短路径包含`n`条边，所以进行`n`轮松弛操作后，负环的最短路径长度仍然会被更新。

```cpp
struct Edge {
    int a, b, w; // 边的起点、终点、权重
} edges[m];

int main{
    int n, m; // n个顶点，m条边
    cin >> n >> m; 
    int dis[n]; // dis[i]表示起点到顶点i的最短路径长度
    
    // 初始化
    memset(dis, 0x3f, sizeof(dis)); // 初始化为无穷大
    dis[0] = 0; // 起点到自己的距离为0

    // 读入边
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        edges[i] = {a, b, w};
        dis[b] = min(dis[b], dis[a] + w); // 松弛操作
        // dis[a] = min(dis[a], dis[b] + w); // 无向图
    }

    // 循环
    for (int i = 0; i < n - 1; i++) { // 进行n-1轮松弛操作
        for (int j = 0; j < m; j++) { // 对图上所有的边进行松弛操作
            int a = edges[j].a, b = edges[j].b, w = edges[j].w;
            dis[b] = min(dis[b], dis[a] + w); // 松弛操作
            // dis[a] = min(dis[a], dis[b] + w); // 无向图
        }
    }

    // 判断负环
    bool flag = false;
    for (int i = 0; i < m; i++) {
        int a = edges[i].a, b = edges[i].b, w = edges[i].w;
        if (dis[b] > dis[a] + w) {
            flag = true;
            break;
        }
    }
    if (flag) cout << "此图存在负环" << endl;

    // 输出结果
    for (int i = 0; i < n; i++) {
        cout << dis[i] << " ";
    }
}
```

#### 复杂度分析

- 时间复杂度：$O(nm)$
  
  每一轮循环中，我们对图上所有的边都进行了一次松弛操作，所以总共进行了`n-1`轮循环，每一轮循环中，我们对图上所有的边都进行了一次松弛操作，所以总共进行了`m`次松弛操作，所以时间复杂度为$O(nm)$。

- 空间复杂度：$O(n)$

  我们只需要一个一维数组`dis`来存储起点到各点的最短路径长度，所以空间复杂度为$O(n)$。


#### 队列优化（SPFA）

队列优化的 Bellman–Ford 算法又称为 SPFA（Shortest Path Faster Algorithm），是对 Bellman–Ford 算法的一种优化。

SPFA 算法的基本思想是：**在 Bellman–Ford 算法中，我们每进行一轮循环，就对图上所有的边都尝试进行一次松弛操作，但是实际上，只有那些在上一轮循环中被松弛过的边，才有可能在这一轮循环中继续被松弛。所以我们可以用一个队列来存储这些在上一轮循环中被松弛过的边，这样就可以减少不必要的松弛操作。**

#### 算法步骤

1. 初始化：创建一个一维数组`dis`，用于存储起点到各点的最短路径长度，初始化为无穷大，起点到自己的距离为0。
2. 循环：将起点加入队列，对队列中的每一条边进行松弛操作，如果松弛成功，就将这条边的终点加入队列。
3. 判断负环：如果某个顶点入队次数超过`n`次，说明图中存在负环。
4. 返回结果：`dis[i]`即为起点到终点的最短路径长度。

```cpp
struct Edge {
    int a, b, w; // 边的起点、终点、权重
    int ne; // 链表中的下一条边
} edges[m];

int h[N], e[M], w[M], ne[M], idx; // 链表的头结点、边的起点、终点、权重、下一条边、边的编号
int main{
    int n, m; // n个顶点，m条边
    cin >> n >> m; 
    int dis[n]; // dis[i]表示起点到顶点i的最短路径长度
    bool st[n]; // st[i]表示顶点i是否在队列中
    
    // 初始化
    memset(dis, 0x3f, sizeof(dis)); // 初始化为无穷大
    dis[0] = 0; // 起点到自己的距离为0

    // 循环
    queue<int> q;
    q.push(0); // 将起点加入队列
    st[0] = true; // 起点已经在队列中
    while (q.size()) {
        int t = q.front();
        q.pop();
        st[t] = false; // 将t从队列中取出
        for (int i = h[t]; i != -1; i = ne[i]) { // 对队列中的每一条边进行松弛操作
            int j = e[i];
            if (dis[j] > dis[t] + w[i]) { // 松弛操作
                dis[j] = dis[t] + w[i];
                if (!st[j]) { // 如果松弛成功，就将这条边的终点加入队列
                    q.push(j);
                    st[j] = true;
                }
            }
        }
    }

    // 判断负环
    bool flag = false;
    for (int i = 0; i < m; i++) {
        int a = edges[i].a, b = edges[i].b, w = edges[i].w;
        if (dis[b] > dis[a] + w) {
            flag = true;
            break;
        }
    }
    if (flag) cout << "此图存在负环" << endl;

    // 输出结果
    for (int i = 0; i < n; i++) {
        cout << dis[i] << " ";
    }
}
```

#### 复杂度分析

- 时间复杂度：$O(nm)$

  每一轮循环中，我们对队列中的每一条边都进行了一次松弛操作，所以总共进行了`m`次松弛操作，所以时间复杂度为$O(nm)$。

- 空间复杂度：$O(n)$
  
    我们只需要一个一维数组`dis`来存储起点到各点的最短路径长度，一个一维数组`st`来存储顶点是否在队列中，所以空间复杂度为$O(n)$。