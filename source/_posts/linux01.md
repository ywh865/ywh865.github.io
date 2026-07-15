---
title: "Linux 指令笔记（一）"
subtitle: "包管理器：apt-get Debian/Ubuntu系统包管理器"
date: 2019-02-04 00:00:00
tags:
    - "八神鬼嗣"
categories:
    - "文章专柜"
cover_index: /images/linux/0.png
---

### 包管理器
#### apt-get Debian/Ubuntu系统包管理器
`apt-get 是Debian/Ubuntu系统中 一个用于快速下载/安装的简单命令行管理工具！`

#### apt-get命令说明
##### 命令:
`update - 检索 新的包列表`
`upgrade - 升级 可更新的所有软件包`
`install - 安装 新软件包（pkg是libc6不是libc6.deb）`
`remove - 删除 软件包`
`autoremove - 自动删除 所有未使用的软件包`
`purge - 删除 软件包和配置文件`
`clean - 清除 已下载的归档文件`
`autoclean - 清除 旧的下载的档案文件`
`check - 验证 是否有损坏的依赖`
`download - 下载 二进制包到当前目录`
##### 选项：
`-q ：不输出任何信息`
`-qq ：除了错误之外，没有输出`
`-d ：仅下载，不要安装或解压缩存档`
`-y ：对所有确定询问都选择 Yes，并且不提示`
`-f ：尝试纠正 被破坏依赖关系的系统`
`-m ：如果存档是可定位的，则尝试继续`
`-u ：显示升级包的列表`
`-b ：在获取源代码包后构建源包`
 
##### 更多的命令可以用 apt-get --help 查看。

*****

#### 使用示例：
###### 检索 新的包列表
`apt-get update`
###### 升级 可更新的所有软件包（注意这个命令会升级所有的软件包，所以会升级很长时间）
`apt-get upgrade`
###### 安装 Nginx 软件包
`apt-get install nginx`
###### 卸载 Nginx 软件包
`apt-get remove nginx`
###### 卸载 Nginx 软件包 并删除所有相关配置文件
`apt-get remove --purge nginx`
###### 安装 Nginx 软件包 并不显示确定提示
`apt-get install nginx -y`
###### 卸载 Nginx 软件包，删除所有相关配置文件 并不显示提示
`apt-get remove --purge nginx -y`
###### 清除 旧的/无用 的软件包
`apt-get clean && apt-get autoclean`
###### 下载 Nginx 二进制软件包到当前目录，但不解压和安装
`apt-get download nginx -d`

#### 更多的命令可以用 apt-get --help 查看。

*****
###注：
- ###### <font color="#dd0000">在安装软件和卸载的时候，为了避免误操作，都会询问是否继续，每次都要输入 y 来确定会很麻烦，可以加上 -y 参数</font>