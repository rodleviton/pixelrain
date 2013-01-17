$(function() {
	var delay = 400;
	var divs = [];
    var original = false;
    var timer;

	for( var i = 0; i < 99; i++ ) {
		divs.push('#div-0' + (i + 1));
        var top = (Math.random()*800);
        var left = (Math.random()*1200)
        var el = $('<div id="div-0' + (i + 1) + '" class="block" style="left:' + left  + 'px; top:' + top + 'px;">' + (i +1) + '</div>');
        $(el).data({'left': left, 'top': top});
        $('#container').append(el);
	}

    var checkOverlaps = (function() {
    	
    	var element;
        
        function init(el) {
        	element = el;
            $(element).stop();
            check();
            timer =  setInterval(function(){check()}, delay);
        }

        function check(){
            console.log('timer');
            clearInterval(timer);
        	$.each(divs, function( index, value ) {
			  if(value !== element) {
			  	if($(element).overlaps(value)) {
			  		var coords = getArea(element, value);
                    animateOverlappedElement(value, coords);
			  	}
			  }
			});
        }

        function animateOverlappedElement(el, coords) {

            var leftPos;
            var topPos;
            var offset = 5;

            if(coords.xDir === 'right') {
                leftPos = coords.x;
                offset = 5;
            } else {
                leftPos = (coords.x * -1);
                offset = -5;
            }

            if(coords.yDir === 'down') {
               topPos = coords.y;
               offset = 5;
            } else {
                topPos = (coords.y * -1);
                offset = -5;
            }
            
            if(original) {
                $(el).stop().animate({'top':  ( $(el).data('top') + ( topPos + offset) ), 'left': ($(el).data('left') + ( leftPos + offset ) )}, delay, 'swing');
            } else {
                $(el).stop().animate({'top':  ( $(el).offset().top + ( topPos + offset) ), 'left': ($(el).offset().left + ( leftPos + offset ) )}, 300, 'swing');
            }

        }

        function returnAnimatedElement() {
            $.each(divs, function( index, value ) {
                //if(value !== element) {
                    $(value).stop().animate({ 'top': $(value).data('top'), 'left': $(value).data('left') }, delay, 'swing' );
                //}
            });
        }

        function getArea(el1, el2) {
            var div1 = $(el1);
            var div2 = $(el2);
            var both = div1.add( div2 );
            
            if(original) {
                var leftMost = (div1.data('left') < div2.data('left') ? div1 : div2);
            } else {
                var leftMost = (div1.offset().left < div2.offset().left ? div1 : div2);
            }
            
            var rightMost = both.not( leftMost );
            if(original) {
                var topMost = (div1.data('top') < div2.data('top') ? div1 : div2);
            } else {
                var topMost = (div1.offset().top < div2.offset().top ? div1 : div2);
            }
            var botMost = both.not( topMost );

            var xDir;
            var yDir;
            
            if(original) {
                if( ( div2.data('top') + div2.height() ) > ( div1.data('top') + div1.height() ) ) {
                    yDir = 'down';
                } else {
                    yDir = 'up';
                }
    
                if( ( div2.data('left') + div2.width() ) > ( div1.data('left') + div1.width() ) ) {
                    xDir = 'right'
                } else {
                    xDir = 'left'
                }
            } else {
                if( ( div2.offset().top  + div2.height() ) > ( div1.offset().top  + div1.height() ) ) {
                    yDir = 'down';
                } else {
                    yDir = 'up';
                }

                if( ( div2.offset().left  + div2.width() ) > ( div1.offset().left + div1.width() ) ) {
                    xDir = 'right'
                } else {
                    xDir = 'left'
                }
            }
            
            if(original) {
                var overlap = {
                            'x': (leftMost.data('left') + leftMost.outerWidth( )) - rightMost.data('left'),
                            'y': (topMost.data('top') + topMost.outerHeight( )) - botMost.data('top'),
                            'xDir': xDir,
                            'yDir': yDir
                          };
            } else {
                var overlap = {
                            'x': (leftMost.offset().left + leftMost.outerWidth( )) - rightMost.offset().left,
                            'y': (topMost.offset().top + topMost.outerHeight( )) - botMost.offset().top,
                            'xDir': xDir,
                            'yDir': yDir
                          };
            }

            return overlap;
        }

        return {
            init: init,
            returnElement: returnAnimatedElement
        }

    }());

    $('#container').on('mouseover', '.block', function() {
    	checkOverlaps.init( '#' + $(this).attr('id') );
    });

    $('#container').on('mouseout', '.block', function() {
        checkOverlaps.returnElement();
    });

});