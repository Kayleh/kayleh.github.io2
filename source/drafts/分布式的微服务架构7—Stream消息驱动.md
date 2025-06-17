---
title: SpringCloud Stream消息驱动
tags: [DistributedMicroservices]
categories: [分布式]
slugs: springcloud-stream-message-driver
date: 2020-08-14T23:33:07+08:00

---

SpringCloud Stream消息驱动 

<!--more-->

# 消息驱动概述

屏蔽底层消息中间件的差异，降低切换版本，统一消息的编程模型

![1597388512890](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/1.png)

![1597388531508](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/2.png)

Spring Cloud Stream中文指导手册

https://m.wang1314.com/doc/webapp/topic/20971999.html

### 设计思想

##### 标准MQ

![1597828873174](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/3.png)

> 生产者/消费者之间靠消息媒介传递信息内容:\
>
> `Message`
>
> 消息必须走特定的通道	
>
> `消息通道MessageChannel`
>
> 消息通道里的消息如何被消费呢，谁负责收发处理:	
>
> `消息通道MessageChannel的子接口SubscribableChannel,由MessageHandler消息处理器订阅`

##### 为什么用Cloud Stream

![1598076856767](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/1598076856767.png)

![1598076876160](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/4.png)

![1598076887339](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/1598076887339.png)

stream凭什么可以统一底层差异

![1597828959376](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/5.png)

![1597828966885](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/6.png)

Binder

![1597828986684](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/8.png)

![1597828994579](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/7.png)

![1597829004031](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/9.png)

> INPUT对应于消费者
>
> OUTPUT对应于生产者

##### Stream中的消息通信方式遵循了发布-订阅模式

Topic主题进行广播

> 在RabbitMQ就是Exchange
>
> 在kafka中就是Topic

##### Spring Cloud Stream标准流程套路

![1597829077773](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/10.png)

![1597829087752](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/11.png)

> **Binder**
>
> 很方便的连接中间件，屏蔽差异
>
> **Channel**
>
> 通道，是队列Queue的一种抽象，在消息通讯系统中就是实现存储和转发的媒介，通过对Channel对队列进行配置
>
> **Source和Sink**
>
> 简单的可理解为参照对象是Spring Cloud Stream自身，从Stream发布消息就是输出，接受消息就是输入

##### 编码API和常用注解

![1597829175675](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/12.png)

# 案例说明

RabbitMQ环境已经OK

工程中新建三个子模块

> cloud-stream-rabbitmq-provider8801,作为生产者进行发消息模块
>
> cloud-stream-rabbitmq-consumer8802,作为消息接收模块
>
> cloud-stream-rabbitmq-consumer8803,作为消息接收模块

### 消息驱动之生产者

新建Module  

cloud-stream-rabbitmq-provider8801

pom

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-eureka-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <dependency>
            <groupId>com.kayleh.springcloud</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>


        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>

     
        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-devtools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
```

yaml

```yaml
server:
  port: 8801

spring:
  application:
    name: cloud-stream-provider
  cloud:
    stream:
      binders: # 在此处配置要绑定的rabbitmq的服务信息；
        defaultRabbit: # 表示定义的名称，用于于binding整合
          type: rabbit # 消息组件类型
          environment: # 设置rabbitmq的相关的环境配置
            spring:
              rabbitmq:
                host: localhost
                port: 5672
                username: guest
                password: guest
      bindings: # 服务的整合处理
        output: # 这个名字是一个通道的名称
          destination: studyExchange # 表示要使用的Exchange名称定义
          content-type: application/json # 设置消息类型，本次为json，文本则设置“text/plain”
          binder: defaultRabbit  # 设置要绑定的消息服务的具体设置

eureka:
  client: # 客户端进行Eureka注册的配置
    service-url:
      defaultZone: http://localhost:7001/eureka
  instance:
    lease-renewal-interval-in-seconds: 2 # 设置心跳的时间间隔（默认是30秒）
    lease-expiration-duration-in-seconds: 5 # 如果现在超过了5秒的间隔（默认是90秒）
    instance-id: send-8801.com  # 在信息列表时显示主机名称
    prefer-ip-address: true     # 访问的路径变为IP地址
```

主启动类StreamMQMain8801

```java
package com.kayleh.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StreamMQMain8801 {
    public static void main(String[] args) {
        SpringApplication.run(StreamMQMain8801.class, args);
    }
}
```

##### 业务类

发送消息接口

```java
package com.kayleh.springcloud.service;

public interface IMessageProvider
{
    public String send();
}
```

发送消息接口实现类

```java
package com.kayleh.springcloud.service.impl;

@EnableBinding(Source.class) //定义消息的推送管道
public class MessageProviderImpl implements IMessageProvider
{
    @Resource
    private MessageChannel output; // 消息发送管道

    @Override
    public String send()
    {
        String serial = UUID.randomUUID().toString();
        output.send(MessageBuilder.withPayload(serial).build());
        System.out.println("*****serial: "+serial);
        return null;
    }
}
```

Controller

```java
package com.kayleh.springcloud.controller;

import com.kayleh.springcloud.service.IMessageProvider;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.annotation.Resource;

@RestController
public class SendMessageController
{
    @Resource
    private IMessageProvider messageProvider;

    @GetMapping(value = "/sendMessage")
    public String sendMessage()
    {
        return messageProvider.send();
    }
}
```

测试

启动7001eureka

启动rabbitmq:

> rabbitmq-plugins enable rabbitmq_management
>
> http://localhost:15672/

启动8801

访问http://localhost:8801/sendMessage

### 消息驱动之消费者

新建Module

cloud-stream-rabbitmq-consumer8802

pom

```xml
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework.cloud/spring-cloud-starter-eureka-server -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>

        <dependency>
            <groupId>com.kayleh.springcloud</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>


        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-web -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>


        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-devtools -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.projectlombok/lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <!-- https://mvnrepository.com/artifact/org.springframework.boot/spring-boot-starter-test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
```

yml

```yaml
server:
  port: 8802

spring:
  application:
    name: cloud-stream-consumer
  cloud:
    stream:
      binders: # 在此处配置要绑定的rabbitmq的服务信息；
        defaultRabbit: # 表示定义的名称，用于于binding整合
          type: rabbit # 消息组件类型
          environment: # 设置rabbitmq的相关的环境配置
            spring:
              rabbitmq:
                host: localhost
                port: 5672
                username: guest
                password: guest
      bindings: # 服务的整合处理
        input: # 这个名字是一个通道的名称
          destination: studyExchange # 表示要使用的Exchange名称定义
          content-type: application/json # 设置消息类型，本次为json，文本则设置“text/plain”
          binder: defaultRabbit  # 设置要绑定的消息服务的具体设置

eureka:
  client: # 客户端进行Eureka注册的配置
    service-url:
      defaultZone: http://localhost:7001/eureka
  instance:
    lease-renewal-interval-in-seconds: 2 # 设置心跳的时间间隔（默认是30秒）
    lease-expiration-duration-in-seconds: 5 # 如果现在超过了5秒的间隔（默认是90秒）
    instance-id: receive-8802.com  # 在信息列表时显示主机名称
    prefer-ip-address: true     # 访问的路径变为IP地址
```

主启动类StreamMQMain8802

```java
package com.kayleh.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StreamMQMain8802 {

    public static void main(String[] args) {
        SpringApplication.run(StreamMQMain8802.class, args);
    }
}
```

controller

```java
package com.kayleh.springcloud.controller;

import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.messaging.Message;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.stereotype.Component;

@Component
@EnableBinding(Sink.class)
public class ReceiveMessageListenerController {
    @Value("${server.port}")
    private String serverPort;

    @StreamListener(Sink.INPUT)
    public void input(Message<String> message) {
        System.out.println("消费者1号，接受："+message.getPayload()+"\t port:"+serverPort);
    }
}
```

测试8801发送8802接收消息

> http://localhost:8801/sendMessage

### 分组消费与持久化

##### 依照8802，clone出来一份运行8803

cloud-stream-rabbitmq-consumer8803

pom

```xml
 <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-stream-rabbit</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        <!--基础配置-->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

```

yaml

```yaml
server:
  port: 8803

spring:
  application:
    name: cloud-stream-consumer
  cloud:
      stream:
        binders: # 在此处配置要绑定的rabbitmq的服务信息；
          defaultRabbit: # 表示定义的名称，用于于binding整合
            type: rabbit # 消息组件类型
            environment: # 设置rabbitmq的相关的环境配置
              spring:
                rabbitmq:
                  host: localhost
                  port: 5672
                  username: guest
                  password: guest
        bindings: # 服务的整合处理
          input: # 这个名字是一个通道的名称
            destination: studyExchange # 表示要使用的Exchange名称定义
            content-type: application/json # 设置消息类型，本次为对象json，如果是文本则设置“text/plain”
            binder: defaultRabbit # 设置要绑定的消息服务的具体设置
            group: kaylehA

eureka:
  client: # 客户端进行Eureka注册的配置
    service-url:
      defaultZone: http://localhost:7001/eureka
  instance:
    lease-renewal-interval-in-seconds: 2 # 设置心跳的时间间隔（默认是30秒）
    lease-expiration-duration-in-seconds: 5 # 如果现在超过了5秒的间隔（默认是90秒）
    instance-id: receive-8803.com  # 在信息列表时显示主机名称
    prefer-ip-address: true     # 访问的路径变为IP地址
```

主启动类

```java
package com.kayleh.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class StreamMQMain8803
{
    public static void main(String[] args)
    {
        SpringApplication.run(StreamMQMain8803.class,args);
    }
}
```

业务类

```java
package com.kayleh.springcloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.stream.annotation.EnableBinding;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.cloud.stream.messaging.Sink;
import org.springframework.messaging.Message;
import org.springframework.stereotype.Component;
 
@Component
@EnableBinding(Sink.class)
public class ReceiveMessageListenerController
{
    @Value("${server.port}")
    private String serverPort;

    @StreamListener(Sink.INPUT)
    public void input(Message<String> message)
    {
        System.out.println("消费者2号,----->接受到的消息: "+message.getPayload()+"\t  port: "+serverPort);
    }
}
```

启动

> 7001服务注册
>
> 8801消息生产
>
> 8802消息消费
>
> 8803消息消费

运行后两个问题

> 有重复消费问题
>
> 消息持久化问题

消费

> 目前是8802/8803同时都收到了，存在重复消费问题
>
> http://localhost:8801/sendMessage
>
> 如何解决?
>
> 分组和持久化属性group
>
> 重要
>
> 生产实际案例
>
> ![1597830160806](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/13.png)
>
> ![1597830172304](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/14.png)

##### 分组

- 原理

  > 微服务应用放置于
  >
  > 同一个group中，就能够保证消息只会被其中一个应用消费一次。
  >
  > 不同的组是可以消费的，同一个组内会发生竞争关系，只有其中一个可以消费。

- 8802/8803都变成不同组，group两个不同

  > group: kaylehA、kaylehB
  >
  > 8802修改YML
  >
  > 在binder下面添加
  >
  > ```yaml
  > group:  kaylehA
  > ```
  >
  > 8803修改YML
  >
  > ```yaml
  > group:  kaylehB
  > ```
  >
  > 我们自己配置
  >
  > ![1597830340659](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构7/15.png)
  >
  > 结论
  >
  > 还是重复消费
  
- 8802/8803实现了轮询分组，每次只有一个消费者 8801模块的发的消息只能被8802或8803其中一个接收到，这样避免了重复消费

- 8802/8803都变成相同组，group两个相同

  > group: kaylehA
  >
  > 8802修改YML
  >
  > ```yaml
  > group:  kaylehA
  > ```
  >
  > 8803修改YML
  >
  > ```yaml
  > group:  kaylehA
  > ```
  >
  > 结论
  >
  > 同一个组的多个微服务实例，每次只会有一个拿到

##### 持久化

通过上述，解决了重复消费问题，再看看持久化

停止8802/8803并去除掉8802的分组group:kaylehA

8803的分组group:kaylehA没有去掉

8801先发送4条信息到rabbitmq

先启动8802，无分组属性配置，后台没有打出来消息

先启动8803，有分组属性配置，后台打出来了MQ上的消息
