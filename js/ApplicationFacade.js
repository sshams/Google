/**
* @author Saad Shams :: saad@muizz.com
* Creates and initializes Model, View and Controller Tiers
* */

puremvc.define(
{
    name: 'ApplicationFacade',
    parent: puremvc.Facade
},
{
     /**
     * Entry point in the system
     * initializes and dispatches STARTUP notification, 
     * StartupCommand is registered for this notification
     */
	
    startup: function() {
        if(!this.initialized) {
            this.initialized = true;
            this.registerCommand(ApplicationFacade.STARTUP, controller.commands.StartupCommand);
            this.sendNotification(ApplicationFacade.STARTUP);
        }
    }
},
{   
    /* Static functions and variables */
    
    /**
     * @param {String} multitonKey
     * returns multiton instance from the mapped array
     * creates one if it doesn't exists
     */
	 
    getInstance: function(multitonKey) {
        var instanceMap = puremvc.Facade.instanceMap;
        instance =instanceMap[multitonKey];
        if(instance) {
            return instance;
        }
        return instanceMap[multitonKey] = new ApplicationFacade(multitonKey);
    },
    
    STARTUP: "startup", //System startup, StartupCommand is registered for this
    
    //Scroll Notifications sent by MenuMediator and listened by ScrollMediator
    SCROLL: "scroll"
}
);

