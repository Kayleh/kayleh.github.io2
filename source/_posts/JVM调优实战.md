---
title: JVM内存调优实战
mathjax: false
date: 2023-04-14 22:24:15
tags: [jvm]
slug: jvm-tuning-practice
site: https://kayleh.top/jvm-tuning-practice
---

## 1. JVM所在环境

### 1.1. 硬件环境

8核16G

### 1.2. 软件环境

jdk1.8.0_131

## 2. JVM调优

#### 启用多线程GC（垃圾收集）：

如果应用程序运行在多核机器上，您可以通过在JVM启动参数中设置以下GC选项来启用多线程GC：

-XX:+UseConcMarkSweepGC -XX:+UseParNewGC。这些选项将启用CMS（并发标记清除）GC和并行垃圾回收。同时还需要设置CMS线程数 -XX:ParallelCMSThreads=<n>，其中<n>为CPU内核数。

#### 调整堆大小：

JVM的默认最大堆大小为物理内存的1/4，即4GB。但是，对于应用程序，可能需要更大的堆大小。可以通过在JVM启动参数中设置以下选项来调整堆大小：
-Xmx<heap_size> 和 -Xms<heap_size>。其中，<heap_size>表示您想要的最大和最小堆大小。可以设置最大堆大小为8GB，最小堆大小为4GB，例如：-Xmx8g -Xms4g。

#### 设置合适的线程数：
应用程序可以通过并发执行多个线程来提高性能，但是过多的线程可能会导致过多的上下文切换和资源浪费。因此，您需要根据硬件环境和应用程序的负载特征来确定最佳线程数。可以使用JVM的以下参数来设置线程池大小：-XX:ParallelGCThreads=<n>和-XX:ConcGCThreads=<n>，其中<n>为CPU内核数。

#### 预热期设置：
JVM的预热期是指在应用程序达到正常负载前，JVM运行热点代码的时间段。您可以通过在JVM启动参数中设置以下选项来延长预热期：-XX:CICompilerCount=<n>，其中<n>为JIT（即时编译器）线程数。这将使得JVM在启动后更长时间地运行热点代码，从而提高应用程序的性能。

#### 优化JVM的垃圾回收：

优化JVM的垃圾回收对于提高应用程序的性能非常重要。您可以通过以下方式来优化JVM的垃圾回收：

#### 避免频繁创建对象：

频繁创建对象可能导致频繁的垃圾回收，从而影响应用程序的性能。可以尽量重用对象或使用对象池等技术来减少对象的创建。

#### 使用CMS垃圾回收器：

CMS垃圾回收器是一种针对大型堆和低暂停时间的垃圾回收器，可以减少应用程序的暂停时间，提高性能。

#### 调整垃圾回收器的参数：

您可以通过调整垃圾回收器的参数来优化JVM的垃圾回收。例如，可以设置垃圾回收器的堆大小、对象晋升阈值、晋升间隔等参数来优化垃圾回收器的性能。
综上所述，针对部署环境和应用程序的负载特征，可以使用以下JVM配置：

```properties
-Xmx8g -Xms4g 
-XX:+UseConcMarkSweepGC -XX:+UseParNewGC 
-XX:ParallelCMSThreads=8 -XX:ParallelGCThreads=8 -XX:ConcGCThreads=2 
-XX:CICompilerCount=4 
```

这些配置将设置最大堆大小为8GB，最小堆大小为4GB，启用CMS GC和并行GC，设置CMS线程数为8，设置垃圾回收线程数为8，设置JIT线程数为4。但是，这些参数可能需要根据应用程序的具体情况进行微调。



