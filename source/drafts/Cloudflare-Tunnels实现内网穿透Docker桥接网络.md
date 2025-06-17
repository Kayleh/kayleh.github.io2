---
title: Cloudflare Tunnels实现内网穿透Docker桥接网络
tags: [cloudflare]
slugs: Cloudflare-Tunnels-implementing-internal-penetration-of-Docker-bridge-networks
date: 2025-04-22 22:56:36
---

## 背景

在现代的网络架构中，通常会使用Docker容器来实现应用的隔离和部署。本文将介绍如何使用Cloudflare Tunnels来实现内网穿透Docker桥接网络，从而实现在没有公网IP的情况下，通过访问公网地址来访问内网中的Docker容器。

## 选择Cloudflare Tunnels的原因

1. **免费**：Cloudflare Tunnels是Cloudflare提供的免费服务，无需额外付费。
2. **安全**：Cloudflare Tunnels采用了先进的加密技术，确保了数据的安全性。
3. **易用**：Cloudflare Tunnels提供了简单易用的API和命令行工具，方便用户进行配置和管理。
4. **支持自定义域名**：Cloudflare Tunnels支持自定义域名

## 准备工作

在开始之前，我们需要准备以下工具和环境：

- 运行在Docker上的应用程序（需要穿透的服务）
- 一个部署在[Cloudflare](https://cloudflare.com)的域名

## 实践

1. 访问[cloudflare控制台](https://dash.cloudflare.com/), 选择Zero Trust, 点击Tunnels, 点击Create Tunnels,隧道类型选择Cloudflared, 填写Tunnels名称, 点击Create Tunnels.

2. 安装连接器，选择Docker安装，记住命令中的Token。

3. 配置公共主机名，选择自定义域名，填写自己的域名即可。`服务`处请根据自己的需求选择，因为我的应用在部署在本地的8080端口，所以配置类型为HTTP，URL为`177.10.0.1:8080`，点击Save。（`177.10.0.1`是应用服务入口的容器的IP地址，实际部署时请根据实际情况修改）

4. 打开你的应用程序项目，编辑`docker-compose.yml`文件(本文以`docker-compose.yml为例`，其他项目自行修改)。

把`cloudflared`服务添加到桥接容器的网络中, 如下：

```yaml
version: "1"
services:
  demo-nginx:
    container_name: demo-web
    ports:
      - "8080:8080"
    build:
      context: ./
      dockerfile: ./Dockerfile
    expose:
      - "8080"
    networks:
      network:
        ipv4_address: 177.10.0.1

  # 新增的cloudflared服务
  demo-cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: demo-cloudflared
    command: [ "tunnel", "--no-autoupdate", "run", "--token", "123456" ]
    networks:
      network:
        ipv4_address: 177.10.0.2

networks:
  network:
    ipam:
      driver: default
      config:
        - subnet: '177.10.0.0/16'
```

5. 启动容器，执行以下命令：

```bash
docker-compose up -d
```

6. 访问公网地址，即可访问到内网中的Docker容器, 访问地址为：`https://你的域名`。

    如果遇到访问失败的情况，可以检查以下几点：

> - cloudflared服务是否正常启动
> - cloudflared和应用程序是否在同一个网络中