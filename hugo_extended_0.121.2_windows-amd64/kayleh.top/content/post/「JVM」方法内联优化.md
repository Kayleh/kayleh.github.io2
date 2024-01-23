---
title: ⌈JVM⌋方法内联优化
mathjax: false
date: 2022-10-14 22:24:15
tags: [jvm]
translate_title: jvm-method-inline
---

## 内联优化

在内部编译方法的时候，JVM根据内部逻辑分析是否热点代码，如果代码足够热，JVM会对方法内联优化，节省额外的方法调用开销（方法栈帧的生成、参数字段的压入、栈帧的弹出、指令执行地址跳转）。


方法内联是由JIT编译器在运行时完成的。既然涉及到编译，方法内联也是有一定的开销的，包括cpu时间和内存，所以这又是一个trade-off的老问题了。JIT根据以下信息决定是否进行内联：

* **被调用方法是否足够hot**。这个取决于该方法被调用的次数，次数阈值默认值为10,000。即运行时被调用次数超过10,000的方法，可以被认为是hot。
* **被调用方法大小是否合适**。对于过大的方法，JIT认为它是不适合做内联的。这个方法大小阈值由-XX:FreqInlineSize指定，不建议修改。即大于这个阈值size的方法，不考虑进行内联
* **被调用方法运行时其实现是否可以唯一确定**。显然，对于类方法、私有方法和final方法，JIT是可以唯一确定它们的具体实现代码的(这里对应字节码中的invokestatic和invokespecial)；另一方面，对于public方法调用，它所指向的具体实现可能是自身、父类、子类的方法实现代码（多态），只有当JIT能唯一确定方法的具体实现时，才有可能完成内联（对应字节码中的invokevirtual和invokeinterface）

另外内联优化不仅仅消除了调用开销，被内联优化的方法会编译成native code(机器码)放在JVM Code Cache nmethod中，使多次调用方法时性能提升。

函数调用的代码：

```java
package RUN.java;

class Solution1 {
    //函数调用: 0.2982 ms
    private int gogogo(int n) {
        for (int i = 0; i < 10; i++) {
            n <<= 1;
        }
        return n;
    }

    public static void main(String[] args) {
        long start = System.nanoTime();
        Solution1 s = new Solution1();
        int n = 1;
        int ans = 0;
        for (int i = 0; i < 10000; i++) {
            ans += s.gogogo(n);
        }
        long end = System.nanoTime();
        System.out.println("函数调用: " + (end - start) / 1000000.0 + " ms");
    }
}

```

直接内联的代码：

```java
package RUN.java;

class Solution {
    //内联调用: 1.003 ms
    public static void main(String[] args) {
        long start = System.nanoTime();
        int n = 1;
        int ans = 0;
        for (int i = 0; i < 10000; i++) {
            for (int i1 = 0; i1 < 10; i1++) {
                n <<= 1;
            }
            ans += n;
        }
        long end = System.nanoTime();
        System.out.println("内联调用: " + (end - start) / 1000000.0 + " ms");
    }
}

```



- 执行前增加 -XX:+PrintCompilation 参数，输出编译结果。具体每项内联信息所代表的意思
