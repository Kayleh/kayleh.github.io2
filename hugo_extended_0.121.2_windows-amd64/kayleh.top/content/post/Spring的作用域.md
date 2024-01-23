---
title: Spring Related
mathjax: false
date: 2020-12-16T21:44:11+08:00
tags: [frame]
slug: spring-relate
---

# Spring相关

## 什么是IOC

IOC： Inversion of control 反转控制。 比如以前创建一个对象，需要自己主动new 一个对象，通过IOC，对象的创建交由Spring框架 创建，开发人员直接使用已经创建好的对象。

## 什么是DI

DI： Dependency Injection 依赖注入。 通过IOC创建对象的时候，可以注入字符串甚至其他对象。 比如DAO就会注入session factory.

通常IOC和DI是紧密结合，一起使用的

## 什么是AOP

把功能划分为核心业务功能和其他的周边辅助功能，比如日志，性能统计，事务等等。 其他的周边辅助功能可以都看作切面功能。核心功能和切面功能分别独立开发，通过面向切面编程，可以有机的把核心业务功能和切面功能根据需求结合在一起。 比如增加操作可以和事务切面结合在一起，查询操作可以和性能统计切面结合在一起。
在配置方面，要配置切面，切点，并且通过aspect:config 把切面和切点结合起来。

![什么是AOP](https://cdn.kayleh.top/gh/kayleh/cdn2/Spring的作用域/2025.png)

#### bean的作用域

> 可以通过配置文件的scope属性来指定bean的作用域

- singleton:默认值.当IOC容器一创建就会创建bean的实例.而且是单例的,每次得到的都是同一个.
- prototype:原型的.当IOC容器一创建不再实例化该bean,每次调用getBean方法时再实例化该bean,而且每次得到的不是同一个
- request:每次请求实例化一个bean
- session:在一次会话中共享一个bean

#### Spring支持的常用数据库事务传播属性和事务隔离级别

- propagation:用来设置事务的传播行为

  事务的传播行为:一个事务方法运行在了一个开启了事务的方法中时,当前方法时使用原来的事务还是开启一个新的事务

  - Propagation.REQUIRED:默认值,使用原来的事务
  - Propagation.REQUIRED_NEW:将原来的事务挂起,开启一个新的事务

- isolation:用来设置事务的隔离级别

  - Isolation.REPEATABLE_READ:可重复读,MySQL默认的隔离级别
  - Isolation.READ_COMMITTED:读已提交,Oracle默认的隔离级别,开发时通常使用的隔离级别
