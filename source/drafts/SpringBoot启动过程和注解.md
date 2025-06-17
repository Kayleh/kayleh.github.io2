---
title: SpringBoot startup process
tags: [frame]
date: 2021-01-15T20:40:54+08:00
slugs: SpringBoot-startup-process
---

## SpringBoot应用启动流程

![图片](https://cdn.kayleh.top/gh/kayleh/cdn3/SpringBoot启动过程和注解/640.jpg) 

我们将各步骤总结精炼如下：

1. 通过 `SpringFactoriesLoader` 加载 `META-INF/spring.factories` 文件，获取并创建 `SpringApplicationRunListener` 对象
2. 然后由 `SpringApplicationRunListener` 来发出 starting 消息
3. 创建参数，并配置当前 SpringBoot 应用将要使用的 Environment
4. 完成之后，依然由 `SpringApplicationRunListener` 来发出 environmentPrepared 消息
5. 创建 `ApplicationContext`
6. 初始化 `ApplicationContext`，并设置 Environment，加载相关配置等
7. 由 `SpringApplicationRunListener` 来发出 `contextPrepared` 消息，告知SpringBoot 应用使用的 `ApplicationContext` 已准备OK
8. 将各种 beans 装载入 `ApplicationContext`，继续由 `SpringApplicationRunListener` 来发出 contextLoaded 消息，告知 SpringBoot 应用使用的 `ApplicationContext` 已装填OK
9. refresh ApplicationContext，完成IoC容器可用的最后一步
10. 由 `SpringApplicationRunListener` 来发出 started 消息
11. 完成最终的程序的启动
12. 由 `SpringApplicationRunListener` 来发出 running 消息，告知程序已运行起来了

至此，全流程结束！
