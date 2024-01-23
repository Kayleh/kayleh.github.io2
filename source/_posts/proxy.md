---
title: "Proxy"
date: 2021-04-25T21:37:43+08:00
draft: false
tags: [java]
slug: Proxy
---

代理模式是一种经典的设计模式，代理的意义在于生成代理对象，在服务提供方和使用方之间充当一个媒介，控制真实对象的访问。

代理分为静态代理和动态代理两种。

静态代理需要通过手动或工具生成代理类并编译，代理类和委托类的关系在编译期就已经确定。动态代理允许开发人员在运行时动态的创建出代理类及其对象。

Spring AOP 的主要技术基础就是 Java 的动态代理机制。

### 静态代理

静态代理的实现需要一个接口(表示要完成的功能)，一个真实对象和一个代理对象(两者都需实现这个接口)。

示例如下：

```java
interface Shopping {
    void buy();
}

class Client implements Shopping {
    public void buy() {
        System.out.println("我想买这件商品");
    }
}

class StaticProxy implements Shopping {
    private Shopping shopping;

    public StaticProxy(Shopping shopping) {
        this.shopping = shopping;
    }

    public void buy() {
        System.out.println("降价促销，疯狂大甩卖了！");
        shopping.buy();
    }
}

public class StaticProxyTest {
    public static void main(String[] args) {
        Client client = new Client();
        StaticProxy service = new StaticProxy(client);
        service.buy();
    }
}
-----------------------------------------
输出结果：
降价促销，疯狂大甩卖了！
我想买这件商品
```
### 动态代理

动态代理可以让我们在运行时动态生成代理类，解耦程度更高。Java 动态代理的实现主要借助于 java.lang.reflect 包中的 Proxy 类与 InvocationHandler 接口，所有对动态代理对象的方法调用都会转发到 InvocationHandler 中的 invoke() 方法中实现。一般我们称实现了 InvocationHandler 接口的类为调用处理器。

我们可以通过 Proxy 的静态工厂方法 newProxyInstance 创建动态代理类实例。

方法如下：

```java
public static Object newProxyInstance(ClassLoader loader,
                                          Class<?>[] interfaces,
                                          InvocationHandler h) 
```

> loader：类加载器
> interfaces：类实现的全部接口
> h：调用处理器

示例如下：

    public class DynamicProxy implements InvocationHandler {
    
        private Object target = null;
    
        DynamicProxy(Object target) {
            this.target = target;
        }
    
        /**
         * 代理方法逻辑
         *
         * @param proxy  代理对象
         * @param method 调度方法
         * @param args   调度方法参数
         */
        @Override
        public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
            System.out.println("代理前");
            method.invoke(target, args);
            System.out.println("代理后");
            return null;
        }
    }

```java
public class DyProxyTest {
    public static void main(String[] args) {
        Shopping client = new Client();
        DynamicProxy dyProxy = new DynamicProxy(client);
        Shopping shop = (Shopping) Proxy.newProxyInstance(Shopping.class.getClassLoader(), new Class[]{Shopping.class}, dyProxy);
        shop.buy();
    }
}

输出结果：
代理前
我想买这件商品
代理后
```


当然我们也可以将 Proxy.newProxyInstance 方法放到调用处理器中，使客户端编程更为简单。

示例如下：

```java
public class DynamicProxy implements InvocationHandler {
    private Object target = null;

    DynamicProxy() {
    }

    DynamicProxy(Object target) {
        this.target = target;
    }

    public Object bind(Object target) {
        this.target = target;
        return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    /**
     * 代理方法逻辑
     *
     * @param proxy  代理对象
     * @param method 调度方法
     * @param args   调度方法参数
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("代理前");
        method.invoke(target, args);
        System.out.println("代理后");
        return null;
    }
}

```
```java
public class DyProxyTest {
    public static void main(String[] args) {
        Shopping client = new Client();
        DynamicProxy dyProxy = new DynamicProxy();
        Shopping shop = (Shopping) dyProxy.bind(client);
        shop.buy();
    }
}

```



### 拦截器

拦截器主要就是靠动态代理实现，它可以简化动态代理的使用，我们只需要知道拦截器接口的使用方法即可，无须知道动态代理的实现细节。

示例如下：

    public interface Interceptor {
        public boolean before(Object proxy, Object target, Method method, Object[] args);
        public void around(Object proxy, Object target, Method method, Object[] args);
        public void after(Object proxy, Object target, Method method, Object[] args);
    }


    public class MyInterceptor implements Interceptor {
    
        @Override
        public boolean before(Object proxy, Object target, Method method, Object[] args) {
            System.out.println("before");
            return false;
        }
    
        @Override
        public void around(Object proxy, Object target, Method method, Object[] args) {
            System.out.println("around");
        }
    
        @Override
        public void after(Object proxy, Object target, Method method, Object[] args) {
            System.out.println("after");
        }
    }

```java
public class InterceptorProxy implements InvocationHandler {
    private Object target = null;
    Interceptor interceptor = null;
    
    InterceptorProxy(Interceptor interceptor) {
        this.interceptor = interceptor;
    }

    public Object bind(Object target) {
        this.target = target;
        return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), this);
    }

    /**
     * 代理方法逻辑
     *
     * @param proxy  代理对象
     * @param method 调度方法
     * @param args   调度方法参数
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        if (interceptor == null) {
            method.invoke(target, args);
        }
        Object result = null;
        if (interceptor.before(proxy, target, method, args)) {
            result = method.invoke(target, args);
        } else {
            interceptor.around(proxy, target, method, args);
        }
        interceptor.after(proxy, target, method, args);
        return result;
    }
}

```

> 输出结果：
>
> before
> around
> after



开发者只需要知道拦截器的作用，设置拦截器，因而相对简单一些。

拦截器在 Spring AOP 与 Spring MVC 中都有应用。在 Spring AOP 中，

- 针对接口做代理默认使用的是 JDK 自带的 Proxy+InvocationHandler
- 针对类做代理使用的是 Cglib

在 Spring MVC中， 主要通过 HandlerInterceptor 接口实现拦截器的功能。

HandlerInterceptor 接口中包含3个方法：

- preHandle：执行 controller 处理之前执行，返回值为true时接着执行 postHandle 和 afterCompletion，返回false则中断执行
- postHandle：在执行 controller 后，ModelAndView 处理前执行
- afterCompletion ：在执行完 ModelAndView 之后执行
  此外，Spring MVC 提供了抽象类 HandlerInterceptorAdapter，实现了 HandlerInterceptor 接口。

### cglib

因为 Java 自带的动态代理工具必须要有一个接口，cglib 不需要接口，只需要一个非抽象类就能实现动态代理。

示例如下：

```java
class ClientProxy implements MethodInterceptor {

    @Override
    public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        System.out.println("before");
        Object obj = methodProxy.invokeSuper(proxy, args);
        System.out.println("after");
        return obj;
    }

}
public class CglibTest {
    public static void main(String[] args) {
        ClientProxy clientProxy = new ClientProxy();
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(Client.class);
        enhancer.setCallback(clientProxy);
        Client client = (Client) enhancer.create();
        client.buy();
    }
}

```

> 输出结果：
>
> before
> 我想买这件商品
> after

————————————————
版权声明：本文为CSDN博主「情谊风月」的原创文章，遵循CC 4.0 BY-SA版权协议，转载请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/weixin_43320847/article/details/82938754