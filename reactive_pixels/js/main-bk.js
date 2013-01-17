jQuery(document).ready(function() {
	//$('#one').overlaps('#two')
});

$(function() {
	
	var divs = [];

	for( var i = 0; i < 10; i++ ) {
		divs.push('#div-0' + (i + 1));
        var top = (Math.random()*1200);
        var left = (Math.random()*800)
        var el = $('<div id="div-0' + (i + 1) + '" class="block" style="left:' + left  + 'px; top:' + top + 'px;"></div>');
        $(el).data({'left': left, 'top': top});
        $('#container').append(el);
	}

    var checkOverlaps = (function() {
    	
    	var element;
        
        function init(el) {
        	element = el;
        	check();
        }

        function check(){
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

            $(el).stop().animate({'top':  ( $(el).data('top') + ( topPos + offset) ), 'left': ($(el).data('left') + ( leftPos + offset ) )}, 300, 'swing');
            //$(el).stop().animate({'top':  ( $(el).offset.top() + ( topPos + offset) ), 'left': ($(el).offset.left() + ( leftPos + offset ) )}, 300, 'swing');

        }

        function returnAnimatedElement() {
            $.each(divs, function( index, value ) {
                if(value !== element) {
                    $(value).stop().animate({ 'top': $(value).data('top'), 'left': $(value).data('left') }, 300, 'swing' );
                }
            });
        }

        function getArea(el1, el2) {
            var div1 = $(el1);
            var div2 = $(el2);
            var both = div1.add( div2 );

            var leftMost = (div1.data('left') < div2.data('left') ? div1 : div2);
            var rightMost = both.not( leftMost );
            var topMost = (div1.data('top') < div2.data('top') ? div1 : div2);
            var botMost = both.not( topMost );

            var xDir;
            var yDir;

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

            var overlap = {
                            'x': (leftMost.data('left') + leftMost.outerWidth( )) - rightMost.data('left'),
                            'y': (topMost.data('top') + topMost.outerHeight( )) - botMost.data('top'),
                            'xDir': xDir,
                            'yDir': yDir
                          };

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