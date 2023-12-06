---
title: SpringCloud Bus消息总线
tags: [DistributedMicroservices]
categories: [分布式]
translate_title: springcloud-bus-message
date: 2020-08-14T23:29:28+08:00
---

SpringCloud Bus 消息总线 

<!--more-->

上一讲解的加深和扩充，一言以蔽之

- 分布式自动刷新配置功能

- Spring Cloud Bus配合Spring Cloud Config使用可以实现配置的动态刷新

##### 是什么？

![1597326106343](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/1.png)

Bus支持两种消息代理：RabbitMQ和Kafka

##### 能干嘛？

![1597326181455](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/2.png)

##### 为何被称为总线

![1597326216800](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/3.png)

## RabbitMQ环境配置

安装Erlang，下载地址：http://erlang.org/download/otp_win64_21.3.exe

![1597326251762](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/4.png)

![1597326263813](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/5.png)

安装RabbitMQ，下载地址

https://dl.bintray.com/rabbitmq/all/rabbitmq-server/3.7.14/rabbitmq-server-3.7.14.exe

![1597326363871](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/6.png)

进入RabbitMQ安装目录下的sbin目录

如例我自己本机D:\scmq\rabbitmq_server-3.7.14\sbin

![1597326403266](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/7.png)

输入以下命令启动管理功能

rabbitmq-plugins enable rabbitmq_management

![1597326436344](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/8.png)

可视化插件

![1597326454063](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/9.png)

访问地址查看是否安装成功

```
http://localhost:15672/
```

输入账号密码并登录: guest guest

## SpringCloud Bus动态刷新全局广播

必须先具备良好的RabbitMQ环境先

演示广播效果，增加复杂度，再以3355为模板再制作一个3366

新建cloud-config-client-3366

pom

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-config</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>com.kayleh.springcloud</groupId>
        <artifactId>cloud-api-commons</artifactId>
        <version>${project.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

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

bootstrap.yml

```yaml
server:
  port: 3366

spring:
  application:
    name: config-client
  cloud:
    config:
      label: master
      name: config
      profile: dev
      uri: http://localhost:3344
eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

主启动类

```java
package com.kayleh.springcloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@EnableEurekaClient
@SpringBootApplication
public class ConfigClientMain3366 {
    public static void main(String[] args) {
            SpringApplication.run( ConfigClientMain3366.class,args);
        }
}
 
```

controller

```java
package com.kayleh.springcloud.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RefreshScope
public class ConfigClientController {

    @Value("${server.port}")
    private String serverPort;

    @Value("${config.info}")
    private String configInfo;


    @GetMapping("/configInfo")
    public String getConfigInfo(){
        return "serverPort:"+serverPort+"\t\n\n configInfo: "+configInfo;
    }
}
```

#### 设计思想

1) 利用消息总线触发一个客户端/bus/refresh,而刷新所有客户端的配置

![1597386232917](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/10.png)

![1597386240399](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/11.png)

2) 利用消息总线触发一个服务端ConfigServer的/bus/refresh端点,而刷新所有客户端的配置（更加推荐）

![1597386285571](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/13.png)

![1597386240399](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/11.png)

> ####  图二的架构显然更加合适，图一不适合的原因如下
>
> 打破了微服务的职责单一性，因为微服务本身是业务模块，它本不应该承担配置刷新职责
>
> 破坏了微服务各节点的对等性
>
> 有一定的局限性。例如，微服务在迁移时，它的网络地址常常会发生变化，此时如果想要做到自动刷新，那就会增加更多的修改

##### 给cloud-config-center-3344配置中心服务端添加消息总线支持

pom

```xml
<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

yml

```yaml
server:
  port: 3344
spring:
  application:
    name: cloud-config-center
  cloud:
    config:
      server:
        git:
          uri:  https://github.com/hhf19906/springcloud-config.git  #git@github.com:hhf19906/springcloud-config.git
          search-paths:
            - springcloud-config
      label: master

rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

eureka:
  client:
    service-url:
      defaultZone:  http://localhost:7001/eureka

management:
  endpoints:
    web:
      exposure:
        include: 'bus-refresh'
```

##### 给cloud-config-center-3355客户端添加消息总线支持

pom

```xml
<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

bootstrap.yml

```yaml
server:
  port: 3355

spring:
  application:
    name: config-client
  cloud:
    config:
      label: master
      name: config
      profile: dev
      uri: http://localhost:3344

rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

eureka:
  client:
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka
management:
  endpoints:
    web:
      exposure:
        include: "*"
```

##### 给cloud-config-center-3366客户端添加消息总线支持

pom

```xml
<dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-bus-amqp</artifactId>
</dependency>
```

yml

```yaml
server:
  port: 3366

spring:
  application:
    name: config-client
  cloud:
    config:
      label: master
      name: config
      profile: dev
      uri: http://localhost:3344


  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest

eureka:
  client:
    service-url:
      defaultZone:  http://localhost:7001/eureka

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

测试

运维工程师

> 修改Github上配置文件增加版本号
>
> 发送Post请求
>
> ![图像](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/12.png)
>
> ```cmd
> curl -X POST "http://localhost:3344/actuator/bus-refresh"
> ```

配置中心

> ```http
> http://config-3344.com/config-dev.yml
> ```

客户端

> ```http
> http://localhost:3355/configInfo
> http://localhost:3366/configInfo
> ```
>
> 获取配置信息，发现都已经刷新了

一次发送，处处生效

## SpringCloud Bus动态刷新定点通知

不想全部通知，只想定点通知,只通知3355, 不通知3366

简单一句话. 指定具体某一个实例生效而不是全部

公式：http://localhost:配置中心的端口号/actuator/bus-refresh/{destination}

/bus/refresh请求不再发送到具体的服务实例上，而是发给config server并通过destination参数类指定需要更新配置的服务或实例

我们这里以刷新运行在3355端口上的config-client为例.  只通知3355, 不通知3366

![1597386973424](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/15.png)

```cmd
curl -X POST "http://localhost:3344/actuator/bus-refresh/config-client:3355"
```

#### 通知总结All

![1597387025181](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构6/14.png)

