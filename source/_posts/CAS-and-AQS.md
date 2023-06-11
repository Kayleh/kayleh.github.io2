---
title: "CAS & AQS"
date: 2021-04-19T01:43:22+08:00
draft: false
tags: [Concurrency]
translate_title: CAS-&-AQS
---

## CAS（Compare And Swap）原理分析

字面意思是**比较和交换**，先看看下面场景（A 和 B 线程同时执行下面的代码）：

```java
int i = 10;	//代码1
i = 10;		//代码2
```

场景 1：A 线程执行代码 1 和代码 2，然后 B 线程执行代码 1 和代码 2，CAS 成功。

场景 2：A 线程执行代码 1，此时 B 线程执行代码 1 和代码 2，A 线程执行代码 2，CAS 不成功，为什么呢？

因为 A 线程执行代码 1 时候会旧值（i 的内存地址的值 10）保存起来，执行代码 2 的时候先判断 i 的最新值（可能被其他线程修改了）跟旧值比较，如果相等则把 i 赋值为 20，如果不是则 CAS 不成功。CAS 是一个**原子性操作**，要么成功要么失败，CAS 操作用得比较多的是 sun.misc 包的 Unsafe 类，而 Java 并发包大量使用 Unsafe 类的 CAS 操作，比如：AtomicInteger 整数原子类（本质是自旋锁 + CAS），CAS 不需加锁，提高代码运行效率。也是一种乐观锁方式，我们通常认为在大多数场景下不会出现竞争资源的情况，如果 CAS 操作失败，会不断重试直到成功。

**CAS 优点**：资源竞争不大的场景系统开销小。

**CAS 缺点**：

如果 CAS 长时间操作失败，即长时间自旋，会导致 CPU 开销大，但是可以使用 CPU 提供的 pause 指令，这个 pause 指令可以让自旋重试失败时 CPU 先睡眠一小段时间后再继续自旋重试 CAS 操作，jvm 支持 pause 指令，可以让性能提升一些。

存在 ABA 问题，即原来内存地址的值是 A，然后被改为了 B，再被改为 A 值，此时 CAS 操作时认为该值未被改动过，ABA 问题可以引入版本号来解决，每次改动都让版本号 +1。Java 中处理 ABA 的一个方案是 AtomicStampedReference 类，它是使用一个 int 类型的字段作为版本号，每次修改之前都先获取版本号和当前线程持有的版本号比对，如果一致才进行修改操作，并把版本号 +1。

无法保证代码块的原子性，CAS 只能保证单个变量的原子性操作，如果要保证多个变量的原子性操作就要使用悲观锁了。

## AQS（AbstractQueuedSynchronizer）原理分析

字面意思是**抽象的队列同步器**，AQS 是一个同步器框架，它制定了一套多线程场景下访问共享资源的方案，Java 中很多同步类底层都是使用 AQS 实现，比如：ReentrantLock、CountDownLatch、ReentrantReadWriteLock，这些 java 同步类的内部会使用一个 Sync 内部类，而这个 Sync 继承了 AbstractQueuedSynchronizer 类，这是一种模板方法模式，所以说这些同步类的底层是使用 AQS 实现。

![img](https://cdn.kayleh.top/gh/kayleh/cdn4/cas/1.png)

AQS 内部维护了一个 volatile 修饰的 int state 属性（共享资源）和一个先进先出的线程等待队列（即多线程竞争共享资源时被阻塞的线程会进入这个队列）。因为 state 是使用 volatile 修饰，所以在多线程之前可见，访问 state 的方式有 3 种，getState()、setState()和 compareAndSetState()。

**AQS 定义了 3 种资源共享方式：**

独占锁（exclusive），保证只有一条线程执行，比如 ReentrantLock、AtomicInteger。

共享锁（shared），允许多个线程同时执行，比如 CountDownLatch、Semaphore。

同时实现独占和共享，比如 ReentrantReadWriteLock，允许多个线程同时执行读操作，只允许一条线程执行写操作。

ReentrantLock 和 CountDownLatch 都是**自定义同步器**，它们的内部类 Sync 都是继承了 AbstractQueuedSynchronizer，独占锁和共享锁的区别在于各自重写的获取和释放共享资源的方式不一样，至于线程获取资源失败、唤醒出队、中断等操作 AQS 已经实现好了。

**ReentrantLock**

state 的初始值是 0，即没有被锁定，当 A 线程 tryAcquire() 时会独占锁住 state，并且把 state+1，然后 B 线程（即其他线程）tryAcquire() 时就会失败进入等待队列，直到 A 线程 tryRelease() 释放锁把 state-1，此时也有可能出现重入锁的情况，state-1 后的值不是 0 而是一个正整数，因为重入锁也会 state+1，只有当 state=0 时，才代表其他线程可以 tryAcquire() 获取锁。

**CountDownLatch**

8 人赛跑场景，即开启 8 个线程进行赛跑，state 的初始值设置为 8（必须与线程数一致），每个参赛者跑到终点（即线程执行完毕）则调用 countDown()，使用 CAS 操作把 state-1，直到 8 个参赛者都跑到终点了（即 state=0），此时调用 await() 判断 state 是否为 0，如果是 0 则不阻塞继续执行后面的代码。

tryAcquire()、tryRelease()、tryAcquireShared()、tryReleaseShared() 的详细流程分析

**tryAcquire() 详细流程如下：**

调用 tryAcquire() 尝试获取共享资源，如果成功则返回 true;

如果不成功，则调用 addWaiter() 把此线程构造一个 Node 节点（标记为独占模式），并使用 CAS 操作把节点追加到等待队列的尾部，然后该 Node 节点的线程进入自旋状态;

线程自旋时，判断自旋节点的前驱节点是不是头结点，并且已经释放共享资源（即 state=0），自旋节点是否成功获取共享资源（即 state=1），如果三个条件都成立则自旋节点设置为头节点，如果不成立则把自旋节点的线程挂起，等待前驱节点唤醒。

![img](https://cdn.kayleh.top/gh/kayleh/cdn4/cas/2.png)

**tryRelease() 详细流程如下：**

调用 tryRelease() 释放共享资源，即 state=0，然后唤醒没有被中断的后驱节点的线程;

被唤醒的线程自旋，判断自旋节点的前驱节点是不是头结点，是否已经释放共享资源（即 state=0），自旋节点是否成功获取共享资源（即 state=1），如果三个条件都成立则自旋节点设置为头节点，如果不成立则把自旋节点的线程挂起，等待被前驱节点唤醒。

**tryAcquireShared() 详细流程如下：**

调用 tryAcquireShared() 尝试获取共享资源，如果 state>=0，则表示同步状态（state）有剩余还可以让其他线程获取共享资源，此时获取成功返回;

如果 state<0，则表示获取共享资源失败，把此线程构造一个 Node 节点（标记为共享模式），并使用 CAS 操作把节点追加到等待队列的尾部，然后该 Node 节点的线程进入自旋状态;

线程自旋时，判断自旋节点的前驱节点是不是头结点，是否已经释放共享资源（即 state=0），再调用 tryAcquireShared() 尝试获取共享资源，如果三个条件都成立，则表示自旋节点可执行，同时把自旋节点设置为头节点，并且唤醒所有后继节点的线程。

如果不成立，挂起自旋的线程，等待被前驱节点唤醒。

**tryReleaseShared() 详细流程如下：**

调用 tryReleaseShared() 释放共享资源，即 state-1，然后遍历整个队列，唤醒所有没有被中断的后驱节点的线程;

被唤醒的线程自旋，判断自旋节点的前驱节点是不是头结点，是否已经释放共享资源（即 state=0），再调用 tryAcquireShared() 尝试获取共享资源，如果三个条件都成立，则表示自旋节点可执行，同时把自旋节点设置为头节点，并且唤醒所有后继节点的线程。

如果不成立，挂起自旋的线程，等待被前驱节点唤醒。