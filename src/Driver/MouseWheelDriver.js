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
