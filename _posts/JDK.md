---
title: JDK
tags: [Interview]
slug: jdk
date: 2020-07-14T13:32:29+08:00
---

# JDK

<!--more-->

### 请问JDK和JRE的区别是什么？

Java运行时环境(JRE)是将要执行Java程序的Java虚拟机。它同时也包含了执行applet需要的浏览器插件。Java开发工具包(JDK)是完整的Java软件开发包，包含了JRE，编译器和其他的工具(比如：JavaDoc，Java调试器)，可以让开发者开发、编译、执行Java应用程序。 

### Java中的LongAdder和AtomicLong有什么区别？

JDK1.8引入了LongAdder类。CAS机制就是，在一个死循环内，不断尝试修改目标值，直到修改成功。如果竞争不激烈，那么修改成功的概率就很高，否则，修改失败的的概率就很高，在大量修改失败时，这些原子操作就会进行多次循环尝试，因此性能就会受到影响。 结合ConcurrentHashMap的实现思想，应该可以想到对一种传统AtomicInteger等原子类的改进思路。虽然CAS操作没有锁，但是像减少粒度这种分离热点的思想依然可以使用。将AtomicInteger的内部核心数据value分离成一个数组，每个线程访问时，通过哈希等算法映射到其中一个数字进行计数，而最终的计数结果，则为这个数组的求和累加。热点数据value被分离成多个单元cell，每个cell独自维护内部的值，当前对象的实际值由所有的cell累计合成，这样热点就进行了有效的分离，提高了并行度。 
