/**
 * 主题工具函数库
 * 提供：导航列表生成、面板组件、placeholder 兼容、元素优先级排序
 */
(function ($) {

    'use strict';

    /**
     * 将导航菜单转换为带缩进的链接列表
     * 通常与 panel() 配合使用
     * @return {string} HTML 字符串
     */
    $.fn.navList = function () {
        var $this = $(this);
        var $a = $this.find('a');
        var links = [];

        $a.each(function () {
            var $item = $(this);
            var indent = Math.max(0, $item.parents('li').length - 1);
            var href = $item.attr('href');
            var target = $item.attr('target');

            links.push(
                '<a ' +
                    'class="link depth-' + indent + '"' +
                    (typeof target !== 'undefined' && target !== '' ? ' target="' + target + '"' : '') +
                    (typeof href !== 'undefined' && href !== '' ? ' href="' + href + '"' : '') +
                '>' +
                    '<span class="indent-' + indent + '"></span>' +
                    $item.text() +
                '</a>'
            );
        });

        return links.join('');
    };

    /**
     * 将元素转换为可滑出的面板组件
     * @param {object} userConfig - 用户配置
     * @return {jQuery} jQuery 对象
     */
    $.fn.panel = function (userConfig) {

        // 无元素时直接返回
        if (this.length === 0) {
            return $(this);
        }

        // 多个元素时逐个初始化
        if (this.length > 1) {
            for (var i = 0; i < this.length; i++) {
                $(this[i]).panel(userConfig);
            }
            return $(this);
        }

        var $this = $(this);
        var $body = $('body');
        var $window = $(window);
        var id = $this.attr('id');

        // 合并默认配置与用户配置
        var config = $.extend({
            delay: 0,                 // 动画延迟
            hideOnClick: false,       // 点击链接时是否隐藏面板
            hideOnEscape: false,      // 按 ESC 时是否隐藏面板
            hideOnSwipe: false,       // 滑动时是否隐藏面板
            resetScroll: false,       // 隐藏时是否重置滚动位置
            resetForms: false,        // 隐藏时是否重置表单
            side: null,               // 面板出现方向
            target: $this,            // 切换 class 的目标元素
            visibleClass: 'visible'   // 可见状态 class
        }, userConfig);

        // 确保 target 为 jQuery 对象
        if (typeof config.target !== 'object' || !(config.target instanceof jQuery)) {
            config.target = $(config.target);
        }

        /**
         * 隐藏面板
         * @param {Event} event - 可选事件对象
         */
        $this._hide = function (event) {
            if (!config.target.hasClass(config.visibleClass)) {
                return;
            }

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            config.target.removeClass(config.visibleClass);

            window.setTimeout(function () {
                if (config.resetScroll) {
                    $this.scrollTop(0);
                }

                if (config.resetForms) {
                    $this.find('form').each(function () {
                        this.reset();
                    });
                }
            }, config.delay);
        };

        // 修复 IE / WebKit 滚动条样式
        $this
            .css('-ms-overflow-style', '-ms-autohiding-scrollbar')
            .css('-webkit-overflow-scrolling', 'touch');

        // 点击链接时隐藏面板并跳转
        if (config.hideOnClick) {
            $this.find('a').css('-webkit-tap-highlight-color', 'rgba(0,0,0,0)');

            $this.on('click', 'a', function (event) {
                var $a = $(this);
                var href = $a.attr('href');
                var target = $a.attr('target');

                if (!href || href === '#' || href === '' || href === '#' + id) {
                    return;
                }

                event.preventDefault();
                event.stopPropagation();

                $this._hide();

                window.setTimeout(function () {
                    if (target === '_blank') {
                        window.open(href);
                    } else {
                        window.location.href = href;
                    }
                }, config.delay + 10);
            });
        }

        // 触摸滑动处理
        $this.on('touchstart', function (event) {
            $this.touchPosX = event.originalEvent.touches[0].pageX;
            $this.touchPosY = event.originalEvent.touches[0].pageY;
        });

        $this.on('touchmove', function (event) {
            if ($this.touchPosX === null || $this.touchPosY === null) {
                return;
            }

            var diffX = $this.touchPosX - event.originalEvent.touches[0].pageX;
            var diffY = $this.touchPosY - event.originalEvent.touches[0].pageY;
            var th = $this.outerHeight();
            var ts = $this.get(0).scrollHeight - $this.scrollTop();

            // 根据配置方向判断是否滑动隐藏
            if (config.hideOnSwipe) {
                var result = false;
                var boundary = 20;
                var delta = 50;

                switch (config.side) {
                    case 'left':
                        result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
                        break;
                    case 'right':
                        result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
                        break;
                    case 'top':
                        result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY > delta);
                        break;
                    case 'bottom':
                        result = (diffX < boundary && diffX > (-1 * boundary)) && (diffY < (-1 * delta));
                        break;
                    default:
                        break;
                }

                if (result) {
                    $this.touchPosX = null;
                    $this.touchPosY = null;
                    $this._hide();
                    return false;
                }
            }

            // 阻止面板上下滑动的过度滚动
            if (($this.scrollTop() < 0 && diffY < 0) ||
                (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {
                event.preventDefault();
                event.stopPropagation();
            }
        });

        // 阻止面板内部事件冒泡
        $this.on('click touchend touchstart touchmove', function (event) {
            event.stopPropagation();
        });

        // 点击指向面板 ID 的锚点时隐藏面板
        $this.on('click', 'a[href="#' + id + '"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.removeClass(config.visibleClass);
        });

        // 点击页面空白处隐藏面板
        $body.on('click touchend', function (event) {
            $this._hide(event);
        });

        // 点击触发按钮切换面板
        $body.on('click', 'a[href="#' + id + '"]', function (event) {
            event.preventDefault();
            event.stopPropagation();
            config.target.toggleClass(config.visibleClass);
        });

        // 按 ESC 隐藏面板
        if (config.hideOnEscape) {
            $window.on('keydown', function (event) {
                if (event.keyCode === 27) {
                    $this._hide(event);
                }
            });
        }

        return $this;
    };

    /**
     * placeholder 属性 polyfill（主要用于旧版 IE）
     * @return {jQuery} jQuery 对象
     */
    $.fn.placeholder = function () {

        // 浏览器原生支持则直接返回
        if (typeof (document.createElement('input')).placeholder !== 'undefined') {
            return $(this);
        }

        // 无元素或多元素时的处理
        if (this.length === 0) {
            return $(this);
        }

        if (this.length > 1) {
            for (var j = 0; j < this.length; j++) {
                $(this[j]).placeholder();
            }
            return $(this);
        }

        var $this = $(this);

        // 文本框与文本域
        $this.find('input[type=text], textarea')
            .each(function () {
                var i = $(this);
                if (i.val() === '' || i.val() === i.attr('placeholder')) {
                    i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
                }
            })
            .on('blur', function () {
                var i = $(this);
                if (i.attr('name').match(/-polyfill-field$/)) {
                    return;
                }
                if (i.val() === '') {
                    i.addClass('polyfill-placeholder').val(i.attr('placeholder'));
                }
            })
            .on('focus', function () {
                var i = $(this);
                if (i.attr('name').match(/-polyfill-field$/)) {
                    return;
                }
                if (i.val() === i.attr('placeholder')) {
                    i.removeClass('polyfill-placeholder').val('');
                }
            });

        // 密码框：使用克隆的文本框模拟 placeholder
        $this.find('input[type=password]').each(function () {
            var i = $(this);
            var x = $($('<div>')
                .append(i.clone())
                .remove()
                .html()
                .replace(/type="password"/i, 'type="text"')
                .replace(/type=password/i, 'type=text'));

            if (i.attr('id') !== '') {
                x.attr('id', i.attr('id') + '-polyfill-field');
            }
            if (i.attr('name') !== '') {
                x.attr('name', i.attr('name') + '-polyfill-field');
            }

            x.addClass('polyfill-placeholder')
                .val(x.attr('placeholder'))
                .insertAfter(i);

            if (i.val() === '') {
                i.hide();
            } else {
                x.hide();
            }

            i.on('blur', function (event) {
                event.preventDefault();
                var placeholder = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');
                if (i.val() === '') {
                    i.hide();
                    placeholder.show();
                }
            });

            x.on('focus', function (event) {
                event.preventDefault();
                var realInput = x.parent().find('input[name=' + x.attr('name').replace('-polyfill-field', '') + ']');
                x.hide();
                realInput.show().focus();
            }).on('keypress', function (event) {
                event.preventDefault();
                x.val('');
            });
        });

        // 表单提交与重置时清理 placeholder
        $this
            .on('submit', function () {
                $this.find('input[type=text], input[type=password], textarea').each(function () {
                    var i = $(this);
                    if (i.attr('name').match(/-polyfill-field$/)) {
                        i.attr('name', '');
                    }
                    if (i.val() === i.attr('placeholder')) {
                        i.removeClass('polyfill-placeholder');
                        i.val('');
                    }
                });
            })
            .on('reset', function (event) {
                event.preventDefault();

                $this.find('select').val($('option:first').val());

                $this.find('input, textarea').each(function () {
                    var i = $(this);
                    var x;

                    i.removeClass('polyfill-placeholder');

                    switch (this.type) {
                        case 'submit':
                        case 'reset':
                            break;
                        case 'password':
                            i.val(i.attr('defaultValue'));
                            x = i.parent().find('input[name=' + i.attr('name') + '-polyfill-field]');
                            if (i.val() === '') {
                                i.hide();
                                x.show();
                            } else {
                                i.show();
                                x.hide();
                            }
                            break;
                        case 'checkbox':
                        case 'radio':
                            i.attr('checked', i.attr('defaultValue'));
                            break;
                        case 'text':
                        case 'textarea':
                            i.val(i.attr('defaultValue'));
                            if (i.val() === '') {
                                i.addClass('polyfill-placeholder');
                                i.val(i.attr('placeholder'));
                            }
                            break;
                        default:
                            i.val(i.attr('defaultValue'));
                            break;
                    }
                });
            });

        return $this;
    };

    /**
     * 根据条件将元素移动到父元素顶部或恢复原位
     * @param {jQuery|string} $elements - 要移动的元素
     * @param {boolean} condition - true 移动到顶部，false 恢复
     */
    $.prioritize = function ($elements, condition) {
        var key = '__prioritize';

        // 确保是 jQuery 对象
        if (!$elements || !($elements instanceof jQuery)) {
            $elements = $($elements);
        }

        $elements.each(function () {
            var $e = $(this);
            var $p;
            var $parent = $e.parent();

            if ($parent.length === 0) {
                return;
            }

            // 尚未移动过
            if (!$e.data(key)) {
                if (!condition) {
                    return;
                }

                // 记录前一个兄弟元素作为恢复位置的参考
                $p = $e.prev();
                if ($p.length === 0) {
                    return;
                }

                $e.prependTo($parent);
                $e.data(key, $p);
            }
            // 已经移动过
            else {
                if (condition) {
                    return;
                }

                $p = $e.data(key);
                $e.insertAfter($p);
                $e.removeData(key);
            }
        });
    };

})(jQuery);
