$(function() {
    var delay = 400;
    var divs = [];
    var original = false;
    var offset = 10;
    var timer;

    for (var i = 0; i < 30; i++) {
        divs.push('#div-0' + (i + 1));
        var top = (Math.random() * 800);
        var left = (Math.random() * 1200);
        //-webkit-transform: rotate(' + (Math.random() * 360) + 'deg);
        var el = $('<div id="div-0' + (i + 1) + '" class="block" style="left:' + left + 'px; top:' + top + 'px;">' + (i + 1) + '</div>');
        $(el).data({
            'left': left,
            'top': top
        });
        $('#container').append(el);
    }

    var checkOverlaps = (function() {

        var element;

        function init(el) {
            element = el;
            $(element).stop();
            check();
            timer = setInterval(function() {
                check()
            }, delay);
        }

        function check() {
            console.log('timer');
            clearInterval(timer);
            $.each(divs, function(index, value) {
                if (value !== element) {
                    if ($(element).overlaps(value)) {
                        var coords = getArea(element, value);
                        animateOverlappedElement(value, coords);
                    }
                }
            });
        }

        function animateOverlappedElement(el, coords) {

            var leftPos;
            var topPos;
            var _offset;

            if (coords.xDir === 'right') {
                leftPos = coords.x;
                _offset = offset;
            }
            else {
                leftPos = (coords.x * -1);
                _offset = (offset * -1);
            }

            if (coords.yDir === 'down') {
                topPos = coords.y;
                _offset = offset;
            }
            else {
                topPos = (coords.y * -1);
                _offset = (offset * -1);
            }

            $(el).stop().animate({
                'top': ($(el).offset().top + (topPos + _offset)),
                'left': ($(el).offset().left + (leftPos + _offset))
            }, 300, 'swing');

        }

        function returnAnimatedElement() {
            $.each(divs, function(index, value) {
                $(value).stop().animate({
                    'top': $(value).data('top'),
                    'left': $(value).data('left')
                }, delay, 'swing');
            });
        }

        function getArea(el1, el2) {
            var div1 = $(el1);
            var div2 = $(el2);
            var both = div1.add(div2);

            var leftMost = (div1.offset().left < div2.offset().left ? div1 : div2);
            var rightMost = both.not(leftMost);
            var topMost = (div1.offset().top < div2.offset().top ? div1 : div2);
            var botMost = both.not(topMost);

            var xDir;
            var yDir;

            if ((div2.offset().top + div2.height()) > (div1.offset().top + div1.height())) {
                yDir = 'down';
            }
            else {
                yDir = 'up';
            }

            if ((div2.offset().left + div2.width()) > (div1.offset().left + div1.width())) {
                xDir = 'right';
            }
            else {
                xDir = 'left';
            }

            var overlap = {
                'x': (leftMost.offset().left + leftMost.outerWidth()) - rightMost.offset().left,
                'y': (topMost.offset().top + topMost.outerHeight()) - botMost.offset().top,
                'xDir': xDir,
                'yDir': yDir
            };

            return overlap;
        }

        return {
            init: init,
            returnElement: returnAnimatedElement
        };

    }());

    $('#container').on('mouseover', '.block', function() {
        checkOverlaps.init('#' + $(this).attr('id'));
    });

    $('#container').on('mouseout', '.block', function() {
        checkOverlaps.returnElement();
    });

});