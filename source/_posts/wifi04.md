---
title: "WLAN笔记（四）"
subtitle: "WLAN常用概念"
date: 2019-05-18 00:00:00
tags:
    - "八神鬼嗣"
categories:
    - "文章专柜"
cover_index: /images/wifi/wifi.png
---
WLAN术语SSID，SSID的全称是Service Set Identifier，也就是服务集标识符，用于标识一个服务集，按照大部分人的理解，也就是用来标识一个可用的网路。而所谓服务集，就是一组互相有联系的无线设备。在提供的无线网络中，我们的无线终端（在WLAN中称之为工作站STA，Station）只要连上AP，实际上就构成了一个服务集。在这个服务集内，只要终端和AP关联，终端就能够相互通信，也可以通过AP访问外部网络。如果只有一个AP，也就是说这个服务集中只有一个AP，那么这个服务集就可以被认为一个基本服务集BSS。BSS是无线网络的基本服务单元。所有的终端关联到一个AP上，该AP连接其他有线设备，并且控制和主导整个BSS中的全部数据的传输过程。如果存在多个AP，一个BSS所覆盖的地理范围有限，直径不超过100米，这个时候就会有一个扩展服务集ESS（Extend Service Set）的概念。
 
ESS简单理解，就是多个使用相同SSID的BSS组成，但是这中间隐含2个条件：

1.这些BSS是要比邻安置。
2.这些BSS通过各种分布系统互联，有线无线都可以，不过一般都是以太网。

只有满足上述条件后，才认为这些BSS可以被统一为一个ESS。由于使用的是相同的SSID，我们根本感觉不到我们是接在多个BSS上，而是如同接在同一个AP上一样。终端在ESS内的通信和在BSS中类似，不过如果BSS中终端A想和另一个BSS中的终端B通信，则是需要经过2个接入点AP1和AP2，即A->AP1->AP2->B。特别的，在同一个ESS中的不同BSS之间切换的过程称为漫游。上图也画出了终端A从BSS1域漫游到BSS2（图上的A’的位置），此时A仍然可以保持和B的通信，不过A在漫游前后的接入点AP改变了。SSID通常是一个不超过32个字符的字符串，这个SSID又叫ESSID，是对ESS的标识。在同一个ESS中，我们是不知道接在哪个BSS上，但终端设备会用BSSID标识BSS得知你所在哪一个BSS，这个标识符是一个长度为48位的二进制标识符，通常是这个BSS里面AP的MAC地址。

有些设备还可以配置VAP，为用户提供差异化的WLAN业务。所谓VAP就是在一个物理实体AP上虚拟出多个虚拟的AP，每一个被虚拟出的AP就是一个VAP，每个VAP提供和物理实体AP一样的功能。VAP的优势显而易见，多个虚拟的AP工作在同一个硬件平台，提高了硬件的利用率；网络管理员可以为不同VAP设置不同SSID，安全设置，QoS设置等策略和功能，也增加了网络的灵活性。那VAP在一个ESS中怎么区分BSS，其实VAP也是用BSSID来区分的，但是这是BSSID不是用的物理AP的MAC地址，而是用的VAP的MAC地址。而这个VAP的MAC地址实际上和物理AP的MAC地址是有影射关系的。一般第一个VAP的MAC是跟AP的MAC地址一样的，后面的VAP的MAC地址是在AP的MAC的最后一位顺序加一。当然BSSID没有ESSID来的好记，毕竟是一串无序数据，所以也会为VAP添加一个SSID来方便记忆。

补充：
基本服务集BSS（Basic Service Set）无线网络的基本服务单元，通常由一个AP和若干无线终端组成。
扩展服务集ESS（Extend Service Set）由多个使用相同SSID的BSS组成，解决BSS覆盖范围有限的问题。
服务集标识符SSID（Service Set Identifier）用来区分不同的无线网络。
扩展服务集标识符ESSID（Extended Service Set Identifier）一个或一组无线网络的标识，和SSID是相同的。
基本服务集标识符BSSID（Basic Service Set Identifier）在链路层上用来区分同一个AP上的不同VAP，也可以用来区分同一个ESS中的BSS。
虚拟接入点VAP（Virtual Access Point）AP设备上虚拟出来的业务功能实体。用户可以在一个AP上创建不同的VAP来为不同的用户群体提供无线接入服务。
