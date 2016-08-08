/*
	jQuery Extended Mag(nify)
	Author: Caleb O'Leary
	Site: http://caleboleary.com
	Current Version: https://github.com/caleboleary/jQuery-Extended-Mag
	MIT License
*/
(function($){
	"use strict";
	$.fn.extend({
		extm: function extm(userOptions) {
			//merge default and user options to 'options' var
			var defaultOptions = {
				zoomElement: false,
				imageSrc: $(this).attr('src'),
				squareOverlay: false,
				position: false,
				rightPad:0,
				lazy: false,
				zoomLevel:1,
				zoomSize:false,
				loadingText:false,
				loadingImage:false
			};
			var options = $.extend({},defaultOptions,userOptions || {});
			function extmInit(options, imageElement) {
				var smallWidth = imageElement.width();
				var smallHeight = imageElement.height();
				var offset = imageElement.offset();
				var zoomElement;
				if (!options.zoomElement) {
					zoomElement = $( "<div style='overflow:hidden;pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;' class='extm'></div>" );
					if (options.position === 'right') {
						zoomElement.appendTo( $('body') );
						zoomElement.css("position","absolute");
						zoomElement.css("top",offset.top);
						zoomElement.css("left",offset.left+smallWidth+options.rightPad);
					}
					else if (options.position === 'overlay') {
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
					zoomElement = options.zoomElement;
				}
        		var overlayElement;
        		var innerOverlayElement;
				if (options.squareOverlay) {
					overlayElement = $( "<div class='overlayElement' style='pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;position:absolute;top:"+offset.top+"px;left:"+offset.left+"px;'></div>" );
					$('body').append( overlayElement );
					innerOverlayElement = $("<div style='background-color:rgba(0,0,0,0.2);position:absolute;' class='innerOverlay'></div>");
					overlayElement.append(innerOverlayElement);
				}
				if (!options.lazy) {
					zoomElement.css("visibility","hidden"); //hide zoom holder
					if (options.squareOverlay) {
						innerOverlayElement.css("visibility","hidden"); //hide zoom holder
					}
				}
				if (options.zoomSize) {
					var fullSizeImage = $('<img style="position:relative;max-width:none;width:'+options.zoomSize+'px;">'); //make a large clone and insert it
				}
				else if (options.zoomLevel !== 1) {
					var fullSizeImage = $('<img style="position:relative;max-width:none;width:'+(100*options.zoomLevel)+'%;">'); //make a large clone and insert it
				}
				else {
					var fullSizeImage = $('<img style="position:relative;max-width:none;">'); //make a large clone and insert it
				}
				if (options.imageSrc) {
					fullSizeImage.attr('src', options.imageSrc);
				}
				else {
					fullSizeImage.attr('src', imageElement.attr('src'));
				}

				fullSizeImage.appendTo(zoomElement);			
				//using this closure to make sure the function gets the right 'imageElement' - in case there are many zooms per page
				(function(imageElement,zoomElement,fullSizeImage,overlayElement,smallHeight,smallWidth,offset, innerOverlayElement,options) {

					//while we wait for fullsize to load...
					if (options.loadingText){
						var loadingElement = $( "<div class='loadingElement' style='pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;font-family:sans-serif;position:absolute;top:"+offset.top+"px;left:"+offset.left+"px;visibility:hidden;background:rgba(255,255,255,0.5);color:black;font-size:2em;font-weight:bold;text-align:center;'><p style='position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);'>"+options.loadingText+"</p></div>" );
						$('body').append( loadingElement );
						imageElement.on('mouseenter', function(){
							loadingElement.css("visibility","visible");
						});
						imageElement.on('mouseleave', function(){
							loadingElement.css("visibility","hidden");
						});
						if (imageElement.is(':hover')) {
							imageElement.trigger("mouseenter");
						}
					}
					else if (options.loadingImage) {
						var loadingElement = $( "<div class='loadingElement' style='pointer-events:none;height:"+smallHeight+"px;width:"+smallWidth+"px;font-family:sans-serif;position:absolute;top:"+offset.top+"px;left:"+offset.left+"px;visibility:hidden;background:rgba(255,255,255,0.5);color:black;font-size:2em;font-weight:bold;text-align:center;'><img style='position: absolute; left: 50%;top: 50%;transform: translate(-50%, -50%);' src='"+options.loadingImage+"'/></div>" );
						$('body').append( loadingElement );
						imageElement.on('mouseenter', function(){
							loadingElement.css("visibility","visible");
						});
						imageElement.on('mouseleave', function(){
							loadingElement.css("visibility","hidden");
						});
						if (imageElement.is(':hover')) {
							imageElement.trigger("mouseenter");
						}
					}

					fullSizeImage.load(function(){

						if (options.loadingText || options.loadingImage){
							//remove our loading stuff
							imageElement.trigger("mouseleave");
							imageElement.unbind('mouseenter mouseleave');
							loadingElement.remove();
						}

						imageElement.on('mouseenter', function(){ //show/hide functionality
							//before we show the zoom element, lets make sure everything is still lined up 
							//this is here in case things have moved since init, like if the user changed their browser width and things shuffled
							offset = imageElement.offset();
							if (options.position === 'right') {
								zoomElement.css("top",offset.top);
								zoomElement.css("left",offset.left+smallWidth+options.rightPad);
							}
							else if (options.position === 'overlay') {
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
						if (imageElement.is(':hover')) {
							imageElement.trigger("mouseenter");
						}
						var fullSizeWidth = fullSizeImage.width(); //declare all of our vars... ratios and heights
						var fullSizeHeight = fullSizeImage.height();
						var wRatio = fullSizeWidth/smallWidth;
						var hRatio = fullSizeHeight/smallHeight;
						var wDifference = 0- (fullSizeWidth-zoomElement.width());
						var hDifference = 0- (fullSizeHeight-zoomElement.height());
						if (options.squareOverlay) {
							var innerOverlayW = (smallWidth/fullSizeWidth)*smallWidth;
							var innerOverlayH = (smallHeight/fullSizeHeight)*smallHeight;
							innerOverlayElement.css('height', innerOverlayH);
							innerOverlayElement.css('width', innerOverlayW);
						}
						imageElement.on('mousemove', function(event){ //on mousemove, use ratios and heights to move appropriately
							offset = imageElement.offset();
							var setTop = smallHeight/2-(event.pageY-offset.top)*hRatio;
							setTop = Math.max(setTop,hDifference);
							setTop = Math.min(setTop,0);
							var setLeft = smallWidth/2-(event.pageX-offset.left)*wRatio;
							setLeft = Math.max(setLeft,wDifference);
							setLeft = Math.min(setLeft,0);
							fullSizeImage.css('top', setTop);
							fullSizeImage.css('left', setLeft);
							if (options.squareOverlay) {
								var squareTop = (event.pageY-offset.top)-innerOverlayElement.height()/2;
								squareTop = Math.max(squareTop, 0);
								squareTop = Math.min(squareTop, smallHeight-innerOverlayElement.height());
								var squareLeft = (event.pageX-offset.left)-innerOverlayElement.width()/2;
								squareLeft = Math.max(squareLeft, 0);
								squareLeft = Math.min(squareLeft, smallWidth-innerOverlayElement.width());
								innerOverlayElement.css('top', squareTop);
								innerOverlayElement.css('left', squareLeft);
							}
						});
					});

				}(imageElement,zoomElement,fullSizeImage,overlayElement,smallHeight,smallWidth,offset,innerOverlayElement,options));

				//destroy listener
				imageElement.on('extmdestroy',function(){
					zoomElement.remove();
					if (options.squareOverlay) {
						overlayElement.remove();
					}
				});

				//update image
				imageElement.on('updateImage', function(event,newUrl) {
					fullSizeImage.attr('src', newUrl);
				});
			}
			if (options.lazy) {
				if ($(this).width()>10 && $(this).height()>10) {
					$(this).one('mouseenter', function(){
						extmInit(options, $(this));
					});
				}
				else {
					$(this).one('load', function(){
						$(this).one('mouseenter', function(){
							extmInit(options, $(this));
						});
					});
				}
			}
			else {
				if ($(this).width()>10 && $(this).height()>10) {
					extmInit(options, $(this));
				}
				else {
					$(this).one('load', function(){
						extmInit(options, $(this));
					});
				}
			}
		},
		extmDestroy: function extmDestroy() {
			$(this).trigger('extmdestroy');
		},
		extmImageUpdate: function(newUrl){
			$(this).trigger('updateImage', newUrl);
		}
	});
}(jQuery));
