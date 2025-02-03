---
title: Java高性能高并发秒杀系统
mathjax: false
date: 2020-11-06T20:12:45+08:00
tags: [project]
slugs: Java-high-performance-and-high-concurrency-spike-system
description: 集成Mybatis和Redis的知识点
---

###### *@CSDN方 圆*

## 1. 集成Mybatis

> 我觉得在集成Mybatis时问题并不大

### 1.1 新接触的不用xml文件写Mapper文件

```java
@Mapper
@Component
public interface UserMapper {

    @Select("select * from user where id = #{id}")
    User selectById(@Param("id") int id);

    @Insert("insert into user (id,name) values (#{id},#{name})")
    int insertUser(User user);
}

```

- 注解`@Mapper`，标记该类是一个Mapper
- 通常之前做练习写数据库的CRUD都是在xml文件中进行的，这次采用的是在对应的方法上标注注解的形式，`@Select` `@Insert`

### 1.2 事务的测试

```java
@Service
public class UserService {
	...
	
    @Transactional
    public boolean tx(){
        User user1 = new User(2,"222");
        userMapper.insertUser(user1);

        User user2 = new User(3,"333");
        userMapper.insertUser(user2);

        return true;
    }
}
```

- 在UserService中，创建了一个方法，用来测试事务，用`@Transactional`标记

### 1.3 自定义一个Result类，用于返回结果使用

```java
@Data
public class Result<T> {

    private int code;
    private String msg;
    private T data;

    /**
     * 成功时调用
     */
    public static <T> Result<T> success(T data){
        return new Result<T>(data);
    }

    /**
     * 失败时调用
     */
    public static <T> Result<T> error(T data){
        return new Result<T>(data);
    }

    private Result(T data){
        this.data = data;
    }

    private Result(int code,String msg){
        this.code = code;
        this.msg = msg;
    }

    private Result(CodeMsg codeMsg){
        if(codeMsg != null){
            msg = codeMsg.getMsg();
            code = codeMsg.getCode();
        }
    }
}

```

- 它包含了三个字段，`code用来保存状态码`，`msg状态信息`，`data是返回的对象`（泛型）

```java
public class Result<T>
```

看`类声明的语句`，其中使用了泛型，这表示返回对象时，我们对其类型是“已知”的，不必强转，增加了灵活性

```java
public static <T> Result<T> success(T data){
    return new Result<T>(data);
}
123
```

其中的方法语句，在`返回值中标记了泛型`，需要我们在函数定义的中在返回值前加上`标识泛型`，可以把它想象成正常的返回值，像String等等，只不过用T来表示罢了

不过，在调用这个方法的时候用两种方法

1. 直接调用 `Result.success("Success")`;
2. 标记泛型调用，`Result.success("Success")`;

两种使用方法的结果都是一样的，不过第二种更能`突出它是泛型方法的使用`，推荐。

```java
private Result(T data){
    this.data = data;
}
123
```

最后这个实在简单，在构造方法参数中使用泛型，传什么类型就自动为什么类型。

- 最后总结一下这个Result的功能
  1.在成功和失败的时候用于结果返回表示
  2.另外它引入CodeMsg类，在CodeMsg类中，我们自定义了一些状态码和状态信息，用起来也比较方便

下面是CodeMsg类的代码

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CodeMsg {

    private int code;
    private String msg;

    //通用错误码
    public static CodeMsg SUCCESS = new CodeMsg(0,"success");
    ...
}
```

[Java泛型详解：和Class的使用。泛型类，泛型方法的详细使用实例](https://www.cnblogs.com/jpfss/p/9928747.html)

------

## 2. 集成Redis

### 2.1 与服务器的Redis建立连接

我们的最终目的是要创建出`JedisPool`，用来创建出Jedis与服务器中Redis进行交互

首先，需要在配置文件`application.properties中写好配置信息`，比如主机地址、端口号、最大连接数等等

```bash
redis.host=182.xxx.xxx.xxx
redis.port=6379
redis.timeout=3
redis.poolMaxTotal=10
redis.poolMaxIdle=10
redis.poolMaxWait=3
123456
```

写好配置文件，我们要对其进行读取，创建读取配置信息的配置类

```java
@Data
@Component
//读取配置文件的注解,指定前缀，读以redis打头的
@ConfigurationProperties(prefix = "redis")
public class RedisConfig {
    private String host;
    private int port;
    private int timeout;
    private int poolMaxTotal;
    private int poolMaxIdle;
    private int poolMaxWait;
}
123456789101112
```

- 注意注解`@ConfigurationProperties(prefix = "redis")`，用来读取前缀是redis的配置信息，字段与要读取的信息一致

接下来就是要创建`JedisPool`

```java
@Service
public class JedisPoolFactory {
    @Autowired
    RedisConfig redisConfig;

    @Bean
    public JedisPool jedisPool(){
        JedisPoolConfig jedisPoolConfig = new JedisPoolConfig();
        jedisPoolConfig.setMaxIdle(redisConfig.getPoolMaxIdle());
        jedisPoolConfig.setMaxTotal(redisConfig.getPoolMaxTotal());
        jedisPoolConfig.setEvictorShutdownTimeoutMillis(redisConfig.getTimeout() * 1000);

        return new JedisPool(jedisPoolConfig,
                redisConfig.getHost(),redisConfig.getPort(),redisConfig.getTimeout() * 1000);
    }
}
12345678910111213141516
```

RedisConfig，作为Bean自动装配进来，我们还要建立`JedisPoolConfig`来设置一些参数，供建立JedisPool时读取

以上，完成了与服务器Redis的建立连接过程

### 2.2 Key前缀的必要

毕竟我们这个是高并发的项目，那么多个人在对同一个key进行读取时，如果不对key值进行修饰，很容易发生数据损坏，所以，我们采用了`前缀修饰`，在设计模式中，是对`模板方法模式`的应用

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn2/Java高性能高并发秒杀系统/20200707171433298.png)

- 先创建一个`接口`，其中有两个方法，获得失效时间和获取前缀

```java
public interface KeyPrefix {
    //添加失效时间
    int expireSeconds();
    //获取前缀
    String getPrefix();
}
123456
```

- 随后，我们创建的是`抽象类`，它就像是一个`模板`，为其他实现该抽象类的子类，建立了一个模板（我在说什么？？？应该传达清楚了）
  我们对接口中的方法进行全部重写，其中获取前缀时，前缀为类名，提供`两种构造函数`，一种为无失效时间的，另一种为有失效时间的

> 抽象类中构造方法的理解：其中的构造方法与普通类中的构造方法`长得一样`，不过它`不能用来构造自己`，因为它是抽象的，不能实例化，但是一旦子类实现了该抽象类，那么`子类便可以调用其抽象类的构造函数进行实例化`

```java
public abstract class BasePrefix implements KeyPrefix{

    private int expireSecond;

    private String prefix;

    public BasePrefix(String prefix){
        this(0,prefix);
    }
    public BasePrefix(int expireSecond,String prefix){
        this.expireSecond = expireSecond;
        this.prefix = prefix;
    }

    @Override
    public int expireSeconds(){
        return expireSecond;
    }

    @Override
    public String getPrefix() {
        //获取前缀，前面添加类名
        return getClass().getSimpleName() + ":" + prefix;
    }
}
12345678910111213141516171819202122232425
```

- 最后，展现出抽象类的`实现类`

```java
public class UserKey extends BasePrefix {

    public UserKey(String prefix) {
        super(prefix);
    }

    //UserKey的两种前缀形式，一种是根据id另一种根据name
    public static UserKey getById = new UserKey("id");
    public static UserKey getByName = new UserKey("name");
}
12345678910
```

它的构造函数就是用的`抽象父类中的构造函数`，而且定义了两个静态字段，一种是根据Id来生成前缀，前缀格式会根据getPrefix()方法，表示为`类名+：+id`

### 2.3 简单看RedisService中的一个方法

```java
@Service
public class RedisService {
    @Autowired
    JedisPool jedisPool;
    
    public <T> boolean set(KeyPrefix keyPrefix,String key,T value){
        //获取Jedis对象
        Jedis jedis = null;
        try {
            jedis = jedisPool.getResource();

            String str = beanToString(value);
            if(str == null || str.length() <= 0){
                return false;
            }

            String realKey = keyPrefix.getPrefix() + key;
            int seconds = keyPrefix.expireSeconds();

            if(seconds <= 0){
                jedis.set(realKey,str);
            }else{
                //设置超时时间
                jedis.setex(realKey,seconds,str);
            }
            return true;
        }finally {
            returnToPool(jedis);
        }
    }
    ...
}
1234567891011121314151617181920212223242526272829303132
```

1. 根据自动装配获取`JedisPool`，用Jedis连接池来拿出`Jedis`与Redis服务器建立连接。
2. set方法，我们需要将`value值转换为String类型`，让Redis能够识别
3. 随后，为key`添加前缀`，生成realKey；获取其中的失效时间
4. 根据失效时间来判断是否需要调用`setex()方法`

### 2.4 beanToString与stringToBean方法

```java
    private <T> String beanToString(T value){
        if(value == null){
            return null;
        }
		//进行类型判断，这里用到了？通配符
        Class<?> clazz = value.getClass();
        if(clazz == int.class || clazz == Integer.class){
            return "" + value;
        }else if(clazz == long.class || clazz == Long.class){
            return "" + value;
        }else if(clazz == String.class){
            return (String)value;
        }else{
        	//如果是对象的话，用JSON的静态方法转String
            return JSON.toJSONString(value);
        }
    }
1234567891011121314151617
    @SuppressWarnings("unchecked")
    private <T> T stringToBean(String str,Class<T> clazz){
        if(str == null || str.length() <= 0 || clazz == null){
            return null;
        }

        if(clazz == int.class || clazz == Integer.class){
            return (T) Integer.valueOf(str);
        }else if(clazz == long.class || clazz == Long.class){
            return (T) Long.valueOf(str);
        }else if(clazz == String.class){
            return (T) str;
        }else{
        	//转化成对象的JSON静态方法
            return JSON.toJavaObject(JSON.parseObject(str),clazz);
        }
    }
1234567891011121314151617
```

- 注解`@SupressWarings("unchecked")`，镇压警告
