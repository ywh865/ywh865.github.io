/**
 * 页面点击小红心特效
 * 点击页面任意位置时在鼠标处生成一个逐渐飘升、淡出的心形元素
 */
(function (window, document) {

    'use strict';

    // 所有活跃心形元素的集合
    var hearts = [];

    /**
     * 生成随机 RGB 颜色
     * @returns {string} RGB 颜色字符串
     */
    function randomColor() {
        return 'rgb(' + ~~(255 * Math.random()) + ',' + ~~(255 * Math.random()) + ',' + ~~(255 * Math.random()) + ')';
    }

    /**
     * 在页面 head 中插入心形元素的样式
     */
    function injectStyle() {
        var style = document.createElement('style');
        style.type = 'text/css';

        var css = '.heart{' +
            'width:10px;height:10px;position:fixed;background:#f00;' +
            'transform:rotate(45deg);-webkit-transform:rotate(45deg);-moz-transform:rotate(45deg);' +
            '}' +
            '.heart:after,.heart:before{' +
            "content:'';width:inherit;height:inherit;background:inherit;border-radius:50%;" +
            '-webkit-border-radius:50%;-moz-border-radius:50%;position:fixed;' +
            '}' +
            '.heart:after{top:-5px;}' +
            '.heart:before{left:-5px;}';

        try {
            style.appendChild(document.createTextNode(css));
        } catch (e) {
            style.styleSheet.cssText = css;
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    }

    /**
     * 创建一个新的心形元素
     * @param {MouseEvent} event 鼠标点击事件
     */
    function createHeart(event) {
        var heart = document.createElement('div');
        heart.className = 'heart';

        hearts.push({
            el: heart,
            x: event.clientX - 5,
            y: event.clientY - 5,
            scale: 1,
            alpha: 1,
            color: randomColor()
        });

        document.body.appendChild(heart);
    }

    /**
     * 绑定点击事件，保留原有 onclick 逻辑
     */
    function bindClick() {
        var originalClick = window.onclick;

        window.onclick = function (event) {
            if (typeof originalClick === 'function') {
                originalClick(event);
            }
            createHeart(event);
        };
    }

    /**
     * 动画循环：更新并移除已消失的心形
     */
    function animate() {
        for (var i = 0; i < hearts.length; i++) {
            var heart = hearts[i];

            if (heart.alpha <= 0) {
                // 完全透明后从 DOM 与数组中移除
                document.body.removeChild(heart.el);
                hearts.splice(i, 1);
                i--;
            } else {
                // 向上飘升、放大、淡出
                heart.y--;
                heart.scale += 0.004;
                heart.alpha -= 0.013;

                heart.el.style.cssText =
                    'left:' + heart.x + 'px;' +
                    'top:' + heart.y + 'px;' +
                    'opacity:' + heart.alpha + ';' +
                    'transform:scale(' + heart.scale + ',' + heart.scale + ') rotate(45deg);' +
                    'background:' + heart.color + ';' +
                    'z-index:99999';
            }
        }

        requestAnimationFrame(animate);
    }

    /**
     * 初始化：兼容不同浏览器的 requestAnimationFrame
     */
    function init() {
        window.requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 1000 / 60);
            };

        injectStyle();
        bindClick();
        animate();
    }

    init();

})(window, document);
