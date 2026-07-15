/**
 * 页面点击心形动效。仅在存在心形元素时运行动画循环。
 */
(function (window, document) {
    'use strict';

    var hearts = [];
    var isAnimating = false;
    var reduceMotion = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function randomColor() {
        return 'rgb(' + ~~(255 * Math.random()) + ',' +
            ~~(255 * Math.random()) + ',' +
            ~~(255 * Math.random()) + ')';
    }

    function injectStyle() {
        var style = document.createElement('style');
        style.textContent =
            '.heart{' +
                'width:10px;height:10px;position:fixed;pointer-events:none;' +
                'background:#f00;transform:rotate(45deg);will-change:transform,opacity,top;' +
            '}' +
            '.heart::after,.heart::before{' +
                "content:'';width:inherit;height:inherit;background:inherit;" +
                'border-radius:50%;position:absolute;' +
            '}' +
            '.heart::after{top:-5px;left:0;}' +
            '.heart::before{top:0;left:-5px;}';
        document.head.appendChild(style);
    }

    function animate() {
        for (var index = hearts.length - 1; index >= 0; index--) {
            var heart = hearts[index];

            heart.y--;
            heart.scale += 0.004;
            heart.alpha -= 0.013;

            if (heart.alpha <= 0) {
                if (heart.element.parentNode) {
                    heart.element.parentNode.removeChild(heart.element);
                }
                hearts.splice(index, 1);
                continue;
            }

            heart.element.style.cssText =
                'left:' + heart.x + 'px;' +
                'top:' + heart.y + 'px;' +
                'opacity:' + heart.alpha + ';' +
                'transform:scale(' + heart.scale + ') rotate(45deg);' +
                'background:' + heart.color + ';' +
                'z-index:99999';
        }

        if (hearts.length > 0) {
            window.requestAnimationFrame(animate);
        } else {
            isAnimating = false;
        }
    }

    function createHeart(event) {
        if (reduceMotion || (typeof event.button === 'number' && event.button !== 0)) {
            return;
        }

        var element = document.createElement('span');
        element.className = 'heart';
        element.setAttribute('aria-hidden', 'true');
        document.body.appendChild(element);

        hearts.push({
            element: element,
            x: event.clientX - 5,
            y: event.clientY - 5,
            scale: 1,
            alpha: 1,
            color: randomColor()
        });

        if (!isAnimating) {
            isAnimating = true;
            window.requestAnimationFrame(animate);
        }
    }

    injectStyle();
    document.addEventListener('click', createHeart, false);
})(window, document);
