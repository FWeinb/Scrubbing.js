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
