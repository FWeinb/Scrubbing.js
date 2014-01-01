
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
        });
      },

      init_once = function (){
        window.addEventListener('mousedown', globalMouseDownListener, false);
        init_once = function (){}; // NOOP Function that will be called subsequential
      };

  return {

      init : function ( scrubbingElement ) {
        scrubbingElement.push ( scrubbingElement );
        init_once ();
      },

      remove : function ( scrubbingElement ){
        for (var i = scrubbingElement.length - 1; i >= 0; i--) {
          var elem = scrubbingElement[i];
          if ( elem === scrubbingElement ) {
            scrubbingElement.splice(i,1);
            break;
          }
        }
      }
  };
})();
