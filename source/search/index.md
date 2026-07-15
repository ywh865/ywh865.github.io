---
# 目录搜索页面配置
title: 目录搜索
date: 2018-11-21 00:00:00
comments: false
---

{% raw %}
<!-- 本地搜索表单 -->
<form class="site-search-form" onsubmit="return false;">
    <input
        type="text"
        id="local-search-input"
        class="st-search-input"
        placeholder="来，点击这里搜索一下书架目录吧..."
        autocomplete="off"
    />
</form>

<!-- 搜索结果展示区域 -->
<div id="local-search-result" class="local-search-result-cls"></div>

{% endraw %}
