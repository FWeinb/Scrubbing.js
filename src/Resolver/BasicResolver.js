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
