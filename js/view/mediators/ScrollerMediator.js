/**
* @author Saad Shams :: saad@muizz.com
* Manages and listens to TagComponent Scroller
* */

puremvc.define(
{
    name: 'view.mediators.ScrollerMediator',
    parent: puremvc.Mediator,
    
    constructor: function(component) {
        puremvc.Mediator.call(this, this.constructor.NAME, component);
    }
},
{
    /* Instance Methods and variables */
    
    onRegister: function() {
    },
    
    /**
    * Notification List of it's Interests
    * @return {Array}
    */
    listNotificationInterests: function() {
        return [
            ApplicationFacade.SCROLL,
        ];
    },
    
    /**
    * @param {Object.<Notification>} notification
    * This function gets executed if the Notification
    * is specified in listNotificationInterests
    * Once notification is sent across the system
    * this function is called
    * This function filters down using notification name in case there are 
    * more notifications it can handle
    */
    handleNotification: function(notification) {
        switch(notification.getName()) {
            case ApplicationFacade.SCROLL:
                if(this.facade.multitonKey == "google_enhanced") { //to handle tween based version
                    this.viewComponent.scroll(notification.getBody(), true)
                } else { //non animated version
                    this.viewComponent.scroll(notification.getBody(), false);
                }
                break;
        }
    }
    
},
{
    /* Static methods and variables */
    NAME: "ScrollerMediator"
}
);