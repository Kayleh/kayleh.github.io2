---
title: BIO blocking model
mathjax: false
date: 2020-12-04T01:46:43+08:00
tags: [network]
slugs: BIO-blocking-model
---

# BIO阻塞模型

## 1. BIO阻塞模型

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200720183138508.png)
简述BIO模型中服务端与客户端的响应过程

1. 服务器`serverSocket`先要和`端口`进行`绑定`
2. 绑定完成后，执行`accept方法`，等待客户端的连接，这个方法是`阻塞式调用`，也就是说，要一直等待客户端的连接响应，不做其他事情，一直等，（被阻塞的还有InputStream.read()、OutputStream.write()，这两个也会一直等待客户端的响应）
3. 客户端创建`Socket`对象，`绑定`服务器的`ip地址`与`端口号`，与服务器进行连接
4. 服务器接收到客户端的连接请求，accept方法获取到`客户端的socket信息`，连接成功
5. 服务器与客户端创建各自的`io流`，实现`全双工通信`
6. 之后便可以随时`结束连接`

------

## 2. 简单实战演示

### 2.1 服务器

```java
import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;


public class Server {
    public static void main(String[] args) {
        final int DEFAULT_PORT = 8888;
        final String QUIT = "quit";
        ServerSocket serverSocket = null;

        try {
            //绑定端口号
            serverSocket = new ServerSocket(DEFAULT_PORT);
            System.out.println("服务器已经启动，绑定端口号：" + DEFAULT_PORT);

            while (true){
                //等待客户端的连接
                Socket socket = serverSocket.accept();
                System.out.println("客户端" + socket.getPort() + ":" + "已经连接");

                //获取io流
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(socket.getInputStream())
                );
                BufferedWriter writer = new BufferedWriter(
                        new OutputStreamWriter(socket.getOutputStream())
                );

                //读取客户发送的信息
                String msg = null;
                while ((msg = reader.readLine()) != null) {
                    System.out.println("客户端" + socket.getPort() + ":" + msg);
                    //回复消息
                    writer.write( msg + " ok" +"\n");
                    writer.flush();
                    System.out.println("服务器：" + msg + " ok");

                    if(msg.equals(QUIT)){
                        System.out.println("客户端" + socket.getPort() + ":断开连接" );
                        break;
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(serverSocket != null){
                try {
                    serverSocket.close();
                    System.out.println("服务器Socket关闭");
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}

```

### 2.2 客户端

```java


import java.io.*;
import java.net.Socket;
import java.net.UnknownHostException;

public class Client {
    public static void main(String[] args) {
        final int DEFAULT_SERVER_PORT = 8888;
        final String DEFAULT_ADDRESS = "127.0.0.1";
        final String QUIT = "quit";

        Socket socket = null;
        BufferedWriter writer = null;

        try {
            //创建Socket
            socket = new Socket(DEFAULT_ADDRESS,DEFAULT_SERVER_PORT);

            //创建io流
            writer = new BufferedWriter(
                    new OutputStreamWriter(socket.getOutputStream())
            );
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(socket.getInputStream())
            );

            //等待用户输入信息
            while (true) {
                BufferedReader consoleReader = new BufferedReader(new InputStreamReader(System.in));
                String msg = consoleReader.readLine();
                //向服务器发送消息
                writer.write(msg + "\n");
                writer.flush();
                System.out.println("客户端"+ ":" + msg);
                String line = reader.readLine();
                System.out.println("服务器：" + line);
                //退出判断
                if(msg.equals(QUIT)){
                    break;
                }
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            if(writer != null){
                try {
                    writer.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

    }
}

```

### 2.3 响应结果

- **客户端**
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200720183847235.png)
- **服务器**
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200720183859453.png)

## 3. 加深理解

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721182800674.png)

# 实战

## 1. 概念图解

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721171646426.png)

- BIO模型：客户端每有一个请求，服务端都要有一个线程来单独处理这个请求，典型的`一请求一应答`，java 1.4版本之前
- 对于聊天室服务器，它有多个线程，其中一个为图上的`Acceptor线程`（ChatServer），它实现的就是对来自客户端的请求不断响应，创建分配处理线程；对应客户端的每一个请求，都有一个单独的处理线程
- 对于客户端来说，它有两个线程，其中一个线程与服务器`建立连接，并接收来自服务器的消息`；另一个线程则用来`处理用户的输入，并将消息发送到服务器`

### 1.1 伪异步的优化

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721172110567.png)

- 使用线程池的原因是因为防止一大批用户的响应，造成服务器过载，实现线程的复用，减少不停的创建删除线程造成的资源郎芬，这样也实现了BIO的伪异步IO通信

[I/O模型系列之三：IO通信模型BIO NIO AIO](https://www.cnblogs.com/haimishasha/p/10625026.html#autoid-1-0-0)

------

## 2. 聊天服务器中的要点

### 2.1 字段

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721183219259.png)

### 2.2 转发消息方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721184044934.png)

### 2.3 添加客户方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/2020072118380045.png)

### 2.4 移除客户方法

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721183932390.png)

### 2.5 服务器主线程任务

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721184510239.png)

### 2.6 服务器处理线程任务

- 实现Runnable接口，之后执行的时候将其传入到线程池中执行。
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/2020072118470527.png)

------

## 3. 聊天室客户端要点

### 3.1 向服务端发送消息，让服务器转发给其他人

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721185036367.png)

### 3.2 接收服务端的消息

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721185104298.png)

### 3.3 主线程任务

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721185243618.png)

### 3.4 处理线程任务

- 实现Runnable接口，创建线程时启动
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/20200721185400861.png)

------

## 4. 测试结果

**服务器端信息**
![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/IO/BIO阻塞模型/2020072118562745.png)

------

## 5. 完整代码

### 5.1 服务器

```java
package Server;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChatServer {
    private int DEFAULT_PORT = 8888;
    private final String QUIT = "quit";

    private ServerSocket serverSocket;
    //存储已经连接的客户们
    private Map<Integer, Writer> connectedClients;
    private ExecutorService executorService;

    public ChatServer() {
        this.connectedClients = new HashMap<>();
        this.executorService = Executors.newFixedThreadPool(10);
    }

    //添加客户端
    public synchronized void addClient(Socket socket) throws IOException {
        if(socket != null){
            int key = socket.getPort();
            Writer value = new BufferedWriter(
                    new OutputStreamWriter(socket.getOutputStream())
            );
            connectedClients.put(key,value);
            System.out.println("客户" + key + "：已经连接");
        }
    }

    //移除客户端
    public synchronized void removeClient(Socket socket) throws IOException {
        if(socket != null){
            int port = socket.getPort();
            if(connectedClients.containsKey(port)){
                //移除用户的时候要进行关闭
                connectedClients.get(port).close();
                connectedClients.remove(port);
                System.out.println("客户端" + port + "：已经断开连接");
            }
        }
    }

    //将消息转发给其他用户
    public synchronized void forwardMessage(Socket socket,String fwdMsg) throws IOException {
        for(Integer port : connectedClients.keySet()){
            //不转发给自己
            if(!port.equals(socket.getPort())){
                Writer writer = connectedClients.get(port);
                writer.write(fwdMsg);
                writer.flush();
            }
        }
    }

    //检查是否退出
    public boolean readyToQuit(String msg){
        return QUIT.equals(msg);
    }

    public void close(){
        if(serverSocket != null){
            try {
                serverSocket.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    //启动
    public void start(){
        try {
            //绑定监听端口
            serverSocket = new ServerSocket(DEFAULT_PORT);
            System.out.println("聊天室服务器已经成功启动！");

            while (true){
                Socket socket = serverSocket.accept();

                //为每个socket创建一条单独的线程进行处理
                //new Thread(new ChatHandler(socket,this)).start();
                executorService.execute(new ChatHandler(socket,this));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            close();
        }
    }

    public static void main(String[] args) {
        ChatServer chatServer = new ChatServer();
        chatServer.start();
    }
}
```

```java
package Server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;

public class ChatHandler implements Runnable {

    private Socket socket;
    private ChatServer chatServer;

    public ChatHandler(Socket socket, ChatServer chatServer) {
        this.socket = socket;
        this.chatServer = chatServer;
    }

    @Override
    public void run() {
        try {
            //添加对象
            chatServer.addClient(socket);

            //读取用户发送的信息
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(socket.getInputStream())
            );
            String msg = null;
            //必须要读取到换行符
            while ((msg = reader.readLine()) != null){
                String fwdMsg ="客户端" + socket.getPort() + "：" + msg + "\n";
                chatServer.forwardMessage(socket,fwdMsg);
                System.out.print(fwdMsg);

                //检查是否退出
                if(chatServer.readyToQuit(msg)){
                    break;
                }
            }

        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try {
                chatServer.removeClient(socket);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

### 5.2 客户端

```java
package Client;

import Server.ChatServer;

import java.io.*;
import java.net.Socket;
import java.net.UnknownHostException;

public class ChatClient {
    private String DEFAULT_SERVER_HOST = "127.0.0.1";
    private int DEFAULT_PORT = 8888;
    private final String QUIT = "quit";

    private Socket socket;
    private BufferedReader reader;
    private BufferedWriter writer;

    //发送消息给服务器
    public void sendMsg(String msg) throws IOException {
        //输出流没有关闭的情况
        if(!socket.isOutputShutdown()){
            writer.write(msg + "\n");
            writer.flush();
        }
    }

    //接受消息从服务器
    public String receiveMsg() throws IOException {
        if(!socket.isInputShutdown()){
            return reader.readLine();
        }
        return null;
    }

    //检查是否退出
    public boolean readyToQuit(String msg){
        return QUIT.equals(msg);
    }

    //关闭
    public void close(){
        try {
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //启动开关
    public void start(){
        try {
            //创建socket
            socket = new Socket(DEFAULT_SERVER_HOST,DEFAULT_PORT);
            //创建io流
            writer = new BufferedWriter(
                    new OutputStreamWriter(socket.getOutputStream())
            );
            reader = new BufferedReader(
                    new InputStreamReader(socket.getInputStream())
            );

            //处理用户的输入的线程
            new Thread(new UserInputHandler(this)).start();

            //监听从服务器来的消息
            String msg = null;
            while ((msg = receiveMsg()) != null){
                System.out.println(msg);
            }
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            close();
        }
    }


    public static void main(String[] args) {
        ChatClient chatClient = new ChatClient();
        chatClient.start();
    }
}


```

```java
package Client;

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
        BufferedReader reader = new BufferedReader(
                new InputStreamReader(System.in)
        );

        while (true){
            try {
                String msg = reader.readLine();
                //向服务器发送消息
                chatClient.sendMsg(msg);
                if(chatClient.readyToQuit(msg))
                    break;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```

