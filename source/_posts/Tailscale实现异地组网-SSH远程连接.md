---
title: Tailscale实现异地组网+SSH远程连接
tags: [ network ]
mathjax: false
date: 2023-09-05 00:16:33
description:
translate_title: tailscale-ssh-remote-connection
---

# Tailscale实现异地组网+SSH远程连接

## 1. Tailscale简介

[Tailscale](https://tailscale.com/)
是一个基于WireGuard的VPN软件，可以实现内网穿透，组网，远程连接等功能。
它的优点是简单易用，不需要配置复杂的路由器， 只需要在每台设备上安装Tailscale客户端，
就可以实现内网穿透，组网，远程连接等功能，使用起来十分简单方便。

## 2. Tailscale安装

##### 客户端安装

登录[Tailscale官网](https://tailscale.com/)，注册账号，然后下载对应的客户端，安装即可。

安装完成后，打开Tailscale客户端，登录账号，然后登录[控制台](https://login.tailscale.com/admin/machines),就可以看到已经连接的设备了。
在控制台上，可以看到每台设备的IP地址，这些IP地址都是在同一个局域网内的，可以直接通过这些IP地址进行内网穿透，组网，远程连接等操作。

#### 检查网络是否正常

从某台设备上ping另一台设备的IP地址，如果ping通，说明网络正常。

#### 服务器sshd安装

服务器上安装sshd服务，然后启动sshd服务，这样就可以通过ssh远程连接服务器了。

```shell
sudo apt install openssh-server
sudo systemctl start sshd
```

#### 客户端ssh连接服务器

在客户端上，通过ssh连接服务器

```shell
ssh username@server_ip
#username是服务器上的用户名，server_ip是服务器的IP地址, 如果是默认端口，可以不用指定端口号。
```




