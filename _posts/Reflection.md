---
title: Reflection
tags: [Interview]
slug: reflection
date: 2020-07-14T13:33:21+08:00
---

# Reflection

<!--more-->

### 说明一下JAVA中反射的实现过程和作用分别是什么？

JAVA语言编译之后会生成一个.class文件，反射就是通过字节码文件找到某一个类、类中的方法以及属性等。反射的实现主要借助以下四个类：

Class：类的对象，

Constructor：类的构造方法，

Field：类中的属性对象，

Method：类中的方法对象。

作用：反射机制指的是程序在运行时能够获取自身的信息。在JAVA中，只要给定类的名字，那么就可以通过反射机制来获取类的所有信息。
