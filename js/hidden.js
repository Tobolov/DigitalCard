/*Codehints to remove superfluous warnings*/
/*jshint loopfunc: true */
/*global Pace */

var data, currentscale;
var conceal = false;
var staticscale = 0.45043792576115665; //1920x1080
var boxx, width;
var previousVol = 100;

//Hashes
//Elmore - 656c6d6f7265
//Conroy - 636f6e726f79

if(Cookies.get("tutorial") === "true") {
	$("#tutorial").hide();
}

$(document).ready(function () {
	"use strict";
	$.ajax({
		type: "GET",
		url: "data.php",
		dataType: "json",
		success: function (response) {
			console.log(response);
			data = response;
			scale();
		}
	});
	$.fn.bootstrapSwitch.defaults.onColor = 'success';
	$.fn.bootstrapSwitch.defaults.size = 'mini';
	$("[name='show-buttons']").bootstrapSwitch().on('switchChange.bootstrapSwitch', function(event, state) {
		showhitboxes(state);
	});
	$("[name='bright-buttons']").bootstrapSwitch().on('switchChange.bootstrapSwitch', function(event, state) {
		setbrighthitboxes(state);
	});
	$("[name='slowscroll']").bootstrapSwitch().on('switchChange.bootstrapSwitch', function(event, state) {
		setSlowScroll(state);
	});
	$('#imgleft').mousedown(function(){startImgScroll(true);}).mouseup(endImgScroll).mouseleave(endImgScroll);
	$('#imgright').mousedown(function(){startImgScroll(false);}).mouseup(endImgScroll).mouseleave(endImgScroll);
	
	var tutorial = $("#tutorial");
	tutorial.click(function(e) {	
		if (e.target !== this) {
    		return;
		}
		hidetutorial();
	});
	$("#exithelp").click(function(e) {	
		hidetutorial();
	});
	$("#showhelp").click(function() {
		tutorial.css("opacity", "0");
		tutorial.show();
		player.playVideo();
		player.unMute();
		jQuery({volume: 0}).animate({volume:previousVol}, {
			duration: 1000,
			step: function() {
				player.setVolume(this.volume);
			}
		});
		tutorial.animate({
			opacity: 1
		}, 650);
	});
	$('[data-toggle="tooltip"]').tooltip();
	//Player premods in pace done.
});

$(window).resize(function () {
	"use strict";
	scale();
});
$('body').waitForImages({
	finished: function () {
		"use strict";
		$(".cover").addClass("imagesloaded");
	},
	waitForAll: true
});
Pace.on('done', function () {
	"use strict";
	console.log("Page Loaded");
	if($("html").attr("hash") === "636f6e726f79") {	
		player.loadVideoById("DLzxrzFCyOs", 0, "large");
		$("header h1").html("RICKROLLED IN 2017.");
		$(".hitbox").addClass("rick");
		$("#conceal-sidebar p span").html("Click on a rick for more information");
	}
	player.seekTo(0, false);
	player.pauseVideo();
	$(".cover").fadeOut(1000);
});

function hidetutorial() {
	var tutorial = $("#tutorial");
	previousVol = player.getVolume();
	jQuery({volume: player.getVolume()}).animate({volume:0}, {
		duration: 1000,
		step: function() {
			player.setVolume(this.volume);
		},
		complete: function() {
			player.pauseVideo();
		}
	});
	Cookies.set("tutorial", 'true', { expires: 31 })
	tutorial.animate({
		opacity: 0
	}, 650, function() {
		tutorial.hide();
	});
}

function scale() {
	"use strict";
	var img = new Image();
	img.src = $('#photo #img').css('background-image').match(/url\("http:\/\/.+\/(i.+)"\)/)[1];
	img.onload = function () {
		var imgx = img.width;
		var imgy = img.height;
		boxx = $('#photo #img').width();
		var boxy = $('#photo #img').height();

		var scalex = boxx / imgx;
		var scaley = boxy / imgy; 
		width = scalex < scaley ? boxx : imgx * scaley;
		var height = scalex < scaley ? imgy * scalex : boxy;
		currentscale = scalex < scaley ? scalex : scaley;

		//scale the zone
		var zone = $('#photo #zone') 
			.width(width)
			.height(height)
			.css("top", 47 + (boxy - height) / 2)
			.css("left", (boxx - width) / 2)
			.empty();
		if (false) {
			zone.css("background", "red");
		} //Change to true to show zone
		
		//scale the image displacement bars
		$('.imgdisplace').css({
			"top": 47 + (boxy - height) / 2,
			"height": height
		}).find('.fa').css('margin-top', (height - 14)/2);

		//Load in the hitboxes
		for (var i = 0; i < data.length; i++) {
			var size = (50 * currentscale) / staticscale;
			var sized2 = size / 2;
			$('<div />')
				.addClass("hitbox")
				.attr("index", i)
				.css({
					"margin-left": (data[i][1] * currentscale) - sized2 + "px",
					"margin-top": (data[i][2] * currentscale) - sized2 + "px",
					"width": size + "px",
					"height": size + "px",
					"border-radius": sized2 + "px"
				})
				.appendTo($('#photo #zone'))
				.click(function () {
					var bar = $("#sidebar");
					var i = $(this).attr("index");
					bar.find("#name").html(data[i][3]);
					bar.find("#nickname").html(data[i][4]).css('display', data[i][4] === "" ? 'none' : 'block');
					bar.find("#house").html(data[i][5]).parent().css('display', data[i][5] === "" ? 'none' : 'block');
					bar.find("#facebook").html(data[i][6]).parent().css('display', data[i][6] === "" ? 'none' : 'block');
					bar.find("#instagram").html(data[i][7]).parent().css('display', data[i][7] === "" ? 'none' : 'block');
					bar.find("#snapchat").html(data[i][8]).parent().css('display', data[i][8] === "" ? 'none' : 'block');
					bar.find("#email").html(data[i][9]).parent().css('display', data[i][9] === "" ? 'none' : 'block');
					bar.find("#fav-subject").html(data[i][10]).parent().css('display', data[i][10] === "" ? 'none' : 'block');
					bar.find("#lesfav-subject").html(data[i][11]).parent().css('display', data[i][11] === "" ? 'none' : 'block');
					bar.find("#inspirations").html(data[i][12].replace(/(?:\r\n|\r|\n)/g, '<br />')).parent().css('display', data[i][12] === "" ? 'none' : 'block');
					bar.find("#dream").html(data[i][13].replace(/(?:\r\n|\r|\n)/g, '<br />')).parent().css('display', data[i][13] === "" ? 'none' : 'block');
					bar.find("#quote").html(data[i][14].replace(/(?:\r\n|\r|\n)/g, '<br />')).parent().css('display', data[i][14] === "" ? 'none' : 'block');

					if (!conceal) {
						conceal = true;
						$("#conceal-sidebar").css("display", "none");
					}
				});
		}
		if($("[name='show-buttons']").bootstrapSwitch("state")) {
			showhitboxes(true);
		}
		else {
			showhitboxes(false);
		}
		if($("[name='bright-buttons']").bootstrapSwitch("state")) {
			setbrighthitboxes(true);
		}
		else {
			setbrighthitboxes(false);
		}
		
		updateImagePos();
	};
}

function showhitboxes(b) {
	"use strict";
	if (b) {
		$('#photo #zone .hitbox').addClass("perm");
	}
	else {
		$('#photo #zone .hitbox').removeClass("perm");
	}
}

function setbrighthitboxes(b) {
	"use strict";
	if (b) {
		$('#photo #zone .hitbox').addClass("bright");
	}
	else {
		$('#photo #zone .hitbox').removeClass("bright");
	}
}
function setSlowScroll(b) {
	"use strict";
	slowScroll = b;
}
var imagePos = 50, leftOn = false, rightOn = false, graceRef, cycleRef, slowScroll = false;
var graceTime = 600, cycleTime = 15, displacesize = 0.6;
function updateImagePos()
{
	"use strict";
	if(imagePos > 100) { imagePos = 100; }
	if(imagePos < 0) { imagePos = 0; }
	var image = $('#photo');
	var displacement = -image.width()/4 * (imagePos/50);
	image.css('margin-left', displacement + 'px')
	 	.find('#zone').css("left", (boxx - width) / 2 + displacement);
}
function startImgScroll(isLeft)
{
	"use strict";	
	leftOn = isLeft; 
	rightOn = !isLeft;
	
	imagePos += (isLeft ? -1 : 1) * (slowScroll ? 1 : 0.5) * displacesize;
	updateImagePos();
	
	clearTimeout(graceRef);
	clearInterval(cycleRef);
	graceRef = setTimeout(waitForGrace, graceTime - cycleTime);
	$('#photo').addClass('noanimation');
}
function endImgScroll()
{
	"use strict";	
	leftOn = rightOn = false;
	
	clearTimeout(graceRef);
	clearInterval(cycleRef);
	$('#photo').removeClass('noanimation');
}
function waitForGrace()
{
	"use strict";
	cycleRef = setInterval(scrollCycle, cycleTime);
}
function scrollCycle()
{
	"use strict";
	imagePos += (leftOn ? -1 : 0 + rightOn ? 1 : 0) * (slowScroll ? 1 : 0.5)  * displacesize;
	updateImagePos();
}
$(window).bind('mousewheel', function(event) {
	"use strict";
	$('#photo').addClass('noanimation');
    if (event.originalEvent.wheelDelta >= 0) {
        imagePos -= 1 * displacesize * 3;
    }
    else {
        imagePos += 1 * displacesize * 3;
    }
	updateImagePos();
	setTimeout(function(){$('#photo').addClass('noanimation');}, 0);
});