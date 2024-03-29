---
title: sequential programming
mathjax: false
date: 2020-10-26T01:16:00+08:00
tags: [C]
slug: sequential-programming
---

# 顺序程序设计

求摄氏度

```c
#include<stdio.h>

int main()
{
    float f, c;
    f = 64.0;
    c = (5.0 / 9) * (f - 32);
    printf("f=%f\nc=%f\n", f, c);
    return 0;
}
```

### 常量

- 整型常量

- 实性常量(有小数点)

  - 十进制小数形式
  - 指数形式:如12.34e3(e或E之前必须有数字,e或E之后必须为整数)

- 字符常量

  - 普通字符,用单撇号括起来的一个字符

  > 字符常量存储在计算机存储单元中时,并不是存储字符本身,而是以其代码(一般采用ASCII码)存储的

  - 转义字符

- 字符串常量

> 用双撇号括起来的全部字符,双撇号内可以只有一个字符

- 符号常量

用#define指令,指定用一个符号名称代表一个常量

> 在预编译后,符号变量会全部被置换,

```c
#define PI 3.1415   //注意行末没有分号
```

### 变量

`变量`代表一个有名字,具有特定属性的一个存储单元,它用来存放数据,在程序运行期间,变量的值时可以改变的.

变量必须**先定义,后使用**. 在定义时指定该变量的名字和类型.

从变量中取值,实际上时通过变量名找到相应的内存地址,从该存储单元中读取数据.

### 常变量

在定义变量时,前面加一个关键字`const`

> 常变量与处理的异同?
>
> 有类型,占存储单元,不允许改变其值
>
> 常变量时有名字的不变量(便于在程序中被引用),而常量时没有名字的不变量

### 标识符

一个对象的名字

## 数据类型

> 基本类型
>
> - 整型类型
>   - 基本整型(int)
>   - 短整型(short int)
>   - 长整型(long int)
>   - 双长整型(long long int)
>   - 字符型(char)
>   - 布尔型(bool)
> - 浮点类型
>   - 单精度浮点型(float)
>   - 双精度浮点型(double)
>   - 复数浮点型(float_complex,double_complex,long long_complex)
>
> 枚举类型(enum)
>
> 空类型(void)
>
> 派生类型
>
> - 指针类型(*)
> - 数组类型([ ])
> - 结构体类型(struct)
> - 共用体类型(union)
> - 函数类型

### 整型数据

#### 整数数据存储空间和值的范围

|        类型        | 字节数 |                          取值范围                           |
| :----------------: | :----: | :---------------------------------------------------------: |
|        int         |   2    |               - 32768 ~ 32767 （5位十进制数）               |
|        int         |   4    |         - 2147483648 ~ 2147483647 （10位十进制数）          |
|    unsignde int    |   2    |                  0 ~ 65535 （5位十进制数）                  |
|    unsignde int    |   4    |               0 ~ 4294967295 （10位十进制数）               |
|       short        |   2    |               - 32768 ~ 32767 （5位十进制数）               |
|   unsigned short   |   2    |                  0 ~ 65535 （5位十进制数）                  |
|        long        |   4    |         - 2147483648 ~ 2147483647 （10位十进制数）          |
|    usigned long    |   4    |               0 ~ 4294967295 （10位十进制数）               |
|     long long      |   8    | - 9223372036854775808 ~ 9223372036854775807（20位十进制数） |
| unsigned long long |   8    |          0 ~ 18446744073709551615 （20位十进制数）          |

### 字符型数据

### 浮点型数据

> c编译系统把浮点型常量都按双精度处理,分配8个字节
>
> ```c
> float a = 3.14159f;   //把此3.14159按单精度浮点常量处理,编译时不出现"警告"
> 
> long double a = 1.23L;  //把此,1.23作为long double型处理
> ```

## 运算符和表达式

| 算术运算符 | 描述                             | 实例             |
| :--------- | :------------------------------- | :--------------- |
| +          | 把两个操作数相加                 | A + B 将得到 30  |
| -          | 从第一个操作数中减去第二个操作数 | A - B 将得到 -10 |
| *          | 把两个操作数相乘                 | A * B 将得到 200 |
| /          | 分子除以分母                     | B / A 将得到 2   |
| %          | 取模运算符，整除后的余数         | B % A 将得到 0   |
| ++         | 自增运算符，整数值增加 1         | A++ 将得到 11    |
| --         | 自减运算符，整数值减少 1         | A-- 将得到 9     |

| 关系运算符 | 描述                                                         | 实例            |
| :--------- | :----------------------------------------------------------- | :-------------- |
| ==         | 检查两个操作数的值是否相等，如果相等则条件为真。             | (A == B) 为假。 |
| !=         | 检查两个操作数的值是否相等，如果不相等则条件为真。           | (A != B) 为真。 |
| >          | 检查左操作数的值是否大于右操作数的值，如果是则条件为真。     | (A > B) 为假。  |
| <          | 检查左操作数的值是否小于右操作数的值，如果是则条件为真。     | (A < B) 为真。  |
| >=         | 检查左操作数的值是否大于或等于右操作数的值，如果是则条件为真。 | (A >= B) 为假。 |
| <=         | 检查左操作数的值是否小于或等于右操作数的值，如果是则条件为真。 | (A <= B) 为真。 |

| 逻辑运算符 | 描述                                                         | 实例              |
| :--------- | :----------------------------------------------------------- | :---------------- |
| &&         | 称为逻辑与运算符。如果两个操作数都非零，则条件为真。         | (A && B) 为假。   |
| \|\|       | 称为逻辑或运算符。如果两个操作数中有任意一个非零，则条件为真。 | (A \|\| B) 为真。 |
| !          | 称为逻辑非运算符。用来逆转操作数的逻辑状态。如果条件为真则逻辑非运算符将使其为假。 | !(A && B) 为真。  |

**位运算符**

位运算符作用于位，并逐位执行操作。&、 | 和 ^ 的真值表如下所示：

| p    | q    | p & q | p \| q | p ^ q |
| :--- | :--- | :---- | :----- | :---- |
| 0    | 0    | 0     | 0      | 0     |
| 0    | 1    | 0     | 1      | 1     |
| 1    | 1    | 1     | 1      | 0     |
| 1    | 0    | 0     | 1      | 1     |

| 位运算符 | 描述                                                         | 实例                                                         |
| :------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| &        | 按位与操作，按二进制位进行"与"运算。运算规则：`0&0=0;    0&1=0;     1&0=0;      1&1=1;` | (A & B) 将得到 12，即为 0000 1100                            |
| \|       | 按位或运算符，按二进制位进行"或"运算。运算规则：`0|0=0;    0|1=1;    1|0=1;     1|1=1;` | (A \| B) 将得到 61，即为 0011 1101                           |
| ^        | 异或运算符，按二进制位进行"异或"运算。运算规则：`0^0=0;    0^1=1;    1^0=1;   1^1=0;` | (A ^ B) 将得到 49，即为 0011 0001                            |
| ~        | 取反运算符，按二进制位进行"取反"运算。运算规则：`~1=0;    ~0=1;` | (~A ) 将得到 -61，即为 1100 0011，一个有符号二进制数的补码形式。 |
| <<       | 二进制左移运算符。将一个运算对象的各二进制位全部左移若干位（左边的二进制位丢弃，右边补0）。 | A << 2 将得到 240，即为 1111 0000                            |
| >>       | 二进制右移运算符。将一个数的各二进制位全部右移若干位，正数左补0，负数左补1，右边丢弃。 | A >> 2 将得到 15，即为 0000 1111                             |

| 赋值运算符 | 描述                                                         | 实例                            |
| :--------- | :----------------------------------------------------------- | :------------------------------ |
| =          | 简单的赋值运算符，把右边操作数的值赋给左边操作数             | C = A + B 将把 A + B 的值赋给 C |
| +=         | 加且赋值运算符，把右边操作数加上左边操作数的结果赋值给左边操作数 | C += A 相当于 C = C + A         |
| -=         | 减且赋值运算符，把左边操作数减去右边操作数的结果赋值给左边操作数 | C -= A 相当于 C = C - A         |
| *=         | 乘且赋值运算符，把右边操作数乘以左边操作数的结果赋值给左边操作数 | C *= A 相当于 C = C * A         |
| /=         | 除且赋值运算符，把左边操作数除以右边操作数的结果赋值给左边操作数 | C /= A 相当于 C = C / A         |
| %=         | 求模且赋值运算符，求两个操作数的模赋值给左边操作数           | C %= A 相当于 C = C % A         |
| <<=        | 左移且赋值运算符                                             | C <<= 2 等同于 C = C << 2       |
| >>=        | 右移且赋值运算符                                             | C >>= 2 等同于 C = C >> 2       |
| &=         | 按位与且赋值运算符                                           | C &= 2 等同于 C = C & 2         |
| ^=         | 按位异或且赋值运算符                                         | C ^= 2 等同于 C = C ^ 2         |
| \|=        | 按位或且赋值运算符                                           | C \|= 2 等同于 C = C \| 2       |

| 杂项运算符 | 描述             | 实例                                 |
| :--------- | :--------------- | :----------------------------------- |
| sizeof()   | 返回变量的大小。 | sizeof(a) 将返回 4，其中 a 是整数。  |
| &          | 返回变量的地址。 | &a; 将给出变量的实际地址。           |
| *          | 指向一个变量。   | *a; 将指向一个变量。                 |
| ? :        | 条件表达式       | 如果条件为真 ? 则值为 X : 否则值为 Y |

## 语句

### 赋值语句

赋值运算符

> ```
> =
> ```

复合的赋值运算符

```c
a+=3	等价于a=a+3;
x*=y+8	等价于x=x*(y+8);
x%=3	等价于x=x%3;
```

赋值表达式

```
变量	赋值运算符	表达式
```

赋值过程中的类型转换

```
1将浮点型数据(包括单,双精度)赋给整型变量时,先对浮点数取整,即舍弃小数部分,然后赋予整型变量;
2将整型数据赋值给单,双精度变量时,数值不变,但以浮点数形式存储到变量中.
3将一个double型赋给一float变量时,先将双精度数转换为单精度,即只取6~7位有效数字,存储到float型变量的4个字节中.
4字符型数据赋给整型变量时,将字符的ASCII代码赋给整型变量
5将一个占字节多的整型数据赋给一个占字节少的整型变量或字符变量(例如把占4个字节的int型数据赋给占2个字节的short变量或占1个字节的char变量)时,只将其低字节原封不动地送到被赋值的变量(即发生"截断"),如:
int i=289;
char c ='a';
c=i;
```

## 数据的输入输出

```c
printf();
scanf();
putchar();
getchar();
```

```c

```





