//  Base Object
//
//  Used to create a Scrubbing
//
//      `node` : Scrubbing will be bound to this element
//      `userOptions` : [optional] Here you can pass some Options
//
var Scrubbing = function ( node, userOptions ) {

  // Make `new` optional
  if ( !( this instanceof Scrubbing )){
    return new Scrubbing ( userOptions );
  }
  // Save DOM node
  this.node        =  node;

  // Add Options
  this.options     = {};

  fillOption ( this.options, userOptions, defaultOptions, Scrubbing.driver,   "driver");
  fillOption ( this.options, userOptions, defaultOptions, Scrubbing.resolver, "resolver");
  fillOption ( this.options, userOptions, defaultOptions, Scrubbing.adapter,  "adapter");


  this.node.dataset.scrubOrientation = this.options.resolver.name;

  // Add scrubbing element to node
  node.scrubbingElement = this;

  // Initialise Adapter
  this.options.adapter.init ( this );
  // Initialise Driver
  callObjOrArray ( this.options.driver, "init", this);
};

Scrubbing.prototype = {
    remove   : function (){
      delete node.scrubbingElement;
      callObjOrArray ( this.options.driver, "remove", this);
    }
};
