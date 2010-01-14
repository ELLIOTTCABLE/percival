           from.package('poopy.js').wait();
var yarn = from.package('Yarn')    .wait();

return (function(){ var percival;
  percival = new(Object);
  
  percival.quilt = {
    key: {weight: 'bold'},
    string: {underline: 'single'},
    number: {foreground: 'magenta'},
    special: {foreground: 'yellow'}, 'function': {foreground: 'yellow'},
    'true': {foreground: 'green'},
    'false': {foreground: 'red'}
  };
  
  percival.peer = function (target, quilt) {
    process.stdio.write(percival.percieve(target)
                          .toString(quilt || percival.quilt) + '\n') };
  
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
      
      return (lens || lensFor(target, percival.lenses)).apply(target, [sub]);
    })(target, lens);
  };
  
  var hardEscape = function (string) {
    return string.valueOf()
               .replace(/\\/g, '\\\\')
               .replace(/\n/g, '\\n')
               .replace(/\"/g, "\\'")
               .replace(/[\u0001-\u001F]/g, function (match) { // Unprintables
                  return '\\0' + match[0].charCodeAt(0).toString(8) });
  };
  
  // ==================
  // = Bundled lenses =
  // ==================
  
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
  
  // Keys in object literals
  //--
  // TODO: Ensure this won’t fuckup for the *actual `String`* `'key'`
  // TODO: Use hex `\u` escapes instead of octal
  percival.lenses['key'] = function (sub) { var out;
    out = yarn.beget();
    out.label('key');
    out.push(hardEscape(this));
    if (!(/^\w+$/).exec(this)) { out.unshift("'"); out.push("'"); };
    return out;
  };
  
  // typeof → 'undefined'
  percival.lenses['undefined'] = function (sub) {var out;
    out = yarn.beget();
    out.label('special', 'nothingness', 'undefined');
    out.push('undefined');
    return out;
  };
  
  // === null
  percival.lenses[null] = function (sub) {var out;
    out = yarn.beget();
    out.label('special', 'nothingness', 'null');
    out.push('null');
    return out;
  };
  
  // === Number.NaN
  percival.lenses[Number.NaN] = function (sub) {var out;
    out = yarn.beget();
    out.label('special', 'nothingness', 'nan');
    out.push('NaN');
    return out;
  };
  
  // typeof → 'boolean'
  percival.lenses['boolean'] = function (sub) {var out;
    out = yarn.beget();
    out.label('native', 'boolean', 'boolean-native',
                this.toString());
    out.push(this.valueOf());
    return out;
  };
  
  // Boolean.prototype.isPrototypeOf
  percival.lenses[Boolean.prototype] = function (sub) {var out, classYarn;
    classYarn = yarn.beget({ elements : ['Boolean'],
                               labels : ['class', 'constructor'] });
    
    out = yarn.beget();
    out.label('native-wrapper', 'boolean', 'boolean-wrapper',
                this.toString());
    out.push(this.valueOf());
    out.unshift('new(', classYarn, ')('); out.push(')');
    return out;
  };
  
  // typeof → 'string'
  percival.lenses['string'] = function (sub) { var out;
    out = yarn.beget();
    out.label('native', 'string', 'string-native');
    out.push(hardEscape(this));
    out.unshift('"'); out.push('"');
    return out;
  };
  
  // String.prototype.isPrototypeOf
  percival.lenses[String.prototype] = function (sub) { var out, classYarn;
    classYarn = yarn.beget({ elements : ['String'],
                               labels : ['class', 'constructor'] });
    
    out = yarn.beget();
    out.label('native-wrapper', 'string', 'string-wrapper');
    out.push(hardEscape(this));
    out.unshift('new(', classYarn, ')("'); out.push('")');
    return out;
  };
  
  // typeof → 'number'
  percival.lenses['number'] = function (sub) {var out;
    out = yarn.beget();
    out.label('native', 'number', 'number-native');
    out.push(this.valueOf());
    return out;
  };
  
  // Number.prototype.isPrototypeOf
  percival.lenses[Number.prototype] = function (sub) {var out, classYarn;
    classYarn = yarn.beget({ elements : ['Number'],
                               labels : ['class', 'constructor'] });
    
    out = yarn.beget();
    out.label('native-wrapper', 'number', 'number-wrapper');
    out.push(this.valueOf());
    out.unshift('new(', classYarn, ')('); out.push(')');
    return out;
  };
  
  // typeof → 'function'
  percival.lenses['function'] = function (sub) {var out;
    out = yarn.beget();
    out.label('class', 'constructor', 'function');
    out.push('Function');
    return out;
  };
  
  // Climbs the prototypal inheritance chain, and returns the first lens
  // associated with one of the objects. Will return the `lens` property, if
  // it’s defined, or the relevant element from `percival.lenses`, if not.
  var lensFor = function (thing, lenses) { var me;
    me = arguments.callee;
    
         if (       thing === null)       { return lenses[null] }
    else if (       typeof thing === 'number' &&
                    isNaN(thing)) { return lenses[Number.NaN] }
    else if (typeof thing !== 'object')   { return lenses[typeof thing] }
    else if (typeof thing.lens    !== 'undefined') { return thing.lens }
    else if (typeof lenses[thing] !== 'undefined') { return lenses[thing] }
    else { return me.apply(null, [ thing['__proto__'], lenses ]) };
  };
  
  return percival;
})();
