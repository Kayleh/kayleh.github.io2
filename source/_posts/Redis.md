---
title: Redis
tags: middleware
translate_title: redis
date: 2020-06-27T17:30:29+08:00
---

# Redis

<!--more-->

### 在Linux下安装

 https://redis.io/ 官网下载，移动到`/opt` 目录下. 在终端使用命令解压

```shell
$ tar -zxvf redis-XXXXXX.tar.gz
```

进入解压后的目录,运行make指令(需要GCC编译器)

```
$ cd redis.XXX
$ make
$ make install
```

进入默认安装的目录

```
$ cd usr/local/bin
```

在根目录创建一个文件夹/myredis，把安装目录下的redis.conf复制到/myredis，复制的目的是不影响出厂的设置

```
cp redis.conf /myredis
```

要把myredis的权限修改,否则会出现redis无法SHUTDOWN的问题

```
sudo chmod 777 /myredis
```

修改复制过来的conf

```
vim redis.conf
```

修改为为yes

```
原来的：
##########GENERAL###################
XXX
daemonzie no

修改为:
daemonize yes
```

检查有没有启动Redis

```
$ ps -ef|gref redis
```

检查端口是否启动

```
lsof -i :6379
```

结果是没有启动的

##### 启动方法：

在/usr/local/bin下：

```
$ redis-server /myredis/redis.conf
```

默认端口是6379

```
$ redis-cli -p 6379
```

检查是否连接成功

```
127.0.0.1:6379> ping
```

```
PONG
```

返回PONG表示成功

退出：

```
127.0.0.1:6379> SHUTDOWN
exit
```

### KEY关键字

```
DBSIZE //当前数据库的key的数量
select db //切换数据库
Flushdb  //清空当前库
Flushall //清空所有库
key * 当前库所有的key
exists key //判断key是否存在，有返回1，无则0
move key db //移动到目标库，当前库的移除
expire key 秒钟 //给key设置过期时间，过期后查询到的是nid空值
ttl key //查看还有多久过期，-1表示永不过期，-2表示已过期
type key //查看key是什么类型
```

### redis五种数据结构

##### String：字符串

```
set key value
get key
del key
append key value //在value后追加
strlen //String长度
INCR/DECR KEY//一定要是数字，自增自减
INCRBY/DECRBY KEY 步长  //多步递增递减
getrange/setrange key index index  //根据索引取值设置值
setex key 秒钟 value   //设置值的时候设置过期时间
setnx  //set if not exist
mset key1 value1 key2 value2 // 设置多个值
mget/msetnx

```

##### List：列表

```
LPUSH list1 1 2 3 4 5 (类似栈)
LRANGE list1 0 -1
5
4
3
2
1
lpop list1
"5"
rpop list1
"1"
```

```
RPUSH list2 1 2 3 4 5
LRANGE list2 0 -1
1
2
3
4
5
lpop list2
"1"
rpop list2
"5"
```

```
lindex //按照索引下标获得元素，（从上到下）
llen  //长度
LREM KEY N Value  //删除key数组中的N个Value
LTRIM KEY 开始index 结束index //截取指定范围的值后在赋值给key
rpoplpush 源列表 目的列表  //把源列表的最底的值移动到目的列表的最上面
lset key index value //根据数组下标设置成value
linsert key before/after 值1 值2  //把值2的值插入到key数组值1的前面/后面
```

##### Set：集合

```
sadd  key value1，value1，value2  //只会进去不重复的值 
smembers key value 0 -1 //打印全部
sismember key value //判断value是否在key里
scard  //获取集合里面的元素
srem key value //删除集合中元素
srandmember key //随机出几个数
spop key //随机出栈
smove key1 key2 在key1里某个值  //将key1里的某个值赋给key2
sdiff set1 set2  //差集，set1里有的，set2没有的
sinter set1 set2 //交集，都有的
sunion set1 set2 //并集
```

##### Hash ：哈希

```
value是一个键值对
hset key <key1,value1>
hget key key1
hmset KEY1 keyA valueA KEY2 keyB valueB
hmgetall  
hdel KEY1 keyA
HEXISTS KEY1 keyA //判断是否存在
hkeys/kvals KEY1
hincrby/hincrbyfloat KEY1  keyA  步长/浮点数    //自增自减
hsetnx
```

##### Zset（sorted set）：有序集合

在set基础上，加一个score值

set是 k1 v1 v2 v3 

zset是 k1  score1  v1  score2  v2

```
zadd  key  k1  score1  v1  score2  v2
zrange key 0 -1  //只会打印value
zrange key 0 -1 withscores  //会打印v1，score，v2，score
zrangebyscore key 开始score 结束score //  "（" 表示不包含， a（ b  表示大于等于a，小于b 
zrangebyscore key 开始score 结束score withscore
zrangebyscore key 开始score 结束score limit 开始下标步 多少步  
zrem key score对应的value  //删除元素
zacard  key  //统计key里value的个数
zcount key score区间
zrank key value  //获取下标
zrevrank  key value //获取反转后的下标
zrevrange key 0 -1//反转集合
zrevrangebyscore key 结束score 开始score   //反转集合，index也要反转

```

### 配置文件

#### Units

1.配置大小单位，开头定义了一些基本的度量单位，只支持bytes，不支持bit

2.对大小写不敏感

![1593308699248](https://cdn.jsdelivr.net/gh/kayleh/cdn/img/Redis/1.png)

#### INCLUDES

可以通过includes包含，redis.conf可以作为总闸,包含其他

![1593308936736](https://cdn.jsdelivr.net/gh/kayleh/cdn/img/Redis/2.png)

#### GENERAL

daemonize 默认为no

pidfile 进程管道id文件

port 默认端口

tcp-backlog,backlog  511是一个连接队列,在高并发环境下你需要一个高backlog值来避免慢客户端连接问题

bind 端口及网卡的绑定

timeout 0 当系统空闲一段时间后中断

Tcp-keepalive 单位为秒,设置为0则不会进行Keepalive检测

loglevel notice 日志级别

logfile 日志文件

syslog-enabled 是否把日志输出到syslog中

syslog-ident 指定syslog里的日志标志

syslog-facility 指定syslog设备,值可以是USER或LOCAL0-LOCAL7

databases 默认有16个库

![1593309132453](https://cdn.jsdelivr.net/gh/kayleh/cdn/img/Redis/3.png)

#### SECURITY

```
config get requirepass
config set requirepass "123456"   //立即生效
访问任何命令前使用 auth 123456
```

#### LIMIT

maxclients 10000   允许10000人连接

maxmemory <bytes>

maxmemory-policy  noexiction  缓存过期清洁策略 ,默认永不过期

- volatile-lru:使用LRU算法移除key,只对设置了过期时间的键
- allkeys-lru:使用LRU算法移除key
- volatile-random:在过期集合中移除随机的key,只对设置了过期时间的键
- allkeys-random:移除随机的key
- volatile-ttl:移除那些TTL值最小的key,即那些最近要过期的key
- noexiction :不进行移除.针对写操作,只是返回错误信息

LRU算法:最近最少使用的

Maxmemory-samples  设置样本数量,LRU算法和最小TTL算法都并非是精确的算法,而是估算值,所以你可以设置样本的大小,redis默认会检查这么多个key并选择其中LRU的那个;

#### 常用配置

- redis默认不是以守护进程的方式运行,可以通过该配置项修改,使用yes启动守护进程

  ```
  daemonize no
  ```

- 当Redis以守护进程方式运行时,Redis默认会把pid写入/var/run/redis.pid文件,可以通过pidfile指定
```
pid /var/run/redis.pid
```
- 指定redis监听端口,默认端口为6379
```
port 6379
```
- 绑定的主机地址
```
blind 127.0.0.1
```
- 当客户端闲置多长时间后关闭连接,如果指定为0,表示关闭该功能
```
timeout 300
```
- 指定日志记录级别,Redis总共支持四个级别,debug、verbose、notice、warning，默认为verbose
```
loglevel verbose
```
- 日志记录方式，默认为标准输出，如果配置Redis为守护进程方式，而这里又配置为日志记录方式为标准输出，则日志将会发送给/dev/null
```
logfile stdout
```

- 设置数据库的数量，默认数据库为0，可以使用<dbid>命令在连接上指定数据库id

```
databases 16
```

- 指定在多长时间内，有多少次更新操作，就将数据同步到数据文件，可以多个条件配合

```
save <seconds> <changes>
Redis默认配置文件中提供了三个条件:
save 900 1
save 300 10
save 60 10000
```

- 指定存储至本地数据库时是否压缩数据，默认为yes，Redis采用LZF压缩，如果为了节省CPU时间，可以关闭该选项，但会导致数据库文件变的巨大

```
rdbcompression yes
```

- 指定本地数据库文件名，默认为dump.rdb

```
dbfilename dump.rdb
```

- 指定本地数据库存放目录

```
dir ./
```

- 设置当本机为slav服务时，设置master服务的IP地址及端口，在Redis启动时，它会自动从master进行数据同步

```
slaveof <masterip> <masterport>
```

- 当master服务先设置了密码保护，slav服务连接master的密码

```
masterauth <master-password>
```

- 设置Redis连接密码，如果配置了连接密码，客户端在连接Redis时需要通过AUTH <password>命令提供密码，默认关闭

```
requirepass foobared
```

- 设置同一时间最大客户端连接数，默认无限制，Redis可以同时打开的客户端连接数为Redis进程可以打开的最大文件描述符，如果设置 maxclients 0，表示不作限制。当客户端连接数到达限制时，Redis会关闭新的连接并向客户端返回max numbers of clients reached 错误信息

```
maxclients 128
```

- 指定Redis最大内存限制，Redis在启动时会把数据加载到内存中，达到最大内存后，redis会先尝试清除已到期或即将到期的Key，当此方法处理后，仍然到达最大内存设置，将无法再进行写入操作，但仍然可以进行读取操作。Redis新的vm机制，会把key存放内存，value会存放在swap区。

```
maxmemory <bytes>
```

- 指定是否在每次更新操作后进行日志记录。Redis在默认情况下时异步的把数据写入磁盘，如果不开启，可能会在断电时导致一段时间内的数据丢失。因为redis本身同步数据文件时按save条件来同步的，所以有的数据会在一段时间内只存在内存中。默认为no

```
appendonly no
```

- 指定更新日志文件名，默认为appendonly.aof

```
appendfilename appendonly.aof
```

- 指定更新日志条件，共有3个可选值：

```
appendfsync everysec
no: 表示等操作系统进行数据缓存同步到磁盘（快）
always：表示每次更新操作后手动调用fsync()将数据写到磁盘（慢，安全）
everysec：表示每秒同步一次（折中，默认值）
```

- 指定是否启用虚拟内存机制，默认为no。VM机制将数据分页存放，有Redis将访问量较少的页即冷数据swap到磁盘上，访问多的页面由磁盘换出到内存中

```
vm-enabled no
```

- 虚拟内存文件路径,默认值为/tmp/redis.swap

```
vm-swap-file /tmp/redis.swap
```

- 将所有大于vm-max-memory的数据存入虚拟内存，无论vm-max-memory设置多小，所有索引数据都是内存存储的(Redis的索引数据 就是keys)，也就是说，当vm-max-memory设置为0的时候，其实是所有value都存在于磁盘。默认为0

```
vm-max-memory 0
```

- Redis swap文件分成了很多page，一个对象可以保存在多个page上面，但一个page上不能被多个对象共享，vm-page-size是要根据存储的数据大小来设定的，作者建议如果存储很多小对象，page大小最好设置为32或者64bytes;如果存储很大的对象，则可以使用更大的page，如果不确定，就使用默认值

```
vm-page-size 32
```

- 设置swap文件中的page数量，由于页表(一种表示页面空闲或使用的bitmap)是放在内存中的，在磁盘上每8个page将消耗1bytes的内存

```
vm-pages 134217728
```

- 设置访问swap文件的线程数，最好不要超过机器的核数，如果设置为0，那么所有对swap文件的操作都是串行的，可能会造成比较长时间的延迟。默认值为4

```
vm-max-threads 4
```

- 设置在向客户端应答时，是否把较小的包含并为一个包发送，默认为开启

```
glueoutputbuf yes
```

- 指定在超过一定的数量或者最大的元素超过某一临界值时，采用一种特殊的哈希算法

```
hash-max-zipmap-entries 64
hash-max-zipmap-value 512
```

- 指定是否激活重置哈希，默认为开启

```
activerehashing yes
```

- 指定包含其他的配置文件，可以在同一主机上多个Redis实例之间同一份配置文件，而同时各个实例又拥有自己的特定配置文件

```
inclue /path/to.local,conf
```

## Redis持久化RDB

>在指定的时间间隔内将内存中的数据集快照写入磁盘，即Snapshot快照，它恢复时是将快照文件直接读到内存里

#### 是什么？

Redis会单独创建(fork)一个子进程来进行持久化，会先将数据写入到一个临时文件中，待持久化过程都结束了，再用这个临时文件，替换上次持久化好的文件。

整个过程中，主进程是不进行任何IO操作的，这就确保了极高的性能。

如果需要进行大规模数据的恢复，且对于数据恢复的完整性不是非常敏感，那RDB方法要比AOF方式更加的高效。

RDB的缺点是最后一次持久化后的数据可能丢失。

#### Fork

> Fork的作用是复制一个与当前进程一样的进程。新进程的所有数据（变量、环境变量、程序计数器等）
>
> 数值都和原进程一致，但是是一个全新的进程，并作为原进程的子进程



RDB保存的是dump.rdb文件,

先拷贝一份rdb，删除原rdb，再重命名为dump.rdb，即可恢复

#### 配置文件的位置

##########SNAPSHOT###########

save 秒钟 写操作次数

禁用 save “”



指定存储至本地数据库时是否压缩数据，默认为yes，Redis采用LZF压缩，如果为了节省CPU时间，可以关闭该选项，但会导致数据库文件变的巨大

rdbcompression yes



stop-writes-on-bgsave-error   yes

如果后台在save操作出现错误的时候，停止写入

如果配置为no，表示你不在乎数据不一致或者有其他的手段发现和控制



rgbchecksum  yes    ##是否校验rdb文件

在存储快照后，还可以让Redis使用CRC算法来进行数据校验，但是这样做会增加大约10%的性能消耗，

如果希望获取到最大的性能提升，可以关闭此功能。



**触发RDB快照**

命令

`save` 手动保存 `save`只管保存，其他不管，全部阻塞

`bgsave` Redis会在后台异步进行快照操作，快照同时还可以响应客户端请求，可以通过lastsave命令获得最后一次成功执行快照的时间



执行flushall命令，也会产生dump.rdb文件，但里面是空的，无意义。

config get dir获取目录

停止

动态所有停止RDB保存规则的方法：redis-cli config set save “”

### 优势

1.适合大规模的数据恢复

2.对数据完整性和一致性要求不高

### 劣势

1.在一定间隔时间做一次备份，所有如果redis意外down掉的话，就会丢失最后一次快照后的所有修改

2.fork的时候，内存中的数据被克隆了一份，大致2倍的膨胀性需要考虑

#### 总结

```


内存中的      rdbSave     磁盘中的
数据对象   ----------》    RDB文件
            rdbload                


```

- RDB是一个非常紧凑的文件

- RDB在保存文件时父进程唯一要做的就是fork出一个子进程来做，接下来的工作全部由子进程来做，

  父进程不需要再做其他IO操作，所以RDB持久化方式可以最大化redis的性能

- 与AOF相比，在恢复大的数据集的时候，RDB方式会更快一些。



- 数据丢失风险大
- RDB需要经常fork子进程来保存数据集到硬盘上，当数据集比较大的时候，fork的过程是非常耗时的，可能会导致Redis在一些毫秒级不能响应客户端的请求。

## Redis持久化之AOF

> 以日志的形式来记录每个写操作，将Redis执行过的所有写指令记录下来（读操作不记录），只许追加文件但不可以改写文件，redis启动之初会读取该文件重新构建数据，换言之，redis重启的话就根据日志文件的内容将写指令从前到后执行一次以完成数据的恢复工作

AOF保存的是appendonly.aof文件

###########appendonly##########

恢复：删除dump.rdb，vim  appendonly.aof，删除末尾行的FLUSHALL，再次连接数据库即可访问。

两者可以共存，优先找aof，如果aof有修改为不能识别的字符，开启redis时会被拒绝。

这时，当前文件夹下有一个redis-check-aof，使用命令：

```
redis-check-aof --fix appendonly.aof
continue?[y/N]:y
```

命令会删除不符合语法规范的字段。

### rewrite

AOF采用文件追加方式，文件会越来越大为避免出现此种情况，新增了重写机制，当AOF文件的大小超过所设定的阈值时，Redis就会启动AOF文件的内容压缩，只保留可以恢复数据的最小指令集.可以使用bgrewriteaof

重写原理：

AOF文件持续增长而过大时，会fork出一条新进程来将文件重写（也是先写临时文件最后再rename），遍历新进程的内存中数据，每条记录有一条的set 语句。重写aof文件的操作，并没有读取旧的aof文件，而是将整个内存中的数据库内容用命令的方式重写了一个新的aof文件，这点和快照有点类似。

触发机制：

Redis会记录上次重写时的AOF大小，默认配置是当AOF文件大小是上次rewrite后大小的一倍且文件大于64M时触发。

auto-aof-rewrite-percentage 100  一倍

auto-aof-rewrite-min-size 64mb

#### 优势

每秒同步：appendfsync always 同步持久化 每次发生数据变更会被立即记录到磁盘  性能较差但数据完整比较好

每修改同步：appendfsync  everysec  异步操作，每秒记录  如果一秒内宕机，有数据丢失。

不同步：appendfsync  no 从不同步

#### 劣势

相同数据集的数据而言aof文件要远大于rdb文件，恢复速度慢与rdb

aof运行效率要慢与rdb，每秒同步策略较好，不同步效率和rdb相同

```
                              AOF                   网络协议格式
  _________________   命令请求     ________________   的命令内容   ____________________
 |      客户端      | __________> |     服务器      | __________>|       AOF文件      |
 |_________________|             |________________|            |___________________|
```

- aof文件时一个只进行追加的日志文件
- Redis可以在AoF文件体积变得过大时，自动地在后台对AOF进行重写



- 对于相同的数据集来说，AOF文件的体积通常要大于RDB文件的体积
- 根据所使用的fsync策略，AOF的速度可能会慢于RDB

#### 总结

- RDB持久化方式能够在指定的时间间隔能对你的数据进行快照存储

- AOP持久化方式记录每次对服务器写的操作，当服务器重启的时候回重新执行这些命令来回复原始的数据，AOP命令以redis协议追加保存每次写的操作到文件末尾.

- Redis还能对AOF文件进行后台重写，使得AOF文件的体积不至于过大

- 只做缓存：如果你只希望你的数据在服务器运行的时候存在，你也可以不使用任何持久化方式.

- 同时开启两种持久化方式.在这种情况下,当redis重启的时候会优先载入AOF文件来恢复原始的数据,因为在通常情况下AOF文件保存的数据集要比RDB文件保存的数据集要完整. 

- RDB的数据不实时,同时使用两者时服务器重启也只会找AOF文件, 建议不要只使用AOF,因为RDB更适合于备份数据库(AOF在不断变化不好备份),

  快速重启,而且不会有AOF可能存在的bug,留着作为一个万一的手段.

## 事务

> 可以一次执行多个命令，本质是一组命令的集合。一个事务中的所有命令都会序列化，按顺序地串行化执行而不会被其他命令插入，不许加塞

#### 能做什么？

一个队列中，一次性的、顺序性、排他性的执行一系列命令

#### 常用命令

| **DISCARD**              | **取消事务，放弃执行事务块内的所有命令。**                   |
| ------------------------ | ------------------------------------------------------------ |
| **EXEC**                 | **执行所有事务块内的命令。**                                 |
| **MULTI**                | **标记一个事务块的开始。**                                   |
| **UNWATCH**              | **取消 WATCH 命令对所有 key 的监视。**                       |
| **WATCH key [key ...\]** | **监视一个(或多个) key ，如果在事务执行之前这个(或这些) key 被其他命令所改动，那么事务将被打断。** |

##### 正常执行

MULTI 相当与 一个新的购物车，每输入一条命令返回QUEUED相当于加入购物车，EXEC执行命令相当于结账。

##### 放弃事务

在事务没有EXEC之前调用DISCARD

##### 全体连坐

如果有一个指令不能正常运行（编译出错），事务EXEC会报错

##### 冤头债主

**运行时出错的命令**不会执行，而其他命令仍然会放行。

> Redis是否支持事务？ 是部分支持。

##### watch监控

- 悲观锁(Pessimistic Lock)

  > 我对这个事情的发展很悲观，每次去拿数据的时候都认为别人会修改，为了避免出事，把整张表锁了，
  >
  > 表锁，并发性最差，一致性最好。

- **乐观锁(Optimistic Lock)**

  > 我认为这个事没有人会去干，不会上锁，乐观锁在每条记录的后面加一个version版本号字段。
  >
  > 乐观锁策略：提交版本必须大于记录当前版本才能执行。

在调用MULTI之前，先调用  WATCH  + KEY

**UNWATCH取消所有key的监控**

有加塞篡改，监控了key，key被修改了，事务将被打断，调用UNWATCH再执行一次

#### 阶段

开启：以MULTI开始一个事务

入队：将多个命令入队到事务中，接到这些命令并不会立即执行，而是放到等待执行的事务队列里面。

执行：由EXEC命令触发事务

#### 总结

watch指令，类似乐观锁，事务提交时，如果key的值已被别的客户端改变，比如某个list已被别的客户端push/pop过了，整个事务队列都不会执行。

通过watch命令在事务执行之前监控了多个keys，倘若在watch之后有任何key的值发生了变化，EXEC命令执行的事务都将被放弃，同时返回Nullmulti-bulk应答以通知调用者事务执行失败。

#### 特性：

单独的隔离操作：事务中的所有命令都会序列化、按顺序的执行。事务在执行的过程中，不会被其他客户端发送来的请求所打断。

没有隔离级别的概念：队列中的命令没有提交之前都不会实际的被执行，因为事务提交前任何指令都不会被实际执行，也就不存在“事务内的查询要看到事务里的更新，在事务外查询不能看到”这个问题。

不保证原子性：redis同一个事务中如果有一条命令执行失败，其后的命令仍然会被执行，没有回滚。

## 消息订阅发布

是什么？

> 进程间的一种消息通信模式：发送者(pub)发送消息，订阅者(sub)接收消息

下图展示了频道channel1，以及订阅这个频道的三个客户端---client2和client5、client1之间的关系

 ![img](https://cdn.jsdelivr.net/gh/kayleh/cdn/img/Redis/pubsub1.png) 

当有新消息通过PUBLISH命令发送给频道channel1时，这个消息就会发送给订阅它的三个客户端

 ![img](https://cdn.jsdelivr.net/gh/kayleh/cdn/img/Redis/pubsub2.png) 



下表列出了 redis 发布订阅常用命令：

| **命令**                                         | **描述**                               |
| :----------------------------------------------- | :------------------------------------- |
| **PSUBSCRIBE pattern [pattern ...\]**            | **订阅一个或多个符合给定模式的频道。** |
| **PUBSUB subcommand [argument [argument ...\]]** | **查看订阅与发布系统状态。**           |
| **PUBLISH channel message**                      | **将信息发送到指定的频道。**           |
| **PUNSUBSCRIBE [pattern [pattern ...\]]**        | **退订所有给定模式的频道。**           |
| **SUBSCRIBE channel[channel ...\]**              | **订阅给定的一个或多个频道的信息。**   |
| **UNSUBSCRIBE[channel [channel ...\]]**          | **指退订给定的频道。**                 |

SUBSCRIBE   c1 c2 

PULISH c1 message

PSUBSCRIBE  new*  

PULISH  new4  message

## 主从复制

> 主机数据更新后根据配置和策略，自动同步到备机的master/slave机制，Master以写为主，Slave以读为主。

##### 在/myredis下：

```
cp redis.conf  redis6379.conf
cp redis.conf  redis6380.conf
cp redis.conf  redis6381.conf
```

修改配置文件

```
vim redis6379.conf
pidfile  /var/run/redis.pid  ->  /var/run/redis6379.pid
port 6379
logfile ""  ->   logfile "6379.log"
备份
dbfilename  dump.rdb   ->    dump6379.rdb

6380,6381 以此为例
```

分别启动

```
redis-server /myredis/redis6379.conf
redis-cli -p 6379
```

检查是否启动

```
ps -ef|gref redis
```

使用命令 info replication查看信息,他们的角色都是master

```
role:master
```

在主机（6379）下往数据库设值

```
set k1 v1
set k2 v2
set k3 v3
```

在从机（6380,6381）分别使用SLAVEOF命令

```
SLAVEOF 127.0.0.1  6379
```

这时再往主机6379设值

```
set k4 v4
```

从机可以获取值

```redis
get k4
"v4"
get k1
"v1"
```

再次使用命令 info replication查看信息

6379主机下多了两个奴隶：6380,6381

6780、6781的角色变成了奴隶。



- **如果从机尝试写入数据。会出错。因为Master以写为主，Slave以读为主**



- 如果主机SHUTDOWN死了，调用从机的 info replication

```
master_link_status: 由up变成了down
```

从机在原地待命



- 如果主机重新连接回来了，并设值

```
set k7 v7
```

从机依然可以获取k7的值

```
get k7
"v7"
```

- 如果从机退出并重新连接role角色会变成master，并且会丢失退出期间的数据,

  调用SLAVEOF 127.0.0.1  6379就可以恢复连接并获取到原来丢失的值

  

  **每次与master断开之后，都需要重新连接，除非配置进redis.conf**

  

#### 薪火相传

> 去中心化
>
> 上一个Slave可以是下一个slave的Master，Slave同样可以接收其他slaves的连接和同步请求，那么该slave作为了链条中的下一个的master，可以有效减轻master的写压力。

中途变更转向：会清除之前的数据，重新建立拷贝最新的

Slaveof 新主库IP 新主库端口



例如81是80的从机，80是79的从机，那么80是79的奴隶，80还是奴隶，81是80的奴隶。

#### 反客为主

一主二仆里，主机挂了，从机使用命令：

```
SLAVEOF no one
```

当前从机的角色就变成了主机，其他从机需要调用：

```
Slaveof 新主库IP 新主库端口
//使当前数据库停止与其他数据库同步，转成组数据库。
```

才能跟随新主机。

### 复制原理

- Slave启动成功连接到master后会发送一个sync命令

- Master接到命令启动后台的存盘进程，同时收集所有接受到的用于修改数据集命令，在后台进程执行完毕之后，master将传送整个数据文件到slave，以完成一次完全同步

- 全量复制：而slave服务在接收到数据库文件数据后，将其存盘并加载到内存中。

- 增量复制：Master继续将新的所有收集到的修改命令依次传给slave，完成同步

  但是只要是重新连接master，一次完全同步（全量复制）将会被自动执行。

### 哨兵模式

> 反客为主的自动版，能够后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库

#### 启动

在/myredis下面创建一个sentinel.conf文件

```shell
touch sentinel.conf
vim sentinel.conf
```

修改为以下内容：

*一组 sentinel.conf 可以监控多个Master*

```shell
sentinel monitor 被监控数据库名字(自己起名字)  127.0.0.1  6379  1

//数字1 表示主机挂掉后salve投票看让谁接替成为主机，得票数多少后成为主机
```

启动redis：

```
redis-sentinel  /myredis/sentinel.conf 
```

主机断开之后，哨兵监控到了，就开始投票，如果两个从机一人一票，就会重新投票，

票数高的从机替换主机，其他从机都跟随这个新主机。

断开的主机回来之后变成了从机，并跟随新主机。

### 复制的缺点

由于所有的写操作都是先在Master上操作，然后同步更新到Slave上，所以从Master同步带Slave机器有一定的延迟，当系统很繁忙的时候，延迟问题会更加严重，Slave机器数量的增加也会使这个问题更加严重。

### Jedis

测试联通

先启动

在/usr/local/bin下：

```
$ redis-server /myredis/redis.conf
```

```
$ redis-cli -p 6379
```

Java：

依赖：

```xml
<dependencies>
        <!-- https://mvnrepository.com/artifact/org.apache.commons/commons-pool2 -->
        <dependency>
            <groupId>org.apache.commons</groupId>
            <artifactId>commons-pool2</artifactId>
            <version>2.8.0</version>
        </dependency>

        <dependency>
            <groupId>redis.clients</groupId>
            <artifactId>jedis</artifactId>
            <version>3.3.0</version>
        </dependency>
    </dependencies>
```



```java
/**
 * @Author: Wizard
 * @Date: 2020/6/29 18:33
 */
public class TestPing {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        System.out.println(jedis.ping());
    }
}
------
PONG
```

API

```java
/**
 * @Author: Wizard
 * @Date: 2020/6/29 18:33
 */
public class TestAPI {
    public static void main(String[] args) {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.set("k1", "v2");
        jedis.get("k1");
        Set<String> keys = jedis.keys("*");
        //事务
        Transaction multi = jedis.multi();
        multi.set("k2", "v2");
//        multi.exec();
        multi.discard();
    }
}
```

事务

```java
/**
 * @Author: Wizard
 * @Date: 2020/6/29 20:04
 */
public class TestTX {
    public static void main(String[] args) throws InterruptedException {
        TestTX test = new TestTX();
        boolean b = test.transMethod();
        System.out.println(b);
    }

    public boolean transMethod() throws InterruptedException {
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        int balance;//可用余额
        int debt;//欠额
        int amtToSubtract = 10;//实刷额度
        jedis.watch("balance");
        //其他程序执行
        // Thread.sleep(3000);
        //jedis.set("balance", "5");
        balance = Integer.parseInt(jedis.get("balance"));
        if (balance < amtToSubtract) {
            jedis.unwatch();
            System.out.println("modify");
            return false;
        }
        return true;
    }
}
```

主从

```java
/**
 * @Author: Wizard
 * @Date: 2020/6/29 20:04
 */
public class TestMS {
    public static void main(String[] args) {
        Jedis jedis_M = new Jedis("127.0.0.1", 6379);
        Jedis jedis_S = new Jedis("127.0.0.1", 6380);

        jedis_S.slaveof("127.0.0.1", 6379);
        jedis_M.set("class", "1");

        System.out.println(jedis_S.get("class"));
    }
}
```

池

```java
/**
 * @Author: Wizard
 * @Date: 2020/6/29 20:29
 */
public class JedisPoolUtils {

    private static volatile JedisPool jedisPool = null;

    private JedisPoolUtils() {
    }

    public static JedisPool getJedisPoolInstance() {
        if (null == jedisPool) {
            synchronized (JedisPoolUtils.class) {
                if (null == jedisPool) {
                    JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
                    jedisPoolConfig.setMaxActive();
                    jedisPoolConfig.setMaxIdle(32);
                    jedisPoolConfig.setMaxWaitMillis(100*1000);
                    jedisPoolConfig.setTestOnBorrow(true);
                    jedisPool = new JedisPool("127.0.0.1", 6379);
                }
            }
        }
        return jedisPool;
    }
}
```

JedisPoolConfig:

![1593434346091](https://cdn.jsdelivr.net/gh/kayleh/cdn/img/Redis/1593434346091.png)

### 缓存雪崩

