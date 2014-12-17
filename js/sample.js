var currHeight = 360;
var currWidth = 800;
var currSpacing = 10;

function initGallery(containerWidth, maxRowHeight, spacing) {
  // Note that some of the images are the same but have been cropped differently; this is not a result
  // of the gallery js
  var images = [{url:"360-1000.jpeg", title:"Asana Gallery Image"}, 
  	{url:"600-400.jpeg", title:"Asana Gallery Image"}, {url:"400-600.jpeg", title:"Asana Gallery Image"},
  	{url:"400-600-2.jpeg", title:"Asana Gallery Image"}, {url:"400-300.jpeg", title:"Asana Gallery Image"},
  	{url:"400-300-2.jpeg", title:"Asana Gallery Image"}];
  
  var frames = [{ height: 360, width: 1000 },
  	{ height: 600, width: 400 },
  	{ height: 400, width: 600 },
  	{ height: 400, width: 600 },
  	{ height: 400, width: 300 },
  	{ height: 400, width: 300 }];

  $("#gallery").css("width", containerWidth);
  var rows = layoutFrames(frames, containerWidth, maxRowHeight, spacing);
  var index = 0;

  rows.forEach(function(row, rowIndex) {
	row.forEach(function(image, imgIndex) {
	  $("#gallery").append("<div style='width:" + (image.width) + "px; height:" + (image.height) + "px; margin-bottom:10px;' class='frame'></div>")
	  $("#gallery .frame").last().append("<img src='images/" + images[index].url + "' />")
	  	.append("<div class='title'><p class='title'>" + images[index].title + "</p></div>")
	  	.hover(function(event) {
	  		$(this).find("div.title").css("display", "block");
	  	}, function(event) {
	  		$(this).find("div.title").css("display", "none");
	  	});

	  if (imgIndex != 0) {
	    $("#gallery .frame").last().css("margin-left", spacing + "px");
	  }
	  index++;
    });
  });

  $(".frame").css("margin-bottom", spacing + "px");
}

$(function() { 
  initGallery(800, 360, 10);

  $("#settings").click(function(event) {
  	$("#changeSize").css("display", "block");
  });

  $("#formSubmit").click(function(event) {
  	if ($("#width").val()) {
  		console.log("There is a width??");
  		currWidth = parseInt($("#width").val());
  	}
  	if ($("#height").val()) {
  		console.log("There is a height??");
  		currHeight = parseInt($("#height").val());
    }
    if ($("#spacing").val()) {
    	console.log("There is a spacing??");
    	currSpacing = parseInt($("#spacing").val());
    }
  	$("#changeSize").css("display", "none");
  	$("#gallery").html("");
  	console.log("Calling init gallery w values currWidth: " + currWidth + " currHeight: " + currHeight + " currSpacing: " + currSpacing);
  	initGallery(currWidth, currHeight, currSpacing);
  })

});