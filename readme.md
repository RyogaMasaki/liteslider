liteSlider
==========
liteSlider is a simple, fast, lightweight HTML content slider with an emphasis on quick user response and fast animation. Slides an be timed to move automatically or advanced manually by the user, or both! They can transition in the four cardinal directions as well as cross-fade. liteSlider is written in pure JavaScript; no need for a heavy supporting framework.

How to use
----------
liteSlider uses a target <UL> element with each <LI> child representing a frame. Simply instantiate a new instance of the liteSlider object with the ID of the <UL> element along with an object containing the settings for the slider:

var newslider = new liteSlider('ls-slider',
  {
    autostart:false,
    nextDirection:'up'
  });

The liteSlider object also has methods for manually moving to the next and previous frames, which can be bound to DOM events like mouse clicks:

`document.getElementById('nextslide').addEventListener('click',function() {`
`  newslider.nextSlide();`
`},false);`

Legacy Internet Explorer support
--------------------------------
liteSlider comes in two versions: one for modern browsers (IE10+, Chrome, Firefox) and one for legacy IE (8 and 9). The modern version makes use of the requestAnimationFrame functionality to make smoother animations with less CPU cost; the legacy version uses the setInterval method. Needless to say if you don't need older IE support... use the modern one!

Methods
-------
`nextSlide()`
Moves to the next slide

`prevSlide()`
Returns to the previous slide

`rebuild()`
Rebuilds the slides from the LI children. This should be used on a dynamic page where LI elements are added or removed.

`resetTimer()`
Resets the timer for automatic slide advances. This is useful if a slider moves automatically but also has user input to manually move slides; resetting the timer will prevent the slide from moving automatically soon after the user manually moves a slide.

`slideTo(index)`
Moves to the specified slide by its index.

`start()`
Start the automatic slide advance.

`stop()`
Stop the automatic slide advance.

Settings
--------
`autostart` (boolean, default: true)
This option will enable automatic slide advance as soon as the slides are built and ready.

`displayTime` (number, default: 5000)
The amount of time (in milliseconds) that a slide will show before automatically transitioning, if automatic advance is enabled.

`nextDirection` (string, default: 'left')
The transition method for moving to the next slide. Valid options are up, down, left, right and fade.

`overwrite` (boolean, default: false)
If overwrite is false, the old slide is moved out as the new slide transitions in. If overwrite is true, the old slide doesn't move, causing the new slide to 'overwrite' the old one as it moves in.

`prevDirection` (string, default: 'right')
The transition method for moving to the previous slide. Valid options are up, down, left, right and fade.

`transitionTime` (number, default: 900)
The speed (in milliseconds) for a slide to transition.