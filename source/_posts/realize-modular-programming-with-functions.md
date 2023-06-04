---
title: realize modular programming with functions
mathjax: false
date: 2020-10-26T01:17:42+08:00
tags: [C]
translate_title: realize-modular-programming-with-functions
---

# 用函数实现模块化程序设计

>Realize modular programming with functions

用函数输出以下结果：

```c
*****************
How do you do!
*****************
```

```c
#include<stdio.h>

int main()
{
    void print_star();//函数的声明
    void print_message();//函数的声明
    print_star();
    print_message();
    print_star();
    return 0;
}

void print_star()
{
    printf("*****************\n");
}

void print_message()
{
    printf("How do you do!\n");
}
```

> 函数声明的作用是把有关函数的信息(函数名,函数类型,函数参数的个数与类型)通知编译系统,以便在编译系统对程序进行编译时,在进行到main函数调用print_star()和print_message()时知道它们是函数而不是变量或其他对象,还对调用函数的正确性进行检查.
>
> 函数间可以互相调用,但不能调用main函数,main函数是被操作系统调用的.
>
> 函数从用户使用的角度看分为:
>
> - 库函数
> - 用户自己定义的函数
>
> 从函数形式分为:
>
> - 无参函数
> - 有参函数

## 怎么定义函数

定义函数应包括哪些内容:

- 函数的名字,方便按名调用
- 函数的类型,即函数返回值的类型
- 函数的参数的名字和类型,调用函数时需要传递的数据
- 函数的功能,函数体

#### 定义无参函数

```c
类型名	函数名()
{
    函数体
}
或
类型名	函数名(void)
{
    函数体
}
```

函数体包括声明部分(变量)和语句部分.

#### 定义有参函数

```c
类型名	函数名(形式参数表列)
{
    函数体
}
```

#### 定义空函数

```c
类型名	函数名()
{}
```

## 调用函数

#### 函数调用的形式

> 函数名(实参表列)

#### 函数调用方式

- 调用语句

- 函数表达式

  要求函数带回一个确定的值以参加表达式的运算

  ```c
  c=2*max(a,b);
  ```

- 函数参数

  函数调用作为另一个函数调用时的实参,如:

  ```c
  m=max(a,max(b,c));
  ```

### 函数调用时的数据传递

#### 形式参数和实际参数

> `形式参数`
>
> 在定义函数时函数名后面括号中的变量名称为`形式参数`

> `实际参数`
>
> 在主调函数调用一个函数时,函数名后面括号中的变量名称为`实际参数`

#### 实参和形参间的数据传递

> 在调用函数过程中,系统会把实参中的值传递给被调函数的形参.

##### 输入两个整数,要求输出其中值较大者,要求用函数来找到最大值.

```c
#include<stdio.h>

int main()
{
    int max(int x, int y);
    int a, b, c;
    printf("please enter 2 integer numbers:");
    scanf("%d,%d", &a, &b);
    c = max(a, b);
    printf("max is %d", c);
    return 0;
}

int max(int x, int y)
{c
    int z;
    z = x > y ? x : y;
    return z;
}
```

### 函数调用的执行过程

1)在定义函数中指定的形参,在未出现函数调用的时,它们并不占内存中的存储单元,在发生函数调用时,函数max的形参才被临时分配内存单元.

2)将实参的值传递给对应形参

3)在执行max函数期间,由于形参已经有值,就可以利用形参进行有关的运算

4)通过return语句将函数值带回到主调函数.

5)调用结束,形参单元被释放. 注意:实参单元仍保留并维持原值.没有改变.如果在执行一个被调函数时,形参的值发生改变,不会改变主调函数的实参的值.如:在执行max函数时,x和y的值变为10和15,但a和b仍为2和3,这是因为形参和实参是两个不同的存储单元.

### 函数的返回值

- 函数的返回值是通过return语句中获得的.

- 函数返回值的类型是函数的类型.

- 在定义函数时指定的函数类型一般应该和return语句中的表达式类型一致.

将在max函数中定义的变量z改为float型,函数返回值与指定的函数类型不同

```c
#include<stdio.h>

int main()
{
    int max(float x, float y);
    float a, b;
    int c;
    scanf("%f,%f", &a, &b);
    c = max(a, b);
    printf("max is %d", c);
    return 0;
}

int max(float x, float y)
{
    float z;
    z = x > y ? x : y;
    return (z);
}
---------
1.5,2.6
max is 2
```

### 对被调用函数的声明和函数原型

输入两个实数,用一个函数求它们之和.

```c
#include<stdio.h>

int main()
{
    float add(float x, float y);
    float a, b, c;
    scanf("%f,%f", &a, &b);
    c = add(a, b);
    printf("sum is %d", c);
    return 0;
}

float add(float x, float y)
{
    float z;
    z = x + y;
    return (z);
}
```

#### 函数声明的两种形式

1)函数类型	函数名(参数类型1	参数名1,参数类型2	参数名2,...参数类型n	参数名n)

2)函数类型	函数名(参数类型1,参数类型2,...,参数类型n)

编译系统只关心和检查参数个数和参数类型,而不检查参数名,因为在调用函数时只要求保证实参类型与形参类型一致,而不必考虑形参名是什么.因此在函数声明中

> `函数原型`函数的首部称为函数原型

### 函数的嵌套调用

##### 输入4个整数,找出其中最大的数

```c
#include<stdio.h>

int main()
{
    int max4(int a, int b, int c, int d);
    int a, b, c, d, max;
    printf("please enter 4 integer numbers:");
    scanf("%d %d %d %d", &a, &b, &c, &d);
    max = max4(a, b, c, d);
    printf("max:%d", max);
    return 0;
}

int max2(int a, int b)
{
    if (a >= b)
        return a;
    else
        return b;
}

int max4(int a, int b, int c, int d)
{
    int max2(int, int);//函数声明
    int m;
    m = max2(a, b);
    m = max2(m, c);
    m = max2(m, d);
    return m;
}
```

改进:

```c
#include<stdio.h>

int main()
{
    int max4(int a, int b, int c, int d);
    int a, b, c, d, max;
    printf("please enter 4 integer numbers:");
    scanf("%d %d %d %d", &a, &b, &c, &d);
    max = max4(a, b, c, d);
    printf("max:%d", max);
    return 0;
}

int max2(int a, int b)
{
    return a >= b ? a : b;
}

int max4(int a, int b, int c, int d)
{
    int max2(int, int);//函数声明
    return max2(max2(max2(a, b), c), d);;
}
```

## 函数的递归调用

> 一个递归的问题可以分为"回溯"和"递推"两个阶段.

##### 用递归的方法求n! .

> n!=1				(n=0,1)
>
> n!=n×(n-1)	 (n>1)

```c
#include<stdio.h>

int main()
{
    int fac(int n);
    int n, y;
    printf("please enter an integer number:");
    scanf("%d", &n);
    y = fac(n);
    printf("%d!=%d", n,y);
    return 0;
}

int fac(int n)
{
    int f;
    if (n < 0)
        printf("n<0.data error!");
    else if (n == 0 || n == 1)
        f = 1;
    else f = fac(n - 1) * n;
    return f;
}
```

#####  汉诺塔问题

```c
#include<stdio.h>

int main()
{
    void hanoi(int n, char one, char two, char three);
    int m;
    printf("input the number of diskes:");
    scanf("%d", &m);
    hanoi(m, 'A', 'B', 'C');
    return 0;
}

void hanoi(int n, char one, char two, char three)
{
    //将n个盘从one座借助two座移动到three座
    void move(char x, char y);
    if (n == 1)
        move(one, three);
    else
    {
        hanoi(n - 1, one, three, two);
        move(one, three);
        hanoi(n - 1, two, one, three);
    }
}

void move(char x, char y)
{
    printf("%c --> %c\n", x, y);
}
```

## 数组作为函数参数

> 在用数组元素作函数实参时,把实参的值传给形参,是**"值传递"**方式,数据的传递是由**形参传到实参,单向传递.**

##### 输入10个数,要求输出其中值最大的元素和该数是第几个数.

```c
#include<stdio.h>

int main()
{
    int max(int x, int y);
    int a[10], i, m, n;
    printf("please enter 10 integer numbers:");
    for (i = 0; i < 10; i++)
    {
        scanf("%d", &a[i]);
    }
    printf("\n");
    for (i = 1, n = 0, m = a[0]; i < 10; i++)
    {
        if (max(m, a[i]) > m)
        {
            m = max(m, a[i]);
            n = i;
        }
    }
    printf("the large number is %d\nit is the %dth number.", m, n + 1);
    return 0;
}

int max(int x, int y)
{
    return x > y ? x : y;
}
```

### 一维数组名作函数参数

##### 有一个一维数组score,内放10个学生成绩,求平均成绩.

```c
#include<stdio.h>

int main()
{
    float average(float array[10]);
    float score[10], aver;
    int i;
    printf("input 10 scores:\n");
    for (i = 0; i < 10; i++)
        scanf("%f", &score[i]);
    printf("\n");
    aver = average(score);
    printf("average score is %5.2f\n", aver);
    return 0;
}

float average(float array[10])
{
    int i;
    float aver, sum = array[0];
    for (i = 1; i < 10; i++)
        sum = sum + array[i];
    aver = sum / 10;
    return aver;
}
```

形参数组可以不指定大小,在定义数组时在数组名后加上空括号,如

```c
float average(float array[])

```

##### 有两个班级,分别有35名和39名学生,调用一个average函数,分别求两个班的学生的平均成绩.

```c
#include<stdio.h>

int main()
{
    float average(float array[], int n);
    float score1[5] = {89, 99.5, 99, 45, 78};
    float score2[10] = {85.5, 10.5, 87.5, 78.5, 67.5, 90.5, 99.5, 87.5, 88, 78.5};
    
    //用数组名作实参
    printf("The average of class A is %6.2f\n", average(score1, 5));
    printf("The average of class B is %6.2f\n", average(score2, 10));
    return 0;
}

float average(float array[], int n)
{
    int i;
    float aver, sum = array[0];
    for (i = 1; i < n; i++)
        sum = sum + array[i];
    aver = sum / n;
    return (aver);
}

```

##### 使用选择法对10个整数从小到大排序

```c
#include<stdio.h>

int main()
{
    void sort(int array[], int n);
    int a[10], i;
    printf("please enter array:");
    for (i = 0; i < 10; i++)
    {
        scanf("%d", &a[i]);
    }
    sort(a, 10);
    printf("the sorted array:");
    for (i = 0; i < 10; i++)
    {
        printf("%d", a[i]);
    }
    printf("/n");
    return 0;
}

void sort(int array[], int n)
{
    int i, j, k, t;
    for (i = 0; i < n - 1; i++)
    {
        k = i;
        for (j = i + 1; j < n; j++)
        {
            if (array[j] < array[k])
                k = j;
            t = array[k];
            array[k] = array[i];
            array[i] = t;
        }
    }
}

```

### 多维数组名作函数参数

可以使用多维函数数组名作为函数的实参和形参.

> 形参数组和实参数组都是由相同类型和大小的一维数组组成的.C语言编译系统**不检查第一维**的大小.

##### 有一个3×4的矩阵,求所有元素的最大值.

```c
#include<stdio.h>

int main()
{
    int max_value(int array[][4]);
    int a[3][4] = {{1,  3,  5,  7},
                   {2,  4,  6,  8},
                   {15, 17, 34, 12}};
    printf("max value is %d", max_value(a));

}

int max_value(int array[][4])
{
    int max, i, j;
    max = array[0][0];
    for (i = 0; i < 3; ++i)
    {
        for (j = 0; j < 4; ++j)
        {
            if (array[i][j] > max)
                max = array[i][j];
        }
    }
    return max;
}

```

> 注意:
>
> 1.形参数组array第一维的大小省略,第2维大小不能省略,而且要和实参数组a的第2维大小相同.
>
> 2.在主函数调用max_value函数时,把实参二维数组a的第1行的起始地址传递给形参数组array.因此array数组第一行的起始地址与a数组的第一行起始地址相同.

# 局部变量和全局变量

**作用域**

每个变量都有作用域问题,即它们在什么范围内有效.

### 局部变量

定义变量有3种情况:

(1)在函数的开头定义

(2)在函数内的复合语句内定义

(3)在函数的外部定义

#### 说明:

1.主函数中定义的变量也只在主函数中有效

2.不同函数中可以使用同名的变量

3.形式参数也是局部变量

4.在一个函数内部,可以在复合语句中定义变量,这些变量只在本复合语句中有效,这种复合语句也称为"分程序"或"程序块".离开复合语句,变量就无效,系统会把占用的内存资源释放.

### 全局变量

> 程序的编译单位是源程序文件.

在函数之内定义的变量是局部变量,

在函数之外定义的变量是外部变量,是**全局变量**.它的有效范围为从定义变量的位置开始到本源程序文件结束.

##### 非必要不建议使用全局变量:

1.在全部执行过程中都占用存储单元,而不是仅在需要时才开辟单元.

2.减低程序的清晰性,不易维护

# 变量的存储方式和生存期

#### 动态存储方式和静态存储方式

从变量值的存在时间(即生存期)来分:

> 静态存储方式:程序在运行期间由系统分配固定的存储空间的方式
>
> 动态存储方式:程序运行期间根据需要进行动态的分配存储空间的方式.

数据分别存放在静态存储区和动态存储区,全局变量全部存放在静态存储区中.

> 在**动态存储区**中存放以下数据:
>
> ①函数形式参数。在调用函数时给形参分配存储空间。
>
> ②函数中定义的没有用关键字static声明的变量,即自动变量.
>
> ③函数调用时的现场保护和返回地址.

如果在一个程序中两次调用同一函数,而在此函数中定义了局部变量,在两次调用时分配给这些局部变量的存储空间的地址可能不一样.  

每个变量和函数都有两个属性,**数据类型**(如整型,浮点型)和**数据的存储类型**(静态存储,动态存储).

> 在定义和声明变量和函数时,一般应同时指定其数据数据类型和存储类型,也可以以默认的方式指定(即如果用户不指定,系统会隐含地指定为某一种存储类型).

C的存储类别:

- 自动的(auto)
- 静态的(static)
- 寄存器的(register)
- 外部的(extern)

## 局部变量的存储类别

#### 自动变量(auto变量)

函数中的局部变量,如果不专门声明为static(静态)存储类型,都是动态地分配存储空间的,数据存储在动态存储区中.程序运行期间根据需要进行动态的分配存储空间的方式.因此这类局部变量称为自动变量.

自动变量用关键字auto作存储类别的声明.

```c
int f(int a) //定义f函数，a为形参
{
    auto int b, c = 3; //定义b，c为自动变量
}

```

执行完后自动释放a,b,c所占的存储单元.

> auto关键字可以省略,不写auto则隐含指定为"自动存储类别",属于动态存储方式.

#### 静态局部变量(static局部变量)

有时希望函数中的局部变量的值在函数调用结束后不消失而继续保留原值,即其占用的存储空间不释放,在下一次再调用该函数时,该变量已有值(就是上一次函数调用结束的值)

```C
#include<stdio.h>

int main()
{
    int f(int);
    int a = 2, i;
    for (i = 0; i < 3; i++)
        printf("%d\n", f(a));
    return 0;
}
    
int f(int a)
{
    auto int b = 0;
    static c = 3;
    b = b + 1;
    c = c + 1;
    return (a + b + c);
}
--------
7
8
9

```

> 对静态局部变量是在编译时赋初值的,即只赋值一次,在程序运行时它已有初值.
>
> 而对自动变量是在函数调用时进行的,每调用一次函数重新给一次初值.

> 在定义局部变量时不赋初值的话,则对静态变量来说,编译时自动赋初值0(对数值型变量)或空字符'\0'(对字符变量).
>
> 而对自动变量来说,它的值是一个不确定的值.由于每次函数调用结束后存储单元已释放,下次调用时又重新另分配存储单元,而所分配的单元内容是不可知的.

##### 输出1到5的阶乘值.(局部静态变量)

```c
#include<stdio.h>

int main()
{
    int fac(int);
    int i;
    for (i = 1; i <= 5; ++i)
    {
        printf("%d!=%d\n", i, fac(i));
    }
    return 0;
}

int fac(int n)
{
    static int f = 1;//f保留了上次函数调用结束的值
    f = f * n;
    return (f);
}

```

> 不建议使用静态存储,长期占用不释放.

#### 寄存器变量(register变量)

> 为提高执行效率，允许将局部变量的值放在CPU中的寄存器中，需要用时直接从寄存器取出参加运算，不必再到内存中取存取。

优化的编译系统能够识别使用频繁的变量，从而自动地将这些变量放在寄存器中。因此实际上用register声明变量的必要性不大。

> 三种局部变量的存储位置是不同的：
>
> 自动变量是存储在动态存储区；
>
> 静态局部变量是存储在静态存储区；
>
> 寄存器存储在CPU中的寄存器中。

## 全局变量的存储类型

#### 在一个文件内扩展外部变量的作用域

> 如果由于某种考虑，在定义点之前的函数需要引用该外部变量，则在引用之前用关键字`extern`对该变量作**“外部变量声明”**，表示把该外部变量的作用域扩展到此位置。

##### **调用函数，求3个整数中的大者。**

```c
#include<stdio.h>

int main()
{
    int max();
    int i;
    extern int A, B, C;
    printf("please enter three integer numbers:");
    scanf("%d %d %d", &A, &B, &C);
    printf("max is %d\n", max());
    return 0;
}

int A, B, C;

int max()
{
    int m;
    m = A > B ? A : B;
    if (C > m)m = C;
    return m;
}

```

#### 将外部变量的作用域扩展到其他文件

##### 给定b的值，输入a和m，求a*b和$a^m$的值

```c
#include<stdio.h>

//file1.c
int A;

int main()
{
    int power(int);
    int b = 3, c, d, m;
    printf("please enter the number a and its power m:\n");
    scanf("%d,%d", &A, &m);
    c = A * b;
    printf("%d*%d=%d\n", A, b, c);
    d = power(m);
    printf("%d**%d=%d\n", A, m, d);
    return 0;
}

//file2.c
extern  A;

int power(int n)
{
    int i, y = 1;
    for (i = 1; i <= n; i++)
        y *= A;
    return y;
}

```

> extern既可以用来扩展外部变量在本文件的作用域,又可以使外部变量的作用域从一个文件扩展到程序中的其他文件,那么系统怎么区别处理呢?
>
> 在编译时遇到extern时,先在本文件中找外部变量的定义,如果找到,则在本文件中扩展作用域;
>
> 如果找不到,就在连接时从其他文件找到外部变量的定义,如果从其他文件中找到了,就将作用域扩展到本文件;如果再找不到,就按出错处理.

#### 将外部变量的作用域限制在本文件中

有时在程序设计中希望某些外部变量只限于被本文件引用,而不能被其他文件引用,这时可以在定义外部变量时加一个`static`声明.

加上`static`声明,只能用于本文件的外部变量称为`静态外部变量`.这就为程序的模块化,通用性提供方便.

如果已确认其他文件不需要引用本文件的外部变量,就可以对本文件的外部变量都加上static,成为静态外部变量,以免被其他文件误用.这就相当于把本文件的外部变量对外界"屏蔽起来",从其他文件的角度看,这个`静态外部变量`是"看不见的,不能用的".

> 用`static`声明一个变量的作用:
>
> - 对局部变量使用:
>
> 把它分配在静态存储区,该变量在整个程序执行期间不释放,其所分配的空间始终存在.
>
> - 对全局变量使用:
>
> 则该变量的作用域只限于本文件模块(即被声明的文件中).

##### 注意:

auto,static,register声明变量时,是在定义变量的基础上加上这些关键字,不能**单独使用**

如:

```c
	int a;
	static a; //企图将变量a声明为静态变量

```

编译时会被认为"重新定义".

# 关于变量的声明和定义

- 定义:建立存储空间的声明("int a;"),定义性声明
- 声明:不建立存储空间的声明("extern a;"),引用性声明

声明包括定义,但并非所有的声明都是定义.

# 内部函数和外部函数

### 内部函数

如果一个函数只能被本文件中的其他函数所调用，它称为**内部函数**，在定义内部函数时，在函数名和函数类型的前面加static，即：

```c
static 类型名 函数名(形参表)
static int fun(int a,int b)

```

内部函数又被称为静态函数，因为它是用static声明的。使用内部函数，可以使函数的作用域只局限于所在文件。这样，在不同的文件中即使有同名的内部函数，也互不干扰，不必担心所用函数是否会与其他文件中的模块中的函数同名。

### 外部函数

如果在定义函数时，在函数首部的最左端加关键字extern，则此函数是外部函数，可供其他文件使用。

如函数首部可以为：

```c
extern int fun(int a,int b)

```

这样，函数fun就可以为其他文件调用。c语言规定，如果在定义函数时省略extern，则默认为**外部函数**。

##### 有一个字符串，内有若干个字符，现输入一个字符，要求程序将字符串中该字符删去。

```c
#include<stdio.h>

//file1.c
int main()
{
    extern void enter_string(char str[80]);
    extern void delete_string(char str[], char ch);
    extern void print_string(char str[]);
    char c, str[80];
    enter_string(str);
    scanf("%c", &c);//输入需要删除的字符
    delete_string(str, c);
    print_string(str);
    return 0;
}


//file2.c
void enter_string(char str[80])
{
    gets(str);
}

//file3.c
void delete_string(char str[], char ch)
{
    int i, j;
    for (int i = j = 0; str[i] != '\0'; i++)
        if (str[i] != ch)
            str[j++] = str[i];
    str[j] = '\0';
}

//file4.c
void print_string(char str[])
{
    printf("%s\n", str);
}


```

> extern可以省略

