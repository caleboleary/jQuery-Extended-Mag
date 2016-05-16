# jQuery Extended Mag(nify)
jQuery dependent mouseover zoom - I was frustrated with bugs in some other popular choices for accoplishing this, so I decided to make my own!

View the [Demo] here!

# Basic Setup
Include jQuery in the page
```sh
<script src="js/jquery.js"></script>
```
Include the Extended Mag file in the page
```sh
<script src="js/extm.min.js"></script>
```
Initialize the zoom on an image
```sh
<script>
	$('.mainImg').extm();
</script>
```

# Options
### Custom Zoom Holder
You can make the zoom appear in a specified element, like a div you've already set up for this purpose. Pass through a jQuery element. Default is empty, and a new zoom element is inserted in to the page.
```sh
$('.mainImg2').extm({
	zoomElement:$('.customHolder')
}); 
```

### Custom Image Source
With no options, the image is just a full size version of what you're zooming. If you're showing a small version but have the URL for the large version, here's how you'd make it zoom to the large version. Pass through the URL as a string. Default is the src of the image you target at full size.
```sh
$('.mainImg3').extm({
	imageSrc:'http://astrobilliards.com/wp/wp-content/uploads/2015/10/G407-EDIT.jpg'
});
```

### Square Overlay
A nice overlay showing what you're currently zooming in on, can be targeted and styled with CSS. Default is false.
```sh
$('.mainImg5').extm({
	squareOverlay:true
});
```

### Position
You can absolutely position the zoom target to the right or directly on top of the targeted image. Don't mix this with the custom image source options. Defaults to blank. Options include 'overlay' and 'right' sent as strings.
```sh
$('.mainImg7').extm({
	position:'overlay'
});
```

### Lazy Loading
Instead of initializing when the function is called, it will wait until the first mouse-enter to insert zoom holders, set up listeners, etc. Can help with page load times.
```sh
$('.mainImg8').extm({
	lazy:true
});
```

# Other Functions
### Destroy
Function to destroy the zoom, useful for reinitializing after something has changed.
```sh
$('.mainImg9').extmDestroy();
```

View the [Demo] here!

[Demo]: <http://codepen.io/caleboleary/pen/JXyedK>