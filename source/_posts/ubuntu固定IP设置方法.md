---
title: ubuntu fixed IP setting method
mathjax: false
date: 2020-11-13T23:23:35+08:00
tags: [linux]
slug: ubuntu-set-ip
---

# ubuntu固定IP设置方法

## 确认你要修改的网卡号

先确认你要修改的网卡号，假设你的服务器有多张网卡：

```
`ubuntu1804:~$ ip addr`
```

我的服务器配置如下：

```
`1: lo:  mtu 65536 qdisc noqueue state UNKNOWN ``group` `default` `qlen 1000``link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00``inet 127.0.0.1/8 scope host lo``valid_lft forever preferred_lft forever``inet6 ::1/128 scope host``valid_lft forever preferred_lft forever``2: ens33:  mtu 1500 qdisc fq_codel state UP ``group` `default` `qlen 1000``link/ether 00:0c:29:f1:b5:e1 brd ff:ff:ff:ff:ff:ff``inet 172.16.87.140/24 brd 172.16.87.255 scope global dynamic ens33``valid_lft 1500sec preferred_lft 1500sec``inet6 fe80::20c:29ff:fef1:b5e1/64 scope link``valid_lft forever preferred_lft forever`
```

 

![img](https://img2018.cnblogs.com/blog/1024482/201909/1024482-20190926195311926-778081344.png)

 

## 3. 默认的网卡配置文件

默认情况下，网络使用DHCP

```
`ubuntu1804:~$ cat /etc/netplan/50-cloud-init.yaml``配置文件内容如下` `network:``  ``ethernets:``    ``ens33:``      ``dhcp4: yes``      ``addresses: []` `  ``version: 2`
```

## 4. 设置静态IP

需要把配置文件修改为以下内容：

```
`ubuntu1804:~$ sudo vi /etc/netplan/50-cloud-init.yaml`
```

假设IP地址修改为192.168.1.100，子网掩码24位即255.255.255.0，网关设置为192.168.1.1，DNS1：223.5.5.5，DNS2：223.6.6.6

```
`network:``  ``ethernets:``    ``ens33:``      ``dhcp4: no``      ``addresses: [192.168.1.100/24]``      ``optional: ``true``      ``gateway4: 192.168.1.1``      ``nameservers:``          ``addresses: [223.5.5.5,223.6.6.6]` `  ``version: 2`
```

　　

![img](https://img2018.cnblogs.com/blog/1024482/201909/1024482-20190926195125025-1367860921.png)



## 5. 应用新配置

```
`ubuntu1804:~$ sudo netplan apply`
```

使用`ip addr`检查新地址

```
`ubuntu1804:~$ ip addr`
```

 

![img](https://img2018.cnblogs.com/blog/1024482/201909/1024482-20190926195452363-191570303.png)

 

## 6. 测试网络连通性

```bash
ubuntu1804:~$ ping 192.168.1.100
```

![img](https://img2018.cnblogs.com/blog/1024482/201909/1024482-20190926195509927-312010988.png)
