/*
liteSlider
Damian Rogers (damian@sudden-desu.net)
version 1.0 - Modern Browser Version
This version lacks support for Internet Explorer 9 and below
*/
window.reqAF=(function(){
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
})();
window.cnAF=(function(){
	return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame;
})();

//----------------------------STATIC OBJECT
var _liteSlider={
	killanim:function(ls) {
		if(ls._.animCall!==-1) {
			window.cnAF(ls._.animCall);
			_liteSlider.resetMx(ls);
		}
	},
	animCheck:function() {
		if(window.reqAF) return true;
		return false;
	},
	animLeft:function(ls,perc) {
		var cW=ls._.curr.offsetWidth,
			p=Math.ceil(cW*(1-_liteSlider.easing(perc)));
		ls._.next.style.left=(cW-p)+"px";
		if(!ls.settings.overwrite) ls._.curr.style.left=(-p)+"px";
	},
	animRight:function(ls,perc) {
		var	p=Math.floor(ls._.curr.offsetWidth*_liteSlider.easing(perc));
		ls._.next.style.left=(-p)+"px";
		if(!ls.settings.overwrite) ls._.curr.style.left=(ls._.next.offsetWidth-p)+"px";
	},
	animUp:function(ls,perc) {
		var p=Math.ceil(ls._.curr.offsetHeight*(1-_liteSlider.easing(perc)));
		ls._.next.style.top=(ls._.curr.offsetHeight-p)+"px";
		if(!ls.settings.overwrite) ls._.curr.style.top=(-p)+"px";
	},
	animDown:function(ls,perc) {
		var p=Math.floor(ls._.curr.offsetHeight*_liteSlider.easing(perc));
		ls._.next.style.top=(-p)+"px";
		if(!ls.settings.overwrite) ls._.curr.style.top=(ls._.next.offsetHeight-p)+"px";
	},
	animOpac:function(ls,perc) {
		var cs=1-(_liteSlider.easing(-perc));
		var ns=_liteSlider.easing(perc);
		ls._.curr.style.opacity=1-perc;
		ls._.next.style.opacity=perc;
		
	},
  // Reset metrics to baseline view from an animating state
	resetMx:function(ls) {
		ls._.next.style.left="0px",
		ls._.next.style.top="0px",
		ls._.next.style.opacity="1",
		ls._.curr.style.display="none",
		ls._.curr.style.left="0px",
		ls._.curr.style.top="0px",
		ls._.curr.style.opacity="1";
		ls._.curr=ls._.next;
		ls._.curr.style.zIndex="8";
		ls._.currIdx=ls._.nextIdx;
		ls._.animCall=-1;
	},
	easing:function(p) {
		return Math.pow(1-p, 10);
	},
  // takes the UL tag containing the slides and formats the LIs as necessary
	build:function(ls) {
		if(typeof ls!='object') throw '_liteSlider.build: invalid ls object passed';
		//begin by clearing out the array of slide elements (LIs), in case this is being called from rebuild
		var _=ls._;
		_.slideArr=[];
		// get a list of all the LI elements in the viewport
		var lis=_.slider.children;

		// We'll track the LIs in the slideArr var
		for(var l=0,cl=lis.length;l<cl;l++) {
			// push LIs on to slideArr, discard everything else
      if(lis[l].tagName=="LI") _.slideArr.push(lis[l]);
			else _.slider.removeChild(lis[l]);
		}
		//nothing in the array? (no LIs found) return
		if(_.slideArr.length==0) return;
		
		//style the LIs so they fit the slider
		var sW=_.slider.offsetWidth,sH=_.slider.offsetHeight;		//slider width and height
		for(var l=_.slideArr.length-1;l>-1;l--){
			var s=_.slideArr[l].style;
			s.display="none",
			s.zIndex="8",
			s.listStyleType="none",
			s.position="absolute",
			s.width="100%";
			s.height="100%",
			s.margin="0";
		}
			
		//manually set up the initial slide pointer and element
		_.currIdx=0;
		_.curr=_.slideArr[0];
		_.curr.style.display="block";
		
	},
  // Defaults for the settings object when properties are not specified
  defaults:{
    displayTime:5000,
	  transitionTime:900,
	  autostart:true,
	  overwrite:false,
	  nextDirection:'left',
	  prevDirection:'right'
  }
}
//----------------------------INSTANCED OBJECT
var liteSlider=function(element,settings){
	//store a reference to the new object for use in the methods
	var tl=this;
	this.settings={},this._={};
	
	//check the parameter, store the slider element
	switch(typeof element) {
		case 'string':
			this._.slider=document.getElementById(element);
			if(this._.slider===null) throw "Unable to find the element by the given ID";
			break;
		case 'object':
			if(!element.hasOwnProperty('Node')) throw "Object is not a DOM element)";
			this._.slider=element;
			break;
		default:
			throw "Invalid type passed for element";
	}
	
	//check that the browser supports reqAF and cnAF
	if(!_liteSlider.animCheck()){
		this._.slider.style.backgroundColor="#fff";
		this._.slider.style.color="#000";
		this._.slider.innerHTML='<p>This browser does not support requestAnimationFrame/cancelAnimationFrame</p>';
		return;
	}
	
	//-----set up the settings object with defaults if necessary
  settings=settings||{};
	this.settings.displayTime=settings.displayTime||_liteSlider.defaults.displayTime;
	this.settings.transitionTime=settings.transitionTime||_liteSlider.defaults.transitionTime;
	//this.settings.autostart=settings.autostart||true;
	//lol can't || on a boolean!!
  if(typeof settings.autostart==='undefined' || settings.autostart==null) this.settings.autostart=_liteSlider.defaults.autostart;
	else this.settings.autostart=settings.autostart;
	//...or can you??
	this.settings.overwrite=settings.overwrite||_liteSlider.defaults.overwrite;
	this.settings.nextDirection=settings.nextDirection||_liteSlider.defaults.nextDirection;
	this.settings.prevDirection=settings.prevDirection||_liteSlider.defaults.prevDirection;
	switch(this.settings.nextDirection) {
		case 'right':
			this._.animNext=_liteSlider.animRight;
			break;
		case 'up':
			this._.animNext=_liteSlider.animUp;
			break;
		case 'down':
			this._.animNext=_liteSlider.animDown;
			break;
		case 'fade':
			this._.animNext=_liteSlider.animOpac;
			break;
		default:
			this._.animNext=_liteSlider.animLeft;
			break;
	}
	switch(this.settings.prevDirection) {
		case 'left':
			this._.animPrev=_liteSlider.animLeft;
			break;
		case 'up':
			this._.animPrev=_liteSlider.animUp;
			break;
		case 'down':
			this._.animPrev=_liteSlider.animDown;
			break;
		case 'fade':
			this._.animPrev=_liteSlider.animOpac;
			break;
		default:
			this._.animPrev=_liteSlider.animRight;
			break;
	}
	
	this._.animCall=-1;
	
	//-----set up the viewport
	this._.slider.style.position="relative";
	this._.slider.style.display="block";
	this._.slider.style.overflow="hidden";
	
	//--------------------- METHOD DEFINITIONS
	this._.animLoop=function(animSched) { 
		var t=tl.settings.transitionTime,
		//c=Date.now()-tl._.animStart;
		c=animSched-tl._.animStart;

		if(c>=t) {
			_liteSlider.resetMx(tl);
			return;
		}
        tl._.next.style.display="block";
		tl._.animCall=window.reqAF(tl._.animLoop);
		tl._.animMethod(tl,(c/t));
	}
	
	this.slideTo=function(idx) {
	
      if(typeof idx!=='number' || idx<0 || idx>(tl._.slideArr.length-1)) throw "Invalid value passed for slideTo";
    
      
      //run killanim first so A) currIdx is set properly and B) so if the user is calling the function repeatedly, it 'skips' the animation and shows the info immediately
      _liteSlider.killanim(tl);
		// now, check if the requested slide is the same as the current slide, and if so, no need to do anything...
        if(idx === tl._.currIdx) return;
		
		// we need to calculate what the next slide is and get a reference to it
		//if(tl._.currIdx>=tl._.slideArr.length-1) tl._.nextIdx=0;
		//else tl._.nextIdx=tl._.currIdx+1;
        
		tl._.nextIdx=idx;
		tl._.next=tl._.slideArr[idx];
		//curr is now 'old'
		// at the end of the anim, set next to curr
		
		tl._.animMethod=tl._.animNext;
		
		//get the start time and begin the sliding animation loop
		//tl._.animStart=Date.now();
		tl._.animStart=performance.now();
		tl._.next.style.zIndex="9";
		
    tl._.animCall=window.reqAF(
      function (ac) {
        tl._.animLoop(ac);
        tl._.next.style.display="block";
      });
	}
	
	this.nextSlide=function() {
		_liteSlider.killanim(tl);
		if(tl._.currIdx>=tl._.slideArr.length-1) tl._.nextIdx=0;
		else tl._.nextIdx=tl._.currIdx+1;
		tl._.next=tl._.slideArr[tl._.nextIdx];
		//curr is now 'old'
		// at the end of the anim, set next to curr
		
		tl._.animMethod=tl._.animNext;
		
		//get the start time and begin the sliding animation loop
		//tl._.animStart=Date.now();
		tl._.animStart=performance.now();
		tl._.next.style.zIndex="9";
    
    // we'll wait for the callback from reqAF before we make the element visible
    // prevents flashing in IE10
    tl._.animCall=window.reqAF(
      function (ac) {
        tl._.animLoop(ac);
        tl._.next.style.display="block";
      });
	}
	
	this.prevSlide=function() {
		_liteSlider.killanim(tl);
		if(tl._.currIdx<=0) tl._.nextIdx=tl._.slideArr.length-1;
		else tl._.nextIdx=tl._.currIdx-1;
		tl._.next=tl._.slideArr[tl._.nextIdx];
		
		tl._.animMethod=tl._.animPrev;
		
		//tl._.animStart=Date.now();
		tl._.animStart=performance.now();
		tl._.next.style.zIndex="9";

    tl._.animCall=window.reqAF(
      function (ac) {
        tl._.animLoop(ac);
        tl._.next.style.display="block";
      });        	
	}
	
	this.rebuild=function() {
		_liteSlider.build(tl);
	}
	
	this.start=function() {
		//if there are less than two slides (zero or 1), then return; no need to animate, etc
		if(tl._.slideArr.length<2) return;
		tl._.loop=setInterval(tl.nextSlide,tl.settings.displayTime);
	}
	this.stop=function() {
		_liteSlider.killanim(tl);
		clearInterval(tl._.loop);
	}
	this.resetTimer=function() {
		clearInterval(tl._.loop);
		tl.start();
	}
	
  // Setup is done, let's go!
	_liteSlider.build(this);
	// if there is only one slide, don't go any further; there's no need to animate, etc.
	if(tl._.slideArr.length==1) return;	
	
	if(this.settings.autostart) this.start();
};