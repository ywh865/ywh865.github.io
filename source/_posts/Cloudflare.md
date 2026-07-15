---
title: "套用 Cloudflare CDN"
subtitle: "使用 Hexo 套用 Cloudflare 免费 CDN"
date: 2019-12-03 00:00:00
tags:
    - "八神鬼嗣"
categories:
    - "文章专柜"
cover_index: /images/hexo.jpg
---
# 使用 Hexo 套用 Cloudflare 免费 CDN

## Cloudflare

* [https://cloudflare.com](https://cloudflare.com)

### Cloudflare 是什么？

 Cloudflare 是一间总部位于旧金山的美国跨国 IT 企业，以向客户提供基于反向代理的内容分发网络及分布式域名解析服务为主要业务。 Cloudflare 可以帮助受保护站点抵御包拒绝服务攻击等网络攻击，确保该网站长期在线，同时提升网站的性能、加载速度以改善访客体验。

因为 GitHub Pages 的服务器都远在美国，而且被 *照顾* 的厉害，所以导致在中国直接访问速度非常慢。使用免费的 Cloudflare 反代 + 缓存 GitHub Pages ，可以明显的提高全球访问速度，包括中国。

### Cloudflare 添加域名

进入 [https://dash.cloudflare.com](https://dash.cloudflare.com) ，点击 Add a Site ， 输入域名然后点击 Add site 。在购买域名服务商处，设置域名的解析 DNS 服务地址为：

```
cleo.ns.cloudflare.com
lila.ns.cloudflare.com
```

等待全球 DNS 缓存刷新，绑定成功后会收到 Cloudflare 的确认邮件。

#### 添加 A 记录

添加 A 记录，绑定 GitHub Pages 地址：

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

#### HTTPS 配置

在 Cloudflare Dash 点击域名进入配置，点击顶部 SSL/TLS ，点击 SSL 一栏右侧下拉菜单选择 Flexible 。
在 GitHub Pages 仓库网页点击 Settings ，下拉到 GitHub Pages ，点击取消勾选 Enforce HTTPS 。

#### 添加缓存规则

在 Cloudflare Dash 点击域名进入配置，点击顶部 Page Rules ，然后点击 Create Page Rule ， If the URL matches 一栏中填写你的域名，不带 wwww ，域名结尾 /* ，比如 `abc.com/*` 。然后在下方点击 Add a Setting 添加规则：

* Auto Minify / HTML CSS JavaScript
* Rocket Loader On
* Browser Cache TTL 2 hours
* Always Online On
* Cache Level Cache Everything
* Edge Cache TTL 2 hours
* Automatic HTTPS Rewrites On

然后点击右下方 Save and Deploy ，保存与部署规则。

#### 访问测试

等待 Cloudflare HTTPS 证书下发，然后在游览器输入绑定的域名地址访问。如果一切设置正确，应该会打开发布到 GitHub Pages 的 Hexo Blog 。