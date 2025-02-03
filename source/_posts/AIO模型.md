---
title: AIO blocking model
mathjax: false
date: 2020-12-05T11:57:07+08:00
tags: [network]
slugs: AIO-blocking-model
---

# AIO模型

## 1. 在系统层面分析IO模型

当我们从网络中或者其他进程中接收到数据时，这个数据会`先`被拷贝到`系统内核的缓冲区`，然后从内核的缓冲区中再复制到我们`应用程序对应的缓冲区`中，这样我们才能实现从应用程序中取得这个数据。

### 1.1 BIO模型

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723190512937.png)

- 我们的应用程序会首先`调用特定的函数`，这样才能去访问我们的操作系统。拿我们的BIO聊天室来说，我们在服务器上，想看一下客户端从网络上传递过来的数据有没有准备好，那么它会去询问操作系统有没有收到新的数据，如果没有收到，它会`一直阻塞`在这里，直到收到消息，并且已经`从系统内核缓冲区中拷贝到应用程序的缓冲区`中，这样这个调用才能够成功返回。这就是阻塞式IO，我们在等待的过程中，什么都做不了。

### 1.2 NIO模型

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723191219755.png)

- 当我们的应用程序进行系统调用，询问数据有没有准备好，没有准备好的话，因为它是`非阻塞的`，所以`直接返回`；直到系统已经将内核缓冲区中的数据复制到应用程序的缓冲区中，这时我们再去询问数据有没有准备好的话，就能够获取到我们想要的数据了。但是它并不包括Selector监听模式，仅仅是NIO中的非阻塞式模型。

#### 1.2.1 IO多路复用

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/202007231924362.png)

- 这个模式对应的就是我们NIO聊天室中采用的模式，使用了Selector监听
- 首先我们的应用程序发起新的询问，是不是有可用的数据进行操作了，如果数据这时没有准备好，`并不会如上NIO直接返回`，而是说，我们要求内核`监听`我们这个IO通道，直到它有了数据可以供我们的程序进行操作了，再来通知我们，这个监听的过程，就像我们聊天室中的`select()方法`，它是`阻塞`的。直到数据已经在系统内核缓存区中准备好了，它会通知你一下，告诉你可以执行系统调用，将缓存区中的数据复制到应用程序缓存区中，这时我们才真正获取到了我们想要的数据
- 在这个时候，系统内核能够监听多个IO通道，跟我们的聊天室一样，它也监听了多个通道，只要其中任何一个IO通道有了新的状态更新，那么这个监听都会返回给我们应用程序说，其中的IO通道有一个或者多个出现了状态的变化，你要不要对其进行处理一下，我们便可以根据它返回的条件，进行特定的处理。（Selector可以翻译成为IO多路复用器）

### 1.3 AIO模型（异步IO）

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723194710403.png)

- BIO和NIO都是同步IO模型，这里我们说说AIO（异步）模型
- 同步IO模型是当我们访问的这个数据无论有没有准备好，都会返回给你结果；当数据没有准备好的时候，我们没有能够获取数据，`如果我们再也不发起获取数据的请求，那么我们永远都不会再获取到这个数据`。异步IO就不同了，当你请求这个数据没有请求到，而`之后这个数据准备好了，它就会回去通知你`，可以来取这个数据了
- 我们来看一下这个流程：我们去请求数据，数据没有准备好，我们没有被阻塞，而是`直接返回`了。在应用程序层面，虽然我们没有再发起新的请求，但是在系统后台，会监听这个我们请求数据的状态，当我们需要的数据已经准备好了，并且已经存在于系统内核缓存区中了，系统后台还会将这个数据拷贝到我们的应用程序缓存区中，到这里，系统内核会`递交给我们一个信号`，告诉你，你之前想要的这个数据，已经准备好给你了，你可以进行使用了。
- 它的`异步`体现在：我们程序只对数据发起了一次请求，没有请求到，就直接返回了，而之后，当这个数据已经准备好的时候，系统回来通知我们，而不需要我们再次发起请求，就能获取到这个数据，这就体现了异步的特点。A就是asynchronous，也就是异步的意思

------

## 2. 异步调用机制

### 2.1 AIO中的异步操作

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723205527982.png)

- 客户端对应AsynchronousSocketChannel
- 服务端对应AsynchronousServerSocketChannel
- 建立连接为connect/accept
- 读操作为read
- 写操作为write

### 2.2 通过Future进行异步调用

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723210814302.png)

- 注意其中Future的get()方法是阻塞式的

### 2.3 通过CompletionHandler（多用）

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723210919682.png)

- 在执行操作的时候，传入CompletionHandler参数

------

## 3. 实战（回音服务器）

### 3.1 服务器端

#### 3.1.1 字段

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723211230958.png)

#### 3.1.2 主方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723211619641.png)

#### 3.1.3 AcceptHandler的实现

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723211813626.png)

#### 3.1.4 ClientHandler的实现

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723213343220.png)

### 3.2 客户端

#### 3.2.1 字段

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/2020072321343625.png)

#### 3.2.2 主方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723213746283.png)

------

## 4. 代码

### 4.1 服务器端

```java
import java.io.Closeable;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.util.HashMap;
import java.util.Map;

public class Server {
    private static final String LOCALHOST = "localhost";
    private static final int DEFAULT_PORT = 8888;

    private AsynchronousServerSocketChannel serverChannel;

    private void close(Closeable closeable){
        try {
            closeable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void start(){
        try {
            //绑定端口号,调用的open方法（无参），这个参数类型为AsynchronousChannelGroup，其中包含共享的系统资源，如线程池，
            //因为我们没有传入参数，会从默认的ProviderHolder中，提供一个我们需要的AsynchronousServerSocketChannel对象
            //Handler会在不同的线程中进行处理，如我们的AcceptHandler和ClientHandler，它就是动用的共享资源：线程，来执行
            serverChannel = AsynchronousServerSocketChannel.open();
            serverChannel.bind(new InetSocketAddress(LOCALHOST,DEFAULT_PORT));
            System.out.println("服务器启动成功，监听端口号：" + DEFAULT_PORT);

            while (true){
                //该accept方法为异步调用，没有需要返回的结果也会返回，即没有收到客户连接的请求时
                //就会返回结果了；但是我们要保证在有客户连接的时候，主线程还在运行，否则主线程返回
                //服务器就直接宕机了，我们采用下面的小技巧来避免这种情况

                //accept在系统层面完成的时候（系统帮助我们完成了这个IO处理），返回的结果会被AcceptHandler来处理，
                //成功时执行的completed方法，失败执行的是failed方法
                //附带对象无；AcceptHandler为实现接口CompletionHandler的类，处理accept请求
                serverChannel.accept(null,new AcceptHandler());

                //用这个来避免while过于频繁，相当于将主线程阻塞，以保证建立连接时与客户端的响应
                System.in.read();
            }


        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            close(serverChannel);
        }
    }

    /**
     * 程序处理accept请求的时候，并不是在主线程中执行的，
     * 而是从AsynchronousChannelGroup中取出另一个线程来执行
     * CompletionHandler泛型为，第一个为返回的结果类型；第二个为附带的对象类型
      */
    private class AcceptHandler implements CompletionHandler<AsynchronousSocketChannel,Object> {
        /**
         * completed 该方法对应的是，我们之前上方调用accept方法，正常返回了，那么会执行该方法
         * @param result 方法执行成功的返回值
         * @param attachment 附带信息
         */
        @Override
        public void completed(AsynchronousSocketChannel result, Object attachment) {
            if(serverChannel.isOpen()){
                //确保服务器还在运行
                //服务器继续等待下一个客户端来请求，但是这里并不是产生过多的accept方法压栈
                //而造成的栈溢出问题，这在底层已经进行保护了
                serverChannel.accept(null,this);
            }

            //处理已连接客户端的读写操作
            AsynchronousSocketChannel clientChannel = result;
            if(clientChannel != null && clientChannel.isOpen()){
                ClientHandler handler = new ClientHandler(clientChannel);
                ByteBuffer buffer = ByteBuffer.allocate(1024);

                Map<String,Object> attachmentInfo = new HashMap<>();
                attachmentInfo.put("type","read");
                attachmentInfo.put("buffer",buffer);

                //依靠ClientHandler异步处理，读写操作，将其回传给客户端
                clientChannel.read(buffer,attachmentInfo,handler);
            }

        }

        @Override
        public void failed(Throwable exc, Object attachment) {
            //失败时的调用
        }
    }

    private class ClientHandler implements CompletionHandler<Integer,Map<String,Object>> {
        private AsynchronousSocketChannel clientChannel;

        public ClientHandler(AsynchronousSocketChannel clientChannel) {
            this.clientChannel = clientChannel;
        }

        @Override
        public void completed(Integer result, Map<String, Object> attachment) {
            String type = (String) attachment.get("type");
            ByteBuffer buffer = (ByteBuffer) attachment.get("buffer");
            if("read".equals(type)){
                //已经读取到了客户端传过来的消息，将其回音给客户端
                buffer.flip();//回音要读缓冲区
                attachment.put("type","write");
                clientChannel.write(buffer,attachment,this);
            }else if ("write".equals(type)){
                //将其回传给客户端后，等待客户端的新的信息
                //将这里将再次进行异步调用，读取客户端发来的信息存储在缓冲区中
                ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
                attachment.put("type","read");
                attachment.put("buffer",byteBuffer);
                clientChannel.read(byteBuffer,attachment,this);
            }
        }

        @Override
        public void failed(Throwable exc, Map<String, Object> attachment) {

        }
    }

    public static void main(String[] args) {
        Server server = new Server();
        server.start();
    }
}

```

### 4.2 客户端

```java
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousSocketChannel;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class Client {

    private final String LOCALHOST = "localhost";
    private final int DEFAULT_PORT = 8888;

    AsynchronousSocketChannel clientChannel;

    private void close(Closeable closeable){
        try {
            closeable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void start(){
        try {
            clientChannel = AsynchronousSocketChannel.open();

            Future<Void> connect = clientChannel.connect(new InetSocketAddress(LOCALHOST, DEFAULT_PORT));
            connect.get();//阻塞式调用，直到有结果才返回

            //读取用户的输入
            BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

            while (true){
                String input = in.readLine();
                byte[] inputBytes = input.getBytes();
                ByteBuffer buffer = ByteBuffer.wrap(inputBytes);

                //向服务器发送消息
                Future<Integer> write = clientChannel.write(buffer);
                write.get();

                //接收服务器传来的消息
                buffer.flip();
                Future<Integer> read = clientChannel.read(buffer);
                read.get();

                String s = new String(buffer.array());
                System.out.println(s);

                buffer.clear();
            }


        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }finally {
            close(clientChannel);
        }
    }

    public static void main(String[] args) {
        Client client = new Client();
        client.start();
    }
}

```

## 5. 测试结果

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200723214442368.png)

# 实战

## 1. AIO模型分析

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724200020715.png)

- AsynchronousServerSocket：它属于一个`AsynchronousChannelGroup`，这个通道组，其实是被多个异步通道共享的资源群组，这里边我们之前提到过，有一个非常重要的资源：`线程池`，系统会利用线程池中的线程，来处理一些handler请求。系统利用这个资源组还为我们做了很多的事情，包括它能在数据准备好的时候通知我们和利用handler做一些异步的操作。当我们在创建AsynchronousServerSocket时(open())，我们可以自定义一个通道组，当然我们不传参的时候，系统会默认给我们一个群组。

------

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724195923945.png)

- 当客户端请求与服务器建立连接时，系统会异步的调用AcceptHandler来处理连接请求，成功建立连接后，会返回一个AsynchronousSocketChannel对象，`每个对象`还会有一个`ClientHandler`来处理读写请求，在请求处理的过程中，并不是在主线程中完成的，而是通道组利用线程池资源，在不同的线程中完成异步处理。

------

## 2. 聊天室分析

### 2.1 服务器端

#### 2.1.1 字段

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/2020072420461170.png)

#### 2.1.2 主方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724204906660.png)

#### 2.1.3 AcceptHandler

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724205358130.png)

#### 2.1.4 ClientHandler（处理读写请求）

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724205908451.png)

#### 2.1.5 添加和删除用户

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/2020072421010985.png)

#### 2.1.6 接收和转发方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724210243585.png)

### 2.2 客户端

客户端中使用的Future来处理异步请求，非常简单

#### 2.2.1 主方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724210613293.png)

#### 2.2.2 发送消息

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724210719163.png)

#### 2.2.3 用户的输入线程

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724210827857.png)

------

## 3. 测试结果

- 服务器端显示
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200724210901364.png)

------

## 4. 完整代码

### 4.1 服务器端

```java
package server;

import java.io.Closeable;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.AsynchronousChannelGroup;
import java.nio.channels.AsynchronousServerSocketChannel;
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.channels.CompletionHandler;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChatServer {

    private static final String LOCALHOST = "localhost";
    private static final int DEFAULT_PORT = 8888;
    private static final String QUIT = "quit";
    private static final int BUFFER = 1024;

    private AsynchronousServerSocketChannel serverChannel;
    private AsynchronousChannelGroup asynchronousChannelGroup;
    private List<ClientHandler> connectedClients;
    private Charset charset = StandardCharsets.UTF_8;
    private int port;

    public ChatServer(int port) {
        this.port = port;
        connectedClients = new ArrayList<>();
    }

    public ChatServer() {
        this(DEFAULT_PORT);
    }

    public void start(){
        try {
            //自定义ChannelGroup
            ExecutorService executorService = Executors.newFixedThreadPool(10);
            asynchronousChannelGroup = AsynchronousChannelGroup.withThreadPool(executorService);

            serverChannel = AsynchronousServerSocketChannel.open(asynchronousChannelGroup);
            serverChannel.bind(new InetSocketAddress(LOCALHOST,port));
            System.out.println("服务器已经启动成功，随时等待客户端连接...");

            while (true){
                serverChannel.accept(null,new AcceptHandler());

                System.in.read();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            close(serverChannel);
        }
    }

    private class AcceptHandler implements CompletionHandler<AsynchronousSocketChannel,Object> {
        @Override
        public void completed(AsynchronousSocketChannel clientChannel, Object attachment) {
            if(serverChannel.isOpen())
                serverChannel.accept(null,this);

            if(clientChannel != null && clientChannel.isOpen()){
                ClientHandler clientHandler = new ClientHandler(clientChannel);

                ByteBuffer buffer = ByteBuffer.allocate(BUFFER);
                addClient(clientHandler);
                clientChannel.read(buffer,buffer,clientHandler);
            }

        }

        @Override
        public void failed(Throwable exc, Object attachment) {
            System.out.println("连接失败：" + exc.getMessage());
        }
    }

    private class ClientHandler implements CompletionHandler<Integer,ByteBuffer>{

        private AsynchronousSocketChannel clientChannel;

        public ClientHandler(AsynchronousSocketChannel clientChannel) {
            this.clientChannel = clientChannel;
        }

        public AsynchronousSocketChannel getClientChannel() {
            return clientChannel;
        }

        @Override
        public void completed(Integer result, ByteBuffer buffer) {
            if(buffer != null){
                //buffer不为空的时候，这要执行的是read之后的回调方法
                if(result <= 0){
                    //客户端异常，将客户端从连接列表中移除
                    removeClient(this);
                }else{
                    buffer.flip();
                    String fwdMsg = receive(buffer);
                    System.out.println(getClientName(clientChannel) + fwdMsg);
                    forwardMsg(clientChannel,fwdMsg);
                    buffer.clear();

                    if(readyToQuit(fwdMsg)){
                        removeClient(this);
                    }else {
                        clientChannel.read(buffer,buffer,this);
                    }
                }
            }
        }

        @Override
        public void failed(Throwable exc, ByteBuffer attachment) {
            System.out.println("读写操作失败：" + exc.getMessage());
        }
    }

    private synchronized void addClient(ClientHandler clientHandler) {
        connectedClients.add(clientHandler);
        System.out.println(getClientName(clientHandler.getClientChannel()) + "已经连接");
    }

    private synchronized void removeClient(ClientHandler clientHandler) {
        AsynchronousSocketChannel clientChannel = clientHandler.getClientChannel();
        connectedClients.remove(clientHandler);
        System.out.println(getClientName(clientChannel) + "已经断开连接");
        close(clientChannel);
    }

    private void close(Closeable closeable){
        try {
            closeable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private boolean readyToQuit(String msg){
        return QUIT.equals(msg);
    }

    private synchronized String receive(ByteBuffer buffer) {
        return String.valueOf(charset.decode(buffer));
    }

    private synchronized void forwardMsg(AsynchronousSocketChannel clientChannel,String fwdMsg) {
        for (ClientHandler connectedHandler : connectedClients) {
            AsynchronousSocketChannel client = connectedHandler.getClientChannel();
            if(!client.equals(clientChannel)){
                //注意这个try，catch是自己加的
                try {
                    //将消息存入缓存区中
                    ByteBuffer buffer = charset.encode(getClientName(client) + fwdMsg);
                    //写给每个客户端
                    client.write(buffer,null,connectedHandler);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }

    }

    private String getClientName(AsynchronousSocketChannel clientChannel) {
        int port = -1;
        try {
            InetSocketAddress remoteAddress = (InetSocketAddress) clientChannel.getRemoteAddress();
            port = remoteAddress.getPort();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return "客户端[" + port + "]:";
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
import java.nio.channels.AsynchronousSocketChannel;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

public class ChatClient {

    private static final String LOCALHOST = "localhost";
    private static final int DEFAULT_PORT = 8888;
    private final String QUIT = "quit";
    private final int BUFFER = 1024;

    private String host;
    private int port;
    private AsynchronousSocketChannel clientChannel;
    private Charset charset = StandardCharsets.UTF_8;

    public ChatClient() {
        this(LOCALHOST,DEFAULT_PORT);
    }

    public ChatClient(String host,int port){
        this.host = host;
        this.port = port;
    }

    public void start(){
        try {
            clientChannel = AsynchronousSocketChannel.open();
            Future<Void> connect = clientChannel.connect(new InetSocketAddress(host, port));
            connect.get();
            System.out.println("与服务已成功建立连接");
            new Thread(new UserInputHandler(this)).start();

            ByteBuffer buffer = ByteBuffer.allocate(BUFFER);
            while (clientChannel.isOpen()){
                Future<Integer> read = clientChannel.read(buffer);
                int result = read.get();
                if(result <= 0){
                    //这里是，当我们输入quit时，在服务器端会自动将我们移除
                    //所以这里关闭就好了
                    close(clientChannel);
                }else {
                    buffer.flip();
                    String msg = String.valueOf(charset.decode(buffer));
                    System.out.println(msg);
                    buffer.clear();
                }
            }
        } catch (IOException | InterruptedException | ExecutionException e) {
            e.printStackTrace();
        }finally {
            close(clientChannel);
        }
    }

    public void sendMsg(String msg){
        if(msg.isEmpty()){
            return;
        }else {
            ByteBuffer buffer = charset.encode(msg);
            Future<Integer> write = clientChannel.write(buffer);
            try {
                write.get();
            } catch (InterruptedException | ExecutionException e) {
                e.printStackTrace();
            }
        }
    }

    private void close(Closeable closeable){
        try {
            closeable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public boolean readyToQuit(String msg){
        return QUIT.equals(msg);
    }

    public static void main(String[] args) {
        ChatClient chatClient = new ChatClient();
        chatClient.start();
    }
}

```

```java
package client;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class UserInputHandler implements Runnable{
    private ChatClient client;

    public UserInputHandler(ChatClient client) {
        this.client = client;
    }

    @Override
    public void run() {
        BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));

        while (true){
            try {
                String msg = consoleReader.readLine();
                client.sendMsg(msg);

                if(client.readyToQuit(msg)){
                    System.out.println("成功退出聊天室");
                    break;
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}

```

# 总结

## 1. 三种模型的适用场景

1. BIO：适用于连接数目少，而且服务器资源对于我们已知的连接来说，比较充足，开发简单
2. NIO：相对BIO来说，开发难度较高，但是客户连接数目比较高。值得我们注意的是，由于NIO是单一的线程轮询来处理数据，需要避免每个任务执行的时间过长，防止其他线程出现过长的等待
3. AIO：接受的连接数目多，相对于NIO来说，是异步出来，可以接受某个任务花费过长的时间，但是开发难度比较高，维护起来也不简单。

- 附：可以使用JDK文件夹下面的VisualVM来监控程序的使用情况
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/AIO%E6%A8%A1%E5%9E%8B/20200725151809156.png)

------





