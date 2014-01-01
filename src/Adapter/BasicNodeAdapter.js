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
