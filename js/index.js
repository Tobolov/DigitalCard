/*Codehints to remove superfluous warnings*/
/*jshint loopfunc: true */
/*global Pace */

$(document).ready(function () {
	"use strict";
	preloadImages(images, function() { $(".cover").addClass("jsimagesloaded"); });
});

//Loading
$('body').waitForImages({
	finished: function () {
		"use strict";
		$(".cover").addClass("imagesloaded");
	},
	waitForAll: true
});
Pace.on('done', function () {
	"use strict";
	$("#preloadingfonts").hide();
	$(".cover").fadeOut(1000);
	setTimeout(animate, 2000);
});


//Get Keeeeeeen. Lets drop some barrrs.
var display, source, s, tag;
var openbraceR = /^<(\w+)>/g;
var closebraceR = /^<\/(\w+)>/g;
var isimagedisplayR = /^\[(\d+)\]/g;

var images = ["test.jpg"];

function animate() {
	"use strict";
	display = $("#display");
	source = $("#testing");
	s = source.html().replace(/(\r\n|\n|\r|\t)/gm, "");
	tag = "";

	display.show().html("\t");
	source.hide();

	setTimeout(nextKey, 100);
}

//Far from perfect. Many limitations
//Only 1 scope of tags
//No params in the tags
function nextKey() {
	"use strict";
	var delay = 70;

	if (s.length === 0) { //Complete
		return;
	}
	if (s[0] !== "<" && s[0] !== "[") { //Normal Letter
		if (s[0] === ".") {
			delay = 1500;
		}
		if (s[0] === "!") {
			delay = 1500;
		}
		if (s[0] === "?") {
			delay = 1500;
		}
		if (s[0] === ",") {
			delay = 900;
		}
		if (tag !== "") { //Work for tags
			display.html(display.html().slice(0, -(3 + tag.length)) + s[0]); //3
		} else {
			addDisplay(s[0]);
		}
		s = s.substring(1);
	} else {
		if (s.startsWith("<br>")) { //Break
			addDisplay("<br>");
			s = s.substring(4);
			delay = 300;
		} else {
			var match = openbraceR.exec(s);
			if (match !== null) { //Open tag
				tag = match[1];
				s = s.substring(2 + tag.length);
				addDisplay("<" + tag + ">");
			}
			if (closebraceR.exec(s) !== null) { //End tag
				s = s.substring(3 + tag.length);
				addDisplay("</" + tag + ">");
				tag = "";
			}
			match = isimagedisplayR.exec(s);
			if (match !== null) { //display image
				s = s.substring(2 + match[1].length);
				displayImage(parseInt(match[1]));
				delay = 6000;
			}
		}
	}

	setTimeout(nextKey, delay);
}

function addDisplay(s) {
	"use strict";
	display.html(display.html() + s);
}

function displayImage(id) {
	"use strict";
	var ref = $("#imgdisp");
	ref.css("background-image", "url(images/" + images[id] + ")").finish(); //fss ;_; 2 mistakes in 1 line.

	//Init vars
	var dir = Math.floor(Math.random() * 4),
		top, left, right, bottom; // 0-4
	if (dir === 0) {
		top = true;
		left = true;
		right = false;
		bottom = false;
	}
	if (dir === 1) {
		top = true;
		left = false;
		right = true;
		bottom = false;
	}
	if (dir === 2) {
		top = false;
		left = true;
		right = false;
		bottom = true;
	}
	if (dir === 3) {
		top = false;
		left = false;
		right = true;
		bottom = true;
	}

	ref.css({
		top: top ? "0px" : "auto",
		left: left ? "0px" : "auto",
		right: right ? "0px" : "auto",
		bottom: bottom ? "0px" : "auto",
		opacity: 0,
		width: "0px",
		height: "0px",
		margin: "0px",
	});
	ref.animate({
		top: top ? "50vh" : "auto",
		left: left ? "50vw" : "auto",
		right: right ? "50vw" : "auto",
		bottom: bottom ? "50vh" : "auto",
	}, {
		duration: 3000,
		queue: true,
		easing: "easeOutExpo"
	});
	ref.animate({
		top: top ? "100vh" : "auto",
		left: left ? "100vw" : "auto",
		right: right ? "100vw" : "auto",
		bottom: bottom ? "100vh" : "auto",
	}, {
		duration: 3000,
		queue: true,
		easing: "easeInExpo"
	});
	ref.animate({
		opacity: 1,
		width: "600px",
		height: "600px",
		margin: "-300px"
	}, {
		duration: 1000,
		queue: false,
		done: function () {
			setTimeout(function () {
				ref.animate({
					opacity: 0,
					width: "0px",
					height: "0px",
					margin: "0px"
				}, {
					duration: 1000,
					queue: false
				});
			}, 4000);
		}
	});
}
function preloadImages(urls, allImagesLoadedCallback) {
	"use strict";
	var loadedCounter = 0;
	var toBeLoadedNumber = urls.length;
	urls.forEach(function (url) {
		preloadImage(url, function () {
			loadedCounter++;
			if (loadedCounter === toBeLoadedNumber) {
				allImagesLoadedCallback();
			}
		});
	});

	function preloadImage(url, anImageLoadedCallback) {
		var img = new Image();
		img.src = "images/" + url;
		img.onload = anImageLoadedCallback;
	}
}
