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
