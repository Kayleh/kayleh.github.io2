---
title: mybatis-cache
mathjax: false
date: 2021-05-29 23:49:32
tags: [frame]
translate_title: mybatis-cache
---

# mybatis-缓存

#### 什么是缓存？

缓存就是存储数据的一个地方（称作：Cache），当程序要读取数据时，会首先从缓存中获取，有则直接返回，否则从其他存储设备中获取，缓存最重要的一点就是从其内部获取数据的速度是非常快的，通过缓存可以加快数据的访问速度。比如我们从db中获取数据，中间需要经过网络传输耗时，db server从磁盘读取数据耗时等，如果这些数据直接放在jvm对应的内存中，访问是不是会快很多。

#### mybatis中的缓存

mybatis中分为一级缓存和二级缓存。

一级缓存是SqlSession级别的缓存，在操作数据库时需要构造 sqlSession对象，在对象中有一个数据结构（HashMap）用于存储缓存数据，不同的sqlSession之间的缓存数据区域（HashMap）是互相不影响的。

二级缓存是mapper级别的缓存，多个SqlSession去操作同一个Mapper的sql语句，多个SqlSession可以共用二级缓存，二级缓存是跨SqlSession的。

# 一级缓存

一级缓存是SqlSession级别的缓存，每个SqlSession都有自己单独的一级缓存，多个SqlSession之间的一级缓存是相互隔离的，互不影响，mybatis中一级缓存是默认自动开启的。

一级缓存工作原理：在同一个SqlSession中去多次去执行同样的查询，每次执行的时候会先到一级缓存中查找，如果缓存中有就直接返回，如果一级缓存中没有相关数据，mybatis就会去db中进行查找，然后将查找到的数据放入一级缓存中，第二次执行同样的查询的时候，会发现缓存中已经存在了，会直接返回。一级缓存的存储介质是内存，是用一个HashMap来存储数据的，所以访问速度是非常快的。

#### 一级缓存案例

案例sql脚本

```sql
use 'test';
create table user(
	id int auto_increment primary key comment '用户id',
    name varchar(50) not null default '' comment '用户名',
    password varchar(50) not null default '' comment '用户密码'
) comment '用户表';
inseret into test values (1,'xiaoe',admin),(2,'xiaoa',admin)
```

下面是查询用户信息，返回一个list

```xml
<select id="getList" resultType="com.kayleh.bean.User">
        select id,name,password from test
        <where>
            <if test="id!=null">
                and id = #{id}
            </if>
            <if test="name!=null and name.toString()!=''">
                and name = #{name}
            </if>
            <if test="password!=null">
                and password = #{password}
            </if>
        </where>
</select>
```

对应的mapper接口方法

```java
 List<User> getList(Map<String, Object> paramMap);
```

测试用例


上面的代码在同一个SqlSession中去执行了2次获取用户列表信息，2次查询结果分别放在userModelList1和userModelList2，最终代码中也会判断这两个集合是否相等，下面我们运行一下看看会访问几次db。


从输出中可以看出看到，sql只输出了一次，说明第一次会访问数据库，第二次直接从缓存中获取的，最后输出了一个true，也说明两次返回结果是同一个对象，第二次直接从缓存中获取数据的，加快了查询的速度。

#### 清空一级缓存的3种方式

同一个SqlSession中查询同样的数据，mybatis默认会从一级缓存中获取，如果缓存中没有，才会访问db，那么如果我们希望不走缓存而是直接去访问数据库，又该如何操作呢？

让一级缓存失效有3种方式：

- SqlSession中执行增、删、改操作，此时sqlsession会自动清理其内部的一级缓存

- 调用SqlSession中的clearCache方法清理其内部的一级缓存

- 设置Mapper xml中select元素的flushCache属性值为true，那么执行查询的时候会先清空一级缓存中的所有数据，然后去db中获取数据

上面方式任何一种都会让当前SqlSession中的以及缓存失效，进而去db中获取数据。

#### 一级缓存使用总结

一级缓存是SqlSession级别的，每个人SqlSession有自己的一级缓存，不同的SqlSession之间一级缓存是相互隔离的

mybatis中一级缓存默认是自动开启的

当在同一个SqlSession中执行同样的查询的时候，会先从一级缓存中查找，如果找到了直接返回，如果没有找到会去访问db，然后将db返回的数据丢到一级缓存中，下次查询的时候直接从缓存中获取

一级缓存清空的3种方式（1：SqlSession中执行增删改会使一级缓存失效；2：调用SqlSession.clearCache方法会使一级缓存失效；3：Mapper xml中的select元素的flushCache属性置为true，那么执行这个查询会使一级缓存失效）

# 二级缓存

#### 二级缓存的使用

一级缓存使用上存在局限性，必须要在同一个SqlSession中执行同样的查询，一级缓存才能提升查询速度，如果想在不同的SqlSession之间使用缓存来加快查询速度，此时我们需要用到二级缓存了。

二级缓存是mapper级别的缓存，每个mapper xml有个namespace，二级缓存和namespace绑定的，每个namespace关联一个二级缓存，多个SqlSession可以共用二级缓存，二级缓存是跨SqlSession的。

二级缓存**默认是没有开启**的，需要我们在mybatis全局配置文件中进行开启：

```xml
<settings>
    <!--开启二级缓存-->
    <setting name="cacheEnabled" value="true"/>
</settings>
```

上面配置好了以后，还需要在对应的mapper xml加上下面配置，表示这个mapper中的查询开启二级缓存：

```xml
<mapper namespace="com.kayleh.mapper.UserMapper">
<!-- 开启本mapper namespace下的二级缓存 -->
<cache></cache>
```


配置就这么简单。

#### 一二级缓存共存时查询原理

一二级缓存如果都开启的情况下，数据查询过程如下：

当发起一个查询的时候，mybatis会先访问这个namespace对应的二级缓存，如果二级缓存中有数据则直接返回，否则继续向下

查询一级缓存中是否有对应的数据，如果有则直接返回，否则继续向下

访问db获取需要的数据，然后放在当前SqlSession对应的二级缓存中，并且在本地内存中的另外一个地方存储一份（这个地方我们就叫TransactionalCache）

当SqlSession关闭的时候，也就是调用SqlSession的close方法的时候，此时会将TransactionalCache中的数据放到二级缓存中，并且会清空当前SqlSession一级缓存中的数据。

#### 二级缓存案例

mybatis全局配置文件开启二级缓存配置

```xml
<settings>
    <!--开启二级缓存-->
    <setting name="cacheEnabled" value="true"/>
</settings>
```

mapper xml中使用cache元素开启二级缓存

```xml
<cache/>
<!--开启二级缓存-->
<select id="getList" resultType="com.kayleh.bean.User">
        select id,name,password from test
        <where>
            <if test="id!=null">
                and id = #{id}
            </if>
            <if test="name!=null and name.toString()!=''">
                and name = #{name}
            </if>
            <if test="password!=null">
                and password = #{password}
            </if>
        </where>
</select>
```

#### 测试用例


for执行了2次查询，每次查询都是**新的SqlSession**。

清空或者跳过二级缓存的3种方式

当二级缓存开启的时候，在某个mapper xml中添加cache元素之后，这个mapper xml中所有的查询都默认开启了二级缓存，那么我们如何清空或者跳过二级缓存呢？3种方式如下：

对应的mapper中执行增删改查会清空二级缓存中数据

select元素的flushCache属性置为true，会先清空二级缓存中的数据，然后再去db中查询数据，然后将数据再放到二级缓存中

select元素的useCache属性置为true，可以使这个查询跳过二级缓存，然后去查询数据

#### 总结

一二级缓存访问顺序：一二级缓存都存在的情况下，会先访问二级缓存，然后再访问一级缓存，最后才会访问db，这个顺序大家理解一下

将mapper xml中select元素的flushCache属性置为false，最终会清除一级缓存所有数据，同时会清除这个select所在的namespace对应的二级缓存中所有的数据

将mapper xml中select元素的useCache置为false，会使这个查询跳过二级缓存

总体上来说使用缓存可以提升查询效率，这块知识掌握了，大家可以根据业务自行选择
