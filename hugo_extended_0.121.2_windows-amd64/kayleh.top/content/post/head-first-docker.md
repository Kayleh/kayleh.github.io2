---
title: head-first-docker
mathjax: false
date: 2022-04-23 21:23:00
tags: [docker]
slug: head-first-docker
---



### Docker

Docker 是一个开源的应用容器引擎，基于Go 语言并遵从 Apache2.0 协议开源。

Docker 可以让开发者打包他们的应用以及依赖包到一个轻量级、可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。

容器是完全使用沙箱机制，相互之间不会有任何接口（类似 iPhone 的 app）,更重要的是容器性能开销极低。

#### Docker的应用场景

- Web 应用的自动化打包和发布。
- 自动化测试和持续集成、发布。
- 在服务型环境中部署和调整数据库或其他的后台应用。
- 从头编译或者扩展现有的 OpenShift 或 Cloud Foundry 平台来搭建自己的 PaaS 环境。

1.安装使用

![1](https://raw.githubusercontent.com/Kayleh/cdn4/main/image-20211101172701005.png)

2.错误排查

![img](https://raw.githubusercontent.com/Kayleh/cdn4/main/watermark%252Ctype_ZmFuZ3poZW5naGVpdGk%252Cshadow_10%252Ctext_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2d1b3hpbmdlZ2U%253D%252Csize_16%252Ccolor_FFFFFF%252Ct_70)

- #### docker window环境必须是wsl2，且防火墙服务状态是开启的！

- cmd下执行命令：netsh winsock reset

- DockerCli.exe -SwitchDaemon

- 手动删除下面这个文件夹即可.

```linux
%USERPROFILE%\.docker\contexts
```

- 管理员权限问题，直接在wsl运行,

```shell
sudo su root

sudo service docker start

- 进入/var/lib，chmod -R 777 docker/*

然后重启docker就好了
```



#### Docker 容器使用

Docker 客户端

1、容器使用
获取镜像
如果我们本地没有 ubuntu 镜像，我们可以使用 docker pull 命令来载入 ubuntu 镜像：

```shell
$ docker pull ubuntu
```

2、启动容器
以下命令使用 ubuntu 镜像启动一个容器，参数为以命令行模式进入该容器：

```shell
$ docker run -it ubuntu /bin/bash
```


参数说明：

-i: 交互式操作。
-t: 终端。
ubuntu: ubuntu 镜像。
/bin/bash：放在镜像名后的是命令，这里我们希望有个交互式 Shell，因此用的是 /bin/bash。
3、要退出终端，直接输入 exit:

```shell
root@ed09e4490c57:/# exit
```

4、启动已停止运行的容器
查看所有的容器命令如下：

```shell
$ docker ps -a
```

5、使用 docker start 启动一个已停止的容器：

```shell
$ docker start b750bbbcfd88 
```

6、后台运行
在大部分的场景下，我们希望 docker 的服务是在后台运行的，我们可以过 -d 指定容器的运行模式。

```shell
$ docker run -itd --name ubuntu-test ubuntu /bin/bash
```



> 注：加了 -d 参数默认不会进入容器，想要进入容器需要使用指令 docker exec（下面会介绍到）。
>
> 停止一个容器
> 停止容器的命令如下：
> $ docker stop <容器 ID>

7、停止的容器可以通过 docker restart 重启：

```shell
$ docker restart <容器 ID>
```

8、进入容器
在使用 -d 参数时，容器启动后会进入后台。此时想要进入容器，可以通过以下指令进入：

#### attach 命令

使用 docker attach 命令。

```shell
$ docker attach 1e560fca3906 
注意： 如果从这个容器退出，会导致容器的停止。

```

#### exec 命令

使用 docker exec 命令。

```shell
docker exec -it 243c32535da7 /bin/bash
注意： 如果从这个容器退出，容器不会停止，这就是为什么推荐使用 docker exec 的原因。
```

更多参数说明请使用 docker exec --help 命令查看。

9、导出和导入容器

- 导出容器

如果要导出本地某个容器，可以使用 docker export 命令。

```shell
$ docker export 1e560fca3906 > ubuntu.tar
导出容器 1e560fca3906 快照到本地文件 ubuntu.tar。
```


这样将导出容器快照到本地文件。

- 导入容器快照

可以使用 docker import 从容器快照文件中再导入为镜像，以下实例将快照文件 ubuntu.tar 导入到镜像 test/ubuntu:v1:

```shell
$ cat docker/ubuntu.tar | docker import - test/ubuntu:v1
```

此外，也可以通过指定 URL 或者某个目录来导入，例如：

```shell
$ docker import http://example.com/exampleimage.tgz example/imagerepo
```

10、删除容器
删除容器使用 docker rm 命令：

```shell
$ docker rm -f 1e560fca3906
下面的命令可以清理掉所有处于终止状态的容器。

$ docker container prune
```

11、运行一个 web 应用
前面我们运行的容器并没有一些什么特别的用处。

接下来让我们尝试使用 docker 构建一个 web 应用程序。

我们将在docker容器中运行一个 Python Flask 应用来运行一个web应用。

kali@kali:~# docker pull training/webapp  # 载入镜像
kali@kali:~# docker run -d -P training/webapp python app.py

> 参数说明:
>
> -d:让容器在后台运行。
>
> -P:将容器内部使用的网络端口随机映射到我们使用的主机上。



12、查看 WEB 应用容器
使用 docker ps 来查看我们正在运行的容器：

```
kali@kali:~#  docker ps
CONTAINER ID        IMAGE               COMMAND             ...        PORTS                 
d3d5e39ed9d3        training/webapp     "python app.py"     ...        0.0.0.0:32769->5000/tcp
这里多了端口信息。
----------------------------
PORTS
0.0.0.0:32769->5000/tcp
Docker 开放了 5000 端口（默认 Python Flask 端口）映射到主机端口 32769 上。
```

这时我们可以通过浏览器访问WEB应用

我们也可以通过 -p 参数来设置不一样的端口：

```
~$ docker run -d -p 5000:5000 training/webapp python app.py
```

13、docker ps查看正在运行的容器

```shell
kali@kali:~#  docker ps
CONTAINER ID        IMAGE                             PORTS                     NAMES
bf08b7f2cd89        training/webapp     ...        0.0.0.0:5000->5000/tcp    wizardly_chandrasekhar
d3d5e39ed9d3        training/webapp     ...        0.0.0.0:32769->5000/tcp   xenodochial_hoov
容器内部的 5000 端口映射到我们本地主机的 5000 端口上。
```

14、网络端口的快捷方式
通过 docker ps 命令可以查看到容器的端口映射，docker 还提供了另一个快捷方式 docker port，使用 docker port 可以查看指定 （ID 或者名字）容器的某个确定端口映射到宿主机的端口号。

上面我们创建的 web 应用容器 ID 为 bf08b7f2cd89 名字为 wizardly_chandrasekhar。

我可以使用 docker port bf08b7f2cd89 或 docker port wizardly_chandrasekhar 来查看容器端口的映射情况。

```
kali@kali:~$ docker port bf08b7f2cd89
5000/tcp -> 0.0.0.0:5000
kali@kali:~$ docker port wizardly_chandrasekhar
5000/tcp -> 0.0.0.0:5000
```

15、查看 WEB 应用程序日志
docker logs [ID或者名字] 可以查看容器内部的标准输出。

```
kali@kali:~$ docker logs -f bf08b7f2cd89

 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
   192.168.239.1 - - [09/May/2016 16:30:37] "GET / HTTP/1.1" 200 -
   192.168.239.1 - - [09/May/2016 16:30:37] "GET /favicon.ico HTTP/1.1" 404 -
```

> -f: 让 docker logs 像使用 tail -f 一样来输出容器内部的标准输出。

从上面，我们可以看到应用程序使用的是 5000 端口并且能够查看到应用程序的访问日志。

16、查看WEB应用程序容器的进程
使用 docker top 来查看容器内部运行的进程

```
~$ docker top wizardly_chandrasekhar
UID     PID         PPID          ...       TIME                CMD
root    23245       23228         ...       00:00:00            python app.py
```

- 检查 WEB 应用程序
  使用 docker inspect 来查看 Docker 的底层信息。它会返回一个 JSON 文件记录着 Docker 容器的配置和状态信息。

```
~$ docker inspect wizardly_chandrasekhar
[
    {
        "Id": "bf08b7f2cd897b5964943134aa6d373e355c286db9b9885b1f60b6e8f82b2b85",
        "Created": "2018-09-17T01:41:26.174228707Z",
        "Path": "python",
        "Args": [
            "app.py"
        ],
        "State": {
            "Status": "running",
            "Running": true,
            "Paused": false,
            "Restarting": false,
            "OOMKilled": false,
            "Dead": false,
            "Pid": 23245,
            "ExitCode": 0,
            "Error": "",
            "StartedAt": "2018-09-17T01:41:26.494185806Z",
            "FinishedAt": "0001-01-01T00:00:00Z"
        },
]
```

17、停止 WEB 应用容器

```
~$ docker stop wizardly_chandrasekhar   
wizardly_chandrasekhar
```


18、重启WEB应用容器
已经停止的容器，我们可以使用命令 docker start 来启动。

```
~$ docker start wizardly_chandrasekhar
wizardly_chandrasekhar
```


查询最后一次创建的容器：

```
docker ps -l 

CONTAINER ID        IMAGE                             PORTS                     NAMES
bf08b7f2cd89        training/webapp     ...        0.0.0.0:5000->5000/tcp    wizardly_chandrasekhar
```

正在运行的容器，我们可以使用 docker restart 命令来重启。

19、移除WEB应用容器

我们可以使用 docker rm 命令来删除不需要的容器

```
kali@kali:~$ docker rm wizardly_chandrasekhar  
wizardly_chandrasekhar
```


删除容器时，容器必须是停止状态，否则会报如下错误

```
$ docker rm wizardly_chandrasekhar
Error response from daemon: You cannot remove a running container bf08b7f2cd897b5964943134aa6d373e355c286db9b9885b1f60b6e8f82b2b85. Stop the container before attempting removal or force remove
```

## 推送镜像

#### 登录

```shell
$ docker login
```

#### 标记镜像

```shell
$ docker tag ubuntu:18.04 username/ubuntu:18.04
$ docker image ls
REPOSITORY      TAG        IMAGE ID            CREATED           ...  
ubuntu          18.04      275d79972a86        6 days ago        ...  
username/ubuntu 18.04      275d79972a86        6 days ago        ...  

$ docker push username/ubuntu:18.04
$ docker search username/ubuntu

NAME             DESCRIPTION       STARS         OFFICIAL    AUTOMATED
username/ubuntu
```

### Docker 安装 MySQL

一、docker search mysql 命令来查看可用版本；

二、拉取 MySQL 镜像
拉取官方的最新版本的镜像：
```shell script
$ docker pull mysql:latest
```

三、查看本地镜像
使用以下命令来查看是否已安装了 mysql：
```shell script
$ docker images
```

四、使用以下命令来运行 mysql 容器：
 ```shell script
  $  docker run -itd --name="mysql_venus" -p 3316:3306 -v C:\docker_volumes\mysql\conf\:/etc/mysql/conf.d -v C:\docker_volumes\mysql\data:/var/lib/mysql -v C:\docker_volumes\mysql\logs:/var/log -eMYSQL_ROOT_PASSWORD="123456"  mysql
 ```
- -p 3306:3306 ：映射容器服务的 3316 端口到宿主机的 3306 端口，外部主机可以直接通过 宿主机ip:3316 访问到 MySQL 的服务。
- MYSQL_ROOT_PASSWORD=123456：设置 MySQL 服务 root 用户的密码。
  -v 挂载容器

五、通过 docker ps 命令查看是否安装成功

连接数据库
```shell script
mysql -h localhost -u root -p
```

六、进入容器内部

```shell
docker exec -it mysql bash
mysql -uroot -p
```

七、开启远程访问权限

`命令：`**use mysql;**

`命令：`**select host,user from user;**

`命令：`**ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '123456';**

`命令：`**flush privileges;**

八、查看docker日志

`命令：`

````
docker logs -f --tail 10 a4dac74d48f7
