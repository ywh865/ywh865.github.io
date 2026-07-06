/**
 * 本地搜索脚本
 * 基于 hexo-generator-searchdb 生成的 search.xml 实现
 * 功能：异步加载索引、关键词匹配、结果高亮、清空搜索
 */
var searchFunc = function (path, searchId, contentId) {
    'use strict';

    // 关闭按钮 HTML
    var closeBtn = "<i id='local-search-close'>×</i>";

    var $input = document.getElementById(searchId);
    var $resultContent = document.getElementById(contentId);

    // 初始化提示
    $resultContent.innerHTML = closeBtn + "<ul><span class='local-search-empty'>首次搜索，正在载入索引文件，请稍后……<span></ul>";

    $.ajax({
        // 加载搜索索引 XML
        url: path,
        dataType: 'xml',
        success: function (xmlResponse) {

            // 解析 XML，提取标题、内容、URL
            var datas = $('entry', xmlResponse).map(function () {
                return {
                    title: $('title', this).text(),
                    content: $('content', this).text(),
                    url: $('url', this).text()
                };
            }).get();

            $resultContent.innerHTML = '';

            // 监听输入事件，实时搜索
            $input.addEventListener('input', function () {
                var resultHtml = '<ul class="search-result-list">';
                var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);

                $resultContent.innerHTML = '';

                // 空输入不搜索
                if (this.value.trim().length <= 0) {
                    return;
                }

                // 遍历所有文章进行匹配
                datas.forEach(function (data) {
                    var isMatch = true;
                    var firstOccur = -1;

                    // 标题为空时显示默认标题
                    if (!data.title || data.title.trim() === '') {
                        data.title = 'Untitled';
                    }

                    var originalTitle = data.title.trim();
                    var lowerTitle = originalTitle.toLowerCase();
                    var originalContent = data.content.trim().replace(/<[^\u003e]+>/g, '');
                    var lowerContent = originalContent.toLowerCase();
                    var dataUrl = data.url;

                    var hostname = window.location.hostname;
                    var port = window.location.port;

                    // 仅对非空内容进行匹配
                    if (lowerContent !== '') {
                        keywords.forEach(function (keyword, i) {
                            var indexTitle = lowerTitle.indexOf(keyword);
                            var indexContent = lowerContent.indexOf(keyword);

                            if (indexTitle < 0 && indexContent < 0) {
                                isMatch = false;
                            } else {
                                if (indexContent < 0) {
                                    indexContent = 0;
                                }
                                if (i === 0) {
                                    firstOccur = indexContent;
                                }
                            }
                        });
                    } else {
                        isMatch = false;
                    }

                    // 命中后拼接结果条目
                    if (isMatch) {
                        resultHtml += "<li><a href='//" + hostname + ':' + port + '/' + dataUrl + "' class='search-result-title' target='_blank'>" + originalTitle + "</a>";

                        if (firstOccur >= 0) {
                            // 截取命中位置前后片段（共约 100 字）
                            var start = firstOccur - 20;
                            var end = firstOccur + 80;

                            if (start < 0) {
                                start = 0;
                            }
                            if (start === 0) {
                                end = 100;
                            }
                            if (end > originalContent.length) {
                                end = originalContent.length;
                            }

                            var matchContent = originalContent.substr(start, end);

                            // 高亮所有关键词
                            keywords.forEach(function (keyword) {
                                var reg = new RegExp(keyword, 'gi');
                                matchContent = matchContent.replace(reg, '<em class="search-keyword">' + keyword + '</em>');
                            });

                            resultHtml += '<p class="search-result">' + matchContent + '...</p>';
                        }

                        resultHtml += '</li>';
                    }
                });

                resultHtml += '</ul>';

                // 无结果提示
                if (resultHtml.indexOf('<li>') === -1) {
                    $resultContent.innerHTML = closeBtn + "<ul><span class='local-search-empty'>没有找到内容，请尝试更换检索词。<span></ul>";
                    return;
                }

                $resultContent.innerHTML = closeBtn + resultHtml;
            });
        }
    });

    // 点击关闭按钮清空搜索
    $(document).on('click', '#local-search-close', function () {
        $('#local-search-input').val('');
        $('#local-search-result').html('');
    });
};

// 页面加载完成后初始化搜索（仅在存在搜索框的页面执行）
var getSearchFile = function () {
    var searchInput = document.getElementById('local-search-input');
    var searchResult = document.getElementById('local-search-result');

    // 当前页面没有搜索框，不执行搜索初始化
    if (!searchInput || !searchResult) {
        return;
    }

    var path = '/search.xml';
    searchFunc(path, 'local-search-input', 'local-search-result');
};

$(document).ready(getSearchFile);
