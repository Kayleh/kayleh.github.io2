---
title: Java高性能高并发秒杀系统(8)
mathjax: false
date: 2020-11-09T20:12:45+08:00
tags: [project]
slug: Java-high-performance-and-high-concurrency-spike-system-8
description: 引入RabbitMQ后的秒杀优化
---

## 1. 秒杀接口优化思路

> 重点我们是要减少对数据库的访问

1. 系统初始化时，将秒杀商品库存加载到Redis中
2. 收到请求，在Redis中预减库存，库存不足时，直接返回秒杀失败
3. 秒杀成功，将订单压入消息队列，返回前端消息“排队中”（像12306的买票）
4. 消息出队，生成订单，减少库存
5. 客户端在以上过程执行过程中，将一直轮询是否秒杀成功

------

## 2. 清晰框图解析

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200717154409401.png)

------

## 3. 代码中我们如何实现

### 3.1 库存预加载到Redis中

这里我们是通过实现`InitialzingBean接口`，重写其中`afterProperties方法`达成的

```java
public class MiaoshaController implements InitializingBean {
	    @Override
    public void afterPropertiesSet() throws Exception {
        //系统启动的时候，就将数据存入Redis

        //加载所有秒杀商品
        List<GoodsVo> goodsVos = goodsService.listGoodsVo();
        if(goodsVos == null)
            return;
        //存入Redis中，各秒杀商品的数量
        for (GoodsVo good : goodsVos){
            redisService.set(GoodsKey.miaoshaGoodsStockPrefix,""+good.getId(),good.getStockCount());
            map.put(good.getId(),false);
        }

    }

	......
}
12345678910111213141516171819
```

1. 我们先从数据库中将秒杀商品的信息读取出来，再一个一个加载到缓存中
2. 注意一下其中有一个map，它添加了对应Id-false的键值对，它表示的是该商品没有被秒杀完，用于下文中，当商品秒杀完，阻止其对redis服务的访问（后文还会提到）

### 3.2 开始秒杀，预减库存

```java
        //user不能为空，空了去登陆
        if(user == null){
            return Result.error(CodeMsg.SESSION_ERROR);
        }

        //HashMap内存标记，减少Redis访问时间
        boolean over = map.get(goodsId);
        if(over)
            return Result.error(CodeMsg.MIAO_SHA_OVER);

        //收到请求，预减库存
        Long count = redisService.decr(GoodsKey.miaoshaGoodsStockPrefix, "" + goodsId);
        if(count <= 0){
            map.put(goodsId,true);
            return Result.error(CodeMsg.MIAO_SHA_OVER);
        }
12345678910111213141516
```

1. 首先用户不能为空
2. 这里我们又看见了map，它写在了Redis服务前边，当商品秒杀完毕的时候，这样就能防止它再去访问Redis服务了
3. 预减库存，库存小于0的时候就返回秒杀失败

### 3.3 加入消息队列中（Direct Exchange）

```java
        //判断是否已经秒杀过了
        MiaoshaOrder miaoshaOrder = orderService.selectMiaoshaOrderByUserIdGoodsId(user.getId(), goodsId);
        if(miaoshaOrder != null)
            return Result.error(CodeMsg.REPEATE_MIAOSHA);

        //加入消息队列
        MiaoshaMessage miaoshaMessage = new MiaoshaMessage();
        miaoshaMessage.setGoodsId(goodsId);
        miaoshaMessage.setMiaoShaUser(user);
        mqSender.sendMiaoshaMessage(miaoshaMessage);
12345678910
```

1. 在其之前我们有一个判断，判断该用户是不是重复秒杀，其实这一步是多余的，因为我们在数据库中已经建立了唯一索引，将userId和GoodsId绑定在了一起，不会生成重复的订单
2. 自定义MiaoshaMessage类，创建对象，其中加入我们想要的user和goodsId信息，并将消息发出去

### 3.4 消息发送过程

```java
    @Autowired
    AmqpTemplate amqpTemplate;


    public void sendMiaoshaMessage(MiaoshaMessage miaoshaMessage){
        String msg = RedisService.beanToString(miaoshaMessage);
        log.info("miaosha send msg:" + msg);
        amqpTemplate.convertAndSend(MQConfig.MIAOSHA_QUEUE,msg);
    }
123456789
```

- 用SpringBoot框架提供的AmqpTemlplate实例来为我们的秒杀队列发送消息

### 3.5 消息出队处理

```java
    @RabbitListener(queues = MQConfig.MIAOSHA_QUEUE)
    public void receiveMiaoshaMsg(String miaoshaMessage){
        log.info("miaosha receive msg:" + miaoshaMessage);
        MiaoshaMessage msg = RedisService.stringToBean(miaoshaMessage, MiaoshaMessage.class);

        long goodsId = msg.getGoodsId();
        MiaoShaUser miaoShaUser = msg.getMiaoShaUser();
        GoodsVo goodsVo = goodsService.getGoodsVoByGoodsId(goodsId);

        //判断库存
        int stock = goodsVo.getStockCount();
        if(stock < 0)
            return;

        //有库存而且没秒杀过，开始秒杀
        miaoshaService.miaosha(miaoShaUser,goodsVo);
    }
1234567891011121314151617
```

- 判断库存是否还有，有的话，向下执行秒杀

#### 3.5.1 秒杀方法

```java
    @Transactional
    public OrderInfo miaosha(MiaoShaUser user, GoodsVo goods) {
        //库存减一
        boolean success = goodsService.reduceStock(goods);

        if(success)
            //下订单
            return orderService.createOrder(user,goods);
        else{
            setGoodsOver(goods.getId());
            return null;
        }
    }
12345678910111213
```

- 该方法我们用@Transactional注解标记，保证减库存和下订单都执行成功
- 注意其中有一个setGoodsOver()方法，它的作用是当该商品库存没有的时候，在redis中存一个标志，下面我们接着看

### 3.6 与前端进行交互的秒杀结果

```java
    /**
     * orderId 成功
     * -1 秒杀失败
     * 0 继续轮询
     * @param miaoShaUser
     * @param goodsId
     * @return
     */
    @RequestMapping(value = "/result",method = RequestMethod.GET)
    @ResponseBody
    public Result<Long> miaoshaResult(MiaoShaUser miaoShaUser,
                                      @RequestParam("goodsId")long goodsId){
        if(miaoShaUser == null)
            return Result.error(CodeMsg.SESSION_ERROR);

        long result = miaoshaService.getMiaoshaResult(miaoShaUser.getId(),goodsId);
        return Result.success(result);
    }
123456789101112131415161718
```

- 这里写了一个/resulet请求，前端会根据返回值，来判断秒杀的状态

#### 3.6.1 getMiaoshaResult方法

```java
    public long getMiaoshaResult(long userId, long goodsId) {
        MiaoshaOrder order = orderService.selectMiaoshaOrderByUserIdGoodsId(userId, goodsId);

        if(order != null){
            //秒杀成功
            return order.getOrderId();
        }else {
            boolean isOver = getGoodsOver(goodsId);
            if(isOver)
                return -1;
            else
                //继续轮询
                return 0;
        }
    }
123456789101112131415
```

- 用户在秒杀该商品的过程中，在得到秒杀结果之前，会一直进行轮询，直到返回orderId或者-1来告知秒杀成功与失败
- 该方法中，从数据库中看看能不能查询到秒杀订单信息，有说明秒杀成功，返回订单号；失败了则获取redis中的是否秒杀完的标志，跟前边setGoodsOver()相对应，这里的getGoodsOver()便是对set的值进行获取，如果没有库存了则说明秒杀失败了，否则要继续轮询了（已经秒杀到，但是订单还没有创建完成）
