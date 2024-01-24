---
title: java.lang.String
mathjax: false
date: 2021-12-19 23:20:58
tags: [jdk]
slug: java.lang.String
---

# String 

String类表示字符串。 Java 程序中的所有字符串文字，例如"abc" ，都是作为此类的实例实现的。
字符串是常量； 它们的值在创建后无法更改。 字符串缓冲区支持可变字符串。 因为 String 对象是不可变的，所以它们可以共享。 例如：

```java
String str = "abc";
```

相当于：

```java
char data[] = {'a', 'b', 'c'};
String str = new String(data);
```

以下是一些有关如何使用字符串的更多示例：

```java
System.out.println("abc");
String cde = "cde";
System.out.println("abc" + cde);
String c = "abc".substring(2,3);
String d = cde.substring(1, 2);
```

类String包括用于检查序列中的单个字符、比较字符串、搜索字符串、提取子字符串以及创建所有字符都转换为大写或小写的字符串副本的方法。 大小写映射基于Character类指定的 Unicode 标准版本。
Java 语言为字符串连接运算符 ( + ) 以及将其他对象转换为字符串提供了特殊支持。 字符串连接是通过StringBuilder （或StringBuffer ）类及其append方法实现的。 字符串转换通过toString方法toString ，由Object定义，Java 中所有类都继承。 有关字符串连接和转换的其他信息，请参阅 Gosling、Joy 和 Steele， Java 语言规范。
除非另有说明，否则将空参数传递给此类中的构造函数或方法将导致抛出NullPointerException 。
String表示 UTF-16 格式的字符串，其中补充字符由代理对表示（有关更多信息，请参阅Character类中的Unicode 字符表示部分）。 索引值指的是char代码单元，因此增补字符使用String两个位置。
除了用于处理 Unicode 代码单元（即char值）的方法之外， String类还提供了用于处理 Unicode 代码点（即字符）的方法。



#### String是不可变的，StringBuilder和StringBuffer是可变的

String是不可变的，String类中使用final关键字修饰char字符数组来保存字符串

```java
   private final char value[];
```

 而StringBuilder与StringBuffer都继承自AbstractStringBuilder类，在AbstractStringBuilder中也是使用**字符数组**保存字符串char[] value但是没有用final关键字修饰，所以这两种对象都是可变的。

#### **String和StringBuffer是线程安全的，StringBuilder不是线程安全的。** 

 String中的对象的不可变的，所以是线程安全。 

 StringBuffer对方法加了synchronized同步锁,所以是线程安全的。 

 StringBuilder没有对方法加同步锁，所以不是线程安全的。

**StringBuilder最高，StringBuffer次之，String最低。** 

  每次对String类型进行改变的时候，都会生成一个新的String对象，然后将指针指向新的String对象。StringBuffer每次都会对StringBuffer本身进行操作，而不是生成新的对象并改变对象引用。相同情况下使用StringBuilder相比使用StringBuffer仅能获得10%~15%左右的性能提升，但要冒多线程不安全的风险。 

 **对于三者使用的总结：** 

 当操作少量数据时，优先使用String。 

 当在单线程下操作大量数据，优先使用StringBuilder类  

  当在多线程下操作大量数据，优先使用StringBuffer类    







### 单线程环境下，StringBuilder和StringBuffer执行的区别

StringBuffer中的方法在单线程下synchronized默认加的是**偏向锁**。 

偏向锁是指当一段同步代码一直被同一个线程所访问时，即不存在多个线程的竞争时，那么该线程在后续访问时便会自动获得锁，从而降低获取锁带来的消耗，即提高性能。 

当一个线程访问同步代码块并获取锁时，会在对象头中的 Mark Word 字段里存储锁偏向的线程 ID。在线程进入和退出同步块时不再通过 CAS 操作来加锁和解锁，而是检测 Mark Word 里是否存储着指向当前线程的偏向锁。 

轻量级锁的获取及释放依赖多次 CAS 原子指令，而偏向锁只需要在置换 ThreadID的时候依赖一次 CAS 原子指令即可。 

偏向锁只有遇到其他线程尝试竞争偏向锁时，持有偏向锁的线程才会释放锁，线程是不会主动释放偏向锁的。 

 

JVM为了提高锁的获取与释放效率对synchronized 进行了优化，引入了偏向锁和轻量级锁 ， 

 从此以后锁的状态就有了四种：无锁、偏向锁、轻量级锁、重量级锁。 

 这四种状态会随着竞争的情况逐渐升级，而且是不可逆的过程，即不可降级。 

​     这四种锁的级别由低到高依次是：无锁、偏向锁，轻量级锁，重量级锁。    

​    

String为什么要设置成不可变的？        

1. **实现字符串常量池**        字符串常量池(String pool, String intern pool, String保留池) 是Java**堆内存**中一个特殊的存储区域, 当创建一个String对象时,假如此字符串值已经存在于常量池中,则不会创建一个新的对象,而是引用已经存在的对象。假若字符串对象允许改变,那么将会导致各种逻辑错误,比如改变一个对象会影响到另一个独立对象. 严格来说，这种常量池的思想,是一种**优化**手段.        
2.  **允许String对象缓存HashCode**        Java中String对象的哈希码被频繁地使用, 比如在HashMap 等容器中。字符串不变性保证了hash码的唯一性,因此可以放心地进行缓存.这也是一种性能优化手段,意味着不必每次都去计算新的哈希码.       
3. **安全性**        String被许多的Java类(库)用来当做参数,例如 网络连接地址URL,文件路径path,还有反射机制所需要的String参数等, 假若String不是固定不变的,将会引起各种安全隐患。        数据库的用户名、密码都是以字符串的形式传入来获得数据库的连接，或者在socket编程中，主机名和端口都是以字符串的形式传入。        因为字符串是不可变的，所以它的值是不可改变的，否则黑客们可以钻到空子，改变字符串指向的对象的值，造成安全漏洞。        在并发场景下，多个线程同时读写资源时，由于 String 是不可变的，不会引发线程的问题而保证了线程安全。

#### String中的常见的方法有哪些？         

String类是Java最常用的API，它包含了大量处理字符串的方法，比较常用的有：         

1.**char charAt(int index)**：返回指定索引处的字符；         

2.**String substring(int beginIndex, int endIndex)**：从此字符串中截取出一部分子字符串；         

3.**String[] split(String regex)**：以指定的规则将此字符串分割成数组；         

4.**String trim()**：删除字符串前导和后置的空格；        

 5.**int indexOf(String str)**：返回子串在此字符串首次出现的索引；         

6.**int lastIndexOf(String str)**：返回子串在此字符串最后出现的索引；         

7.**boolean startsWith(String prefix)**：判断此字符串是否以指定的前缀开头；         

8.**boolean endsWith(String suffix)**：判断此字符串是否以指定的后缀结尾；         

9.**String toUpperCase()**：将此字符串中所有的字符大写；         

10.**String toLowerCase()**：将此字符串中所有的字符小写；         

11.**String replaceFirst(String regex, String replacement)**：用指定字符串替换第一个匹配的子串；         

12.**String replaceAll(String regex, String replacement)**：用指定字符串替换所有的匹配的子串。



- `String s = “”;`会新增一个对象

  `String s1 = new String("");`会新增一个对象

  `String s = s+s1;`会新增一个对象

- intern
