/**
 * 基于 hexo-generator-searchdb 的本地全文搜索。
 */
(function (window, document, $) {
    'use strict';

    var closeButton = '<button id="local-search-close" type="button" aria-label="清空搜索">×</button>';

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[character];
        });
    }

    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function stripHtml(value) {
        var container = document.createElement('div');
        container.innerHTML = value;
        return container.textContent || container.innerText || '';
    }

    function highlight(text, keywords) {
        var terms = keywords.slice().sort(function (left, right) {
            return right.length - left.length;
        });
        var pattern = new RegExp('(' + terms.map(escapeRegExp).join('|') + ')', 'gi');
        var result = '';
        var lastIndex = 0;

        text.replace(pattern, function (match, _group, offset) {
            result += escapeHtml(text.slice(lastIndex, offset));
            result += '<em class="search-keyword">' + escapeHtml(match) + '</em>';
            lastIndex = offset + match.length;
            return match;
        });

        return result + escapeHtml(text.slice(lastIndex));
    }

    function sameOriginUrl(path) {
        try {
            var url = new URL(path, window.location.origin);
            return url.origin === window.location.origin ? url.href : '#';
        } catch (_error) {
            return '#';
        }
    }

    function renderMessage(resultElement, message) {
        resultElement.innerHTML = closeButton +
            '<p class="local-search-empty">' + escapeHtml(message) + '</p>';
    }

    window.searchFunc = function (path, searchId, contentId) {
        var input = document.getElementById(searchId);
        var resultContent = document.getElementById(contentId);

        if (!input || !resultContent || input.getAttribute('data-search-initialized') === 'true') {
            return;
        }

        input.setAttribute('data-search-initialized', 'true');
        renderMessage(resultContent, '正在载入索引文件，请稍后……');

        $.ajax({
            url: path,
            dataType: 'xml',
            success: function (xmlResponse) {
                var entries = $('entry', xmlResponse).map(function () {
                    return {
                        title: $('title', this).text().trim() || 'Untitled',
                        content: stripHtml($('content', this).text()).trim(),
                        url: $('url', this).text()
                    };
                }).get();

                resultContent.innerHTML = '';

                input.addEventListener('input', function () {
                    var query = this.value.trim().toLowerCase();
                    var keywords = query.split(/[\s-]+/).filter(Boolean);
                    var resultHtml = '<ul class="search-result-list">';
                    var matchCount = 0;

                    resultContent.innerHTML = '';
                    if (keywords.length === 0) {
                        return;
                    }

                    entries.forEach(function (entry) {
                        var lowerTitle = entry.title.toLowerCase();
                        var lowerContent = entry.content.toLowerCase();
                        var isMatch = keywords.every(function (keyword) {
                            return lowerTitle.indexOf(keyword) >= 0 || lowerContent.indexOf(keyword) >= 0;
                        });

                        if (!isMatch) {
                            return;
                        }

                        matchCount++;
                        resultHtml += '<li><a href="' + escapeHtml(sameOriginUrl(entry.url)) +
                            '" class="search-result-title" target="_blank" rel="noopener noreferrer">' +
                            highlight(entry.title, keywords) + '</a>';

                        var firstOccurrence = -1;
                        keywords.forEach(function (keyword) {
                            var index = lowerContent.indexOf(keyword);
                            if (index >= 0 && (firstOccurrence < 0 || index < firstOccurrence)) {
                                firstOccurrence = index;
                            }
                        });

                        if (firstOccurrence >= 0) {
                            var start = Math.max(0, firstOccurrence - 20);
                            var end = Math.min(entry.content.length, firstOccurrence + 80);
                            resultHtml += '<p class="search-result">' +
                                highlight(entry.content.slice(start, end), keywords) + '...</p>';
                        }

                        resultHtml += '</li>';
                    });

                    resultHtml += '</ul>';
                    if (matchCount === 0) {
                        renderMessage(resultContent, '没有找到内容，请尝试更换检索词。');
                        return;
                    }

                    resultContent.innerHTML = closeButton + resultHtml;
                });
            },
            error: function () {
                input.removeAttribute('data-search-initialized');
                renderMessage(resultContent, '搜索索引加载失败，请刷新页面后重试。');
            }
        });
    };

    window.getSearchFile = function () {
        var input = document.getElementById('local-search-input');
        var result = document.getElementById('local-search-result');

        if (!input || !result) {
            return;
        }

        var root = document.documentElement.getAttribute('data-root') || '/';
        var indexPath = root.replace(/\/?$/, '/') + 'search.xml';
        window.searchFunc(indexPath, input.id, result.id);
    };

    $(document).on('click', '#local-search-close', function () {
        $('#local-search-input').val('').trigger('focus');
        $('#local-search-result').empty();
    });

    $(window.getSearchFile);
})(window, document, jQuery);
