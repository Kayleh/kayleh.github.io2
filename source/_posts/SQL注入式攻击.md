---
title: SQL注入式攻击
tags: [security]
slug: sql-injection-attacks
date: 2020-05-30T21:13:52+08:00
---

### SQL注入式攻击

<!--more-->

 攻击者把SQL命令插入到Web表单的输入域或页面请求的查询字符串，欺骗服务器执行恶意的SQL命令。在某些表单中，用户输入的内容直接用来构造（或者影响）动态SQL命令，或作为存储过程的输入参数，这类表单特别容易受到SQL注入式攻击。 



#### 常见的SQL注入式攻击主要是利用Statement的缺陷，

服务端验证：

```java
@Override
    public void login(Account account) throws SQLException {

        String sql = "insert into account values(null," + account.userName + "," + account.password + ")";


        try (Connection conn = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/account?characterEncoding=UTF-8",
                "root", "password")) {
            try (Statement stmt = conn.createStatement()) {
                try (ResultSet rs = stmt.executeQuery("SELECT id, grade, name, gender FROM students WHERE gender=1")) {
                    while (rs.next()) {
                        int id = rs.getInt(1);
                        String username = rs.getString(2);
                        String password = rs.getString(3);
                    }
                }
            }
        }
    }
```

客户端

```html
<link rel="stylesheet" href="https://cdn.kayleh.top/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdn.kayleh.top/npm/bootstrap@3.3.7/dist/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
<script src="https://cdn.kayleh.top/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
<div class="col-xs-8 col-sm-8 col-md-8 jumbotron">
    <form>
        <div class="form-group">
            <label for="exampleInputEmail1">Username</label>
            <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
        </div>
        <div class="form-group">
            <label for="exampleInputPassword1">Password</label>
            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
        </div>
        <div class="form-group">
            <label for="exampleInputFile">File input</label>
            <input type="file" id="exampleInputFile">
            <p class="help-block">Example block-level help text here.</p>
        </div>
        <div class="checkbox">
            <label>
                <input type="checkbox"> Check me out
            </label>
        </div>
        <button type="submit" class="btn btn-default">Submit</button>
    </form>
</div>

```

![img](https://cdn.kayleh.top/gh/kayleh/cdn/img/SQL注入式攻击/1.png)

如果是客户端精心构造的字符串，例如

```sql
name = "kayleh' OR pass=", pass = " OR pass='"
' or 1= ' 1
```

命令行永远为真，导致注入成功。

> 所以使用JDBC时，尽量使用速度比较快且安全的 PreparedStatement ，PreparedStatement 使用的是预编译机制。

