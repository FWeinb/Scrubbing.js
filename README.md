# Scrubbing.js

Highly customizable mouse scrubbing implementation for numbers and custom data.
Inspired by [Scrubbing Calculator by Bret Victors](http://worrydream.com/ScrubbingCalculator/)

## Getting Started

Basic API:

    new Scrubbing ( node, {
      resolver : /* a resolver */,
      driver   : /* a driver or array of Drivers */,
      adapter  : /* an adapter */
    });

Default usage:

    new Scrubbing ( node );

This will create a default horizontal scrubbable DOM node.

## Example

[View on Codepen](http://codepen.io/FWeinb/pen/8fd14e108c720daa1ec362c3fb948280)

## Contribute

  1. Fork this Repo
  2. Run `npm install`
  3. Add your feature
  4. `grunt build`

## Overview

The main goal while developing Scrubbing.js was to make it as customizable as possible. To achieve this it is composed of three unattached and changeable components called:

  * Driver
  * Resolver
  * Adapter


### Driver

The driver is responsable for the heavy lifting it. Scrubbing.js ships with a fully functional `MouseDriver`.
Which is the default driver. The `MouseDriver` implements the basic scrubbing.

A basic driver implementation would look like this:

    var BasicDriver = (function(window, undefined){

      return {
        init : function ( scrubbingElement ) {

        },

        remove : function ( scrubbingElement ) { }
      };

    })(window);

Basicly a driver is a object which consists of an `init` function which is called everytime a new scrubbing was created.
The `remove` function is called everytime a scrubbing element was removed using `Scrubbing.remove()`


### Resolver

A Resolver is used to caluclate the delta between the inital `mousedown` value and the current one.

    var SimpleResolver = {
      coordinate : function ( e ) {

      },
      value : function ( startCoordinate, currentCoordinate ){

      }
    };

The `coordinate` function must return a value/object which will than subsequentialy be used as parameter for the `value` function. `value` will return the computed delta between the `startCoordinate` and the `currentCoordinate`

Scrubbing.js ships with a Horizontal/Vertical resolver. (See Example below)

### Adapter

Adapters are used to bridge between the DOM and the Scrubbing Element.

    var BasicAdapter = {

      init : function ( scrubbingElement ) { },

      start : function ( scrubbingElement ) { },

      change : function ( scrubbingElement, value, delta ) { },

      end : function ( scrubbingElement ) { }
    };

The `init` function of an adapter is called everytime a new scrubbing element was created. You can perfome inital task there.

In the `start` function which is called when the scrubbing has started you must return the inital (numeric) value. From which you want to scrub.

`change` is than called everytime the `value` calculated by a `Resolver` has changed.

`end` is called when the scrubbing ends

