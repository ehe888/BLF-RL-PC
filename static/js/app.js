
/*
 * global deviceHeight and deviceWidth parameter
 */
var dh = $(window).height(),
    dw = $(window).width(),
    bgWidth = 4972, //Raw picture widht in px
    bgHeight = 700, //Raw picture height in px
    bgMaxHeight = 760,
    whRatio = bgWidth / bgHeight;

var getActualSize = function(){
    var dh = $(window).height();
    var dw = $(window).width();
       
    var targetHeight; //bgHeight is 700
        
    if(dh >= bgHeight){
        if(dh <= bgMaxHeight){
            targetHeight = dh;
        }else{
            targetHeight = bgMaxHeight;
        }
    }else{
        targetHeight = bgHeight;
    }
    
    return {
        width: 4972/bgHeight * targetHeight,
        height: targetHeight
    }
}
/*
 *  resize the background image
 */
var resetBg = function(){
    dh = $(window).height();
    dw = $(window).width();
       
    var actualSize = getActualSize();        
    
    var actualWidth = actualSize.width,
        targetHeight = actualSize.height,
       offset = $(".site-content").offset();
    
    $(".site-content").height(targetHeight).width(actualWidth);
    
    //var extendedHeight = 872 * targetHeight/700;
    
    $(".extended-bg").height(dh).width(actualWidth);
    
    var gap = -1 * offset.left + dw - actualWidth;
    if(gap > 0){
        $(".site-content").css({
            "left": $(".site-content").offset().left + gap + "px"
        });
        $(".extended-bg").css({
            "left": $(".site-content").offset().left + gap + "px"
        });
    }
    
    //reset progress bar bg
    var percentage = Math.abs(offset.left) / ($(".site-content").width() - $(window).width()),
            pw = $(".progress-bar").width(),
            
            leftPos = ((pw * 0.9 - 32)* percentage) + pw * 0.05;
        $(".progress-indicator").css({
            "left": leftPos + "px"
        });
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
    var actualSize = getActualSize();        
    
    var actualWidth = actualSize.width;
    
    $(".hotspot").each(function(){
        $(this).width(hsw).height(hsh);
        $(this).css({
            "left": $(this).attr("px")/bgWidth * actualWidth + "px",
            "top" : $(this).attr("py")/bgHeight * actualSize.height  + "px"
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
    
    $('.site').height($(window).height());
    
    var fontRatio = 24/556,
        fontSize = $(".dump-contract").height() * fontRatio + "px";
    $(".sisters-count").css({'font-size': fontSize});
    
    $(".video-2-3-title span").css({ 'font-size': Math.round($(".video-2-3-title").height()/3) + "px" });
    $(".left-video-title").css({ 'font-size': Math.round($(".video-2-3-title").height()/3 * 1.2) + "px" });

    $(".video-2-4-title span").css({ 'font-size': Math.round($(".video-2-4-title").height()/2) + "px" });
    $(".left-video-title").css({ 'font-size': Math.round($(".video-2-4-title").height()/2) + "px" });
}

var scrollBg = function(pace){
    var offset = $(".site-content").offset();
    var actualSize = getActualSize();        
    var actualWidth = actualSize.width;
    
    if(pace > 0){
        if(offset.left < 0){
            //scroll left
            $(".site-content").css({ 
                "left":  offset.left + (Math.abs(offset.left) > Math.abs(pace) ? Math.abs(pace) : Math.abs(offset.left))  + "px" 
            });
            $(".extended-bg").css({ 
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
            $(".extended-bg").css({ 
                "left": offset.left -  (Math.abs(rightOff) > Math.abs(pace) ? Math.abs(pace) : Math.abs(rightOff)) + "px" 
            });
        }
    }
    
    if(offset.left < 0){
        var percentage = Math.abs(offset.left) / ($(".site-content").width() - $(window).width()),
            pw = $(".progress-bar").width(),
            
            leftPos = ((pw * 0.9 - 32)* percentage) + pw * 0.05;
        $(".progress-indicator").css({
            "left": leftPos + "px"
        });
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
var vertical = !0;
var startP;
var endP;

var scroll = function scroll(e) {
    e.preventDefault();
    var actualSize = getActualSize();  
    var actualWidth = actualSize.width;     
    
    wheeldelta.x += e.deltaFactor * e.deltaX;
    wheeldelta.y += e.deltaFactor * e.deltaY;
    if (!wheeling) {
        console.log('start wheeling!');
        //get starting position of offset.left
        var offset = $(".site-content").offset(),
            leftOffset = offset.left;
        startP = Math.abs(offset.left)/actualWidth;
        //show progress bar
        $(".progress").fadeIn(100);
        
         var tan = Math.tan(15 * Math.PI/180);
         if( Math.abs(e.deltaY) == 0  ){
             vertical = 0;
         }else{
             vertical = !0;
         }
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
        endP = Math.abs(offset.left);

        var scrollPage = (actualWidth - endP)/actualWidth;

        if (scrollPage <= 0.8 && startP < 0.2){
            ga('send','event','rollerlash','rollerlash/part2','click');
            trackingPage = 1;
        }else if(scrollPage <= 0.55&&startP <= 0.55){
            ga('send','event','rollerlash','rollerlash/part3','click');
            trackingPage = 2;
        }else if(scrollPage <=0.3&&startP <= 0.8){
            ga('send','event','rollerlash','rollerlash/part4','click');
            trackingPage = 3;
        }

        //hide progress bar
        $(".progress").fadeOut(800);
    }, 250);

    var offset = $(".site-content").offset();
    if(Math.abs(offset.left)/actualWidth < 699/bgWidth){ //dog's leftmost position is 699
        $(".sitting-dog").fadeOut();
    }else{
        if(!$(".sitting-dog").is(":visible")){
            $(".sitting-dog").fadeIn();
        }
    }

    
    
    console.log("delta x : " +  e.deltaX + "delta y : " +  e.deltaY);
    
    
    
    var tan = Math.tan(5 * Math.PI/180);
    
    console.log("vertical L " + vertical);
    if(vertical){
        scrollBg(e.deltaY * e.deltaFactor);
    }else{
        console.log("step x : " +  wheeldelta.x + "step y : " +  wheeldelta.y);
        scrollBg(e.deltaX * e.deltaFactor);
    }
};

$(window).on('mousewheel',scroll);

var videoIndicator = 0;

var scrollVideo = function scroll(e) {
    e.preventDefault();
    var actualSize = getActualSize();  
    var actualWidth = actualSize.width;
    
        
    wheeldelta.x += e.deltaFactor * e.deltaX;
    wheeldelta.y += e.deltaFactor * e.deltaY;
    
    if (!wheeling) {
        console.log('start wheeling!');
        
    }

    clearTimeout(wheeling);
    wheeling = setTimeout(function() {
        console.log('stop wheeling!');
        wheeling = undefined;
        
        var height = $(".hs-content-2-4-video-list").height(),
            point = [ height * 0.142666665, height * 0.47266665, height * 0.80266665];
        
        if(wheeldelta.y < 0){
            if(videoIndicator >= 2){
                return;
            }
            
            $(".hs-content-2-4-video-list li").each(function(e){
                if($(this).index() <= videoIndicator) {
                    //$(this).css({ "height": "0px" });
                    $(this).hide();
                } 
                
            });
            videoIndicator = (videoIndicator+1) % 5;
            $(".vprogress-indicator").css({"top": point[ videoIndicator % 3] + "px" });
        }else{
            if(videoIndicator == 0){
                return;
            }
            videoIndicator = videoIndicator > 0 ? videoIndicator-1 : 0;
            
            $(".hs-content-2-4-video-list li").each(function(e){
                console.log("$(this).index(): " + $(this).index()  + "indicator : " + videoIndicator);
                if($(this).index() >= videoIndicator) {
                    $(this).show();
                } 
                
            });
            $(".vprogress-indicator").css({"top": point[ videoIndicator % 3] + "px" });
        }
        // reset wheeldelta
        wheeldelta.x = 0;
        wheeldelta.y = 0;
        
    }, 250);

    var offset = $(".site-content").offset();
    if(Math.abs(offset.left)/actualWidth < 699/bgWidth){ //dog's leftmost position is 699
        $(".sitting-dog").fadeOut();
    }else{
        if(!$(".sitting-dog").is(":visible")){
            $(".sitting-dog").fadeIn();
        }
    }
    
};

// $(window).on('mousewheel', function (e) {

//     var actualSize = getActualSize();        
    
//     var actualWidth = actualSize.width;
    
        
//     e.preventDefault();
//     wheeldelta.x += e.deltaFactor * e.deltaX;
//     wheeldelta.y += e.deltaFactor * e.deltaY;
    
//     if (!wheeling) {
//         console.log('start wheeling!');
//         //get starting position of offset.left
//         var offset = $(".site-content").offset(),
//             leftOffset = offset.left;
        
//         //show progress bar
//         $(".progress").fadeIn(100);
        
//          var tan = Math.tan(15 * Math.PI/180);
//          if( Math.abs(e.deltaY) == 0  ){
//              vertical = 0;
//          }else{
//              vertical = !0;
//          }
//     }

//     clearTimeout(wheeling);
//     wheeling = setTimeout(function() {
//         console.log('stop wheeling!');
//         wheeling = undefined;

        
//         // reset wheeldelta
//         wheeldelta.x = 0;
//         wheeldelta.y = 0;
//         //position the dog
//         var offset = $(".site-content").offset(),
//              dogPace = leftOffset - offset.left;
//         if(dogPace !== 0){
//             if(Math.abs(offset.left)/actualWidth >= 699/bgWidth){ //dog's leftmost position is 699
//                 $(".sitting-dog").show();
//             }else{
//                 $(".sitting-dog").hide();   
//             }
//         }
        
//         //hide progress bar
//         $(".progress").fadeOut(800);
//     }, 250);

//     var offset = $(".site-content").offset();
//     if(Math.abs(offset.left)/actualWidth < 699/bgWidth){ //dog's leftmost position is 699
//         $(".sitting-dog").fadeOut();
//     }else{
//         if(!$(".sitting-dog").is(":visible")){
//             $(".sitting-dog").fadeIn();
//         }
//     }

    
    
//     console.log("delta x : " +  e.deltaX + "delta y : " +  e.deltaY);
    
    
    
//     var tan = Math.tan(5 * Math.PI/180);
    
//     console.log("vertical L " + vertical);
//     if(vertical){
//         scrollBg(e.deltaY * e.deltaFactor);
//     }else{
//         console.log("step x : " +  wheeldelta.x + "step y : " +  wheeldelta.y);
//         scrollBg(e.deltaX * e.deltaFactor);
//     }
// });



var rotating, rotateIndex=0;

var rotateMag = function(){
    clearTimeout(rotating);
    rotating = setTimeout(rotateMag, 3000);
    
    
    if(++rotateIndex  > 3){
        rotateIndex = rotateIndex % 4;
    }
    
    
    $(".mag-page-ct.active").fadeOut(500, function(){
        $(this).removeClass("active").addClass("inactive");
        
        $("#mag-page-"+rotateIndex).fadeIn(500, function(){
            $(this).removeClass("inactive").addClass("active");
        });
    });
    
    
    
    if(rotateIndex != 3){   //hide video
        $(".mag-page-3-vplayer-ct").fadeOut(function(){
            $(this).find(".video_player").html("");
        });
    }
    
}

var magzineVideo = "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XODkxMDU5MjAw&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>"

var video2_1_1 = "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XODgyNzQzOTQ4&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>";

var video2_3 = [
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAyOTU1NDky&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>", 
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAyOTU2MzI4&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>", 
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAyOTU3ODI4&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>", 
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAxMDY1ODcy&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>"];

// var video2_4_1 = "<iframe height=100% width=100% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAxMTUzOTI0&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></iframe>";

var video2_4 =[
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAxMTUzOTI0&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>",
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAxODA4OTI4&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>",
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAyMDkzNjk2&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>",
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAyOTY5MDIw&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>",
    "<embed height=102% width=101% src='http://static.youku.com/v/swf/qplayer.swf?VideoIDS=XOTAzMzQ3OTY4&isAutoPlay=true&isShowRelatedVideo=false&embedid=-&showAd=0' frameborder=0 allowfullscreen></embed>"
];

var video2_4_title = [
    "睫毛那些事儿~【九九希makeup】",
    "纠睫心事——乔琳",
    "纠睫心事——如何刷好睫毛膏",
    "菁俏妞_睫毛的秘密",
    "YUKKIK】纠“睫”心事-新手的睫毛烦恼~"
];
// 杂志视频播放
var magVideoActive = 0;

$(function(){
    /* reset the background image when document is ready */
    resize();
    
    $(".hotspot").click(function(e){
        var index = $(this).attr("id"),
            container = "#" + index + "-ct",
            videotag = "#" +  index + "-player";
        
        $(window).unbind("mousewheel");
        $(window).on('mousewheel',scrollVideo);
        
        // $(window).on("mousewheel");
        
        $(container).fadeIn(function(){
            if(index === "hotspot-1"){
                ga('send','event','rollerlash','rollerlash/star_magzine','click');
                rotating = setTimeout(rotateMag, 3000);
            }
            if(index == "hotspot-2-1"){
                ga('send','event','rollerlash','rollerlash/star_inspiration_video','click');
                //show video1
                if($(videotag)){
                    $(videotag).html(video2_1_1);
                }
            }else if(index=="hotspot-2-2"){
                    ga('send','event','rollerlash','rollerlash/star_product_story','click'); 
            }else if(index == "hotspot-2-4"){
                ga('send','event','rollerlash','rollerlash/star_kol','click');
                if($(videotag)){
                    $(videotag).html(video2_4[0]);
                }
            }else if(index == "hotspot-2-3"){
                ga('send','event','rollerlash','rollerlash/star_4video','click');
                $("#hotspot-2-3-player").html(video2_3[0]);
            }else if(index == "hotspot-3"){
                ga('send','event','rollerlash','rollerlash/star_offline','click');
            }
            
            $(".video-2-3-title span").css({ 'font-size': Math.round($(".video-2-3-title").height()/3) + "px" });
            $(".left-video-title").css({ 'font-size': Math.round($(".video-2-3-title").height()/3 * 1.2) + "px" });
            $(".video-2-4-title span").css({ 'font-size': Math.round($(".video-2-4-title").height()/2) + "px" });
            $(".left-video-title1").css({ 'font-size': Math.round($(".video-2-4-title").height()/2) + "px" });
        });        
    });

    $(".hotspot-close").click(function(e){
        $(window).unbind("mousewheel");
        $(window).on('mousewheel',scroll);
            
        console.log(magVideoActive);
        if(!magVideoActive){
            $(this).parent().parent().fadeOut();
            $(this).parent().find(".video_player").each(function(){
                $(this).html("");
            });
            $(".mag-page-3-vplayer-ct").fadeOut();
            
            
        }else{
            $(".mag-page-3-vplayer-ct").fadeOut(function(){
                $(".mag-page-3-vplayer-ct").find(".video_player").html("");
            }); 
            magVideoActive = 0;
        }
        rotateIndex = 0; 
        clearTimeout(rotating);
        $(".mag-page-ct.active").fadeOut(function(){
            $(this).removeClass("active").addClass("inactive");
        
            $("#mag-page-"+rotateIndex).fadeIn(function(){
                $(this).removeClass("inactive").addClass("active");
            });
        });
    });

    $(".mag-nav-mask").mouseover(function(){
        clearTimeout(rotating);
        var index = $(this).attr("val");
        
        $(".mag-page-ct").stop(true, true).hide();
        
        $(".mag-page-ct.active").fadeOut(500, function(){
            $(this).removeClass("active").addClass("inactive");
            $("#mag-page-"+index).removeClass("inactive").addClass("active");
            $("#mag-page-"+index).fadeIn(500, function(){
                
            });
        });
        if(index=0){ga('send','event','rollerlash','rollerlash/btn1','click');}
        if(index=1){ga('send','event','rollerlash','rollerlash/btn2','click');}
        if(index=2){ga('send','event','rollerlash','rollerlash/btn3','click');}       
        
        if(index != 3){   //hide video
            $(".").fadeOut(function(){
                $(this).find(".video_player").html("");
            });
        }
    });
    /*
    $(".mag-nav-mask").mouseout(function(){
        $(".mag-page-ct.active").removeClass("active").addClass("inactive");
        $("#mag-page-0").removeClass("inactive").addClass("active");
    });*/
    
    /* hotspot 2-2 product development next page and prev page handler */
    $(".next-page-arrow").click(function(e){
        var marginLeft = "-" + $(this).parent().width() + "px";
        $(this).parents('.slide-wrapper').animate({marginLeft: marginLeft}, 600);
    });
    $(".prev-page-arrow").click(function(e){
        $(this).parents('.slide-wrapper').animate({marginLeft: "0"}, 600);
    });
    
    //show the video
    $(".mag-page-3-video-preview").click(function(e){
        clearTimeout(rotating);
        $(".mag-page-3-vplayer-ct").fadeIn(function(){
            $(this).find(".video_player").html(magzineVideo);
        });
        magVideoActive = 1;
    })
    $(".mag-page-3-vplayer-ct").hover(function(){
        $(".video_player_close").fadeIn();
    });
    
    
    $(".video_player_close").click(function(){  
        $(".mag-page-3-vplayer-ct").fadeOut(function(){
            $(this).find(".video_player").html("");
        }); 
        magVideoActive = 0; 
    });
    
    $(".video-2-3-preview").click(function(e){
        var index = $(this).parents("li").index();
        $(".left-video-title").html($(this).parent().find(".video-2-3-title").html());
        $("#hotspot-2-3-player").html(video2_3[index]);
        $(".video-2-3-preview").removeClass("active");
        $(this).addClass("active");
        $(".video-2-3-preview").each(function(){
                console.log("each");
                $(this).find(".play_btn").hide();
                $(this).css({
                    "border": "#C66471",
                    "border-style": "solid",
                    "border-size": "1px"
                });
        });
        $(this).css({
            "border": "#FFF",
            "border-style": "solid",
            "border-size": "1px"
        });
        $(this).find(".play_btn").show();
    });
    $(".video-2-4-preview").click(function(e){
        var index = $(this).parents("li").index();
        $(".left-video-title1 span").html(video2_4_title[index]);
        $("#hotspot-2-4-player").html(video2_4[index]);
        $(".video-2-4-preview").removeClass("active");
        $(this).addClass("active");
        $(".video-2-4-preview").each(function(){
                console.log("each");
                $(this).find(".play_btn").hide();
                $(this).css({
                    "border": "#C66471",
                    "border-style": "solid",
                    "border-size": "1px"
                });
        });
        $(this).css({
            "border": "#FFF",
            "border-style": "solid",
            "border-size": "1px"
        });
        $(this).find(".play_btn").show();

    });
    
    //mouseover 改变视频边框颜色
    $(".video-2-3-preview").mouseover(function(e){        
        $(".video-2-3-preview").each(function(){
            if(!$(this).hasClass("active")){
                $(this).find(".play_btn").hide();
                $(this).css({
                    "border": "#C66471",
                    "border-style": "solid",
                    "border-size": "1px"
                });
            }
        });
                        
        $(this).css({
            "border": "#FFF",
            "border-style": "solid",
            "border-size": "1px"
        });
        $(this).find(".play_btn").show();
    });
    $(".video-2-3-preview").mouseout(function(){
        
        if($(this).hasClass("active")){
            return;
        }
        $(this).css({
            "border": "#C66471",
            "border-style": "solid",
            "border-size": "1px"
        });
        $(this).find(".play_btn").hide();
    });
    
    //mouseover 改变视频边框颜色
    $(".video-2-4-preview").mouseover(function(e){        
        
        $(".video-2-4-preview").each(function(){
            if(!$(this).hasClass("active")){
                $(this).find(".play_btn").hide();
                $(this).css({
                    "border": "#C66471",
                    "border-style": "solid",
                    "border-size": "1px"
                });
            }
        });
        
                
        $(this).css({
            "border": "#FFF",
            "border-style": "solid",
            "border-size": "1px"
        });
        $(this).find(".play_btn").show();
    });
    
    
    $(".video-2-4-preview").mouseout(function(){
        if($(this).hasClass("active")){
            return;
        }
        $(this).css({
            "border": "#C66471",
            "border-style": "solid",
            "border-size": "1px"
        });
        $(this).find(".play_btn").hide();
    });
});



//tracking code
    $(".sitting-dog").click(function(){
        ga('send','event','rollerlash','rollerlash/toec','click');
    })




    

