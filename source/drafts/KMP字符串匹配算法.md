---
title: kmp-字符串匹配算法
tags: [ algorithm ]
mathjax: true
date: 2024-02-27 01:50:06
draft: false
slugs: kmp-string-matching-algorithm
---

## 1. 算法简介

KMP（Knuth-Morris-Pratt）算法是一种改进的字符串搜索算法，由Donald Knuth、Vaughan Pratt 和 James H. Morris 在 1970 年提出。与传统的暴力搜索不同，KMP 算法在模式字符串(搜索词)中预处理得到一个前缀函数（或部分匹配表），从而在搜索过程中避免了大量的回溯操作，极大地提高了搜索效率。

## 2. 前缀函数与部分匹配表

前缀函数 $p_i$ 定义为：对于模式字符串 `P` 的任意非空前缀 $P[0...i-1]$
 ，$p_i[i]$ 是最长的相等真前缀与真后缀的长度。基于此定义，我们可以构建模式字符串的 **部分匹配表**。

例如，对于模式字符串 `P = "ABCDABD"`：

| 搜索词     | A   | B   | C   | D   | A   | B   | D   |
| ---------- | --- | --- | --- | --- | --- | --- | --- |
| 部分匹配值 | 0   | 0   | 0   | 0   | 1   | 2   | 0   |

> 详细的，
> "A"的前缀和后缀都为空集，共有元素的长度为`0`；
>
> "AB"的前缀为[A]，后缀为[B]，共有元素的长度为`0`；
>
> "ABC"的前缀为[A, AB]，后缀为[BC, C]，共有元素的长度`0`；
>
> "ABCD"的前缀为[A, AB, ABC]，后缀为[BCD, CD, D]，共有元素的长度为`0`；
>
> "ABCDA"的前缀为[A, AB, ABC, ABCD]，后缀为[BCDA, CDA, DA, A]，共有元素为"A"，长度为`1`；
>
> "ABCDAB"的前缀为[A, AB, ABC, ABCD, ABCDA]，后缀为[BCDAB, CDAB, DAB, AB, B]，共有元素为"AB"，长度为`2`；
>
> "ABCDABD"的前缀为[A, AB, ABC, ABCD, ABCDA, ABCDAB]，后缀为[BCDABD, CDABD, DABD, ABD, BD, D]，共有元素的长度为`0`。
>

### 部分匹配表的实际作用

通过预先计算出的部分匹配表，解决字符串模式匹配中的无效回溯问题。在朴素的字符串匹配算法中，如果一个字符不匹配，则需要将模式串整体回退一位，重新开始比较。而KMP算法通过部分匹配表，可以在发生不匹配时，利用这部分信息直接跳过已知的匹配前缀，避免无谓的重复比较。

部分匹配表记录了模式串中每个位置i之前已经确定的最长相同前后缀长度。当匹配失败时，不需要移动文本串（主串），而是移动模式串到对应的部分匹配值所指示的位置继续进行比较，这样就可以大大提高字符串匹配的效率。

举个例子，假设我们有一个模式串 "ABCDABD" 及其部分匹配表 [0, 0, 1, 2, 3, 1, 0]：

当我们在文本串中搜索该模式串时：
假设当前已经匹配到 "ABCD" 和下一个字符不匹配时，按照朴素算法我们会退回模式串的第一个字符重新开始匹配。
而使用KMP算法和部分匹配表，我们可以得知当前位置 "D" 的部分匹配值是2，这意味着从模式串开头数到第4个字符（包括第4个字符“C”）为止的子串是一个与前面某段相同的后缀，因此我们可以直接将模式串向右滑动2位，对齐到 "AB" 开始继续匹配，而不是退回至开头。

## 3. KMP 算法实现

以下是 KMP 算法的 Python 实现，包括构建部分匹配表以及进行字符串匹配的过程：

```python
def build_prefix_table(pattern):
    prefix_table = [0] * len(pattern)
    k = 0

    for i in range(1, len(pattern)):
        while k > 0 and pattern[k] != pattern[i]:
            k = prefix_table[k - 1]
        
        if pattern[k] == pattern[i]:
            k += 1
        prefix_table[i] = k

    return prefix_table


def kmp_search(text, pattern):
    prefix_table = build_prefix_table(pattern)
    text_index = 0 # 文本串的匹配位置
    pattern_index = 0 # 模式串的匹配位置

    while text_index < len(text) and pattern_index < len(pattern):
        if pattern_index == -1 or text[text_index] == pattern[pattern_index]:
            text_index += 1
            pattern_index += 1
        else:
            pattern_index = prefix_table[pattern_index - 1]

    if pattern_index == len(pattern):
        return text_index - pattern_index  # 返回匹配开始的位置 = 已匹配的字符个数 - 已匹配的字符个数的对应的部分匹配值
    else:
        return -1  # 没有找到匹配项

# 示例使用
text = "ABC ABCDAB ABCDABCDABDE"
pattern = "ABCDABD"
print(kmp_search(text, pattern))  # 输出: 15
```

KMP 字符串匹配算法利用了模式字符串本身的性质，在实际应用中能够有效提高字符串匹配的速度，尤其在文本处理、数据压缩等领域有着广泛的应用。