---
title: shortest path algorithm —— Floyd
tags: [ algorithm ]
mathjax: true
date: 2023-11-19 01:05:31
description:
cover:
banner:
translate_title: shortest-path-algorithm-Floyd
---

### Floyd

Floyd算法是一种动态规划算法，用于求解任意两点间的最短路径。

#### 算法思想

Floyd算法的基本思想是： **每次考虑一个顶点作为中间顶点，看看从起点到这个顶点再到终点的路径是否比起点到终点的路径短。**

#### 算法步骤

1. 初始化：创建一个二维数组`dis`，用于存储任意两点间的最短路径长度，初始化为图中各边的权值，若两点之间没有边，则权值为无穷大。

2. 三层循环：`k`为中间顶点，`i`为起点，`j`为终点，`dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j])`。

> 为什么第一层循环是中间顶点？
> 这是因为Floyd算法是一种动态规划算法，它通过逐步扩展中间节点的集合来计算最短路径。在每一轮循环中，我们考虑所有可能的中间节点，并更新当前已> 知的最短路径。通过逐步增加中间节点，我们最终可以找到所有顶点之间的最短路径。这种选择中间节点的方式使得Floyd算法能够逐步逼近最优解。
> 如果第一层循环是起点或终点，那么就无法逐步逼近最优解，因为起点和终点的集合都是固定的，无法逐步扩展。
>

3. 返回结果：`dis[i][j]`即为起点到终点的最短路径长度。

```cpp
int main{
    int n, m; // n个顶点，m条边
    cin >> n >> m; 
    int dis[n][n];
    
    // 初始化
    memset(dis, 0x3f, sizeof(dis)); // 初始化为无穷大
    for (int i = 0; i < n; i++) dis[i][i] = 0; // 自己到自己的距离为0

    // 读入边
    for (int i = 0; i < m; i++) {
        int a, b, w;
        cin >> a >> b >> w;
        dis[a][b] = w; // 默认的最短路径为边的权值
        // dis[b][a] = w; // 无向图
    }

    // Floyd算法核心语句
    for(int k=0;k<n;k++)
        for(int i=0;i<n;i++)
            for(int j=0;j<n;j++)
                dis[i][j]=min(dis[i][j],dis[i][k]+dis[k][j]);

    // 输出结果
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++)
            cout << dis[i][j] << " ";
        cout << endl;
    }

}
```

#### 复杂度分析

- 时间复杂度：$O(n^3)$ 

    三层循环，每层循环的次数都是$n$，所以时间复杂度为$O(n^3)$。

- 空间复杂度：$O(n^2)$

    二维数组`dis`的大小为$n\times n$，所以空间复杂度为$O(n^2)$。