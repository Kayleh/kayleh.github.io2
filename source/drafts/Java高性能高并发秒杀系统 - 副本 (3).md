---
title: Java高性能高并发秒杀系统(4)
mathjax: false
date: 2020-11-07T20:13:45+08:00
tags: [project]
slugs: Java-high-performance-and-high-concurrency-spike-system-4
description: 秒杀功能的实现
---

## 1. 实现联表查询的一个小技巧

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200712214753389.png)
商品表和秒杀商品表是两个互相独立的表，其中的关联为`goods_id`，但是我要返回的对象，既想要商品表中的字段，又想要秒杀商品表中的字段，用下面这个方法，有点儿亮眼

```java
@Data
public class GoodsVo extends Goods {
    private Double miaoshaPrice;
    private Integer stockCount;
    private Date startDate;
    private Date endDate;
}
1234567
```

创建一个GoodsVo类，继承Goods类，再将`秒杀商品表中特有的字段`，添加进去即可

### 1.1 左联表查询SQL语句

- 查询所有的商品

```sql
    @Select("select g.*,mg.stock_count,mg.miaosha_price,mg.start_date,mg.end_date from miaosha_goods mg left join goods g on mg.goods_id = g.id")
    public List<GoodsVo> listGoodsVo();
12
```

- 根据id获取商品

```sql
    @Select("select g.*,mg.stock_count,mg.miaosha_price,mg.start_date,mg.end_date from miaosha_goods mg left join goods g on mg.goods_id = g.id where mg.goods_id = #{goodId}")
    public GoodsVo getGoodsVoByGoodsId(@Param("goodId")long goodId);
12
```

### 1.2 Druid数据库连接池中url地址的写法

```sql
jdbc:mysql://xxx.xx.xxx.xxx:3306/miaosha?useUnicode=true&characterEncoding=utf-8&allowMultiQueries=true&useSSL=false&useTimezone=true&serverTimezone=GMT%2B8
1
```

- `serverTimezone=GMT%2B8`:时区为GMT%2B8

------

## 2. 商品详情页对RestFul风格的使用

```java
    @RequestMapping("to_detail/{goodsId}")
    public String toDetail(Model model, MiaoShaUser user, @PathVariable("goodsId") long goodsId){
		...
}
1234
```

- `@RequestMapping`指定的映射URL，其中有用{}括起来的参数，在方法的形参处，用`@PathVariable`注解对其进行获取

------

## 3. 秒杀功能实现的逻辑

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200712231043251.png)

### 3.1 减少库存的sql语句

```sql
    @Update("update miaosha_goods set stock_count = stock_count - 1 where goods_id = #{goodsId}")
    void reduceStock(MiaoshaGoods miaoshaGoods);
12
```

### 3.2 创建订单的sql语句

```sql
    @Insert("insert into order_info (user_id,goods_id,goods_name,goods_count,goods_price,order_channel,status,create_date)" +
            "values(#{userId},#{goodsId},#{goodsName},#{goodsCount},#{goodsPrice},#{orderChannel},#{status},#{createDate})" )
    @SelectKey(statement = "select last_insert_id()",keyProperty = "id",resultType = long.class,before = false)
    long insert(OrderInfo orderInfo);
1234
```

### 3.3 @SelectKey()注解

- `需要前置注解`：@Insert 或 @InsertProvider 或 @Update 或 @UpdateProvider，否则无效。
- statement：填入将会被执行的 SQL 字符串
- keyProperty属性：填入将会被更新的参数对象的属性
- before属性：填入 true 或 false 以指明 SQL 语句应被在插入语句的之前还是之后执行
- resultType属性：填入 keyProperty 的 Java 类型

#### 3.3.1 获取主键值的注意事项

可能我们在执行完插入方法后，想如下这样通过获取返回值的方法来获取主键id值

```java
long orderId = orderDao.insert(orderInfo)
1
```

然而并不是这样，`因为执行插入sql语句返回值只有两种情况`，一种是插入成功返回1，另一种是插入失败，返回0，所以若这里出现一直获取到1值的问题，用如下方法解决

```sql
orderInfo.getId();
1
```

因为，@SelectKey()会将值直接映射到实体类的属性上进行修改，要想获取主键值，只能这样获取，不能通过返回值获取
