---
title: 基于Tailscale的异地组网与SSH远程连接实现
date: 2023-09-05 00:16:33
updated: 2023-09-05 00:16:33
mathjax: false
tags:
  - Network
description: 本文详细介绍了如何利用Tailscale实现异地组网，并通过SSH进行远程连接，涵盖从原理到实践的完整流程。
slugs: tailscale-ssh-remote-connection
---

## 引言

在当今分布式办公与远程协作日益普及的背景下，安全、高效的异地组网与远程连接方案显得尤为重要。Tailscale作为一款基于WireGuard协议的现代VPN解决方案，凭借其简单易用的特性和强大的功能，为用户提供了便捷的组网与远程访问能力。本文将深入探讨如何利用Tailscale实现异地组网，并通过SSH协议进行安全的远程连接。

## 一、Tailscale

### 1.1 Tailscale简介

[Tailscale](https://tailscale.com/) 是一个基于 [WireGuard](https://www.wireguard.com/) 协议的现代VPN软件，旨在简化网络连接与管理。与传统VPN不同，Tailscale采用了零配置网络（Zero-Config Networking）技术，无需复杂的路由器配置，即可快速实现设备间的安全通信。其主要功能包括内网穿透、虚拟组网、远程访问等，广泛应用于家庭网络、企业办公和开发测试等场景。

### 1.2 技术原理

Tailscale基于WireGuard协议构建，利用加密隧道技术在设备间建立安全连接。WireGuard是一种快速、现代的VPN协议，具有高性能、低延迟和简洁的设计特点。Tailscale通过自动配置IP地址和路由规则，实现设备间的自动发现与连接，形成一个虚拟的私有网络（Tailnet）。在这个网络中，所有设备都拥有唯一的IP地址，并且可以通过该地址进行直接通信，就像它们处于同一个局域网中一样。

### 1.3 优势分析

- **简单易用**：无需专业的网络知识，只需在设备上安装Tailscale客户端并登录账号，即可自动加入网络。
- **安全可靠**：采用端到端加密技术，确保数据传输的安全性。同时，Tailscale支持多因素认证（MFA）和设备验证，进一步增强了网络的安全性。
- **高性能**：基于WireGuard协议的高效实现，Tailscale在网络性能方面表现出色，能够提供低延迟、高带宽的连接体验。
- **跨平台支持**：支持Windows、macOS、Linux、iOS、Android等多种操作系统，方便用户在不同设备间进行连接与协作。

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

#### VSCode Remote SSH

在VSCode中，安装Remote SSH插件，然后通过Remote SSH插件，连接服务器，就可以在本地编辑服务器上的文件了。

安装以下插件

> Remote - SSH
> Remote - SSH: Editing Configuration Files
> Remote - SSH: Explorer

在VSCode中，按下F1，输入Remote SSH，选择Remote-SSH: Open Configuration File，然后选择config文件，编辑config文件，添加以下内容

```shell
Host server
    HostName server_ip
    User username
```

#### 免密登录

以下操作，以客户端和服务端都为Windows为例，Linux和MacOS类似。

##### 客户端生成密钥

在客户端上，打开PowerShell，输入以下命令，生成密钥

```shell
ssh-keygen
```

##### 服务端添加密钥

拷贝客户端生成的公钥到服务端的.ssh目录下，在authorized_keys文件中追加粘贴。（如果没有authorized_keys文件，可以新建一个）

然后编辑sshd_config文件，添加以下配置

```shell
PubkeyAuthentication yes
AuthorizedKeysFile  .ssh/authorized_keys
PasswordAuthentication no  (需要将默认的yes改为no,很重要)
```

注释掉以下配置

```shell
 #Match Group administrators
       #AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

重启sshd服务

```shell
net stop sshd
net start sshd
```

##### 客户端免密登录

编辑客户端的.ssh目录下的config文件，添加IdentityFile配置，内容为客户端的私钥路径。

```shell
Host server
    HostName server_ip
    User username
    IdentityFile C:\Users\username\.ssh\id_rsa
```


#### Git保存用户名密码

在客户端上，打开PowerShell，输入以下命令，保存用户名密码（需要输入过一次用户名密码）

```shell
git config --global credential.helper store 
```