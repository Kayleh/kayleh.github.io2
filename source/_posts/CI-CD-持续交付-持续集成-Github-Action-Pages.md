---
title: CI/CD 持续交付&持续集成(Github Action Pages)
tags: [project, github]
poster:
  color: '#1e90ff'
date: 2023-06-19 00:28:17
translate_title: ci-cd-continuous-delivery-continuous-integration-github-action-pages
---

#### 1.什么是持续集成 、交付、部署

> 持续集成是指，频繁地（一天多次）将代码集成到主干。 每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。许多团队发现这种方法可以显著减少集成问题，并允许团队更快地开发高质量的软件。 这是持续交付和持续部署的基础。

#### 2.使用Github Action

> GitHub Actions 是一个强大的持续集成/持续交付（CI/CD）工具，它可以与 GitHub 存储库集成，帮助自动化软件开发工作流程。

###### 本文从[本站](https://kayleh.top)部署出发，介绍如何使用 Github Action 实现 CI/CD

#### 使用前准备

1. [Github](https://github.com) 账号
2. 配置了[Pages](https://pages.github.com/) 仓库的Github

#### 开始

本站使用的是nodejs框架[hexo](https://hexo.io/zh-cn/)，所以本文以hexo为例.

框架的源代码放在source仓库，生成的静态文件放在public仓库，所以我们需要在source仓库的.github/workflows/目录下创建一个yml文件，文件名随意，本文以hexo.yml为例

> 也可以放在同一个仓库，即源代码放到master分支，生成的静态文件放在gh-pages分支，在master分支的.github/workflows/目录下创建yml文件

```yml
name: auto deploy

on:
  workflow_dispatch: # 手动触发
  push: # push 时触发

jobs:
  build:
    runs-on: ubuntu-latest # 运行环境为最新版 Ubuntu
    name: auto deploy
    steps:
      # 1. 获取源码
      - name: Checkout
        uses: actions/checkout@v3 # 使用 actions/checkout@v3
        with: # 条件
          submodules: false # Checkout private submodules(themes or something else). 当有子模块时切换分支？
      # 2. 配置环境
      - name: Setup Node.js 16.15.0
        uses: actions/setup-node@master
        with:
          node-version: "16.15.0"
      - name: '缓存依赖环境'
        uses: actions/cache@v3
        id: cache
        with:
          path: node_modules
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      - name: '安装依赖环境'
        if: steps.cache.outputs.cache-hit != 'true'
        run: npm ci
      # 3. 生成静态文件
      - name: Generate Public Files
        run: |
          npm i
          npm install hexo-cli -g
          hexo clean && hexo generate
          # 配置 SSH
          mkdir -p ~/.ssh && echo "${{ secrets.DEPLOY_KEY }}" > ~/.ssh/id_rsa && chmod 600 ~/.ssh/id_rsa  && ssh-keyscan github.com >> ~/.ssh/known_hosts
          # 配置 Git
          git config --global user.name 'kayleh'
          git config --global user.email 'yaojinqing@kayleh.top'
      # 4. 部署到 GitHub 仓库（可选）
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          deploy_key: ${{ secrets.DEPLOY_KEY }}
          external_repository: Kayleh/public
          publish_branch: master #gh-pages
          publish_dir: ./public
          commit_message: ${{ github.event.head_commit.message }}
          user_name: 'github-actions[bot]'
          user_email: 'github-actions[bot]@users.noreply.github.com'
#    # 5. 部署到服务器（可选）
#    - name: Deploy to Server
#      uses: easingthemes/ssh-deploy@v3
#      env:
#        SSH_PRIVATE_KEY: ${{ secrets.SERVER_SSH_KEY }}
#        ARGS: "-rltgoDzvO --delete"
#        EXCLUDE: ".well-known, .user.ini"
#        SOURCE: public/
#        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
#        REMOTE_PORT: ${{ secrets.REMOTE_PORT }}
#        REMOTE_USER: ${{ secrets.REMOTE_USER }}
#        TARGET: ${{ secrets.TARGET }}
```


#### 3.配置Github Secrets

> 为了安全，我们需要配置Github Secrets，用于存放私密信息，如ssh key等

1.先生成ssh key

```bash
ssh-keygen -t rsa -b 4096 -C "
```

2.在生成的文件夹中找到id_rsa.pub，复制内容，以此为ssh key

3.在Github仓库的Settings->Secrets中添加DEPLOY_KEY，值为ssh key，用于提交代码,部署到Github Pages


到这里，我们就可以通过push代码，自动部署到Github Pages了

