jQuery.fn.extend({
	extm: function extm(options) {
		function extmInit(options, imageElement) {
			smallWidth = imageElement.width(),
			smallHeight = imageElement.height(),
			offset = imageElement.offset();
			if (typeof options.zoomElement === "undefined") {
				var zoomElement = $( "<div style='overflow:hidden;pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;' class='extm'></div>" );
				if (typeof options.position !== "undefined") {
					zoomElement.appendTo( $('body') );
					if (options.position == 'right') {
						zoomElement.css("position","absolute");
						zoomElement.css("top",offset.top);
						zoomElement.css("left",offset.left+smallWidth);
					}
					else if (options.position == 'overlay') {
						zoomElement.css("position","absolute");
						zoomElement.css("top",offset.top);
						zoomElement.css("left",offset.left);
					}
				}
				else{
					zoomElement.insertAfter( imageElement );
				}
			}
			else {
				var zoomElement = options.zoomElement;
			}
			if (typeof options.squareOverlay !== "undefined" && options.squareOverlay === true) {
				var overlayElement = $( "<div class='overlayElement' style='pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;position:absolute;top:"+offset.top+"px;left:"+offset.left+"px;'></div>" );
				overlayElement.insertAfter( imageElement );
				var innerOverlayElement = $("<div style='background-color:rgba(0,0,0,0.2);visibility:hidden;position:absolute;' class='innerOverlay'></div>");
				overlayElement.append(innerOverlayElement);
				var squareOverlay = true;
			}
			if (typeof options.lazy === 'undefined' || options.lazy != true) {
				zoomElement.css("visibility","hidden"); //hide zoom holder
			}
			var fullSizeImage = $('<img style="position:relative;">'); //make a large clone and insert it
			if (typeof options.imageSrc === "undefined") {
				fullSizeImage.attr('src', imageElement.attr('src'));
			}
			else {
				fullSizeImage.attr('src', options.imageSrc);
			}
			fullSizeImage.appendTo(zoomElement);
			
			//using this closure to make sure the function gets the right 'imageElement' - in case there are many zooms per page
			(function(imageElement,zoomElement,fullSizeImage,overlayElement,smallHeight,smallWidth,offset) {
				fullSizeImage.load(function(){
					imageElement.on('mouseenter', function(){ //show/hide functionality
						zoomElement.css("visibility","visible");
						if (squareOverlay === true) {
							innerOverlayElement.css("visibility","visible");
						}
					});
					imageElement.on('mouseleave', function(){
						zoomElement.css("visibility","hidden");
						if (squareOverlay === true) {
							innerOverlayElement.css("visibility","hidden");
						}
					});
					var fullSizeWidth = fullSizeImage.width(), //declare all of our vars... ratios and heights
						fullSizeHeight = fullSizeImage.height(),
						wRatio = fullSizeWidth/smallWidth,
						hRatio = fullSizeHeight/smallHeight,
						wDifference = 0- (fullSizeWidth-zoomElement.width()),
						hDifference = 0- (fullSizeHeight-zoomElement.height());
						if (squareOverlay === true) {
							var innerOverlayW = (smallWidth/fullSizeWidth)*smallWidth,
							innerOverlayH = (smallHeight/fullSizeHeight)*smallHeight;
							innerOverlayElement.css('height', innerOverlayH);
							innerOverlayElement.css('width', innerOverlayW);
						}
					imageElement.on('mousemove', function(event){ //on mousemove, use ratios and heights to move appropriately
						var offset = imageElement.offset();
						//this big block of if-s copied from above fixes the responsive issues, because it's redefining variables every mouseover.... not a good way to do it...
						if (typeof options.position !== "undefined") {
							if (options.position == 'right') {
								//zoomElement.css("position","absolute");
								zoomElement.css("top",offset.top);
								zoomElement.css("left",offset.left+smallWidth);
							}
							else if (options.position == 'overlay') {
								//zoomElement.css("position","absolute");
								zoomElement.css("top",offset.top);
								zoomElement.css("left",offset.left);
							}

						}
						if (typeof options.squareOverlay !== "undefined" && options.squareOverlay === true) {
							overlayElement.css("top",offset.top);
							overlayElement.css("left",offset.left);
						}
						var setTop = smallHeight/2-(event.pageY-offset.top)*hRatio;
						setTop = Math.max(setTop,hDifference);
						setTop = Math.min(setTop,0),
						setLeft = smallWidth/2-(event.pageX-offset.left)*wRatio;
						setLeft = Math.max(setLeft,wDifference);
						setLeft = Math.min(setLeft,0);
						fullSizeImage.css('top', setTop);
						fullSizeImage.css('left', setLeft);
						if (squareOverlay === true) {
							var squareTop = (event.pageY-offset.top)-innerOverlayElement.height()/2;
							squareTop = Math.max(squareTop, 0);
							squareTop = Math.min(squareTop, smallHeight-innerOverlayH),
							squareLeft = (event.pageX-offset.left)-innerOverlayElement.width()/2;
							squareLeft = Math.max(squareLeft, 0);
							squareLeft = Math.min(squareLeft, smallWidth-innerOverlayW);
							innerOverlayElement.css('top', squareTop);
							innerOverlayElement.css('left', squareLeft);
						}
					});
				});

			})(imageElement,zoomElement,fullSizeImage,overlayElement,smallHeight,smallWidth,offset);

			//destroy listener
			imageElement.on('extmdestroy',function(){
				zoomElement.remove();
				if (squareOverlay === true) {
					overlayElement.remove();
				}
			});
		}
		if (typeof options === "undefined"){
			var options = {};
		}
		if (typeof options.lazy !== 'undefined' && options.lazy === true ) {
			this.one('mouseenter', function(){
				extmInit(options, $(this));
			});
		}
		else {
			extmInit(options, this);
		}
	},
	extmDestroy: function extmDestroy() {
		this.trigger('extmdestroy');
	}
});
