---
title: 「Github」CICD流水线-hexo自动发布到Pages服务
date: 2025-02-02 15:44:43
tags: [blog]
slugs: github-action-deploy
---

## 引言

以代码的编写到发布的过程，通常需要：

```text
1.创建、编写
2.build
3.发布到仓库
4.更新服务
```

在此流程中，存在很多重复的步骤（不重复的地方只有编写的内容）。
这些步骤不仅重复繁琐，还对本地环境的依赖比较强。要是有一种方式，可以自动完成这些步骤，那就太棒了。本文将介绍一种基于`Github Action`的自动化部署方案，并以`hexo`为例，实现从编写到发布，只需一个上传步骤，即可完成整个流程的快速发布。

## Github Action

### 是什么

`Github Action`是一个`持续集成`和`持续部署`（CI/CD）平台，它允许您定义在代码仓库中发生特定事件时运行的任务。且免费、与 GitHub 生态深度集成

> `持续集成`：频繁地（一天多次）将代码集成到主干。 每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。许多团队发现这种方法可以显著减少集成问题，并允许团队更快地开发高质量的软件。 这是持续交付和持续部署的基础。

### 如何使用

![https://docs.github.com/en/actions](https://img.shields.io/badge/Github%20Action-点击阅读官方文档-green)

官方文档中，有详细介绍，这里就不再赘述。

## 快速实战

这里以`hexo`为例，通过实战快速入门，实现自动化部署。

### 实现目的

从markdown编写到发布，只需一个上传步骤，即可完成整个流程的快速发布。

### 前置条件

- 需要的基础：GitHub 账号、仓库、基础命令行知识
- 环境准备：无需本地安装工具

### 步骤

#### 1.创建仓库

1. 登录GitHub账号，创建两个仓库

- `xxx.github.io`: 用于存放博客的静态资源，如`index.html`、`css`、`js`等，xxx为github用户名

- `blog`: 用于存放hexo博客的源代码

#### 2.构建Hexo

![https://hexo.io/docs/](https://img.shields.io/badge/Hexo-点击阅读官方文档-green)

把构建的hexo项目提交到`xxx`仓库中

git init
git checkout -b gh-pages
git add .
git commit -m "init"
git remote add origin https://github.com/Kayleh/kayleh.github.io.git
git push -u origin gh-pages --force #强制覆盖


#### 3.创建Github Action

返回到github，在`xxx`仓库中，找到 Settings->Pages->Build and deployment，将 source 选择为 GitHub Actions

随后，在提示
```
Use a suggested workflow, browse all workflows, or create your own.
```
中选择`create your own`

创建文件`.github/workflows/pages.yml`

```yml
name: Pages

on:
  push:
    branches:
      - gh-pages # 我们设置的分支是 gh-pages

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          # If your repository depends on submodule, please see: https://github.com/actions/checkout
          submodules: false #recursive
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          # Examples: 20, 18.19, >=16.20.2, lts/Iron, lts/Hydrogen, *, latest, current, node
          # Ref: https://github.com/actions/setup-node#supported-version-syntax
          node-version: "20.11.1"
      - name: Cache NPM dependencies
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
          restore-keys: |
            ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### 3.配置Github Secrets

> 为了安全，我们需要配置Github Secrets，用于存放私密信息，如ssh key等

1.先生成ssh key

```bash
ssh-keygen -t rsa -b 4096 -C "你的 GitHub 邮箱" -f hexo_deploy_key
```

2.在生成的文件夹中找到id_rsa.pub，复制内容，以此为ssh key

3.在Github仓库的Settings->Secrets中添加DEPLOY_KEY，值为ssh key，用于提交代码,部署到Github Pages


到这里，我们就可以通过push代码，自动部署到Github Pages了