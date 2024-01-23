---
title: Spring、SpringMVC、Mybatis整合
tags: [frame]
slug: spring-springmvc-mybatis-integration
date: 2020-04-20T21:05:31+08:00
---

SSM整合

<!-- more -->

### 整合说明

服务器开发分为三层,表现层、业务层、持久层
表现层使用SpringMVC实现,业务程使用Spring实现,持久层使用Mybatis实现
使用Spring框架来整合 SpringMVC和Mybatis框架
这里使用xml配置文件+注解的方式进行搭建

#### 最终目标

##### 最终实现通过前端页面对数据库进行查询和插入,实现用户的登录注册功能

### 准备

#### 创建Maven工程
![](https://cdn.kayleh.top/gh/kayleh/cdn/img/Spring、SpringMVC、Mybatis整合/start.png)

##### 选择webapp
![](https://cdn.kayleh.top/gh/kayleh/cdn/img/Spring、SpringMVC、Mybatis整合/new.png)
![](https://cdn.kayleh.top/gh/kayleh/cdn/img/Spring、SpringMVC、Mybatis整合/3.png)

##### 数据库准备
``` sql
create database ssm;
use ssm;
create table account(
id int primary key auto_increment,
name varchar(20),
money double
);
```
![](https://cdn.kayleh.top/gh/kayleh/cdn/img/Spring、SpringMVC、Mybatis整合/data.png)
####创建目录
![](https://cdn.kayleh.top/gh/kayleh/cdn/img/Spring、SpringMVC、Mybatis整合/root.png)
####导入依赖
![](https://cdn.kayleh.top/gh/kayleh/cdn/img/Spring、SpringMVC、Mybatis整合/deloy.png)
``` xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <groupId>com.kayleh</groupId>
  <artifactId>SSM</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>war</packaging>
  <name>SSM Maven Webapp</name>
  <!-- FIXME change it to the project's website -->
  <url>http://www.example.com</url>

  <!--版本锁定-->
  <properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <maven.compiler.source>1.7</maven.compiler.source>
    <maven.compiler.target>1.7</maven.compiler.target>
    <spring.version>5.0.2.RELEASE</spring.version>
    <slf4j.version>1.6.6</slf4j.version>
    <log4j.version>1.2.12</log4j.version>
    <mysql.version>5.1.6</mysql.version>
    <mybatis.version>3.4.5</mybatis.version>
  </properties>

  <dependencies>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.11</version>
      <scope>test</scope>
    </dependency>
    <!-- spring -->
    <dependency>
      <groupId>org.aspectj</groupId>
      <artifactId>aspectjweaver</artifactId>
      <version>1.6.8</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-aop</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-context</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-web</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-webmvc</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-test</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-tx</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>org.springframework</groupId>
      <artifactId>spring-jdbc</artifactId>
      <version>${spring.version}</version>
    </dependency>
    <dependency>
      <groupId>junit</groupId>
      <artifactId>junit</artifactId>
      <version>4.12</version>
      <scope>compile</scope>
    </dependency>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>${mysql.version}</version>
    </dependency>
    <dependency>
      <groupId>javax.servlet</groupId>
      <artifactId>servlet-api</artifactId>
      <version>2.5</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>javax.servlet.jsp</groupId>
      <artifactId>jsp-api</artifactId>
      <version>2.0</version>
      <scope>provided</scope>
    </dependency>
    <dependency>
      <groupId>jstl</groupId>
      <artifactId>jstl</artifactId>
      <version>1.2</version>
    </dependency>
    <!-- log start -->
    <dependency>
      <groupId>log4j</groupId>
      <artifactId>log4j</artifactId>
      <version>${log4j.version}</version>
    </dependency>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-api</artifactId>
      <version>${slf4j.version}</version>
    </dependency>
    <dependency>
      <groupId>org.slf4j</groupId>
      <artifactId>slf4j-log4j12</artifactId>
      <version>${slf4j.version}</version>
    </dependency>
    <!-- log end -->
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis</artifactId>
      <version>${mybatis.version}</version>
    </dependency>
    <dependency>
      <groupId>org.mybatis</groupId>
      <artifactId>mybatis-spring</artifactId>
      <version>1.3.0</version>
    </dependency>
    <dependency>
      <groupId>c3p0</groupId>
      <artifactId>c3p0</artifactId>
      <version>0.9.1.2</version>
      <type>jar</type>
      <scope>compile</scope>
    </dependency>
  </dependencies>
  <build>
    <finalName>SSM</finalName>
    <pluginManagement><!-- lock down plugins versions to avoid using Maven defaults (may be moved to parent pom) -->
      <plugins>
        <plugin>
          <artifactId>maven-clean-plugin</artifactId>
          <version>3.1.0</version>
        </plugin>
        <!-- see http://maven.apache.org/ref/current/maven-core/default-bindings.html#Plugin_bindings_for_war_packaging -->
        <plugin>
          <artifactId>maven-resources-plugin</artifactId>
          <version>3.0.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-compiler-plugin</artifactId>
          <version>3.8.0</version>
        </plugin>
        <plugin>
          <artifactId>maven-surefire-plugin</artifactId>
          <version>2.22.1</version>
        </plugin>
        <plugin>
          <artifactId>maven-war-plugin</artifactId>
          <version>3.2.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-install-plugin</artifactId>
          <version>2.5.2</version>
        </plugin>
        <plugin>
          <artifactId>maven-deploy-plugin</artifactId>
          <version>2.8.2</version>
        </plugin>
      </plugins>
    </pluginManagement>
  </build>
</project>
```
#### 编写实体类
``` java
package com.kayleh.domain;
import java.io.Serializable;
/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:06
 *
 * 账户
 */
public class Account implements Serializable {
    private Integer id;
    private String name;
    private Double money;
    public Integer getId() {
        return id;
    }
    .........
    public void setMoney(Double money) {
        this.money = money;
    }
}
```
#### dao接口
``` java
package com.kayleh.dao;
import com.kayleh.domain.Account;
import java.util.List;
/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:11
 * <p>
 * 账户dao接口
 */
public interface AccountDao {
    //查询所有账户
    public List<Account> findAll();
    //保存账户信息
    public void saveAccount(Account account);
}
```
#### 业务service层和实现
```java
package com.kayleh.service;
import com.kayleh.domain.Account;
import java.util.List;
/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:16
 */
public interface AccountService {
    //查询所有账户
    public List<Account> findAll();
    //保存账户信息
    public void saveAccount(Account account);
}
-----------------------------------------------------
package com.kayleh.service.impl;
import com.kayleh.domain.Account;
import com.kayleh.service.AccountService;
import org.springframework.stereotype.Service;
import java.util.List;
/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:18
 */
@Service("accountService")
public class AccountServiceImpl implements AccountService {
    public List<Account> findAll() {
        System.out.println("业务层:查询所有账户...");
        return null;
    }
    public void saveAccount(Account account) {
        System.out.println("业务层:保存账户...");
    }
}
```
## Spring整合
在resource下创建Spring配置文件
![](https://cdn.kayleh.top/gh/kayleh/cdn/img/Spring、SpringMVC、Mybatis整合/1.png)
####命名空间
```xml
       xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/context
http://www.springframework.org/schema/context/spring-context.xsd
http://www.springframework.org/schema/aop
http://www.springframework.org/schema/aop/spring-aop.xsd
http://www.springframework.org/schema/tx
http://www.springframework.org/schema/tx/spring-tx.xsd">
```
####注解扫描
```xml
<!-- 开启注解的扫描,希望处理service和dao,controller不需要Spring框架去处理,controller注解由SpringMVC处理 -->
    <context:component-scan base-package="com.kayleh">
        <!-- 配置哪些注解不扫描 -->
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
```
####测试
```java
package com.kayleh.test;
import com.kayleh.service.AccountService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:38
 */
public class TestSpring {
    @Test
    public void run1(){
        //加载配置文件
        ApplicationContext ac = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
        //获取对象
        AccountService as = (AccountService) ac.getBean("accountService");
        //调用方法
        as.findAll();
    }
}
```
###### 运行测试,成功调用accountService

---
## 搭建和测试SpringMVC的开发环境
1.在web.xml中配置DispatcherServlet前端控制器
```xml
<!-- 配置前端控制器：服务器启动必须加载,需要加载springmvc.xml配置文件 -->
<servlet>
<servlet-name>dispatcherServlet</servlet-name>
<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
<!-- 配置初始化参数,创建完DispatcherServlet对象,加载springmvc.xml配置文件 -->
<init-param>
<param-name>contextConfigLocation</param-name>
<param-value>classpath:springmvc.xml</param-value>
</init-param>
<!-- 服务器启动的时候,让DispatcherServlet对象创建 -->
<load-on-startup>1</load-on-startup>
</servlet>
<servlet-mapping>
<servlet-name>dispatcherServlet</servlet-name>
<url-pattern>/</url-pattern>
</servlet-mapping>
```
2.在web.xml中配置DispatcherServlet过滤器解决中文乱码
```xml
<!-- 配置解决中文乱码的过滤器 -->
<filter>
<filter-name>characterEncodingFilter</filter-name>
<filter-class>org.springframework.web.filter.CharacterEncodingFilter</filter-class>
<init-param>
<param-name>encoding</param-name>
<param-value>UTF-8</param-value>
</init-param>
</filter>
<filter-mapping>
<filter-name>characterEncodingFilter</filter-name>
<url-pattern>/*</url-pattern>
</filter-mapping>
```
3.创建springmvc.xml的配置文件,编写配置文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:mvc="http://www.springframework.org/schema/mvc"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="
http://www.springframework.org/schema/beans
http://www.springframework.org/schema/beans/spring-beans.xsd
http://www.springframework.org/schema/mvc
http://www.springframework.org/schema/mvc/spring-mvc.xsd
http://www.springframework.org/schema/context
http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 开启注解扫描 -->
    <context:component-scan base-package="com.kayleh">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>

    <!--配置的视图解析器对象-->
    <bean id="internalResourceViewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
        <property name="prefix" value="/WEB-INF/pages/"/>
        <property name="suffix" value=".jsp"/>
    </bean>

    <!--过滤静态资源-->
    <mvc:resources mapping="/CSS/**" location="/CSS/"/>
    <mvc:resources mapping="/images/**" location="/images/"/>
    <mvc:resources mapping="/js/**" location="/js/"/>
    <!--开启SpringMVC的注解支持-->
    <mvc:annotation-driven/>
</beans>
```
4. 测试SpringMVC的框架搭建是否成功
   1.编写index.jsp和list.jsp编写,超链接
    自带的index.jsp没有头部信息，需要重新创建
``` xml
    <a href="account/findAll">查询所有</a>
```
   2.创建AccountController类,编写方法,进行测试
    
``` java
    package cn.kayleh.controller;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.RequestMapping;
    @Controller
    @RequestMapping("/account")
    public class AccountController {
    /**
    * 查询所有的数据
    * @return
    */
    @RequestMapping("/findAll")
    public String findAll() {
    System.out.println("表现层：查询所有账户...");
    return "list";
    }
    }
```

##Spring整合SpringMVC的框架
1. 目的：在controller中能成功的调用service对象中的方法.
2. 在项目启动的时候,就去加载applicationContext.xml的配置文件,在web.xml中配置ContextLoaderListener监听器（该监听器只能加载WEB-INF目录下的applicationContext.xml的配置文
件）。
```xml
<!-- 配置Spring的监听器 -->
<listener>
<listener-class>org.springframework.web.context.ContextLoaderListener</listenerclass>
</listener>
<!-- 配置加载类路径的配置文件 -->
<context-param>
<param-name>contextConfigLocation</param-name>
<param-value>classpath:applicationContext.xml</param-value>
</context-param>
```


3. 在controller中注入service对象,调用service对象的方法进行测试
```java
package cn.itcast.controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import cn.kayleh.service.AccountService;
@Controller
@RequestMapping("/account")
public class AccountController {
        @Autowired
        private AccountService accoutService;
/**
* 查询所有的数据
* @return
*/
@RequestMapping("/findAll")
public String findAll() {
System.out.println("表现层：查询所有账户...");
accoutService.findAll();
return "list";
    }
}
```

## Spring整合MyBatis框架
### 搭建和测试MyBatis的环境
###### 在web项目中编写SqlMapConfig.xml的配置文件，编写核心配置文件,在后面整合进applicationContext.xml后可以删除
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration
PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
<environments default="mysql">
<environment id="mysql">
<transactionManager type="JDBC"/>
<dataSource type="POOLED">
<property name="driver" value="com.mysql.jdbc.Driver"/>
<property name="url" value="jdbc:mysql:///ssm"/>
<property name="username" value="root"/>
<property name="password" value="admin"/>
</dataSource>
</environment>
</environments>
<!-- 使用的是注解 -->
<mappers>
<!-- <mapper class="cn.kayleh.dao.AccountDao"/> -->
<!-- 该包下所有的dao接口都可以使用 -->
<package name="cn.kayleh.dao"/>
</mappers>
</configuration>
```
#####在AccountDao接口的方法上添加注解，编写SQL语句
```java
package com.kayleh.dao;

import com.kayleh.domain.Account;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:11
 * <p>
 * 账户dao接口
 */

@Repository
public interface AccountDao {

    //查询所有账户
    @Select("select * from account")
    public List<Account> findAll();

    //保存账户信息
    @Insert("insert into account(name,money) values (#{name},#{money})")
    public void saveAccount(Account account);
}

```
##### 编写测试的方法
```java
package com.kayleh.test;
import com.kayleh.service.AccountService;
import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:38
 */
public class TestSpring {
    @Test
    public void run1(){
        //加载配置文件
        ApplicationContext ac = new ClassPathXmlApplicationContext("classpath:applicationContext.xml");
        //获取对象
        AccountService as = (AccountService) ac.getBean("accountService");
        //调用方法
        as.findAll();
    }
}

```
## Spring整合MyBatis框架
#####目的：把SqlMapConfig.xml配置文件中的内容配置到applicationContext.xml配置文件中
```xml
 <!--Srping整合MyBatis框架-->
    <!--配置连接池-->
    <!--引入外部配置文件-->
<!-- <context:property-placeholder location="classpath:jdbc.properties"/>-->
    <bean id="ds" class="com.mchange.v2.c3p0.ComboPooledDataSource">
        <property name="driverClass" value="com.mysql.jdbc.Driver"/>
        <property name="jdbcUrl" value="jdbc:mysql:///ssm"/><!--省略了localhost:3306-->
        <property name="user" value="root"/>
        <property name="password" value="admin"/>
    </bean>

    <!--配置SqlSessionFactory工厂-->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="ds"/>
    </bean>

    <!--配置AccountDao接口所在包-->
    <bean id="mapperScannerConfigurer" class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.kayleh.dao" />
    </bean>
```
##### 在AccountDao接口中添加@Repository注解
##### 在service中注入dao对象，进行测试
```java
package com.kayleh.dao;

import com.kayleh.domain.Account;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Select;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:11
 * <p>
 * 账户dao接口
 */

@Repository
public interface AccountDao {

    //查询所有账户
    @Select("select * from account")
    public List<Account> findAll();

    //保存账户信息
    @Insert("insert into account(name,money) values (#{name},#{money})")
    public void saveAccount(Account account);
}

-------------------------------------------------------------
package com.kayleh.service.impl;

import com.kayleh.dao.AccountDao;
import com.kayleh.domain.Account;
import com.kayleh.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:18
 */

@Service("accountService")
public class AccountServiceImpl implements AccountService {

    @Autowired
    private AccountDao accountDao;

    public List<Account> findAll() {
        System.out.println("业务层:查询所有账户...");
        return accountDao.findAll();
    }

    public void saveAccount(Account account) {
        System.out.println("业务层:保存账户...");
        accountDao.saveAccount(account);
    }
}

-------------------------------------------------------------
package com.kayleh.controller;

import com.kayleh.domain.Account;
import com.kayleh.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.RequestWrapper;
import java.io.IOException;
import java.util.List;

/**
 * @Author: Wizard
 * @Date: 2020/4/21 9:21
 * <p>
 * 用户web层
 */

@Controller
@RequestMapping("/account")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @RequestMapping("/findAll")
    public String findAll(Model model) {
        System.out.println("表现层:查询所有的账户...");

        List<Account> list = accountService.findAll();

        model.addAttribute("list", list);

        return "list";
    }
```
##### 配置Spring的声明式事务管理
```xml
applicationContext.xml
 <!-- 配置Spring框架声明式事务管理 -->
    <!-- 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="ds"/>
    </bean>

    <!-- 配置事务通知 -->
    <tx:advice id="txAdvice" transaction-manager="transactionManager">
        <tx:attributes>
            <tx:method name="find*" read-only="true"/>
            <tx:method name="*" isolation="DEFAULT"/>
        </tx:attributes>
    </tx:advice>

    <!-- 配置AOP增强 -->
    <aop:config>
        <aop:advisor advice-ref="txAdvice" pointcut="execution(* com.kayleh.service.impl.*ServiceImpl.*(..))"/>

    </aop:config>
```

```java
/**
     * 保存
     *
     * @param account
     * @return
     */
    @RequestMapping("/save")
    public void save(Account account, HttpServletRequest request, HttpServletResponse response) throws Exception {
        System.out.println("表现层:查询所有的账户...");

        accountService.saveAccount(account);

        response.sendRedirect(request.getContextPath() + "/account/findAll");
        return;
    }
```
