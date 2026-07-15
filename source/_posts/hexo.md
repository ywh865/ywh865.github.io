---
title: "使用 Hexo 搭建 Blog"
subtitle: "使用 Hexo 在 GitHub Pages 搭建 Blog"
date: 2019-11-25 00:00:00
tags:
    - "八神鬼嗣"
categories:
    - "文章专柜"
cover_index:  /images/hexo.jpg
---
# 使用 Hexo 在 GitHub Pages 上免费搭建 Blog

## Hexo

* [https://hexo.io](https://hexo.io)

### Hexo 是什么？

 Hexo 是一个快速、简洁且高效的博客框架。 Hexo 使用 Markdown（或其他渲染引擎）解析文章，在几秒内，即可利用靓丽的主题生成静态网页。

### 环境依赖

安装 Hexo 相当简单。然而在安装前，必须先在电脑中安装：

* Node.js / 至少需要 `6.9` 版本
[https://nodejs.org/en/](https://nodejs.org/en/)

* Git / 用来同步生成好的静态页面
[https://git-scm.com/download/win](https://git-scm.com/download/win)

* 验证 Node.js 与 Git 安装

```bash
$node -v
$git --version
```

### 安装 Hexo CLI 工具

`npm install -g hexo-cli`

### 创建 Blog

在电脑桌面新建一个文件夹 Blog ，用来存放博客。然后打开 PowerShell 进入刚才新建的文件夹初始化并创建一个新的 Blog :

```bash
cd ~/Desktop/Blog # 进入 Blog 目录
hexo init  # 初始化
```

### Blog 目录介绍

```bash
├── _config.yml # 网站的配置信息
├── package.json
├── scaffolds # 模版文件夹
├── source  # 资源文件夹
|   ├── _drafts # 草稿文件
|   └── _posts # 文章 Markdowm 文件
└── themes  # 主题文件夹
```

### 设置语言

打开目录中的 `_config.yml` 文件，修改：

```yml
language: zh-Hans
```

### 创建新文章

* 在博文根目录的 Source 文件夹的 Post 文件夹下直接新建一个 .md 文件。
* 在博文根目录打来 PowerShell ，然后输入 `hexo new "你的标题"` 回车在你的 Post 文件夹下就新建了一个 .md 文件，打开编辑即可。

### 生成静态页面

`hexo g # 本地生成静态文件`

### 本地访问测试

`hexo s # 启动 Hexo 本地 HTTP 服务`

打开游览器进入 [http://localhost:4000](http://localhost:4000) ,就可以即时预览 Blog  。返回 PowerShell 使用快捷键 `Ctrl+c` 即可关闭 `hexo s` 。

## GitHub

* [https://github.com](https://github.com)

### GitHub 是什么？

 GitHub 是通过 Git 进行版本控制的软件源代码托管服务平台，由GitHub公司的开发者 Chris Wanstrath 、 PJ Hyett 和 Tom Preston-Werner 使用 uby on Rails 编写而成。

### GitHub Pages 是什么？

 GitHub Pages 是 GitHub 提供的一个网页寄存服务，可以用于存放静态网页，包括博客、项目文档甚至整本书。 Jekyll 软体可以用于将文档转换成静态网页，该软体提供了将网页上传到 GitHub Pages 的功能。

#### 部署到Coding以及GitHub上

部署之前需要安装 Git 部署插件，否则会提示 Deployer not found 错误。
`npm install hexo-deployer-git --save`

在 Github 上创建名字为 `****.github.io` 的项目， `****` 为自己的 Github 用户名，打开本地的 Blog 文件夹项目内的 `_config.yml` 配置文件，将其中的 `type` 设置为 `git` 。

```yml
deploy:
  type: git
  repository: https://github.com/****/****.github.io.git
  branch: master
```

`hexo d # 将本地静态文件推送至Github`

注：要配置好配置 SSH key ， `id_rsa` 是你这台电脑的私人秘钥， `id_rsa.pub` 是公共秘钥。把公钥放在 GitHub 上，当你连接自己的 Github 账号时，它就会根据公钥匹配你的私钥，当能够相互匹配时，才能够顺利的通过 Git 上传你的文件到 GitHub 上。

### 绑定域名

网站已经搭建好，虽然能通过 GitHub 的域名访问，但是如果想要用自己的域名，我们还需要设置将自己的域名绑定到 GitHub 这个博客项目上。

在 GitHub Pages 仓库网页点击 Settings ，下拉到 GitHub Pages ，在 Custom domain 中填入自己的域名地址，然后点击 Save 保存。

#### 添加 A 记录

添加 A 记录，绑定 GitHub Pages 地址：

```
@       A       185.199.108.153
@       A       185.199.109.153
@       A       185.199.110.153
@       A       185.199.111.153
```

#### 添加 CNAME 记录，绑定 GitHub Pages 地址：

`www       CNAME       username.github.io`

#### 添加 CNAME 文件

添加完 A 记录和 CNAME 记录解析后，进入博客目录，在 `source` 目录下新建 `CNAME` 文件，写入你自己的域名，然后重新然后再部署到 GitHub 上。

#### HTTPS 配置

在 GitHub Pages 仓库网页点击 Settings ，下拉到 GitHub Pages ，勾选 Enforce HTTPS 可设置强制 Https 访问，一般为默认开启不需要设置。

#### 访问测试

在游览器输入绑定的域名地址访问，如果一切设置正确，会打开发布到 GitHub Pages 的 Hexo Blog 。
