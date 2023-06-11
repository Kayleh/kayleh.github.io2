---
title: I/O model
mathjax: false
date: 2020-12-04T01:44:24+08:00
tags: [network]
translate_title: IO-model
---

# I/O模型

## 1. java.io下的字符流和字节流

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/2020072015491941.png)

### 1.1 字符流

字符流更加的方便我们使用，一般字符都是由多个字节来形成的，若我们使用字节流传输，则还需要我们自己将其转换为字符，若我们直接使用字符流的话，这样就能直接读取与输出字符。
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720154944172.png)

- `CharArrayReader`：是基础的字符输入流，能从字符数组中读取数据
- `StringReader`：从字符串输入流中读取数据
- 输出流同理

#### 1.1.1 更高级的字符流

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/2020072015514933.png)

- `BufferedReader`：附带缓存区的字符输入流，但是我们并不能直接实例化供我们使用，而是将我们已经创建的Reader字符流，传入进来，就像对它`升级`一样，多了更多的功能，比如该字符流就是提供了缓存区，这样加快了io的效率，不必重复读取原始数据源
- `FilterReader`：同样也是运用了`装饰模式`，它额外的功能能对字符流中的字符进行筛选等
- `InputStreamReader`：连接字节流与字符流的一个桥梁，将字节流转化为字符流，比较常用的就是FileReader

### 1.2 字节流

字节流则是对一个个字节进行读取
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720155921778.png)

- `ByteArrayInputStream`：字节数组输入流，从字节数组中获取数据
- `FileInputStream`：文件输入流，从文件中获取数据
- 输出流同理

#### 1.2.1 更高级的字节流

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720160513951.png)

- `BufferedInputStream`：附带缓存区的字节输入流，它同样也是与BufferedReader一个原理，也需要传入进本的InputStream进行升级
- `DataInputStream与DataOutputStream`：这俩就比较有意思了，相辅相成，与java内置的`基本数据类型`相关，能够将其中的字节，利用一些方法，比如toLong或toInt等方法直接转换为java的基本数据类型

------

## 2. 装饰器模式

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720161404658.png)
我们刚刚看到的，在字符流中BufferedReader、InputStreamReader和FilterReader，字节流中的BufferedInputStream、DataInputStreamReader与DataOutputStream都运用到了装饰器模式，因为它们本身不能进行实例化，都需要传入基本的Reader或InputStream来进行`升级`，这里便体现的是装饰器模式。

------

## 3. Socket

- 我们可以将Socket认为是`网络传输的端点`，它也是一种`数据源`，将特定的ip地址与端口号与其进行绑定，这样它就能够实现通信的功能，如下图中，服务器中的socket绑定了对应的ip与端口号，与客户端间进行通信
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720162148571.png)

### 3.1 通过Socket发送数据

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720162300339.png)

1. 创建Socket，绑定特定的ip地址与端口号
2. 将Socket与网卡驱动程序绑定
3. 通过Socket我们就能够发送数据了
4. 网卡驱动程序对Socket数据进行读取

### 3.2 通过Socket读取数据

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720162657547.png)

- 与发送数据类似，只不过是将这个过程反过来了

1. 我们还是要先创建Socket
2. 将Socket与网卡驱动程序进行绑定
3. Socket接收来自网卡驱动程序的数据
4. 从Socket中读取数据

------

## 4. 同步异步与阻塞非阻塞的概念

它们有两两组合的四种不同的排列组合，同步与异步强调`通信机制`，通俗点儿说可以是关于反应者的概念；阻塞与非阻塞强调`调用状态`，我们可以将其理解为调用者或者请求发起者
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720162901659.png)

### 4.1 同步（女孩）

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720163148736.png)
男孩向女孩表白，`女孩`立即对该事件进行思考、反应，这就是同步通信机制

### 4.2 异步（女孩）

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/2020072016333178.png)
异步通信机制就是，女孩`不会`对男孩的请求立即响应，而是女孩先去考虑考虑，有结果了呢，我发短信给你

### 4.3 阻塞（男孩）

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720163448654.png)
男孩是个瓜皮，自动对女孩表白了以后，茶不思饭不想，一直等待着女孩的回应，`不做其他的事情`

### 4.4 非阻塞（男孩）

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/2020072016354228.png)
这种男生就比较厉害了，能够协调好生活和爱情，和女孩表白后，不对结果困惑，而是`该干啥还去干啥`，这就是非阻塞调用

### 4.5 四种排列组合

1. 同步阻塞
   男孩表白后，女孩立即进行思考给出反应，男孩在该过程中傻等，不干别的
2. 异步阻塞
   男孩表白后，女孩溜了，回家去想怎么回应了，不立即思考，男孩傻等，不干别的
3. 同步非阻塞
   男孩表白后，男孩干别的去了，不等你回复，而女孩立即陷入了沉思，想着反应结果
4. 异步非阻塞
   两个人都比较想得开，男孩表白完，干别的去了，女孩也不立即考虑这件事情，等啥时候考虑好了，再发消息给男孩

[同步阻塞、同步非阻塞、异步阻塞、异步非阻塞](https://www.cnblogs.com/linkenpark/p/12376343.html)

------

## 5. 网络通信中的线程池

我们在处理高并发请求的时候，若采用如下方法，将会造成很大的资源浪费
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720164448156.png)

线程池的使用是为了避免这种情况，节省系统的资源

### 5.1 java提供的线程池

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720164855993.png)
我们可以利用Runnable与Callable来创建任务，利用线程池中的线程去执行任务，最后获得结果

### 5.2 java创建线程池的静态方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/I-O模型/20200720165057685.png)

- `newSingleThreadExecutor`：这个线程池中只有一个线程，我们对这一个线程进行不断的复用
- `newFixedThreadPool`：固定线程数量的线程池，当超过线程容量的时候，要进行等待
- `newCachedThreadPool`：这个线程池对多出的任务，还会创建出新的线程去对其进行执行
- `newScheduledThreadPool`：能够实现定时处理任务的线程池
