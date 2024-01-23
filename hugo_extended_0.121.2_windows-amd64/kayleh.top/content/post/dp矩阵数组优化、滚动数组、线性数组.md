---
title: dp矩阵数组优化、滚动数组、线性数组
mathjax: false
date: 2021-12-24 10:39:22
tags: [algorithm]
slug: dp-array
---

```
一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。
机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。
问总共有多少条不同的路径？

//输入：m = 3, n = 2
//输出：3
//解释：
//从左上角开始，总共有 3 条路径可以到达右下角。
//1. 向右 -> 向下 -> 向下
//2. 向下 -> 向下 -> 向右
//3. 向下 -> 向右 -> 向下
```



```java
public int uniquePaths(int m, int n) {
    int[][] dp = new int[m][n];
    //region 初始化：一直往右边或一直往下面走
    for (int i = 0; i < m; i++) {
        dp[i][0] = 1;
    }
    for (int i = 0; i < n; i++) {
        dp[0][i] = 1;
    }
    //endregion
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            // dp[i - 1][j] + dp[i][j - 1] 分别表示从 左边和上面 过来
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }
    return dp[m - 1][n - 1];
}

public int uniquePaths2(int m, int n) {
    int[] pre = new int[n];
    int[] cur = new int[n];
    Arrays.fill(pre, 1);
    Arrays.fill(cur, 1);
    //滚动数组，只要上一行的数据
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            // cur[j-1]表示从左边过来
            // pre[j] 表示从上面过来
            cur[j] = cur[j - 1] + pre[j];
        }
        pre = cur.clone();
    }
    return pre[n - 1];
}

public int uniquePaths3(int m, int n) {
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    for (int i = 1; i < m; i++) {
        for (int j = 1; j < n; j++) {
            //dp[j]是上一次计算后的结果再加上左边的 dp[j-1]即为当前结果
            dp[j] += dp[j - 1];
        }
    }
    return dp[n - 1];
}
```
