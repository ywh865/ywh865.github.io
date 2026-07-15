---
title: "Linux 指令笔记（五）"
subtitle: "解压缩 操作"
date: 2019-02-25 00:00:00
tags:
    - "八神鬼嗣"
categories:
    - "文章专柜"
cover_index: /images/linux/0.png
---

### 解压缩 操作
#### 在Linux中经常会下载到压缩文件，而压缩文件的格式有很多，比如 zip、rar、gz、xz、tar.gz、tar.xz等。
#### 比较常见的就是各种 .tar、.tar.xz、.tar.gz、.tar.bz、.tar.bz2、.tar.Z 后缀压缩包，这几个的解压缩命令基本一样，说明一下参数的意义。

##### tar 本身只是一个打包的作用，而 .tar 后面的 .zx / .gz / .bz 等等才是压缩格式，也就是比如 log.tar.gz 压缩包，就是先用 .tar 把指定文件/文件夹打包到一起，然后再用 gz 来压缩打包后的 .tar 为 .tar.gz 。
`-x 是从压缩文件提取(解压)文件出来，所以在解压命令中都有这个参数。`
`-c ：创建一个新的压缩包文件，所以在压缩命令中都有这个参数。`
`-f ：指定要解压的压缩包文件或要压缩的文件/文件夹，所以这个参数必须放在 解压缩命令参数的最后，然后后面跟着 要解压到压缩包文件或要压缩的文件/文件夹。`
`-j ：解压缩 bz / bz2 格式的参数`
`-J ：解压缩 xz / lzip 格式的参数`
`-z ：解压缩 gz / tgz 格式的参数`
`-Z ：解压缩 Z 格式的参数`
`-v ：详细列出解压缩过程中处理的文件`
 
#### 更多的命令可以用 tar --help 来查看。

*****

### tar gz zip等 解压 压缩包 示例
#### 解压压缩包说明

###### 解压后缀为 .tar 的压缩包
`tar -xf log.tar`
###### 解压后缀为 .tar.xz 的压缩包
`tar -xJf log.tar.xz`
###### 解压后缀为 .tar.gz 的压缩包，两个方法
`tar -xzf log.tar.gz`
###### 解压后缀为 .gz 的压缩包，两个方法，如提示命令不存在，请安装 yum install gzip -y / apt-get install gzip -y
`gzip -d log.gz`
`gunzip log.gz`
###### 解压后缀为 .bz / .bz2 / tar.bz2 的压缩包，两个方法
`bzip2 -d log.bz`
`bunzip2 log.bz`
`tar -jxf log.tar.bz`

`bzip2 -d log.bz2`
`bunzip2 log.bz2`
`tar -jxf log.tar.bz2`
###### 解压后缀为 .Z / tar.Z 的压缩包，两个方法
`uncompress log.Z log.txt`
`uncompress log.Z log`

`tar xZf log.tar.Z log.txt`
`tar xZf log.tar.Z log`
###### 解压后缀为 .rar 的压缩包，如提示命令不存在，请安装 yum install unrar -y / apt-get install unrar -y ，注意 rar 和 unrar 是分开的
`unrar x log.rar`
###### 解压后缀为 .zip 的压缩包，如提示命令不存在，请安装 yum install unzip -y / apt-get install unzip -y，注意 zip 和 unzip 是分开的
`unzip log.zip`
 
#### 更多的命令可以用 tar --help / gzip --help / unrar --help / unzip --help 来查看。

*****

### 压缩 文件/文件夹 示例
#### 压缩文件/文件夹说明

###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.tar 压缩包
`tar -cf log.tar log.txt`
`tar -cf log.tar log`
###### 如果要压缩多个文件和文件夹，那么只需要在后面一直加下去即可
`tar -cf log.tar log.txt doub.txt log bash`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.tar.xz 压缩包，以下的其他后缀压缩命令都是一样
`tar -cJf log.tar.xz log.txt`
`tar -cJf log.tar.xz log`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.tar.gz 压缩包
`tar -czf log.tar.gz log.txt`
`tar -czf log.tar.gz log`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.gz 压缩包
`gzip log.gz log.txt`
`gzip log.gz log`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.tar.bz 压缩包
`暂时没找到解决方法`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.bz / log.tar.bz / log.bz2 / log.tar.bz2压缩包
`bzip2 -z log.txt`
`bzip2 -z log`
 
`tar cjf log.tar.bz2 log.txt`
`tar cjf log.tar.bz2 log`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.Z / log.tar.Z 压缩包
`compress log.txt`
`compress log`
 
`tar cZf log.tar.Z log.txt`
`tar cZf log.tar.Z log`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.rar 压缩包，如提示命令不存在，请安装 yum install rar -y / apt-get install rar -y ，注意 rar 和 unrar 是分开的
`unrar a log.rar log.txt`
`unrar a log.rar log`
###### 分别压缩当前目录下的 log.txt文件 / log文件夹为 log.zip 压缩包，如提示命令不存在，请安装 yum install zip -y / apt-get install zip -y ，注意 zip 和 unzip 是分开的
`zip log.zip log.txt`
`zip log.zip log`
 
#### 更多的命令可以用 tar --help / gzip --help / rar --help / zip --help 来查看。