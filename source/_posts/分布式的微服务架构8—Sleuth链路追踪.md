---
title: SpringCloud Sleuth分布式请求链路追踪
tags: [DistributedMicroservices]
categories: [分布式]
slug: springcloud-sleuth-distributed-request-link-tracking
date: 2020-08-19T17:52:50+08:00
cover: https://cdn.kayleh.top/gh/kayleh/cdn/img/index2.jpg
---

SpringCloud Sleuth分布式请求链路追踪

<!--more-->

为什么会出现这个技术？需要解决哪些问题？

![1597832055850](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/0.png)

<img src="1.png" alt="1597832064671" style="zoom: 50%;" />

Spring Cloud Sleuth提供了一套完整的服务跟踪的解决方案

在分布式系统中提供追踪解决方案并且兼容支持了zipkin

解决

![1597832119213](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/2.png)



## zipkin

下载

SpringCloud从F版起已不需要自己构建Zipkin server了，只需要调用jar包即可

https://dl.bintray.com/openzipkin/maven/io/zipkin/java/zipkin-server/

zipkin-server-2.12.9.exec.jar

**运行jar**

java -jar zipkin-server-2.12.9-exec.jar

![1597832503297](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/3.png)



运行控制台

> http://localhost:9411/zipkin/

完整的调用链路

![1597835169702](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/4.png)

![1597835215535](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/5.png)

Trace:类似于树结构的Span集合，表示一条调用链路，存在唯一标识

span:表示调用链路来源，通俗的理解span就是一次请求信息

## 服务提供者

cloud-provider-payment8001

pom

```xml
 <!--包含了sleuth+zipkin-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zipkin</artifactId>
        </dependency>
```

yaml

```yaml
server:
  port: 8001


spring:
  application:
    name: cloud-payment-service
  zipkin:
    base-url: http://localhost:9411
  sleuth:
    sampler:
   	#采样率值介于0到1之间，1则表示全部采集
    probability: 1
  datasource:
    type: com.alibaba.druid.pool.DruidDataSource
    driver-class-name: org.gjt.mm.mysql.Driver
    url: 
    username: root
    password: 

mybatis:
  mapperLocations: classpath:mapper/*.xml
  type-aliases-package: com.kayleh.springcloud.entities


eureka:
  client:
    register-with-eureka: true
    fetchRegistry: true
    service-url:
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka  #集群版
  instance:
    instance-id: payment8001
    prefer-ip-address: true
```

业务类OrderController

```java
package com.kayleh.springcloud.controller;
 
import com.kayleh.springcloud.entities.CommonResult;
import com.kayleh.springcloud.entities.Payment;
import com.kayleh.springcloud.service.PaymentService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.web.bind.annotation.*;
import org.springframework.cloud.client.discovery.DiscoveryClient;
 
import javax.annotation.Resource;
import java.util.List;
import java.util.concurrent.TimeUnit;
 
 
@RestController
@Slf4j
public class PaymentController
{
    @Resource
    private PaymentService paymentService;
 
    @Value("${server.port}")
    private String serverPort;
 
    @Resource
    private DiscoveryClient discoveryClient;
 
    @PostMapping(value = "/payment/create")
    public CommonResult create(@RequestBody Payment payment)
    {
        int result = paymentService.create(payment);
        log.info("*****插入结果："+result);
 
        if(result > 0)
        {
            return new CommonResult(200,"插入数据库成功,serverPort: "+serverPort,result);
        }else{
            return new CommonResult(444,"插入数据库失败",null);
        }
    }
 
    @GetMapping(value = "/payment/get/{id}")
    public CommonResult<Payment> getPaymentById(@PathVariable("id") Long id)
    {
        Payment payment = paymentService.getPaymentById(id);
 
        if(payment != null)
        {
            return new CommonResult(200,"查询成功,serverPort:  "+serverPort,payment);
        }else{
            return new CommonResult(444,"没有对应记录,查询ID: "+id,null);
        }
    }
 
    @GetMapping(value = "/payment/discovery")
    public Object discovery()
    {
        List<String> services = discoveryClient.getServices();
        for (String element : services) {
            log.info("*****element: "+element);
        }
 
        List<ServiceInstance> instances = discoveryClient.getInstances("CLOUD-PAYMENT-SERVICE");
        for (ServiceInstance instance : instances) {
            log.info(instance.getServiceId()+"\t"+instance.getHost()+"\t"+instance.getPort()+"\t"+instance.getUri());
        }
 
        return this.discoveryClient;
    }
 
    @GetMapping(value = "/payment/lb")
    public String getPaymentLB()
    {
        return serverPort;
    }
 
    @GetMapping(value = "/payment/feign/timeout")
    public String paymentFeignTimeout()
    {
        // 业务逻辑处理正确，但是需要耗费3秒钟
        try { TimeUnit.SECONDS.sleep(3); } catch (InterruptedException e) { e.printStackTrace(); }
        return serverPort;
    }
 
    @GetMapping("/payment/zipkin")
    public String paymentZipkin()
    {
        return "hi ,i'am paymentzipkin server fall back，welcome to kayleh，O(∩_∩)O哈哈~";
    }
}

```

## 服务消费者（调用方）

cloud-consumer-order80

POM

```xml
 <!--包含了sleuth+zipkin-->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-zipkin</artifactId>
        </dependency>
```

yml

```yml
server:
  port: 80
 
spring:
    application:
        name: cloud-order-service
    zipkin:
      base-url: http://localhost:9411
    sleuth:
      sampler:
        probability: 1
 
eureka:
  client:
    #表示是否将自己注册进EurekaServer默认为true。
    register-with-eureka: false
    #是否从EurekaServer抓取已有的注册信息，默认为true。单节点无所谓，集群必须设置为true才能配合ribbon使用负载均衡
    fetchRegistry: true
    service-url:
      #单机
      #defaultZone: http://localhost:7001/eureka
      # 集群
      defaultZone: http://eureka7001.com:7001/eureka,http://eureka7002.com:7002/eureka  # 集群版
```

业务类OrderController

```java
 // ====================> zipkin+sleuth
    @GetMapping("/consumer/payment/zipkin")
    public String paymentZipkin()
    {
        String result = restTemplate.getForObject("http://localhost:8001"+"/payment/zipkin/", String.class);
        return result;
    }
```

## 依次启动eureka7001/8001/80

80调用8001几次测试下

```
http://localhost/consumer/payment/zipkin
```



## 打开浏览器访问:http:localhost:9411

会出现以下界面

![1597835524811](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/6.png)

查看

![1597835538196](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/7.png)

查看依赖关系

原理

![1597835568713](https://cdn.kayleh.top/gh/kayleh/cdn/img/分布式的微服务架构8/8.png)

