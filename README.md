# Scrubber.js

Highly customizable mouse scrubber implementation for numbers and custom data.

## Getting Started

Basic API:

    new Scrubber ( node, {
      resolver : /* a resolver */,
      driver   : /* a driver or array of Drivers */,
      adapter  : /* an adapter or array of adapter */
    });

Default usage:

    new Scrubber ( node );

This will create a default horizontal scrubbable DOM node.

## Example

[View on Codepen](http://codepen.io/FWeinb/pen/8fd14e108c720daa1ec362c3fb948280)


## Overview

The main goal while developing Scrubber.js was to make it as customizable as possible. To achieve this it is composed of three unattached and changeable components called:

  * Driver
  * Resolver
  * Adapter


### Driver

The driver is responsable for the heavy lifting it. Scrubber.js ships with a fully functional `MouseDriver`.
Which is the default driver. The `MouseDriver` implements the basic scrubbing.

A basic driver implementation would look like this:

    var BasicDriver = (function(window, undefined){

      return {
        init : function ( scrubberElement ) {

        },

        remove : function ( scrubberElement ) { }
      };

    })(window);

Basicly a driver is a object which consists of an `init` function which is called everytime a new Scrubber was created.
The `remove` function is called everytime a scrubber was removed using `scrubber.remove()`


### Resolver

A Resolver is used to caluclate the delta between the inital `mousedown` value and the current one.

    var SimpleResolver = {
      coordinate : function ( e ) {

      },
      value : function ( startCoordinate, currentCoordinate ){

      }
    };

The `coordinate` function must return a value/object which will than subsequentialy be used as parameter for the `value` function. `value` will return the computed delta between the `startCoordinate` and the `currentCoordinate`

Scrubber.js ships with a Horizontal/Vertical resolver. (See Example below)

### Adapter

Adapters are used to bridge between the DOM and the Scrubber.

    var BasicAdapter = {

      init : function ( scrubberElement ) { },

      start : function ( scrubberElement ) { },

      change : function ( scrubberElement, value, delta ) { },

      end : function ( scrubberElement ) { }
    };

The `init` function of an adapter is called everytime a new scrubber element was created. You can perfome inital task there.

In the `start` function which is called when the scrubbing has started you must return the inital (numeric) value. From which you want to scrub.

`change` is than called everytime the `value` calculated by a `Resolver` has changed.

`end` is called when the scrubbing ends

