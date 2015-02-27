
/*
 * global deviceHeight and deviceWidth parameter
 */
var dh = $(window).height(),
    dw = $(window).width(),
    bgWidth = 4972, //Raw picture widht in px
    bgHeight = 700, //Raw picture height in px
    whRatio = bgWidth / bgHeight,
    actualWidth = 4972/700 * dh;

/*
 *  resize the background image
 */
var resetBg = function(){
    dh = $(window).height(),
       dw = $(window).width(),
       actualWidth = 4972/bgHeight * dh;
    $(".site-content").height(dh).width(actualWidth);
}

var resetDog = function(){
    $(".sitting-dog").width(351 * $(window).height()/bgHeight);
}

var resetHotspot = function(){
    var hsh = 47/700 * $(window).height(),
        hsw = hsh;
    /*
       $("#hotspot-1").css({
       "left": 0.15446500402253 * actualWidth + "px",
       "top" : 432/700 * ($(window).height() >= 700 ? $(window).height() : 700)  + "px"
       });
       */

    $(".hotspot").each(function(){
        $(this).width(hsw).height(hsh);
        $(this).css({
            "left": $(this).attr("px")/bgWidth * actualWidth + "px",
            "top" : $(this).attr("py")/bgHeight * ($(window).height() >= bgHeight ? $(window).height() : bgHeight)  + "px"
        });
    });
}


var resetHotspotCt = function(){
    $(".hotspot-ct > div").each(function(){
        var w = $(this).attr("width"),
            h = $(this).attr("height"),
            nh = h/bgHeight * $(window).height(),
            nw = nh * w/h,
            ntop = ($(window).height() - nh)/2;
            $(this).height(nh).width(nw).css({"top": ntop + "px"});    
    })
}


var resize = function(){
    resetBg();
    resetDog();
    resetHotspot();
    resetHotspotCt();

    var fontRatio = 24/556,
        fontSize = $(".dump-contract").height() * fontRatio + "px";
    $(".sisters-count").css({'font-size': fontSize});
}

var scrollBg = function(pace){
    var offset = $(".site-content").offset();
    if(pace > 0){
        if(offset.left < 0){
            //scroll left
            $(".site-content").css({ 
                "left":  offset.left + (Math.abs(offset.left) > Math.abs(pace) ? Math.abs(pace) : Math.abs(offset.left))  + "px" 
            });
        }
    }else{
        if(offset.left + $(window).width() < actualWidth){
            //scrool right
            var rightOff = actualWidth - (Math.abs(offset.left) + $(window).width());
            $(".site-content").css({ 
                "left": offset.left -  (Math.abs(rightOff) > Math.abs(pace) ? Math.abs(pace) : Math.abs(rightOff)) + "px" 
            });
        }
    }
}



$(window).resize(function(e){
    resize();
});


/*
 * mousewheel event handler
 */
var wheeldelta = {
    x: 0,
    y: 0
};
var wheeling, leftOffset;

$(window).on('mousewheel', function (e) {
    e.preventDefault();
    if (!wheeling) {
        console.log('start wheeling!');
        //get starting position of offset.left
        var offset = $(".site-content").offset(),
    leftOffset = offset.left;
    }

    clearTimeout(wheeling);
    wheeling = setTimeout(function() {
        console.log('stop wheeling!');
        wheeling = undefined;

        // reset wheeldelta
        wheeldelta.x = 0;
        wheeldelta.y = 0;
        //position the dog
        var offset = $(".site-content").offset(),
             dogPace = leftOffset - offset.left;
    if(dogPace !== 0){
        if(Math.abs(offset.left)/actualWidth >= 699/bgWidth){ //dog's leftmost position is 699
            $(".sitting-dog").show();
        }else{
            $(".sitting-dog").hide();   
        }
    }
    }, 250);

    var offset = $(".site-content").offset();
        if(Math.abs(offset.left)/actualWidth < 699/bgWidth){ //dog's leftmost position is 699
            $(".sitting-dog").fadeOut();
        }else{
            if(!$(".sitting-dog").is(":visible")){
                $(".sitting-dog").fadeIn();
            }
        }

    wheeldelta.x += e.deltaFactor * e.deltaX;
    wheeldelta.y += e.deltaFactor * e.deltaY;
    console.log(wheeldelta);
    scrollBg(e.deltaY * e.deltaFactor);
});

$(function(){
    /* reset the background image when document is ready */
    resize();

    $(".hotspot").click(function(e){
        var container = "#" +  $(this).attr("id") + "-ct";
        $(container).fadeIn();
    });

    $(".hotspot-close").click(function(e){
        $(this).parent().parent().fadeOut();
    });

    $(".mag-nav-mask").mouseover(function(){
        var index = $(this).attr("val");
        $(".mag-page-ct.active").removeClass("active").addClass("inactive");
        $("#mag-page-"+index).removeClass("inactive").addClass("active");
    });
    /*
    $(".mag-nav-mask").mouseout(function(){
        $(".mag-page-ct.active").removeClass("active").addClass("inactive");
        $("#mag-page-0").removeClass("inactive").addClass("active");
    });*/

    /* hotspot 2-2 product development next page and prev page handler */
    $(".next-page-arrow").click(function(e){
        var marginLeft = "-" + $(this).parent().width() + "px";
        $(this).parents('.slide-wrapper').animate({marginLeft: marginLeft},600);
    });
    $(".prev-page-arrow").click(function(e){
        $(this).parents('.slide-wrapper').animate({marginLeft: "0"},600);
    });
});
