/**
* @author Saad Shams :: saad@muizz.com
* Manages and listens to TagComponent Menu
* */

puremvc.define(
{
    name: 'view.mediators.MenuMediator',
    parent: puremvc.Mediator,
    
    constructor: function(component) {
        puremvc.Mediator.call(this, this.constructor.NAME, component);
    }
},
{
    /* Instance Methods and variables */
    
    onRegister: function() { //listen for SCROLL custom event from the Menu Component
        this.viewComponent.addEventListener(view.components.Menu.SCROLL, Delegate.create(this, this.scrollHandler));
    },
    
    /**
     * @param {Object} event
     * handler for SCROLL custom event
     * which in turns sends SCROLL notification 
     * ScrollMediator is listening for this notification for required functionality
     */
    scrollHandler: function(event) { 
        this.facade.sendNotification(ApplicationFacade.SCROLL, event.body); //Send Scroll Notification
    }
},
{
    /* Static methods and variables */
    NAME: "MenuMediator"
}
);