---
title: Nacos服务注册和配置中心
tags: [DistributedMicroservices]
categories: [分布式]
slug: nacos-service-registration-and-configuration-center
date: 2020-08-21T17:44:55+08:00

---

Nacos

<!--more-->

一个更易于构建云原生应用的动态服务发现，配置管理和服务管理中心

Nacos：Dynamic Naming and Configuration Service

Nacos就是注册中心+配置中心的组合等价于 Nacos = Eureka+Config+Bus

**能干嘛**

> 替代Eureka做服务注册中心
>
> 替代Config做服务配置中心
>
> https://github.com/alibaba/Nacos
>
> https://nacos.io/zh-cn/index.html
>
> https://spring-cloud-alibaba-group.github.io/github-pages/greenwich/spring-cloud-alibaba.html#_spring_cloud_alibaba_nacos_discovery

各种注册中心比较

![1597916860197](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/1.png)

### 安装并运行Nacos

1本地Java8+Maven环境已经OK

2先从官网下载Nacos

> https://github.com/alibaba/nacos/releases/tag/1.1.4

3解压安装包，直接运行bin目录下的startup.cmd

4命令运行成功后直接访问

> http://localhost:8848/nacos
>
> 默认账号密码都是nacos

结果页面

![1597916943447](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/58.png)

## Nacos作为服务注册中心演示

### 基于Nacos的服务提供者

新建Module

> cloudalibaba-provider-payment9001

父POM

```xml
<!--spring cloud alibaba 2.1.0.RELEASE-->
<dependency>
  <groupId>com.alibaba.cloud</groupId>
  <artifactId>spring-cloud-alibaba-dependencies</artifactId>
  <version>2.1.0.RELEASE</version>
  <type>pom</type>
  <scope>import</scope>
</dependency>
```

本模块POM

```xml
<dependencies>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
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
    </dependency><dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>fastjson</artifactId>
    <version>1.2.62</version>
</dependency>
 </dependencies>
```

yaml

```yaml
server:
  port: 9001

spring:
  application:
    name: nacos-payment-provider
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848 #配置Nacos地址

management:
  endpoints:
    web:
      exposure:
        include: '*'
```

主启动类

```java
package com.kayleh.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class PaymentMain9001 {
    public static void main(String[] args) {
        SpringApplication.run(PaymentMain9001.class,args);
    }
}
```

业务类

```java
package com.kayleh.springcloud.alibaba.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PaymentController
{
    @Value("${server.port}")
    private String serverPort;

    @GetMapping(value = "/payment/nacos/{id}")
    public String getPayment(@PathVariable("id") Integer id)
    {
        return "nacos registry, serverPort: "+ serverPort+"\t id"+id;
    }
}
```

测试

```
http://localhost:9001/payment/nacos/1
```

nacos控制台

![1597917114444](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/3.png)

nacos服务注册中心+服务提供者9001都ok了

为了演示nacos的负载均衡，参照9001新建9002

新建

> cloudalibaba-provider-payment9002

9002其他步骤你懂的

或者取巧不想新建重复体力劳动，直接拷贝虚拟端口映射

![1597917265960](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/4.png)

<img src="5.png" alt="1597917272302" style="zoom: 80%;" />

### 基于Nacos的服务消费者

新建Module

> cloudalibaba-consumer-nacos-order83

POM

```xml
<dependencies>
    <!--SpringCloud ailibaba nacos -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
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

为什么nacos支持负载均衡

![1597917355359](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/6.png)

yaml

```yaml
server:
  port: 83

spring:
  application:
    name: nacos-order-consumer
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848

service-url:
  nacos-user-service: http://nacos-payment-provider
```

主启动

```java
package com.kayleh.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@EnableDiscoveryClient
@SpringBootApplication
public class OrderNacosMain83
{
    public static void main(String[] args)
    {
        SpringApplication.run(OrderNacosMain83.class,args);
    }
}
```

业务类

ApplicationContextBean

```java
package com.kayleh.springcloud.alibaba.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;


@Configuration
public class ApplicationContextConfig
{
    @Bean
    @LoadBalanced
    public RestTemplate getRestTemplate()
    {
        return new RestTemplate();
    }
}
```

OrderNacosController

```java
package com.kayleh.springcloud.alibaba.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.Resource;

@RestController
@Slf4j
public class OrderNacosController
{
    @Resource
    private RestTemplate restTemplate;

    @Value("${service-url.nacos-user-service}")
    private String serverURL;

    @GetMapping(value = "/consumer/payment/nacos/{id}")
    public String paymentInfo(@PathVariable("id") Long id)
    {
        return restTemplate.getForObject(serverURL+"/payment/nacos/"+id,String.class);
    }

}
```

测试

nacos控制台

![1597917596670](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/7.png)

访问

> http://localhost:83/consumer/payment/nacos/13

83访问9001/9002，轮询负载OK

##### 服务注册中心对比

各种注册中心对比

Nacos全景图所示

![1597917654952](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/8.png)

Nacos和CAP

![1597917671204](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/9.png)

![1597917730065](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/10.png)

##### Nacos支持AP和CP模式的切换

![1597917749721](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/11.png)

```
curl -X PUT '$NACOS_SERVER:8848/nacos/v1/ns/operator/switches?entry=serverMode&value=CP'
```



## Nacos作为服务配置中心演示

### Nacos作为配置中心-基础配置

cloudalibaba-config-nacos-client3377

POM

```xml
<dependencies>
    <!--nacos-config-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
    </dependency>
    <!--nacos-discovery-->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>
    <!--web + actuator-->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <!--一般基础配置-->
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

YML

为什么配置两个

![1597999398581](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/12.png)

> bootstrap
>
> ```yaml
> server:
>   port: 3377
> 
> spring:
>   application:
>     name: nacos-config-client
>   cloud:
>     nacos:
>       discovery:
>         server-addr: localhost:8848 #服务注册中心地址
>       config:
>         server-addr: localhost:8848 #配置中心地址
>         file-extension: yaml #指定yaml格式的配置
> ```
>
> application
>
> ```yaml
> spring:
>   profiles:
>     active: dev
> ```

主启动类

```java
package com.kayleh.springcloud.alibaba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;


@EnableDiscoveryClient
@SpringBootApplication
public class NacosConfigClientMain3377
{
    public static void main(String[] args) {
        SpringApplication.run(NacosConfigClientMain3377.class, args);
    }
}
```

业务类

ConfigClientController

```java
package com.kayleh.springcloud.alibaba.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RefreshScope
public class ConfigClientController
{
    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/config/info")
    public String getConfigInfo() {
        return configInfo;
    }
}
```

@RefreshScope

![1597999398581](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/13.png)

#### 在Nacos中添加配置信息

##### Nacos中的匹配规则

**理论**

Nacos中的dataid的组成格式与SpringBoot配置文件中的匹配规则

https://nacos.io/zh-cn/docs/quick-start-spring-cloud.html

![1597999707395](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/14.png)

![1597999752185](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/15.png)

**实操**

1.配置新增

> ![1597999802135](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/16.png)
>
> nacos-config-client-dev

2.Nacos界面配置对应

> ```
> config:
>     info: nacos config center,version = 1,from nacos config center, nacos-config-client-dev.yaml, version=1
> ```
>
> ![1598006810118](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/17.png)
>
> 设置DataId
>
> 公式:
>
> `${spring.application.name}-${spring.profile.active}.${spring.cloud.nacos.config.file-extension}`
>
> `prefix`默认为`spring.application.name`的值
>
> `spring.profile.active`既为当前环境对应的`profile`,可以通过配置项`spring.profile.active` 来配置
>
> `file-exetension`为配置内容的数据格式，可以通过配置项`spring.cloud.nacos.config.file-extension`配置
>
> 总结:
>
> ![1598006888126](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/18.png)

3.历史配置

#### 测试

启动前需要在nacos客户端-配置管理-配置管理栏目下有没有对应的yaml配置文件

运行cloud-config-nacos-client3377的主启动类

调用接口查看配置信息

> http://localhost:3377/config/info

#### 自带动态刷新

修改下Nacos中的yaml配置文件，再次调用查看配置的接口，就会发现配置已经刷新

### Nacos作为配置中心-分类配置

问题

> 多环境多项目管理
>
> ![1598007094349](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/19.png)

Nacos的图形化管理界面

> 配置管理
>
> ![1598007142269](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/20.png)
>
> 命名空间
>
> <img src="21.png" alt="1598007159998" style="zoom: 80%;" />

##### Namespace+Group+Data ID三者关系？为什么这么设计？

![1598007201161](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/22.png)

![1598007216472](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/23.png)

#### Case

##### **一、DataID方案**

1. 指定spring.profile.active和配置文件的DataID来使不同环境下读取不同的配置

2. 默认空间+默认分组+新建dev和test两个DataID

新建dev配置DataID

![1598007306224](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/24.png)

新建test配置DataID

![1598007322942](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/25.png)

**通过spring.profile.active属性就能进行多环境下配置文件的读取**  ![1598010338263](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/26.png)

测试

> http://localhost:3377/config/info

配置是什么就加载什么 

test

##### **二、Group方案**

通过Group实现环境区分

新建Group

![1598010952482](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/27.png)

在nacos图形界面控制台上面新建配置文件DataID

![1598010985237](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/28.png)

bootstrap+application

![1598011032814](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/29.png)

在config下增加一条group的配置即可。可配置为DEV_GROUP或TEST_GROUP

##### 三、Namespace方案

新建dev/test的Namespace

![1598011094792](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/30.png)

回到服务管理-服务列表查看

![1598011118483](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/31.png)

按照域名配置填写

![1598011149802](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/32.png)

YML

bootstrap

![1598264395915](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/59.png)

```yml
namespace: 

```

application

# Nacos集群和持久化配置

## 是什么？

> https://nacos.io/zh-cn/docs/cluster-mode-quick-start.html

<img src="33.png" alt="33" style="zoom: 80%;" />

<img src="34.png" alt="34" style="zoom: 80%;" />

<img src="35.png" alt="35" style="zoom: 80%;" />

按照上述，我们需要mysql数据库

> https://nacos.io/zh-cn/docs/deployment.html

![1598011363176](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/36.png)

![1598011391934](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/37.png)

## Nacos持久化配置解释

Nacos默认自带的是嵌入式数据库derby

> https://github.com/alibaba/nacos/blob/develop/config/pom.xml

derby到mysql切换配置步骤

> nacos-server-1.1.4\nacos\conf目录下找到sql脚本
>
> nacos-mysql.sql
>
> 执行脚本
>
> ```sql
> CREATE DATABASE nacos_config;
> USE nacos_config;
> 
> /*   数据库全名 = nacos_config   */
> /*   表名称 = config_info   */
> /******************************************/
> CREATE TABLE `config_info` (
> `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
> `data_id` varchar(255) NOT NULL COMMENT    'data_id',
> `group_id` varchar(255) DEFAULT NULL,
> `content` longtext NOT NULL COMMENT 'content',
> `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
> `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
> `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
> `src_user` text COMMENT 'source user',
> `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
> `app_name` varchar(128) DEFAULT NULL,
> `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
> `c_desc` varchar(256) DEFAULT NULL,
> `c_use` varchar(64) DEFAULT NULL,
> `effect` varchar(64) DEFAULT NULL,
> `type` varchar(64) DEFAULT NULL,
> `c_schema` text,
> PRIMARY KEY (`id`),
> UNIQUE KEY `uk_configinfo_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info';
> 
> /******************************************/
> /*   数据库全名 = nacos_config   */
> /*   表名称 = config_info_aggr   */
> /******************************************/
> CREATE TABLE `config_info_aggr` (
> `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
> `data_id` varchar(255) NOT NULL COMMENT 'data_id',
> `group_id` varchar(255) NOT NULL COMMENT 'group_id',
> `datum_id` varchar(255) NOT NULL COMMENT 'datum_id',
> `content` longtext NOT NULL COMMENT '内容',
> `gmt_modified` datetime NOT NULL COMMENT '修改时间',
> `app_name` varchar(128) DEFAULT NULL,
> `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
> PRIMARY KEY (`id`),
> UNIQUE KEY `uk_configinfoaggr_datagrouptenantdatum` (`data_id`,`group_id`,`tenant_id`,`datum_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='增加租户字段';
> 
> 
> /******************************************/
> /*   数据库全名 = nacos_config   */
> /*   表名称 = config_info_beta   */
> /******************************************/
> CREATE TABLE `config_info_beta` (
> `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
> `data_id` varchar(255) NOT NULL COMMENT 'data_id',
> `group_id` varchar(128) NOT NULL COMMENT 'group_id',
> `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
> `content` longtext NOT NULL COMMENT 'content',
> `beta_ips` varchar(1024) DEFAULT NULL COMMENT 'betaIps',
> `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
> `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
> `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
> `src_user` text COMMENT 'source user',
> `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
> `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
> PRIMARY KEY (`id`),
> UNIQUE KEY `uk_configinfobeta_datagrouptenant` (`data_id`,`group_id`,`tenant_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_beta';
> 
> /******************************************/
> /*   数据库全名 = nacos_config   */
> /*   表名称 = config_info_tag   */
> /******************************************/
> CREATE TABLE `config_info_tag` (
> `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
> `data_id` varchar(255) NOT NULL COMMENT 'data_id',
> `group_id` varchar(128) NOT NULL COMMENT 'group_id',
> `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
> `tag_id` varchar(128) NOT NULL COMMENT 'tag_id',
> `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
> `content` longtext NOT NULL COMMENT 'content',
> `md5` varchar(32) DEFAULT NULL COMMENT 'md5',
> `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
> `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
> `src_user` text COMMENT 'source user',
> `src_ip` varchar(20) DEFAULT NULL COMMENT 'source ip',
> PRIMARY KEY (`id`),
> UNIQUE KEY `uk_configinfotag_datagrouptenanttag` (`data_id`,`group_id`,`tenant_id`,`tag_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_info_tag';
> 
> /******************************************/
> /*   数据库全名 = nacos_config   */
> /*   表名称 = config_tags_relation   */
> /******************************************/
> CREATE TABLE `config_tags_relation` (
> `id` bigint(20) NOT NULL COMMENT 'id',
> `tag_name` varchar(128) NOT NULL COMMENT 'tag_name',
> `tag_type` varchar(64) DEFAULT NULL COMMENT 'tag_type',
> `data_id` varchar(255) NOT NULL COMMENT 'data_id',
> `group_id` varchar(128) NOT NULL COMMENT 'group_id',
> `tenant_id` varchar(128) DEFAULT '' COMMENT 'tenant_id',
> `nid` bigint(20) NOT NULL AUTO_INCREMENT,
> PRIMARY KEY (`nid`),
> UNIQUE KEY `uk_configtagrelation_configidtag` (`id`,`tag_name`,`tag_type`),
> KEY `idx_tenant_id` (`tenant_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='config_tag_relation';
> 
> /******************************************/
> /*   数据库全名 = nacos_config   */
> /*   表名称 = group_capacity   */
> /******************************************/
> CREATE TABLE `group_capacity` (
> `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
> `group_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Group ID，空字符表示整个集群',
> `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
> `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
> `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
> `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数，，0表示使用默认值',
> `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
> `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
> `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
> `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
> PRIMARY KEY (`id`),
> UNIQUE KEY `uk_group_id` (`group_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='集群、各Group容量信息表';
> 
> /******************************************/
> /*   数据库全名 = nacos_config   */
> /*   表名称 = his_config_info   */
> /******************************************/
> CREATE TABLE `his_config_info` (
> `id` bigint(64) unsigned NOT NULL,
> `nid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
> `data_id` varchar(255) NOT NULL,
> `group_id` varchar(128) NOT NULL,
> `app_name` varchar(128) DEFAULT NULL COMMENT 'app_name',
> `content` longtext NOT NULL,
> `md5` varchar(32) DEFAULT NULL,
> `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00',
> `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00',
> `src_user` text,
> `src_ip` varchar(20) DEFAULT NULL,
> `op_type` char(10) DEFAULT NULL,
> `tenant_id` varchar(128) DEFAULT '' COMMENT '租户字段',
> PRIMARY KEY (`nid`),
> KEY `idx_gmt_create` (`gmt_create`),
> KEY `idx_gmt_modified` (`gmt_modified`),
> KEY `idx_did` (`data_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='多租户改造';
> 
> 
> /******************************************/
> /*   数据库全名 = nacos_config   */
> /*   表名称 = tenant_capacity   */
> /******************************************/
> CREATE TABLE `tenant_capacity` (
> `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键ID',
> `tenant_id` varchar(128) NOT NULL DEFAULT '' COMMENT 'Tenant ID',
> `quota` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '配额，0表示使用默认值',
> `usage` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '使用量',
> `max_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个配置大小上限，单位为字节，0表示使用默认值',
> `max_aggr_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '聚合子配置最大个数',
> `max_aggr_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '单个聚合数据的子配置大小上限，单位为字节，0表示使用默认值',
> `max_history_count` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '最大变更历史数量',
> `gmt_create` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '创建时间',
> `gmt_modified` datetime NOT NULL DEFAULT '2010-05-05 00:00:00' COMMENT '修改时间',
> PRIMARY KEY (`id`),
> UNIQUE KEY `uk_tenant_id` (`tenant_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='租户容量信息表';
> 
> 
> CREATE TABLE `tenant_info` (
> `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'id',
> `kp` varchar(128) NOT NULL COMMENT 'kp',
> `tenant_id` varchar(128) default '' COMMENT 'tenant_id',
> `tenant_name` varchar(128) default '' COMMENT 'tenant_name',
> `tenant_desc` varchar(256) DEFAULT NULL COMMENT 'tenant_desc',
> `create_source` varchar(32) DEFAULT NULL COMMENT 'create_source',
> `gmt_create` bigint(20) NOT NULL COMMENT '创建时间',
> `gmt_modified` bigint(20) NOT NULL COMMENT '修改时间',
> PRIMARY KEY (`id`),
> UNIQUE KEY `uk_tenant_info_kptenantid` (`kp`,`tenant_id`),
> KEY `idx_tenant_id` (`tenant_id`)
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='tenant_info';
> 
> CREATE TABLE users (
>  username varchar(50) NOT NULL PRIMARY KEY,
>  password varchar(500) NOT NULL,
>  enabled boolean NOT NULL
> );
> 
> CREATE TABLE roles (
>  username varchar(50) NOT NULL,
>  role varchar(50) NOT NULL
> );
> 
> INSERT INTO users (username, password, enabled) VALUES ('nacos', '$2a$10$EuWPZHzz32dJN7jexM34MOeYirDdFAZm2kuWj7VEOJhhZkDrxfvUu', TRUE);
> 
> INSERT INTO roles (username, role) VALUES ('nacos', 'ROLE_ADMIN');
> ```
>
> nacos-server-1.1.4\nacos\conf目录下找到application.properties
>
> #mysql8.0+后面加上时区serverTimezone=UTC
>
> ```properties
> spring.datasource.platform=mysql
> 
> db.num=1
> db.url.0=jdbc:mysql://11.162.196.16:3306/nacos_devtest?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
> db.user=nacos_devtest
> db.password=youdontknow
> 
> ##################################################
> 
> spring.datasource.platform=mysql
> 
> db.num=1
> db.url.0=jdbc:mysql://localhost:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
> db.user=root
> db.password=123456
> ```

启动nacos，可以看到是个全新的空记录界面，以前是记录进derby

## Linux版Nacos+MySQL生产环境配置

> 预计需要，1个nginx+3个nacos注册中心+1个mysql

Nacos下载linux版本

<img src="38.png" alt="1598011630753" style="zoom:80%;" />

> https://github.com/alibaba/nacos/releases/tag/1.1.4
>
> nacos-server-1.1.4.tar.gz
>
> 解压到/opt
>
> 拷贝
>
> ```
> cp -r nacos /mynacos/
> ```
>
> cd  /mynacos/nacos/
>
> cd bin
>
> 执行,执行之前把原始的配置备份一遍。
>
> ```
> cp startup.sh startup.sh.bk
> startup.sh
> ```
>
> 解压后安装

## 集群配置步骤

### 1.Linux服务器上mysql数据库配置

##### SQL脚本在哪里

![1598011816083](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/390.png)

##### sql语句源文件

nacos-mysql.sql

##### 自己Linux机器上的Mysql数据库黏贴

![1598011996589](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/40.png)

### 2.application.properties配置

#### 位置

![1598012047300](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/41.png)

#### 内容

```properties
spring.datasource.platform=mysql
 
db.num=1
db.url.0=jdbc:mysql://1.7.0.1:3306/nacos_config?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
db.user=root
db.password=HF_mysql_654321
```

![1598012185308](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/42.png)

```
mysql  授权远程访问
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
flush privileges;
```

### 3.Linux服务器上nacos的集群配置cluster.conf

梳理出3台nacos机器的不同服务端口号

复制出cluster.conf

![1598012321701](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/43.png)

#### 内容

<img src="44.png" alt="1598012391295" style="zoom:67%;" />

这个IP不能写127.0.0.1,必须是Linux命令hostname -i能够识别的IP

![1598012433063](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/45.png)

或者ifconfig

### 4.编辑Nacos的启动脚本startup.sh，使它能够接受不同的启动端

#### /mynacos/nacos/bin目录下有startup.sh

在什么地方，修改什么，怎么修改

思考

![1598012484557](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/46.png)

修改内容

![1598012508369](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/47.png)

```
cp startup.sh startup.sh.bk
```

![1598012527781](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/48.png)

![1598012546461](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/49.png)

执行方式

![1598012636318](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/50.png)

### 5.Nginx的配置，由它作为负载均衡器

修改nginx的配置文件

![1598012677966](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/51.png)

nginx.conf                                                

    upstream cluster{      
    server 127.0.0.1:3333;
    server 127.0.0.1:4444;
    server 127.0.0.1:5555;
    }
    server{
    listen 1111;
    server_name localhost;
    location /{
         proxy_pass http://cluster;
                                                        
    }
....省略  

<img src="52.png" alt="1598013304340" style="zoom: 80%;" />

按照指定启动

![1598013342566](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/53.png)

```linux
ps -ef|grep nacos|grep -v grep |wc -l
--------------
3
```

3个微服务已启动

### 6.截止到此处，1个Nginx+3个nacos注册中心+1个mysql

测试通过nginx访问nacos

```java
https://写你自己虚拟机的ip:1111/nacos/#/login
```

新建一个配置测试

<img src="54.png" alt="1598013402984" style="zoom:80%;" />

```
mysql> select * from config_info;
```



linux服务器的mysql插入一条记录

![1598013436552](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/55.png)

#### 测试

微服务cloudalibaba-provider-payment9002启动注册进nacos集群

yml

```yaml
server-addr:  写你自己的虚拟机ip:1111
 
```

结果

![1598013518452](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/56.png)

高可用小总结

![1598013576604](https://cdn.kayleh.top/gh/kayleh/cdn/img/Nacos服务注册和配置中心/57.png)
