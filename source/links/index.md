---
# 友军链接页面配置
title: "友军链接"
subtitle: "Links"
date: 2018-11-21 00:00
comments: false
---

<!-- 友链列表样式 -->
<style>
    .links-list {
        list-style: none;
        padding: 0;
        margin: 2em 0 0 0;
    }
    .links-list li {
        display: flex;
        align-items: center;
        margin-bottom: 1.5em;
    }
    .links-list img {
        width: 70px;
        height: 70px;
        border-radius: 50%;
        margin-right: 1em;
        object-fit: cover;
    }
    .links-list a {
        font-weight: bold;
        margin-right: 0.5em;
        border-bottom: none;
    }
    .links-list span {
        color: #666;
    }
    @media (max-width: 480px) {
        .links-list li {
            flex-wrap: wrap;
        }
        .links-list span {
            width: 100%;
            margin-top: 0.5em;
            margin-left: calc(70px + 1em);
        }
    }
</style>

<!-- 友链列表 -->
<ul class="links-list">
    <li>
        <img src="2.jpg" alt="cynosura.one" height="70" width="70" />
        <a href="https://cynosura.one/" target="_blank" rel="noopener">cynosura.one</a>
        <span>某 baka 熊熊的 baka 观测站</span>
    </li>
    <li>
        <img src="1.jpg" alt="haowu.moe" height="70" width="70" />
        <a href="https://haowu.moe/" target="_blank" rel="noopener">haowu.moe</a>
        <span>永远怀念萌老板的萌盒。</span>
    </li>
    <li>
        <img src="3.jpg" alt="kaf.moe" height="70" width="70" />
        <a href="https://kaf.moe/" target="_blank" rel="noopener">kaf.moe</a>
        <span>高能萝卜大佬的一个垃圾桶。</span>
    </li>
</ul>
