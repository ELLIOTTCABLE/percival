           from.package('poopy.js').wait();
var yarn = from.package('Yarn')    .wait();

return (function(){ var percival;
  percival = new(Object);
  
  percival.peer = function (target) {
    process.stdio.write(percival.percieve(target) + '\n') };
  
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
    out.push   ('}');
    return out;
  };
  
  var hardEscape = function (string) {
    return string.valueOf()
               .replace(/\\/g, '\\\\')
               .replace(/\n/g, '\\n')
               .replace(/\"/g, "\\'")
               .replace(/[\u0001-\u001F]/g, function (match) { // Unprintables
                  return '\\0' + match[0].charCodeAt(0).toString(8) });
  };
  
  // TODO: Ensure this won’t fuckup for the *actual `String`* `'key'`
  // TODO: Use hex `\u` escapes instead of octal
  percival.lenses['key'] = function (sub) { var out;
    out = yarn.beget();
    out.label('key');
    out.push(hardEscape(this));
    if (!(/^\w+$/).exec(this)) { out.unshift("'"); out.push("'"); };
    return out;
  };
  
  percival.lenses[String.prototype] = function (sub) { var out;
    out = yarn.beget();
    out.label('string');
    out.push(hardEscape(this));
    out.unshift('"'); out.push('"');
    return out;
  };
  
  percival.lenses[Number.prototype] = function (sub) {var out;
    out = yarn.beget();
    out.label('number');
    out.push(this.valueOf());
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
