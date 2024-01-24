---
title: "a Lock Based on ReentrantLock"
date: 2021-04-20T00:59:25+08:00
draft: false
tags: [Concurrency]
slug: Implement-a-lock-based-on-ReentrantLock
---

## 基于 ReentrantLock实现一个锁

```java
package aqsLock;

import java.util.concurrent.locks.AbstractQueuedSynchronizer;


/**
 * @Author: Kayleh
 * @Date: 2021/4/20 0:57
 */
public class aqsLock
{
    public void lock()
    {
        sync.acquire(1);
    }

    public void unlock()
    {
        sync.release(1);
    }

    private final Sync sync = new Sync();

    public static class Sync extends AbstractQueuedSynchronizer
    {
        @Override
        protected boolean tryAcquire(int arg)
        {
            // CAS 方式尝试获取锁，成功返回true，失败返回false
            if (compareAndSetState(0, 1))
                return true;
            return false;
        }

        @Override
        protected boolean tryRelease(int arg)
        {
            // 释放锁
            setState(0);
            return true;
        }
    }
}

```

基本功能实现，测试：

```java
// 可能发生线程安全问题的共享变量
private static long count = 0;

// 两个线程并发对 count++
public static void main(String[] args) throws Exception {
    // 创建两个线程，执行add()操作
    Thread th1 = new Thread(()-> add());
    Thread th2 = new Thread(()-> add());
    // 启动两个线程
    th1.start();
    th2.start();
    // 等待两个线程执行结束
    th1.join();
    th2.join();
    // 这里应该是 20000 就对了，说明锁生效了
    System.out.println(count);
}

// 我画了一上午写出来的锁，哈哈
private static ExampleLock exampleLock = new ExampleLock();

// 循环 count++，进行 10000 次
private static void add() {
    exampleLock.lock();
    for (int i = 0; i < 10000; i++) {
        count++;
    }
    add2();
    // 没啥异常，我就直接释放锁了
    exampleLock.unlock();
}
```

> **非公平锁**，因为线程抢锁不排队，纯看脸。
>
> 实现的排队获取锁，叫**公平锁**，因为只要有线程在排队，新来的就得乖乖去排队，不能直接抢。 

## 实现一个公平锁

```java
@Override
public boolean tryAcquire(int acquires) {
    // 原有基础上加上这个
    if (有线程在等待队列中) {
        // 返回获取锁失败，AQS会帮我把该线程放在等待队列队尾的
        return false;
    }
    if (compareAndSetState(0, 1)) {
        return true;
    }
    return false;
}
```

代码：

```java
package aqsLock;

import java.util.concurrent.locks.AbstractQueuedSynchronizer;


/**
 * @Author: Kayleh
 * @Date: 2021/4/20 0:57
 */
public class aqsLock
{
    public aqsLock(boolean fair)
    {
        sync = fair ? new Sync() : new NofairSync();
    }


    public void lock()
    {
        sync.acquire(1);
    }

    public void unlock()
    {
        sync.release(1);
    }

    private Sync sync = new Sync();

    public static class Sync extends AbstractQueuedSynchronizer
    {
        @Override
        protected boolean tryAcquire(int arg)
        {
            // CAS 方式尝试获取锁，成功返回true，失败返回false
            if (hasQueuedPredecessors() && compareAndSetState(0, 1))
                return true;
            return false;
        }

        @Override
        protected boolean tryRelease(int arg)
        {
            // 释放锁
            setState(0);
            return true;
        }
    }

    public static class NofairSync extends Sync
    {
        @Override
        protected boolean tryAcquire(int arg)
        {
            // CAS 方式尝试获取锁，成功返回true，失败返回false
            if (compareAndSetState(0, 1))
                return true;
            return false;
        }

        @Override
        protected boolean tryRelease(int arg)
        {
            // 释放锁
            setState(0);
            return true;
        }
    }
}
```

> 工具会导致一个线程卡死，一直获取不到锁 

## 实现方法可以重入

```java
public void doSomeThing2() {
    flashLock.lock();
    doSomeThing2();
    flashLock.unlock();
}

public void doSomeThing2() {
    flashLock.lock();
    ...
    flashLock.unlock();
}
```

> 一个线程执行了一个方法，获取了锁，这个方法没有结束，又调用了另一个需要锁的方法，于是卡在这再也不走了。 

怎么 **让同一个线程持有锁时，还能继续获取锁（可重入）**，只有当不同线程才互斥呢？ 

```java
@Override
public boolean tryAcquire(int acquires) {
    final Thread current = Thread.currentThread();
    int c = getState();
    if (c == 0) {
        if (hasQueuedPredecessors() && compareAndSetState(0, 1)) {
            // 拿到锁记得记录下持锁线程是自己
            setExclusiveOwnerThread(current);
            return true;
        }
    } else if (current == getExclusiveOwnerThread()) {
        // 看见锁被占了(state!=0)也别放弃，看看是不是自己占的
        setState(c + acquires);
        return true;
    }
    return false;
}
```

