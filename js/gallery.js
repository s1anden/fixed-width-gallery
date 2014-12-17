/**
  * @param {Array<Object>} array of frame objects with height/width properties
  * @param {number} width of the containing element, in pixels
  * @param {number} maximum height of each row of images, in pixels
  * @param {number} spacing between images in a row, in pixels
  * @returns {Array<Array<Object>>} array of rows of resized frames
  */
var layoutFrames = function(images, containerWidth, maxRowHeight, spacing) {
  // Fit each image w/in the containerWidth, maxRowHeight dimensions
  images.forEach(function(image, index) {
	fitImage(image.width, image.height, containerWidth, maxRowHeight, function(updateImg) {
  	  image.width = updateImg.width;
	  image.height = updateImg.height;
	});
  });
  var rowArr;

  // Get the row array
  fitRows(images, containerWidth, maxRowHeight, spacing, null, function(rows) {
	rowArr = rows;	
  });

  return rowArr;
 }

// Generates the row array recursively
var fitRows = function(images, containerWidth, maxRowHeight, spacing, rows, callback) {
  // More images to be added to rows
  if (images.length !== 0) {
 	// Create rows array if does not yet exist (first iteration)
 	if (!rows) {
  	  rows = [];
	}
 	
 	// Get the next row	
 	getRow(images, containerWidth, maxRowHeight, spacing, function(row) {
 	  rows.push(row);
 	  // Remove already-added images from array
 	  images.splice(0, row.length);
 	  fitRows(images, containerWidth, maxRowHeight, spacing, rows, callback);
 	});		
  } else {
  	// Send rows object back
 	callback(rows);
  }
}

// Fit next row
var getRow = function(images, containerWidth, maxRowHeight, spacing, callback) {
  var rowWidth = images[0].width;
  var rowHeight = images[0].height;
  var index = 0;
  var row = [images[0]];
  var done = false;

  // If there is only one image left or the image is the full width of the row
  if (rowWidth == containerWidth || images.length == 1) {
	done = true;
  }
  
  // Add more images to the row until it is the correct size
  while (rowWidth < containerWidth - spacing * index && index < images.length - 1) {
	index++;
	row.push(images[index]);

	// Adjust the images to be the same height (the samaller of the two options)
	if (rowHeight == images[index].height) {
  	  rowWidth += images[index].width;
	} else if(rowHeight < images[index].height) {
	  resize(images[index].width, images[index].height, null, rowHeight, function(updatedImage) {
	  	rowWidth += updatedImage.width;
	  	images[index].height = updatedImage.height;
	  	images[index].width = updatedImage.width;
	  });
	} else {
	  rowHeight = images[index].height;
	  rowWidth = 0;

	  // All images already in the row must be resized
	  for (var i = 0; i < row.length; i++) {
		resize(images[i].width, images[i].height, null, rowHeight, function(updatedImg) {
	 	  rowWidth += updatedImg.width;
		  images[i].height = updatedImg.height;
		  images[i].width = updatedImg.width;
		});
	  }
	}

	// Row should be the length of the container minus the spacing between the images - spacing * index,
	// i.e. one for each image except one
	if (rowWidth > containerWidth - (spacing * index)) {
	  // Get the correct height of the row based on the desired width
	  resize(rowWidth, rowHeight, containerWidth - (spacing * (index)), null, function(updatedWidth) {
	    rowHeight = updatedWidth.height;
	    rowWidth = containerWidth - (spacing * index);
	    var widthSoFar = 0;

	    // Resize each image to the correct row height
	    for (var i = 0; i < row.length; i++) {
		  resize(images[i].width, images[i].height, null, rowHeight, function(updatedHeight) {
	    	images[i].height = rowHeight;
	  	    images[i].width = updatedHeight.width;
	  	    widthSoFar += images[i].width;
	  	  });
	    }

	    // Because of rounding, the width of the row may be up to numImages px off.
	    // Adjust for that by adding or subtracting 1px from the width of each image
	    // up to one time (so aspect ratio is still the same +/- 1px)
	    var adjust = 0;
	    if (widthSoFar > containerWidth - (spacing * index)) {
	  	  adjust = -1;
	    } else {
		  adjust = 1;
	    }
	    var img = 0;
	    while (widthSoFar != containerWidth - (spacing * index) && img < row.length) {
	  	  row[img].width = row[img].width + adjust;
	  	  widthSoFar += adjust;
	  	  img++;
	    }
	  });
    }

    // If the row is now the correct width (or there are no more images)
    if (rowWidth === containerWidth - (spacing * index)  || index == images.length - 1) {
  	  done = true;
    }
  }
  if (done) {
	callback(row);
  }
}

// Resize proportions to fit between the max dimensions while keeping
// the same ratio
var fitImage = function(width, height, maxWidth, maxHeight, callback) {
   var image = {width: width, height: height};

   // Resize by height if necessary
   if (image.height > maxHeight) {
 	resize(image.width, image.height, null, maxHeight, function(updatedWidth) {
 	  image.height = maxHeight; image.width = updatedWidth.width;
 	})
   }

   // Resize by width if necessary
   if (image.width > maxWidth) {
	resize(image.width, image.height, maxWidth, null, function(updatedHeight) {
	  image.width = maxWidth;
	  image.height = updatedHeight.height;
	});
  }

  callback(image);
 }

// Resize by either height or width (whichever is not null)
var resize = function(currWidth, currHeight, newWidth, newHeight, callback) {
 	var updateImg = {};

 	if (newWidth) {
 		var ratio = newWidth / currWidth;
 		updateImg.width = newWidth;
 		updateImg.height = Math.round(currHeight * ratio);
 	} else if (newHeight) {
 		var ratio = newHeight / currHeight;
 		updateImg.height = newHeight;
 		updateImg.width = Math.round(currWidth * ratio);
 	}
 	callback(updateImg);
 }