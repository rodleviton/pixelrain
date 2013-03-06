var elemArray = [];
var BASE_WIDTH = 210;
var BASE_HEIGHT = 140;
var num = [-1, 1];
var offset = 6; //Allows for border

$(document).ready(function() {
    createItems();
    $('.block').click(function() {
        removeItems();
    });
});

function createItems() {
    //Shadow Array
    var depth = ["one", "two", "three", "four"];
    var totalItems = 106;

    // x configuration
    var xConfig = getConfigX(BASE_WIDTH, BASE_HEIGHT);
    var itemWidth = xConfig.itemWidth;
    var itemHeight = xConfig.itemHeight;
    var itemsX = xConfig.items;

    var row = 0;
    var col = 0;
    for (var i = 0; i < totalItems; i++) {
        if (((i % itemsX) === 0) && (i !== 0)) {
            col = 0;
            row++;
        }
        _item = $('<div class="block"><div class="inner"><div class="shadow ' + depth[Math.floor(Math.random() * depth.length)] + '">' + (i + 1) + '</div></div></div>');
        $(_item).css({
            'position': 'absolute',
            'left': (itemWidth * col),
            'top': (itemHeight * row),
            'width': (itemWidth - offset),
            'height': (itemHeight - offset)
        });
        $('#container').append(_item);

        // Add items to array
        $(_item).data('elem', i); // Used to reference element in array
        elemArray[$(_item).data('elem')] = ({
            'obj': _item,
            'x': $(_item).css('left'),
            'y': $(_item).css('top')
        });

        //Setup hover listener
        addListener(_item);

        col++;
    }
}

function updateItems() {

    var xConfig = getConfigX(BASE_WIDTH, BASE_HEIGHT);
    var itemWidth = xConfig.itemWidth;
    var itemHeight = xConfig.itemHeight;
    var itemsX = xConfig.items;

    var row = 0;
    var col = 0;
    for (var i = 0; i < elemArray.length; i++) {
        if (((i % itemsX) === 0) && (i !== 0)) {
            col = 0;
            row++;
        }
        elemArray[i].x = itemWidth * col;
        elemArray[i].y = itemHeight * row;
        elemArray[i].width = (itemWidth - offset);
        elemArray[i].height = (itemHeight - offset);

        col++;
    }
    updateScreen();
}

function updateScreen() {

    $.each(elemArray, function(index) {
        
        TweenLite.to(elemArray[index].obj, (Math.random() * 1), 
            {
                width: elemArray[index].width,
                height: elemArray[index].height,
                top: elemArray[index].y,
                left: elemArray[index].x,
                delay: (Math.random() * .5),
                ease:Power2.easeInOut
            });

    });

}

function getConfigX(width, height) {
    var _items = ($(window).width() / width);
    var _width = ((_items * width) / Math.ceil(_items));
    var _height = ((_items * height) / Math.ceil(_items));
    return {
        'items': Math.ceil(_items),
        'itemWidth': _width,
        'itemHeight': _height
    };
}

function removeItems() {
    $.each(elemArray, function(index) {
        $(elemArray[index].obj).addClass('animating');
            
            TweenLite.to(elemArray[index].obj, (Math.random() * 1.5), 
            {
                top: (screen.height * num[Math.floor(Math.random() * num.length)]),
                left: (screen.width * num[Math.floor(Math.random() * num.length)]),
                delay: (Math.random() * .5),
                ease:Power2.easeInOut
            });
        
    });
}

function returnItems() {
    $.each(elemArray, function(index) {

        TweenLite.to(elemArray[index].obj, (Math.random() * 3), 
            {
                top: elemArray[index].y,
                left: elemArray[index].x,
                delay: (Math.random() * .5),
                ease:Power2.easeInOut
            });        
    });
}

function addListener(el) {
    $(el).hover(
        function() {
            $(this).css('z-index', 20);
        },
        function() {
            $(this).css('z-index', 10);
        }
    );
}

function debouncer(func, timeout) {
    var timeoutID, timeout = timeout || 200;
    return function() {
        var scope = this,
            args = arguments;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(function() {
            func.apply(scope, Array.prototype.slice.call(args));
        }, timeout);
    }
}

$(window).resize(debouncer(function(e) {
    updateItems();
}));

$(function() {
    $("body").mousewheel(function(event, delta) {
        scrollHeight = 250;
        event.preventDefault();
        $('body').stop().animate({
            scrollTop: $('body').scrollTop() + (-delta * scrollHeight)
        }, 600);
    });
});