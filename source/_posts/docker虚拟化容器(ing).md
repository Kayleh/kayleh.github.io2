---
title: docker虚拟化容器
tags: [docker]
categories: [linux]

slug: docker-virtualized-container
date: 2020-08-28T16:36:20+08:00
---

docker

<!--more-->

## 为什么会有docker出现

> 一款产品从开发到上线，从操作系统，到运行环境，再到应用配置。作为开发+运维之间的协作我们需要关心很多东西，这也是很多互联网公司都不得不面对的问题，特别是各种版本的迭代之后，不同版本环境的兼容，对运维人员都是考验
> Docker之所以发展如此迅速，也是因为它对此给出了一个标准化的解决方案。
> 环境配置如此麻烦，换一台机器，就要重来一次，费力费时。很多人想到，能不能从根本上解决问题，软件可以带环境安装？也就是说，安装的时候，把原始环境一模一样地复制过来。开发人员利用 Docker 可以消除协作编码时“在我的机器上可正常工作”的问题。
>
> ![1598604152509](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/1.png)
> 之前在服务器配置一个应用的运行环境，要安装各种软件，就拿尚硅谷电商项目的环境来说吧，Java/Tomcat/MySQL/JDBC驱动包等。安装和配置这些东西有多麻烦就不说了，它还不能跨平台。假如我们是在 Windows 上安装的这些环境，到了 Linux 又得重新装。况且就算不跨操作系统，换另一台同样操作系统的服务器，要移植应用也是非常麻烦的。
>
> 传统上认为，软件编码开发/测试结束后，所产出的成果即是程序或是能够编译执行的二进制字节码等(java为例)。而为了让这些程序可以顺利执行，开发团队也得准备完整的部署文件，让维运团队得以部署应用程式，开发需要清楚的告诉运维部署团队，用的全部配置文件+所有软件环境。不过，即便如此，仍然常常发生部署失败的状况。Docker镜像的设计，使得Docker得以打破过去「程序即应用」的观念。透过镜像(images)将作业系统核心除外，运作应用程式所需要的系统环境，由下而上打包，达到应用程式跨平台间的无缝接轨运作。

# docker理念

Docker是基于Go语言实现的云开源项目。
Docker的主要目标是“Build，Ship and Run Any App,Anywhere”，也就是通过对应用组件的封装、分发、部署、运行等生命周期的管理，使用户的APP（可以是一个WEB应用或数据库应用等等）及其运行环境能够做到“一次封装，到处运行”。

![1598604211629](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/2.png)

Linux 容器技术的出现就解决了这样一个问题，而 Docker 就是在它的基础上发展过来的。将应用运行在 Docker 容器上面，而 Docker 容器在任何操作系统上都是一致的，这就实现了跨平台、跨服务器。只需要一次配置好环境，换到别的机子上就可以一键部署好，大大简化了操作

解决了运行环境和配置问题软件容器，方便做持续集成并有助于整体发布的容器虚拟化技术。

### 能干吗？

#### 之前的虚拟机技术：

虚拟机（virtual machine）就是带环境安装的一种解决方案。
它可以在一种操作系统里面运行另一种操作系统，比如在Windows 系统里面运行Linux 系统。应用程序对此毫无感知，因为虚拟机看上去跟真实系统一模一样，而对于底层系统来说，虚拟机就是一个普通文件，不需要了就删掉，对其他部分毫无影响。这类虚拟机完美的运行了另一套系统，能够使应用程序，操作系统和硬件三者之间的逻辑不变。  

<img src="D:\Blog\source\_posts\docker虚拟化容器\3.png" alt="1598604274549" style="zoom:67%;" />

虚拟机的缺点：
1    资源占用多               2    冗余步骤多                 3    启动慢

#### 容器虚拟化技术

由于前面虚拟机存在这些缺点，Linux 发展出了另一种虚拟化技术：Linux 容器（Linux Containers，缩写为 LXC）。
Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离。有了容器，就可以将软件运行所需的所有资源打包到一个隔离的容器中。容器与虚拟机不同，不需要捆绑一整套操作系统，只需要软件工作所需的库资源和设置。系统因此而变得高效轻量并保证部署在任何环境中的软件都能始终如一地运行。

<img src="D:\Blog\source\_posts\docker虚拟化容器\4.png" alt="1598604334770" style="zoom:67%;" />

比较了 Docker 和传统虚拟化方式的不同之处：
*传统虚拟机技术是虚拟出一套硬件后，在其上运行一个完整操作系统，在该系统上再运行所需应用进程；
*而容器内的应用进程直接运行于宿主的内核，容器内没有自己的内核，而且也没有进行硬件虚拟。因此容器要比传统虚拟机更为轻便。

* 每个容器之间互相隔离，每个容器有自己的文件系统 ，容器之间进程不会相互影响，能区分计算资源。

#### 开发/运维（DevOps）

> 一次构建、随处运行

- 更快速的应用交付和部署

  > 传统的应用开发完成后，需要提供一堆安装程序和配置说明文档，安装部署后需根据配置文档进行繁杂的配置才能正常运行。Docker化之后只需要交付少量容器镜像文件，在正式生产环境加载镜像并运行即可，应用安装配置在镜像里已经内置好，大大节省部署配置和测试验证时间。

- 更便捷的升级和扩缩容

  > 随着微服务架构和Docker的发展，大量的应用会通过微服务方式架构，应用的开发构建将变成搭乐高积木一样，每个Docker容器将变成一块“积木”，应用的升级将变得非常容易。当现有的容器不足以支撑业务处理时，可通过镜像运行新的容器进行快速扩容，使应用系统的扩容从原先的天级变成分钟级甚至秒级。

- 更简单的系统运维

  > 应用容器化运行后，生产环境运行的应用可与开发、测试环境的应用高度一致，容器会将应用程序相关的环境和状态完全封装起来，不会因为底层基础架构和操作系统的不一致性给应用带来影响，产生新的BUG。当出现程序异常时，也可以通过测试环境的相同容器进行快速定位和修复。

- 更高效的计算资源利用

  > Docker是内核级虚拟化，其不像传统的虚拟化技术一样需要额外的Hypervisor支持，所以在一台物理机上可以运行很多个容器实例，可大大提升物理服务器的CPU和内存的利用率。



docker中文网站：https://www.docker-cn.com/

仓库：Docker Hub官网: https://hub.docker.com/

# 安装

#### 前提：

##### CentOS Docker 安装

Docker支持以下的CentOS版本：
CentOS 7 (64-bit)
CentOS 6.5 (64-bit) 或更高的版本

##### 前提条件

目前，CentOS 仅发行版本中的内核支持 Docker。
Docker 运行在 CentOS 7 上，要求系统为64位、系统内核版本为 3.10 以上。
Docker 运行在 CentOS-6.5 或更高的版本的 CentOS 上，要求系统为64位、系统内核版本为 2.6.32-431 或者更高版本。

##### 查看自己的内核

uname命令用于打印当前系统相关信息（内核版本号、硬件架构、主机名称和操作系统类型等）。

![1598605075304](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/6.png)

查看已安装的CentOS版本信息（CentOS6.8有，CentOS7无该命令）

![1598605093121](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/7.png)

![1598605106745](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/8.png)

### Docker的基本组成

镜像（image）

- Docker 镜像（Image）就是一个只读的模板。镜像可以用来创建 Docker 容器，一个镜像可以创建很多容器。

  ![1](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/9.png)

容器（container）

- Docker 利用容器（Container）独立运行的一个或一组应用。容器是用镜像创建的运行实例。

  它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台。

  可以把容器看做是一个简易版的 Linux 环境（包括root用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。

  容器的定义和镜像几乎一模一样，也是一堆层的统一视角，唯一区别在于容器的最上面那一层是可读可写的。

仓库（repository）

- 仓库（Repository）是集中存放镜像文件的场所。
  仓库(Repository)和仓库注册服务器（Registry）是有区别的。仓库注册服务器上往往存放着多个仓库，每个仓库中又包含了多个镜像，每个镜像有不同的标签（tag）。

  仓库分为公开仓库（Public）和私有仓库（Private）两种形式。
  最大的公开仓库是 Docker Hub(https://hub.docker.com/)，
  存放了数量庞大的镜像供用户下载。国内的公开仓库包括阿里云 、网易云 等

小总结

> 需要正确的理解仓储/镜像/容器这几个概念:
>
>  Docker 本身是一个容器运行载体或称之为管理引擎。我们把应用程序和配置依赖打包好形成一个可交付的运行环境，这个打包好的运行环境就似乎 image镜像文件。只有通过这个镜像文件才能生成 Docker 容器。image 文件可以看作是容器的模板。Docker 根据 image 文件生成容器的实例。同一个 image 文件，可以生成多个同时运行的容器实例。
>
> *  image 文件生成的容器实例，本身也是一个文件，称为镜像文件。
> *  一个容器运行一种服务，当我们需要的时候，就可以通过docker客户端创建一个对应的运行实例，也就是我们的容器
> * 至于仓储，就是放了一堆镜像的地方，我们可以把镜像发布到仓储中，需要的时候从仓储中拉下来就可以了。
>

### Docker的架构图

![1598605341500](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/10.png)

## CentOS7安装Docker

> https://docs.docker.com/install/linux/docker-ce/centos/
>
> 官网中文安装参考手册:
>
> https://docs.docker-cn.com/engine/installation/linux/docker-ce/centos/#prerequisites

1. 确定你是CentOS7及以上版本

   ```cmd
   cat /etc/redhat-release
   ```

2. yum安装gcc相关

   CentOS7能上外网

   ![1](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/5.png)

   ```
   yum -y install gcc
   yum -y install gcc-c++
   ```

3. 卸载旧版本

   ```cmd
   yum -y remove docker docker-common docker-selinux docker-engine
   ```

   2018.3官网版本

   ```
   yum remove docker \
                     docker-client \
                     docker-client-latest \
                     docker-common \
                     docker-latest \
                     docker-latest-logrotate \
                     docker-logrotate \
                     docker-selinux \
                     docker-engine-selinux \
                     docker-engine
   ```

4. 安装需要的软件包

   ```cmd
   yum install -y yum-utils device-mapper-persistent-data lvm2
   ```

5. 设置stable镜像仓库

   ```cmd
   yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
   ```

6. 更新yum软件包索引

   ```cmd
   yum makecache fast
   ```

7. 安装DOCKER CE

   ```cmd
   yum -y install docker-ce 
   ```

8. 启动docker

   ```cmd
   systemctl start docker
   ```

9. 测试

   ```
   docker version
   docker run hello-world
   ```

10. 配置镜像加速

    ```cmd
    mkdir -p /etc/docker
    vim  /etc/docker/daemon.json
    ----
     
     #网易云
    {"registry-mirrors": ["http://hub-mirror.c.163.com"] }
     
     
     
     #阿里云
    {
      "registry-mirrors": ["https://｛自已的编码｝.mirror.aliyuncs.com"]
    }
    ----
    systemctl daemon-reload
    systemctl restart docker
    ```

11. 卸载

    ```cmd
    systemctl stop docker 
    yum -y remove docker-ce
    rm -rf /var/lib/docker
    ```

# 使用

#### 阿里云镜像加速

> https://dev.aliyun.com/search.html

登陆阿里云开发者平台,获取加速器地址

![1598605448117](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/11.png)

配置本机Docker运行镜像加速器

鉴于国内网络问题，后续拉取 Docker 镜像十分缓慢，我们可以需要配置加速器来解决，
我使用的是阿里云的本人自己账号的镜像地址(需要自己注册有一个属于你自己的)：   https://xxxx.mirror.aliyuncs.com

```
vim /etc/sysconfig/docker

将获得的自己账户下的阿里云加速地址配置进
other_args="--registry-mirror=https://你自己的账号加速信息.mirror.aliyuncs.com"
```

![1598605528307](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/12.png)


重新启动Docker后台服务：service docker restart

Linux 系统下配置完加速器需要检查是否生效

如果从结果中看到了配置的--registry-mirror参数说明配置成功，如下所示:

![1598605562504](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/13.png)

## 启动Docker后台容器(测试运行 hello-world)

```
docker run hello-world
```

![1598605611408](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/14.png)

输出这段提示以后，hello world就会停止运行，容器自动终止。

- run干了什么

![1598605642470](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/15.png)

### Docker是怎么工作的

> Docker是一个Client-Server结构的系统，Docker守护进程运行在主机上， 然后通过Socket连接从客户端访问，守护进程从客户端接受命令并管理运行在主机上的容器。 容器，是一个运行时环境，就是我们前面说到的集装箱。

![1598605821646](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/16.png)

### 为什么Docker比较比VM快

> (1)docker有着比虚拟机更少的抽象层。由亍docker不需要Hypervisor实现硬件资源虚拟化,运行在docker容器上的程序直接使用的都是实际物理机的硬件资源。因此在CPU、内存利用率上docker将会在效率上有明显优势。
>
> (2)docker利用的是宿主机的内核,而不需要Guest OS。因此,当新建一个容器时,docker不需要和虚拟机一样重新加载一个操作系统内核。仍而避免引寻、加载操作系统内核返个比较费时费资源的过程,当新建一个虚拟机时,虚拟机软件需要加载Guest OS,返个新建过程是分钟级别的。而docker由于直接利用宿主机的操作系统,则省略了返个过程,因此新建一个docker容器只需要几秒钟。

![1](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/17.png)

# Docker常用命令

### 帮助命令

- docker version
- docker info
- docker --help

### 镜像命令

- docker images

  > 列出本地主机上的镜像
  >
  > ![1598606088968](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/18.png)
  >
  > 各个选项说明:
  >
  > ```
  > REPOSITORY：表示镜像的仓库源
  > TAG：镜像的标签
  > IMAGE ID：镜像ID
  > CREATED：镜像创建时间
  > SIZE：镜像大小
  > ```
  >
  > 同一仓库源可以有多个 TAG，代表这个仓库源的不同个版本，我们使用 REPOSITORY:TAG 来定义不同的镜像。
  > 如果你不指定一个镜像的版本标签，例如你只使用 ubuntu，docker 将默认使用 ubuntu:latest 镜像
  >
  > **OPTIONS说明：**
  >
  > -a :列出本地所有的镜像（含中间映像层）
  >
  > -q :只显示镜像ID。
  >
  > --digests :显示镜像的摘要信息
  >
  > --no-trunc :显示完整的镜像信息

- docker search 某个XXX镜像名字

  > https://hub.docker.com
  >
  > 命令: docker search [OPTIONS] 镜像名字
  >
  > OPTIONS说明：
  >
  > --no-trunc : 显示完整的镜像描述
  >
  > -s : 列出收藏数不小于指定值的镜像。
  >
  > --automated : 只列出 automated build类型的镜像；

- docker pull 某个XXX镜像名字

  > 下载镜像
  >
  > docker pull 镜像名字[:TAG]

- docker rmi 某个XXX镜像名字ID

  删除镜像

  删除单个 docker rmi  -f 镜像ID

  删除多个 docker rmi -f 镜像名1:TAG 镜像名2:TAG 

  删除全部 docker rmi -f $(docker images -qa)

？思考

> 结合我们Git的学习心得，大家猜猜是否会有
> docker commit /docker push？？

### 容器命令

> 有镜像才能创建容器，这是根本前提(下载一个CentOS镜像演示)
>
> docker pull centos

新建并启动容器

```
docker run [OPTIONS] IMAGE [COMMAND] [ARG...]
```

 OPTIONS说明:

> 有些是一个减号，有些是两个减号

```
--name="容器新名字": 为容器指定一个名称；
-d: 后台运行容器，并返回容器ID，也即启动守护式容器；
-i：以交互模式运行容器，通常与 -t 同时使用；
-t：为容器重新分配一个伪输入终端，通常与 -i 同时使用；
-P: 随机端口映射；
-p: 指定端口映射，有以下四种格式
      ip:hostPort:containerPort
      ip::containerPort
      hostPort:containerPort
      containerPort
```

- 启动交互式容器

![1598606569114](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/19.png)

```
#使用镜像centos:latest以交互模式启动一个容器,在容器内执行/bin/bash命令。
docker run -it centos /bin/bash 
```

列出当前所有正在运行的容器

```
docker ps [OPTIONS]
-------------------------------------
OPTIONS说明
-a :列出当前所有正在运行的容器+历史上运行过的
-l :显示最近创建的容器。
-n：显示最近n个创建的容器。
-q :静默模式，只显示容器编号。
--no-trunc :不截断输出。
```

退出容器

> 两种退出方式 
>
> - exit
>
>   容器停止退出
>
> - ctrl+P+Q
>
>   容器不停止退出

启动容器

```
docker start 容器ID或者容器名
```

重启容器

```
docker restart 容器ID或者容器名
```

停止容器

```
docker stop 容器ID或者容器名
```

强制停止容器

```
docker kill 容器ID或者容器名
```

删除已停止的容器

```
docker rm 容器ID
```

- 一次性删除多个容器

  ```
  docker rm -f $(docker ps -a -q)
  docker ps -a -q | xargs docker rm
  ```

  

**重要**

启动守护式容器

```
docker run -d 容器名
----------------------------
 
#使用镜像centos:latest以后台模式启动一个容器
docker run -d centos
 
问题：然后docker ps -a 进行查看, 会发现容器已经退出
很重要的要说明的一点: Docker容器后台运行,就必须有一个前台进程.
容器运行的命令如果不是那些一直挂起的命令（比如运行top，tail），就是会自动退出的。
 
这个是docker的机制问题,比如你的web容器,我们以nginx为例，正常情况下,我们配置启动服务只需要启动响应的service即可。例如
service nginx start
但是,这样做,nginx为后台进程模式运行,就导致docker前台没有运行的应用,
这样的容器后台启动后,会立即自杀因为他觉得他没事可做了.
所以，最佳的解决方案是,将你要运行的程序以前台进程的形式运行
```

查看容器日志

```
docker logs -f -t --tail 容器ID
```

- docker run -d centos /bin/sh -c "while true;do echo hello zzyy;sleep 2;done"

  ![1](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/20.png)

  *   -t 是加入时间戳
  *   -f 跟随最新的日志打印
  *   --tail 数字 显示最后多少条

  ![1598606975626](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/21.png)



查看容器内运行的进程

```
docker top 容器ID
```

查看容器内部细节

```
docker inspect 容器ID
```

进入正在运行的容器并以命令行交互

- docker exec -it 容器ID bashShell

- 重新进入docker attach 容器ID

- 上述两个区别

  ```
  attach 直接进入容器启动命令的终端，不会启动新的进程
  exec 是在容器中打开新的终端，并且可以启动新的进程
  ```

  

从容器内拷贝文件到主机上

```
 docker cp  容器ID:容器内路径 目的主机路径
```

![1598607114510](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/22.png)



小总结

![1598607164719](https://cdn.kayleh.top/gh/kayleh/cdn/img/docker虚拟化容器/23.png)

```

attach    Attach to a running container                 # 当前 shell 下 attach 连接指定运行镜像
build     Build an image from a Dockerfile              # 通过 Dockerfile 定制镜像
commit    Create a new image from a container changes   # 提交当前容器为新的镜像
cp        Copy files/folders from the containers filesystem to the host path   #从容器中拷贝指定文件或者目录到宿主机中
create    Create a new container                        # 创建一个新的容器，同 run，但不启动容器
diff      Inspect changes on a container's filesystem   # 查看 docker 容器变化
events    Get real time events from the server          # 从 docker 服务获取容器实时事件
exec      Run a command in an existing container        # 在已存在的容器上运行命令
export    Stream the contents of a container as a tar archive   # 导出容器的内容流作为一个 tar 归档文件[对应 import ]
history   Show the history of an image                  # 展示一个镜像形成历史
images    List images                                   # 列出系统当前镜像
import    Create a new filesystem image from the contents of a tarball # 从tar包中的内容创建一个新的文件系统映像[对应export]
info      Display system-wide information               # 显示系统相关信息
inspect   Return low-level information on a container   # 查看容器详细信息
kill      Kill a running container                      # kill 指定 docker 容器
load      Load an image from a tar archive              # 从一个 tar 包中加载一个镜像[对应 save]
login     Register or Login to the docker registry server    # 注册或者登陆一个 docker 源服务器
logout    Log out from a Docker registry server          # 从当前 Docker registry 退出
logs      Fetch the logs of a container                 # 输出当前容器日志信息
port      Lookup the public-facing port which is NAT-ed to PRIVATE_PORT    # 查看映射端口对应的容器内部源端口
pause     Pause all processes within a container        # 暂停容器
ps        List containers                               # 列出容器列表
pull      Pull an image or a repository from the docker registry server   # 从docker镜像源服务器拉取指定镜像或者库镜像
push      Push an image or a repository to the docker registry server    # 推送指定镜像或者库镜像至docker源服务器
restart   Restart a running container                   # 重启运行的容器
rm        Remove one or more containers                 # 移除一个或者多个容器
rmi       Remove one or more images             # 移除一个或多个镜像[无容器使用该镜像才可删除，否则需删除相关容器才可继续或 -f 强制删除]
run       Run a command in a new container              # 创建一个新的容器并运行一个命令
save      Save an image to a tar archive                # 保存一个镜像为一个 tar 包[对应 load]
search    Search for an image on the Docker Hub         # 在 docker hub 中搜索镜像
start     Start a stopped containers                    # 启动容器
stop      Stop a running containers                     # 停止容器
tag       Tag an image into a repository                # 给源中镜像打标签
top       Lookup the running processes of a container   # 查看容器中运行的进程信息
unpause   Unpause a paused container                    # 取消暂停容器
version   Show the docker version information           # 查看 docker 版本号
wait      Block until a container stops, then print its exit code   # 截取容器停止时的退出状态值
```

