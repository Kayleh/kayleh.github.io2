---
title: Java高性能高并发秒杀系统(7)
mathjax: false
date: 2020-11-08T20:17:45+08:00
tags: [project]
slugs: Java-high-performance-and-high-concurrency-spike-system-7
description: Rabbit+接口优化
---

## 1. 集成RabbitMQ

### 1.1 添加依赖

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716163301517.png)

### 1.2 添加配置信息

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716163454589.png)

------

## 2. 进行简单测试（Direct Exchange）

- **任何发送到Direct Exchange的消息都会被转发到RouteKey中指定的Queue**

### 2.1 创建一个配置类

```java
@Configuration
public class MQConfig {

    public static final String QUEUE_NAME = "queue";

    @Bean
    public Queue queue(){
        return new Queue(QUEUE_NAME,true);
    }
}
12345678910
```

#### 2.1.1 @Bean注解

- @Bean注解就是要告诉`方法`，产生一个`Bean对象`，并将这个Bean由Spring容器管理。产生这个Bean对象的方法Spring只会调用一次，随后这个Bean将放在IOC容器中。
- SpringIOC容器管理一个或者多个Bean，这些Bean都需要在`@Configuration`注解下进行创建

### 2.2 创建消息的接受器

```java
@Service
@Slf4j
public class MQReceiver {

    @RabbitListener(queues = MQConfig.QUEUE_NAME)
    public void receive(String message){
        log.info("receive message:" + message);
    }
}
123456789
```

#### 2.2.1 @RabbitListener注解

- `@RabbitListener`，其中queues属性通过识别队列的名字来接受消息进行消费

### 2.3 创建消息的发送器

```java
@Service
@Slf4j
public class MQSender {

    @Autowired
    //AmqpTemplate接口定义了发送和接收消息的基本操作
    AmqpTemplate amqpTemplate;

    public void send(Object message){
        String msg = RedisService.beanToString(message);
        log.info("send message:" + msg);
        amqpTemplate.convertAndSend(MQConfig.QUEUE_NAME,msg);
    }
}
1234567891011121314
```

测试通过 ↓
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716165300289.png)

------

## 3. 预先配置

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716194032540.png)

------

## 4. Topic Exchange

- **任何发送到Topic Exchange的消息都会被转发到与routingKey匹配的队列上**

### 4.1 进行配置

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716194739570.png)

### 4.2 编写消息发送者

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716194916953.png)

### 4.3 编写消息接收器

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716195031442.png)

### 4.4 测试结果

- 我们只绑定了队列1和队列2，根据消息发送者，会为队列1和队列2各发送一条消息，队列1和队列2各收到一条消息
- 测试内容
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/2020071619525022.png)
- 测试结果
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716195331704.png)

------

## 5. Fanout Exchange

- **任何发送到Fanout Exchange的消息都会被转发到与之绑定的队列上**

### 5.1 进行配置

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716195912138.png)

### 5.2 编写消息发送者

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/2020071620004565.png)

### 5.3 编写消息接受器

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716195031442-1607862601760.png)

### 5.4 测试结果

- 根据条件，我们可以知道Fanout Exchange进行广播，每个队列都会收到消息
- 测试内容![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716200231166.png)
- 测试结果
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/2020071620031624.png)

------

## 6. Headers Exchange

- **任何发送到Headers Exchange的消息，都会和其中存储的条件进行匹配，有whereall和whereAny的区别（全部匹配/任何匹配）**

### 6.1 进行配置

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716193836266.png)

### 6.2 编写消息发送者

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716193713119.png)

### 6.3 编写消息接收器

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200716194217567.png)

### 6.4 测试结果

- 根据匹配条件我们可以知道，只有3队列能接受到消息。
- 测试内容![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/2020071619431467.png)
- 测试结果
