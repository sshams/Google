/*
 * TagComponent implementation in JavaScript
 *  @author: Saad Shams, saad@muizz.com
 */
 
/**
 * This component is written to enable static HTML components equip with behaviors
 * and simulate them as if they're objects with instance variables and methods. It provides
 * Observer/Notification Pattern between TagComponents and it's Mediators, in addition
 * Cross browser implementation and registration of user generated events in the browser
 * CSS Manipulations
 * Enums for event names
 * Cross Event Adapter
 * Delegate.create to set the context of the called function
 * Utilities
 */

puremvc.define(
{
    name: 'view.components.TagComponent',
    
    /**
    * @constructor
    * @param (HTMLElement) element
    * Takes an HTMLElement and dedicates itself to it for any functionality required
    */
    constructor: function(element){
        if(element) {
            this.element = element;
            this.id = this.element.id;
        }
        this.listenerMap = new Array();
    }
},
{
    listenerMap: null,
    element: null,
    id: null,
    
    /**
     * @param {String} type
     * @param (Object) listener
     * Mediator sets itself as a listener on Tag Component using custom event type
     * listener can be a function or an object with handlEvent function
     */ 
    
    addEventListener: function(type, listener) {
        if(!this.listenerMap[type]){
            this.listenerMap[type] = new Array();
        }
        
        for(var i=0; i<this.listenerMap[type].length; i++) {
            if(this.listenerMap[type][i] == listener){
                return;
            }
        }
        
        this.listenerMap[type].push(listener);
    },
    
    /**
     * @param {String} type
     * @param (Object) listener
     * Mediator removes itself as a listener on Tag Component using custom event type
     * listener can be a function or an object with handlEvent function
     */     
    
    removeEventListener: function(type, listener) {
        if(!this.listenerMap[type]) {
            return;
        }
        
        for(var i=0; i<this.listenerMap[type].length; i++) {
            if(this.listenerMap[type][i] == listener){
                this.listenerMap[type].splice(i, 1);
            }
        }
    }, 
    
    /**
     * @param (String) event
     * The TagComponent dispatches a custom Event
     * If listener is a function in the mapped array it gets called or
     * handleEvent of the function is called if it's an object
     */ 
    dispatchEvent: function(event){
        if(typeof(event) == 'undefined' || typeof(event.type) == 'undefined') {
            return;
        }
        
        if(!this.listenerMap[event.type]){
            return;
        }
        
        for(var i=0; i<this.listenerMap[event.type].length; i++){
            var listener = this.listenerMap[event.type][i];
            
            if(typeof(event.target) == 'undefined') {
                event.target = this;
            }
            
            if(typeof(listener) == 'function') {
                listener.call(this, event);
            } else if(typeof(listener.handleEvent) != 'undefined') {
                listener.handleEvent.call(listener, event);
            }
        }
    },    
    
    /**
     * @param (HTMLElement) element
     * @param (String) event
     * @param (Function) method
     * @param (Boolean) useCapture
     * addEventHandler is a cross browser method used by TagComponent for user
     * generated events like click, mouseover, mousedown etc.
     * Not to be confused by AddEventListener (Mediator uses that to listen to TagComponents)
     * if it's IE, 'on' gets added, it's removed for other browsers
     * pass onclick or click, both will be handled
     * you can use events.MouseEvent.CLICK, see events for other options
     */
    addEventHandler: function(element, event, method, useCapture) { //component level for elements
        if(element.addEventListener) {
            event = event.replace('on', '');
            element.addEventListener(event, method, useCapture == true ? true : false);
        } else if(element.attachEvent){
            element.attachEvent('on'  + event, method);
        }
    },
    
    /*
     * @param (HTMLElement) element
     * append a child to current element
     */
    append: function(element) {
        this.element.appendChild(element);
    },
    
    /*
     * @param (HTMLElement) element
     * prepend the child before the element
     */
    prepend: function(element) {
        this.element.insertBefore(element);
    }
}
);

/**
* CSS Utility Classes
*/

puremvc.define(
{
    name: 'CSS'
},
{
},
{
    /*
     * @param (HTMLElement) element
     * @param (String) className
     * @returns (String)
     * Checks if the element has a class name
     */
    hasClass: function(element, className) {
        return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
    },
    
    /*
     * @param (HTMLElement) element
     * @param (String) className
     * Removes the class from the element
     */
    removeClass: function(element, className) {
        if(CSS.hasClass(element, className)) {
            element.className = element.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), '');
	}
    },
    
    /*
     * @param (HTMLElement) element
     * @param (String) className
     * Adds the class to the element if it's not existing
     */
    addClass: function(element, className) {
        if(!CSS.hasClass(element, className)) {
            element.className += element.className ? " " + className : className;
        }
    },
    
    /*
     * @param (HTMLElement) element
     * @param (String) className
     * Remove the class if it's present or else adds to the element
     */
    toggleClass: function(element, className) {
        if(CSS.hasClass(element, className)) {
            CSS.removeClass(element, className);
        } else {
            CSS.addClass(element, className);
        }
    },
    
    /*
     * @param (HTMLElement) element
     * Utility function to add .hidden to the element, 
     * .hidden must be specified in the CSS with related display properties
     */
    hide: function(element) {
        CSS.addClass(element, "hidden");
    },
    
    /*
     * @param (HTMLElement) element
     * @returns (String)
     * Utility function to remove .hidden from the element, 
     * .hidden must be specified in the CSS with related display properties
     */
    show: function(element) {
        CSS.removeClass(element, "hidden");
    },
    
    /*
     * @param (HTMLElement) element
     * @param (String) style
     * gets the value of the CSS style
     */
    getStyle: function(element, style) {
        if(!document.getElementById) return null;
        
        var value = element.style[CSS.toCamelCase(style)];
        if(!value) {
            if(document.defaultView) {
                value = document.defaultView.getComputedStyle(element, "").getPropertyValue(style);
            } else if(element.currentStyle) {
                value = element.currentStyle[CSS.toCamelCase(style)];
            }
        }
        return value;
    },
    
    /*
     * @param (String) input
     * Used by getStyleMethod to convert CSS style names to JavaScript 
     * CamelCase equivalent
     */
    toCamelCase: function(input) {
        var oStringList = input.split('-');
        if(oStringList.length == 1)  
            return oStringList[0];
        
        var ret = input.indexOf("-") == 0 ? oStringList[0].charAt(0).toUpperCase() + oStringList[0].substring(1) : oStringList[0];
        for(var i = 1, len = oStringList.length; i < len; i++){
            var s = oStringList[i];
            ret += s.charAt(0).toUpperCase() + s.substring(1)
        }
        return ret;
    },
        
    /**
     * @param (HTMLElement) element
     * @returns (Object) {top, left}
     * returns an object with top left position of the HTMLElement
     */
    getOffset: function(element) {
        var _x = 0;
        var _y = 0;
        while(element && !isNaN(element.offsetLeft) && !isNaN(element.offsetTop)) {
            _x += element.offsetLeft - element.scrollLeft;
            _y += element.offsetTop - element.scrollTop;
            element = element.offsetParent;
        }
        return {top:_y, left:_x};
    },
    
    /**
     * @param (HTMLElement) element
     * @param (Number) value
     * Sets the alpha of the HTMLElement specified by it's value, 1-100
     */
    setAlpha: function(element, value) {
        element.style.filter = 'alpha(opacity=' + value + ')';
        element.style.opacity = value;
    }
}
);

/*
* Event Class
* Custom Event class
*/

puremvc.define(
{
    name: 'view.components.Event',
    
    /**
    * @constructor
    * @param (String) type
    * @param (Object) target
    * @param (Object) body
    * type is the name, target specifies the source that generated event
    * body holds any custom data
    */
    constructor: function(type, target, body){
        this.type = type;
        this.target = target;
        this.body = body;
    }
}, 
{
    type: null,
    target: null,
    body: null
},
{
    /*
     * Adapting event
     * IE event target is srcElement, this function sets the target property
     * and takes the value from srcElement, besides setting other properties on the
     * event object
     */
    adapt: function(event) {
        if(event.srcElement) { //IE
            event.target = event.srcElement;
            
            if(event.clientX || event.clientY) {
                event.pageX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                event.pageY = event.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
            }
        }
        
        if(event.target.nodeType && event.target.nodeType == 3) { //safari bug
            event.target = event.target.parentNode;
        }
    }  
}
);

/**
* Function context.
*/

puremvc.define(
{
    name: 'Delegate'
},
{
},
{
    /*
     * @param (Object) target
     * @param (Function) method
     * Sets the context and any passed arguments to the method
     */
    create: function(target, method) {
        var args = new Array();

        for(var i=2; i<arguments.length; i++) {
            args.push(arguments[i]);
        }
        
        return function(){
            var args2 = new Array();
            
            for(var i=0; i<arguments.length; i++) {
                args2.push(arguments[i]);
            }
            
            return method.apply(target, args2.concat(args));
        }
    }
}
);

/**
* Enum for events
* typically used by addEventHandler (TagComponent)
*/

puremvc.define(
{
    name: 'events'
},
{
},
{
    MouseEvent: {CLICK: "click", MOUSE_OVER: "mouseover", MOUSE_OUT: "mouseout", MOUSE_DOWN: "mousedown", MOUSE_UP: "mouseup", MOUSE_MOVE: "mousemove"},
    KeyboardEvent : {KEY_DOWN:"keydown", KEY_UP:"keyup", KEY_PRESS:"keypress"},
    TouchEvent: {TOUCH_START: "touchstart", TOUCH_MOVE: "touchmove", TOUCH_END: "touchend", TOUCH_CANCEL: "touchcancel"},
    Window: {RESIZE: "resize"}
}
);

Function.prototype.later = function(ms) {
    // from http://la.ma.la/blog/diary_200507302354.htm
    var self = this;
    var func = function(){
        var arg = func.arguments;
        var apply_to = this;
        var later_func = function(){
            self.apply(apply_to, arg)
        };
        setTimeout(later_func,ms);
    };
    return func;
}

/**
* @param (...)
* Concatenates all the arguments and outputs them in the console
* try catch block for IE 6 and a specific version of IE 8, because it simply 
* throws an error even if we do if(console)
*/
function trace() {
    try {
        if(window && window.console && window.console.log) {
            var message = "";
            for(var i=0; i<arguments.length; i++) {
                message += arguments[i] + ((i == arguments.length - 1) ? "" : ", ");
            }
            window.console.log(message);
        }
    } catch(exception) {
        window.console = {}; 
        console.log = function(message){};
        console.log(exception);
    }
}

/*
 * @param (Object) obj
 * @param (Boolean) optional
 * Iterate through an object, get all property names and values,
 * concatenates in a string joined by new line character
 * second optional parameter specifies if the new line character is <br> or \n
 */
function dump(obj) {
    var str = "";
    for(var prop in obj) {
        str += prop + ": " + obj[prop] + (arguments[1] ?  "<br>" : "\n");
    }
    return str;
}
