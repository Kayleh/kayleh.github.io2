---
title: cycle structure programming
mathjax: false
date: 2020-10-26T01:16:57+08:00
tags: [C]
translate_title: cycle-structure-programming
---

# 循环结构体程序设计

### 用while语句实现循环

> while (表达式) 语句

##### 求1+2+3+....+100;

```c
#include<stdio.h>

int main()
{
    int i = 1;
    int sum = 0;
    while (i <= 100)
    {
        sum += i;
        i++;
    }
    printf("%d", sum);
    return 0;
}
```

### 用do...while语句实现循环

> do
>
> ​	语句
>
> while (表达式);

如:

```c
#include<stdio.h>

int main()
{
    int i = 1;
    do
    {
        printf("%d\n", i++);
    } while (i <= 100);
    return 0;
}
```

##### 求1+2+3+....+100;

```c
#include<stdio.h>

int main()
{
    int i = 1,sum = 0;
    do
    {
        sum += i;
        i++;
    } while (i <= 100);
    printf("%d", sum);
    return 0;
}
```

#### while和do...while的区别

do...while无论如何都会至少执行一次循环体

while只要不满足就不会执行循环体

### 用for语句实现循环

> for(循环变量赋初值;循环条件;循环变量增值)
>
> ​	语句

如:

for(i=1;i<=100;i++)

​	sum+=i;

### 循环的嵌套

### 改变循环的执行状态

#### 用break语句提前终止循环

在全系1000名学生中举行慈善募捐,当总数达到10万时就结束,统计此时捐款的人数以及平均每人捐款的数目.

```c
#include<stdio.h>

#define SUM 100000

int main()
{
    float amount, aver, total;
    int i;
    for (i = 1; i < 1000; i++)
    {
        printf("please enter amount:");
        scanf("%f", &amount);
        total += amount;
        if (total >= SUM)break;
    }
    aver = total / i;
    printf("num=%d\naver=%10.2f\n", i, aver);
    return 0;

}
```

break的作用就是使流程跳到循环体之外,接着执行循环体下面的语句.

#### 用continue语句提前结束本次循环

有时不希望终止整个循环的操作,而只希望提前结束本次循环,而接着执行下次循环.这时可以用continue语句

要求输出100~200的不能被3整除的数

```c
#include<stdio.h>

int main()
{
    int n;
    for (n = 100; n <= 200; n++)
    {
        if (n % 3 == 0)
            continue;
        printf("%d\t", n);
    }
    printf("\n");
    return 0;
}
```

