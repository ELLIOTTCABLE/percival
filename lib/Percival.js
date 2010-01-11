           from.package('poopy.js').wait();
var yarn = from.package('Yarn')    .wait();

return (function(){ var percival;
  percival = new(Object);
  
  percival.peer = function (target) {
    process.stdio.write(percival.percieve(target) + '\n');
  };
  
  percival.percieve = function (target) { var stack;
    var stack = new(Array);
    
    return (function (target) { var me, sub;
      me = arguments.callee;
      
      if ((index = stack.indexOf(target)) !== -1) {
        return new(Array)( stack.length - index + 1 ).join('.') };
      
      sub = function (sub) { var result;
        stack.push(target);
        result = me.apply(percival, [sub]);
        stack.pop();
        return result;
      };
      
      return percival.lensFor(target).apply(target, [sub]);
    })(target);
  };
  
  percival.lenses = new(Object);
  
  // The default lens. Applied to all basic JavaScript objects.
  // 
  // (Note: Lenses are `apply()`ed, so `this` in this function refers to the
  // object being `probe()`d, not the `percival` object.)
  //--
  // TODO: Indentation and newline handling!
  // TODO: Does this function need to have indentation passed to it?
  percival.lenses[Object.prototype] = function (sub) { var out;
    out = yarn.beget();
    
    for (key in this) { if (this.hasOwnProperty(key)) {
      out.push(sub( key ), ': ', sub( this[key] ), ', ') }};
    
    out.pop(); // To get rid of the final comma… I wish I could use `join()`…
    out.unshift('{');
    out.push('}');
    return out;
  };
  
  // Climbs the prototypal inheritance chain, and returns the first lens
  // associated with one of the objects. Will return the `lens` property, if
  // it’s defined, or the relevant element from `percival.lenses`, if not.
  percival.lensFor = function (object) {
         if (typeof object.lens !== 'undefined') { return object.lens }
    else if (typeof percival.lenses[object] !== 'undefined') {
             return percival.lenses[object] }
      else { return arguments.callee.apply(this, [object['__proto__']]) }
  };
  
  return percival;
})();
