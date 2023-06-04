---
title: app test
mathjax: false
date: 2021-03-04T00:49:54+08:00
tags: [test]
translate_title: app-test
---

## 移动端测试要点

### 安装测试、卸载测试

### UI测试

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615137765268.png" alt="1615137765268" style="zoom:50%;" />

### 功能测试

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615133542830.png" alt="1615133542830" style="zoom:50%;" />

#### 运行app	

![1615134963504](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615134963504.png)

#### 应用的前后台切换

![1615134979917](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615134979917.png)

#### 免登陆

![1615135150085](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615135150085.png)

#### 数据更新

![1615135195319](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615135195319.png)

#### 离线浏览

![1615135394779](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615135394779.png)

#### app更新

![1615135456332](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615135456332.png)

#### 定位、照相机服务

![1615135477942](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615135477942.png)

#### 时间测试

![1615135504852](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615135504852.png)

#### PUSH测试

![1615135520679](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615135520679.png)	

### 性能测试

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615136053666.png" alt="1615136053666" style="zoom:50%;" />

### 交叉事件测试

![1615136213904](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615136213904.png)

例如：微信视频和来电

### 兼容性测试

### 升级、更新测试

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615136698549.png" alt="1615136698549" style="zoom:50%;" />

### 用户体验测试

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615136880550.png" alt="1615136880550" style="zoom:50%;" />

### 硬件环境测试

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615136938152.png" alt="1615136938152" style="zoom:50%;" />

### 接口测试

### 客户端数据库测试

![1615137461874](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615137461874.png)

### 安全测试

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615137928157.png" alt="1615137928157" style="zoom:33%;" />

# Android测试

Android系统的基本结构

> linux内核层
>
> Android函数库和Android运行的虚拟机
>
> 应用程序框架
>
> 应用程序

![1615140074133](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615140074133.png)

#### 测试术语

- 系 统碎片化
- 屏幕尺寸
- 分辨率
- 像素
- 网络制式

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615140333141.png" alt="1615140333141" style="zoom:33%;" />

##### 像素

一位=8字节

大小 1156*634 = 732904

732904/8=9291613=92K

9291613/1024=89.

##### 网络制式

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615142556664.png" alt="1615142556664" style="zoom: 50%;" />

### Android四大组件

> 缺一不可

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615232986341.png" alt="1615232986341" style="zoom:50%;" />

- 活动

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615233173816.png" alt="1615233173816" style="zoom:33%;" />

- 服务

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615233382480.png" alt="1615233382480" style="zoom:50%;" />

- 内容提供者

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615233473534.png" alt="1615233473534" style="zoom: 50%;" />

- 广播接受者

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615233720649.png" alt="1615233720649" style="zoom:50%;" />

## Android测试环境搭建

#### :one:真机测试

使用真实的手机测试

#### :two:安卓模拟器

#### :three:Android自带的模拟器

#### :four:云真机测试

### Android开发环境

- 安装java, jdk
- ADT工具包<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615234913928.png" alt="1615234913928" style="zoom:50%;" />

#### 环境配置

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615309230399.png" alt="1615309230399" style="zoom: 50%;" />

打开eclipse

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615310931766.png" alt="1615310931766" style="zoom:50%;" />

#### ADB命令

- ##### 启动和关闭服务

>adb kill-server
>
>adb start server

-  adb.exe connect 127.0.0.1:62001 

- ##### 查看设备连接情况

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615312862427.png" alt="1615312862427" style="zoom:50%;" />

- 安装和卸载APK程序

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615313005852.png" alt="1615313005852" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615313041547.png" alt="1615313041547" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615314153934.png" alt="1615314153934" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615314260967.png" alt="1615314260967" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615314304693.png" alt="1615314304693" style="zoom:50%;" />

- 列出当前设备上的程序包

> adb shell pm list packages

- 上传和下载

> <img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615314565572.png" alt="1615314565572" style="zoom:50%;" />

- 日志

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615396174848.png" alt="1615396174848" style="zoom:67%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615396200109.png" alt="1615396200109" style="zoom: 50%;" />

> 过滤![1615396478274](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615396478274.png)

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615396559638.png" alt="1615396559638" style="zoom:50%;" />

- 其他

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615396733068.png" alt="1615396733068" style="zoom:50%;" />

> adb bugreport

#### monkey命令

##### **是什么？**

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615481732999.png" alt="1615481732999" style="zoom:50%;" />

- 所有的操作事件都是随机发生的。不以让人的意志为变化。 由于事件都是随机的、无序的，所以不做功能方面的测试，只对APP进行性能、稳定性方面的测试。

- monkey测试的时候，需要长时间、大量的操作事件

##### **特征**

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615482052583.png" alt="1615482052583" style="zoom:50%;" />

#####  Monkey的停止条件

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615483112988.png" alt="1615483112988" style="zoom:50%;" />

##### 进入Monkey

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615483206902.png" alt="1615483206902" style="zoom:50%;" />

##### 命令

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615483820132.png" alt="1615483820132" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615483835799.png" alt="1615483835799" style="zoom:50%;" />

> <img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615484056012.png" alt="1615484056012" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615484263141.png" alt="1615484263141" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615484482624.png" alt="1615484482624" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615484538246.png" alt="1615484538246" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615486792982.png" alt="1615486792982" style="zoom: 67%;" />

![1615486953589](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615486953589.png)

##### 使用案例

![1615487083624](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615487083624.png)

> --pct

monkey命令的参数,没有特别强制性的顺序,可以按照monkey命令的帮助列表的参数顺序记忆和使用.

##### Monkey异常log分析

![1615487991940](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615487991940.png)

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615488289973.png" alt="1615488289973" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615488415636.png" alt="1615488415636" style="zoom:50%;" />

# Appium

>https://github.com/appium/appium-desktop/releases/tag/v1.20.2

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615557202275.png" alt="1615557202275" style="zoom: 33%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615558307389.png" alt="1615558307389" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615558370562.png" alt="1615558370562" style="zoom:50%;" />

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615558953951.png" alt="1615558953951" style="zoom:50%;" />

## 元素识别

> 使用ADT环境中的sdk目录下,tools目录中的uiautomatorviewer.bat

启动uiautomatorviewer.bat

点击device Screenshot

![1615560081753](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615560081753.png)

## 操作

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615560132106.png" alt="1615560132106" style="zoom:50%;" />

##### 模拟键盘手机操作

> 输入操作: sendkeys()
>
> 点击操作: click()

##### 模拟手势操作

> <img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615563279179.png" alt="1615563279179" style="zoom:50%;" />

##### 移动设备相关操作

<img src="https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615563684414.png" alt="1615563684414" style="zoom: 67%;" />

## Appium脚本编写

```java
public class TestAppium{
    public static main(String[] args) throws Exception{
        //定义DesiredCapabilities对象
        DesiredCapabilities dc = new DesiredCapabilities();
        //设定DesiredCapabilities的属性
        dc.setCapability("deviceName","127.0.0.1:56001");//adb命令查出的设备的编号
        dc.setCapability("automationName","Appium");//设置自动化测试工具名称
        dc.setCapability("platformName","Android");//设置平台系统名称
        dc.setCapability("platformVersion","4.4.4");//设置Android系统版本号
        dc.setCapability("appPackage","com.youba.calculate");//设置目标app包名
        dc.setCapability("appActivity",".MainActivity");//设置目标app的启动界面
        
        /**
        * url:指的是本地appium服务的IP地址及对应的端口号(appium的默认端口号是4723)
        * 通过该地址可以使appium连接Android设备
        *
        * Capabilities:就是DesiredCapabilities对象
        **/
        //定义appium驱动对象 打开本地app驱动(appium)
        AppiumDriver appd = new AppiumDriver(new URL("http://127.0.0.1/wd/hub"),dc);
        
        //写脚本,让计算器计算54+68
        appd.findElement(By.id("com.youba.calculate:id/btn_five")).click();
        appd.findElement(By.id("com.youba.calculate:id/btn_four")).click();
        appd.findElement(By.id("com.youba.calculate:id/btn_plus")).click();
        appd.findElement(By.id("com.youba.calculate:id/btn_six")).click();
        appd.findElement(By.id("com.youba.calculate:id/btn_eight")).click();
        appd.findElement(By.id("com.youba.calculate:id/btn_equal")).click();
        
        appd.closeApp();
    }
}
```

# Junit

##### 一次单元测试用例设计的过程

![1615652206629](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615652206629.png)

#### Junit环境

![1615652373832](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615652373832.png)

![1615652610537](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615652610537.png)

![1615653557718](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615653557718.png)

![1615662647821](https://gcore.jsdelivr.net/gh/kayleh/cdn3/app-test/1615662647821.png)

## 编写测试 

在这里你将会看到一个应用 POJO 类，Business logic 类和在 test runner 中运行的 test 类的 JUnit 测试的例子。

在 **C:\ > JUNIT_WORKSPACE** 路径下创建一个名为 **EmployeeDetails.java** 的 POJO 类。

```JAVA
public class EmployeeDetails {

   private String name;
   private double monthlySalary;
   private int age;

   /**
   * @return the name
   */
   public String getName() {
      return name;
   }
   /**
   * @param name the name to set
   */
   public void setName(String name) {
      this.name = name;
   }
   /**
   * @return the monthlySalary
   */
   public double getMonthlySalary() {
      return monthlySalary;
   }
   /**
   * @param monthlySalary the monthlySalary to set
   */
   public void setMonthlySalary(double monthlySalary) {
      this.monthlySalary = monthlySalary;
   }
   /**
   * @return the age
   */
   public int getAge() {
      return age;
   }
   /**
   * @param age the age to set
   */
   public void setAge(int age) {
   this.age = age;
   }
}
```

**EmployeeDetails** 类被用于

- 取得或者设置雇员的姓名的值
- 取得或者设置雇员的每月薪水的值
- 取得或者设置雇员的年龄的值

在 **C:\ > JUNIT_WORKSPACE** 路径下创建一个名为 **EmpBusinessLogic.java** 的 business logic 类

```JAVA
public class EmpBusinessLogic {
   // Calculate the yearly salary of employee
   public double calculateYearlySalary(EmployeeDetails employeeDetails){
      double yearlySalary=0;
      yearlySalary = employeeDetails.getMonthlySalary() * 12;
      return yearlySalary;
   }

   // Calculate the appraisal amount of employee
   public double calculateAppraisal(EmployeeDetails employeeDetails){
      double appraisal=0;
      if(employeeDetails.getMonthlySalary() < 10000){
         appraisal = 500;
      }else{
         appraisal = 1000;
      }
      return appraisal;
   }
}
```

**EmpBusinessLogic** 类被用来计算

- 雇员每年的薪水
- 雇员的评估金额

在 **C:\ > JUNIT_WORKSPACE** 路径下创建一个名为 **TestEmployeeDetails.java** 的准备被测试的测试案例类

```java
import org.junit.Test;
import static org.junit.Assert.assertEquals;

public class TestEmployeeDetails {
   EmpBusinessLogic empBusinessLogic =new EmpBusinessLogic();
   EmployeeDetails employee = new EmployeeDetails();

   //test to check appraisal
   @Test
   public void testCalculateAppriasal() {
      employee.setName("Rajeev");
      employee.setAge(25);
      employee.setMonthlySalary(8000);
      double appraisal= empBusinessLogic.calculateAppraisal(employee);
      assertEquals(500, appraisal, 0.0);
   }

   // test to check yearly salary
   @Test
   public void testCalculateYearlySalary() {
      employee.setName("Rajeev");
      employee.setAge(25);
      employee.setMonthlySalary(8000);
      double salary= empBusinessLogic.calculateYearlySalary(employee);
      assertEquals(96000, salary, 0.0);
   }
}
```

**TestEmployeeDetails** 是用来测试 **EmpBusinessLogic** 类的方法的，它

- 测试雇员的每年的薪水
- 测试雇员的评估金额

现在让我们在 **C:\ > JUNIT_WORKSPACE** 路径下创建一个名为 **TestRunner.java** 的类来执行测试案例类

```java
import org.junit.runner.JUnitCore;
import org.junit.runner.Result;
import org.junit.runner.notification.Failure;

public class TestRunner {
   public static void main(String[] args) {
      Result result = JUnitCore.runClasses(TestEmployeeDetails.class);
      for (Failure failure : result.getFailures()) {
         System.out.println(failure.toString());
      }
      System.out.println(result.wasSuccessful());
   }
} 
```

用javac编译 Test case 和 Test Runner 类

```java
C:\JUNIT_WORKSPACE>javac EmployeeDetails.java 
EmpBusinessLogic.java TestEmployeeDetails.java TestRunner.java
```

现在运行将会运行 Test Case 类中定义和提供的测试案例的 Test Runner

```java
C:\JUNIT_WORKSPACE>java TestRunner
```

检查运行结果

```java
true
```

