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
