---
title: "SpringSecurity"
date: 2021-05-21T11:56:08+08:00
draft: false
slugs: SpringSecurity
---

# SpringBoot整合SpringSecurity

>https://www.kuangstudy.com/bbs/1369251751735095298

## Spring Security课程介绍

### 1. 框架概述

📕 Spring Security是基于Spring框架,提供了一套Web应用安全性的完整解决方案。正如你可能知道的关于安全方面的两个主要区域是”认证”和”授权”(或者访问控制),一般来说，Web应用的安全性主要包括用户认证和用户授权两个部分,这两点也是Spring Security的重要核心功能。

1. 用户认证指的是 : 验证某个用户是否为系统中的合法主体,也就是说用户能否访问该系统。用户认证一般要求用户提供用户名和密码。系统通过校验用户名和密码来完成认证过程。**==通俗点说就是系统认为用户是否能登录。==**
2. 用户授权指的是 : 验证某个用户是否有权限执行某个操作。在同一系统中，不同用户所具有的权限是不同的。比如对一个文件来说，有的用户只能进行读取，而有的用户可以修改。一般来说，系统会为不同的用户分配不同的角色，而每个角色对应一系列的权限。**==通俗点就是系统判断用户是否有权限去做某些事情。==**

📕 Spring Security 特点 :

- 和Spring无缝整合。
- 全面的权限控制
- 专门为Web开发而设计
  - 旧版本不能脱离Web环境使用
  - 新版本对整个框架进行了分层抽取，分成了核心模块和Web模块,单独引入核心模块就可以脱离Web环境。
- 重量级。

### 2. 入门案例

1. 创建SpringBoot工程,引入相关依赖

   ```xml
   <parent>
           <groupId>org.springframework.boot</groupId>
           <artifactId>spring-boot-starter-parent</artifactId>
           <version>2.2.1.RELEASE</version>
           <relativePath/>
       </parent>
       <dependencies>
           <!--Web 依赖-->
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-web</artifactId>
           </dependency>
           <!--Spring Security的相关依赖-->
           <dependency>
               <groupId>org.springframework.boot</groupId>
               <artifactId>spring-boot-starter-security</artifactId>
           </dependency>
       </dependencies>
   ```

1. 编写Controller进行测试

   ```java
   @RestController
   public class TestController {
       @GetMapping("/add")
       public String add() {
           return "hello Security";
       }
   }
   ```

### 3. SpringSecurity基本原理

🌳 **Spring Security 本质上是一个过滤器链**

- FilterSecurityInterceptor : 是一个方法级的权限过滤器,基本位于过滤链的最底部
- ExceptionTranslationFilter : 是一个异常过滤器,用来处理在认证授权过程中抛出的异常
- UsernamePassowrdAuthenticationFilter : 对/login的post请求做拦截,校验表单中用户名和密码。

🌳 过滤器是如何进行加载的？

![image-20210206021008467](D:\Hugo\hugo_0.75.1_Windows-64bit\blog\content\posts\SpringSecurity\rikcLoverikcLoveimage-20210206021008467.png)

🌳 两个重要的接口

 ⚪ UserDetailsService接口详解

 当什么也没有配置的时候,账号和密码是由SpringSecurity定义生成的。而在实际项目中账号和密码都是从数据库中查出来的,所以我们要通过自定义逻辑控制认证逻辑。**==通俗点来说就是查询用户名和密码的过程==** 如需要自定义逻辑时,只需要实现UserDetailsService接口即可，接口定义如下 :

<img src="D:\Hugo\hugo_0.75.1_Windows-64bit\blog\content\posts\SpringSecurity\rikcLoveimage-20210206022109352.png" alt="image-20210206022109352" />

返回值 UserDetails

这个类是系统默认的用户主体

```java
// 表示获取登录用户的所有权限
Collection<? extends GrantedAuthority> getAuthorities();
// 表示获取密码
String getPassword();
// 表示获取用户名
String getUsername();
// 表示判断用户是否被锁定
boolean isAccountNonLocked();
// 表示凭证{密码}是否过期
boolean isCredentialsNonExpired();
// 表示当前用户名是否可用
boolean isEnabled();
```

![image-20210206023135919](D:\Hugo\hugo_0.75.1_Windows-64bit\blog\content\posts\SpringSecurity\rikcLoverikcLoveimage-20210206023136065.png)

 ⚪ PasswordEncoder 接口讲解

 数据加密的接口,用于返回User对象里面密码加密

```java
// 表示把参数按照特定的解析规则进行解析
String encode(CharSequence rawPassword);
// 表示验证从存储中获取的编码密码与编码后提交的原始密码是否匹配。如果密码匹配,则返回true;如果不匹配,则返回false。第一个参数表示需要被解析的密码。第二个参数表示存储的密码。
boolean matches(CharSequence rawPassowrd,String encodePassword);
// 表示如果解析的密码能够再次进行解析且达到更安全的结果则返回true,否则返回false。默认返回false
default boolean upgradeEncoding(String encodePassowrd);
```

 ⚪ BCryptPasswordEncoder

 BCryptPasswordEncoder是Spring Security官方推荐的密码解析器,平时多使用这个解析器

 BCryptPasswordEncoder是对bcrypt强散列方法的具体实现。是基于Hash算法实现的单向加密。可以通过strength控制加密强度,默认为10。

```java
@Test
public void test01(){
    //创建密码解析器
    BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswrodEncoder();
    //对密码进行加密
    String password=bCryptPasswordEncoder.encode("123456");
    //打印加密后的数据
    System.out.println("加密之后的数据:"+password);
    //判断原字符加密后和加密之前是否匹配
    boolean result=bCryptPasswordEncoder.matches("123456",password);
}
```



### 4. 用户认证

1. 设置登录的用户名和密码

   - 第一种方式 : 通过配置文件配置

     ```properties
     spring.security.user.name=rikc
     spring.security.user.password=123456
     ```

   - 第二种方式 :通过配置类

     ```java
     package com.wisedu.securitydemo1.config;
     import org.springframework.context.annotation.Bean;
     import org.springframework.context.annotation.Configuration;
     import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
     import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;
     import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
     import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
     import org.springframework.security.crypto.password.PasswordEncoder;
     
     @Configuration
     public class SecurityConfig extends WebSecurityConfigurerAdapter {
         @Override
         protected void configure(AuthenticationManagerBuilder auth) throws Exception {
             BCryptPasswordEncoder bCryptPasswordEncoder=new BCryptPasswordEncoder();
             String password=bCryptPasswordEncoder.encode("123456");
             auth.inMemoryAuthentication().withUser("rikc").password(password).roles("admin");
         }
         @Bean
         public PasswordEncoder password(){
             return new BCryptPasswordEncoder();
         }
     }
     ```

   - 第三种方式 : 自定义编写实现类

     · 第一步 创建配置类,设置使用哪个userDetailsService实现类

     ```java
     @Configuration
     public class SecurityConfig1 extends WebSecurityConfigurerAdapter {
       @Autowired
         private UserDetailsService userDetailsService;
       @Override
         protected void configure(AuthenticationManagerBuilder auth) throws Exception {
             auth.userDetailsService(userDetailsService).passwordEncoder(password());
         }
         @Bean
         public PasswordEncoder password(){
             return new BCryptPasswordEncoder();
         }
     }
     ```
     
     · 第二步 编写实现类,返回User对象,User对象有用户名密码和操作权限
     
     ```java
     @Service("userDetailsService")
     public class MyUserDetailsServie implements UserDetailsService {
         @Override
         public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
             List<GrantedAuthority> auths= AuthorityUtils.commaSeparatedStringToAuthorityList("role");
             return new User("rikc",new BCryptPasswordEncoder().encode("123"),auths);
         }
     }
     ```

2. 查询数据库完成认证

   这是基于(1)里面的第三种自定义编写实现类通过查询数据库完成认证操作

   📕 导入相关依赖

   ```xml
   <dependency>
       <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
       <version>3.0.5</version>
</dependency>
   <dependency>
       <groupId>mysql</groupId>
       <artifactId>mysql-connection-java</artifactId>
</dependency>
   <dependecy>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
   </dependecy>
   ```
   
   📕 制作实体类
   
   ```java
   @Data
   public class User{
       private Integer id;
       private String username;
       private String password
   }
   ```
   
   📕 整合mapper,创建接口，操作数据库查询

### 5. 自定义用户登录界面

1. 配置类中实现相关的配置

   ```java
   @Configuration
   public class SecurityConfig1 extends WebSecurityConfigurerAdapter {
       @Autowired
       private UserDetailsService userDetailsService;
       @Override
       protected void configure(AuthenticationManagerBuilder auth) throws Exception {
           auth.userDetailsService(userDetailsService).passwordEncoder(password());
       }
       @Bean
       public PasswordEncoder password(){
           return new BCryptPasswordEncoder();
       }
       /**
       *自定义登录页面    
       */
       @Override
       protected void configure(HttpSecurity http) throws Exception {
           http.formLogin()    //自定义编写登录页面
               .loginPage("/login.html")   //登录页面设置
               .loginProcessingUrl("/user/login")     //登录访问Controller路径
               .defaultSuccessUrl("/test/index").permitAll()   //登陆成功以后,跳转路径
               .and().authorizeRequests()
                   .antMatchers("/","/test/hello","/user/login").permitAll()//设置哪些路径可以直接访问不需要登录认证
               .anyRequest().authenticated()
                   .and().csrf().disable();//关闭csrf防护
       }
   }
   ```

### 6. 用户授权(基于角色或权限进行访问控制)

#### 6.1 hasAuthority 方法

如果当前的主体具有指定的权限,则返回true,否则返回false

- 在配置类中设置当前访问地址有哪些权限

  ```java
  //当前登录用户只有具有admins权限才可以访问这个路径
  .antMatchers("/test/index").hasAuthority("admin")
  ```

- 在UserDetailsService,把返回的User对象设置权限

  ```java
  Users users=userMapper.selectOne("");
  //设置用户权限为管理员权限
  List<GrantedAuthority> auths=AuthorityUtils.commaSeparatedStringToAuthorityList("admin");
  UserDetailsSerivce userDetail=new User(users.getUserName,new BCryptPasswordEncoder().encode(users.getPassword()),auths);
  ```

#### 6.2 hasAnyAuthority 方法

如果当前的主体有任何提供的角色(给定的作为一个逗号分隔的字符串列表)的话,返回true

```
.anyMatchers("/test/index").hasAnyAuthority("admin,manager")
```

#### 6.3 hasRole 方法

如果用户具备给定角色就允许访问,否则出现403

如果当前主体具有指定的角色,则返回true

```java
.antMatchers("/test/index").hasRole("role")
//源码中进行了封装, 需要添加ROLE_。
//源码    
return "hasRole('ROLE_"+role+"')";
List<GrantedAuthority> auths=AuthorityUtils.commaSeparatedStringToAuthorityList("admin,ROLE_role");
```

注意 : 配置文件中不需要添加”ROLE_”,因为上述的底层源码会自动添加与之进行匹配。

#### 6.4 hasAnyRole 方法

表示用户具备任何一个条件都可以访问。

给用户添加角色:

```java
//用户对象不为空返回当前用户
return new User(username,user.getPassword(),AuthorityUtils.commaSeparatedStringToAuthorityList("admin,role,ROLE_admin,ROLE_role"));
```

修改配置文件 :

```
.antMatchers("/test/admin").hasAnyRole("role")
```

### 7. 用户授权(自定义403页面)

在配置类里面进行配置即可。

```
http.execptionHandling().accessDeniedPage("/unauth");
```

### 8. 用户授权(注解使用)

#### 8.1 [@Secured](https://github.com/Secured)

判断是否具有角色,另外需要注意的是这里匹配的字符串需要添加前缀”ROLE_”。

使用注解要提前开启注解功能。

```java
@SpringBootApplication
@EnableGlobalMethodSecurity(securedEnabled=true)
public class DemosecurityApplication{
    public static void main(String[] args){
        SpringApplication.run(DemosecurityApplication.class,args);
    }
}
```

在控制器方法上添加Controller

```java
@RequestMapping("testSecured")
@ResponseBody
@Secured({"ROLE_normal","ROLE_admin"})
public String helloUser(){
    return "hello,user";
}
@Secured({"ROLE_normal","Role_管理员"})
```

#### 8.2 [@PreAuthorize](https://github.com/PreAuthorize)

先开启注解功能

[@EnableGlobalMethodSecurity](https://github.com/EnableGlobalMethodSecurity)(prePostEnabled=true)

[@PreAuthorize](https://github.com/PreAuthorize) : 注解适合进入方法前的权限验证,[@PreAuthorize](https://github.com/PreAuthorize) 可以将登录用户的roles/permissions参数传入到方法中。

```java
@RequestMapping("/preAuthorize")
@ResponseBody
@PreAuthorize("hasAnyAuthority('menu:system')")
public String preAuthorize(){
    System.out.println("preAuthorize");
    return "preAuthorize";
}
```

#### 8.3 [@PostAuthorize](https://github.com/PostAuthorize)

先开启注解功能:

[@EnableGlobalMethodSecurity](https://github.com/EnableGlobalMethodSecurity)(prePostEnabled=true)

[@PostAuthorize](https://github.com/PostAuthorize) 注解使用并不多,在方法执行后再进行权限验证，适合验证带有返回值的权限

```java
@RequestMapping("/testPostAuthorize")
@ResponseBody
@PostAuthorzie("hasAnyAuthorize('menu:system')")
public String preAuthorize(){
    System.out.println("test-PostAuthorize");
    return "PostAuthorize";
}
```

#### 8.4 [@PostFilter](https://github.com/PostFilter)

[@PostFilter](https://github.com/PostFilter) : 权限验证之后对数据进行过滤,留下用户名是admin1的数据

表达式中的filterObject引用的是方法返回值List中的某一个元素

```java
@RequestMapping("getAll")
@PreAuthorize("hasRole('ROLE_管理员')")
@PostFilter("filterObject.username=='admin1'")
@ResponseBody
public List<UserInfo> getAllUser(){
    ArrayList<UserInfo> list=new ArrayList<>();
    list.add(new UserInfo(1l,"admin1","6666"));
    list.add(new UserInfo(2l,"admin2","6666"));
    return list;
}
```

#### 8.5 [@PreFilter](https://github.com/PreFilter)

[@PreFilter](https://github.com/PreFilter) : 进入控制器之前对数据进行过滤

```java
@RequestMapping("getTestPreFilter")
@PreAuthorize("hasRole('ROLE_管理员')")
@PreFilter(value="filterObject.id%2==0")
@ResonseBody
public List<UserInfo> getTestPreFilter(@RequestBody List<UserInfo> list){
    list.forEach(t->{
        System.out.println(t.getId()+"\t"+t.getUsername());
    });
}
```

### 9. 用户注销

在配置类中添加退出映射地址

```
http.logout().logoutUrl("/logout").logoutSuccessUrl("/index").permitAll();
```

### 10. 自动登录

![image-20210210005345863](D:\Hugo\hugo_0.75.1_Windows-64bit\blog\content\posts\SpringSecurity\rikcLoverikcLoveimage-20210210005345863.png)

![image-20210210005636400](D:\Hugo\hugo_0.75.1_Windows-64bit\blog\content\posts\SpringSecurity\rikcLoverikcLoveimage-20210210005636400.png)

第一步 : 创建数据库表

```sql
CREATE TABLE `persisent_logins`(
    `username` varchar(64) NOT NULL,
    `series` varchar(64) NOT NULL,
    `token` varchar(64) NOT NULL,
    `last_used` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(`series`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

第二步 : 配置类,注入数据源,配置操作数据库对象

```java
@Autowired
private DataSource dataSource;
@Bean
public PersistentTokenRepository persistentTokenRespository(){
    JdbcTokenRepositoryImpl jdbcTokenRepositoryImpl = new JdbcTokenRepositoryImpl();
    jdbcTokenRepositoryImpl.setDataSource(dataSource);
    //自动生成数据库表
    //jdbcTokenRepositoryImpl.setCreateTableOnStartup(true);
    return jdbcTokenRepositoryImpl;
}
```

```java
.and().rememberMe().tokenRespository(persistentTokenRepository())
    .tokenValiditySeconds(60)//设置有效时长单位是秒
    .userDetailsService(userDetailsService)
```

第三步 : 页面添加记住我复选框

```
记住我 :<input type="checkbox" name="remember-me" title="记住密码"/><br/>
此处 : name 属性必须为 remember-me,不能改为其他值
```

### 11. CSRF功能

跨域请求伪造(英语 : Cross-site request forgery),也被称为one-clickattack或者session riding,通常缩写为CSRF或者XSRF,是一种挟制用户在当前已登录的Web应用程序上执行非本意的操作的攻击方法。跟跨网站脚本(XSS)相比,XSS利用的是用户对指定网站的信任，CSRF利用的是网站对用户网页浏览器的信任。

跨域请求攻击，简单的说，是攻击者通过一些技术手段欺骗用户的浏览器去访问一个自己曾经认证过的网站并运行一些操作(如发邮件，发消息，甚至财产操作如转账和购买商品)。由于浏览器曾经认证过，所以被访问的网站会认为是真正的用户操作而去运行。这利用了Web中用户身份验证的一个漏洞 : **==简单的身份验证只能保证请求发自某个用户的浏览器,却不能保证请求本身是用户自愿发出的。==**

从Spring Security 4.0 开始，默认情况下会开启CSRF保护，以防止CSRF攻击应用程序，Spring Security CSRF 会针对PATCH,POST,PUT和DELETE方法进行防护。

Spring Security 实现CSRF的原理 :

- 生成csrfToken保存到HttpSession或者Cookie中.

案例 :

在登录页面添加一个隐藏域 :

```
<input type="hidden" th:if="${_csrf}!=null" th:value="${_csrf.token}" name="_csrf"/>
```

关闭安全配置的类中的csrf :

```
//http.csrf().disable();
```

添加依赖

```xml
<!--对thymeleaf添加 Spring Security标签支持-->
<dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
</dependency>
```