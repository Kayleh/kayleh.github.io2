---

title: Unitest framework
mathjax: false
date: 2021-02-13T00:00:57+08:00
tags: [test]
translate_title: Unitest-framework
---

![](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613147342997.png)

![](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613147496034.png)

![](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613149415607.png)

![](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613149552674.png)

#### 多条测试用例

![](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613149845499.png)

#### 注解方法

![1613199579426](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613199579426.png)

#### 五个方法

![1613199693463](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613199693463.png)

#### 测试用例testcase

![1613201703588](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613201703588.png)

![1613202112317](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613202112317.png)

#### 测试集合testsuite

##### 追加单个测试对象

![1613207825662](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613207825662.png)

> print(re.\_\_dict\_\_)

##### 追加多个测试对象

![1613209390861](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613209390861.png)

#### TestLoder

![1613231860846](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613231860846.png)

第一个参数path：指定存放测试用例的目录（单元测试用例，用unittest框架写的测试用例）

第二个参数pattern：指定匹配规则

![1613233980464](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613233980464.png)



![1613234000816](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613234000816.png)

#### TestRunner

![1613318481043](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613318481043.png)

![1613319975732](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613319975732.png)

##### 状态1

![1613320910898](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613320910898.png)

##### 状态2（大于1即可）详细报告

![1613320887518](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613320887518.png)

##### ![1613321695363](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613321695363.png)

##### 断言

![1613382483121](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613382483121.png)

```python
class mymath():
    def jia(self,a,b):
        return a+b;

    def jian(self,a,b):
        return a-b

    def changfa(self,a,b):
        if b==0:
            return "error"
        else:
            return a/b

#代码功能验证
if __name__=="__main__":
    mm = mymath()
    actualValue = m.jia(2,3)
    expectValue = 5
    if actualValue==expectValue:
        print("加法功能实现正确")

    try:
        actualValue==mm.jia("a",3)
    except Exception as e:
        print("该方法功能实现正确"，e)
-----------------------------------------------------------
#导包
import unittest
from myMath import mymath

#创建单元测试类(继承自unittest.testcase)
class myMathTest(unittest.TestCase):

    #测试用例资源初始化方法
    def setUp(self):
        self.mm = mymath()

    #测试用例方法
    def test_add_1(self):
        actualValue = self.mm.jia(2,1)
        expectValue = 3
        #断言
        self.assertEqual(actualValue,expectValue,"预期结果不一致")
    def test_add_2(self):
        actualValue = self.mm.jia("abc","def")
        expectValue = "abcdef"
        self.assertEqual(actualValue,expectValue,"预期结果不一致")
    def test_floor_1(self):
        actualValue = self.mm.chufa(4,0)
        expectValue = "abcdef"
        self.assertEqual(actualValue,expectValue,"预期结果不一致")

    #测试用例的资源释放
    def tearDown(self):
        pass

if __name__=="__main__":
    #unittest.main()
    #直接使用discover
    discover=unittest.defaultTestLoader.discover(r"./20200408/",pattern="myMathTest.py")
    #使用runner运行器运行测试集  "a"追加模式
    with open(r"./20200408/re.txt","a",encoding="utf-8") as f:
        runner=unittest.TextTestRunner(f,description="用于测试math类的用例执行",verbosity=2)
        runner.run(discover)
```

maintest.py

> 主测试文件,不是用来写测试用的,而是用来组织测试用来执行的

![1613396353835](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613396353835.png)

### HTML测试文档

##### HTMLTestRunner模块

安装HTMLTestRunner.py到python的安装目录下/lib中

```cmd
pip install html-TestRunner
```

##### 使用

```python
import os
from HTMLTestRunner import HTMLTestRunner

#path=os.path.dirname(__file__)当前目录
path=os.path.dirname(__file__)+r"/"
filename=time.strname("%Y-%m-%d-%H-%M-%S") + r".html"
filename = path + filename
#修改代码
with open(r"./20200408/result.html","wb") as f:
	runner=unittest.HTMLTestRunner(f,verbosity=2,title="单元测试报告",description="第一次运行的结果")
	runner.run(discover)
```

注释

![1613572049278](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613572049278.png)

![1613572027235](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613572027235.png)

### 邮件自动化

![1613574779605](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613574779605.png)

### 项目

项目目录结构

```
---public(模块,例如注册,登录,退出)
---test_cases(测试用例)
---test_datas(测试数据,例如csv文件)
---test_report(测试报告)
```

电商系统/public/loginModule.py

> 登录模块

```python
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
import time
class very_login():
    def login(self,driver):
        self.driver=driver
        self.driver.implicitly_wait(10)
        self.driver.get("http://localhost/verydows/")
        #点击登录
        self.driver.find_element_by_link_text("登录").click()
        #输入用户名密码
        self.driver.find_element_by_xpath('//*[@id="username"]').send_keys("kayleh")
        self.driver.find_element_by_xpath('//*[@id="password"]').send_keys("123456")
        #点击登录按钮
        self.driver.find_element_by_xpath('//*[@id="login-form"]/div/a').click()
        time.sleep(5)
       
    #退出登录
    def logout(self,driver):
        self.driver=driver
        ele=self.driver.find_element_by_xpath('//*[@id="top-userbar"]/a')
        ActionChains(self.driver).move_to_element(ele).perform()
        self.driver.find_element_by_link_text("退出").click()
    
    #退出浏览器对象
    def quitB(self,driver):
        self.driver=driver
        self.driver.quit()
        
if __name__=="__main__":
    driver=webdriver.Chrome()
    
```

电商系统/testcases/verydows_user_update.py

> 更新用户信息

```python
import unittest
from selenium import webdriver
import time
import os
import sys

#os.path.dirname(os.path.dirname(__file__))是这个文件的目录的上一级目录(电商系统)
path=os.path.dirname(os.path.dirname(__file__))+r"/public"
#添加到环境变量
path1=sys.path
path1.append(path)
from loginModule import very_login

class verydows_user_update(unittest.TestCase):
    def setUp(self):
        self.ll = very_login()
        self.driver=webdriver.Chrome()
        self.ll.login(self.driver)
       
    def test_user_01(self):
        time.sleep(3)
        self.driver.find_element_by_xpath('').click()
        time.sleep(2)
        self.driver.find_element_by_xpath('').clear()
        time.sleep(2)
        self.driver.find_element_by_xpath('').send_keys("petter")
    	time.sleep(2)
        self.driver.find_element_by_xpath('').clear()
        time.sleep(5)
        #修改完验证
        
    def tearDown(self):
        self.ll.logout(self.driver)
        self.ll.quitB(self.driver)
    	actualValue=self.driver.find_element_by_xpath('').get_attribute("value")
        expectValue="peter"
        self.assertEqual(actualValue,expectValue)
if __name__=="__main__":
    unittest.main()
```

电商系统/testcases/verydows_reg_true.py

```python
import unittest
from selenium import webdriver
import time
import csv
import os

filename = os.path.dirname(os.path.dirname(__file__))+r"/test_datas/data_csv.csv"
class verydows_reg_true(unittest.TestCase):
    def setUp(self):
        pass
    
    def test_reg_01(self):
        with open(filename,"r",encoding="utf-8") as f:
            data=csv.reader(f)
            for d in data:
                driver.get("http://localhost/verydows/")
                driver.find_element_by_link_text("免费注册").click()
                driver.find_element_by_id("username").send_keys(d[0])
                driver.find_element_by_id("email").send_keys(d[1])
                driver.find_element_by_id("password").send_keys(d[2])
                driver.find_element_by_id("repassword").send_keys(d[3])
                driver.find_element_by_link_text("立即注册").click()
                
                #因为有一个中间页面的跳转，此处要强制等待一下，让他跳转过去
                time.sleep(2)
                
                #断言
                #expectUrl="http://localhost/verydows/index.php?c=user&a=index"
                #actualUrl=driver.current_url
                
                expectValue=d[4]
                actualValue=driver.find_element_by_xpath('//....').text()
                
                #if expectValue==actualValue:
				#	print("注册username反向测试用例通过")
                #else:
                #    print("注册username反向用例不通过")
                self.assertEqual(expectValue,actualValue)
                
                #关闭浏览器对象
                driver.quit()
               
	def tearDown(self):
        pass
    
if __name__=="__main__":
    unittest.main()
                
```

电商系统/maintest.py

```python
#在此文件中调度测试用例执行
import unittest
from HTMLTestRunner import HTMLTestRunner
import os
import time 

pathCase=os.path.dirname(__file__)+r"/test_cases/"
pathReport=os.path.dirname(__file__)+r"/test_cases/"

filename=time.strname("%Y-%m-%d-%H-%M-%S") + r".html"
filename=pathReport+filename
discover = unittest.defaultTestLoader.discover(path,pattern=r"verydows*.py") 	
with open(filename,"wb") as f:
	runner=unittest.HTMLTestRunner(f,verbosity=2,title="自动化测试用例报告",description="XX")
	runner.run(discover)
```

## Unittest下的数据驱动测试

数据存储

> 测试脚本与测试数据分离

![1613756103321](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613756103321.png)

不导入ddt模块，字典只会形成一条测试用例

![1613756685341](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613756685341.png)

 ![1613756748533](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613756748533.png)

#### excel

![1613756844713](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613756844713.png)

![1613756873832](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613756873832.png)

xldr

![1613757056609](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613757056609.png)

excelutil.py

<img src="https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613757120441.png" alt="1613757120441" style="zoom:67%;" />

<img src="https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613757139743.png" alt="1613757139743" style="zoom:80%;" />

![1613757341191](https://cdn.kayleh.top/gh/kayleh/cdn3/Unitest-framework/1613757341191.png)

