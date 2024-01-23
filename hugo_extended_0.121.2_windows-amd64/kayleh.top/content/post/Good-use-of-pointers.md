---
title: Good use of pointers
mathjax: false
date: 2020-10-26T01:18:07+08:00
tags: [C]
translate_title: Good-use-of-pointers
---

# 善于利用指针

> Good use of pointers

## 指针

如果在程序中定义了一个变量，在对程序进行编译时，系统就会给这个变量分配内存单元。编译系统根据程序中定义的变量类型，分配一定长度的空间。

每一个字节都有一个编号，就是“地址”。

> 地址指向该变量单元.地址形象化地称为"指针",它能找到以它为地址的内存单元.

c语言中的地址包括位置信息(内存编号,或称为纯地址)和它指向的数据的类型信息,或者说它是"带类型的地址".

在程序中一般通过变量名来引用变量的值,

```c
printf("%d\n",i);
```

> 对变量的访问都是通过地址进行的.

假如有输入语句:

```c
scanf("%d",&i);
```

在执行时,把键盘输入的值送到地址为2000开始的整型存储单元中.

如果有语句:

```c
k=i+j;
```

则从2000~2003字节取出i的值(3),再从2004~2007字节取出j的值(6),将它们相加后再将其和(9)送到k所占用的2008~2011字节单元中.这种直接按变量名进行的访问称为"直接访问"

还可以采用另一种称为“间接访问”的方式，即将变量i的地址存放在另一变量中，然后通过该变量来找到变量i的地址。从而访问i变量。

> 为了表示将数值3送到变量中，可以有两种表达方式：
>
> 1) 将3直接送到变量i所标识的单元中,例如"i=3;"
>
> 2) 将3送到变量*i_pointer*所指向的单元(即变量i的存储单元)，例如“*i_pointer=3;*”,其中**i_pointer*表示*i_pointer*所指向的对象，

### **指向**

通过*i_pointer*能知道i的地址，从而找到变量*i*的内存单元。

*i_pointer*指向*i*

---

## 指针变量

##### 通过指针变量访问整型变量.

```c
#include<stdio.h>

int main()
{
    int a = 100, b = 10;    //定义整型变量a,b,并初始
    int *point_1, *point_2; //定义指向整型数据的指针变量point_1,point_2
    point_1 = &a;           //把变量a的地址赋给指针变量point_1
    point_2 = &b;
    printf("a=%d,b=%d\n", a, b);
    printf("*point_1=%d,*point_2=%d\n", *point_1, *point_2);
    return 0;
}
-----
a=100,b=10
*point_1=100,*point_2=10
```

### 怎么定义指针变量

```c
类型名	* 指针变量名
```

指针变量是基本数据类型派生出来的类型,它不能离开基本类型而独立存在.

---

### 怎样引用指针变量

1)给指针变量赋值

```c
p=&a;
```

> 指针变量p的值是变量a的地址,p指向a.

2)引用指针变量指向的变量.

```c
printf("%d",*p);
```

> 以整数形式输出指针变量p所指向的变量的值,即变量a的值.

3)引用指针变量的值

```c
printf("%d",p);
```

以八进制数形式输出指针变量p的值，如果p指向了a，就是输出了a的地址，&a.

##### 输入a和b两个整数，按先大后小的顺序输出。

```c
#include<stdio.h>

int main()
{
    int a, b, *point_a, *point_b, *temp;
    printf("please enter two integer number:");
    scanf("%d,%d", &a, &b);
    point_a = &a;
    point_b = &b;
    if (a < b)
    {
        temp = point_b;
        point_b = point_a;
        point_a = temp;
    }
    printf("a=%d,b=%d\n", a, b);
    printf("max=%d,min=%d\n", *point_a, *point_b);
}

```

---

## 指针变量作为函数参数

##### :heavy_check_mark: 输入a和b两个整数，按先大后小的顺序输出。

```c
#include<stdio.h>

int main()
{
    int a, b, *point_a, *point_b;
    void swap(int *point_a, int *point_b);
    printf("please enter two integer number:");
    scanf("%d,%d", &a, &b);
    point_a = &a;
    point_b = &b;
    if (a < b)
        swap(point_a, point_b);
    printf("max=%d,min=%d\n", *point_a, *point_b);
}

void swap(int *point_a, int *point_b)
{
    int temp;
    temp = *point_a;
    *point_a = *point_b;
    *point_b = temp;
}
----------------
//如果写成:
 	int *temp;
    *temp = *point_a;//此语句有错误,不能向一个未知的存储单元赋值.
    point_a = *point_b;
    point_b = *temp;
```

> 由于"**单向传递**"的值传递方式，形参值的改变不能使实参的值随之改变.
>
> 为了**使在函数中改变了的变量值能被主调函数main所用**,不能采取把改变值的变量作为参数的办法,
>
> 而应该用`指针变量`作为函数的参数,**使指针变量所指向的变量值发生变化**,在函数调用结束后,这些变量值的变化**依然保留**了下来.

> ------------有关值传递请看：[值传递]( https://kayleh.top/pass-by-value/ )----------------------------------------------------

##### :x:不可以通过执行调用函数来改变实参指针变量的值,但是可以改变实参指针变量所指变量的值:

```c
void swap(int *point_a, int *point_b)
{
    int *temp;
    temp = point_a;
    point_a = point_b;
    point_b = temp;
}
------
×无法改变
```

---

## 通过指针引用数组

> 数组元素的指针就是数组元素的地址

可以用一个指针变量指向一个数组元素.如:

```c
int a[10]={1,3,5,7,9,11,13,15,17,19};
int *p;
p=&a[0];
//也可以写成p=a;
指针变量p的值是数组a首元素即a[0]的地址.而不是数组a各元素的值.

```

#### 在引用数组元素时指针的运算.

> 指针变量p指向数组元素a[0],希望用p+1表示指向下一个元素a[1];

- 系统会根据指针变量的基类型来确定增加的字节数.

  如:

  整型类型的指针变量int *p,

  p+1就是位移一个数组元素(int)所占用的字节数也就是4.

- 如果p的初值为&a[0],则p+i和a+i就是数组元素a[i]的地址.

- \*(p+i)或\*(a+i)是p+i或a+i就是数组元素,即a[i].

  实际上编译系统在编译时,对数组元素a[i]就是按*(a+i)处理的.即按数组首字母的地址加上相对位移量得到要找的元素的地址,然后找出该单元中的内容.

> [ ]实际上是变址运算符,即将a[i]按a+i计算地址,然后找出此地址单元中的值.

如果指针变量p1和p2都是指向同一数组元素的长度,如**执行p2-p1,结果是p2-p1的值(两个地址之差)除以数组元素的长度.**

通过用p2-p1就可知道它们所指向元素的相对距离.

> 两个地址不能相加,如p1+p2是无实际意义的.

## 通过指针引用数组元素

#### 引用数组元素有两种方法

- 下标法( 	a[i]	 )

- 指针法( 	\*(a+i)或\*(p+i),其中a是数组名,p是指向数组元素的指针变量.其初值为p=a;	 )

##### 有一个整型数组a,有10个元素,要求输出数组中的全部元素.

1)下标法:

```c
#include<stdio.h>

int main()
{
    int i, a[10];
    printf("please enter 10 integer numbers:");
    for (i = 0; i < 10; i++)
        scanf("%d", &a[i]);
    for (i = 0; i < 10; i++)
        printf("%d", a[i]);
    printf("\n");
    return 0;
}
```

2)通过数组名计算数组元素地址,找出元素的值

```c
#include<stdio.h>

int main()
{
    int i, a[10];
    printf("please enter 10 integer numbers:");
    for (i = 0; i < 10; i++)
        scanf("%d", &a[i]);
    for (i = 0; i < 10; i++)
        printf("%d\t", *(a + i));
    printf("\n");
    return 0;
}
```

3)用指针变量指向数组元素

```c
#include<stdio.h>

int main()
{
    int a[10], *p;
    printf("please enter 10 integer numbers:");
    for (p = a; p < (a + 10); p++)
        scanf("%d", p);
    for (p = a; p < (a + 10); p++)
        printf("%d\t", *p);
    printf("\n");
    return 0;
}
```

###### 结论

- 第1和2种方法执行效率是相同的. 	`在编译时,对数组元素a[i]就是按*(a+i)处理的`

- 第3种方法比第1和2种方法,用指针变量直接指向元素,不必每次都重新计算地址,像p++这样的自加操作是比较快的.这种有规律地改变地址值(p++)能大大提高效率.

> 多次使用指针变量时,应注意指针变量的位置,每次执行后可使指针变量重新指向数组a.

### 用数组名作函数参数

> 可以用数组名作函数的参数.

如:

```c
#include<stdio.h>

int main()
{
    void fun(int arr[], int n);
    int array[10];
    fun(array, 10);
    return 0;
}

void fun(int arr[], int n)
{
}
```

C编译时是将形参数组名作为指针变量来处理的.

```c
void fun(int arr[], int n)
等同于
void fun(int *arr, int n)
```

:eight_pointed_black_star:由于形参数组名arr接收了实参数组首元素a[0]的地址.所以用数组名参数时,**形参数组中各元素的值发生变化,实参数组元素的值也会发生变化.**

##### 将数组a中n个整数按相反顺序存放.

```c
#include<stdio.h>

int main()
{
    void inv(int [], int);
    int i, a[10];
    printf("please enter original array:\n");
    for (i = 0; i < 10; ++i)
        scanf("%d", &a[i]);
    inv(a, 10);
    printf("The array has been inverted:\n");
    for (i = 0; i < 10; ++i)
        printf("%d\t", a[i]);
    return 0;

}

void inv(int arr[], int n)
{
    int i, j,temp,m=(n-1)/2;
    for (i = 0; i < m; ++i)
    {
         j = n - 1 - i;
        temp = arr[j];
        arr[j] = arr[i];
        arr[i] = temp;
    }
}
```

指针变量作形参：

```c
#include<stdio.h>

int main()
{
    void inv(int [], int);
    int i, a[10];
    printf("please enter original array:\n");
    for (i = 0; i < 10; ++i)
        scanf("%d", &a[i]);
    inv(a, 10);
    printf("The array has been inverted:\n");
    for (i = 0; i < 10; ++i)
        printf("%d\t", a[i]);
    return 0;

}

void inv(int *arr, int n)
{
    int *p, *i, *j, temp, m = (n - 1) / 2;
    i = arr;        //头部的指针位置
    j = arr + n - 1;//末尾的指针位置
    p = arr + m;    //中值的指针位置
    for (; i <= p; ++i, j--)
    {
        temp = *j;
        *j = *i;
        *i = temp;
    }
    return;
}
```

#### 归纳分析

如果有一个实参数组,要想在函数中改变此数组中的元素的值,实参与形参的对应关系有:

- 形参和实参都用数组名.

  ```c
  int main()
  {
      int a[10];
      ...
      f(a, 10);
  
  }
  
  int f(int x[], int n)
  {
      ...
  }
  
  
  ```

- 实参用数组名,形参用指针变量

  ```c
  int main()
  {
      int a[10];
      ...
      f(a, 10);
  
  }
  
  int f(int *x, int n)
  {
      ...
  }
  
  ```

- 实参形参都是用指针变量

  ```c
  int main()
  {
      int a[10],*p=a;
      ...
      f(p, 10);
  
  }
  
  int f(int *x, int n)
  {
      ...
  }
  
  ```

- 实参用指针变量,形参用数组名.

  ```c
  int main()
  {
      int a[10],*p=a;
      ...
      f(p, 10);
  
  }
  
  int f(int x[], int n)
  {
      ...
  }
  
  ```

  

##### 用指针方法对10个整数按由大到小顺序排序

```c
#include<stdio.h>

int main()
{
    void sort(int [], int);
    int i, a[10];
    printf("please enter original array:\n");
    for (i = 0; i < 10; ++i)
        scanf("%d", &a[i]);
    sort(a, 10);
    printf("The array has been sorted:\n");
    for (i = 0; i < 10; ++i)
        printf("%d\t", a[i]);
    return 0;
}

void sort(int arr[], int len)
{
    int i, j, temp, max;
    for (i = 0; i < len - 1; ++i)
    {
        max = i;
        for (j = i + 1; j < len; ++j)
        {
            if (arr[j] > arr[max])
                max = j;
            if (max != i)
            {
                temp = arr[i];
                arr[i] = arr[max];
                arr[max] = temp;
            }
        }
    }
}
```

## 通过指针指向多维数组

#### 多维数组的地址

a[0]表示一维数组a[0]第0列元素的地址，即&a\[0]\[0].

a[0]+1表示a数组0行1列. 

a[0]与*(a+0)等价，a[1]和\*(a+1)等价，

> a[i]和*(a+i)等价

- 如果a是一维数组名，则a[i]表示a数组序号为i的元素的存储单元。
- 但如果a是二维数组，则a[i]是一维数组名，它只是一个地址，并不代表一个存储单元，也不代表存储单元的值(如同一维数组名只是一个指针变量一样)

> - 二维数组(如a)是指向行(一维数组)的。因此a+1的“1”代表一行中全部元素所占的字节数。a[0]+1中的1代表一个a元素所占的字节数。
>
> **在指向行的指针前面加一个*，就转换为列的指针。**
>
> **反之，在列指针前面加一个&，就转换为行的指针**
>
> - 一维数组名(如a[0],a[1])是指向列元素的。

```c
#include<stdio.h>

int main()
{
    int a[3][4] = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23};
    printf("%d,%d\n", a, *a);           //0行的初始地址,0行0列的元素地址
    printf("%d,%d\n", a[0], *(a + 0));  //0行0列的元素地址
    printf("%d,%d\n", &a[0], &a[0][0]); //0行起始地址,0行0列的元素地址
    printf("%d,%d\n", a[1], a + 1);     //1行0列的元素地址,1行起始地址
    printf("%d,%d\n", &a[1][0], *(a + 1) + 0);//1行0列的元素地址
    printf("%d,%d\n", a[2], *(a + 2));  //2行0列的元素地址
    printf("%d,%d\n", &a[2], a + 2);    //2行的起始地址
    printf("%d,%d\n", a[1][0], *(*(a + 1) + 0));//1行0列的元素的值
    printf("%d,%d\n", *a[2], *(*(a + 2) + 0));//2行0列的元素的值
    return 0;
}

```

### 指向多维数组的指针变量

#### 指向数组元素的指针变量

##### 有一个3×4的二维数组，要求用指向元素的指针变量输出二维数组各元素的值

```c
#include<stdio.h>

int main()
{
    int a[3][4] = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23};
    int *p;
    for (p = a[0]; p < a[0] + 12; ++p)
    {
        if ((p - a[0]) % 4 == 0)	//p移动四次后换行
            printf("\n");
        printf("%d\t", *p);
    }
    printf("\n");
    return 0;
}

```

- 计算a\[i][j]在数组中的相对位置：

  i*m+j(m为二维数组的列数，二维数组大小为n×m)

  如：

  在一个3×4的二维数组中，a\[2][3]对a\[0][0]的相对位移量为2*4+3=11元素；

  如果一个元素占4个字节，则a\[2][3]对a\[0][0]的地址差为11*4=44字节。

  若开始时指针变量p指向a[0\][0],a[i\][j]的地址为"`&a[0]\[0]+(i*m+j)`或`p+(i*m+j)`".

#### 指向由m个元素组成的一维数组的指针变量

##### 输出二维数组任一行任一列元素的值

```c
#include<stdio.h>

int main()
{
    int a[3][4] = {1, 3, 5, 7,
                   9, 11, 13, 15,
                   17, 19, 21, 23};
    int (*p)[4], i, j;
    p = a;
    printf("please enter row and colum:");
    scanf("%d,%d", &i, &j);
    printf("a[%d,%d]=%d\n", i, j, *(*(p + i) + j));
    printf("\n");
    return 0;
}
```

` int (*p)[4]`表示定义p为一个指针变量，它指向包含4个整型元素的一维数组.

p的值是该一维数组的起始地址.虽然这个地址(指纯地址)与该一维数组首元素的地址相同,但它们的基类型不同.

##### 分析下列程序

```c
#include<stdio.h>

int main()
{
    int a[4] = {1, 3, 5, 7};
    int (*p)[4];
    p = &a;
    printf("%d\n", (*p)[3]);
    return 0;
}
```

注意,` p = &a;`不应写成` p = a;`

因为这样写表示p的值是&a[0],指向首元素a[0].

` p = &a;`表示p指向一维数组(行)，(*p)[3]是p指向的行中序号为3的元素.

> 要注意指针变量的类型,从`int (*p)[4];`可以看到,p的类型不是`int *`型,而是`int(*)[4]`.
>
> p被定义为指向一维整型数组的指针变量,一维数组有4个元素,因此p的基类型是一维数组,其长度是16字节.

### 用指向数组的指针作函数参数

可以有两种方法:

- 用指向变量的指针变量
- 用指向一维数组的指针变量

##### 有一个班,3个学生,各学4门课,计算总平均分数以及第n个学生的成绩.

```c
#include<stdio.h>

int main()
{
    void average(float *, int);
    void search(float (*p)[4], int);
    float score[3][4] = {1, 3, 5, 7,
                         9, 11, 13, 15,
                         17, 19, 21, 23};
    average(*score, 12);//*转换为列指针变量
    search(score, 2);
    return 0;
}

void average(float *p, int n)
{
    float *p_end;
    float sum = 0, aver;
    p_end = p + n - 1;//指向最后一个元素
    for (; p <= p_end; p++)
        sum += (*p);
    aver = sum / n;
    printf("%5.2f\n", aver);
}

void search(float (*p)[4], int n)
{
    int i;
    printf("the score of No.%d are:\n", n);
    for (i = 0; i < 4; ++i)
        printf("%5.2f\n", *(*(p + n) + i));
}
```

##### :eight_pointed_black_star:实参和形参如果是指针类型，应当注意它们的基类型必须一致.

不应把*int型的指针(即数组元素的地址)传给int(\*)[4]型(指向一维数组)的指针变量,反之亦然.

##### 查找有一门以上课程不及格的学生,输出他们全部课程的成绩

```c
#include<stdio.h>

int main()
{
//    查找有一门以上课程不及格的学生,输出他们全部课程的成绩
    void search(float (*p)[4], int);
    float score[3][4] = {1, 3, 5, 7,
                         9, 11, 13, 15,
                         17, 19, 21, 23};
    search(score, 3);
    return 0;
}

void search(float (*p)[4], int n)
{
    int i, j, flag;
    for (j = 0; j < n; ++j)
    {
        flag = 0;
        for (i = 0; i < 4; ++i)
            if (*(*(p + j) + i) < 60) flag = 1;
        if (flag == 1)
        {
            printf("No.%d fails,his scores are:\n", j + 1);
            for (i = 0; i < 4; ++i)
                printf("%5.2f\t", *(*(p + j) + i));// score[j][i]
            printf("\n");
        }
    }
}

```

## 通过指针引用字符串

#### 字符串的引用方法

- 用字符数组存放一个字符串，可以通过数组名和下标引用字符串中一个字符，也可以通过数组名和格式声明“%s”输出该字符串.

  ```c
  #include<stdio.h>
  
  int main()
  {
      char string[] = "I Love China";
      printf("%s\n", string);
      printf("%c\n", string[7]); // string[7]=*(string+7)
      return 0;
  }
  
  ```

- 用字符指针变量输出一个字符串常量,通过字符指针变量引用字符串常量.

  ```c
  #include<stdio.h>
  
  int main()
  {
      char *string = "I Love China!";
      printf("%s\n", string);
      return 0;
  }
  
  ```

  > 对字符指针变量string初始化,实际上是把字符串第1个元素的地址(即存放字符串的字符数组的首元素地址)赋给指针变量string,使string指向字符串的第1个字符,由于字符串常量"I Love China!"已由系统分配在内存中连续的14个字节中,因此,string就指向了该字符串的第一个字符.

  可以对指针变量再赋值;

  ```c
  char *string = "I Love China!";
  string = "I'm a student."
  
  ```

  可以通过字符指针变量输出它所指向的字符串

  ```c
  printf("%s\n", string);
  
  ```

#### 用`%s`能对一个字符串进行整体的输入输出.

> 字符数组,区别于数值型数组(int[ ] a)

`%s`是输出字符串时所用的格式符.在输出项中给出字符指针变量名string,则系统会输出string所指向的字符串第1个字符,然后自动使string加1,使之指向下一个字符,在输出字符...直到遇到字符串结束标志`'\0'`为止.

注意:在内存中,字符串的最后被自动加了一个`'\0'`.因此在输出时能确定输出的字符到何时结束.

##### 将字符串a复制为字符串b,然后输出字符串b

```c
#include<stdio.h>

int main()
{
    char a[] = "I am a student", b[20];
    int i;
    for (i = 0; *(a + i) != '\0'; ++i)
        *(b + i) = *(a + i);
    *(b + i) = '\0';
    printf("string a is:%s\n", a);
    printf("string b is:\n");
    for (i = 0; *(b + i) != '\0'; ++i)
        printf("%c", b[i]);
    printf("\n");
    return 0;
}

```

用指针变量:

```c
#include<stdio.h>

int main()
{
    char a[] = "I am a boy", b[20], *p1, *p2;
    p1 = a;
    p2 = b;
    for (; *p1 != '\0'; ++p1, ++p2)
        *p2 = *p1;
    *p2 = '\0';
    printf("string a is:%s\n",a);
    printf("string b is:%s\n",b);
    printf("\n");
    return 0;
}

```

### 字符指针作函数参数

> 如果想把一个字符串从一个函数“传递”到另一函数，可以用地址传递的办法，即用字符数组名作参数，也可以用字符指针变量作参数。在被调用的函数中可以改变字符串的内容，在主调函数中可以引用改变后的字符串。

##### 用函数调用实现字符串的复制

1)用字符数组名作函数参数

```c
#include<stdio.h>

int main()
{
    void copy_string(char from[], char to[]);
    char a[] = "I am a teacher.";
    char b[] = "You are a student.";
    printf("string a:%s\nstring b:%s\n", a, b);
    printf("copy string a to string b:\n");
    copy_string(a, b);
    printf("string a:%s\nstring b:%s\n", a, b);
    return 0;
}

void copy_string(char from[], char to[])
{
    int i;
    while (from[i] != '\0')
    {
        to[i] = from[i];
        i++;
    }
    to[i] = '\0';
}

```

> 复制后的数组仍存在没有被覆盖的值(`t`, `. `,` \0`);
>
> 用%s格式输出时,遇到第一个`\0`后面的字符就不会输出了.
>
> 如果用%c逐个字符输出是可以输出后面这些字符的.

2)用字符型指针变量作实参

```c
#include<stdio.h>

int main()
{
    void copy_string(char from[], char to[]);
    char a[] = "I am a teacher.";
    char b[] = "You are a student.";
    char *from = a;
    char *to = b;
    printf("string a:%s\nstring b:%s\n", a, b);
    printf("copy string a to string b:\n");
    copy_string(from, to);
    printf("string a:%s\nstring b:%s\n", a, b);
    return 0;
}

void copy_string(char from[], char to[])
{
    int i;
    while (from[i] != '\0')
    {
        to[i] = from[i];
        i++;
    }
    to[i] = '\0';
}
```

3)用字符指针变量作形参和实参

```c
#include<stdio.h>

int main()
{
    void copy_string(char from[], char to[]);
    char *a = "I am a teacher.";
    char b[] = "You are a student.";
    char *p = b;
    printf("string a:%s\nstring b:%s\n", a, b);
    printf("copy string a to string b:\n");
    copy_string(a, p);
    printf("string a:%s\nstring b:%s\n", a, b);
    return 0;
}

void copy_string(char *from, char *to)
{
    for (; *from != '\0'; ++from,++to)
    {
        *to = *from;
    }
    *to = '\0';
}
//精简
void copy_string(char *from, char *to)
{
    while ((*to = *from) != '\0')
    {
        ++from, ++to;
    }
    *to = '\0';
}
//再精简
void copy_string(char *from, char *to)
{
    while ((*to++ = *from++) != '\0');
    *to = '\0';
}
//
void copy_string(char *from, char *to)
{
    while (*from != '\0')
    {
        *to++ = *from++;
    }
    *to = '\0';
}
// ASCII码
void copy_string(char *from, char *to)
{
    while (*from)
    {
        *to++ = *from++;
    }
    *to = '\0';
}
//还可以简化为
	while (*to++ = *from++);
	等价于
	while ((*to++ = *from++) != '\0');
//for
	for (; *to++ = *from++;);
	或者
    for (; (*to++ = *from++)!='\0';);
```

也可以使用字符数组名作函数形参，在函数中另定义两个指针变量p1，p2.函数copy_string可写为

```c
void copy_string(char from[], char to[])
{
    char *p1, *p2;
    p1 = from;
    p2 = to;
    while ((*p2++ = *p1++) != '\0');
}

```

### 使用字符指针变量和字符数组的比较

- 字符数组由若干个元素组成，每个元素中放一个字符，而字符指针变量中存放的是地址(字符串第1个字符的地址),绝不是将字符串放到字符指针变量中.

- 赋值方式. 可以对字符指针变量赋值,但不能对数组名赋值

- 初始化的含义.

  数组可以在定义时对各元素赋初值,但不能用赋值语句对字符数组中的全部元素整体赋值

- 存储单元的内容. 编译时为字符数组分配若干存储单元,以存放各元素的值,而对字符指针变量,只分配一个存储单元.

  如果定义了字符数组,但未对它赋值,这时数组中的元素的值是不可预料的.

  如果定义了字符指针变量,应当及时把一个字符变量(或字符数组元素)的地址赋给它，使它指向一个字符型数据，如果未对它赋予一个地址值，它并未具体指向一个确定的对象，此时如果向该指针变量所指向的对象输入数据，可能会出现严重的后果：

  ```c
  int main()
  {
      char *a;
      scanf("%s", a);
      return 0;
  }
  //危险的!
  
  ```

- 指针变量的值是可以改变的,而字符数组名代表一个固定的值(数组首元素的地址)不能改变.

  ```c
  #include<stdio.h>
  
  int main()
  {
      char *a = "I love China!";
      a = a + 7;
      printf("%s\n", a);
      return 0;
  }
  
  ```

- 引用数组元素

  对字符数组可以使用下标法引用一个数组元素,也可以用地址法(`*(a+5)`).

  对字符指针变量p使它指向数组a的首元素,可以使用指针变量带下标法(p[5])引用一个数组元素,也可以用地址法.

- 用指针变量指向一个格式字符串,可以用它代替printf函数中的格式字符串

  ```c
      char *format;
      format = "a=%d,b=%f\n";
      printf(format, a, b);
  
  ```

  这种printf函数称为**可变格式输出函数**.

## 指向函数的指针

每次调用函数时都会从函数分配的内存空间的起始地址开始执行此段函数代码。

**函数名代表函数的起始地址.**

可以定义一个指向函数的指针变量,用来存放某一函数的起始地址.这就意味着此指针变量指向该函数.

```c
int (*p)(int,int);

```

### 用函数指针变量调用函数.

##### 用函数求a和b中的大者.

```c
#include<stdio.h>

int main()
{
    int max(int, int);
    int (*p)(int, int);
    int a, b, c;
    p = max;
    printf("please enter a and b:");
    scanf("%d,%d", &a, &b);
    c = (*p)(a, b);
    printf("max is:%d", c);
    return 0;
}

int max(int x, int y)
{
    return x > y ? x : y;
}

```

#### 怎么定义和使用指向函数的指针变量

```c
类型名 (*指针变量名)(函数参数表列)

```

> 类型名是函数返回值类型

对指向函数的指针变量不能进行算术运算.如p+n,p++,p--等运算都是无意义的.

##### 输入两个整数,让用户选择1或2,选1时调用max函数,输出二者中的大数,选2时调用min函数,输出二者中的小数.

```c
#include<stdio.h>

int main()
{
    int max(int, int);
    int min(int, int);
    int (*p)(int, int);
    int a, b, c, d;
    printf("please enter two integer:\n");
    scanf("%d,%d", &a, &b);
    printf("please choose 1 or 2:\n");
    scanf("%d", &c);
    if (c == 1)
        p = max;
    else if (c == 2)
        p = min;
    d = (*p)(a, b);
    if (c == 1)
        printf("max is:%d", d);
    else
        printf("min is:%d", d);
    return 0;
}

int max(int x, int y)
{
    return x > y ? x : y;
}

int min(int x, int y)
{
    return x < y ? x : y;
}

```

### 用指向函数的指针作函数参数

> 指向函数的指针变量的一个重要用途是把函数的入口地址作为参数传递到其他函数.

##### 有两个整数a和b,由用户输入1,2和3.如输入1,程序就给出a和b中的大者.输入2,程序就给出a和b中的小者.输入3,则求a与b之和.

```c
#include<stdio.h>

int main()
{
    int max(int, int);
    int min(int, int);
    int sum(int, int);
    int fun(int, int, int (*p)(int, int));
    int a, b, c, d;
    printf("please enter two integer:\n");
    scanf("%d,%d", &a, &b);
    printf("please choose 1 , 2 or 3:\n");
    scanf("%d", &c);
    if (c == 1)
        fun(a, b, max);
    else if (c == 2)
        fun(a, b, min);
    else if (c == 3)
        fun(a, b, sum);
    return 0;
}

int fun(int x, int y, int (*p)(int, int))
{
    int result;
    result = (*p)(x, y);
    printf("%d\n", result);
}

int max(int x, int y)
{
    printf("max=");
    return x > y ? x : y;
}

int min(int x, int y)
{
    printf("min=");
    return x < y ? x : y;
}

int sum(int x, int y)
{
    printf("sum=");
    return x + y;
}
```

### 返回指针值的函数

定义返回指针值函数的原型的一般形式为:

```c
类型名 *函数名 (函数参数表列)
```

##### 有a个学生,每个学生有b门课程的成绩,要求在用户输入学生序号以后,能输出该学生的全部成绩.用指针函数实现

```c
#include<stdio.h>

int main()
{
    float score[][4] = {{60, 70, 80, 90},
                        {56, 74, 45, 86},
                        {65, 88, 67, 99}};
    float *search(float (*pointer)[4], int n);
    float *p;
    int i, k;
    printf("enter number of student:\n");
    scanf("%d", &k);
    p = search(score, k);
    for (i = 0; i < 4; ++i)
    {
        printf("%5.2f\t", *(p + i));//输出  score[k][0]~score[k][3];
    }
    return 0;
}

float *search(float (*pointer)[4], int n)
{
    float *pt;
    pt = *(pointer + n); //pt的值是&score[k][0]
    return pt;
}
```

##### 找出其中有不及格的课程的学生及其学生号.

```c
#include<stdio.h>

int main()
{
    float score[][4] = {{60, 70, 80, 90},
                        {56, 74, 45, 86},
                        {65, 88, 67, 99}};
    float *search(float (*pointer)[4]);
    float *p;
    int i, j;
    for (i = 0; i < 3; ++i)
    {
        p = search(score + i);
        if (p == *(score + i))
        {
            printf("No.%d score:", i);
            for (j = 0; j < 4; ++j)
                printf("%5.2f", *(p + j));
            printf("\n");
        }
    }
}

float *search(float (*pointer)[4])
{
    int i = 0;
    float *pt;
    pt = NULL;
    for (; i < 4; ++i)
    {
        if (*(*(pointer + i)) < 60)
            pt = *pointer;
    }
    return pt;
}
```

---

## 指针数组和多维指针

> 一个数组，若其元素均为指针类型数据，称为指针数组.

定义一个指针数组

```c
类型名 *数组名[数组长度];

```

```c
int *p[4];

```

##### 将若干字符串按字母顺序(由小到大)输出.

```c
#include <stdio.h>
#include <string.h>

int main()
{
    void sort(char *name[], int n);
    void print(char *name[], int n);
    char *name[] = {"Follow me", "BASIC", "Great Wall", "FORTRAN", "Computer design"};
    int n = 5;
    sort(name, n);
    print(name, n);
    return 0;
}

void sort(char *name[], int n)
{
    char *temp;
    int i, j, k;
    for (i = 0; i < n - 1; i++)
    {
        k = i;
        for (j = i + 1; j < n; j++)
            if (strcmp(name[k], name[i]) > 0)
                k = j;
        if (k != i)
        {
            temp = name[i];
            name[i] = name[k];
            name[k] = temp;
        }
    }
}

void print1(char *name[], int n)
{
    int i;
    for (i = 0; i < n; i++)
        printf("%s\n", name[i]);
}
//也可以改写成
void print(char *name[], int n)
{
    int i = 0;
    char *p;
    p = name[0];
    while (i < n)
    {
        p = *(name + i++); //   name[i];    i++;
        printf("%s\n", p);
    }
}
```

### 指向指针数据的指针变量

#### 定义

```c
char **p;
```

*运算符的结合性是从右到左的.	\*(\*p).

也就是说p指向一个字符指针变量(这个字符指针变量指向一个字符型数据),如果引用*p,就得到p所指向的字符指针变量的值.

##### 使用指向指针数据的指针变量

```c
#include <stdio.h>

int main()
{
    char *name[] = {"Follow me", "BASIC", "Great Wall", "FORTRAN", "Computer design"};
    char **p;
    int i;
    for (i = 0; i < 5; i++)
    {
        p = name + i;
        printf("%s\n", *p);
    }

    return 0;
}
```

##### 有一个指针数组,其元素分别指向一个**整型数组**的元素,用指向指针数据的指针变量,输出整型数组各元素的值.

```c
#include <stdio.h>

int main()
{
    int a[5] = {1, 3, 5, 7, 9};
    int *num[5] = {&a[0], &a[1], &a[2], &a[3], &a[4]};
    int **p, i;
    p = num;
    for (i = 0; i < 5; i++)
    {
        printf("%d\n", **p);
        p++;
    }
    printf("\n");
    return 0;
}

```

#### 间接访问

在一个指针变量中存放一个目标变量的地址，这就是“**单机间址**”.

指向指针数据的指针用的是“**二级间址**”.

间址方法可以延伸到更多的级,即**多重指针**.

### 指针数组作main函数的形参

main可以用参数:

```c
int main(int argc,char *argv[])
```

> 其中，argc和argv就是main函数的形参，它们就是程序的"命令行参数".
>
> argc是参数的个数,argv是参数向量,它是一个* char指针数组,数组中每一个元素(其值为指针)指向命令行中的一个字符串的首字符.

用带参数的main函数,其第一个形参必须是int型,用来接收形参个数,第二个参数必须是字符指针数组,用来接收从操作系统命令行传来的字符串中首字母的地址.

在操作命令下,实参是和执行文件的命令一起给出的.例如在DOS,UNIX或Linux等系统的操作命令状态下,在命令行中包括了命令名和需要传给main函数的参数.

**命令行的一般形式为**

> 命令名	参数1 参数2···参数n
>
> 命令名和各参数之间用空格分隔.命令行是可执行文件名(此文件含main函数)
>
> 如:
>
> file1 China Beijing
>
> file1为可执行文件名(实际上,文件名应包含盘符,路径),China和Beijing是调用main函数时的实参.

- 文件名也作为一个参数.argc的值等于3(有3个命令行参数:file1,China,Beijing)

- 命令行参数必须都是字符串("file1","China","Beijing"都是字符串),这些字符串的首地址构成一个指针数组.

  指针数组argv中的元素argv[0]指向字符串"file1"的首字符(argv[0]的值是字符串"file1"的首地址).

名:file1的文件,它包含以下的main函数:

```c
#include <stdio.h>

int main(int argc, char *argv[])
{
    while (argc > 1)
    {
        ++argv;
        printf("%s\n", *argv);
        --argc;
    }
    return 0;
}

```

选择“工程”-“设置”-“调试”-“程序变量”命令，输入 China Beijing，再运行程序。

输出

```c
China
Beijing

```

改写:

```c
#include <stdio.h>

int main(int argc, char *argv[])
{
    while (argc-- > 1)
        printf("%s\n", *++argv);

    return 0;
}
```

许多操作系统提供了echo命令,它的作用是实现"参数回送",即将echo后面的各参数(各字符串)在同一行上输出.实现"参数回送"的C程序(文件名为echo.c)如下:

```c
#include <stdio.h>

int main(int argc, char *argv[])
{
    while (--argc > 0)									   //当命令行的参数多于1
        printf("%s%c\n", *++argv, (argc > 1) ? ' ' : '\n');//从第2个参数开始输出各字参数(字符串)
    return 0;
}
```

如果用UNIX系统的命令行输入:

```echo
$ ./echo Computer and C Language↙   //echo是可执行文件名.
```

会在显示屏上输出:

Computer and C Language

或者

```c
#include <stdio.h>

int main(int argc, char *argv[])
{
    int i;
    for (i = 1; i < argc; i++)
        printf("%s%c\n", argv[i], (argc > 1) ? ' ' : '\n');
    return 0;
}
```

# 动态内存分配与指向它的指针变量

#### 内存的动态分配

全局变量是分配在内存中的静态存储区的，非静态的局部变量(包括形参)是分配在内存中的动态存储区的,这个存储区是一个称为`栈`(stack)的区域.

C语言还允许建立内存动态分配区域,以存放一些临时用的数据,这些数据不必在程序的声明部分定义,也不必等到函数结束时才释放.而是需要时随时开辟,不需要时随时释放.这些数据是临时存放在一个特别的自由存储区.称为`堆`(heap)区.可以根据需要,向系统申请所需大小的空间.由于未在声明部分定义它们为变量或数组,因此不能通过变量名或数组名去引用这些数据,只能通过指针来引用.

### 怎么建立内存的动态分配

> #include <stdlib.h>

- 用malloc函数开辟动态存储区

  ```c
      void *malloc(unsigned int size);
  ```

  作用是在内存的动态存储区中分配一个长度为size的连续空间.形参size的类型为无符号整型(不允许为负数).此函数的值(返回值)是所分配区域的第一个字节的地址.或者说是一个指针型函数.

  ```c
  	malloc(100); //开辟100字节的临时分配域,函数值为其第1个字节的地址
  ```

  注意指针的基类型为void,即指针不指向任何类型的数据,只提供一个纯地址.如果此函数未能成功地执行(例如内存空间不足),则返回空指针(NULL).

- 用calloc函数开辟动态存储区

  ```c
      void *calloc(unsigned n,unsigned int size);
  ```

  在内存中动态地分配 num 个长度为 size 的连续空间，并将每一个字节都初始化为 0。所以它的结果是分配了 num*size 个字节长度的内存空间，并且每个字节的值都是0.

  这就是**动态数组**.函数返回值指向所分配域的第一个字节的指针;如果分配不成功,则返回NULL.

  ```c
  	p = calloc(50, 4);//开辟50×4个字节的临时分配域,把首地址赋给指针变量p
  
  ```

- 用realloc重新分配动态存储区.

  ```c
      void *realloc(void *p, unsigned int size);
  
  ```

  如果已经通过malloc函数或calloc函数获得乐动态空间,想改变大小,可以用realloc函数重新分配.

  用realloc函数将p所指向的动态空间的大小改变为size.p的值不变.p的值不变.如果重分配不成功,返回NULL.如:

  ```c
  	realloc(p,50);
  
  ```

- 用free函数释放动态存储区

  ````c
      void free(*p);
  
  ````

  其作用是释放指针变量p所指向的动态空间,使这部分空间能重新被其他变量使用.

  p应是最近一次调用calloc或malloc函数时得到的函数返回值.

  ```c
  	free(p);//释放指针变量p所指向的已分配的额动态空间
  
  ```

  > free函数无返回值.

### void指针类型

可以定义一个基类型为void的指针变量(即void*型变量).

"指向void类型"理解为 指向空类型或"不指向确定的类型"的数据.

> 在将它的值赋给另一指针变量时由系统对它进行类型转换.使之适合于被赋值的变量的类别

```c
	int a = 3;         //定义a为整型变量.
    int *p1 = &a;      //p1指向int型变量
    char *p2;          //p2指向char型变量
    void *p3;          //p3为无类型指针变量(基类型为void型)
    p3 = (void *)p1;   //将p1的值转换为void *类型,然后赋值给p3
    p2 = (char *)p3;   //将p3的值转换为char *类型,然后赋值给p2
    printf("%d", *p1); // 3
    p3 = &a;
    printf("%d", *p3); //非法,p3是无指向的,不能指向a
    return 0;
```

> 在这种无指向的地址所标志的存储单元中不能存储任何数据的,无法通过这种地址对内存存取数据.

**什么情况用到这种地址?**

这种情况是在调用动态存储分配函数(如maloc,caloc,realoc函数)时出现的.

用户用这些函数开辟动态存储区,显然希望获得此动态存储区的起始地址,以便利用该动态存储区.



在以前的C版本(包括C89)中,函数的返回地址一律指向字符型数据,即得到char*型指针.

malloc函数的原型为:

```c
	char *malloc(unsigned int sise);
```

人们开辟的动态存储区并不是一定用来存放字符型数据的,例如想用来存放一批整型数据.为此,在向该存储区存放数据前就需要进行地址的类型转换:

```c
	int *pt;
	pt = (int *)malloc(100);
```

系统会将指向字符数据的指针转换为指向整型数据的指针,然后赋给pt.这样pt就指向存储区的首字节,可以通过pt对该动态存储区进行存取操作.

> 上面的类型转换只是产生一个临时的中间值赋给了pt,但没有改变malloc函数本身的类型.

C99修改为:返回void*指针,这种指针不指向任何类型的数据,只提供一个纯地址.

```c
    int *pt;
    pt = (int *)malloc(100); //malloc(100)是void类型,把它转换为int*型
    //等价于
    pt = malloc(100); //自动进行类型转换
```

##### 建立动态数组,输入5个学生的成绩,另外用一个函数检查其中有无低于60分的,输出不合格的成绩.

```c
#include <stdio.h>

int main()
{
    void check(int *p);
    int *p1, i;
    p1 = (int *)malloc(5 * sizeof(int));
    for (i = 0; i < 5; i++)
        scanf("%d", p1 + i);
    check(p1);
    return 0;
}
void check(int *p)
{
    int i;
    printf("They are fail:");
    for (i = 0; i < 5; i++)
        if (p[i] < 60)
            prtinf("%d", p[i]);
    printf("\n");
}
```

