(function (window, undefined){

// Adapter are used to bridge between the Scrubber and the DOM


// The BasicNode Adapter comes bundled and allows the Scrubber to work
// on DOM elements, reading the starting value from DOM and writing it back on change.
var BasicNodeAdapter = {


  // Called everytime a new `scrubberElement` was created.
  init : function ( scrubberElement ) {},


  // Called before the scrubbing starts.
  //
  // Return the inital value for scrubbing
  start : function ( scrubberElement ){
    return parseInt ( scrubberElement.node.textContent, 10 );
  },


  // Called if the `value` for the `scrubberElement` has changed.
  // Where `value` is the value calculated from `start` and
  // the Resolver which is used.
  change : function ( scrubberElement, value ) {
    scrubberElement.node.textContent = value;
  },

  //  Called when the Scrubbing ends.
  end : function ( scrubberElement ) { }
};

// Resolver are used to calculate the coordinates and scrubber value

// The BasicResolver is used to construct the `HorizontalResolver` and the `VerticalResolver`
// Which are bundled with Scrubber.js
var BasicResolver = function ( name, prop, divider ){
  this.name    = name;
  this.prop    = prop;
  this.divider = divider || 1;
};

BasicResolver.prototype = {

   //  Used to determin the `startCoordinate` and `currentCoordinate`
   //
   //   e : MouseEvent/TouchEvent/Event
   //
   //  return Coordinate
  coordinate : function ( e ) {
    return e[this.prop];
  },


   //  Calculate the diffrence between the `startCoordinate` and the `currentCoordinate`
   //
   //  return Value used to calculate the new numeric value
  value : function ( startCoordinate, currentCoordinate ){
    return Math.floor ( ( currentCoordinate - startCoordinate ) / this.divider );
  }
};

// This function creates provider for different BasicResolver
// It is used to create the bundled `HorizontalResolver` and `VerticalResolver`
//
// Return function which takes a `divider` to determin the "friction" of the Scrubber
var CreateBasicResolverProvider = function ( name, prop ) {
  return function ( divider ) {
    return new BasicResolver ( name, prop, divider );
  };
};


// Create Horizontal/Vertical Resolver
var HorizontalResolverProvider = CreateBasicResolverProvider ( 'Horizontal', 'clientX' ),
    VerticalResolverProvider   = CreateBasicResolverProvider ( 'Vertical'  , 'clientY' );


// A driver defines the input method used to scrub values.
// The default mouse driver uses a combination of `mousedown`, `mouseup` and `mousemove`
// events to calucalte a new Value. This is done by using an `Adapter` to retrive values from the
// DOM and reflect new values back in the DOM. A `resolver` is used to calculate the changed values.

var MouseDriver = (function (){

  var globalMouseMoveListener, // Holds the current MouseMoveListener
      currentElement,          // Holds the current Element

      scrubberElements = [],   // Holds all scrubable Elements


      globalMouseUpListener = function (  ) {
        this.removeEventListener('mousemove', globalMouseMoveListener, false);

        if ( !!currentElement )
            currentElement.options.adapter.end ( currentElement );

      },

      globalMouseDownListener = function ( e ) {

        scrubberElements.forEach ( function ( scrubElement ) {
          if ( scrubElement.node === e.target ) {
            e.preventDefault();

            currentElement = scrubElement;

            var startValue          = currentElement.options.adapter.start ( currentElement ),
                changeCall          = function ( value ) { return currentElement.options.adapter.change ( currentElement, value ); },

                coordinateResolver  = function ( e ) { return currentElement.options.resolver.coordinate( e ); },
                valueResolver       = function ( start, current ) { return currentElement.options.resolver.value( start, current ); },

                startCoordinate     = coordinateResolver( e );


            globalMouseMoveListener = function  ( e ) {
              if ( e.which === 1 ) {
                changeCall( startValue + valueResolver ( startCoordinate, coordinateResolver ( e ) ) );
              } else { 
                globalMouseUpListener ();
              }
            };

            window.addEventListener('mousemove', globalMouseMoveListener, false);
            window.addEventListener('mouseup',   globalMouseUpListener, false);

            return true;
          }
        });
      },

      init_once = function (){
        window.addEventListener('mousedown', globalMouseDownListener, false);
        init_once = function (){}; // NOOP Function that will be called subsequential
      };

  return {

      init : function ( scrubberElement ) {
        scrubberElements.push ( scrubberElement );
        init_once ();
      },

      remove : function ( scrubberElement ){
        for (var i = scrubberElements.length - 1; i >= 0; i--) {
          var elem = scrubberElement[i];
          if ( elem === scrubberElement ) {
            scrubberElements.splice(i,1);
            break;
          }
        }
      }
  };
})();

var resolveStrToObj = function ( objOrStr, searchObj ) {
  if ( ! objOrStr ) return;

  // If `objOrStr` is a String search for it in the `searchObj`
  if ( typeof objOrStr === "string") {
    return searchObj[objOrStr];
  }

  return objOrStr;
},

fillOption = function ( newOptions, userOption, defaultOptions, searchObj, optionName ) {
  if ( ! userOption ) {
    // No userOptions, use defaults
    newOptions[optionName] = defaultOptions[optionName];
  } else {
    // User Options are there.
    // Search for the `optionName` and resolve it.
    newOptions[optionName] = resolveStrToObj ( userOption[optionName], searchObj ) || defaultOptions[optionName];
  }
};

// Defining some defaults
var defaultOptions = {
  driver      : MouseDriver,
  resolver    : HorizontalResolverProvider ( ),
  adapter     : BasicNodeAdapter
};


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


  Scrubber.driver   = { Mouse     : MouseDriver };

  Scrubber.adapter  = { BasicNode : BasicNodeAdapter };

  Scrubber.resolver = {
                        DefaultHorizontal  : HorizontalResolverProvider (),
                        DefaultVertical    : HorizontalResolverProvider (),

                        HorizontalProvider : HorizontalResolverProvider,
                        VerticalProvider   : VerticalResolverProvider
                      };

  window.Scrubber = Scrubber;

})(window);
