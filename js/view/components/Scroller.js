/**
* @author Saad Shams :: saad@muizz.com
* Manages the functionality of Scroller Tag Component
* */

puremvc.define(
{
    name: "view.components.Scroller",
    parent: view.components.TagComponent,
    
    /**
    * @constructor
    * @extends {view.components.TagComponent}
    */
    constructor: function(element) {
        view.components.TagComponent.call(this, document.getElementById(element));
        this.imageWidth = document.getElementById("product").width;
    }
},
{
    /* Instance Methods and variables */
    imageWidth: null, //width of the image

    /**
     * @param {Number} id
     * @param {Boolean} enhanced
     * Slide the image id * imageWidth
     * Boolean specifies if to use enhanced version based on tweening
     * Note that Same code is shared between two html files, 
     * only the html files pass a different parameter for the animated core
    */
    scroll: function(id, enhanced) { 
        if(!enhanced) { //non animated version based on client's request
            this.element.style.marginLeft = -id * this.imageWidth + 'px';
        } else { //animated version using an industry standard, long awaited animation engine for javascript (it's famous for flash animations)
            TweenLite.to(this.element, .5, {css:{x:-id * this.imageWidth}});
        }
    }
}, 
{
    /* Static methods and variables */

}
);

