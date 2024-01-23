---
title: 区间dp算法
mathjax: false
date: 2022-02-17 14:06:18
tags: [algorithm]
slug: round-dp-algorithm
---

### [688\. 骑士在棋盘上的概率](https://leetcode-cn.com/problems/knight-probability-in-chessboard/)

象棋骑士有8种可能的走法，如下图所示。每次移动在基本方向上是两个单元格，然后在正交方向上是一个单元格。

![](https://raw.githubusercontent.com/Kayleh/cdn4/main/knight.png)

每次骑士要移动时，它都会随机从8种可能的移动中选择一种(即使棋子会离开棋盘)，然后移动到那里。

骑士继续移动，直到它走了 `k` 步或离开了棋盘。

返回 _骑士在棋盘停止移动后仍留在棋盘上的概率_ 。


```java
class Solution{
    //一个骑士有 8 种可能的走法，骑士会从中以等概率随机选择一种。部分走法可能会让骑士离开棋盘，
    // 另外的走法则会让骑士移动到棋盘的其他位置，并且剩余的移动次数会减少 1。
    //
    //定义 dp[step][i][j] 表示骑士从棋盘上的点 (i, j)(i,j) 出发，走了 step 步时仍然留在棋盘上的概率。
    // 特别地，当点 (i,j) 不在棋盘上时，dp[step][i][j] = 0 ；
    // 当点 (i,j) 在棋盘上且 step=0 时，dp[step][i][j]=1。
    // 对于其他情况，对坐标的偏移量，具体为 (-2, -1),(-2,1),(2,-1),(2,1),(-1,-2),(-1,2),(1,-2),(1,2)(−2,−1),(−2,1),(2,−1),(2,1),(−1,−2),(−1,2),(1,−2),(1,2) 共 88 种。

    static int[][] dirs = {{-2,-1},{-2,1},{2,-1},{2,1},{-1,-2},{-1,2},{1,-2},{1,2}};

    public double knightProbability(int n,int k,int row,int column){
        double[][][] dp = new double[k+1][n][n];
        for(int step = 0;step<=k;step++){
            for(int i = 0;i<n;i++){
                for(int j = 0;j<n;j++){
                    if(step == 0){
                        dp[step][i][j] = 1;
                    }else{
                        for(int[] dir: dirs){
                            int ni = i+dir[0], nj = j+dir[1];
                            if(ni>=0 && ni<n && nj>=0 && nj<n){
                                dp[step][i][j] += dp[step-1][ni][nj]/8;
                            }
                        }
                    }
                }
            }
        }
        return dp[k][row][column];
    }
}
```