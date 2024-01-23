---
title: "Spring Cyclic Ependencies"
date: 2021-04-16T23:36:37+08:00
draft: false
tags: [frame]
translate_title: Spring-Cyclic-Ependencies
---

## Spring是怎么解决循环依赖的？

首先站在Spring整个Framework体系而言的话，Spring的Bean是由一个BeanDefinition来的，就是在Spring当中，有一个叫建模的类BeanDefinition，Spring的Bean有一系列比较复杂的生命周期：

- 首先，Spring容器启动。

-  spring进行扫描
- 反射后封装成beanDefinition对象，放入beanDefinitionMap
- 遍历map
- 验证（是否单例、是否延迟加载、是否抽象）
- 推断构造方法（ 把当前这个Spring Bean所代表的类当中的构造方法得到一个最佳的一个构造方法 ）
- 准备开始进行实例
- 去单例池中查，没有——》去二级缓存中找，没有提前暴露——》生成一个objectFactory对象暴露到二级缓存中——》属性注入，发现依赖Y——》此时Y开始它的生命周期直到属性注入，发现依赖X->X又走一遍生命周期，当走到去二级缓存中找的时候找到了->往Y中注入X的objectFactory对象->完成循环依赖。

 

1、为什么要使用X的objectFacory对象而不是直接使用X对象？

> 利于拓展，程序员可以通过beanPostProcess接口操作objectFactory对象生成自己想要的对象

2、是不是只能支持单例(scope=singleton)而不支持原型(scope=prototype)？

> 是。因为单例是spring在启动时进行bean加载放入单例池中，在依赖的bean开始生命周期后，可以直接从二级缓存中取到它所依赖的bean的objectFactory对象从而结束循环依赖。而原型只有在用到时才会走生命周期流程，但是原型不存在一个已经实例化好的bean，所以会无限的创建->依赖->创建->依赖->...。

3、循环依赖是不是只支持非构造方法？

> 是。类似死锁问题 

