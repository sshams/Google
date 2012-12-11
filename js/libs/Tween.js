/*
 * @author Saad Shams saad@muizz.com
 * 
 * Tween implementation in JavaScript
 * Started out as an experimental project as an inspiration from TweenLite for Flash
 * There wasn't any JavaScript tweening engine up to par as TweenLite, TweenMax, TimelineMax etc.
 * Their implementation was already populare and I was looking for something equivalent in JavaScript
 * After trying several for instance jQuery, JSTween, 
 * I wrote few things until TweenLite for JavaScript was launched.
 */
 
 /**
  * new Tween(document.getElementById("div"), 1.5, {x: 500, easing:Easing.Elastic.easeIn, onComplete: func});
  * Tween.to(document.getElementById("div"), 1.5, {x: 500, easing:Easing.Elastic.easeIn, onComplete: func});
  */
 
puremvc.define(
{
    name: 'Tween',
    
    /**
    * @constructor
    * @param (HTMLElement) target
    * @param (Number) duration
    * @param (Object) options
    * Intializes the Tween Object
    */
    constructor: function(target, duration, options){
        if(!target) return null;
        this.target = target;
        this.duration = duration ? duration : 1;
        this.options = options ? options : {};
        this.ease = (typeof(options.easing) == "function") ? options.easing : Easing.Linear.easeNone;
        
        this.offset = CSS.getOffset(target);
        
        if(options.x) {
            this.distanceX = Math.abs(this.offset.left - options.x);
            this.directionX = options.x > this.offset.left ? 1 : -1;
        }
        if(options.y) {
            this.distanceY = Math.abs(this.offset.top - options.y);
            this.directionY = options.y > this.offset.top ? 1 : -1;
        }
    
        this.start = new Date();
        this.intervalID = setInterval(Delegate.create(this, this.intervalHandler), 10);
    }
}, 
{
    target: null,
    duration: null,
    options: null,
    ease: null,
    
    offset: null, //{top, left}
    distanceX: 0,
    directionX: 0,
    distanceY: 0,
    directionY: 0,
    
    intervalID: null,
    
    start: null,       //start time
    timePassed: 0,      //how much has been passed
    progress: 0,        //animation progress
    delta: 0,           //easing function value
    
    /*
     * Animation Frame
     * Calculates how much time has passed
     * timePassed/duration to determine % of progress
     * then passes that progress value to easing functions to get delta
     * Calls the step function, which changes values based on delta
     * onComplete function is called at the end
     */
    
    intervalHandler: function() {
        this.timePassed = new Date() - this.start;
        this.progress = this.timePassed/(this.duration * 1000);
        if(this.progress > 1) this.progress = 1; //browsers not always precise in time
        
        this.delta = this.ease.call(this, this.progress);
        this.step();
        
        if (this.progress == 1) {
            clearInterval(this.intervalID);
            this.finalize();
            
            if(typeof this.options.onComplete == "function") {
                this.options.onComplete.call();
            }
        }
    },
    
    /**
     * The function takes the delta determined by the progress and corresponding 
     * easing function, takes the product with the total value that needs to be 
     * changed over time and applies gradually.
     */
    step: function() {
        if(this.options.x && this.directionX > 0) {
            this.target.style.left = this.offset.left + (this.distanceX * this.delta) + 'px';
        } else if(this.options.x) {
            this.target.style.left = this.offset.left - (this.distanceX * this.delta) + 'px';
        }
        if(this.options.y && this.directionY > 0) {
            this.target.style.top = this.offset.top + (this.distanceY * this.delta) + 'px';
        } else if(this.options.y) {
            this.target.style.top = this.offset.top - (this.distanceY * this.delta) + 'px';
        }        
    },
    
    /**
     * Browsers are not precise and accurate in calculations
     * This function sets the final value for the properties of the element
     * once duration cycle gets over.
     */
    finalize: function() {
        if(this.options.x) {
            this.target.style.left = this.options.x + 'px';
        }

        if(this.options.y) {
            this.target.style.top = this.options.y + 'px';
        }
    }
},
{
    /**
     * @param (Object) target
     * @param (Number) duration
     * @param (Object) options
     * handy static function, calls the constructor and returns the object
     */
    to: function(target, duration, options) {
        return new Tween(target, duration, options);
    }
}
);

/**
 * All sorts of easing equations
 * TODO: Cubic, Expo, Quint, Sine, 
 */
puremvc.define(
{
    name: 'Easing'
}, 
{
},
{
    Linear: {
        easeNone: function(progress) {
            return progress;
        }
    },
        
    Quad: {
        easeIn: function(progress) {
            return Math.pow(progress, 2);
        },
        
        easeOut: function(progress) {
            return 1 - Easing.Quad.easeIn.call(this, 1 - progress);
        },
    
        easeInOut: function(progress) {
            if (progress <= 0.5) { // the first half of the animation)
                return Easing.Quad.easeIn.call(this, 2 * progress) / 2;
            } else { // the second half
                return (2 - Easing.Quad.easeIn.call(this, 2 * (1 - progress))) / 2;
            }
        }
    },
        
    Circ: {
        easeIn: function(progress) {
            return 1 - Math.sin(Math.acos(progress));
        },
            
        easeOut: function(progress) {
            return 1 - Easing.Circ.easeIn.call(this, 1 - progress);
        },
    
        easeInOut: function(progress) {
            if (progress <= 0.5) { // the first half of the animation)
                return Easing.Circ.easeIn.call(this, 2 * progress) / 2;
            } else { // the second half
                return (2 - Easing.Circ.easeIn.call(this, 2 * (1 - progress))) / 2;
            }
        }        
    },
        
    Back: {
        easeIn: function(progress) {
            var x = 1.5;
            return Math.pow(progress, 2) * ((x + 1) * progress - x);
        },
            
        easeOut: function(progress) {
            return 1 - Easing.Back.easeIn.call(this, 1 - progress);
        },
    
        easeInOut: function(progress) {
            if (progress <= 0.5) { // the first half of the animation)
                return Easing.Back.easeIn.call(this, 2 * progress) / 2;
            } else { // the second half
                return (2 - Easing.Back.easeIn.call(this, 2 * (1 - progress))) / 2;
            }
        }     
    },
        
    Bounce: {
        easeIn: function(progress) {
	  for(var a = 0, b = 1, result; 1; a += b, b /= 2) {
	    if (progress >= (7 - 4 * a) / 11) {
	      return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
	    }
	  }
	},
            
        easeOut: function(progress) {
            return 1 - Easing.Bounce.easeIn.call(this, 1 - progress);
        },
    
        easeInOut: function(progress) {
            if (progress <= 0.5) { // the first half of the animation)
                return Easing.Bounce.easeIn.call(this, 2 * progress) / 2;
            } else { // the second half
                return (2 - Easing.Bounce.easeIn.call(this, 2 * (1 - progress))) / 2;
            }
        }     
    },
    
    Elastic: {
        easeIn: function(progress) {
            var x = 1.5;
            return Math.pow(2, 10 * (progress-1)) * Math.cos(20*Math.PI*x/3*progress);
        },
            
        easeOut: function(progress) {
            return 1 - Easing.Elastic.easeIn.call(this, 1 - progress);
        },
    
        easeInOut: function(progress) {
            if (progress <= 0.5) { // the first half of the animation)
                return Easing.Elastic.easeIn.call(this, 2 * progress) / 2;
            } else { // the second half
                return (2 - Easing.Elastic.easeIn.call(this, 2 * (1 - progress))) / 2;
            }
        }             
    }
}
);


