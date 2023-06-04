---
title: Head first Spring
mathjax: false
date: 2021-08-01 23:18:53
tags: famework
translate_title: Head-first-Spring
---

# Spring

## BeanDefinition 

BeanDefinition表示Bean定义，Spring根据BeanDefinition来创建Bean对象，
BeanDefinition有很多的属性来描述Bean，BeanDefinition是Spring中非常核心
的概念。

BeanDefinition中重要的属性

>- beanClass 
>
>表示一个Bean的类型，比如UserService.class,Spring在创建Bean的过程中会根据此属性来实例化得到对象。
>
>- scope
>
>表示一个bean的作用域，
>
>scope等于singleton，该bean就是一个单例bean
>
>scope等于prototype，该bean就是一个原型bean
>
>- isLazy
>
>表示一个bean是不是需要懒加载，原型bean的isLazy属性不起作用，懒加载的单例的Bean，会在第一次getBean的时候生成该bean，非懒加载的单例bean，则会在Spring启动过程中直接生成好。
>
>- dependsOn
>
>表示一个bean在创建之前所依赖的，它所依赖的这些bean得先全部创建好。
>
>- primary
>
>表示一个bean是主bean，在Spring中一个类型可以有多个bean对象，在进行依赖注入时，如果根据类型找到了多个bean，此时会判断这些bean中是否存在一个主bean，如果存在，则直接将这个bean注入给属性
>
>- initMethodName
>
>表示一个bean的初始化方法，一个bean的生命周期过程中有一个步骤叫初始化。Spring会在这个步骤中去调用bean的初始化方法，初始化逻辑由程序员自己控制，表示程序员可以自定义逻辑对bean进行加工。

## BeanFactory

它可以用来创建bean、获取bean

```java
 BeanDefinition -----------> BeanFactory -----------> Bean

```

BeanFactory将利用BeanDefinition来生成Bean对象，BeanDefinition就相当于BeanFactory的原材料，Bean对象就相当于BeanFactory所生产的出来的产品。

**定义方法：**

- getBean(String name): Spring容器中获取对应Bean对象的方法，如存在，则返回该对象
- containsBean(String name)：Spring容器中是否存在该对象
- isSingleton(String name)：通过beanName是否为单例对象
- isPrototype(String name)：判断bean对象是否为多例对象
- isTypeMatch(String name, ResolvableType typeToMatch):判断name值获取出来的bean与typeToMath是否匹配
- getType(String name)：获取Bean的Class类型
- getAliases(String name):获取name所对应的所有的别名

**主要的实现类(包括抽象类)：**

- AbstractBeanFactory：抽象Bean工厂，绝大部分的实现类，都是继承于他
- **DefaultListableBeanFactory**:Spring默认的工厂类
- XmlBeanFactory：前期使用XML配置用的比较多的时候用的Bean工厂
- AbstractXmlApplicationContext:抽象应用容器上下文对象
- ClassPathXmlApplicationContext:XML解析上下文对象，用户创建Bean对象我们早期写Spring的时候用的就是他

#### FactoryBean

该类是SpringIOC容器是创建Bean的一种形式，这种方式创建Bean会有加成方式，融合了简单的工厂设计模式于装饰器模式。

FactoryBean是一个工厂Bean，可以生成某一个类型Bean实例，它最大的一个作用是：可以让我们自定义Bean的创建过程。

而BeanFactory是Spring容器中的一个基本类也是很重要的一个类，在BeanFactory中可以创建和管理Spring容器中的Bean，它对于Bean的创建有一个统一的流程。

> 有些人就要问了，我直接使用Spring默认方式创建Bean不香么，为啥还要用FactoryBean做啥，
>
> 在某些情况下，对于实例Bean对象比较复杂的情况下，使用传统方式创建bean会比较复杂，例如（使用xml配置），这样就出现了FactoryBean接口，可以让用户通过实现该接口来自定义该Bean接口的实例化过程。即包装一层，将复杂的初始化过程包装，让调用者无需关系具体实现细节。

**方法：**

- T getObject()：返回实例
- Class<?> getObjectType();:返回该装饰对象的Bean的类型
- default boolean isSingleton():Bean是否为单例

**常用类：**

- ProxyFactoryBean :Aop代理Bean
- GsonFactoryBean:Gson



## Bean的生命周期

![深究Spring中Bean的生命周期](https://www.javazhiyin.com/wp-content/uploads/2019/05/java10-1558500659.jpg)

**Bean 完整的生命周期**

文字解释如下：

————————————初始化————————————

- BeanNameAware.setBeanName() 在创建此bean的bean工厂中设置bean的名称，在普通属性设置之后调用，在InitializinngBean.afterPropertiesSet()方法之前调用
- `BeanClassLoaderAware.setBeanClassLoader()`: 在普通属性设置之后，InitializingBean.afterPropertiesSet()之前调用
- BeanFactoryAware.setBeanFactory() : 回调提供了自己的bean实例工厂，在普通属性设置之后，在InitializingBean.afterPropertiesSet()或者自定义初始化方法之前调用
- `EnvironmentAware.setEnvironment()`: 设置environment在组件使用时调用
- `EmbeddedValueResolverAware.setEmbeddedValueResolver()`: 设置StringValueResolver 用来解决嵌入式的值域问题
- `ResourceLoaderAware.setResourceLoader()`: 在普通bean对象之后调用，在afterPropertiesSet 或者自定义的init-method 之前调用，在 ApplicationContextAware 之前调用。
- `ApplicationEventPublisherAware.setApplicationEventPublisher()`: 在普通bean属性之后调用，在初始化调用afterPropertiesSet 或者自定义初始化方法之前调用。在 ApplicationContextAware 之前调用。
- `MessageSourceAware.setMessageSource()`: 在普通bean属性之后调用，在初始化调用afterPropertiesSet 或者自定义初始化方法之前调用，在 ApplicationContextAware 之前调用。
- ApplicationContextAware.setApplicationContext(): 在普通Bean对象生成之后调用，在InitializingBean.afterPropertiesSet之前调用或者用户自定义初始化方法之前。在ResourceLoaderAware.setResourceLoader，ApplicationEventPublisherAware.setApplicationEventPublisher，MessageSourceAware之后调用。
- `ServletContextAware.setServletContext()`: 运行时设置ServletContext，在普通bean初始化后调用，在InitializingBean.afterPropertiesSet之前调用，在 ApplicationContextAware 之后调用**注：是在WebApplicationContext 运行时**
- BeanPostProcessor.postProcessBeforeInitialization() : 将此BeanPostProcessor 应用于给定的新bean实例 在任何bean初始化回调方法(像是InitializingBean.afterPropertiesSet或者自定义的初始化方法）之前调用。这个bean将要准备填充属性的值。返回的bean示例可能被普通对象包装，默认实现返回是一个bean。
- BeanPostProcessor.postProcessAfterInitialization() : 将此BeanPostProcessor 应用于给定的新bean实例 在任何bean初始化回调方法(像是InitializingBean.afterPropertiesSet或者自定义的初始化方法)之后调用。这个bean将要准备填充属性的值。返回的bean示例可能被普通对象包装
- InitializingBean.afterPropertiesSet(): 被BeanFactory在设置所有bean属性之后调用(并且满足BeanFactory 和 ApplicationContextAware)。

————————————销毁————————————

在BeanFactory 关闭的时候，Bean的生命周期会调用如下方法:

- `DestructionAwareBeanPostProcessor.postProcessBeforeDestruction()`: 在销毁之前将此BeanPostProcessor 应用于给定的bean实例。能够调用自定义回调，像是DisposableBean 的销毁和自定义销毁方法，这个回调仅仅适用于工厂中的单例bean(包括内部bean)
- 实现了自定义的destory()方法



#### 1. 实例化Bean

对于BeanFactory容器，当客户向容器请求一个尚未初始化的bean时，或初始化bean的时候需要注入另一个尚未初始化的依赖时，容器就会调用createBean进行实例化。 
对于ApplicationContext容器，当容器启动结束后，便实例化所有的bean。 
容器通过获取BeanDefinition对象中的信息进行实例化。并且这一步仅仅是简单的实例化，并未进行依赖注入。 
实例化对象被包装在BeanWrapper对象中，BeanWrapper提供了设置对象属性的接口，从而避免了使用反射机制设置属性。

#### 2. 设置对象属性（依赖注入）

实例化后的对象被封装在BeanWrapper对象中，并且此时对象仍然是一个原生的状态，并没有进行依赖注入。 
紧接着，Spring根据BeanDefinition中的信息进行依赖注入。 
并且通过BeanWrapper提供的设置属性的接口完成依赖注入。

#### 3. 注入Aware接口

紧接着，Spring会检测该对象是否实现了xxxAware接口，并将相关的xxxAware实例注入给bean。

#### 4. BeanPostProcessor

当经过上述几个步骤后，bean对象已经被正确构造，但如果你想要对象被使用前再进行一些自定义的处理，就可以通过BeanPostProcessor接口实现。 
该接口提供了两个函数：

- postProcessBeforeInitialzation( Object bean, String beanName ) 
  当前正在初始化的bean对象会被传递进来，我们就可以对这个bean作任何处理。 
  这个函数会先于InitialzationBean执行，因此称为前置处理。 
  所有Aware接口的注入就是在这一步完成的。
- postProcessAfterInitialzation( Object bean, String beanName ) 
  当前正在初始化的bean对象会被传递进来，我们就可以对这个bean作任何处理。 
  这个函数会在InitialzationBean完成后执行，因此称为后置处理。

#### 5. InitializingBean与init-method

当BeanPostProcessor的前置处理完成后就会进入本阶段。 
InitializingBean接口只有一个函数：

- afterPropertiesSet()

这一阶段也可以在bean正式构造完成前增加我们自定义的逻辑，但它与前置处理不同，由于该函数并不会把当前bean对象传进来，因此在这一步没办法处理对象本身，只能增加一些额外的逻辑。 
若要使用它，我们需要让bean实现该接口，并把要增加的逻辑写在该函数中。然后Spring会在前置处理完成后检测当前bean是否实现了该接口，并执行afterPropertiesSet函数。

当然，Spring为了降低对客户代码的侵入性，给bean的配置提供了init-method属性，该属性指定了在这一阶段需要执行的函数名。Spring便会在初始化阶段执行我们设置的函数。init-method本质上仍然使用了InitializingBean接口。

#### 6. DisposableBean和destroy-method

和init-method一样，通过给destroy-method指定函数，就可以在bean销毁前执行指定的逻辑。



## ApplicationContext

```java
public interface ApplicationContext
extends 
EnvironmentCapable,  // 继承环境对象容器接口
ListableBeanFactory,  
HierarchicalBeanFactory, // 继承beanFactory
MessageSource,  // 集成消息解析器
ApplicationEventPublisher, // 继承应用事件发布器
ResourcePatternResolver // 继承模式资源解析器
{
    
}
```

#### 1. EnvironmentCapable

首先，一个应用应该有自己的环境上下文。`ApplicationContext`继承了EnvironmentCapable。非常简单一接口, 但能为应用提供统一的配置入口。

```text
public interface EnvironmentCapable {

    /**
     * Return the {@link Environment} associated with this component.
     */
    Environment getEnvironment();
}
```

环境对象`Environment`是应用配置的核心。主要有两个方面的功能，一个是关于应用Property的配置，另一方面是关于Profile的配置。

这层抽象的作用是，无论配置从何而来，只要通过Environment对象实例就能获得。

在Environment类之下，还有一层`PropertySource`。

```text
public abstract class PropertySource<T> {}
```

这里的`Property`不是Bean Property。仅管它们在概念上有共通之处，但应用属性只是一个更简单的键值对，不包含额外的上下文。更准确的说，Property是一个键到一个值的映射，键是字符串，值可以是任何类型的对象（大部分情况下也是字符串）。

例如，从实现类`SystemEnvironmentPropertySource`将读取系统的环境变量。

同样，可以无限继承PropertySource，实现不同来源的配置读取。Spring默认读取系统的环境变量和运行jvm时提供的变量。所有这些PropertySource被`Environment`放入一个队列中，逐个读取，直至提供的键获得了对应的值。因此，在队列前端的PropertySource提供的属性优先级比后面的高。例如，通过Environment对象，要求一个"password"属性时，如果在第一个PropertySource里查找到了这个值，就不会再找下一个值。

Profile 功能是环境的运行描述。例如，如果当前是在test环境下运行，则将profile设置为"test"，应用可以根据这个值来调整自己的行为。

#### 2. ListableBeanFactory 和 HierarchicalBeanFactory

这两个是组件容器的核心接口。 注意，`ApplicationContext`是直接继承了`ListableBeanFactory`, 而不是`BeanFactory`。后者比前者少了一些枚举接口。

继承这两个接口也就是意味着，我们的应用是一个组件容器。

而众所周知，ApplicationContext不仅是一个组件容器，还是一个Ioc容器，提供依赖注入功能。什么是依赖注入呢？这与类的实例化有关。假如有一个类A, 它有一个依赖类B。

```text
public class A{
    private B b;
}
```

如果类B的实例是在类A外实例化的话，则称之为依赖反转。显然，在这种情况下，我们需要通过某种方式，使B的实例能顺利赋值给b，于是——

```text
public class A{
    private B b;

    /**
    * 构造器可以赋值一个b。
    */
    public A(B b){
        this.b = b;
    }

    /**
    * setter也可以。
    */
    public setB(B b){
        this.b = b;
    }
}
```

反之，在传统情况下，B是在A中实例化的。

```text
public class A{
    private B b;

    /**
    * 构造器可以赋值一个b。
    */
    public A(){
        this.b = new B();
    }
}
```

我们把前面那种注入依赖，而不是实例化依赖的方法称为依赖注入。Spring 就像是一个按照菜谱做菜的厨师，我们声明这个类的依赖是什么，那个类的依赖又是什么，然后Spring帮我们把每个依赖实例化好，然后注入到对应的bean中。

#### 3. MessageSource

```text
public interface MessageSource {

    @Nullable
    String getMessage(String code, @Nullable Object[] args, @Nullable String defaultMessage, Locale locale);

    String getMessage(String code, @Nullable Object[] args, Locale locale) throws NoSuchMessageException;

    String getMessage(MessageSourceResolvable resolvable, Locale locale) throws NoSuchMessageException;
}
```

应用还是应该是一个消息解析器。这玩意乍看之下似乎和`Environment`的功能没什么区别。实际上，形式上确实也没多少区别，只是应用的场景下不太一样，`MessageSource`提供跨语言环境的支撑。

例如我们需要一段文本，这段文本提供了更新信息。 但不巧的是， 我们是个跨国公司，需要提供不同语言的版本。硬编码是一个方法。

```text
if(inChinese){
    text = "版本3.2";
}else(inEnglish){
    text = "Version3.2"
}
```

`MessageSource`提供了不同的思路。所谓消息就是文本的代号。

```text
code = "application.version";
Locale locale = getCurrentLocale(); // Locale对象标定了当前使用哪种语言
text = messageSource.getMessage(code, locale);
```

想想一些国外游戏的所谓“中文资源包”，就是这些code到中文翻译文本的映射，游戏本身只是编码上这个code，提供什么资源包，就显示什么语言。

#### 4. ApplicationEventPublisher

Spring应用提供发布事件功能。

```text
public interface ApplicationEventPublisher {

    default void publishEvent(ApplicationEvent event) {
        publishEvent((Object) event);
    }

    void publishEvent(Object event);
}
```

事件发布是一种编程模式，是回调编程的一个变种。具体而言，就是我们可以在Spring上发布一个事件，然后Spring会寻找这个容器的监听器，然后调用监听器的代码。

例如，Spring 应用关闭后，会发布一个应用关闭事件。 应用代码可以注册这个事件的监听器， 处理一些资源关闭事件。

但这个模式最强的地方在于，它能把业务逻辑流程高度抽象起来，然后在这些抽象的流程中间插入事件发布。例如一个订单业务，遵循下单-付款-发货-收货，即可以抽象出对应的事件，如果我们想在用户下单时，弹出一些优惠提示，我们就可以注册一个下单事件的监听器来进行这个工作。一旦优惠截止，只需要卸载这个监听器即可。

有意无意的，事件流描述了一个应用逻辑流程的生命周期各个重要的节点。所以经常的，当你发现只要是涉及生命周期这个话题时，事件出镜率总是非常高。事实上，对于这个模式强编码出类似于"publish"和"event"的描述，确实有些过度抽象的嫌疑。这种命名方式对于业务逻辑代码的自说明性并不友好，不过意思就只是这么个意思。

#### 5. ResourcePatternResolver

这是一个有趣的话题。一个`ResourcePatternResolver`是一个`ResourceLoader`。但前者比后者比多一个模式匹配的接口。通常，我们认为一个资源位置字符串代表了一个资源，但一个模式字符串可以匹配多个资源。

```text
Resource[] getResources(String locationPattern) throws IOException;
```

所谓资源，在java的定义中，是一段字节流。文件是一段命名字节流，网络消息是一段字节流，内存是一块大字节数组……诸如此类，Resource接口抽象出这些来源，提供共同的操作接口。即从应用代码的角度出发，你不再需要管它是一个File还是一个URI，只需要老实调用`getInputStream()`或`readableChannel()`方法就可以了。

Spring的配置文件就是通过`ResourcePatternResolver`读取的。触类旁通，你当然也可以通过它来获得你想要的文件，无论它在classpath下、一个本地文件还是一个网络位置。

#### 6. Spring应用和Bean容器

Bean 即应用组件。Spring的容器功能是由BeanFactory提供的。BeanFactory不预设任何关于应用的信息。总得说来，它只做三件事情：

1. 管理BeanDefinition。
2. 响应获得某个特定组件的请求
3. 在各个组件的生命周期事件里调用相应的回调

应用(application)当然是由组件(component)组成的，所以无疑BeanFactory是一个非常重要的部分。

但我们觉得application应该是可定制的。因此，对于BeanFactory，应用提供了`BeanFactoryPostProcessor`接口。application从beanFactory中查找`BeanFactoryPostProcessor`，然后用这个接口来完成诸如注册额外bean的功能。

另外，application还在组件容器注册了一些特殊的bean，即Environment，ApplicationEventPublisher等。这意味着，这些对象在应用的任意组件中是可用的。

由于组件容器的特殊性质，application常做的事情就是查找bean容器里的bean，然后用这些bean来配置应用，甚至是bean容器本身。例如，bean容器不预设关于应用的信息，它甚至不会配置bean的生命周期回调类，需要appliction帮它从容器中查到关于`BeanPostProcessor`的信息，然后注册到bean容器上。此外，application常用到一种风格，即提前注册`BeanPostProcessor`去处理某一种实现了某种接口的对象，例如`ApplicationListenerDetector`, 注册所有`ApplicationListener`，而`ApplicationContextAwareProcessor`处理`EmbeddedValueResolverAware`,`ResourceLoaderAware`在内的多个接口。

#### 7. 应用构成

实际上的应用构成就只是上面实现的接口。但值得注意的是，spring并不直接实现这些接口，应用就好像一个超级代理类，虽然它声称自己实现了这些接口，但实际上却是派发到其它类去执行这个工作。

例如：

```text
@Override
public Object getBean(String name) throws BeansException {
    assertBeanFactoryActive();
    return getBeanFactory().getBean(name);
}
```

显然，application没有打算自己去获得bean，而是派发这个任务给内部的beanFactory。

这直接导致了spring应用是强组装性的，你可以任意替换一些组件完成自己的工作。不过，对于beanFactory并不推荐如此做（不妨碍它可以这么干），因为里面涉及大量的接口协定，如果你不是spring的开发人员，很容易在一些细微的地方搞出问题。

#### 8. 继承体系核心

`AbstractApplicationContext`是spring应用继承体系的核心。这个类实现了应用的一般流程，一方面，它实现了ApplicationContext接口本身的内容，诸如id,displayname之类的描述性信息，另一方面，它通过或者代理或者继承的方式实现了父接口的内容。

在重点方法`AbstractApplicationContext.refresh`方法实现了：

1. 初始化应用状态
2. 调用refreshBeanFactory（由子类实现）刷新内部的beanFactory。此时，它假设beanfacotry已经加载了配置好的bean组件。
3. 向beanFacotry中注入通用组件，注入environment，注册通用beanPostProcessor等等。
4. 调用子类的beanFactory处理方法（在调用beanFactoryPostProcessor时给子类一个机会介入）。
5. 调用beanFactoryPostProcessor。注意，对于Configuration类定义的配置，或者扫描实现的配置，是在这个时期把bean定义加载入beanFactory的。此外，spring会在beanFactory中自动寻找beanFactoryPostProcessor，但也可以通过`ConfigurableApplicationContext`接口手动注册。
6. 在beanFactory其它配置完成后，注册所有其它的beanPostProcessor。
7. 完成其它如messageSource, ApplicationEventMulticaster组件的初始化工作。

```java
@Override
 public void refresh() throws BeansException, IllegalStateException {
 synchronized (this.startupShutdownMonitor) {
 // Prepare this context for refreshing.
 prepareRefresh();

 // Tell the subclass to refresh the internal bean factory.
 ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

 // Prepare the bean factory for use in this context.
 prepareBeanFactory(beanFactory);

 try {
 // Allows post-processing of the bean factory in context subclasses.
 postProcessBeanFactory(beanFactory);

 // Invoke factory processors registered as beans in the context.
 invokeBeanFactoryPostProcessors(beanFactory);

 // Register bean processors that intercept bean creation.
 registerBeanPostProcessors(beanFactory);

 // Initialize message source for this context.
 initMessageSource();

 // Initialize event multicaster for this context.
 initApplicationEventMulticaster();

 // Initialize other special beans in specific context subclasses.
 onRefresh();

 // Check for listener beans and register them.
 registerListeners();

 // Instantiate all remaining (non-lazy-init) singletons.
 finishBeanFactoryInitialization(beanFactory);

 // Last step: publish corresponding event.
 finishRefresh();
            }

 catch (BeansException ex) {
 if (logger.isWarnEnabled()) {
 logger.warn("Exception encountered during context initialization - " +
 "cancelling refresh attempt: " + ex);
                }

 // Destroy already created singletons to avoid dangling resources.
 destroyBeans();

 // Reset 'active' flag.
 cancelRefresh(ex);

 // Propagate exception to caller.
 throw ex;
            }

 finally {
 // Reset common introspection caches in Spring's core, since we
 // might not ever need metadata for singleton beans anymore...
 resetCommonCaches();
            }
        }
    }
```

可以说 AbstractApplicationContext 已经将高层的应用逻辑抽象得十分完备，现在只剩下加载初始化的bean组件到beanFactory这一件事了。

因此，AbstractApplicationContext只留下了三个接口给子类实现，它们分别是：

```text
protected abstract void refreshBeanFactory() throws BeansException, IllegalStateException;


protected abstract void closeBeanFactory();


@Override
public abstract ConfigurableListableBeanFactory getBeanFactory() throws IllegalStateException;
```

其中，refreshBeanFactory要做的事情就是加载所有初始化的bean组件。

#### 9. ApplicationContext更具体的实现

针对`AbstractApplicationContext`这一设定，spring又提供了两个分支的子类型。

一方面，在前者的基础上，重新提供了`AbstractRefreshableApplicationContext`子类型。此类型继承`AbstractApplicationContext`，为`refreshBeanFactory`方法提供了一个逻辑实现——如果已有beanFactory刷新过了，则先关闭它，然后重建一个，并且为它加载bean定义。它提供了一个`loadBeanDefinitions`方法给子类实现。至于子类从哪加载，如何加载，并不过问。

另一方面`GenericApplicationContext`则是直接实现了`AbstractApplicationContext`。这也是我们目前看到的第一个非抽象类。它的刷新方法`refreshBeanFactory`非常简单, 只是判断是否刷新过，如果刷新过就抛异常。在加载bean定义这件事上，它并不交给子类去做，而是自己实现了一个`BeanDefinitionRegistry`，也就是说将bean定义从哪里来的事情交给了外部类来考虑。

回到`AbstractRefreshableApplicationContext`类的这条线上。`loadBeanDefinitions`方法没有提到如何加载bean定义，`AbstractRefreshableConfigApplicationContext`补上了这个缺陷，它认为所有的bean定义应该从configLocations处加载。但是，美中不足的是，这个类仍然没有说明configLocations应该是什么，从代码来看，它仅仅只是个字符串数组。

每个location可以解释为一个xml的位置，于是`AbstractXmlApplicationContext`应运而生。它将location解释为xml，并将xml的内容加载为beanDefinition注册到beanFactory中。此外，它提供了额外的Resource数组（内容必须是xml），使已经构建好的Resource对象不必再拆封装一次。然而，虽然这个类依然被声明为abstract，但它并没有提供更多的抽象方法。

秘密在`AbstractApplicationContext`上。`AbstractApplicationContext`继承了`DefaultResourceLoader`以实现`ResourceLoader`接口。这个类在实现`getResource`方法的时候，提供了一个`getResourceByPath`方法。具体而言，逻辑是这样的，如果location以"/"开头，则调用`getResourceByPath`方法，如果以"classpath:"开头，则搜索类路径，否则视作URL资源。

于是，所有`AbstractApplicationContext`都可以覆盖`getResourceByPath`来实现自己的默认路径类型（也就是不带前缀，仅仅是以"/"开头的路径，默认是classpath）。而在`AbstractXmlApplicationContext`中，this对象被用来加载资源。所以`AbstractXmlApplicationContext`只需要实现`getResourceByPath`来实现自己的特殊资源位置需求。

例如`FileSystemXmlApplicationContext`：

```text
@Override
protected Resource getResourceByPath(String path) {
    if (path.startsWith("/")) {
        path = path.substring(1);
    }
    return new FileSystemResource(path);
}
```

而`ClassPathXmlApplicationContext`会更简单，因为classpath是默认值，无须对此做任何覆盖。因此`ClassPathXmlApplicationContext`只做了一些简单的构造器重载，覆盖了`getConfigResources`方法。

#### 10. 从Java类加载配置的原理

加载Configuration类的原理在于，向beanFactory注册一个`ConfigurationClassPostProcessor`。这个类会循环加载Configuration定义。

我们重新看一下在`AbstractApplicationContext`中，bean定义加载分成几个阶段。

1. 指示子类刷新BeanFactory，此时会加载bean的初始化定义。xml配置在这里读取。
2. 加载应用通用组件
3. 调用`BeanFacotryPostProcessor`，可能会发生bean的注册。

顺便一说，有细心的同学可能会发现，这里有一个问题，如果说一个beanFacotryPostProcessor又加载了一个BeanFacotryPostProcessor定义应该怎么办？Spring定义了BeanFacotryPostProcessor的一个子接口BeanDefinitionRegistryPostProcessor，注册bean定义应该通过这个子接口来实现，spring首先会不断循环调用这个接口，直至没有新的BeanDefinitionRegistryPostProcessor注入，然后再调用一般的BeanFacotryPostProcessor。将一个主接口分成不同子接口的这种技巧在BeanPostProcessor也有体现。

那么对于应用程序客户端来说最终的bean来源即可能有两个——通用组件没办法控制。所以，一方面，我们可以直接通过xml直接注册，另一方面，我们可以在初始注册的bean中加入一个`BeanFacotryPostProcessor`，然后这个`BeanFacotryPostProcessor`会注册bean定义。

显然，我们可以首先注入一个`ConfigurationClassPostProcessor`实例，然后由`ConfigurationClassPostProcessor`提取beanFacotry中的Configuration。

#### 11. 使用注解配置bean原理

前面说到的`BeanFacotryPostProcessor`可以注册bean。然而针对单个bean的配置时，我们需要用到`BeanPostProcessor`。ApplicationContext会自动注册`BeanPostProcessor`。在每个bean实例化的时候，`BeanPostProcessor`都会被调用。

例如，`CommonAnnotationBeanPostProcessor`注册后，每次在bean创建的时候，就会识别并使用JSR-250注解。而`AutowiredAnnotationBeanPostProcessor`则识别和使用`@Autowired`注解。

#### 12. 扫描配置的原理

在spring framework 中扫描的利用方式有三种。一种是在xml文件中配置扫描包，另一种则是调用`AnnotationConfigApplicationContext.scan()`方法，最后一种是在@Configuration类上提供@ComponentScan注解。

`ComponentScanBeanDefinitionParser`被用来在xml中配置扫描组件类，即配置了`@Component`的类，例如，在xml中配置了：

```text
<component-scan/>
```

`ComponentScanBeanDefinitionParser.parse()`就会被调用。最后，这个parse方法会把真正的扫描工作分派给`ClassPathBeanDefinitionScanner`去完成扫描。

显然，由于读取的是xml的配置，这里的bean扫描进的是初始化配置。

`AnnotationConfigApplicationContext`读取则是直接依赖`ClassPathBeanDefinitionScanner`来实现。前面提到`GenericApplicationContext`依靠自己读取bean定义，`AnnotationConfigApplicationContext`则是对它的增强，把注册方法聚拢在`scan`和`register`方法`上。

@ComponentScan 是与 @Configuration 一并被处理的标签。最终也是分派给ClassPathBeanDefinitionScanner完成任务。

