/**
* @author Saad Shams :: saad@muizz.com
* Manages the functionality of menu and left/right arrow buttons
* */

puremvc.define(
{
    name: "view.components.Menu",
    parent: view.components.TagComponent,
    
    /**
    * @constructor
    * @extends {view.components.TagComponent}
    */
   
    constructor: function(element) {
        view.components.TagComponent.call(this, document.getElementById(element));
        
        //Event handlers for the bottom row menu
        for(var i=0; i<this.total; i++) { 
            this.buttons.push(document.getElementById("menu_" + i));
            this.spans.push(document.getElementById("span_" + i));
            this.addEventHandler(this.buttons[i], events.MouseEvent.CLICK, Delegate.create(this, this.buttons_clickHandler)); //Delegate.create to set context (this)
        }

        //Left, Right arrow buttons and their event handlers
        this.left = document.getElementById("left");
        this.right = document.getElementById("right");
        this.addEventHandler(this.left, events.MouseEvent.CLICK, Delegate.create(this, this.left_clickHandler)); //Delegate.create to set context (this)
        this.addEventHandler(this.right, events.MouseEvent.CLICK, Delegate.create(this, this.right_clickHandler));

	this.setBackgroundPosition(0);
        
        this.intervalID = setInterval(Delegate.create(this, this.intervalHandler), 2500); //Slide Show on load, will stop if menu/arrows are clicked
    }
},
{
    /* Instance Methods and variables */
    
    buttons: [],    //menu buttons
    spans: [],      //spans for sprite positions
    total: 11,      //total number of buttons
    left: null,     //left arrow button
    right: null,    //right arrow button
    currentIndex: 0,//current state of the menu
    intervalID: 0,	//for slide show
    
    /**
     * @param {Object} event
     * clickHandler for each button
     * dispatches custom SCROLL event to let it's mediator know
     * Mediator then sends SCROLL Notification for which ScrollerMediator is already listening for,
     * which in turns calls the scroll method on Scroller, that's how a decoupled approach is exercised.
     * This Menu component is free to change it's API or internal implementation without side effects
     * to any other components in the system. It only knows it's mediator and minds it's own business.
     */

    buttons_clickHandler: function(event) {
        view.components.Event.adapt(event); //adapting event.target with event.srcElement
        var id = parseInt(event.target.id.split("_")[1]); //extracts menu id
        
        clearInterval(this.intervalID); //stop the slide show
        
        if(id != this.currentIndex) { //if same menu button is not hit again.
            this.currentIndex = id;
            this.setBackgroundPosition(id);
            this.dispatchEvent(new view.components.Event(this.constructor.SCROLL, event.target, id)); //dispatch custom event to MenuMediator
        }
    },
    
     /**
     * @param {Object} event
     * clickHandler for the left arrow button
     * Custom event SCROLL gets dispatched for which it's Mediator is listening for
     * that will send a system wide SCROLL notification, ScrollMediator is listening for this notification
     * which in turn will call the SCROLL function on the Scroll Tag Component
     * decrements the index and passes the value in the event itself
     */
    left_clickHandler: function(event) {
        view.components.Event.adapt(event); //adapting event.target with event.srcElement
        
        clearInterval(this.intervalID); //stop the slide show
		
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.total - 1;
        }
        this.setBackgroundPosition(this.currentIndex);
        this.dispatchEvent(new view.components.Event(this.constructor.SCROLL, event.target, this.currentIndex));
    },
    
    /**
     * @param {Object} event
     * clickHandler for the left arrow button
     * Custom event SCROLL gets dispatched for which it's Mediator is listening for
     * that will send a system wide SCROLL notification, ScrollMediator is listening for this notification
     * which in turn will call the SCROLL function on the Scroll Tag Component
     * increments the index and passes the value in the event itself
     */
    right_clickHandler: function(event) {
        view.components.Event.adapt(event); //adapting event.target with event.srcElement
        
        clearInterval(this.intervalID); //stop the slide show
		
        this.currentIndex++;
        if(this.currentIndex > this.total - 1) {
            this.currentIndex = 0;
        }
        this.setBackgroundPosition(this.currentIndex);
        this.dispatchEvent(new view.components.Event(this.constructor.SCROLL, event.target, this.currentIndex));
    },
    
    /**
     * @param {Number} id
     * Set background position using Sprite index
     * Sprite is colored vertical strip with a height of 18 * 12 pixels, for each menu item
     * Total menu items are 11, 1 additional for default gray to indicate the inactive state
     */
    setBackgroundPosition: function(id) {
        this.reset();
        //height: 18, +1 because upper most portion is default gray
        this.spans[id].style.backgroundPosition="0px " + -((id + 1) * 18) + "px"; 
    },
        
      /**
     * Slide Show
     * Slide Show will run on load, will stop if any interaction happens to the
     * menu buttons or the arrow buttons
     */
    intervalHandler: function() { 
        this.currentIndex++;
        if(this.currentIndex >= this.total) {
            this.currentIndex = 0;
            clearInterval(this.intervalID); //Stops the slide show once iteration is complete
        }
        this.setBackgroundPosition(this.currentIndex);
        this.dispatchEvent(new view.components.Event(this.constructor.SCROLL, null, this.currentIndex)); //dispatch custom event to MenuMediator
    },

    /**
     * reset background sprite for all the menu items
     * used by setBackgroundPosition
     */
    reset: function() {
        for(var i=0, length=this.spans.length; i<length; i++) {
            this.spans[i].style.backgroundPosition="0px 0px";
        }
    }
}, 
{   
    /* Static methods and variables */
    
    //Custom type event name for dispatching events to it's Mediator (MenuMediator)
    SCROLL: "scroll"
}
);
