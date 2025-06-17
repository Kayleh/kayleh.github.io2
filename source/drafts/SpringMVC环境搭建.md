---
title: SpringMVC环境搭建
tags: [frame]
categories: [SpringMVC]
slugs: springmvc-environment-construction
date: 2019-07-14T13:30:23+08:00
---

## SpringMVC

<!--more-->

``` bash
Spring MVC是Spring Framework的一部分，是基于Java实现MVC的轻量级Web框架，实现MVC模块，简化了Web开发。

MVC提倡每一层只写自己的东西，不写其他任何代码。为了解耦，为了维护方便和分工合作。

SpringMVC为展现层提供的基于MVC设计理念的优秀Web框架，是目前最主流的框架之一。
```

<!-- more -->


## 环境搭建

### 1.导包(Maven工程忽略) 
  需要导入log包，spring核心包，SpringMVC包

``` bash
1.junit-x.x.x.jar 
2.spring-webmvc-x.x.x.RELEASE.jar
3.spring-aop-x.x.x.RELEASE.jar
4.spring-beans-x.x.x.RELEASE.jar
5.spring-context-x.x.x.RELEASE.jar
6.spring-core-x.x.x.RELEASE.jar
7.spring-expression-x.x.x.RELEASE.jar
8.spring-web-x.x.x.RELEASE.jar
9.commons-log-.x.x.x.RELEASE.jar
```



### 写配置

``` bash

/**
 * web.xml
 */
<servlet>
    <servlet-name>springDispatcherServlet</servlet-name>
    <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
     <init-param>
      <!-- contextConfigLocation：指定SpringMVC配置文件位置 -->
       <param-name>contextConfigLocation</param-name>
      <param-value>classpath:springmvc.xml</param-value>
     </init-param>  
    <load-on-startup>1</load-on-startup>
  </servlet>
 <servlet-mapping>
    <servlet-name>springDispatcherServlet</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>
  ===========================================================
 /**
 * springmvc.xml
 */
 <?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:context="http://www.springframework.org/schema/context"
  xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd">

  <!-- 这里是扫描所有组件 -->
  <context:component-scan base-package="com.wizard"></context:component-scan>
  
  <!-- 配置一个视图解析器 作用是拼接页面的地址，方便调用-->
  <bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <!--前缀-->
    <property name="prefix" value="/WEB-INF/page/"></property>
    <!--后缀-->
    <property name="suffix" value=".jsp"></property>
  </bean>
  
</beans>
```


``` bash

/*
*view层
*/
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<h1>来了!</h1>
</body>
</html>
```


``` bash

控制器层
/**
 * @author Kayleh
 * @Controller:标识哪个组件是控制器
 *@RequestMapping
 *  告诉SpringMVC，这个方法用来处理什么请求;
 */

@Controller
public class firstController {//这是一次转发操作
  @RequestMapping("/hello")
  public String firstRequest(){
    System.out.println("收到请求");
    return "success";
  }

}
```

``` bash
index.jsp
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
</head>
<body>
<a href="hello">Hello bug</a>
</body>
</html>
```

## 运行结果


``` bash
Hello bug
```

## 其他细节

细节：
@RequestMapping注解不仅可以写在方法前,还可以写在类前,如果写在类前,意思为当前类所有的方法的请求地址指定一个基准路径,访问firstRequest方法的路径为/类前的注解/方法的注解(/hello).

@RequestMapping注解的参数("/hello")的/可以不写,但习惯为了方便维护应该写上.

控制器处理的请求 firstController 是请求转发操作,Tomcat访问地址栏不变

如果前端控制器没有指定配置文件位置,Spring也会在/WEB-INF/xxx-servlet.xml路径下查找文件.xxx为web.xml配置的前端控制器

## 详细流程

 1.客户端点击链接会发送http://localhost:8080/springmvc/hello请求

 2.来到Tomcat服务器

 3.springMVC的前端控制器收到所有请求

 4.看请求地址和@RequestMapping标注的哪个匹配,来找到使用什么类的什么方法

 5.前端控制器找到了目标处理器类和目标方法,直接利用反射执行目标方法

 6.方法执行完成之后会有一个返回值;SpringMVC认为这个返回值就是要去的页面

 7.拿到方法返回值后,用视图解析器进行拼串得到完整的页面地址

 8.拿到页面地址,前端控制器转发到页面


 ### 其他问题?

1为什么web.xml中配置的拦截为

``` bash
 <servlet-mapping>
    <servlet-name>springDispatcherServlet</servlet-name>
    <url-pattern>/</url-pattern>
  </servlet-mapping>
```


为什么没有拦截index.jsp??

因为Tomcat的底层本来就能拦截jsp页面,配置的"/"的子类web.xml相当于覆盖了Webapp的父类web.xml中的DefaultServlet,DefaultServlet的作用是处理静态资源,覆盖了DefaultServlet,也就拦截了除jsp和servlet外的静态资源,而JspServlet的配置并没有覆盖.

而"/*"的作用是拦截所有请求,包括jsp页面.
----------

