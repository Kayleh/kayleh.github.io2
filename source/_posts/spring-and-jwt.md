---
title: "Spring and Jwt"
date: 2021-05-24T11:04:21+08:00
draft: false
tags: [frame]
slug: spring-and-jwt
---

# 使用JWT

## 1.引入依赖

```xml
<dependency>
            <groupId>com.auth0</groupId>
            <artifactId>java-jwt</artifactId>
            <version>3.4.0</version>
        </dependency>
```

## 2.生成token

```java
public class createToken {
    public static void main(String[] args) {
        Calendar instance = Calendar.getInstance();
        instance.add(Calendar.SECOND, 90);
        //生成令牌
        String token = JWT.create()
                .withClaim("username", "张三")//设置自定义用户名
                .withExpiresAt(instance.getTime())//设置过期时间
                .sign(Algorithm.HMAC256("token!Q2W#E$RW"));//设置签名保密复杂
        //输出令牌
        System.out.println("--------token:" + token);
    }
}
-----
- 生成结果
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOlsicGhvbmUiLCIxNDMyMzIzNDEzNCJdLCJleHAiOjE1OTU3Mzk0NDIsInVzZXJuYW1lIjoi5byg5LiJIn0.aHmE3RNqvAjFr_dvyn_sD2VJ46P7EGiS5OBMO_TI5jg
```

## 3.根据令牌和签名解析数据

```java
JWTVerifier jwtVerifier = JWT.require(Algorithm.HMAC256("token!Q2W#E$RW")).build();
DecodedJWT decodedJWT = jwtVerifier.verify(token);
System.out.println("用户名: " + decodedJWT.getClaim("username").asString());
System.out.println("过期时间: "+decodedJWT.getExpiresAt());
```

## 4.常见异常信息

- SignatureVerificationException: 签名不一致异常
- TokenExpiredException: 令牌过期异常
- AlgorithmMismatchException: 算法不匹配异常
- InvalidClaimException: 失效的payload异常
  ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426122252495.png)

# 封装工具类

```java
public class JWTUtils {
    private static String TOKEN = "JokerDJToken";
    /**
     * 生成token
     * @param map  //传入payload
     * @return 返回token
     */
    public static String getToken(Map<String,String> map){
        JWTCreator.Builder builder = JWT.create();
        map.forEach((k,v)->{
            builder.withClaim(k,v);
        });
        Calendar instance = Calendar.getInstance();
        instance.add(Calendar.SECOND,7);
        builder.withExpiresAt(instance.getTime());
        return builder.sign(Algorithm.HMAC256(TOKEN)).toString();
    }
    /**
     * 验证token
     * @param token
     * @return
     */
    public static void verify(String token){
        JWT.require(Algorithm.HMAC256(TOKEN)).build().verify(token);
    }
    /**
     * 获取token中payload
     * @param token
     * @return
     */
    public static DecodedJWT getToken(String token){
        return JWT.require(Algorithm.HMAC256(TOKEN)).build().verify(token);
    }
}
```

# 整合springboot

## 0.搭建springboot+mybatis+jwt环境

- 引入依赖
- 编写配置

```xml
<!--引入jwt-->
<dependency>
  <groupId>com.auth0</groupId>
  <artifactId>java-jwt</artifactId>
  <version>3.4.0</version>
</dependency>
<!--引入mybatis-->
<dependency>
  <groupId>org.mybatis.spring.boot</groupId>
  <artifactId>mybatis-spring-boot-starter</artifactId>
  <version>2.1.3</version>
</dependency>
<!--引入lombok-->
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>1.18.12</version>
</dependency>
<!--引入druid-->
<dependency>
  <groupId>com.alibaba</groupId>
  <artifactId>druid</artifactId>
  <version>1.1.19</version>
</dependency>
<!--引入mysql-->
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>
  <version>5.1.38</version>
</dependency>
------------------
server.port=8989
spring.application.name=jwt
spring.datasource.type=com.alibaba.druid.pool.DruidDataSource
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/jwt?characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=root
mybatis.type-aliases-package=com.baizhi.entity
mybatis.mapper-locations=classpath:com/baizhi/mapper/*.xml
logging.level.com.baizhi.dao=debug
```

## 1.开发数据库

- 这里采用最简单的表结构验证JWT使用

```sql
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `name` varchar(80) DEFAULT NULL COMMENT '用户名',
  `password` varchar(40) DEFAULT NULL COMMENT '用户密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
```

## 2.开发entity

```java
@Data
@Accessors(chain=true)
public class User {
    private String id;
    private String name;
    private String password;
}
```

## 3.开发DAO接口和mapper.xml

```
@Mapper
public interface UserDAO {
    User login(User user);
}


<mapper namespace="com.baizhi.dao.UserDAO">
    <!--这里就写的简单点了毕竟不是重点-->
    <select id="login" parameterType="User" resultType="User">
        select * from user where name=#{name} and password = #{password}
    </select>
</mapper>
```

## 4.开发Service 接口以及实现类

```java
public interface UserService {
    User login(User user);//登录接口
}
```

impl

```java
@Service
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserDAO userDAO;
    @Override
    @Transactional(propagation = Propagation.SUPPORTS)
    public User login(User user) {
        User userDB = userDAO.login(user);
        if(userDB!=null){
            return userDB;
        }
        throw  new RuntimeException("登录失败~~");
    }
}
```

## 5.开发controller

```java
@RestController
@Slf4j
public class UserController {
    @Autowired
    private UserService userService;
    @GetMapping("/user/login")
    public Map<String,Object> login(User user) {
        Map<String,Object> result = new HashMap<>();
        log.info("用户名: [{}]", user.getName());
        log.info("密码: [{}]", user.getPassword());
        try {
            User userDB = userService.login(user);
            Map<String, String> map = new HashMap<>();//用来存放payload
            map.put("id",userDB.getId());
            map.put("username", userDB.getName());
            String token = JWTUtils.getToken(map);
            result.put("state",true);
            result.put("msg","登录成功!!!");
            result.put("token",token); //成功返回token信息
        } catch (Exception e) {
            e.printStackTrace();
            result.put("state","false");
            result.put("msg",e.getMessage());
        }
        return result;
    }
}
```

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426122931619.png)

## 6.数据库添加测试数据启动项目

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426122959260.png)

## 7.通过postman模拟登录失败

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426123015114.png)

## 8.通过postman模拟登录成功

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426123031980.png)

## 9.编写测试接口

```java
@PostMapping("/test/test")
public Map<String, Object> test(String token) {
  Map<String, Object> map = new HashMap<>();
  try {
    JWTUtils.verify(token);
    map.put("msg", "验证通过~~~");
    map.put("state", true);
  } catch (TokenExpiredException e) {
    map.put("state", false);
    map.put("msg", "Token已经过期!!!");
  } catch (SignatureVerificationException e){
    map.put("state", false);
    map.put("msg", "签名错误!!!");
  } catch (AlgorithmMismatchException e){
    map.put("state", false);
    map.put("msg", "加密算法不匹配!!!");
  } catch (Exception e) {
    e.printStackTrace();
    map.put("state", false);
    map.put("msg", "无效token~~");
  }
  return map;
}
```

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426123106916.png)

## 10.通过postman请求接口

![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426123124603.png)

## 11.问题?

- 使用上述方式每次都要传递token数据,每个方法都需要验证token代码冗余,不够灵活? 如何优化
- 使用拦截器进行优化

## 12. 添加拦截器

新建自定义拦截器MyInterceptor.java 实现HandlerInterceptor接口

```java
/**
 * @Author Joker DJ
 * @Date 2021/2/25 17:34
 * @Version 1.0
 */
@Slf4j
@Configuration
public class MyInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (HttpMethod.OPTIONS.toString().equals(request.getMethod())) {
            System.out.println("OPTIONS请求，放行");return true;
        }
        String token = request.getHeader("Authorization");
        Map<String,Object> map = new HashMap<>();
        try {
            JWTUtils.verify(token);
            return true;
        } catch (TokenExpiredException e) {
            map.put("state", false);
            map.put("msg", "Token已经过期!!!");
        } catch (SignatureVerificationException e){
            map.put("state", false);
            map.put("msg", "签名错误!!!");
        } catch (AlgorithmMismatchException e){
            map.put("state", false);
            map.put("msg", "加密算法不匹配!!!");
        } catch (Exception e) {
            e.printStackTrace();
            map.put("state", false);
            map.put("msg", "无效token~~");
        }
        String json = new ObjectMapper().writeValueAsString(map);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().println(json);
        return false;
    }
    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {
    }
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
    }
}
```

拦截器WebMvcConfig.java

```java

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new MyInterceptor()).
                addPathPatterns("/**").//拦截所有请求
                excludePathPatterns("/login").excludePathPatterns("/loginApp");//不拦截放行的请求地址
    }
}
```

## 13. 登录成功返回token后需要的操作

### 将token放到axios的header中，每次请求都携带token

1. 返回的token写入localStorage
   localStorage.setItem(‘authorization’,res.data.token);
   ![在这里插入图片描述](https://cdn.kayleh.top/gh/kayleh/cdn4/spring-and-jwt/20210426123635828.png)

2. 配置全局axios访问携带token

   ```java
   //自动给同一个vue项目的所有请求添加请求头
   axios.interceptors.request.use(function (config) {
   let token = localStorage.getItem('authorization');
   if (token) {
    config.headers['Authorization'] = token;
   }
   return config;
   })
   ```

   ### 后台接收token方式

3. 获取request对象
   \```java
   HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();

```
2. 通过request获取token```java String token = request.getHeader("Authorization");
```

1. 解析token

   ```
   DecodedJWT jwt = JWTUtils.getToken(token);
   ```

2. 获取token信息

   ```
   String id = jwt.getClaim("id").asString();     String username = jwt.getClaim("username").asString();     String loginname = jwt.getClaim("loginname").asString();     User user = new User();     user.setId(id);     user.setLoginname(loginname);     user.setUsername(username);
   ```

全部代码

```
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();        String token = request.getHeader("Authorization");        DecodedJWT jwt = JWTUtils.getToken(token);        String id = jwt.getClaim("id").asString(); //注意类型asxxx        String username = jwt.getClaim("username").asString();        String loginname = jwt.getClaim("loginname").asString();        User user = new User();        user.setId(id);        user.setLoginname(loginname);        user.setUsername(username);
```