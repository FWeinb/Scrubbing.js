(function (window, undefined){

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
},

callObjOrArray = function ( objOrArr, methodName, p1, p2, p3 ){
  if ( Array.isArray ( objOrArr ) ) {
    objOrArr.forEach(function ( obj ){
      obj[methodName] ( p1, p2, p3 );
    });
  } else { 
    objOrArr[methodName] ( p1, p2, p3 );
  }

};

// Adapter are used to bridge between the scrubbing Element and the DOM


// The BasicNode Adapter comes bundled and allows the scrubbing to work
// on DOM elements, reading the starting value from DOM and writing it back on change.
var BasicNodeAdapter = {


  // Called everytime a new `scrubbingElement` was created.
  init : function ( scrubbingElement ) {},


  // Called before the scrubbing starts.
  //
  // Return the inital value for scrubbing
  start : function ( scrubbingElement ){
    return parseInt ( scrubbingElement.node.textContent, 10 );
  },


  // Called if the `value` for the `scrubbingElement` has changed.
  // Where `value` is the value calculated from `start` and
  // the Resolver which is used.
  change : function ( scrubbingElement, value ) {
    scrubbingElement.node.textContent = value;
  },

  //  Called when the scrubbing ends.
  end : function ( scrubbingElement ) { }
};

// Resolver are used to calculate the coordinates and scrubbing value

// The BasicResolver is used to construct the `HorizontalResolver` and the `VerticalResolver`
// Which are bundled with Scrubbing.js
var BasicResolver = function ( name, prop, factor, divider ){
  this.name    = name;
  this.prop    = prop;
  this.factor  = factor  || 1;
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
    return this.factor * Math.floor ( ( currentCoordinate - startCoordinate ) / this.divider );
  }
};

// This function creates provider for different BasicResolver
// It is used to create the bundled `HorizontalResolver` and `VerticalResolver`
//
// Return function which takes a `divider` to determin the "friction" of the Scrubbing
var CreateBasicResolverProvider = function ( name, prop, factor ) {
  return function ( divider ) {
    return new BasicResolver ( name, prop, factor, divider );
  };
};


// Create Horizontal/Vertical Resolver
var HorizontalResolverProvider = CreateBasicResolverProvider ( 'Horizontal', 'clientX' ),
    VerticalResolverProvider   = CreateBasicResolverProvider ( 'Vertical'  , 'clientY', -1 );


// A driver defines the input method used to scrub values.
// The default mouse driver uses a combination of `mousedown`, `mouseup` and `mousemove`
// events to calucalte a new Value. This is done by using an `Adapter` to retrive values from the
// DOM and reflect new values back in the DOM. A `resolver` is used to calculate the changed values.

var MouseDriver = (function (){

  var globalMouseMoveListener, // Holds the current MouseMoveListener
      currentElement,          // Holds the current Element

      globalMouseUpListener = function (  ) {
        this.removeEventListener('mousemove', globalMouseMoveListener, false);

        if ( !!currentElement )
            currentElement.options.adapter.end ( currentElement );

      },

      globalMouseDownListener = function ( e ) {
        if ( !! e.target.scrubbingElement ) {
            e.preventDefault();

            currentElement = e.target.scrubbingElement;

            var startValue          = currentElement.options.adapter.start ( currentElement ),
                coordinateResolver  = function ( e ) { return currentElement.options.resolver.coordinate( e ); },
                startCoordinate     = coordinateResolver( e );


            globalMouseMoveListener = function  ( e ) {
              if ( e.which === 1 ) {
                var delta = currentElement.options.resolver.value ( startCoordinate, coordinateResolver ( e ) );
                            currentElement.options.adapter.change ( currentElement, startValue +  delta, delta );
              } else { 
                globalMouseUpListener ();
              }
            };

            window.addEventListener('mousemove', globalMouseMoveListener, false);
            window.addEventListener('mouseup',   globalMouseUpListener, false);

            return true;
          }
      },

      init_once = function (){
        window.addEventListener('mousedown', globalMouseDownListener, false);
        init_once = function (){}; // NOOP Function that will be called subsequential
      };

  return {

      init : function ( scrubbingElement ) {
        init_once ();
      },

      remove : function ( scrubbingElement ) { }
  };
})();

var TouchDriver = (function(window, undefined){
  var currentElement,
      globalTouchMoveListener,
      globalTouchEndListener = function ( e ) {
        window.removeEventListener ( 'touchmove', globalTouchMoveListener, false );
        if (!! currentElement ) {
          currentElement.options.adapter.end ( currentElement );
        }
      },
      touchstartListener = function ( e ){
        if ( e.targetTouches.length !== 1) return;
        var touchEvent = e.targetTouches[0];

        if ( !! touchEvent.target.scrubbingElement ) {
          e.preventDefault();

          currentElement = touchEvent.target.scrubbingElement;

          var startValue          = currentElement.options.adapter.start ( currentElement ),
              coordinateResolver  = function ( e ) { return currentElement.options.resolver.coordinate( e ); },
              startCoordinate     = coordinateResolver( touchEvent );

          globalTouchMoveListener = function ( e ) { 
            if ( e.targetTouches.length !== 1) return;
            e.preventDefault();
            var delta = currentElement.options.resolver.value ( startCoordinate, coordinateResolver ( e.targetTouches[0] ) );
            currentElement.options.adapter.change ( currentElement, startValue +  delta, delta );
          };

          window.addEventListener ( 'touchmove', globalTouchMoveListener, false );
        }
      },

      init_once = function ( ) {
        window.addEventListener ( 'touchcancel', globalTouchEndListener, false );
        window.addEventListener ( 'touchend', globalTouchEndListener, false );
        init_once = function ( ) { };
      };


  return {
    init : function ( scrubbingElement ) {
      init_once ();
      scrubbingElement.node.addEventListener ( 'touchstart', touchstartListener, false );
    },

    remove : function ( scrubbingElement ) { } 
  };
})(window, undefined);

var MouseWheelDriver = (function(window, undefined){

  return {
    init : function ( scrubbingElement ) {

      scrubbingElement.node.addEventListener("mousewheel", function ( e ) {
        e.preventDefault();
        var startValue          = scrubbingElement.options.adapter.start ( scrubbingElement );
        scrubbingElement.options.adapter.change ( scrubbingElement, startValue - e.wheelDelta, e.wheelDelta );
      }, false);

    },

    remove : function ( scrubbingElement ) { }
  };

})(window);

// Defining some defaults
var defaultOptions = {
  driver      : [ TouchDriver, MouseDriver ],
  resolver    : HorizontalResolverProvider ( ),
  adapter     : BasicNodeAdapter
};


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

  // Add Scrubbing element to node
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


  Scrubbing.driver   = {
                        Mouse     : MouseDriver,
                        MouseWheel: MouseWheelDriver,

                        Touch     : TouchDriver
                       };

  Scrubbing.adapter  = { BasicNode : BasicNodeAdapter };

  Scrubbing.resolver = {
                        DefaultHorizontal  : HorizontalResolverProvider (),
                        DefaultVertical    : VerticalResolverProvider   (),

                        HorizontalProvider : HorizontalResolverProvider,
                        VerticalProvider   : VerticalResolverProvider
                      };

  window.Scrubbing = Scrubbing;

})(window);
