---
title: SparseArray
tags: [algorithm]
translate_title: sparsearray
date: 2020-05-07T21:28:41+08:00
---

## 稀疏数组

​																				**（稀疏数组）**



### 定义

##### 当一个数组中大部分的值未被使用，只有少部分的值的空间使用，造成了内存的浪费，这个时候就可以用到稀疏数组，保存需要的数据，节约内存空间。

当记录一个棋盘时：

![img](https://mmbiz.qpic.cn/mmbiz_png/LqMJZoibIrPzz08etWsVDczAaxvuTLF53AO9Y95X14hib9758qNT74snT2caWibZhtNQHCstK4KibDDibWcIxZhcPyQ/640?wx_fmt=png)

![img](https://mmbiz.qpic.cn/mmbiz_png/LqMJZoibIrPzz08etWsVDczAaxvuTLF53Lic6f7kA2vWzahAXd97hT2SjHxbZT4DociaLjYkS4q91sApHcibtMiaBNg/640?wx_fmt=png)

记录棋盘的位置，只有两个内容，其他未被使用没有意义的值浪费了内存空间

使用稀疏数组代替二维数组，第0行表示稀疏数组的总行，总列和所需内容的个数。

### 实现

```java
package com.kayleh.tmall.controller;

/**
 * @Author: Wizard
 * @Date: 2020/5/7 9:16
 */
public class SparseArray {
    public static void main(String[] args) {
        //创建一个二维数组
        //0:表示没有棋子 1表示黑子 2表示蓝子
        int chessArr[][] = new int[11][10];
        chessArr[1][2] = 1;
        chessArr[2][3] = 2;
        for(int[] row:chessArr){
            for(int data:row){
                System.out.printf("%d\t",data);
            }
            System.out.println();
        }

        int[][] array = getSparseArray(chessArr);
        System.out.println("-------");
        for(int i = 0 ; i< array.length;i++){
            System.out.printf("%d\t%d\t%d\t\n",array[i][0],array[i][1],array[i][2]);
        }
        System.out.println("--------");
        int[][] startArr = recovery(array);
        for(int[] row:startArr){
            for(int data:row){
                System.out.printf("%d\t",data);
            }
            System.out.println();
        }
    }

    /**
     * 将普通数组转换为稀疏数组
     * @param chessArr
     * @return
     */
    public static int[][] getSparseArray(int[][] chessArr){
        if(!checkIsRight(chessArr)){
            return null;
        }

        //1.拿到数组后 首先获取元素的个数,然后才能建立稀疏数组
        int sum = 0;
        for(int[] arr:chessArr){
            for(int i:arr){
                if(i != 0){
                    sum++;
                }
            }
        }

        //2.建立稀疏数组
        int[][] sparseArr = new int[sum+1][3];
        sparseArr[0][0] = chessArr.length; //行
        sparseArr[0][1] = chessArr[0].length;//列
        sparseArr[0][2] = sum; //元素个数

        //3.数组存放
        int count = 0;
        for(int i = 0; i <chessArr.length; i++ ){
            for(int j = 0; j <chessArr[i].length;j++ ){
                if(chessArr[i][j] != 0){
                    sparseArr[++count][0] = i;//行
                    sparseArr[count][1] = j;//列
                    sparseArr[count][2] = chessArr[i][j];
                }
            }
        }

        return sparseArr;
    }

    /**
     * 将稀疏数组转回普通数组
     * @param sparseArr
     * @return
     */
    public static int[][] recovery(int[][] sparseArr){
        if(!checkIsRight(sparseArr)){
            return null;
        }

        //获取原数组的 行数和列数 并创建原数组
        int arr[][] = new int[sparseArr[0][0]][sparseArr[0][1]];

        for(int i = 1; i < sparseArr.length;i++){
            arr[sparseArr[i][0]][sparseArr[i][1]] = sparseArr[i][2];
        }

        return arr;
    }

        
    public static boolean checkIsRight(int[][] arr){
        if(arr == null || arr.length <= 1 ){
            return false;
        }
        return true;
    }

}
```






