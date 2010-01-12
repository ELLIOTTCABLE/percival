           from.package('poopy.js').wait();
var yarn = from.package('Yarn')    .wait();

return (function(){ var percival;
  percival = new(Object);
  
  percival.peer = function (target) {
    process.stdio.write(percival.percieve(target) + '\n');
  };
  
  percival.percieve = function (target, lens) { var stack;
    var stack = new(Array);
    
    return (function (target, lens) { var me, sub;
      me = arguments.callee;
      
      if ((index = stack.indexOf(target)) !== -1) {
        return new(Array)( stack.length - index + 1 ).join('.') };
      
      sub = function (sub, lens) { var result;
        stack.push(target);
        result = me.apply(percival, arguments);
        stack.pop();
        return result;
      };
      
      return (lens || percival.lensFor(target)).apply(target, [sub]);
    })(target, lens);
  };
  
  percival.lenses = new(Object);
  
  // The default lens. Applied to all basic JavaScript objects.
  // 
  // (Note: Lenses are `apply()`ed, so `this` in this function refers to the
  // object being `probe()`d, not the `percival` object.)
  percival.lenses[Object.prototype] = function (sub) { var out;
    out = yarn.beget();
    
    for (key in this) { if (this.hasOwnProperty(key)) {
      out.push(sub( key, percival.lenses['key'] ), ': ',
               sub( this[key]                   ), ', ') }};
    
    out.pop(); // To get rid of the final comma… I wish I could use `join()`…
    out.unshift('{');
    out.push('}');
    return out;
  };
  
  // TODO: Ensure this won’t fuckup for the *actual `String`* `'key'`
  percival.lenses['key'] = function (sub) { var out;
    out = yarn.beget();
    // out.style('key');
    out.push(this.valueOf()
               .replace(/\\/g, '\\\\')
               .replace(/\n/g, '\\n')
               .replace(/\"/g, '\\"') );
    if (!(/^\w+$/).exec(this.valueOf())) { out.unshift("'"); out.push("'"); };
    return out;
  };
  
  percival.lenses[Number.prototype] = function (sub) {var out;
    out = yarn.beget();
    // out.style('number');
    out.push(this.valueOf());
    return out;
  };
  
  percival.lenses[String.prototype] = function (sub) { var out;
    out = yarn.beget();
    // out.style('string');
    out.push(
      '"',
      this.valueOf()
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\"/g, '\\"'),
      '"'
    );
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
