---
title: Sentinel实现熔断与限流
tags: [DistributedMicroservices]
categories: [分布式]
translate_title: sentinel-realizes-fusing-and-current-limiting
date: 2020-08-24T21:18:27+08:00
cover: https://cdn.kayleh.top/gh/kayleh/cdn/img/index4.jpg
---

Sentinel

<!--more-->

### 是什么

Hystrix

### 下载

https://github.com/alibaba/Sentinel/releases

![1598275246796](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/1.png)

### 怎么使用？

https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_sentinel

#### 服务使用中的各种问题

> 服务雪崩
>
> 服务降级
>
> 服务熔断
>
> 服务限流

## 安装Sentinel控制台

### sentinel组件由2部分组成

![1598275337431](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/2.png)

> 后台
>
> 前台8080

### 安装步骤

#### 下载

> https://github.com/alibaba/Sentinel/releases
>
> 下载到本地sentinel-dashboard-1.7.0.jar

#### 运行命令

前提:

- java8环境OK
- 8080端口不能被占用

命令:

```cmd
java -jar sentinel-dashboard-1.7.0.jar 
```

#### 访问sentinel管理界面

> http://localhost:8080
>
> 登录账号密码均为sentinel

## 初始化演示工程

启动Nacos8848成功

> http://localhost:8848/nacos/#/login

#### Module

##### cloudalibaba-sentinel-service8401

##### POM

```xml
	<dependencies>
        <dependency>
            <groupId>com.atguigu.springcloud</groupId>
            <artifactId>cloud-api-commons</artifactId>
            <version>${project.version}</version>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.csp</groupId>
            <artifactId>sentinel-datasource-nacos</artifactId>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
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
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>4.6.3</version>
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

##### YML

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
      #nacos服务注册中心地址
        server-addr: localhost:8848
    sentinel:
      transport:
        dashboard: localhost:8080
        port: 8719  #默认8719，假如被占用了会自动从8719开始依次+1扫描。直至找到未被占用的端口

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

##### 主启动

```java
package com.atguigu.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@EnableDiscoveryClient
@SpringBootApplication
public class MainApp8401
{
    public static void main(String[] args) {
        SpringApplication.run(MainApp8401.class, args);
    }
}
```

##### 业务类FlowLimitController

```java
package com.atguigu.springcloud.alibaba.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class FlowLimitController
{
    @GetMapping("/testA")
    public String testA() {
        return "------testA";
    }

    @GetMapping("/testB")
    public String testB() {

        return "------testB";
    }
}
```

#### 启动Sentinel8080

```java
java -jar sentinel-dashboard-1.7.0
```

#### 启动微服务8401

#### 启动8401微服务后查看sentienl控制台

空空如也，啥都没有

### Sentinel采用的懒加载说明

执行一次访问即可

http://localhost:8401/testA

http://localhost:8401/testB

##### 效果

![1598275789442](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/3.png)

##### 结论

sentinel8080正在监控微服务8401

## 流控规则

### 基本介绍

![1598275892803](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/4.png)

进一步解释说明

![1598275917235](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/5.png)

![1598275930554](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/6.png)

### 流控模式

#### 直接（默认）

##### 直接->快速失败

- 系统默认

##### 配置及说明

##### ![1598276075851](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/7.png)测试

```
快速点击访问http://localhost:8401/testA
```

结果

Blocked by Sentinel (flow limiting)

思考？？？

直接调用默认报错信息，技术方面OK but，是否应该有我们自己的后续处理？

类似有一个fallback的兜底方法？

#### 关联

##### 是什么？

当关联的资源达到阈值时，就限流自己

当与A关联的资源B达到阈值后，就限流自己

B惹事，A挂了

##### 配置A

![1598276511243](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/8.png)

##### postman模拟并发密集访问testB

先把请求save as，保存到Collections

![1598276562818](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/9.png)

访问testB成功

- ![1598276623255](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/10.png)

postman里新建多线程集合组

- ![1598276640905](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/11.png)

将访问地址添加进新线程组

- ![1598276659894](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/12.png)

Run

- 大批量线程高并发访问B，导致A失效了

##### 运行后发现testA挂了

> 点击访问http://localhost:8401/testA
>
> 结果
>
> Blocked by Sentinel (flow limiting)

#### 链路

多个请求调用了同一个微服务

家庭作业试试

### 流控效果

#### 直接->快速失败（默认的流控处理）

直接失败，抛出异常

- Blocked by Sentinel (flow limiting)

源码

- com.alibaba.csp.sentinel.slots.block.flow.controller.DefaultController

#### 预热

##### 说明

- 公式：阈值除以coldFactor（默认值为3），经过预热时长后才会达到阈值

##### 官网

- 默认coldFactor为3，即请求QPS从threshold/3开始，经预热时长逐渐升至设定的QPS阈值。

- 限流 冷启动

  https://github.com/alibaba/Sentinel/wiki/%E9%99%90%E6%B5%81---%E5%86%B7%E5%90%AF%E5%8A%A8

##### 源码

com.alibaba.csp.sentinel.slots.block.flow.controller.WarmUpController

![1598276768339](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/14.png)

##### Warmup配置

![1598277103340](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/15.png)

##### 多次点击http://localhost:8401/testB

- 刚开始不行，后续慢慢OK

##### 应用场景

![1598277148535](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/16.png)

#### 排队等待

![1598276768339](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/13.png)

##### 匀速排队，阈值必须设置为QPS

##### 官网

##### 源码

com.alibaba.csp.sentinel.slots.block.flow.controller.RateLimiterController

##### 测试

testB在控制台输出日志sl4j

```java
log.info(thread.currentThread.getName()+"\t"+"...testB")
```

![1598277222170](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/17.png)

### 降级规则

#### 基本介绍

![1598277395163](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/18.png)

![1598277412123](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/19.png)

进一步说明

##### Sentinel的断路器是没有半开状态的

> 半开的状态系统自动去检测是否请求有异常，没有异常就关闭断路器恢复使用，有异常则继续打开断路器不可用。具体可以参考Hystrix

复习Hystrix

![1598277556742](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/20.png)

![1598277592247](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/21.png)

### 降级策略实战

#### RT

##### 是什么?

![1598277795422](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/22.png)

![1598277815933](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/23.png)

##### 测试

代码

```java
    @GetMapping("/testD")
    public String testD()
    {
        try { TimeUnit.SECONDS.sleep(1); } catch (InterruptedException e) { e.printStackTrace(); }
        log.info("testD 测试RT");

        return "------testD";
    }

```

配置

![1598277885759](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/24.png)

jmeter压测

结论

![1598277904111](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/25.png)

![1598277918812](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/26.png)

#### 异常比例

是什么

![1598277953235](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/27.png)

![1598277965489](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/28.png)

测试

- 代码

  ```java
  @GetMapping("/testD")
      public String testD()
      {
  
          log.info("testD 测试RT");
          int age = 10/0;
          return "------testD";
      }
  ```

- 配置

  ![1598278071559](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/29.png)

- jmeter

  ![1598278103683](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/30.png)

- 结论

  ![1598278121021](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/1598278121021.png)

#### 异常数

是什么

![1598278157875](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/31.png)

![1598278172535](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/32.png)

异常数是按照分钟统计的

测试

- 代码

```java
@GetMapping("/testE")
public String testE()
{
    log.info("testE 测试异常数");
    int age = 10/0;
    return "------testE 测试异常数";
}
```

- 配置

http://localhost:8401/testE

![1598278242551](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/33.png)

- jmeter

## 热点key限流

#### 基本介绍

是什么

![1598281015660](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/34.png)

https://github.com/alibaba/Sentinel/wiki/热点参数限流

#### 承上启下复习start

![1598281047415](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/35.png)

@SentinelResource

#### 代码

```java
@GetMapping("/testHotKey")
@SentinelResource(value = "testHotKey",blockHandler = "deal_testHotKey")
public String testHotKey(@RequestParam(value = "p1",required = false) String p1,
                         @RequestParam(value = "p2",required = false) String p2) {
    //int age = 10/0;
    return "------testHotKey";
}
 
//兜底方法
public String deal_testHotKey (String p1, String p2, BlockException exception){
    return "------deal_testHotKey,o(╥﹏╥)o";  
}
```

com.alibaba.csp.sentinel.slots.block.BlockException

#### 配置

配置

![1598281119051](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/36.png)

1

@SentinelResource(value = "testHotKey")

异常打到了前台用户界面看不到，不友好

2

@SentinelResource(value = "testHotKey",blockHandler = "deal_testHotKey")

方法testHostKey里面第一个参数只要QPS超过每秒1次，马上降级处理

用了我们自己定义的

#### 测试

 :x: error

```java
http://localhost:8401/testHotKey?p1=abc
```

 :x: error

```java
http://localhost:8401/testHotKey?p1=abc&p2=33
```

 :heavy_check_mark: right

```java
http://localhost:8401/testHotKey?p2=abc
```

#### 参数例外项

上述案例演示了第一个参数p1,当QPS超过1秒1次点击后马上被限流

特殊情况

> 普通
>
> - 超过1秒钟一个后，达到阈值1后马上被限流
>
> 我们期望p1参数当它是某个特殊值时，它的限流值和平时不一样
>
> 特例
>
> - 假如当p1的值等于5时，它的阈值可以达到200

配置

![1598281694486](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/37.png)

![1598281694486](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/38.png)

- 添加按钮不能忘

##### 测试

> :heavy_check_mark: http://localhost:8401/testHotKey?p1=5
>
>  :x:http://localhost:8401/testHotKey?p1=3
>
> 当p1等于5的时候，阈值变为200
>
> 当p1不等于5的时候，阈值就是平常的1

##### 前提条件

热点参数的注意点，参数必须是基本类型或者String

#### 其他,

添加异常看看....

![1598281913264](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/39.png)

## 系统规则

是什么？

> https://github.com/alibaba/Sentinel/wiki/%E7%B3%BB%E7%BB%9F%E8%87%AA%E9%80%82%E5%BA%94%E9%99%90%E6%B5%81

各项配置参数说明

![1598337022929](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/40.png)

配置全局QPS

## @SentinelResource

### 按资源名称限流+后续处理

启动Nacos成功

启动Sentinel成功

Module

> cloudalibaba-sentinel-service8401
>
> POM
>
> ```xml
> <dependency>
>     <groupId>com.atguigu.springcloud</groupId>
>     <artifactId>cloud-api-commons</artifactId>
>     <version>${project.version}</version>
> </dependency>
> ```
>
> yml
>
> ```yaml
> server:
>   port: 8401
> 
> spring:
>   application:
>     name: cloudalibaba-sentinel-service
>   cloud:
>     nacos:
>       discovery:
>         server-addr: localhost:8848
>     sentinel:
>       transport:
>         dashboard: localhost:8080
>         port: 8719  #默认8719，假如被占用了会自动从8719开始依次+1扫描。直至找到未被占用的端口
> 
> management:
>   endpoints:
>     web:
>       exposure:
>         include: '*'
> ```
>
> 业务类RateLimitController
>
> ```java
> package com.atguigu.springcloud.alibaba.controller;
> 
> import com.alibaba.csp.sentinel.annotation.SentinelResource;
> import com.alibaba.csp.sentinel.slots.block.BlockException;
> 
> import com.atguigu.springcloud.entities.*;
> import org.springframework.web.bind.annotation.GetMapping;
> import org.springframework.web.bind.annotation.RestController;
> 
> 
> @RestController
> public class RateLimitController
> {
>     @GetMapping("/byResource")
>     @SentinelResource(value = "byResource",blockHandler = "handleException")
>     public CommonResult byResource()
>     {
>         return new CommonResult(200,"按资源名称限流测试OK",new Payment(2020L,"serial001"));
>     }
>     public CommonResult handleException(BlockException exception)
>     {
>         return new CommonResult(444,exception.getClass().getCanonicalName()+"\t 服务不可用");
>     }
> ```
>
> 主启动
>
> ```java
> package com.atguigu.springcloud.alibaba;
> 
> import org.springframework.boot.SpringApplication;
> import org.springframework.boot.autoconfigure.SpringBootApplication;
> import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
> 
> 
> @EnableDiscoveryClient
> @SpringBootApplication
> public class MainApp8401
> {
>     public static void main(String[] args) {
>         SpringApplication.run(MainApp8401.class, args);
>     }
> 
> }
> ```

配置流控规则

- 配置步骤

![1598337203454](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/41.png)

- 图形配置和代码关系
- 表示1秒钟内查询次数大于1，就跑到我们自定义的处流，限流

测试

- 1秒钟点击1下，OK

- 超过上述问题，疯狂点击，返回了自己定义的限流处理信息，限流发送

  ![1598337235793](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/42.png)

额外问题

- 此时关闭微服务8401看看

- Sentinel控制台，流控规则消失了？？

  临时/持久？

### 按照Url地址限流+后续处理

通过访问的URL来限流，会返回Sentinel自带默认的限流处理信息

业务类RateLimitController

```java
@GetMapping("/rateLimit/byUrl")
@SentinelResource(value = "byUrl")
public CommonResult byUrl()
{
    return new CommonResult(200,"按url限流测试OK",new Payment(2020L,"serial002"));
}
```

访问一次

Sentinel控制台配置

![1598337354555](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/43.png)

测试

- 疯狂点击http://localhost:8401/rateLimit/byUrl

- ![1598337380401](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/44.png)

### 上面兜底方法面临的问题

![1598337405346](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/45.png)

### 客户自定义限流处理逻辑

创建customerBlockHandler类用于自定义限流处理逻辑

自定义限流处理类

- CustomerBlockHandler

  ![1598337444808](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/46.png)

```java
package com.atguigu.springcloud.alibaba.myhandler;

import com.alibaba.csp.sentinel.slots.block.BlockException;
import com.atguigu.springcloud.entities.*;

public class CustomerBlockHandler {

    public static CommonResult handleException(BlockException exception) {
        return new CommonResult(2020, "自定义限流处理信息....CustomerBlockHandler");

    }
}
```

RateLimitController

```java
@GetMapping("/rateLimit/customerBlockHandler")
@SentinelResource(value = "customerBlockHandler",
        blockHandlerClass = CustomerBlockHandler.class,
        blockHandler = "handlerException2")
public CommonResult customerBlockHandler()
{
    return new CommonResult(200,"按客戶自定义",new Payment(2020L,"serial003"));
}
```

启动微服务后先调用一次

> http://localhost:8401/rateLimit/customerBlockHandler

Sentinel控制台配置

测试后我们自定义的出来了

进一步说明:

![1598337533657](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/47.png)

### 更多注解属性说明

![1598337561019](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/48.png)

![1598337573475](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/49.png)

多说一句

![1598337587461](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/50.png)

Sentinel主要有三个核心API

- SphU定义资源

- Tracer定义统计

- ContextUtil定义了上下文

## 服务熔断功能

### sentinel整合ribbon+openFeign+fallback

### Ribbon系列

#### 启动nacos和sentinel

#### 提供者9003/9004

> 新建cloudalibaba-provider-payment9003/9004
>
> POM
>
> ```xml
> <dependencies>
>     <!--SpringCloud ailibaba nacos -->
>     <dependency>
>         <groupId>com.alibaba.cloud</groupId>
>         <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
>     </dependency>
>     <dependency><!-- 引入自己定义的api通用包，可以使用Payment支付Entity -->
>         <groupId>com.atguigu.springcloud</groupId>
>         <artifactId>cloud-api-commons</artifactId>
>         <version>${project.version}</version>
>     </dependency>
>     <!-- SpringBoot整合Web组件 -->
>     <dependency>
>         <groupId>org.springframework.boot</groupId>
>         <artifactId>spring-boot-starter-web</artifactId>
>     </dependency>
>     <dependency>
>         <groupId>org.springframework.boot</groupId>
>         <artifactId>spring-boot-starter-actuator</artifactId>
>     </dependency>
>     <!--日常通用jar包配置-->
>     <dependency>
>         <groupId>org.springframework.boot</groupId>
>         <artifactId>spring-boot-devtools</artifactId>
>         <scope>runtime</scope>
>         <optional>true</optional>
>     </dependency>
>     <dependency>
>         <groupId>org.projectlombok</groupId>
>         <artifactId>lombok</artifactId>
>         <optional>true</optional>
>     </dependency>
>     <dependency>
>         <groupId>org.springframework.boot</groupId>
>         <artifactId>spring-boot-starter-test</artifactId>
>         <scope>test</scope>
>     </dependency>
> </dependencies>
> ```
>
> yml
>
> ```yaml
> server:
>   port: 9003
> 
> spring:
>   application:
>     name: nacos-payment-provider
>   cloud:
>     nacos:
>       discovery:
>         server-addr: localhost:8848 #配置Nacos地址
> 
> management:
>   endpoints:
>     web:
>       exposure:
>         include: '*'
> ```
>
> - 记得修改不同的端口号
>
> 主启动
>
> ```java
> package com.atguigu.springcloud.alibaba;
> 
> import org.springframework.boot.SpringApplication;
> import org.springframework.boot.autoconfigure.SpringBootApplication;
> import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
> 
> 
> @SpringBootApplication
> @EnableDiscoveryClient
> public class PaymentMain9003
> {
>     public static void main(String[] args) {
>         SpringApplication.run(PaymentMain9003.class, args);
>     }
> }
> ```
>
> 业务类
>
> ```java
> package com.atguigu.springcloud.alibaba.controller;
> 
> import com.atguigu.springcloud.alibaba.entities.CommonResult;
> import com.atguigu.springcloud.alibaba.entities.Payment;
> import org.springframework.beans.factory.annotation.Value;
> import org.springframework.web.bind.annotation.GetMapping;
> import org.springframework.web.bind.annotation.PathVariable;
> import org.springframework.web.bind.annotation.RestController;
> 
> import java.util.HashMap;
> 
> @RestController
> public class PaymentController
> {
>     @Value("${server.port}")
>     private String serverPort;
> 
>     public static HashMap<Long, Payment> hashMap = new HashMap<>();
>     static{
>         hashMap.put(1L,new Payment(1L,"28a8c1e3bc2742d8848569891fb42181"));
>         hashMap.put(2L,new Payment(2L,"bba8c1e3bc2742d8848569891ac32182"));
>         hashMap.put(3L,new Payment(3L,"6ua8c1e3bc2742d8848569891xt92183"));
>     }
> 
>     @GetMapping(value = "/paymentSQL/{id}")
>     public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id){
>         Payment payment = hashMap.get(id);
>         CommonResult<Payment> result = new CommonResult(200,"from mysql,serverPort:  "+serverPort,payment);
>         return result;
>     }
> }
> ```
>
> 测试地址
>
> ```
> http://localhost:9003/paymentSQL/1
> ```

#### 消费者84

> 新建cloudalibaba-consumer-nacos-order84
>
> POM
>
> ```xml
>     <dependencies>
>         <dependency>
>             <groupId>org.springframework.cloud</groupId>
>             <artifactId>spring-cloud-starter-openfeign</artifactId>
>         </dependency>
>         <dependency>
>             <groupId>com.alibaba.cloud</groupId>
>             <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
>         </dependency>
>         <dependency>
>             <groupId>com.alibaba.cloud</groupId>
>             <artifactId>spring-cloud-starter-alibaba-sentinel</artifactId>
>         </dependency>
>         <dependency>
>             <groupId>com.atguigu.springcloud</groupId>
>             <artifactId>cloud-api-commons</artifactId>
>             <version>${project.version}</version>
>         </dependency>
>         <dependency>
>             <groupId>org.springframework.boot</groupId>
>             <artifactId>spring-boot-starter-web</artifactId>
>         </dependency>
>         <dependency>
>             <groupId>org.springframework.boot</groupId>
>             <artifactId>spring-boot-starter-actuator</artifactId>
>         </dependency>
>         <dependency>
>             <groupId>org.springframework.boot</groupId>
>             <artifactId>spring-boot-devtools</artifactId>
>             <scope>runtime</scope>
>             <optional>true</optional>
>         </dependency>
>         <dependency>
>             <groupId>org.projectlombok</groupId>
>             <artifactId>lombok</artifactId>
>             <optional>true</optional>
>         </dependency>
>         <dependency>
>             <groupId>org.springframework.boot</groupId>
>             <artifactId>spring-boot-starter-test</artifactId>
>             <scope>test</scope>
>         </dependency>
>     </dependencies>
> ```
>
> YML
>
> ```yaml
> server:
>   port: 84
> 
> 
> spring:
>   application:
>     name: nacos-order-consumer
>   cloud:
>     nacos:
>       discovery:
>         server-addr: localhost:8848
>     sentinel:
>       transport:
>         dashboard: localhost:8080
>         port: 8719
> 
> service-url:
>   nacos-user-service: http://nacos-payment-provider
> ```
>
> 主启动
>
> ```java
> package com.atguigu.springcloud.alibaba;
> 
> import org.springframework.boot.SpringApplication;
> import org.springframework.boot.autoconfigure.SpringBootApplication;
> import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
> import org.springframework.cloud.openfeign.EnableFeignClients;
> 
> 
> @EnableDiscoveryClient
> @SpringBootApplication
> @EnableFeignClients
> public class OrderNacosMain84
> {
>     public static void main(String[] args) {
>         SpringApplication.run(OrderNacosMain84.class, args);
>     }
> }
> ```
>
> 业务类
>
> ApplicationContextConfig
>
> ```java
> package com.atguigu.springcloud.alibaba.config;
> 
> import org.springframework.cloud.client.loadbalancer.LoadBalanced;
> import org.springframework.context.annotation.Bean;
> import org.springframework.context.annotation.Configuration;
> import org.springframework.web.client.RestTemplate;
> 
> 
> @Configuration
> public class ApplicationContextConfig
> {
>     @Bean
>     @LoadBalanced
>     public RestTemplate getRestTemplate()
>     {
>         return new RestTemplate();
>     }
> }
> ```
>
> > CircleBreakerController的全部源码
> >
> > ```java
> > package com.atguigu.springcloud.alibaba.controller;
> > 
> > import com.alibaba.csp.sentinel.annotation.SentinelResource;
> > import com.alibaba.csp.sentinel.slots.block.BlockException;
> > import com.atguigu.springcloud.alibaba.entities.CommonResult;
> > import com.atguigu.springcloud.alibaba.entities.Payment;
> > 
> > import lombok.extern.slf4j.Slf4j;
> > import org.springframework.web.bind.annotation.GetMapping;
> > import org.springframework.web.bind.annotation.PathVariable;
> > import org.springframework.web.bind.annotation.RequestMapping;
> > import org.springframework.web.bind.annotation.RestController;
> > import org.springframework.web.client.RestTemplate;
> > 
> > import javax.annotation.Resource;
> > 
> > 
> > @RestController
> > @Slf4j
> > public class CircleBreakerController {
> >    
> >     public static final String SERVICE_URL = "http://nacos-payment-provider";
> > 
> >     @Resource
> >     private RestTemplate restTemplate;
> > 
> >     @RequestMapping("/consumer/fallback/{id}")
> >     //@SentinelResource(value = "fallback") //没有配置
> >     //@SentinelResource(value = "fallback",fallback = "handlerFallback") //fallback只负责业务异常
> >     //@SentinelResource(value = "fallback",blockHandler = "blockHandler") //blockHandler只负责sentinel控制台配置违规
> >     @SentinelResource(value = "fallback",fallback = "handlerFallback",blockHandler = "blockHandler",
> >             exceptionsToIgnore = {IllegalArgumentException.class})
> >     public CommonResult<Payment> fallback(@PathVariable Long id) {
> >         CommonResult<Payment> result = restTemplate.getForObject(SERVICE_URL + "/paymentSQL/"+id, CommonResult.class,id);
> > 
> >         if (id == 4) {
> >             throw new IllegalArgumentException ("IllegalArgumentException,非法参数异常....");
> >         }else if (result.getData() == null) {
> >             throw new NullPointerException ("NullPointerException,该ID没有对应记录,空指针异常");
> >         }
> > 
> >         return result;
> >     }
> >   
> >     //fallback
> >     public CommonResult handlerFallback(@PathVariable  Long id,Throwable e) {
> >         Payment payment = new Payment(id,"null");
> >         return new CommonResult<>(444,"兜底异常handlerFallback,exception内容  "+e.getMessage(),payment);
> >     }
> >   
> >     //blockHandler
> >     public CommonResult blockHandler(@PathVariable  Long id,BlockException blockException) {
> >         Payment payment = new Payment(id,"null");
> >         return new CommonResult<>(445,"blockHandler-sentinel限流,无此流水: blockException  "+blockException.getMessage(),payment);
> >     }
> > }
> > ```
> >
> > 修改后请重启微服务
> >
> > - 热部署对java代码级生效及时
> > - 对@SentinelResource注解内属性，有时效果不好
> >
> > 目的
> >
> > - fallback管运行异常
> > - blockHandler管配置违规
> >
> > 测试地址
> >
> > - http://localhost:84/consumer/fallback/1
> >
> > 没有任何配置
> >
> > - 给客户error页面，不友好
> >
> > 只配置fallback
> >
> > - 编码（那个业务类下面的CircleBreakerController的全部源码）
> >
> > 只配置blockHandler
> >
> > - 编码（那个业务类下面的CircleBreakerController的全部源码）
> >
> > fallback和blockHandler都配置
> >
> > - 结果
> >
> >   ![1598338239282](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/51.png)
> >
> > 忽略属性...
> >
> > - 编码（那个业务类下面的CircleBreakerController的全部源码）
> >
> >   ![1598338281914](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/52.png)

### Feign系列

修改84模块

POM

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

yml

```yaml
server:
  port: 84


spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    sentinel:
      transport:
        dashboard: localhost:8080
        port: 8719

service-url:
  nacos-user-service: http://nacos-payment-provider

#对Feign的支持
feign:
  sentinel:
    enabled: true
```

业务类

- 带@FeignClient注解的业务接口

  ```java
  package com.atguigu.springcloud.alibaba.service;
  
  
  import com.atguigu.springcloud.alibaba.entities.CommonResult;
  import com.atguigu.springcloud.alibaba.entities.Payment;
  import org.springframework.cloud.openfeign.FeignClient;
  import org.springframework.web.bind.annotation.GetMapping;
  import org.springframework.web.bind.annotation.PathVariable;
  
  
  @FeignClient(value = "nacos-payment-provider",fallback = PaymentFallbackService.class)
  public interface PaymentService
  {
      @GetMapping(value = "/paymentSQL/{id}")
      public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id);
  }
  ```

- fallback = PaymentFallbackService.class

- PaymentFallbackService实现类

  ```java
  package com.atguigu.springcloud.alibaba.service;
  
  import com.atguigu.springcloud.alibaba.entities.CommonResult;
  import com.atguigu.springcloud.alibaba.entities.Payment;
  import org.springframework.stereotype.Component;
  
  @Component
  public class PaymentFallbackService implements PaymentService
  {
      @Override
      public CommonResult<Payment> paymentSQL(Long id)
      {
          return new CommonResult<>(44444,"服务降级返回,---PaymentFallbackService",new Payment(id,"errorSerial"));
      }
  }
  ```

- Controller

  ```java
  // OpenFeign
  @Resource
  private PaymentService paymentService;
  
  @GetMapping(value = "/consumer/paymentSQL/{id}")
  public CommonResult<Payment> paymentSQL(@PathVariable("id") Long id) {
      return paymentService.paymentSQL(id);
  }
  ```

主启动

添加@EnableFeignClients启动Feign的功能

```java
package com.atguigu.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

@EnableDiscoveryClient
@SpringBootApplication
@EnableFeignClients
public class OrderNacosMain84
{
    public static void main(String[] args) {
        SpringApplication.run(OrderNacosMain84.class, args);
    }
}
```

http://lcoalhost:84/consumer/openfeign/1

http://lcoalhost:84/consumer/paymentSQL/1

测试84调用9003，此时故意关闭9003微服务提供者，看84消费侧自动降级，不会被耗死

#### 熔断框架比较

![1598339929387](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/53.png)

![1598339942749](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/54.png)

### 规则持久化

#### 是什么

一旦我们重启应用，Sentinel规则将消失，生产环境需要将配置规则进行持久化

#### 怎么玩

将限流配置规则持久化进Nacos保存，只要刷新8401某个rest地址，sentinel控制台的流控规则就能看到，只要Nacos里面的配置不删除，针对8401上Sentinel上的流控规则持续有效

#### 步骤

修改cloudalibaba-sentinel-service8401

POM

```xml
<dependency>
    <groupId>com.alibaba.csp</groupId>
    <artifactId>sentinel-datasource-nacos</artifactId>
</dependency>
```

YML

```yaml
server:
  port: 8401

spring:
  application:
    name: cloudalibaba-sentinel-service
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #Nacos服务注册中心地址
    sentinel:
      transport:
        dashboard: localhost:8080 #配置Sentinel dashboard地址
        port: 8719
      datasource:
        ds1:
          nacos:
            server-addr: localhost:8848
            dataId: cloudalibaba-sentinel-service
            groupId: DEFAULT_GROUP
            data-type: json
            rule-type: flow

management:
  endpoints:
    web:
      exposure:
        include: '*'

feign:
  sentinel:
    enabled: true # 激活Sentinel对Feign的支持
```

添加Nacos数据源配置

```yaml
spring:
   cloud:
    sentinel:
    datasource:
     ds1:
      nacos:
        server-addr:localhost:8848
        dataid:${spring.application.name}
        groupid:DEFAULT_GROUP
        data-type:json
            rule-type:flow
```

添加Nacos业务规则配置

![1598340101146](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/55.png)

![1598340112967](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/56.png)

内容解析

```json
[
    {
         "resource": "/retaLimit/byUrl",
         "limitApp": "default",
         "grade":   1,
         "count":   1,
         "strategy": 0,
         "controlBehavior": 0,
         "clusterMode": false    
    }
]
```

![1598340151536](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/57.png)

启动8401后刷新sentinel发现业务规则有了

![1598340340265](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/58.png)

快速访问测试接口

- http://localhost:8401/rateLimit/byUrl

- 默认

  ![图像](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/59.png)

停止8401再看sentinel

![1598340454693](https://cdn.kayleh.top/gh/kayleh/cdn/img/Sentinel实现熔断与限流/60.png)

重新启动8401再看sentinel:

扎一看还是没有，稍等一会儿

多次调用

> http://localhost:8401/rateLimit/byUrl

重新配置出现了，持久化验证通过
