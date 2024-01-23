---
title: Linux
tags: [linux]
translate_title: linux
date: 2020-07-02T21:26:15+08:00
---

## 虚拟机

<!--more-->

下载中文支持

![1593837102375](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593837102375.png)

网络连接的三种形式

**桥连接**：Linux可以和其他系统通信，但是会造成IP冲突

**NAT**：网络地址转换方式，Linux可以访问外网，不会造成IP冲突

**主机模式**：你的Linux是一个独立的主机，不能访问外网



分区：

boot分区：200M

swap分区：交换分区，虚拟内存，没有挂载点，2048M

根分区/：使用全部剩余空间



安装VMTool复制到/opt下

tar -zxvf VM...... .tar.gz

解压,进去文件夹，执行 /vmware-install.pl



设置共享文件夹，在/mnt/hgfs下



Linux文件系统采用的是级层式的树状结构，最上层的是根目录“/”。

/bin 是Binary的缩写，这个目录存放着最经常使用的命令

/dev 管理设备

/etc管理配置文件

/home 存放普通用户的主目录，在Linux中每个用户都有一个自己的目录，一般该目录名是以用户的账号命名的 

/lib 系统开机需要

/media dvd相关

/mnt 挂载文件夹

/opt 安装的软件

/proc 内核

/root 系统管理员，超级权限者的用户主目录

/sbin Super user系统管理员使用的系统管理程序

/selinux 安全加强

/sys 系统

/tmp 临时文件

/usr 用户，安装的程序

/var 变量，日志



![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/clip_image004.png)  

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/clip_image0014.png)  



### 远程登陆

XShell

- 需要Linux开启一个sshd服务22

终端打开setup，打开系统服务，找到sshd，空格键打开服务。tab键退出。

该服务会监听22端口。

**ubuntu方法：** 

先试着开启SSH服务

在使用SSH之前，可以先检查SSH服务有没有开启。使用命令：sudo ps -e | grep ssh来查看，如果返回的结果是“xxxx? 00:00:00 sshd”,代表服务开启。那个四个x代表四位数字，每台机数字不一样的，如图：

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/894368-20181110064124048-505138018.png)

如果没有反应或者其他结果，再试着开启SSH服务。使用命令sudo /etc/init.d/ssh start来开启服务，如图：

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/894368-20181110064515920-1613146923.png)

如果是图中结果，说明没有安装SSH服务，此时需要安装 SSH服务，为了能提高安装成功率，建议先更新源：sudo apt-get update更新安装源，如图：

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/894368-20181110065024263-2090018697.png)

然后安装SSH服务，使用命令：sudo apt-get install openssh-server。如图：

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/894368-20181110065349975-237913277.png)

等待安装结束即可。然后再次查看服务有没有启动：sudo ps -e | grep ssh：

 ![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/894368-20181110065558878-1157322075.png)

有sshd那个东西，说明服务启动了，如果需要再次确认或者没有图中的结果，使用命令来启动:sudo /etc/init.d/ssh start:

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/894368-20181110065759521-304903884.png)

看到服务starting了，服务成功开启。另外，还有几条命令需要记住：

sudo service ssh status 查看服务状态：

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/894368-20181110070229962-1792308008.png)

sudo service ssh stop 关闭服务：

sudo service ssh restart 重启服务



Xshell新建会话，先查看linux的ip地址。

```
ipconfig
```

![1593769665771](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593769665771.png)

箭头指向的是ip地址。

填写到xshell

![1593769808715](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593769808715.png)

Ubuntu需要配置sshd服务

输入Linux的用户名和密码。成功连接。



如果远程使用命令：

```shell
reboot
```

服务器也会重启



### 文件的上传下载XFTP

协议选择SFTP

端口号选择22

![1593782048647](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593782048647.png)

**乱码解决**：![1593782224041](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593782224041.png)

选择要传输的文件，右键传输就可以了。



### Vi和Vim编辑器

 ![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/078207F0-B204-4464-AAEF-982F45EDDAE9.jpg) 

#### 正常模式

在正常模式下，我们可以使用快捷键。

以 vim 打开一个档案就直接进入一般模式了(这是默认的模式)。在这个模式中， 你可以使用『上下左右』按键来移动光标，你可以使用『删除字符』或『删除整行』来处理档案内容， 也可以使用『复制、贴上』来处理你的文件数据。

#### 插入模式/编辑模式

在模式下，程序员可以输入内容。

按下 i, I 等任何一个字母之后才会进入编辑模式, 一般来说按 i 即可

#### 命令行模式

在这个模式当中， 可以提供你相关指令，完成读取、存盘、替换、离开 vim 、显示行号等的动作则是在此模式中达成的！

#### 各模式之间的互相转换

![1593783036444](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593783036444.png)

#### 快捷键的使用案例

1)  拷贝当前行   yy , 拷贝当前行向下的 5 行 5yy，并粘贴（p）。

2)  删除当前行  dd  , 删除当前行向下的 5 行 5dd

3)  在文件中查找某个单词  [命令行下  /关键字  ， 回车  查找  ,    输入 n 就是查找下一个 ],查询

hello.

4)  设置文件的行号，取消文件的行号.[命令行下  : set nu 和  :set nonu]

5)  编辑 /etc/profile 文件，使用快捷键到底文档的最末行[G]和最首行[gg],注意这些都是在正常模式下执行的。

6)  在一个文件中输入  "hello" ,然后又撤销这个动作，再正常模式下输入 u

7)  编辑  /etc/profile 文件，并将光标移动到  第 20 行  shift+g

第一步：显示行号 :set nu 

第二步：输入 20 这个数

第三步: 输入 shift+g

 ![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/vi-vim-cheat-sheet-sch.gif) 



### 关机&重启命令

#### 基本介绍

shutdown

shutdown -h now : 表示立即关机

shutdown -h 1 : 表示 1 分钟后关机

shutdown -r now: 立即重启

halt

就是直接使用，效果等价于关机

reboot

就是重启系统。

sync：  把内存的数据同步到磁盘

#### 注意细节

当我们关机或者重启时，都应该先执行以下 sync 指令，把内存的数据写入磁盘，防止数据丢失。

### 用户登录和注销

1)  登录时尽量少用 root 帐号登录，因为它是系统管理员，最大的权限，避免操作失误。可以利用普通用户登录，登录后再用”su - 用户名’命令来切换成系统管理员身份.

2)  在提示符下输入 logout 即可注销用户

#### 使用细节

1)logout 注销指令在图形运行级别无效，在 运行级别 3 下有效.



 ### 用户管理

  ![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/clip_image003.gif)

**说明**

Linux 系统是一个多用户多任务的操作系统，任何一个要使用系统资源的用户，都必须首先向系统管理员申请一个账号

#### 添加用户

##### 基本语法

useradd  [选项]  用户名

1)  当创建用户成功后，会自动的创建和用户同名的家目录

2)  也可以通过  useradd -d 指定目录   新的用户名，给新创建的用户指定家目录

#### **设置密码**

基本语法           

passwd  用户名

#### 删除用户

##### 基本语法

userdel  用户名

1)       删除用户 xm，但是要保留家目录

```shell
userdel xm
```

2) 删除用户 xh 以及用户主目录

```
userdel xh -r
```

**在删除用户时，我们一般不会将家目录删除。**

#### 查询用户信息

##### 基本语法

```shell
id  用户名
uid=0(root) gid=0(root)  组=0(root)
 |           |            |
 V           V            V
用户id号   所在组的id号    组名 
```

#### 切换用户

在操作 Linux 中，如果当前用户的权限不够，可以通过 su - 指令，切换到高权限用户，比如 root

**基本语法**

```shell
su	–	切换用户名
//高权限用户向低权限用户不需要密码
exit   //可以回到原来的用户
```

1)从权限高的用户切换到权限低的用户，不需要输入密码，反之需要。

2)当需要返回到原来用户时，使用 exit 指令

```
whoami  //查看当前用户
```

#### 用户组

类似于角色，系统可以对有共性的多个用户进行统一的管理。

**增加组**

groupadd 组 名

**删除组**

groupdel 组 名

**增加用户时直接加上组**

useradd  -g 用户组 用户名

**修改用户的组**

usermod  -g 用户组 用户名



#### **用户和组的相关文件**

**/etc/passwd 文件**

用户（user）的配置文件，记录用户的各种信息 

每行的含义：         

用户名 : 口令 : 用户标识号 : 组标识号 : 注释性描述 : 主目录 : 登录 Shell 



**/etc/shadow 文件**

口令的配置文件
每行的含义：

登录名 : 加密口令 : 最后一次修改时间 : 最小时间间隔 : 最大时间间隔 : 警告时间 : 不活动时间 : 失效时间 : 标志



**/etc/group 文件**
组(group)的配置文件，记录 Linux 包含的组的信息每行含义：

组名:口令:组标识号:组内用户列表



### 运行级别

运行级别说明：
0：关机
1：单用户【找回丢失密码】
2：多用户状态没有网络服务
3：多用户状态有网络服务
4：系统未使用保留给用户
5：图形界面
6：系统重启

常用运行级别是 3 和 5 ，要修改默认的运行级别可改文件

/etc/inittab 的   `id:5:initdefault:`   这一行中的数字

![1593838451860](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593838451860.png)

#### 指定运行级别

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/clip_image001.gif)

init [012356]

int   3

init [012356]

##### 如何找回 root 密码  

进入到 单用户模式，然后修改 root 密码。因为进入单用户模式，root 不需要密码就可以登录。

开机在引导期间使用enter进入页面，按e进入选择第二行的内核kenral再按e进入，输入1告诉内核进入单用户模式，再按回车回去上一级按b启动。

启动后使用passwd root就可以重置密码了。reboot重启。

### 获得帮助信息

#### man

man [命令或配置文件]（功能描述：获得帮助信息）

man  ls

#### help 指令

help 命令 （功能描述：获得 shell 内置命令的帮助信息）

help cd

### 文件目录类

#### pwd 指令

pwd   (功能描述：显示当前工作目录的绝对路径)

#### ls 指令

ls [ 选 项] [目录或是文件]

#### cd 指令

cd .当前目录(不变)

cd  [参数] (功能描述：切换到指定目录)

cd ~ 或者 cd ：回到自己的家目录

cd .. 回到当前目录的上一级目录

cd   /root  使用绝对路径切换到 root 目录

cd  ../../root    使用相对路径到/root 目录

#### mkdir 指令

mkdir 指令用于创建目录(make directory)

mkdir  [选项]  要创建的目录

-p ：创建多级目录

```
mkdir -p /aaa/bbb/ccc
```

#### rmdir 指令

rmdir 指令删除空目录

rmdir  [选项]  要删除的空目录

`rmdir `删除的是空目录，如果目录下有内容时无法删除的。
提示：如果需要删除非空目录，需要使用`rm -rf `要删除的目录

#### touch 指令

touch 指令创建空文件

touch 文件名称

#### cp 指令[*]

cp 指令拷贝文件到指定目录

cp [选项] source dest

-r ：递归复制整个文件夹

cp -r  源目录  目标目录

#### rm 指令

rm 指令移除【删除】文件或目录

rm  [选项]  要删除的文件或目录

-r ：递归删除整个文件夹

-f ： 强制删除不提示

#### mv 指令

mv 移动文件与目录或重命名

mv  oldNameFile newNameFile 		(功能描述：重命名)

 mv /temp/movefile /targetFolder	 (功能描述：移动文件)

#### cat 指令

cat 查看文件内容，是以只读的方式打开。

cat  [选项] 要查看的文件

-n ：显示行号

cat 只能浏览文件，而不能修改文件，为了浏览方便，一般会带上  管道命令 | more

cat 文件名 | more [分页浏览]

#### more 指令

more 指令是一个基于 VI 编辑器的文本过滤器，它以全屏幕的方式按页显示文本文件的内容

快捷键：

![1593843318484](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593843318484.png)

#### less 指令

less 指令用来分屏查看文件内容，它的功能与 more 指令类似，但是比 more 指令更加强大，支持各种显示终端。less 指令在显示文件内容时，并不是一次将整个文件加载之后才显示，而是根据显示需要加载内容，对于显示大型文件具有较高的效率。

```
less 要查看的文件
```

![1593843382522](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593843382522.png)

#### > 指令 和 >> 指令

\> 输出重定向 : 会将原来的文件的内容覆盖

\>> 追加： 不会覆盖原来文件的内容，而是追加到文件的尾部。

```
ls -l >文件    		（功能描述：列表的内容写入文件 a.txt 中（覆盖写））
ls -al >>文件			（功能描述：列表的内容追加到文件 aa.txt 的末尾）
cat 文件 1 > 文件 2		（功能描述：将文件 1 的内容覆盖到文件 2）
cal >> /home/mycal		将当前日历信息  追加到 /home/mycal 文件中 [提示 cal ]  
```

#### echo 指令

echo 输出内容到控制台。

echo  [选项]  [输出内容]

```
echo $PATH   使用 echo 指令输出环境变量,输出当前的环境路径。
```

#### head 指令  

head 用于显示文件的开头部分内容，默认情况下 head 指令显示文件的前 10 行内容

```
head  文件	(功能描述：查看文件头 10 行内容)
head -n 5 文件	(功能描述：查看文件头 5 行内容，5 可以是任意行数)
```

#### tail 指令

tail 用于输出文件中尾部的内容，默认情况下 tail 指令显示文件的后 10 行内容。

```
tail 文件			（功能描述：查看文件后 10 行内容）
tail -n 5 文件  	（功能描述：查看文件后 5 行内容，5 可以是任意行数）
tail -f	文件		（功能描述：实时追踪该文档的所有更新，工作经常使用）
```

#### ln 指令

软链接也叫符号链接，类似于 windows 里的快捷方式，主要存放了链接其他文件的路径

```
ln -s [原文件或目录] [软链接名] （功能描述：给原文件创建一个软链接）
ln -s /root linkToRoot		在/home 目录下创建一个软连接 linkToRoot，连接到 /root 目录
rm -rf  linkToRoot          删除软连接
ln 硬链接 
##软链接可以跨文件系统，硬链接不可以；软链接可以对一个不存在的文件名（filename）进行链接（当然此时如果你vi这个软链接文件，linux会自动新建一个文件名为filename的文件），硬链接不可以（其文件必须存在，inode必须存在）；软链接可以对目录进行连接，硬链接不可以。两种链接都可以通过命令 ln 来创建。ln 默认创建的是硬链接。使用 -s 开关可以创建软链接。
```

当我们使用 pwd 指令查看目录时，仍然看到的是软链接所在目录。

#### history 指令

查看已经执行过历史命令,也可以执行历史指令

```
history    （功能描述：查看已经执行过历史命令）
history 10 	显示最近使用过的 10 个指令。
!10   		执行编号为10的指令
```

### 时间日期类

#### date 指令-显示当前日期

```
1) date		（功能描述：显示当前时间）
2) date +%Y （功能描述：显示当前年份）
3) date +%m	（功能描述：显示当前月份）
4) date +%d	（功能描述：显示当前是哪一天）
5) date "+%Y-%m-%d %H:%M:%S"（功能描述：显示年月日时分秒）
```

#### date 指令-设置日期

```
date -s	字符串时间

设置系统当前时间 ， 比如设置成 2018-10-10 11:22:22
date -s "2018-10-10 11:22:22"
```

#### 查看日历指令

```
cal [选项]    （功能描述：不加选项，显示本月日历）
cal
cal 2021
```

### 搜索查找类

#### find 指令         

find 指令将从指定目录向下递归地遍历其各个子目录，将满足条件的文件或者目录显示在终端  

find  [搜索范围]  [选项]

![1593844669367](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593844669367.png)

```
按文件名：根据名称查找/home 目录下的 hello.txt 文件
find /home -name hello.txt

按拥有者：查找/opt 目录下，用户名称为 nobody 的文件
find /opt -user nobody

查找整个 linux 系统下大于 20m 的文件（+n  大于	-n 小于	n 等于）
find / -size +20M
find / -size +20480K

查询	/ 目录下，所有 .txt 的文件
find / -name *.txt
```

#### locate 指令

locaate 指令可以快速定位文件路径。locate 指令利用事先建立的系统中所有文件名称及路径的locate 数据库实现快速定位给定的文件。Locate 指令无需遍历整个文件系统，查询速度较快。为了保证查询结果的准确度，管理员必须定期更新 locate 时刻。 

```
updatedb 
locate 搜索文件 
```

由于 locate 指令基于数据库进行查询，所以第一次运行前，必须使用 updatedb 指令创建 locate 数据库。

#### grep 指令和 管道符号 |

grep 过滤查找 ， 管道符，“|”，表示将前一个命令的处理结果输出传递给后面的命令处理。

```
grep [选项] 查找内容 源文件
```

 -n 显示匹配行及行号

 -i 忽略字母大小写

 ```
请在  hello.txt  文件中，查找	"yes"	所在行，并且显示行号
cat hello.txt | grep -n yes
 ```

### 压缩和解压类

#### gzip/gunzip 指令

gzip 用于压缩文件， gunzip 用于解压的

gzip 文件   （功能描述：压缩文件，只能将文件压缩为*.gz 文件）

gunzip 文 件.gz  （功能描述：解压缩文件命令）

```
gzip 压缩， 将 /home 下的 hello.txt 文件进行压缩
gzip  hello.txt

gunzip 压缩， 将 /home 下的 hello.txt.gz 文件进行解压缩
gunzip  hello.txt.gz
```

当我们使用 gzip 对文件进行压缩后，不会保留原来的文件。

#### zip/unzip 指令

zip 用于压缩文件， unzip 用于解压的，这个在项目打包发布中很有用的

```
zip		[选项] XXX.zip	 将要压缩的内容（功能描述：压缩文件和目录的命令）
unzip	[选项] XXX.zip 	（功能描述：解压缩文件）
```

zip  -r：递归压缩，即压缩目录

unzip   -d<目录> ：指定解压后文件的存放目录

````shell
将 /home 下的 所有文件进行压缩成 mypackage.zip
zip -r mypackage.zip /home/

将 mypackge.zip 解压到 /opt/tmp 目录下
unzip -d /opt/tmp/ mypackage.zip
````

#### tar 指令

tar 指令 是打包指令，最后打包后的文件是 .tar.gz 的文件。

```
tar	[选项]	XXX.tar.gz	打包的内容	(功能描述：打包目录，压缩后的文件格式.tar.gz)
```

![1593845537786](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593845537786.png)

```shell
压缩多个文件，将  /home/a1.txt 和  /home/a2.txt 压缩成 a.tar.gz
tar -zcvf a.tar.gz  a1.txt a2.txt

将/home 的文件夹 压缩成 myhome.tar.gz
tar -zcvf myhome.tar.gz /home/

将  a.tar.gz	解压到当前目录
tar -zxvf a.tar.gz

将 myhome.tar.gz	解压到 /opt/ 目录下
#指定解压到的那个目录，事先要存在才能成功，否则会报错。
tar -zxvf myhome.tar.gz -C /opt/
```



### 组管理和权限管理
#### Linux 组基本介绍

在 linux 中的每个用户必须属于一个组，不能独立于组外。在 linux 中每个文件有所有者、所在组、其它组的概念。
1)	所有者
2)	所在组
3)	其它组
4)	改变用户所在的组

 

![1593864434878](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593864434878.png)



#### 文件/目录 所有者

一般为文件的创建者,谁创建了该文件，就自然的成为该文件的所有者。

### 查看文件的所有者

指令：ls  -ahl

创建一个组 police,再创建一个用户 tom,将 tom 放在 police 组 ,然后使用 tom 来创建一个文件 ok.txt

![1593864576338](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593864576338.png)

所有者👆

#### 修改文件所有者

指令：chown 用户名 文件名

使用 root 创建一个文件 apple.txt ，然后将其所有者修改成 tom

![1593864639589](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593864639589.png)

#### 组的创建

groupadd 组 名

创建一个组, ,monster

创建一个用户  fox ，并放入到 monster 组中

```
groupadd monster
useradd -g monster fox
id fox //查看
```

#### 文件/目录 所在组

当某个用户创建了一个文件后，默认这个文件的所在组就是该用户所在的组。

#### 查看文件/目录所在组

ls –ahl 

#### 修改文件所在的组

chgrp 组名 文件名

使用 root 用户创建文件 orange.txt ,看看当前这个文件属于哪个组，然后将这个文件所在组，修改到 police 组 。

![1593865387296](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593865387296.png)

#### 其它组

除文件的所有者和所在组的用户外，系统的其它用户都是文件的其它组.

#### 改变用户所在组

在添加用户时，可以指定将该用户添加到哪个组中，同样的用 root 的管理权限可以改变某个用户所在的组。

```
usermod   –g    组名  用户名
usermod –d  目录名 用户名  改变该用户  
```

创建一个土匪组（bandit）将 tom 这个用户从原来所在的 police 组，修改到 bandit(土匪) 组

![1593865717951](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593865717951.png)

### 权限的基本介绍

ls  -l 中显示的内容如下：

```shell
-rwxrw-r-- 1 root root 1213 Feb 2 09:39 abc
```

0-9 位说明

1)第 0 位确定文件类型(d, - , l , c , b)

2)第 1-3 位确定所有者（该文件的所有者）拥有该文件的权限。---User

3)第 4-6 位确定所属组（同用户组的）拥有该文件的权限，---Group

4)第 7-9 位确定其他用户拥有该文件的权限 ---Other

![1593865847037](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593865847037.png)



### rwx权限详解

#### rwx作用到文件

1) [ r ]代表可读(read): 可以读取,查看

2)  [ w ]代表可写(write): 可以修改,但是不代表可以删除该文件,删除一个文件的前提条件是对该文件所在的目录有写权限，才能删除该文件.

3) [ x ]代表可执行(execute):可以被执行

#### rwx作用到目录

1) [ r ]代表可读(read): 可以读取，ls 查看目录内容

2) [ w ]代表可写(write): 可以修改,目录内创建+删除+重命名目录

3) [ x ]代表可执行(execute):可以进入该目录

### 文件及目录权限实际案例

ls  -l 中显示的内容如下：

-rwxrw-r-- 1 root root 1213 Feb 2 09:39 abc

10 个字符确定不同用户能对文件干什么

第一个字符代表文件类型： 文件 (-),目录(d),链接(l)
其余字符每 3 个一组(rwx) 读(r) 写(w) 执行(x) 
第一组 rwx : 文件拥有者的权限是读、写和执行
第二组 rw- :  与文件拥有者同一组的用户的权限是读、写但不能执行

第三组 r-- :	不与文件拥有者同组的其他用户的权限是读不能写和执行

可用数字表示为: r=4,w=2,x=1  因此 rwx=4+2+1=7

| **1**           | **文件：硬连接数或	目录：子目录数**           |
| --------------- | ------------------------------------------------ |
| **root**        | **用户**                                         |
| **root**        | **组**                                           |
| **1213**        | **文件大小(字节)，如果是文件夹，显示 4096 字节** |
| **Feb 2 09:39** | **最后修改日期**                                 |
| **abc**         | **文件名**                                       |

​	

#### 修改权限-chmod

通过 chmod 指令，可以修改文件或者目录的权限

#### 第一种方式：+ 、-、= 变更权限

u:所有者  g:所有组  o:其他人  a:所有人(u、g、o 的总和)

1) chmod   u=rwx,g=rx,o=x   文件目录名

2) chmod   o+w    文件目录名

3) chmod   a-x    文件目录名

给 abc 文件 的所有者读写执行的权限，给所在组读执行权限，给其它组读执行权限。
![1593866461439](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593866461439.png)

给 abc 文件的所有者除去执行的权限，增加组写的权限

![1593866504885](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593866504885.png)

给 abc 文件的所有用户添加读的权限  

![1593866558942](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593866558942.png)

#### 第二种方式：通过数字变更权限

规则：r=4 w=2 x=1,rwx=4+2+1=7 

chmod u=rwx,g=rx,o=x    文件目录名

相当于  chmod  751	文件目录名



将  /home/abc.txt    文件的权限修改成	rwxr-xr-x, 使用给数字的方式实现：

rwx = 4+2+1 = 7

r-x = 4+1=5

r-x = 4+1 =5

指令：chmod 755 /home/abc.txt

#### 修改文件所有者-chown

chown  newowner  file  						改变文件的所有者

chown newowner:newgroup file 	改变用户的所有者和所有组    

-R                       如果是目录 则使其下所有子文件或目录递归生效



请将 /home/abc .txt 文件的所有者修改成 tom

![1593866819855](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593866819855.png)

请将 /home/kkk 目录下所有的文件和目录的所有者都修改成 tom

首选我们应该使用 root 操作。  

![1593866872283](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593866872283.png)

#### 修改文件所在组-chgrp

chgrp newgroup file  改变文件的所有组

1)    请将 /home/abc .txt 文件的所在组修改成 bandit (土匪)

```shell
chgrp bandit /home/abc.txt
```

2)    请将 /home/kkk 目录下所有的文件和目录的所在组都修改成 bandit(土匪)

```
chgrp -R bandit /home/kkk
```

![1593866984875](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593866984875.png)

### 最佳实践-警察和土匪游戏

police警察     bandit土匪

jack, jerry: 警 察

xh, xq: 土 匪

(1)  创建组

bash> groupadd police 

bash> groupadd bandit

(2)  创建用户 

 ![1593867122713](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593867122713.png)

 ![1593867129607](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593867129607.png)

 (3)    jack 创建一个文件，自己可以读写，本组人可以读，其它组没人任何权限

 ![1593867173773](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593867173773.png)

 (4)   jack 修改该文件，让其它组人可以读, 本组人可以读写

 ![1593867219396](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593867219396.png)

 (5)   xh 投靠 警察，看看是否可以读写. 

先用 root 修改 xh 的组 ：

 ![1593867266232](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593867266232.png)

使用 jack 给他的家目录 /home/jack 的所在组一个 rx 的权限

 ![1593867293834](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593867293834.png)

xh 需要重新注销在到 jack 目录就可以操作    jack 的文件  

![1593867344404](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593867344404.png)



## crond 任务调度

### 原理  

![1593948751281](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593948751281.png)

![1593948778770](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593948778770.png)

**crontab  进行 定时任务的设置**  

**任务调度**：是指系统在某个时间执行的特定的命令或程序。

任务调度分类：

1.系统工作：有些重要的工作必须周而复始地执行。如病毒扫描等

2.个别用户工作：个别用户可能希望执行某些程序，比如对 mysql 数据库的备份。

#### 基本语法

```
crontab [选项]
```

![1593948881827](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593948881827.png)

#### 要求

设置任务调度文件：/etc/crontab

设置个人任务调度。执行 crontab –e 命令。  

接着输入任务到调度文件  

如：*/1 * * * * ls –l   /etc/ > /tmp/to.txt

意思说每小时的每分钟执行 ls –l /etc/ > /tmp/to.txt 命令

#### 步骤如下

1)  cron -e

2)  */ 1 * * * * ls -l /etc >> /tmp/to.txt

3)  当保存退出后就程序。

4)  在每一分钟都会自动的调用 ls -l /etc >> /tmp/to.txt

#### 参数细节说明  

![1593949018840](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593949018840.png)

![1593949051397](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593949051397.png)

![1593949079188](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593949079188.png)

##### **案例 1**：每隔 1 分钟，就将当前的日期信息，追加到 /tmp/mydate 文件中

1)  先编写一个文件 /home/mytask1.sh     

date >> /tmp/mydate

2)  给 mytask1.sh 一个可以执行权限

chmod 744 /home/mytask1.sh

3)  crontab -e

4)  \*/1 \* \* \* \*  /home/mytask1.sh

5)  成功

##### **案例 2**：每隔 1 分钟， 将当前日期和日历都追加到 /home/mycal 文件中  

1)  先编写一个文件  

/home/mytask2.sh

date >> /tmp/mycal

 cal >> /tmp/mycal

2)  给 mytask1.sh 一个可以执行权限

chmod 744 /home/mytask2.sh

3) crontab -e

4) */1 * * * *  /home/mytask2.sh

5)  成功

##### **案例 3:**     每天凌晨 2:00 将 mysql 数据库 testdb ，备份到文件中mydb.bak。

1)  先编写一个文件  /home/mytask3.sh

/usr/local/mysql/bin/mysqldump -u root -proot testdb > /tmp/mydb.bak

2)  给 mytask3.sh 一个可以执行权限

```
chmod 744 /home/mytask3.sh
```

3) 

```
crontab -e
```

4)    

```
0 2 * * *  /home/mytask3.sh
```

5)  成功

#### crond 相关指令:

1)  conrtab –r：终止任务调度。

2)  crontab –l：列出当前有那些任务调度

3)  service crond restart   [重启任务调度]

## Linux 磁盘分区、挂载

### 分区基础知识

#####  windows 下的磁盘分区

![1593951062587](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593951062587.png)

#### 分区的方式：

1) mbr 分区:

1.最多支持四个主分区

2.系统只能安装在主分区

3.扩展分区要占一个主分区

4.MBR 最大只支持 2TB，但拥有最好的兼容性

2) gtp 分区:

1.支持无限多个主分区（但操作系统可能限制，比如 windows 下最多 128 个分区）

2.最大支持 18EB 的大容量（1EB=1024 PB，1PB=1024 TB ）

3.windows7 64 位以后支持 

#### windows 下的磁盘分区

![1593950528566](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593950528566.png)

### Linux 分区

#### 原理介绍

1)Linux 来说无论有几个分区，分给哪一目录使用，它归根结底就只有一个根目录，一个独立且唯一的文件结构 , Linux 中每个分区都是用来组成整个文件系统的一部分。

2)Linux 采用了一种叫“载入”的处理方法，它的整个文件系统中包含了一整套的文件和目录， 且将一个分区和一个目录联系起来。这时要载入的一个分区将使它的存储空间在一个目录下获得。

![1593950575312](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593950575312.png)

#### 硬盘说明

1)Linux 硬盘分 IDE 硬盘和 SCSI 硬盘，目前基本上是 SCSI 硬盘

2)对于 IDE 硬盘，驱动器标识符为“hdx~”,其中“hd”表明分区所在设备的类型，这里是指 IDE 硬盘了。“x”为盘号（a 为基本盘，b 为基本从属盘，c 为辅助主盘，d 为辅助从属盘）,“~”代表分区，前四个分区用数字 1 到 4 表示，它们是主分区或扩展分区，从 5 开始就是逻辑分区。例，hda3 表示为第一个 IDE 硬盘上的第三个主分区或扩展分区,hdb2 表示为第二个 IDE 硬盘上的第二个主分区或扩展分区。  

3)对于 SCSI 硬盘则标识为“sdx~”，SCSI 硬盘是用“sd”来表示分区所在设备的类型的，其余则和 IDE 硬盘的表示方法一样 . 

##### 使用 lsblk 指令查看当前系统的分区情况  

![1593950651437](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593950651437.png)

![1593950681315](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593950681315.png)

#### 挂载的经典案例

需求是给我们的 Linux 系统增加一个新的硬盘，并且挂载到/home/newdisk

![1593950721662](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593950721662.png)

### 如何增加一块硬盘

1)虚拟机添加硬盘

2)分区    fdisk         /dev/sdb 

3)格式化 mkfs   -t    ext4    /dev/sdb1

4)挂载   先创建一个  /home/newdisk , 挂 载  mount     /dev/sdb1    /home/newdisk

5)设置可以自动挂载(永久挂载，当你重启系统，仍然可以挂载到 /home/newdisk) 。

vim   /etc/fstab

/dev/sdb1          /home/newdisk           ext4    defaults        0 0

#### 具体的操作步骤整理

##### 虚拟机增加硬盘步骤 1

在【虚拟机】菜单中，选择【设置】，然后设备列表里添加硬盘，然后一路【下一步】，中间只有选择磁盘大小的地方需要修改，至到完成。然后重启系统（才能识别）！

![1593953351911](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593953351911.png)

![1593953412730](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593953412730.png)

![1593953444288](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593953444288.png)

![1593953468858](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593953468858.png)

![1593953495297](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593953495297.png)

重启虚拟机reboot

重启后使用 lsblk -f 

可以看见多了个sdb

##### 虚拟机增加硬盘步骤 2

使用分区命令

```
  fdisk  /dev/sdb
```

开始对/sdb 分区

输入m可以看到帮助

m	显示命令列表

p	显示磁盘分区 同 fdisk –l

n	新增分区

d	删除分区

w	写入并退出



```
输入n

显示  e  extended
	 p  primary partition(1-4)
选择p	 
```



说明： 开始分区后输入 n，新增分区，然后选择 p ，分区类型为主分区。两次回车默认剩余全部空间。最后输入 w 写入分区并退出，若不保存退出输入 q。

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/clip_image005.jpg)

##### 虚拟机增加硬盘步骤 3

格式化磁盘

分区命令:

```
mkfs -t ext4  /dev/sdb1
```

其中 ext4 是分区类型

##### 虚拟机增加硬盘步骤 4

**挂载**: 将一个分区与一个目录联系起来，

•mount     设备名称  挂载目录

•例如：  mount   /dev/sdb1   /home/newdisk

•umount   设备名称  或者 挂载目录 

•例如：   umount   /dev/sdb1    或者   umount  /newdisk

##### 虚拟机增加硬盘步骤 5

vim   /etc/fstab

在UUID上面一行插入

```shell
/dev/sdb1     /home/newdisk     ext4  defaults  0 0
```

这句话可以使开机后能自动挂载

使用命令mount -a立即生效



 永久挂载通过修改实现挂载添加完成后  执行 –即刻生效

![1593950964217](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1593950964217.png)

### 磁盘情况查询

#### 查询系统整体磁盘使用情况

```
df -h
```

![1594016323677](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594016323677.png)

#### 查询指定目录的磁盘占用情况

```
du -h	/目录
```

查询指定目录的磁盘占用情况，默认为当前目录

```
-s 指定目录占用大小汇总

-h 带计量单位

-a 含文件

--max-depth=1  子目录深度

-c 列出明细的同时，增加汇总值
```

#### 查询 /opt 目录的磁盘占用情况，深度为 1  

![1594016421875](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594016421875.png)

#### 磁盘情况-工作实用指令

1)    统计/home 文件夹下文件的个数

```
^-  表示以"-"打头的，表示文件
```



![1594016824199](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594016824199.png)

2)    统计/home 文件夹下目录的个数

![1594016885378](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594016885378.png)

3)统计计/home 文件夹下文件的个数，包括子文件夹里的

![1594016923222](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594016923222.png)

4)    统计文件夹下目录的个数，包括子文件夹里的

![1594016946230](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594016946230.png)

5)以树状显示目录结构  

![1594016968695](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594016968695.png)

![1594017008507](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594017008507.png)

###  网络配置  

Linux 网络配置原理图(含虚拟机)  

目前我们的网络配置采用的是 NAT。

![1594018740806](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594018740806.png)

#### 查看网络 IP 和网关

查看虚拟网络编辑器  

![1594018794841](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594018794841.png)

#### 修改 ip 地址(修改虚拟网络的 ip)

![1594018819402](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594018819402.png)

#### 查看网关  

![1594018857189](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594018857189.png)

#### 查看 windows 环境的中 VMnet8 网络配置 (ipconfig 指令)

1)  使用 ipconfig 查看

2)  界面查看

![1594018892385](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594018892385.png)

#### ping 测试主机之间网络连通  

ping  目的主机 （功能描述：测试当前服务器是否可以连接目的主机）

**测试当前服务器是否可以连接百度**

[root@hadoop100 桌面]# ping [www.baidu.com](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/http://www.baidu.com/)

#### linux 网络环境配置

**第一种方法(自动获取)**

![1594018974152](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594018974152.png)

缺点: linux 启动后会自动获取 IP,缺点是每次自动获取的 ip 地址可能不一样。这个不适用于做服务器，因为我们的服务器的 ip 需要时固定的。  

**第二种方法(指定固定的 ip)**

直 接 修 改 配 置 文 件 来 指 定 IP, 并 可 以 连 接 到 外 网 ( 程 序 员 推 荐 ) ， 编 辑                                                                     vi      /etc/sysconfig/network-scripts/ifcfg-eth0

要求：将 ip 地址配置的静态的，ip 地址为 192.168.184.130

![1594019066944](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594019066944.png)

修改后，一定要 重启服务

1)  service network restart

2)  reboot 重启系统

![1594019131820](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594019131820.png)

## 进程管理  

#### 进程的基本介绍

 1)在 LINUX 中，每个执行的程序（代码）都称为一个进程。每一个进程都分配一个 ID 号。

2)每一个进程，都会对应一个父进程，而这个父进程可以复制多个子进程。例如 www 服务器。

3)每个进程都可能以两种方式存在的。前台与后台，所谓前台进程就是用户目前的屏幕上可以进行操作的。后台进程则是实际在操作，但由于屏幕上无法看到的进程，通常使用后台方式执行。

4)一般系统的服务都是以后台进程的方式存在，而且都会常驻在系统中。直到关机才才结束。

#### 显示系统执行的进程

查看进行使用的指令是  ps ,一般来说使用的参数是 ps -aux

![1594038649910](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594038649910.png)

![1594038680528](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594038680528.png)

#### ps 指令详解

1)指令：ps –aux|grep xxx ，比如我看看有没有 sshd 服务

指令说明

•  System V 展示风格

•  USER：用户名称

•  PID：进程号

•  %CPU：进程占用 CPU 的百分比

•  %MEM：进程占用物理内存的百分比

• VSZ：进程占用的虚拟内存大小（单位：KB）

• RSS：进程占用的物理内存大小（单位：KB）

• TT：终端名称,缩写 .

• STAT：进程状态，其中 S-睡眠，s-表示该进程是会话的先导进程，N-表示进程拥有比普通优先级更低的优先级，R-正在运行，D-短期等待，Z-僵死进程，T-被跟踪或者被停止等等

• STARTED：进程的启动时间

• TIME：CPU 时间，即进程使用 CPU 的总时间

• COMMAND：启动进程所用的命令和参数，如果过长会被截断显示

**要求：以全格式显示当前所有的进程，查看进程的父进程。**

![1594038857538](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594038857538.png)

**•**  ps -ef 是以全格式显示当前所有的进程

**•**  -e 显示所有进程。-f 全格式。

​		**•**  ps -ef|grep xxx

​		**•** 是 BSD 风格

​		**•** UID：用户 ID

​		**•** PID：进程 ID

​		**•** PPID：父进程 ID

​		**•** C：CPU 用于计算执行优先级的因子。数值越大，表明进程是 CPU 密集型运算，执行优先级会降低；数值越小，表明进程是 I/O 密集型运算，执行优先级会提高

​		**•** STIME：进程启动的时间

​		**•** TTY：完整的终端名称

​		**•** TIME：CPU 时间

​		**•** CMD：启动进程所用的命令和参数

如果我们希望查看 sshd 进程的父进程号是多少，应该怎样查询 ？

![1594038908719](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594038908719.png)

可以看到是1.

#### 终止进程 kill 和 killall

若是某个进程执行一半需要停止时，或是已消了很大的系统资源时，此时可以考虑停止该进程。使用 kill 命令来完成此项任务。

```
kill  [选项] 进程号（功能描述：通过进程号杀死进程）

killall 进程名称（功能描述：通过进程名称杀死进程，也支持通配符，这在系统因负载过大而变得很慢时很有用）
```

**选项:**

-9 :表示强迫进程立即停止

**踢掉某个非法登录用户**  

xshell用jack登录

![1594039007134](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039007134.png)

**终止远程登录服务 sshd, 在适当时候再次重启 sshd 服务**

![1594039036135](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039036135.png)

**终止多个 gedit 编辑器 【killall , 通过进程名称来终止进程】**  

![1594039077859](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039077859.png)

**强制杀掉一个终端**  

![1594039104006](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039104006.png)

#### 查看进程树 pstree

```shell
pstree [选项] ,可以更加直观的来看进程信息
```

-p :显示进程的 PID

-u :显示进程的所属用户



**树状的形式显示进程的 pid**  

![1594039184688](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039184688.png)

**树状的形式进程的用户 id pstree -u 即可。**  

## 服务(Service)管理

服务(service) 本质就是进程，但是是运行在后台的，通常都会监听某个端口，等待其它程序的请求，比如(mysql , sshd 防火墙等)，因此我们又称为守护进程，是 Linux 中非常重要的知识点。  

在 CentOS7.0 后 不再使用 service ,而是 systemctl

![1594039258444](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039258444.png)

#### service 管理指令：

```
service  服务名 [start | stop | restart | reload | status]
```

**查看当前防火墙的状况，关闭防火墙和重启防火墙。**

![1594039305238](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039305238.png)

![1594039336933](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039336933.png)

CentOS用firewalld:   systemctl  status  firewalld



1) 关闭或者启用防火墙后，立即生效。[telnet 测试  某个端口即可]

在window下

telnet不是命令的，是因为没有telnet客户端

![1594039381169](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039381169.png)

2)这种方式只是临时生效，当重启系统后，还是回归以前对服务的设置。

如果希望设置某个服务自启动或关闭永久生效，要使用 chkconfig 指令

#### 查看服务名:

方式 1：使用 setup -> 系统服务 就可以看到。(空格选中，回车确认，tab切换)

![1594039460191](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039460191.png)

方式 2:     /etc/init.d/服务名称

![1594039571261](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039571261.png)

#### 服务的运行级别(runlevel):

查看或者修改默认级别：

```
  vi    /etc/inittab
```

Linux 系统有 7 种运行级别(runlevel)：常用的是级别 3 和 5

• 运行级别 0：系统停机状态，系统默认运行级别不能设为 0，否则不能正常启动

• 运行级别 1：单用户工作状态，root 权限，用于系统维护，禁止远程登陆

• 运行级别 2：多用户状态(没有 NFS)，不支持网络

• 运行级别 3：完全的多用户状态(有 NFS)，登陆后进入控制台命令行模式

• 运行级别 4：系统未使用，保留

• 运行级别 5：X11 控制台，登陆后进入图形 GUI 模式

• 运行级别 6：系统正常关闭并重启，默认运行级别不能设为 6，否则不能正常启动

#### 开机的流程说明  

![1594039668145](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039668145.png)

开机、BIOS自检、boot引导、init进程、判断运行级别、

#### chkconfig 指令  

通过 chkconfig 命令可以给每个服务的各个运行级别设置自启动/关闭

```
查看服务 chkconfig --list|grep xxx
```

![1594039757144](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039757144.png)



chkconfig   服务名   --list



chkconfig   --level  5   服务名   on/off

**将 sshd 服务在运行级别为 5 的情况下，不要自启动**  

![1594039797350](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039797350.png)



**请显示当前系统所有服务的各个运行级别的运行状态**

bash> chkconfig --list

**查看 sshd 服务的运行状态****

bash> service sshd status

**将 sshd 服务在运行级别 5 下设置为不自动启动，看看有什么效果？**

bash> chkconfig --level 5 sshd off

**当运行级别为 5 时，关闭防火墙。**

bash> chkconfig  --level 5  iptables off

 **在所有运行级别下，关闭防火墙**

bash> chkconfig  iptables off

**在所有运行级别下，开启防火墙**

bash> chkconfig  iptables  on

#### 动态监控进程

> top 与 ps 命令很相似。它们都用来显示正在执行的进程。Top 与 ps 最大的不同之处，在于 top 在执行一段时间可以更新正在运行的的进程。

```
top [选项]
```

![1594039987313](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594039987313.png)

**监视特定用户**

top：输入此命令，按回车键，查看执行的进程。

u：然后输入“u”回车，再输入用户名，即可

![1594040023371](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594040023371.png)

**终止指定的进程**

top：输入此命令，按回车键，查看执行的进程。

k：然后输入“k”回车，再输入要结束的进程 ID 号

![1594040063985](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594040063985.png)

**指定系统状态更新的时间(每隔 10 秒自动更新， 默认是 3 秒)：**

bash> top -d 10

#### 查看系统网络情况 netstat(重要)

```
netstat   [选项]

netstat  -anp

-an  按一定顺序排列输出

-p  显示哪个进程在调用
```

查看系统所有的网络服务

![1594040174174](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594040174174.png)

查看服务名为 sshd 的服务的信息。

![1594040196413](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594040196413.png)

### RPM   和 YUM  

#### rpm 包的管理  

> 一种用于互联网下载包的打包及安装工具，它包含在某些 Linux 分发版中。它生成具有.RPM 扩展名的文件。RPM 是 RedHat Package Manager（RedHat 软件包管理工具）的缩写，类似 windows 的 setup.exe，这一文件格式名称虽然打上了 RedHat 的标志，但理念是通用的。
>
> Linux 的分发版本都有采用（suse,redhat, centos 等等），可以算是公认的行业标准了。

#### rpm 包的简单查询指令  

查询已安装的 rpm 列表 rpm  –qa|grep xx

请查询看一下，当前的 Linux 有没有安装 firefox .

![1594089056566](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089056566.png)

### rpm 包名基本格式：

 一个 rpm 包名：firefox-45.0.1-1.el6.centos.x86_64.rpm 名称:firefox

版本号：45.0.1-1

适用操作系统: el6.centos.x86_64

表示 centos6.x 的 64 位系统

如果是 i686i386 32 noarch 

#### rpm 包的其它查询指令：

 rpm -qa :查询所安装的所有 rpm 软件包

rpm -qa | more [分页显示]  

rpm -qa | grep X [rpm -qa | grep firefox ]

![1594089139190](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089139190.png)

rpm -q 软件包名 :查询软件包是否安装

rpm -q firefox

 rpm -qi 软件包名 ：查询软件包信息

![1594089158445](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089158445.png)

rpm -qi file  

rpm -ql 软件包名 :查询软件包中的文件

rpm -ql firefox

![1594089191772](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089191772.png)

rpm -qf 文件全路径名 查询文件所属的软件包

rpm -qf /etc/passwd 

rpm -qf /root/install.log

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/clip_image001.jpg)

#### 卸载 rpm 包：

```
rpm -e RPM 包的名称
```

删除 firefox  软件包 

![1594089294137](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089294137.png)



1)  如果其它软件包依赖于您要卸载的软件包，卸载时则会产生错误信息。如：   $ rpm -e  foo

removing these packages would break dependencies:foo is needed by bar-1.0-1

2)  如果我们就是要删除 foo 这个 rpm 包，可以增加参数 --nodeps ,就可以强制删除，但是一般不推荐这样做，因为依赖于该软件包的程序可能无法运行

如：$ rpm -e --nodeps foo

带上 --nodeps 就是强制删除。

#### 安装 rpm 包：

```
rpm -ivh  RPM 包全路径名称
```

i=install 安 装

v=verbose 提 示

h=hash  进度条

1) 演示安装 firefox 浏览器

步骤先找到 firefox 的安装 rpm 包,你需要挂载上我们安装 centos 的 iso 文件，然后到/media/下去找 rpm 找 。

```
cp firefox-45.0.1-1.el6.centos.x86_64.rpm /opt/
```

![1594089388980](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089388980.png)

### yum

>  Yum 是一个 [Shell ](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/https://baike.baidu.com/item/Shell)前端软件包管理器。基于 [RPM ](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/https://baike.baidu.com/item/RPM)包管理，能够从指定的服务器自动下载 RPM 包并且安装，可以自动处理依赖性关系，并且一次安装所有依赖的软件包。使用 yum 的前提是可以联网。

![1594089423920](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089423920.png)

```shell
查询 yum 服务器是否有需要安装的软件
yum list|grep xx 软件列表
安装指定的 yum 包
yum install xxx	下载安装

```

### 

**使用 yum 的方式来安装 firefox**

先查看一下 firefox    rpm 在 yum 服务器有没有  

![1594089517271](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089517271.png)

1)  安装

yum install firefox

## 搭建 JavaEE 环境  

![1594089578388](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089578388.png)

![1594089603193](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089603193.png)

#### 安装 JDK

0)  先将软件通过 xftp5 上传到 /opt 下

1)  解压缩到 /opt

2)    配置环境变量的配置文件 vim    /etc/profile

![1594089685175](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089685175.png)

JAVA_HOME=/opt/jdk1.7.0_79 

PATH=/opt/jdk1.7.0_79/bin:$PATH 

export JAVA_HOME PATH

**3)需要注销用户，环境变量才能生效**  

如果是在 3 运行级别， logout

如果是在 5 运行级别，

4) 在任何目录下就可以使用 java 和 javac

![1594089893452](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089893452.png)

测试是否安装成功

​                ![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/clip_imag1e001.jpg)    
编写一个简单的 输出

Hello.java 输出"hello,world!"  

![1594089954309](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089954309.png)

#### 安装 tomcat

1)  解压缩到/opt

![1594089990057](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594089990057.png)

2)启动 tomcat    ./startup.sh

先进入到 tomcat 的 bin 目录

![1594090017998](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594090017998.png)

![1594090025822](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594090025822.png)

使用 Linux 本地的浏览是可以访问到 tomcat

开放端口 8080 ,这样外网才能访问到 tomcat vim /etc/sysconfig/iptables

 ![1594090060315](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594090060315.png)

重启防火墙

![1594090082996](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594090082996.png)

测试是否安装成功：

在 windows、Linux  下  访问 http://linuxip:8080

![1594090112721](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594090112721.png)

#### Eclipse 的安装

1)  解压缩到/opt

![1594090161102](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594090161102.png)

2)启动 eclipse，配置 jre 和 server

启动方法 1: 创建一个快捷方式

启动方式 2: 进入到  eclipse 解压后的文件夹，然后执行        ./eclipse    即可

3)编写 jsp 页面,并测试成功!

![1594090202684](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/1594090202684.png)

#### mysql 的安装和配置

```
rpm -ivh MYSQL-server-***.rpm
rpm -ivh MYSQL-client-***.rpm
```

查看是否启动

```
ps -ef|grep mysql
```

查看是否安装成功

```
mysqladmin --version
```

启动服务

```
service mysql start
```

连接

```
mysql
```

改密码

```
/usr/bin/mysqladmin -u root password 123456
```

连接

```
mysql -uroot -p
```

设置开机自启动

```
chkconfig mysql on
```

![1595838101340](https://cdn.kayleh.top/gh/kayleh/cdn/img/Linux/D:\Blog\source\_posts\Linux\1595838101340.png)

拷贝配置文件

```
cp /usr/share/mysql/my-huge.cnf /etc/my.cnf
```



#### 解决编码(已创建的数据库不影响)

显示字符集

```
show variables like '%char%'
```

修改客户端和服务器的字符集

```
vim /etc/my.cnf

//在[client]的socket的下方插入
//在光标的下一行插入 使用o
default-character-set=utf-8

//在[mysqld]的port下插入
character_set_server=utf8
character_set_client=utf8
collation-server=utf8_general_ci

//在[mysql]的no-auto-rehash下插入
default-character-set=utf8
```













## Linux中常用到的命令

显示文件目录命令ls        如ls
改变当前目录命令cd        如cd /home
建立子目录mkdir           如mkdir xiong
删除子目录命令rmdir       如rmdir /mnt/cdrom
删除文件命令rm            如rm /ucdos.bat
文件复制命令cp            如cp /ucdos /fox
获取帮助信息命令man      如man ls
显示文件的内容less        如less mwm.lx

Linux文件属性有哪些？（共十位）
-rw-r--r--那个是权限符号，总共是- --- --- ---这几个位。

第一个短横处是文件类型识别符：-表示普通文件；c表示字符设备（character）；b表示块设备（block）；d表示目录（directory）；l表示链接文件（link）；

第一个三个连续的短横是用户权限位（User）

第二个三个连续短横是组权限位（Group）

第三个三个连续短横是其他权限位（Other）。
每个权限位有三个权限，r（读权限），w（写权限），x（执行权限）。

如果每个权限位都有权限存在，那么满权限的情况就是：-rwxrwxrwx；权限为空的情况就是- --- --- ---。
权限的设定可以用chmod命令，其格式位：chmod ugoa+/-/=rwx filename/directory。例如：
一个文件aaa具有完全空的权限- --- --- ---。
chmod u+rw aaa（给用户权限位设置（增加）读写权限，其权限表示为：- rw- --- ---）
chmod g+r aaa（给组设置权限为可读，其权限表示为：- --- r-- ---）
chmod ugo+rw aaa（给用户、组、其它用户或组设置权限为读写，权限表示为：- rw- rw- rw-）
如果aaa具有满权限- rwx rwx rwx。
chmod u-x aaa（去掉用户可执行权限，权限表示为：- rw- rwx rwx）
如果要给aaa赋予制定权限- rwx r-x r-x，命令为：
chmod u=rwx，go=rx aaa

