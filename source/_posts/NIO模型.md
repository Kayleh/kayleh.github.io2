---
title: NIO blocking model
mathjax: false
date: 2020-12-05T11:33:46+08:00
tags: [network]
slug: NIO-blocking-model
---

# NIO模型

## 1. 概述

### 1.1 翻译翻译？什么叫NIO？

NIO：我认为翻译成`Non-Blocking`，更加的通俗直白，相比于BIO，也有一个对比，叫他非阻塞IO最好不过了

- 它和BIO有以下的区别
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721215841190.png)
- Channel是`双向`的，即可以读又可以写，相比于Stream，它并不区分出输入流和输出流，而且Channel可以完成非阻塞的读写，也可以完成阻塞的读写

### 1.2 Buffer简介

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721220142379.png)

- Channel的读写是离不开Buffer的，Buffer实际上内存上一块用来读写的区域。

#### 1.2.1 写模式

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721220305715.png)

- 其中三个指针我们要了解一下，`position`为当前指针位置，`limit`用于读模式，用它来标记可读的最大范围，`capacity`是最大的可写范围阈值

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721220837981.png)

当我们写数据写了四个格子时，我们执行`flip()`方法，即可转变为`读模式`，limit指针就直接变到了我们刚刚写数据的极限位置，position指针回到初始位置，这样我们就可以将数据读出来了
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721220618271.png)

#### 1.2.2 读模式到写模式的两种切换

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721221126713.png)

1. 当我们将数据全部读完时，切换到写模式
   调用`clear()`方法，它会使position指针回到初始位置，limit回到最远端，这样就可以重新开始数据了，虽然clear意为清除，但是其实它只是将指针的位置移动了，并没有将数据清除，而是会覆盖原来的位置
   ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721221133628.png)
2. 只读了部分数据，我想将未读的部分保留，而现在我又要开始先进行写模式的操作了，这样可以执行`compact()`方法
   这个方法会`将没有读到的数据保存到初始位置`，而`position指针的位置将会移动到这些数据的后面位置`，从未读的数据后开始进行写数据
   ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721221448757.png)
   之后再读数据的时候，我们就能将上次没有读到的数据读出来了

### 1.3 Channel简介

Channel间的数据交换，都需要依赖Buffer
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721221615368.png)

#### 1.3.1 几个重要的Channel

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200721221704507.png)

- FileChannel：用于文件传输
- ServerSocketChannel和SocketChannel：用于网络编程的传输

## 2. 文件拷贝实战

- 一个字节一个字节的拷贝实在是慢的不行。

```java
import java.io.*;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

interface FileCopyRunner{
    void copyFile(File source,File target);
}

public class FileCopyDemo {

    private static void close(Closeable closeable){
        if(closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    //不使用任何缓冲的留的拷贝
    private static FileCopyRunner noBufferStreamCopy = new FileCopyRunner() {
        @Override
        public void copyFile(File source, File target) {
            InputStream fin = null;
            OutputStream fout = null;
            try {
                fin = new FileInputStream(source);
                fout = new FileOutputStream(target);
                int result;
                while((result = fin.read()) != - 1){
                    fout.write(result);
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                close(fin);
                close(fout);
            }
        }
    };

    //使用缓冲区的流的拷贝
    private static FileCopyRunner bufferStreamCopy = new FileCopyRunner() {
        @Override
        public void copyFile(File source, File target) {
            InputStream fin = null;
            OutputStream fout = null;
            try {
                fin = new FileInputStream(source);
                fout = new FileOutputStream(target);
                //创建缓冲区
                byte[] buffer = new byte[1024];
                int result;
                while((result = fin.read(buffer)) != -1){
                    //result这里表示从中读出来的具体字节数
                    //虽然缓冲区中能缓存1024，但是我们读取的时候不一定就有这么多字节
                    //所以我们使用result做下面的参数
                    fout.write(buffer,0,result);
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                close(fin);
                close(fout);
            }
        }
    };

    //使用带有缓冲区的channel复制 nio
    private static FileCopyRunner nioBufferCopy = new FileCopyRunner() {
        @Override
        public void copyFile(File source, File target) {
            FileChannel fin = null;
            FileChannel fout = null;

            try {
                fin = new FileInputStream(source).getChannel();
                fout = new FileOutputStream(target).getChannel();
                ByteBuffer byteBuffer = ByteBuffer.allocate(1024);

                while(fin.read(byteBuffer) != -1){
                    byteBuffer.flip();//转变为读模式
                    while (byteBuffer.hasRemaining()){
                        fout.write(byteBuffer);
                    }
                    byteBuffer.clear();//转变为写模式
                }
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }finally {
                close(fin);
                close(fout);
            }
        }
    };

    //使用没有缓冲区的channel复制文件
    private static FileCopyRunner nioTransferCopy = ((source, target) -> {
        FileChannel fin = null;
        FileChannel fout = null;

        try {
            fin = new FileInputStream(source).getChannel();
            fout = new FileOutputStream(target).getChannel();

            long transferred = 0L;
            long size = fin.size();
            while(transferred != size){
                //如果拷贝的大小没有达到源文件的大小就要一直拷贝
                transferred += fin.transferTo(0,size,fout);
            }
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            close(fin);
            close(fout);
        }
    });

    public static void main(String[] args) {
        File source = new File("J:\\StudySpace\\Java秒杀系统方案优化-高性能高并发实战\\project.zip");
        File target = new File("J:\\StudySpace\\Java秒杀系统方案优化-高性能高并发实战\\p1.zip");
        File target2 = new File("J:\\StudySpace\\Java秒杀系统方案优化-高性能高并发实战\\p2.zip");
        File target3 = new File("J:\\StudySpace\\Java秒杀系统方案优化-高性能高并发实战\\p3.zip");
        File target4 = new File("J:\\StudySpace\\Java秒杀系统方案优化-高性能高并发实战\\p4.zip");

        new Thread(() -> noBufferStreamCopy.copyFile(source,target)).start();
        new Thread(() -> bufferStreamCopy.copyFile(source,target2)).start();
        new Thread(() -> nioBufferCopy.copyFile(source,target3)).start();
        new Thread(() -> nioTransferCopy.copyFile(source,target4)).start();
    }
}


```

## 3. Selector概述

- Channel需要在Selector上注册
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722145734223.png)
- 注册的同时，要告诉Selector监听的状态
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722145833687.png)
- Channel对应的状态有：`CONNECT`：socketChannel已经与服务器建立连接的状态；`ACCEPT`：serverSocketChannel已经与客户端建立连接的状态；`READ`：可读状态；`WRITE`：可写状态
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722150046897.png)
- Channel在Selector上注册完成后，会返回一个SelectKey对象，其中有几个重要的方法：`interestOps`：查看注册的Channel绑定的状态；`readyOps`：查看哪些是可操作的状态；`channel`：返回channel对象；`selector`：返回selector对象；`attachment`：附加其他对象![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722150611349.png)
- 调用Selector的select方法，返回它监听的事件的数量，可同时响应多个事件。不过它是阻塞式的调用，当监听的事件中没有可以用来响应请求的，则会被阻塞，直到有可用的channel能够响应该请求，才会返回
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722150651862.png)

# 实战

## 1. NIO模型分析

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/202007222229375.png)

- 在服务器端创建一个`Selector`，将`ServerSocketChannel注册到Selector上`，被Selector监听的事件为`Accept`

------

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722222907340.png)

- Client1请求与服务器建立连接，Selector接收到Accept事件，服务器端对其进行处理（handles），服务器与客户端连接成功

------

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722223243146.png)

- 建立连接过程中，服务器通道（ServerSocketChannel）调用`accept方法`，获取到与客户端进行连接的通道（`SocketChannel`），也将其`注册到Selector`上，`监听READ事件`，这样，客户端向服务器发送消息，就能触发该READ事件进行响应，读取该消息。

> Tips: 我们处理这个建立连接并接收从客户端传过来的消息，都是在`一个线程`内完成的。在bio中，则会为单个客户端单独开辟一个线程，用于处理消息，并且客户端在不发送消息的过程中，该线程一直是阻塞的。

------

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722223923471.png)

- 同样，两个客户连接过来也是一个线程在起作用，将客户端2的SocketChannel注册到服务器的Selector，并监听READ事件，随时响应随时处理。即一个客户端有一个SocketChannel，两个客户端就有两个SocketChannel，这个就是我们使用nio编程模型来用一个selector对象在一个线程里边监听以及处理多个通道的io的操作

------

各个Channel是被配置为`非阻塞式`的（configureBlocking(false)），但是Selector本身调用的`select()方法`，它是`阻塞式`的，当监听在Selector上的事件都没有触发时，那么它就会被阻塞，直到有事件对其进行响应

## 2. 聊天室项目代码重点知识

### 2.1 服务器端

#### 2.1.1 字段

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/2020072222584984.png)

#### 2.1.2 主方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722230412178.png)

#### 2.1.3 处理方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722230845441.png)

#### 2.1.4 转发消息方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722233104941.png)

#### 2.1.5 接收消息方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722231319234.png)

### 2.2 客户端

#### 2.2.1 字段

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722231507769.png)

#### 2.2.2 主方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722231820775.png)

#### 2.2.3 处理方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/202007222330187.png)

#### 2.2.4 接收方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722233204365.png)

#### 2.2.5 发送方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722233310845.png)

------

## 3. 测试结果

- 服务器端显示信息正确
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/NIO模型/20200722233342438.png)

## 4. 完整代码

### 4.1 服务器端

```java
package server;

import java.io.Closeable;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Set;

public class ChatServer {
    private static final int DEFAULT_PORT = 8888;
    private static final String QUIT = "quit";
    private static final int BUFFER = 1024;
    private int port;

    private ServerSocketChannel serverSocketChannel;
    private Selector selector;
    private ByteBuffer rBuffer = ByteBuffer.allocate(BUFFER);
    private ByteBuffer wBuffer = ByteBuffer.allocate(BUFFER);
    private Charset charset = Charset.forName(String.valueOf(StandardCharsets.UTF_8));

    public ChatServer(){
        this(DEFAULT_PORT);
    }

    public ChatServer(int port) {
        this.port = port;
    }

    public boolean readyToQuit(String msg){
        return QUIT.equals(msg);
    }

    public void close(Closeable closeable){
        if(closeable != null) {
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void start(){
        try {
            //创建ServerSocketChannel通道
            serverSocketChannel = ServerSocketChannel.open();
            //设置非阻塞模式，默认情况也是阻塞调用的
            serverSocketChannel.configureBlocking(false);
            //绑定端口号
            serverSocketChannel.bind(new InetSocketAddress(port));
            //创建selector
            selector = Selector.open();
            //将accept事件注册到selector上
            serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);
            System.out.println("服务器启动成功，监听端口号：" + port + "...");

            //开始进入监听模式
            while(true){
                //阻塞式调用
                selector.select();

                //获取所有的监听事件，
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                for (SelectionKey selectionKey : selectionKeys) {
                    //处理事件
                    handles(selectionKey);
                }
                //将已经处理完成的事件进行清空
                selectionKeys.clear();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            close(selector);
        }
    }

    /**
     * 处理事件 处理accept事件 和 read事件
     * @param selectionKey 与selector绑定的channel的key
     */
    private void handles(SelectionKey selectionKey) throws IOException {
        if(selectionKey.isAcceptable()){
            //处理accept事件
            //先要获取ServerSocketChannel
            ServerSocketChannel server =(ServerSocketChannel) selectionKey.channel();
            // 我觉得这样写也行 直接调用全局变量 SocketChannel socketChannel = serverSocketChannel.accept();
            //获取对应的客户端的通道
            SocketChannel socketChannel = server.accept();
            socketChannel.configureBlocking(false);
            //将客户端通道绑定到selector上，监听read事件
            socketChannel.register(selector,SelectionKey.OP_READ);
            System.out.println("客户端" + socketChannel.socket().getPort() + ":已经连接");
        }else if(selectionKey.isReadable()){
            //处理read事件
            SocketChannel clientChannel = (SocketChannel) selectionKey.channel();
            String fwdMsg = receive(clientChannel);

            if(fwdMsg.isEmpty()){
                //接不到消息了，那么就把这个通道给他移除了
                selectionKey.cancel();
                //通知selector有注册的通道被移除了，更新状态
                selector.wakeup();
            }else {
                //转发消息
                forwardMessage(clientChannel,fwdMsg);
                if(readyToQuit(fwdMsg)){
                    selectionKey.cancel();
                    selector.wakeup();
                }
            }
        }
    }

    /**
     * 转发消息
     * @param clientChannel 客户端通道
     * @param fwdMsg 转发的消息
     */
    private void forwardMessage(SocketChannel clientChannel, String fwdMsg) throws IOException {
        //keys方法区别于selectedKeys,这个方法返回的是接下来需要被处理的通道key
        //而keys则返回与selector绑定的所有通道key
        //跳过ServerSocketChannel和本身
        for (SelectionKey selectionKey : selector.keys()) {
            SelectableChannel channel = selectionKey.channel();
            if(channel instanceof ServerSocketChannel)
                System.out.println("客户端" + clientChannel.socket().getPort() + "：" + fwdMsg);
            else if(selectionKey.isValid() && !channel.equals(clientChannel)){
                wBuffer.clear();
                //写入消息
                wBuffer.put(charset.encode("客户端" + clientChannel.socket().getPort() + "：" + fwdMsg));
                //转换为读模式
                wBuffer.flip();
                //有数据就一直读
                while(wBuffer.hasRemaining())
                    ((SocketChannel)channel).write(wBuffer);
            }
        }
    }

    /**
     * 从客户通道上读取消息
     * @param clientChannel 客户通道
     * @return 消息
     */
    private String receive(SocketChannel clientChannel) throws IOException {
        //将当前指针置于初始位置，覆盖已有的消息（清空消息）
        rBuffer.clear();
        //不停的向缓存中写
        while(clientChannel.read(rBuffer) > 0);
        //由写模式到读模式
        rBuffer.flip();
        return String.valueOf(charset.decode(rBuffer));
    }

    public static void main(String[] args) {
        ChatServer chatServer = new ChatServer();
        chatServer.start();
    }
}
```

### 4.2 客户端

```java
package client;

import java.io.Closeable;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.*;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Set;

public class ChatClient {

    private static final String DEFAULT_SERVER_HOST = "127.0.0.1";
    private static final int DEFAULT_SERVER_PORT = 8888;
    private static final String QUIT = "quit";

    private static final int BUFFER = 1024;
    private String host;
    private int port;
    private SocketChannel clientChannel;
    private Selector selector;
    private ByteBuffer rBuffer = ByteBuffer.allocate(BUFFER);
    private ByteBuffer wBuffer = ByteBuffer.allocate(BUFFER);
    private Charset charset = Charset.forName(String.valueOf(StandardCharsets.UTF_8));

    public ChatClient(String host, int port) {
        this.host = host;
        this.port = port;
    }

    public ChatClient() {
        this(DEFAULT_SERVER_HOST,DEFAULT_SERVER_PORT);
    }

    public boolean readyToQuit(String msg){
        return QUIT.equals(msg);
    }

    public void close(Closeable closeable){
        if(closeable != null){
            try {
                closeable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public void start(){
        try {
            //创建用户通道
            clientChannel = SocketChannel.open();
            clientChannel.configureBlocking(false);//这一步千万不能忘了
            //创建selector，并且将用户通道的connect请求注册上去
            selector = Selector.open();
            clientChannel.register(selector, SelectionKey.OP_CONNECT);
            //尝试与服务器创建连接
            clientChannel.connect(new InetSocketAddress(host,port));

            while (selector.isOpen()){
                //一直监听selector上注册的channel请求
                selector.select();

                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                for (SelectionKey selectionKey : selectionKeys) {
                    //响应请求
                    handles(selectionKey);
                }
                selectionKeys.clear();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }catch (ClosedSelectorException e){

        } finally {
            close(selector);
        }
    }

    private void handles(SelectionKey selectionKey) throws IOException {
        //处理connect事件
        if(selectionKey.isConnectable()){
            //如果能够与服务器响应了
            SocketChannel channel = (SocketChannel) selectionKey.channel();
            if(channel.isConnectionPending()){
                channel.finishConnect(); //正式建立连接
                new Thread(new UserInputHandler(this)).start();
            }
            channel.register(selector,SelectionKey.OP_READ);
        }else if(selectionKey.isReadable()){
            String msg = receive(clientChannel);
            SocketChannel channel = (SocketChannel) selectionKey.channel();
            if(msg.isEmpty()){
                //服务端异常
                close(selector);
            }else {
                //TODO 看看这里信息对不对
                System.out.println(msg);
            }

        }
    }

    private String receive(SocketChannel clientChannel) throws IOException {
        rBuffer.clear();
        //一直读数据
        while (clientChannel.read(rBuffer) > 0);
        rBuffer.flip();
        return String.valueOf(charset.decode(rBuffer));
    }

    public void send(String msg) throws IOException {
        if(msg.isEmpty())
            return;

        wBuffer.clear();
        wBuffer.put(charset.encode(msg));
        wBuffer.flip();
        while(wBuffer.hasRemaining()){
            clientChannel.write(wBuffer);
        }

        if(QUIT.equals(msg))
            close(selector);
    }

    public static void main(String[] args) {
        ChatClient chatClient = new ChatClient();
        chatClient.start();
    }
}

```

### 4.3 客户端监听用户输入进程

````java
package client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class UserInputHandler implements Runnable{

    private ChatClient chatClient;

    public UserInputHandler(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    @Override
    public void run() {
        //等待用户输入信息
        BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));

        while(true){
            try {
                String msg = consoleReader.readLine();
                chatClient.send(msg);
                if(chatClient.readyToQuit(msg)) break;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

````

