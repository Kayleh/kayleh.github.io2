---
title: MVC
tags: [Interview]
translate_title: mvc
date: 2020-07-14T13:43:03+08:00
---

# MVC

<!--more-->

### 请谈一下Spring MVC的工作原理是怎样的？ 

①客户端的所有请求都交给前端控制器DispatcherServlet来处理，它会负责调用系统的其他模块来真正处理用户的请求。
② DispatcherServlet收到请求后，将根据请求的信息（包括URL、HTTP协议方法、请求头、请求参数、Cookie等）以及HandlerMapping的配置找到处理该请求的Handler（任何一个对象都可以作为请求的Handler）。
③在这个地方Spring会通过HandlerAdapter对该处理器进行封装。
④ HandlerAdapter是一个适配器，它用统一的接口对各种Handler中的方法进行调用。
⑤ Handler完成对用户请求的处理后，会返回一个ModelAndView对象给DispatcherServlet，ModelAndView顾名思义，包含了数据模型以及相应的视图的信息。
⑥ ModelAndView的视图是逻辑视图，DispatcherServlet还要借助ViewResolver完成从逻辑视图到真实视图对象的解析工作。
⑦ 当得到真正的视图对象后，DispatcherServlet会利用视图对象对模型数据进行渲染。
⑧ 客户端得到响应，可能是一个普通的HTML页面，也可以是XML或JSON字符串，还可以是一张图片或者一个PDF文件。 

### 简述一下SpringMVC的运行机制？以及运行机制的流程是什么？

1、用户发送请求时会先从DispathcherServler的doService方法开始，在该方法中会将ApplicationContext、localeResolver、themeResolver等对象添加到request中，紧接着就是调用doDispatch方法。

2、进入该方法后首先会检查该请求是否是文件上传的请求(校验的规则是是否是post并且contenttType是否为multipart/为前缀)即调用的是checkMultipart方法；如果是的将request包装成MultipartHttpServletRequest。

3、然后调用getHandler方法来匹配每个HandlerMapping对象，如果匹配成功会返回这个Handle的处理链HandlerExecutionChain对象，在获取该对象的内部其实也获取我们自定定义的拦截器，并执行了其中的方法。

4、执行拦截器的preHandle方法，如果返回false执行afterCompletion方法并理解返回

5、通过上述获取到了HandlerExecutionChain对象，通过该对象的getHandler()方法获得一个object通过HandlerAdapter进行封装得到HandlerAdapter对象。

6、该对象调用handle方法来执行Controller中的方法，该对象如果返回一个ModelAndView给DispatcherServlet。

7、DispatcherServlet借助ViewResolver完成逻辑试图名到真实视图对象的解析，得到View后DispatcherServlet使用这个View对ModelAndView中的模型数据进行视图渲染。

### 说明一下springmvc和spring-boot区别是什么？

总的来说，Spring 就像一个大家族，有众多衍生产品例如 Boot，Security，JPA等等。但他们的基础都是Spring 的 IOC 和 AOP，IOC提供了依赖注入的容器，而AOP解决了面向切面的编程，然后在此两者的基础上实现了其他衍生产品的高级功能；因为 Spring 的配置非常复杂，各种xml，properties处理起来比较繁琐。于是为了简化开发者的使用，Spring社区创造性地推出了Spring Boot，它遵循约定优于配置，极大降低了Spring使用门槛，但又不失Spring原本灵活强大的功能。 

### 说明一下Spring MVC注解的优点是什么？

1、XML配置起来有时候冗长，此时注解可能是更好的选择，如jpa的实体映射；注解在处理一些不变的元数据时有时候比XML方便的多，比如springmvc的数据绑定，如果用xml写的代码会多的多；

2、注解最大的好处就是简化了XML配置；其实大部分注解一定确定后很少会改变，所以在一些中小项目中使用注解反而提供了开发效率，所以没必要一头走到黑；

3、注解相对于XML的另一个好处是类型安全的，XML只能在运行期才能发现问题。

### 请简单介绍一下你了解的Java领域中的Web Service框架都有哪些？

Java领域的Web Service框架很多，包括Axis2（Axis的升级版本）、Jersey（RESTful的Web Service框架）、CXF（XFire的延续版本）、Hessian、Turmeric、JBoss SOA等，其中绝大多数都是开源框架。 

### 简述一下Mybatis和Hibernate的区别是什么？

1、简介

Hibernate：Hibernate是当前最流行的ORM框架之一，对JDBC提供了较为完整的封装。Hibernate的O/R Mapping实现了POJO 和数据库表之间的映射，以及SQL的自动生成和执行。

Mybatis：Mybatis同样也是非常流行的ORM框架，主要着力点在于 POJO 与 SQL 之间的映射关系。然后通过映射配置文件，将SQL所需的参数，以及返回的结果字段映射到指定 POJO 。相对Hibernate“O/R”而言，Mybatis 是一种“Sql Mapping”的ORM实现。

2、缓存机制对比

相同点

Hibernate和Mybatis的二级缓存除了采用系统默认的缓存机制外，都可以通过实现你自己的缓存或为其他第三方缓存方案，创建适配器来完全覆盖缓存行为。

不同点

Hibernate的二级缓存配置在SessionFactory生成的配置文件中进行详细配置，然后再在具体的表-对象映射中配置是那种缓存。

MyBatis的二级缓存配置都是在每个具体的表-对象映射中进行详细配置，这样针对不同的表可以自定义不同的缓存机制。并且Mybatis可以在命名空间中共享相同的缓存配置和实例，通过Cache-ref来实现。

两者比较

因为Hibernate对查询对象有着良好的管理机制，用户无需关心SQL。所以在使用二级缓存时如果出现脏数据，系统会报出错误并提示。而MyBatis在这一方面，使用二级缓存时需要特别小心。如果不能完全确定数据更新操作的波及范围，避免Cache的盲目使用。否则，脏数据的出现会给系统的正常运行带来很大的隐患。

Mybatis：小巧、方便、高效、简单、直接、半自动化

Hibernate：强大、方便、高效、复杂、间接、全自动化

### 请问EJB需要直接实现它的业务接口或者Home接口吗？请简述一下理由。

 在EJB中则至少要包括10个class:
Bean类，特定App Server的Bean实现类Bean的remote接口，特定App Server的remote接口实现类，特定App Server的remote接口的实现类的stub类和skeleton类。
Bean的home接口，特定App Server的home接口实现类，特定App Server的home接口的实现类的stub类和skeleton类。
和RMI不同的是，EJB中这10个class真正需要用户写的只有3个，Bean类，remote接口，home接口，其它的7个究竟怎么生成，被打包在哪里，是否需要更多的类文件，否根据不同的App Server表现出较大的差异。
Weblogic：
home接口和remote接口的weblogic的实现类的stub类和skeleton类是在EJB被部署到weblogic的时候，由weblogic动态生成stub类和skeleton类的字节码，所以看不到这4个类文件。
对于一次客户端远程调用EJB，要经过两个远程对象的多次RMI循环。首先是通过JNDI查找Home接口，获得Home接口的实现类，这个过程其实相当复杂，首先是找到Home接口的Weblogic实现类，然后创建一个Home接口的Weblogic实现类的stub类的对象实例，将它序列化传送给客户端（注意stub类的实例是在第1次RMI循环中，由服务器动态发送给客户端的，因此不需要客户端保存Home接口的Weblogic实现类的stub 类），最后客户端获得该stub类的对象实例（普通的RMI需要在客户端保存stub类，而EJB不需要，因为服务器会把stub类的对象实例发送给客户端）。
客户端拿到服务器给它的Home接口的Weblogic实现类的stub类对象实例以后，调用stub类的create方法， (在代码上就是home.create()，但是后台要做很多事情),于是经过第2次RMI循环，在服务器端，Home接口的Weblogic实现类的 skeleton类收到stub类的调用信息后，由它再去调用Home接口的Weblogic实现类的create方法。
在服务端， Home接口的Weblogic实现类的create方法再去调用Bean类的Weblogic实现类的ejbCreate方法，在服务端创建或者分配一个EJB实例，然后将这个EJB实例的远程接口的Weblogic实现类的stub类对象实例序列化发送给客户端。 

### 说明一下EJB的几种类型分别是什么？

会话（Session）Bean ，实体（Entity）Bean 消息驱动的（Message Driven）Bean，会话Bean又可分为有状态（Stateful）和无状态（Stateless）两种，
实体Bean可分为Bean管理的持续性（BMP）和容器管理的持续性（CMP）两种。 

### 简述一下EJB的激活机制是什么？

以Stateful Session Bean 为例：其Cache大小决定了内存中可以同时存在的Bean实例的数量，根据MRU或NRU算法，实例在激活和去激活状态之间迁移，激活机制是当客户端调用某个EJB实例业务方法时，如果对应EJB Object发现自己没有绑定对应的Bean实例则从其去激活Bean存储中（通过序列化机制存储实例）回复（激活）此实例。状态变迁前会调用对应的 ejbActive和ejbPassivate方法。 

### 说一下EJB规范中EJB禁止的操作有哪些？

1.不能操作线程和线程API(线程API指非线程对象的方法如notify,wait等)，

2.不能操作awt，

3.不能实现服务器功能，

4.不能对静态属生存取，

5.不能使用IO操作直接存取文件系统，

6.不能加载本地库.，

7.不能将this作为变量和返回，

8.不能循环调用。

### 请简述一下EJB的角色以及对应的三个对象分别是什么？

 一个完整的基于EJB的分布式计算结构由六个角色组成，这六个角色可以由不同的开发商提供，每个角色所作的工作必须遵循Sun公司提供的EJB规范，以保证彼此之间的兼容性。这六个角色分别是EJB组件开发者（Enterprise Bean Provider） 、应用组合者（Application Assembler）、部署者（Deployer）、EJB 服务器提供者（EJB Server Provider）、EJB 容器提供者（EJB Container Provider）、系统管理员（System Administrator）
三个对象是Remote（Local）接口、Home（LocalHome）接口，Bean类 

### EJB包括SessionBean和EntityBean，请说出他们的生命周期以及EJB是如何管理事务的？

SessionBean： Stateless Session Bean 的生命周期是由容器决定的，当客户机发出请求要建立一个Bean的实例时，EJB容器不一定要创建一个新的Bean的实例供客户机调用，而是随便找一个现有的实例提供给客户机。当客户机第一次调用一个Stateful Session Bean 时，容器必须立即在服务器中创建一个新的Bean实例，并关联到客户机上，以后此客户机调用Stateful Session Bean 的方法时容器会把调用分派到与此客户机相关联的Bean实例。
EntityBean：Entity Beans能存活相对较长的时间，并且状态是持续的。只要数据库中的数据存在，Entity beans就一直存活。而不是按照应用程序或者服务进程来说的。即使EJB容器崩溃了，Entity beans也是存活的。Entity Beans生命周期能够被容器或者Beans自己管理。
EJB通过以下技术管理实务：对象管理组织（OMG）的对象实务服务（OTS），Sun Microsystems的Transaction Service（JTS）、Java Transaction API（JTA），开发组（X/Open）的XA接口。 

### EJB与JAVA BEAN的区别是什么？

 Java Bean 是可复用的组件，对Java Bean并没有严格的规范，理论上讲，任何一个Java类都可以是一个Bean。但通常情况下，由于Java Bean是被容器所创建（如Tomcat）的，所以Java Bean应具有一个无参的构造器，另外，通常Java Bean还要实现Serializable接口用于实现Bean的持久性。Java Bean实际上相当于微软COM模型中的本地进程内COM组件，它是不能被跨进程访问的。EnterpriseJava Bean 相当于DCOM，即分布式组件。它是基于Java的远程方法调用（RMI）技术的，所以EJB可以被远程访问（跨进程、跨计算机）。但EJB必须被布署在诸如Webspere、WebLogic这样的容器中，EJB客户从不直接访问真正的EJB组件，而是通过其容器访问。EJB容器是EJB组件的代理， EJB组件由容器所创建和管理。客户通过容器来访问真正的EJB组件。 

### 请问EJB是基于哪些技术实现的？并说明一下SessionBean和EntityBean的区别以及StatefulBean和StatelessBean的区别。

EJB包括Session Bean、Entity Bean、Message Driven Bean，基于JNDI、RMI、JAT等技术实现。
SessionBean在J2EE应用程序中被用来完成一些服务器端的业务操作，例如访问数据库、调用其他EJB组件。EntityBean被用来代表应用系统中用到的数据。
对于客户机，SessionBean是一种非持久性对象，它实现某些在服务器上运行的业务逻辑。
对于客户机，EntityBean是一种持久性对象，它代表一个存储在持久性存储器中的实体的对象视图，或是一个由现有企业应用程序实现的实体。
Session Bean 还可以再细分为 Stateful Session Bean 与 Stateless Session Bean ，这两种的 Session Bean都可以将系统逻辑放在 method之中执行，不同的是 Stateful Session Bean 可以记录呼叫者的状态，因此通常来说，一个使用者会有一个相对应的Stateful Session Bean 的实体。Stateless Session Bean 虽然也是逻辑组件，但是他却不负责记录使用者状态，也就是说当使用者呼叫 Stateless Session Bean 的时候，EJB Container 并不会找寻特定的 Stateless Session Bean 的实体来执行这个 method。换言之，很可能数个使用者在执行某个 Stateless Session Bean 的 methods 时，会是同一个 Bean 的 Instance 在执行。从内存方面来看， Stateful Session Bean 与 Stateless Session Bean 比较， Stateful Session Bean 会消耗 J2EE Server 较多的内存，然而 Stateful Session Bean 的优势却在于他可以维持使用者的状态。
