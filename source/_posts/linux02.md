---
title: "Linux 指令笔记（二）"
subtitle: "包管理器：yum CentOS系统包管理器"
date: 2019-02-05 00:00:00
tags:
    - "八神鬼嗣"
categories:
    - "文章专柜"
cover_index: /images/linux/0.png
---

### 包管理器
#### yum CentOS系统包管理器
`yum 是CentOS系统中 一个用于快速下载/安装的简单命令行管理工具！`

#### yum 参数介绍
##### 命令:
`update - 检索 新的包列表`
`upgrade - 升级 软件包`
`search - 搜索 软件包`
`install - 安装 软件包`
`list - 列出 软件包或者软件包组`
`info - 显示软件包或者软件包组的详细信息`
`erase - 删除 软件包（这两个命令一样）`
`remove - 删除 软件包（这两个命令一样）`
`groupinfo - 显示 有关包组的详细信息`
`groupinstall - 安装 软件包组（就像一种软件合集）`
`grouplist - 列出 可用的软件包组`
`groupremove - 删除 软件包组`
`check - 检查 软件包`
`check-update - 检查 可更新的软件包`
`clean - 清除 缓存目录内的软件包`
`deplist - 列出 一个包的依赖关系`
`distribution-synchronization - 同步 已安装的软件包到最新的版本`
`downgrad - 降级 一个软件包`
`reinstall - 重新安装 软件包（自动删除重装）`
`repolist - 显示 配置的软件包仓库`
`resolvedep - 确定 软件包需要的依赖关系`
##### 选项：
`-t ：容忍错误`
`-C ：完全从系统缓存运行，不要更新缓存`
`-R 分钟 ：最大命令等待时间`
`-q ：安静的操作`
`-y ：对于所有问题回答是`
`--nogpgcheck ：禁用gpg签名检查`
 
##### 更多的命令可以用 apt-get --help 查看。

*****

#### 使用示例：
###### 检索 新的包列表
`yum update`
###### 安装 Nginx 软件包
`yum install nginx`
###### 安装 Development Tools 软件包组（这个软件包组中包含了编译所需的软件）
`yum groupinstall "Development Tools"`
###### 卸载 Nginx 软件包
`yum erase nginx / yum remove nginx`
###### 卸载 Development Tools 软件包组
`yum groupremove "Development Tools"`
###### 升级 所有可更新的软件包
`yum upgrade`
###### 升级 Nginx 可更新的软件包
`yum upgrade nginx`
###### 安装 Nginx 软件包 并不显示确定提示
`yum install nginx -y`
###### 卸载 Nginx 软件包 并不显示确定提示
`yum erase nginx -y / yum remove nginx -y`
###### 搜索 Nginx 软件包是否存着
`yum search nginx`
###### 列出 可用的软件包
`yum list`
###### 列出 可用的软件包组
`yum grouplist`
###### 清除 缓存目录中的所有软件包
`yum clean`
###### 清除 缓存目录中的 Nginx 软件包
`yum clean nginx`
###### 重装 Nginx 软件包
`yum reinstall nginx`
#### 更多的命令可以用 yum --help 查看。

*****
### 注：
- ###### <font color="#dd0000">在安装软件和卸载的时候，为了避免误操作，都会询问是否继续，每次都要输入 y 来确定会很麻烦，可以加上 -y 参数</font>
- ###### <font color="#dd0000">当软件包或者软件包组的名字中包含空格的时候，软件包或软件包组需加上双引号！</font>