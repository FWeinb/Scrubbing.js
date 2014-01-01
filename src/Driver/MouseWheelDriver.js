var MouseWheelDriver = (function(window, undefined){

  return {
    init : function ( scrubberElement ) {

      scrubberElement.node.addEventListener("mousewheel", function ( e ) {
        e.preventDefault();
        var startValue          = scrubberElement.options.adapter.start ( scrubberElement );
        scrubberElement.options.adapter.change ( scrubberElement, startValue - e.wheelDelta );
      }, false);

    },

    remove : function ( scrubberElement ) { }
  };

})(window);
