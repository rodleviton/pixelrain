$(document).ready(function() {

	$('body').css({'height' :  $(window).height(), 'overflow' : 'hidden'});

	var segments = new Array();
	var depth = ["one", "two", "three", "four", "five"];
	var segX = 30;
	var segY = 15;
	var gridSegWidth = ($('body').width() / segX);
	var gridSegHeight = ($('body').height() / segY);
	
   	var x = Math.ceil($(window).width() / gridSegWidth);
	var y = Math.ceil($(window).height() / gridSegHeight);
	
	var total = ((x * y) - segX);

	var row = 0;
	var col = 0;

	for(var i = 0; i < total; i++){

		if((i%segX === 0) && (i !== 0)){
			col = 0;
			row++;
		}
		_seg = $('<div class="seg" style="width: ' +  gridSegWidth + 'px; height: ' +  gridSegHeight +'px;"></div>');
		$(_seg).css({'position' :  'absolute', 'top' : -(gridSegHeight), 'left' : 0});

		segments.push({'object' : _seg, 'left' : (col * gridSegWidth), 'top' : (row * gridSegHeight), 'class' : depth[Math.floor(Math.random()*depth.length)]});

		col++;
	}

	addSegments();

    function addSegments(){
		$.each(segments, function(index) {
			$('#container').append(segments[index].object);
			$(segments[index].object).addClass(segments[index].class);
			$(segments[index].object).css({'left' : segments[index].left});
			$(segments[index].object).delay((Math.random() * 500)).animate({'top' : segments[index].top}, (Math.random() * 1000));
		});
	}

	jQuery('.seg').click(function() {
        removeSegments();
        //flicker();
    });

    function removeSegments(){
		$.each(segments, function(index) {

			$(segments[index].object).delay((Math.random() * 500)).animate({'top' : -(gridSegHeight + 20) }, (Math.random() * 1000));
		});
	}

});

