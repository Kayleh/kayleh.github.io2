---
title: Mybatis
tags: [Interview]
slug: mybatis
date: 2020-07-14T13:41:49+08:00
---

# MYBATIS

<!--more-->

### 请问MyBatis中的动态SQL是什么意思？

 对于一些复杂的查询，我们可能会指定多个查询条件，但是这些条件可能存在也可能不存在，需要根据用户指定的条件动态生成SQL语句。如果不使用持久层框架我们可能需要自己拼装SQL语句，还好MyBatis提供了动态SQL的功能来解决这个问题。MyBatis中用于实现动态SQL的元素主要有：
\- if
\- choose / when / otherwise
\- trim
\- where
\- set
\- foreach 

### 说明一下MyBatis中命名空间（namespace）的作用是什么？

在大型项目中，可能存在大量的SQL语句，这时候为每个SQL语句起一个唯一的标识（ID）就变得并不容易了。为了解决这个问题，在MyBatis中，可以为每个映射文件起一个唯一的命名空间，这样定义在这个映射文件中的每个SQL语句就成了定义在这个命名空间中的一个ID。只要我们能够保证每个命名空间中这个ID是唯一的，即使在不同映射文件中的语句ID相同，也不会再产生冲突了。 







>  1、mybatis对JDBC做了哪些封装？
>
>  2、mybatis如何映射？
>
>  3、Mybatis接口绑定有几种实现方式,分别是怎么实现的?
>
>  4、Mybatis中和${}的区别？
>
>  5、myBatis 实现一对一有几种方式?具体怎么操作的？
>
>  6、myBatis 实现一对多有几种方式?怎么操作的？
>
>  7、myBatis 里面的动态Sql是怎么设定的?用什么语法?
>
>  8、讲下 myBatis 的缓存？
>
>  9、mybatis的执行流程？
>
>  10、持久层框架为什么选择mybatis？ 

 2😁. mapper.xml文件中的namespace(全限名)来关联和接口的关系. 3😁. .两种方式: ①通过注解绑定,在接口的方法上添加[@select,@update,等注解,里面包含了sql语句.②通过xml文件里写sql绑定,这种方式要求指定xml文件里namespace的值为接口的全限定名.4😁.使用 ${}在编译期传入的参数会直接拼接成字符串,而则会生成占位符"?",并且因为${}会直接拼接成字符串,会造成sql注入,而](https://www.nowcoder.com/profile/3598)传入的参数会生成占位符"?" ,可以有效的防止了sql注入. 7😁.动态sql通过if节点来实现,使用OGNL语法判断.完整的动态sql要配合where,trim节点,choose,when,otherwise标签来完成,一个choose中至少有一个when,0个or1个otherwise,如果when满足就执行, 全部不满住就执行otherwise. 8😁.mybatis分一级缓存和二级缓存;一级缓存默认开启,在对象中有个hashmap用于存储缓存数据,不同的sqlsessioin之间缓存数据互不影响.二级缓存时mapper映射级别的缓存,多个SqlSession去操作同一个mapper映射的sql语句,多个SqlSession可以公用二级缓存,二级缓存是跨SqlSession的. (二级缓存需要手动开启),一级缓存和二级缓存都是用作在短时间内重复查询而做的优化. !     我编不下去了.!🤣 
