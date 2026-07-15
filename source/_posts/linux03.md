---
title: "Linux 指令笔记（三）"
subtitle: "文件/文件夹 操作"
date: 2019-02-06 00:00:00
tags:
    - "八神鬼嗣"
categories:
    - "文章专柜"
cover_index: /images/linux/0.png
---

### 文件/文件夹 操作
`以下除特殊说明，都以当前目录为 /root 示例。`

#### mkdir 新建 文件夹
###### 在当前文件夹新建一个 bash 文件夹，完整的绝对路径就是 /root/bash
`mkdir bash`

##### 更多的命令可以用 mkdir --help 查看。

*****

#### cp 复制或重命名 文件/文件夹
##### cp命令说明

###### 复制当前目录内的 log.txt文件到 /var目录
`cp log.txt /var/log.txt`
###### 复制当前目录内的 bash文件夹到 /home目录
`cp -R bash /home/bash`
###### 复制当前目录内的所有.txt后缀的文件到 /var/log目录
`cp *.txt /var/log`
###### 复制当前目录内的所有以 onioni开头的文件到 /var/log目录
`cp onioni* /var/log`
###### 复制当前目录内的所有以 onioni开头 以.txt后缀结尾的文件到 /var/log目录
`cp onioni*.txt /var/log`
###### 假设当前目录是 /root/onioni/log，要把这个目录中的所有.txt后缀的文件复制到上一级目录 /root/onioni，那么这样做
`cp *.txt ..`
###### .. 就是相对路径，代表上一级目录，当然你也可以用绝对路径，这样更不容易出错
`cp *.txt /root/onioni`
###### 重命名当前目录内的 log.txt文件为 log2.txt
`cp log.txt log2.txt`
###### 复制当前目录内的 log.txt文件到 /var目录并重命名为 log1.txt
`cp log.txt /var/log1.txt`
###### 复制当前目录内的 bash文件夹到 /home目录并重命名为 bash2
`cp -R bash /home/bash2`
###### 复制当前目录内的 log.txt文件到 /var目录，但是 /var 目录中已经存着 log.txt，那么会提示 cp: overwrite `/var/log.txt'? 可以用 -f 强制覆盖
`cp -f log /var/log.txt`
###### 大家可能会发现，当你使用 cp -f 强制覆盖的时候，依然会询问你是否覆盖，这是因为 CP 为了避免你手误，默认加上了 -i 参数（该参数代表每次覆盖必须询问）。
###### 所以想要避免 CP 默认的 -i 参数，只需要在 CP 命令前面加上斜杠即可 “/”
`/cp -f log /var/log.txt`
###### 复制当前目录内的 log.txt log1.txt log2.txt文件和 log233目录到 /home/log目录中
`cp -R log.txt log1.txt log2.txt log233 /home/log`

#### 更多的命令可以用 cp --help 查看。

*****

#### mv 移动或重命名 文件/文件夹
##### mv命令说明

##### 关于 mv 命令，可以参考上面 cp 的使用方法，没什么区别，只是一个是复制，一个是移动，把上面 cp 命令改成 mv 就能套用了。
###### 移动当前目录内的 log.txt文件到 /var目录
`mv log.txt /var/log.txt`
###### 移动当前目录内的 bash文件夹到 /home目录
`mv bash /home/bash`
###### 重命名当前目录内的 log.txt文件为 log2.txt
`mv log.txt log2.txt`
###### 复制当前目录内的 log.txt文件到 /var目录并重命名为 log1.txt
`mv log.txt /var/log1.txt`
###### 复制当前目录内的 bash文件夹到 /home目录并重命名为 bash2
`mv bash /home/bash2`

#### 更多的命令可以用 mv --help 查看。

*****

#### rm 删除 文件/文件夹
##### rm命令说明

###### 删除当前目录下的 log.txt文件
`rm log.txt`
###### 删除当前目录下所有.txt后缀的文件
`rm *.txt`
###### 使用 rm 命令删除时，会提示你是否确定删除，输入 y 即删除，输入 n 则取消
###### rm: remove regular file `log.txt'? y
###### 删除当前目录下所有.txt后缀的文件
`rm *.txt`
###### 删除当前目录下所有以 onioni开头的文件
`rm onioni*`
###### 删除当前目录下所有以 onioni开头 以.txt后缀结尾的文件
`rm onioni*.txt`
###### 当你用 rm 删除目录的时候会发现提示这不是一个文件
###### rm bash
###### rm: cannot remove `bash': Is a directory
###### 可以加上 -r 来归递删除目录及其目录下的内容
`rm -r bash`
###### 因为为了避免手误删除错误，rm默认加上了 -i 的参数，每一次删除文件/目录都会提示，如果觉得烦可以用 -rf 参数
`rm -rf bash`
###### <font color="#dd0000">rm -rf 这个命令请慎重使用，而且千万不要使用 rm -rf / 或者 rm -rf /* 之类的命令(系统自杀)，可能会让你直接跑路，所以使用请慎重！</font>
 
#### 更多的命令可以用 rm --help 查看。