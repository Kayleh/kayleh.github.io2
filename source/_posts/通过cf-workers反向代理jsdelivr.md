---
title: 通过cf-workers反向代理jsdelivr
tags: [network]
date: 2023-06-12 13:11:15
slug: reverse-proxy-jsdelivr-with-cf-workers
---

## 1. 什么是cf-workers

> Cloudflare Workers是Cloudflare提供的一项Serverless服务，可以在Cloudflare的边缘节点上运行JavaScript代码，实现对请求的处理。

## 2. 为什么要反向代理jsdelivr

> jsdelivr是一个免费的公共CDN，但是由于国内网络环境的原因，jsdelivr的访问速度并不理想，
> 所以考虑通过cf-workers来反向代理jsdelivr，绕过国内网络环境的限制，从而提高访问速度。

## 下面是配置worker的具体的操作步骤

前置条件：

- 域名的DNS解析已经指向了Cloudflare的DNS服务器
- 已经在Cloudflare上添加了域名

### 1. 登录Cloudflare控制台

[Cloudflare控制台](https://dash.cloudflare.com/)

### 2. 创建worker

点击`Workers & Pages`，然后点击`Create Application`，输入worker的名称，点击`Deploy`。

### 3. 配置worker

部署完成后，返回`Workers & Pages`页面，点击刚刚创建的worker，进入worker的配置页面。

编辑worker的代码，将下面的代码复制进去，然后点击`Save and Deploy`。

```js
/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run "npm run dev" in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run "npm run deploy" to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

addEventListener(
  "fetch",event => {
     let url=new URL(event.request.url);
     url.hostname="cdn.jsdelivr.net";  //你需要反代的域名
     let request=new Request(url,event.request);
     event. respondWith(
       fetch(request)
     )
  }
)
```

### 4. 配置域名

在`Workers`的详情页面，点击`Add Custom Domain`，输入域名，点击`Save`。


此时，你就可以通过你刚刚配置的域名来访问jsdelivr了。

> 例如，你配置的域名是`cdn.example.com`，那么你就可以通过`https://cdn.example.com`来访问jsdelivr了。

