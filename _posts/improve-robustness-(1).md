---
title: "Improve Robustness (1)"
date: 2021-05-12T23:44:09+08:00
draft: false
slug: Improve-Robustness-(1)
---

# 提高代码鲁棒性——（1）

- 需要 Map 的主键和取值时，应该迭代 entrySet()

当循环中只需要 Map 的主键时，迭代 keySet() 是正确的。但是，当需要主键和取值时，迭代 entrySet() 才是更高效的做法，比先迭代 keySet() 后再去 get 取值性能更佳。

反例：

```java
Map<String,String> map = new HashMap();
for(String key : map.keySet())
{
    String value = map.get(key);
}
```

正例：

```java
Map<String,String> map = new HashMap();
for(Map.Entry<String,String> entry:map.entrySet())
{
    String key = map.getKey();
    String value = entry.getValue();
    ...
}
```

- 不要让常量变成变量

```java

```

