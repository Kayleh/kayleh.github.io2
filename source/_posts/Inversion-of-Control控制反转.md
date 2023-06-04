---
title: Inversion of Control控制反转
tags: [frame]
translate_title: inversion-of-control
date: 2020-05-13T16:42:55+08:00
---

### 控制反转的定义

<!--more-->

Inversion of Control控制反转，贯穿Spring的始终，Spring的核心。由spring来负责控制对象的生命周期和对象间的关系。



IOC的思想是反转资源获取方向.传统的资源查找方式要求组件向容器发起请求查找资源.作为回应,容器适时的返回资源,而应用IOC之后,则是容器主动的将资源推送给它所管理的组件,组件所要做的仅仅是选择一种合适的方式来接受资源,这种行为也被称为查找的被动形式.



▼传统的方法获取：

```java
Pojo pojo = new Pojo( );
```



▼Spring管理的bean获取：

```java
@AutowiredPojo 
pojo;
```

’ 对象的生命周期由Spring来管理，直接从Spring那里去获取一个对象。IOC是反转控制 (Inversion Of Control)的缩写，就像控制权从本来在自己手里，交给了Spring。‘
