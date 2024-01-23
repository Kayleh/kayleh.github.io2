---
title: 写点什么呢
mathjax: false
date: 2022-11-09 15:12:23
tags: algorithm
slug: todolist
---

1 java服务内第三方c程序导致服务终止的问题：
 分析到的问题是，线程池的maxTotal太大，超过了vsm的可用数量(linux 20、windows 90)，最终导致内存溢出。因为core的问题我们这边的环境模拟不出来，所以如果要确定这个猜测 可以用这个测试程序不断调大线程数量直到core掉或者报错，从而找到当前环境的临界值，如果嫌麻烦也可以先把你们应用的线程池调小把maxTotal设置成5 然后在观察一段时间

2 docker容器编排

3 redis远程执行漏洞

7 KMP算法

8 创造一个并查集！

9 快速幂

10 哈夫曼树的应用

11 Java 底层常数优化