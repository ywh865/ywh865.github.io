# 八神鬼嗣の文庫

基于 [Hexo](https://hexo.io/) 8 和自定义 Phantom 主题构建的静态博客，部署目标为 [ywh865.github.io](https://ywh865.github.io/)。站点包含文章卡片首页、分类与标签归档、本地全文搜索、图片灯箱、Disqus 评论和 Live2D 看板娘。

## 环境要求

- Node.js 20.19.0 或更高版本
- npm 10 或更高版本
- Git

Hexo 8.1.2 要求 Node.js `>=20.19.0`。建议使用项目中的 `package-lock.json` 保持依赖版本一致。

## 快速开始

```bash
npm ci --ignore-scripts
npm run server
```

默认预览地址为 `http://localhost:4000/`。需要包含草稿时运行：

```bash
npm run dev
```

## 常用命令

| 命令 | 用途 |
| --- | --- |
| `npm run clean` | 删除 Hexo 缓存和构建输出 |
| `npm run build` | 生成静态站点到 `public/` |
| `npm run rebuild` | 清理后重新生成站点 |
| `npm run server` | 启动本地预览服务器 |
| `npm run server:port -- 4001` | 使用指定端口启动预览 |
| `npm run check:vendor` | 校验主题内置 jQuery 与锁定依赖一致 |
| `npm run check:quality` | 检查模板安全边界、URL、外链和依赖版本规范 |
| `npm run check:js` | 检查主题自定义 JavaScript 语法 |
| `npm run check` | 执行全部质量检查并完整重建 |
| `npm run audit` | 查询 npm 安全公告；该命令会访问 npm 服务 |
| `npm run sync:vendor` | 从锁定的 npm 依赖同步主题内置 jQuery |
| `npm run deploy` | 重建并部署到配置的 Git 仓库 |

## 项目结构

```text
.
├── _config.yml                 # Hexo 站点配置
├── package.json                # 依赖与维护命令
├── tools/                      # 不由 Hexo 自动加载的质量检查工具
├── scaffolds/                  # 文章、页面和草稿模板
├── source/                     # 内容与站点资源
│   ├── _posts/                 # Markdown 文章
│   ├── images/                 # 图片
│   ├── videos/                 # 视频
│   ├── search/                 # 搜索页面
│   └── links/                  # 友链页面及资源
└── themes/phantom/
    ├── _config.yml             # Phantom 主题配置
    ├── languages/              # 国际化文本
    ├── layout/                 # EJS 模板
    └── source/
        ├── js/                 # 浏览器脚本
        ├── live2dw/            # 本地化的 Live2D 运行库与模型
        └── sass/               # 样式源文件
```

以下目录和文件均由工具生成，不应手工修改或提交：

- `public/`
- `.deploy_git/`
- `db.json`
- `node_modules/`

主题样式以 `themes/phantom/source/sass/` 为源码。`themes/phantom/source/css/` 中保留的是上游兼容资源，页面主样式由 `sass/main.scss` 编译生成。

## 内容写作

新建文章：

```bash
npx hexo new "文章标题"
```

推荐的 front matter：

```yaml
---
title: 文章标题
date: 2026-01-01 12:00:00
categories:
  - 文章专柜
tags:
  - 八神鬼嗣
cover_index: /images/example/cover.png
cover_detail: /images/example/header.png
comments: false
---
```

- 图片放在 `source/images/<文章 slug>/`。
- 视频放在 `source/videos/<类型>/<文章 slug>/`。
- 站内资源使用以 `/` 开头的路径；模板会通过 Hexo 的 `url_for` 适配 `root` 配置。
- `cover_index` 用于首页卡片，`cover_detail` 用于文章页顶部大图。
- Markdown 正文会作为可信内容渲染。不要把未经清理的第三方 HTML 直接写入文章或主题配置。

## 主题维护约定

- 文本和 HTML 属性默认使用 EJS 转义输出 `<%= ... %>`。
- 仅对可信的 Hexo 正文和框架 helper 输出使用 `<%- ... %>`。
- 站内 URL 使用 `url_for()`，需要完整公开地址的元数据使用 `full_url_for()`。
- 新窗口外链必须添加 `rel="noopener noreferrer"`。
- 自定义 JavaScript 保持 ES5 风格以兼容主题现有运行环境，并通过 `npm run check:js` 验证。
- 修改模板、配置或样式后必须运行 `npm run check`。
- 不要在根目录创建通用工具脚本 `scripts/*.js`；Hexo 会把该目录作为扩展入口自动执行。维护工具应放在 `tools/`。

更完整的代理与贡献规则见 [AGENTS.md](AGENTS.md)。

## 依赖与安全

- 直接依赖使用精确版本，并由 `package-lock.json` 锁定。
- 安装使用 `npm ci --ignore-scripts`；需要依赖生命周期脚本时，应先审查脚本用途。
- 依赖变更后必须执行 `npm run audit` 和 `npm run check`。
- 已移除存在高危依赖链且长期未维护的 `hexo-helper-live2d`。Live2D 运行库和 Shizuku 模型改为从 `themes/phantom/source/live2dw/` 本地加载，来源与哈希记录在 [VENDORED_ASSETS.md](VENDORED_ASSETS.md)。
- `themes/phantom/source/js/jquery.min.js` 由 `jquery@3.7.1` 同步生成，不得直接编辑。
- 音乐文章使用锁定版本的远程浏览器资源 `APlayer 1.10.1` 与 `Meting 2.0.2`。它们不是 Hexo 构建依赖；修改 `source/_posts/music.md` 中的版本后，必须在浏览器中确认播放器和歌单均能初始化。

## 搜索

搜索索引由 `hexo-generator-searchdb` 生成到 `/search.xml`。浏览器端脚本位于 `themes/phantom/source/js/search.js`，只在搜索页检测到输入框后初始化，并对关键词正则、结果文本和结果 URL 进行限制与转义。

如果搜索不可用，请依次确认：

1. `npm run build` 已生成 `public/search.xml`。
2. `_config.yml` 中的 `search` 配置仍输出 XML。
3. `themes/phantom/_config.yml` 中 `local_search.enable` 未被关闭。

## 部署

部署目标配置在 `_config.yml`：

```yaml
deploy:
  type: git
  repository: git@github.com:ywh865/ywh865.github.io.git
  branch: master
```

确认本地构建无误后执行：

```bash
npm run deploy
```

该命令会写入远端仓库，执行前应检查 `_config.yml` 中的仓库和分支是否正确。

## 已知维护项

- 上游 Phantom/Skel SCSS 仍使用 Dart Sass 已弃用的 `@import`、全局函数和除法语法；当前可以构建，但未来升级 Dart Sass 前需要迁移。
- Disqus、Facebook 和 Google Analytics 会在启用后加载远程第三方脚本。Live2D 属于本地托管的第三方代码；调整这些功能时应同步审查隐私、许可证与安全影响。
- `Promise_Full_Version` 文章仍引用远程视频，后续可迁移为本地资源。

## 版权

站点内容版权归作者所有。Phantom 主题源自 [HTML5 UP Phantom](https://html5up.net/phantom)，具体上游说明见 `themes/phantom/README.md`。本仓库当前未提供统一的根目录许可证文件。
