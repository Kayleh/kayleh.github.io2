---
title: java.lang.Integer
mathjax: false
date: 2021-12-24 13:13:16
tags: [jdk]
slugs: Integer
---

### Integer

##### 缓存

先看一段代码

```java
Integer a = 1;
Integer b = 1;
Integer c = 500;
Integer d = 500;
System.out.print(a == b);//true
System.out.print(c == d);//false

Integer a = 1;
Integer a = new Integer(1);
System.out.print(a == b);//false
```

Integer类型在-128-->127范围之间是被缓存了的，也就是每个对象的内存地址是相同的，赋值就直接从缓存中取，不会有新的对象产生，而大于这个范围，将会重新创建一个Integer对象，也就是new一个对象出来，当然地址就不同了，也就！=；

```java
/**
缓存以支持 JLS 要求的 -128 和 127（含）之间值的自动装箱的对象标识语义。 缓存在第一次使用时初始化。 缓存的大小可以由-XX:AutoBoxCacheMax=<size>选项控制。 在VM初始化过程中，java.lang.Integer.IntegerCache.high属性可能会被设置并保存在sun.misc.VM类的私有系统属性中
*/
private static class IntegerCache {
        static final int low = -128;
        static final int high;
        static final Integer cache[];

        static {
            // high value may be configured by property
            int h = 127;
            String integerCacheHighPropValue =
                sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
            if (integerCacheHighPropValue != null) {
                try {
                    int i = parseInt(integerCacheHighPropValue);
                    i = Math.max(i, 127);
                    // Maximum array size is Integer.MAX_VALUE
                    h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
                } catch( NumberFormatException nfe) {
                    // If the property cannot be parsed into an int, ignore it.
                }
            }
            high = h;

            cache = new Integer[(high - low) + 1];
            int j = low;
            for(int k = 0; k < cache.length; k++)
                cache[k] = new Integer(j++);

            // range [-128, 127] must be interned (JLS7 5.1.7)
            assert IntegerCache.high >= 127;
        }

        private IntegerCache() {}
    }
```





