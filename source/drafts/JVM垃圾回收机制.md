---
title: JVM垃圾回收机制
mathjax: false
date: 2020-12-17T01:46:57+08:00
tags: [jvm]
slugs: jvm-gc
---

### GC是什么

**分代收集算法**

> 次数上频繁收集Young区 Minor GC
>
> 次数上较少收集Old区      Full GC
>
> 基本不动Perm永久区

### GC是发生在哪个部分

> GC是发生在堆(heap)里面的

### GC分几种?

#### :one:引用计数法(被淘汰)

缺点:

- 每次对对象赋值时均要维护引用计数器,且计数器本身也有一定的消耗
- 较难处理循环引用

> JVM的实现一般不采用这种方式

#### :two:复制算法(Copying)

年轻代中使用的是Minor GC,这种GC算法采用的是复制算法(Copying)

**原理:**

- 从根集合(GC Root)开始,通过Tracing从From中找到存活对象,拷贝到To中;
- From丶To交换身份,下次内存分配从To开始

**优势:heavy_check_mark:** 

- 没有标记和清除的过程,效率高

- 没有内存碎片,可以利用bump-the-pointrt实现快速内存分配

**劣势:heavy_multiplication_x:**

- 需要双倍空间

#### :three:标记清除(Mark-Sweep)

老年代一般是由标记清除或者是标记清除与标记整理的混合实现

**原理**

- 1.标记(Mark)

  从根集合开始扫描,对存活的对象进行标记

- 2.清除(Sweep)

  扫描整个内存空间,回收未被标记的对象,使用free-list记录可以区域.

**优势:heavy_check_mark:** 

- 不需要额外空间

**劣势:heavy_multiplication_x:**

- 两次扫描,耗时严重
- 会产生内存碎片

#### :four:标记压缩(Mark-Compact)

**原理:**

- 1.标记(Mark)

  与标记-清除一样

- 2.压缩(Compact)

  再次扫描,并往一段滑动存活对象.

**优势:heavy_check_mark:** 

- 没有内存碎片,可以利用bump-the-pointrt

**劣势:heavy_multiplication_x:**

- 需要移动对象的成本

#### :five:标记清除压缩(Mark-Sweep-Compact)

**原理:**

- 1.Mark-Sweep和Mark-Compact的结合
- 2.和Mark-Sweep一致,当进行多次GC后才Compact

:heavy_check_mark:减少移动对象的成本

