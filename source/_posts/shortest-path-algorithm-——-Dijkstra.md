---
title: shortest path algorithm —— Dijkstra
tags: [ algorithm ]
mathjax: true
date: 2023-11-19 16:24:09
description:
translate_title: shortest-path-algorithm-Dijkstra
---

### Dijkstra

Dijkstra 算法是一种单源最短路径算法，用于计算一个顶点到其他所有顶点的最短路径。Dijkstra 算法不能处理负权边，可以处理负权边的
单源最短路径算法见 [shortest path algorithm —— Bellman–Ford](/shortest-path-algorithm-Bellman%E2%80%93Ford/)

相比BFS，Dijkstra算法最大的不同是，在于考虑了成本。

#### 算法思想

Dijkstra 算法的基本思想是：**将图中的所有顶点分为两个集合，第一个集合为已求出最短路径的顶点集合，记为`S`；第二个集合为未求出最短路径的顶点集合，记为`U`。初始时，集合`S`中只有一个源点，然后每一次从集合`U`中取出一个顶点`u`，并将这个顶点加入到集合`S`中，然后以顶点`u`为中介点，对源点到达集合`U`中顶点的距离进行更新。**

#### 算法步骤

1. 初始化：创建一个一维数组`dis`，用于存储起点到各点的最短路径长度，初始化为无穷大，起点到自己的距离为0。

2. 循环：重复`n`次，每次从集合`U`中取出一个顶点`u`，并将这个顶点加入到集合`S`中，然后以顶点`u`为中介点，对源点到达集合`U`中顶点的距离进行更新。

3. 返回结果：`dis[i]`即为起点到终点的最短路径长度。

```cpp
bool vis[N];
int dis[N];
int g[N][N]; // 邻接矩阵
int s;
void dijkstra(int s) {
   int n = g.size();
    for (int i = 0; i < n; i++) {
        dis[i] = INF;
        vis[i] = false;
    }

    dis[s] = 0; // 起点到自己的距离为0
    for (int i = 0; i < n; i++) { 
        int u = -1;
        int MIN = INF;
        for (int j = 0; j < n; j++) { // 找到距离起点最近的点
            if (vis[j] == false && dis[j] < MIN) {
                u = j; // u为距离起点最近的点
                MIN = dis[j]; // MIN为距离起点最近的点的距离
            }
        }
        if (u == -1) return; // 找不到小于INF的dis[u]，说明剩下的顶点和起点s不连通
        vis[u] = true;
        for (int v = 0; v < n; v++) {
            if (vis[v] == false && g[u][v] != INF && dis[u] + g[u][v] < dis[v]) { 
                // 如果v未访问 && u能到达v && 以u为中介点可以使dis[v]更优
                dis[v] = dis[u] + g[u][v];
            }
        }
    }

    for (int i = 0; i < n; i++) {
        cout << dis[i] << " ";
    }
}
```

#### 复杂度分析

时间复杂度：$O(n^2)$

空间复杂度：$O(n^2)$

#### 优先队列优化

Dijkstra 算法的时间复杂度为$O(n^2)$，可以通过优先队列优化，将时间复杂度降为$O(mlogn)$。


```cpp
struct node {
    int v, dis; // v为顶点，dis为起点到顶点v的距离
    bool operator<(const node& a) const {
        return dis > a.dis; // 优先队列中，dis小的优先级高
    }
};
struct edge {
    int to, w;
};
bool vis[N]; // 标记数组
int dis[N]; // 存储起点到各点的最短路径长度
vector<edge> g[N]; // 邻接表
priority_queue<node, vector<node>, greater<node>> q; // 小顶堆

void dijkstra(int s) {
    int n = g.size();
    memset(dis, 0x3f, sizeof dis);
    memset(vis, false, sizeof vis);

    q.push( { s, 0 } ); // 起点到自己的距离为0
    dis[s] = 0;
    while (!q.empty()) {
        node x = q.top();
        q.pop(); // 取出距离起点最近的点
        int u = x.v;
        if (vis[u]) continue;
        vis[u] = true;
        for (int i = 0; i < g[u].size(); i++) { // 遍历所有出边
            int v = g[u][i].to, w = g[u][i].w;
            if (!vis[v]  && dis[u] + w < dis[v]) {
                dis[v] = dis[u] + w;
                q.push(node(v, dis[v]));
            }
        }
    }

    for (int i = 0; i < n; i++) {
        cout << dis[i] << " ";
    }
}
```
