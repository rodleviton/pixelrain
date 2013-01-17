var elemArray = [];
var BASE_WIDTH = 200;
var num = [-1, 1];

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
    var xConfig = getConfigX(BASE_WIDTH);
    var itemWidth = xConfig.itemWidth;
    var itemsX = xConfig.items;

    var row = 0;
    var col = 0;
    for (var i = 0; i < totalItems; i++) {
        if (((i % itemsX) === 0) && (i !== 0)) {
            col = 0;
            row++;
        }
        _item = $('<div class="block"><div class="inner"><div class="shadow ' + depth[Math.floor(Math.random() * depth.length)] + '"></div></div></div>');
        $(_item).css({
            'position': 'absolute',
            'left': (itemWidth * col),
            'top': (itemWidth * row),
            'width': itemWidth,
            'height': itemWidth
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

    // x configuration
    var xConfig = getConfigX(BASE_WIDTH);
    var itemWidth = xConfig.itemWidth;
    var itemsX = xConfig.items;

    var row = 0;
    var col = 0;
    for (var i = 0; i < elemArray.length; i++) {
        if (((i % itemsX) === 0) && (i !== 0)) {
            col = 0;
            row++;
        }
        elemArray[i].x = itemWidth * col;
        elemArray[i].y = itemWidth * row;
        elemArray[i].width = itemWidth;
        elemArray[i].height = itemWidth;

        col++;
    }
    updateScreen();
}

function updateScreen() {
    // Need to update item then have a condition to check if items are currently being displayed
    $.each(elemArray, function(index) {
        $(elemArray[index].obj).delay(Math.random() * 500).animate({
            'top': elemArray[index].y,
            'left': elemArray[index].x,
            'width': elemArray[index].width,
            'height': elemArray[index].height
        }, Math.random() * 1000);
    });
}

function getConfigX(width) {
    var _items = ($(window).width() / width);
    var _width = ((_items * width) / Math.ceil(_items));
    return {
        'items': Math.ceil(_items),
        'itemWidth': _width
    };
}

function removeItems() {
    $.each(elemArray, function(index) {
        $(elemArray[index].obj).addClass('animating');
        $(elemArray[index].obj).delay(Math.random() * 500).animate({
            'top': (screen.height * num[Math.floor(Math.random() * num.length)]),
            'left': (screen.width * num[Math.floor(Math.random() * num.length)])
        }, Math.random() * 1000);
    });
}

function returnItems() {
    $.each(elemArray, function(index) {
        $(elemArray[index].obj).delay(Math.random() * 500).animate({
            'top': elemArray[index].y,
            'left': elemArray[index].x
        }, Math.random() * 1000);
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