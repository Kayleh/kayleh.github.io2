---
title: SpringMVC work stream
mathjax: false
date: 2020-12-16T23:13:22+08:00
tags: [frame]
translate_title: springmvc-work-stream
---

## SpringMVC工作流程

![springmvc工作流程](https://cdn.jsdelivr.net/gh/kayleh/cdn2/springmvc工作流程/springmvc工作流程.png)

- 处理模型数据方式一:将方法的返回值设置为ModelAndView

- 处理模型数据方式二:方法的返回值仍是String类型,在方法的入参中传入Map,Model或者ModelMap,

  不管将处理器方法的返回值设置为ModelAndView还是在方法的入参传入Map,Model或者ModelMap,SpringMVC都会转换为一个ModelAndView对象.

