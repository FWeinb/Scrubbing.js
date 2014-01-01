//  Base Object
//
//  Used to create a Scrubber
//
//      `node` : Scrubber will be bound to this element
//      `userOptions` : [optional] Here you can pass some Options
//
var Scrubber = function ( node, userOptions ) {

  // Make `new` optional
  if ( !( this instanceof Scrubber )){
    return new Scrubber ( userOptions );
  }
  // Save DOM node
  this.node        =  node;

  // Add Options
  this.options     = {};

  fillOption ( this.options, userOptions, defaultOptions, Scrubber.driver,   "driver");
  fillOption ( this.options, userOptions, defaultOptions, Scrubber.resolver, "resolver");
  fillOption ( this.options, userOptions, defaultOptions, Scrubber.adapter,  "adapter");


  this.node.dataset.scrubOrientation = this.options.resolver.name;

  // Initialise Adapter
  this.options.adapter.init ( this );

  // Initialise Driver
  this.options.driver.init ( this );
};

Scrubber.prototype = {

    remove   : function (){
      this.options.driver.remove ( this );
    }
};
