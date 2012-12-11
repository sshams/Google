/**
* @author Saad Shams :: saad@muizz.com
* Commands resides in the controller section of the system, and are used are for
* system wide operations, like system startup, retrieving a proxy, fetching data, 
* and passing on to View Tier (Mediators/Components) for display of data. 
* Commands are instantiated on the notification and execute function gets called.
* */

puremvc.define(
{
    name: "controller.commands.StartupCommand",
    parent: puremvc.SimpleCommand
},
{
     /**
     * @param {Object} notification
     * Instance created and execute function called upon Startup Notification
	 * TagComponents are instaniated, view.components.Scroller and view.components.Menu
	 * Registers Mediators ScrollerMediator and MenuMediator for these TagComponents
	 * Any dispatch of custom events that requires change in the other part of the system,
	 * are handled by their respective mediators. That's the main core of the system.
     */
	
    execute: function(notification) {
        this.facade.registerMediator(new view.mediators.ScrollerMediator(new view.components.Scroller("scroller"))); //id scroller of the HTML element
        this.facade.registerMediator(new view.mediators.MenuMediator(new view.components.Menu("menu"))); //id menu of the HTML element
    }
}
);
