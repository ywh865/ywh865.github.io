/**
 * Phantom 主题主脚本
 * 负责：页面加载动画、表单处理、菜单交互、响应式适配
 */
(function ($) {

    // 响应式断点配置
    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large:  '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small:  '(max-width: 736px)',
        xsmall: '(max-width: 480px)'
    });

    $(function () {

        var $window = $(window),
            $body = $('body');

        // 页面加载前添加 loading 类，加载完成后移除
        $body.addClass('is-loading');

        $window.on('load', function () {
            window.setTimeout(function () {
                $body.removeClass('is-loading');
            }, 100);
        });

        // 触摸设备添加对应类名
        if (skel.vars.touch) {
            $body.addClass('is-touch');
        }

        // 表单处理
        var $form = $('form');

        // 自动调整 textarea 高度
        $form.find('textarea').each(function () {

            var $this = $(this),
                $wrapper = $('<div class="textarea-wrapper"></div>'),
                $submits = $this.find('input[type="submit"]');

            $this
                .wrap($wrapper)
                .attr('rows', 1)
                .css('overflow', 'hidden')
                .css('resize', 'none')
                .on('keydown', function (event) {
                    // Ctrl + Enter 时移除焦点
                    if (event.keyCode === 13 && event.ctrlKey) {
                        event.preventDefault();
                        event.stopPropagation();
                        $(this).blur();
                    }
                })
                .on('blur focus', function () {
                    $this.val($.trim($this.val()));
                })
                .on('input blur focus --init', function () {
                    // 根据内容滚动高度自适应
                    $wrapper.css('height', $this.height());
                    $this
                        .css('height', 'auto')
                        .css('height', $this.prop('scrollHeight') + 'px');
                })
                .on('keyup', function (event) {
                    // Tab 键全选文本
                    if (event.keyCode === 9) {
                        $this.select();
                    }
                })
                .triggerHandler('--init');

            // IE 与移动端兼容性修复
            if (skel.vars.browser === 'ie' || skel.vars.mobile) {
                $this
                    .css('max-height', '10em')
                    .css('overflow-y', 'auto');
            }

        });

        // IE 占位符兼容
        $form.placeholder();

        // 中等屏幕下优先显示重要元素
        skel.on('+medium -medium', function () {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // 菜单交互
        var $menu = $('#menu');

        $menu.wrapInner('<div class="inner"></div>');

        // 菜单切换锁，防止动画期间重复触发
        $menu._locked = false;

        $menu._lock = function () {
            if ($menu._locked) {
                return false;
            }
            $menu._locked = true;
            window.setTimeout(function () {
                $menu._locked = false;
            }, 350);
            return true;
        };

        $menu._show = function () {
            if ($menu._lock()) {
                $body.addClass('is-menu-visible');
            }
        };

        $menu._hide = function () {
            if ($menu._lock()) {
                $body.removeClass('is-menu-visible');
            }
        };

        $menu._toggle = function () {
            if ($menu._lock()) {
                $body.toggleClass('is-menu-visible');
            }
        };

        $menu
            .appendTo($body)
            .on('click', function (event) {
                event.stopPropagation();
            })
            .on('click', 'a', function (event) {
                var href = $(this).attr('href');

                event.preventDefault();
                event.stopPropagation();

                // 点击菜单链接后先关闭菜单，再跳转
                $menu._hide();

                if (href === '#menu') {
                    return;
                }

                window.setTimeout(function () {
                    window.location.href = href;
                }, 350);
            })
            .append('<a class="close" href="#menu">Close</a>');

        $body
            .on('click', 'a[href="#menu"]', function (event) {
                event.stopPropagation();
                event.preventDefault();
                $menu._toggle();
            })
            .on('click', function () {
                // 点击页面空白处关闭菜单
                $menu._hide();
            })
            .on('keydown', function (event) {
                // ESC 键关闭菜单
                if (event.keyCode === 27) {
                    $menu._hide();
                }
            });

    });

})(jQuery);
