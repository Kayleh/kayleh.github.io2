---
title: 异地组网+SSH实现
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