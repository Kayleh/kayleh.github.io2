---
title: XSS跨站脚本攻击
tags: [security]
slugs: xss-crosssite-scripting-attack
date: 2020-05-31T20:58:53+08:00
---

### XSS跨站脚本攻击

<!--more-->

在做社区项目的时候，发现了一个XSS漏洞。

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/XSS跨站脚本攻击/xss.png)



##### 什么是XSS跨站脚本攻击？

> XSS攻击全称跨站脚本攻击，是一种在web应用中的计算机安全漏洞，它允许恶意web用户将代码植入到提供给其它用户使用的页面中。

在点击回复二级评论时，JavaScript脚本会注入页面:

示例：

 ![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/XSS跨站脚本攻击/2.png) 

 ![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/XSS跨站脚本攻击/3.png) 

然后客户端就调用脚本alert导致无限弹窗。

还可以使用

```javascript
<script>alert(document.cookie)</script>
```

获取页面cookie，比如登录的token。

解决办法：

> Jsoup使用标签白名单的机制用来进行防止XSS攻击

参考：

[[XSS跨站脚本攻击]][1]

[1]: https://www.zykcoderman.xyz/web/post/detail/401 "XSS"
