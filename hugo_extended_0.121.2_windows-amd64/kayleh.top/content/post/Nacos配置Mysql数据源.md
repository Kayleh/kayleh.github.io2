---
title: Nacos-Mysql数据源
mathjax: false
date: 2021-06-20 14:49:10
tags: [DistributedMicroservices]
translate_title: Nacos：Configure-MySQL-data-source
---

## Nacos配置Mysql数据源

 本地正常使用Nacos的后台管理系统。

但是我配置的数据在哪里呀？在从安装到打开正常使用自始至终都没有对Nacos做过任何配置。 

通过官网阅读可知，其实Nacos默认配置的Derby数据库，这个数据库不是我们经常使用的，当然厂商也给我们提供了MySQL的配置方式。

> 注意：不支持MySQL8.0版本

1. 首先本地建立nacos的数据库(名字自定义)，我这里命名为：ag_nacos，并导入厂商提供的sql表文件`nacos-mysql.sql` 

2. 修改Nacos安装目录下的/conf/application.properties配置文件。增加支持mysql数据源配置（目前只支持mysql），添加mysql数据源的url、用户名和密码

   ```properties
   ##################################################
    
   spring.datasource.platform=mysql
    
   db.num=1
   db.url.0=jdbc:mysql://localhost:3306/ag_nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
   db.user=#用户名
   db.password=#密码
   ```

3. 单机模式启动nacos

   ```shell
   sh startup.sh -m standalone
   ```

   

