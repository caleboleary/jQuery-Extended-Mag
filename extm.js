;(function($){
	jQuery.fn.extend({
		extm: function extm(userOptions) {
			//merge default and user options to 'options' var
			var defaultOptions = {
				zoomElement: false,
				imageSrc: $(this).attr('src'),
				squareOverlay: false,
				position: false,
				lazy: false
			}
			var options = $.extend({},defaultOptions,userOptions || {});
			function extmInit(options, imageElement) {
				smallWidth = imageElement.width(),
				smallHeight = imageElement.height(),
				offset = imageElement.offset();
				if (!options.zoomElement) {
					var zoomElement = $( "<div style='overflow:hidden;pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;' class='extm'></div>" );
					if (options.position == 'right') {
						zoomElement.appendTo( $('body') );
						zoomElement.css("position","absolute");
						zoomElement.css("top",offset.top);
						zoomElement.css("left",offset.left+smallWidth);
					}
					else if (options.position == 'overlay') {
						zoomElement.appendTo( $('body') );
						zoomElement.css("position","absolute");
						zoomElement.css("top",offset.top);
						zoomElement.css("left",offset.left);
					}				
					else{
						zoomElement.insertAfter( imageElement );
					}
				}
				else {
					var zoomElement = options.zoomElement;
				}
				if (options.squareOverlay) {
					var overlayElement = $( "<div class='overlayElement' style='pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;position:absolute;top:"+offset.top+"px;left:"+offset.left+"px;'></div>" );
					$('body').append( overlayElement );
					var innerOverlayElement = $("<div style='background-color:rgba(0,0,0,0.2);visibility:hidden;position:absolute;' class='innerOverlay'></div>");
					overlayElement.append(innerOverlayElement);
				}
				if (!options.lazy) {
					zoomElement.css("visibility","hidden"); //hide zoom holder
				}
				var fullSizeImage = $('<img style="position:relative;max-width:none;">'); //make a large clone and insert it
				if (options.imageSrc) {
					fullSizeImage.attr('src', options.imageSrc);
				}
				else {
					fullSizeImage.attr('src', imageElement.attr('src'));
				}
				fullSizeImage.appendTo(zoomElement);			
				//using this closure to make sure the function gets the right 'imageElement' - in case there are many zooms per page
				(function(imageElement,zoomElement,fullSizeImage,overlayElement,smallHeight,smallWidth,offset) {
					fullSizeImage.load(function(){
						imageElement.on('mouseenter', function(){ //show/hide functionality
							//before we show the zoom element, lets make sure everything is still lined up 
							//this is here in case things have moved since init, like if the user changed their browser width and things shuffled
							var offset = imageElement.offset();
							if (options.position == 'right') {
								zoomElement.css("top",offset.top);
								zoomElement.css("left",offset.left+smallWidth);
							}
							else if (options.position == 'overlay') {
								zoomElement.css("top",offset.top);
								zoomElement.css("left",offset.left);
							}						
							if (options.squareOverlay) {
								overlayElement.css("top",offset.top);
								overlayElement.css("left",offset.left);
							}
							zoomElement.css("visibility","visible");
							if (options.squareOverlay) {
								innerOverlayElement.css("visibility","visible");
							}
						});
						imageElement.on('mouseleave', function(){
							zoomElement.css("visibility","hidden");
							if (options.squareOverlay) {
								innerOverlayElement.css("visibility","hidden");
							}
						});
						var fullSizeWidth = fullSizeImage.width(), //declare all of our vars... ratios and heights
							fullSizeHeight = fullSizeImage.height(),
							wRatio = fullSizeWidth/smallWidth,
							hRatio = fullSizeHeight/smallHeight,
							wDifference = 0- (fullSizeWidth-zoomElement.width()),
							hDifference = 0- (fullSizeHeight-zoomElement.height());
							if (options.squareOverlay) {
								var innerOverlayW = (smallWidth/fullSizeWidth)*smallWidth,
								innerOverlayH = (smallHeight/fullSizeHeight)*smallHeight;
								innerOverlayElement.css('height', innerOverlayH);
								innerOverlayElement.css('width', innerOverlayW);
							}
						imageElement.on('mousemove', function(event){ //on mousemove, use ratios and heights to move appropriately
							var offset = imageElement.offset();
							var setTop = smallHeight/2-(event.pageY-offset.top)*hRatio;
							setTop = Math.max(setTop,hDifference);
							setTop = Math.min(setTop,0),
							setLeft = smallWidth/2-(event.pageX-offset.left)*wRatio;
							setLeft = Math.max(setLeft,wDifference);
							setLeft = Math.min(setLeft,0);
							fullSizeImage.css('top', setTop);
							fullSizeImage.css('left', setLeft);
							if (options.squareOverlay) {
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
					if (options.squareOverlay) {
						overlayElement.remove();
					}
				});
			}
			if (options.lazy) {
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
})(jQuery);
