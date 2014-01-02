var resolveStrToObj = function ( objOrStr, searchObj ) {
  if ( ! objOrStr ) return;

  // If `objOrStr` is a String search for it in the `searchObj`
  if ( typeof objOrStr === "string") {
    return searchObj[objOrStr];
  }

  return objOrStr;
},

fillOption = function ( newOptions, userOption, defaultOptions, searchObj, optionName ) {
  if ( ! userOption ) {
    // No userOptions, use defaults
    newOptions[optionName] = defaultOptions[optionName];
  } else {
    // User Options are there.
    // Search for the `optionName` and resolve it.
    newOptions[optionName] = resolveStrToObj ( userOption[optionName], searchObj ) || defaultOptions[optionName];
  }
},

callObjOrArray = function ( objOrArr, methodName, p1, p2, p3 ){
  if ( Array.isArray ( objOrArr ) ) {
    objOrArr.forEach(function ( obj ){
      obj[methodName] ( p1, p2, p3 );
    });
  } else { 
    objOrArr[methodName] ( p1, p2, p3 );
  }

};
