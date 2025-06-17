---
title: Native method?
mathjax: false
date: 2020-12-16T00:58:42+08:00
tags: [jvm]
slugs: Native-method
---

#### Native 方法?

翻看Thread.start()源码,竟然出现了无方法体的方法??

```java
    private native void start0();
```

这里其实用到了关键字native

#### native关键字

> 说明java的作用范围达不到了,回去调用底层C语言的库.

使用native关键字会进入本地方法栈,调用本地方法接口JNI(Java Native Interface)

JNI的作用: 扩展Java的使用,融合不同的编程语言为Java所用

它在内存区域中专门开辟了一块标记区域: Native Method Stack,登记Native方法.

在最终执行的时候,加载本地方法库中的方法通过JNI

#### 本地方法的使用

少见.

> Java使用打印机,currentTimeMills( ),做外挂的Robot( )...
