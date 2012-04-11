


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



!function(w/* window */, P/* String "prototype" */) {
	var A = Array[P], D = Date[P], F = Function[P], N = Number[P], O = Object[P], S = String[P]
	  , p2 = function(n){return n>9?n:"0"+n}
	  , p3 = function(n){return (n>99?n:(n>9?"0":"00")+n)}
	  , I = function(o, n, s, x) {if (!(n in o)) o[n] = new Function("x","y","return function(a,b,c,d){"+s+"}").apply(null, x||[o, n])}
	  , xhrs = []
	  , Nop = function(){};
	  , a, b, c; // Reusable

	/*@cc_on
		// XMLHttpRequest was unsupported in IE 5.x-6.x
		I(w, "XMLHttpRequest", "a=function(n){n='Msxml2.XMLHTTP'+n;try{x[y]=function(){return new ActiveXObject(n)};return new x[y]}catch(e){}};return a('.6.0')||a('')");
	@*/

	//** xhr

	w.xhr = function(method, url, cb, sync){
		var r = xhrs.shift() || new XMLHttpRequest();
		r.open(method, url, !sync);
		r.onreadystatechange = function(){
			if (r.readyState == 4) {
				cb && cb( r.responseText, r);
				r.onreadystatechange = cb = Nop;
				xhrs.push(r);
			}
		}
		return r;
	};
	//*/
	/** hasOwnProperty
	* Safari 2.0.2: 416     hasOwnProperty introduced October 31, 2005 (Mac OS X v10.4)
	I(O, "hasOwnProperty", "try{b=this.constructor;while(b=b[x])if(b[a]===this[a])return false}catch(e){}return true", [P]);
	//*/


	// We need bind in beginning, other ECMAScript 5 stuff will come later
	
	I(F, "bind"   , "var t=this;b=x.call(arguments,1);c=function(){return t.apply(this instanceof c?this:a,b.concat.apply(b,arguments))};if(t[y])c[y]=t[y];return c", [A.slice, P]);

	var sl = F.call.bind(A.slice);
	
	F.partial = function() {
		var t = this, a = sl(arguments);
		return function() {return t.apply(this, a.concat(sl(arguments)))};
	}

	F.construct = function(a) {
		return new(F.bind.apply(this, A.concat.apply([null], a)));
	}  

	F.clone = function() {
		var a = this.toString().match(/\((.*)\)\s*{([\s\S]*)}$/);
		return new Function(a[1].split(/[, ]+/), a[2]);
	}

	// Run function once and return cached value or cached instance
	F.cache = function(instance, keyFn, cache) {
		var t = this, c = cache || {}, f = function() {
			var a = arguments
			  , i = !!instance || this instanceof f
			  , k = keyFn ? keyFn(a, t) : i + ":" + a.length + ":" + A.join.call(a);

			return k in c ? c[k] : (c[k] = i ? t.construct(a) : t.apply(this, a));
		}
		f.origin = t;
		f.cached = c;
		f.extend = function(){
			return t.extend.apply(t, arguments).cache(instance, keyFn, c);
		}
		f[P] = t[P]; // prototype for better access on extending 
		return f;
	}

	F.extend = function() {
		var t = this, f = t.clone(), i = 0;
		f[P] = Object.create(t[P]);
		while (t = arguments[i++]) Object.merge(f[P], t);
		return f;
	}
	

	/* ECMAScript 5 stuff */

	S.trim = S.trim || S.replace.partial(/^[\s\r\n\u2028\u2029]+|[\s\r\n\u2028\u2029]+$/g, "");
	//"trim" in S || (S.trim = S.replace.partial(/^[\s\r\n\u2028\u2029]+|[\s\r\n\u2028\u2029]+$/g, ""));
	//I(S, "trim"   , "return this.replace(x,'')", [/^[\s\r\n\u2028\u2029]+|[\s\r\n\u2028\u2029]+$/g]);



	/* THANKS: Oliver Steele - String lambdas [http://osteele.com/javascripts/functional]
	 *
	 * Copyright: Copyright 2007 by Oliver Steele.  All rights reserved.
	 * License: MIT License
	 * Homepage: http://osteele.com/javascripts/functional
	 * Created: 2007-07-11
	 * Version: 1.0.2
	 *
	 * Modified by Lauri Rooden */

	var lambda = function(s) {
		var a = []
			, t = s.split("->");
		
		if (t.length > 1) while (t.length) {
			s = t.pop();
			a = t.pop().trim().split(/[\s,]+/);
			t.length && t.push("(function("+a+"){return ("+s+")})");
		} else {
			// test whether an operator appears on the left (or right), respectively
			if (t = s.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/)) {
				a.push("$1");
				s = "$1" + s;
			}
			// test whether an operator appears on the right
			if (s.match(/[+\-*\/%&|\^\.=<>!]\s*$/)) {
				a.push("$2");
				s += "$2";
			} else if (!t) {
				// `replace` removes symbols that follow '.',
				// precede ':', are 'this' or 'arguments'; and also the insides of
				// strings (by a crude test).  `match` extracts the remaining
				// symbols.
				a = a.concat( s.replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|this|arguments|\.\w+|\w+:/g, "").match(/\b[a-z_]\w*/g) ).unique();
			}
		}
		return new Function(a, "return(" + s + ")");
	}.cache();

	S.fn = function(){
		return lambda(this);
	}

	F.fn = function() {
		return this;
	}

	/*

	b = [];

	a = function(o,s){
		for(var i=0,n,a=s.split(" ");n=a[i++];)n in o||b.push(n);
	}

	a(Array, "isArray");
	a(Object, "create keys");
	a(A, "indexOf lastIndexOf reduce reduceRight forEach every map filter some")
	a(D, "toISOString");
	b.length && console.log("missing: "+b.join())

	//*/


	// Array extensions
	// ----------------
	a = Array;

	// ### Array.isArray ###
	//
	// Native in FF

	I(a, "isArray", "return x.call(a)=='[object Array]'", [O.toString]);
	//a.isArray = "x->a->x.call(a)=='[object Array]'".fn()(O.toString)
	// Non-standard
	I(a, "from"   , "for(b=[],c=a.length;c--;b.unshift(a[c]));return b");
	/*
	Array.flatten = function(arr){
		for(var i=arr.length;i--;)
			0 in arr[i] && A.splice.apply(arr, [i, 1].concat(Array.flatten(arr[i])));
		return arr
	};
	flat([1,2,[3,4,[5,6]],7]);
	*/
	
	a = "var t=this,l=t.length,o=[],i=-1;";
	c = "if(t[i]===a)return i;return -1";

	I(A, "indexOf",     a+"i+=b|0;while(++i<l)"+c);
	I(A, "lastIndexOf", a+"i=(b|0)||l;i>--l&&(i=l)||i<0&&(i+=l);++i;while(--i>-1)"+c);

	b = a+"if(arguments.length<2)b=t";
	c = "b=a.call(null,b,t[i],i,t);return b";
	I(A, "reduce",      b+"[++i];while(++i<l)"+c);
	I(A, "reduceRight", b+"[--l];i=l;while(i--)"+c);

	b = a+"while(++i<l)if(i in t)";
	I(A, "forEach",     b+"a.call(b,t[i],i,t)");
	I(A, "every",       b+"if(!a.call(b,t[i],i,t))return!1;return!0");

	c = ";return o";
	I(A, "map",         b+"o[i]=a.call(b,t[i],i,t)"+c);

	b += "if(a.call(b,t[i],i,t))";
	I(A, "filter",      b+"o.push(t[i])"+c);
	I(A, "some",        b+"return!0;return!1");

	// Non-standard
	I(A, "remove",   a+"o=x(arguments);while(l--)if(o.indexOf(t[l])>-1)t.splice(l,1);return t", [sl]);
	I(A, "indexFor", a+"i=b?0:l;while(i<l)b.call(c,a,t[o=(i+l)>>1])<0?l=o:i=o+1;return i");
	
	A.unique = A.filter.partial(function(s,i,a){return i == a.lastIndexOf(s)});


	// Object extensions
	// -----------------

	a = Object;

	// ### Object.create ###
	// ES5
	I(a, "create" , "x[y]=a;return new x", [function(){}, P]);
	// ### Object.keys ###
	// ES5
	I(a, "keys"   , "c=[];for(b in a)a.hasOwnProperty(b)&&c.push(b);return c");
	// Non-standard
	I(a, "each"   , "for(d in a)a.hasOwnProperty(d)&&b.call(c,a[d],d,a)");
	a.merge = function(main){
		var o, i = 1, k;
		while (o = arguments[i++]) for (k in o) if (o.hasOwnProperty(k)) main[k] = o[k];
		return main;
	}

	

	// Function extensions
	// -------------------
	
	//** Function extensions

	
	F.guard = function(test, or) {
		var t = this
		  , f = test.fn()
		  , o = (or||Nop).fn();

		return function() {
			return (f.apply(this, arguments) ? t : o).apply(this, arguments);
		}
	}

	F.byWords = function(i) {
		var t = this;
		i |= 0;
		return function() {
			var s = this, r = s, a = arguments;
			;(a[i]||"").replace(/\w+/g, function(w){a[i]=w;r=t.apply(s, a)});
			return r;
		}
	}

	F.byKeyVal = function() {
		var t = this;
		return function(o) {
			var s = this, a = arguments, r;
			if (typeof o == "object") Object.each(o, function(v, k){
				a[0] = k;
				a[1] = v;
				r = t.apply(s, a);
			})
			else r = t.apply(s, a);
			return r;
		}
	}


	!function(n){
		F[n] = S[n] = function(){
			var t = this, a = arguments, arr = a[0]
			a[0] = t.fn();
			return A[n].apply(arr, a);
		}
	}.byWords()("every filter forEach map reduce reduceRight some");
	
	F.each = S.each = F.forEach;
	F.fold = S.fold = F.reduce;
	F.foldr = S.foldr = F.reduceRight;
	F.select = S.select = F.filter;

	/*
	var fr = function(r,f){
		return f(r)
	}

	http://hangar.runway7.net/javascript/namespacing

	S.ns = function(s){
		return "h n -> h[n] = h[n] || {}".fold(this.split("."), s || w)
	}
	*/
	/*
	// http://seanhess.github.com/2012/02/20/functional_javascript.html
	// http://msdn.microsoft.com/en-us/scriptjunkie/gg575560

function lt(a, b) {
    return (a < b)
}
function eq(a, b) {
    return (a == b)
}
function apply(f) {
    var args = Array.prototype.slice.call(arguments, 1)
    return function(x) {
        return f.apply(null, args.concat(x))
    }
}

function applyr(f) {
    var args = Array.prototype.slice.call(arguments, 1)
    return function(x) {
        return f.apply(null, [x].concat(args))
    }
}


	var a = F.call.bind(O.toString)
	a(1).slice(8, -1).toLowerCase() // number
*/


	F.chain = function(a) {
		return (Array.isArray(a) ? a : sl(arguments)).reduce(function(pre, cur){
			return function(){
				return cur.call(this, pre.apply(this,arguments));
			}
    }, this);
  }

	F.compose = function() {
		var a = [this].concat(sl(arguments)), t = a.pop()
		return t.chain(a);
	}

	F.flip = function() {
		var t = this;
		return function() {
			var a = arguments, b = a[0];
			a[0] = a[1]
			a[1] = b
			return t.apply(this, a);
		}
	}

	// Time to live - Run *fun* if Function not called on time
	F.ttl = function(ms, fun) {
		var t = this, s = setTimeout(function(){ms=0;fun&&fun()}, ms);
		return function() {
			clearTimeout(s);
			ms && t.apply(null, arguments);
		}
	}

	// Run Function once after last call
	F.once = function(ms) {
		var t = this, s, args;
		return function() {
			clearTimeout(s);
			args = arguments;
			s = setTimeout(function(){t.apply(null, args)}, ms);
		}
	}

	// Maximum call rate for Function
	F.rate = function(ms) {
		var t = this, n = 0;
		return function() {
			var d = +new Date();
			if (d > n) {
				n = d + ms;
				t.apply(null, arguments);
			}
		}
	}
	//*/

	/**
	 * Returns a function identical to this function except that
	 * it prints its arguments on entry and its return value on exit.
	 * This is useful for debugging function-level programs.
	 */
	
	/** debug.trace
	F.trace = function(n) {
		var t = this;
		n = n || t;
		return "console" in w ?
			function() {
				console.info('[', n, 'apply(', this!=w && this, ',', arguments, ')');
				var result = t.apply(this, arguments);
				console.info(']', n, ' -> ', result);
				return result;
			} :
			t;
	}
	//*/


	// String extensions
	// -----------------
	
	// String.format

	S.format = function(m) {
		var a = typeof m == "object" ? m : arguments;
		return this.replace(/\{(\w+)\}/g, function(_, i){return a[i]});
	}

	//*/

  S.safe = function() {
  	return this
  		.replace(/&/g, "&amp;")
  		.replace(/</g, "&lt;")
  		.replace(/>/g, "&gt;")
  		.replace(/\"/g, "&quot;");
	}

	//S.camelCase = function() { return this.replace(/[ _-]+([a-z])/g,function(_, a){return a.toUpperCase()}); }
	S.camelCase = S.replace.partial(/[ _-]+([a-z])/g, function(_, a){return a.toUpperCase()});

  S.toAccuracy = N.toAccuracy = function(a) {
    var x = (""+a).split("."), n = ~~((this/a)+.5) * a;
    return ""+(1 in x ? n.toFixed(x[1].length) : n);
  }
	//*/


	//** String.utf8
  S.utf8_encode = function() {
    return unescape( encodeURIComponent( this ) );
  }

  S.utf8_decode = function() {
    return decodeURIComponent( escape( this ) );
  }
	//*/


  //** IP helpers
  S.ip2int = function() {
  	var t = (this+".0.0.0").split(".");
  	return ((t[0] << 24) | (t[1] << 16) | (t[2] << 8 ) | (t[3]))>>>0;
  }

  S.int2ip = N.int2ip = function() {
  	var t = this;
  	return [t>>>24, (t>>>16)&0xFF, (t>>>8)&0xFF, t&0xFF].join(".");
  }
	//*/



	// Date extensions
	// ---------------

	//** Date.format
	// ISO 8601 specifies numeric representations of date and time.
	// The international standard date notation is
	//
	// YYYY-MM-DD
	// The international standard notation for the time of day is
	//
	// TODO:2012-03-05:lauriro:Date week number not complete
	// http://en.wikipedia.org/wiki/ISO_week_date
	//
	// hh:mm:ss
	//
	// Time zone
	//
	// The strings
	//
	// +hh:mm, +hhmm, or +hh
	//
	// can be added to the time to indicate that the used local time zone is hh hours and mm minutes ahead of UTC. For time zones west of the zero meridian, which are behind UTC, the notation
	//
	// -hh:mm, -hhmm, or -hh
	//
	// is used instead. For example, Central European Time (CET) is +0100 and U.S./Canadian Eastern Standard Time (EST) is -0500. The following strings all indicate the same point of time:
	//
	// 12:00Z = 13:00+01:00 = 0700-0500

	D.format = function(_) {
		var t = this
		  , x = D.format.masks[_] || _ || D.format.masks["default"]
		  , g = "get" + (x.slice(0,4) == "UTC:" ? (x=x.slice(4), "UTC"):"")
		  , Y = g + "FullYear"
		  , M = g + "Month"
		  , d = g + "Date"
		  , w = g + "Day"
		  , h = g + "Hours"
		  , m = g + "Minutes"
		  , s = g + "Seconds"
		  , S = g + "Milliseconds";

		return x.replace(/(")([^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|(YY(?:YY)?|M{1,4}|D{1,4}|([HhmsS])\4?|[uUaAZw])/g,
			function(a, b, c) {
				return a == "YY"   ? (""+t[Y]()).slice(2)
				     : a == "YYYY" ? t[Y]()
				     : a == "M"    ? t[M]()+1
				     : a == "MM"   ? p2(t[M]()+1)
				     : a == "MMM"  ? D.monthNames[ t[M]() ]
				     : a == "MMMM" ? D.monthNames[ t[M]()+12 ]
				     : a == "D"    ? t[d]()
				     : a == "DD"   ? p2(t[d]())
				     : a == "DDD"  ? D.dayNames[ t[w]() ]
				     : a == "DDDD" ? D.dayNames[ t[w]()+7 ]
				     : a == "H"    ? (""+t[h]()%12||12)
				     : a == "HH"   ? p2(t[h]()%12||12)
				     : a == "h"    ? t[h]()
				     : a == "hh"   ? p2(t[h]())
				     : a == "m"    ? t[m]()
				     : a == "mm"   ? p2(t[m]())
				     : a == "s"    ? t[s]()
				     : a == "ss"   ? p2(t[s]())
				     : a == "S"    ? t[S]()
				     : a == "SS"   ? p3(t[S]())
				     : a == "u"    ? (""+(t/1000)>>>0)
				     : a == "U"    ? +t
				     : a == "a"    ? (t[h]() > 11 ? "pm" : "am")
				     : a == "A"    ? (t[h]() > 11 ? "PM" : "AM")
				     : a == "Z"    ? "GMT " + (-t.getTimezoneOffset()/60)
				     : a == "w"    ? 1+Math.floor((t - new Date(t[Y](),0,4))/604800000)
				     : b           ? c
				     : a;
			}
		)
	}

	D.format.masks = {"default":"DDD MMM DD YYYY hh:mm:ss","isoUtcDateTime":'UTC:YYYY-MM-DD"T"hh:mm:ss"Z"'};
	D.monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December".split(" ");
	D.dayNames = "Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");


	I(D, "toISOString", "return this.format('isoUtcDateTime')");
	// D.toISOString = D.toISOString || D.format.partial('isoUtcDateTime');
	/*/
	I(D, "toISOString", "var t=this;return t.getUTCFullYear()+'-'+p2(t.getUTCMonth()+1)+'-'+p2(t.getUTCDate())+'T'+p2(t.getUTCHours())+':'+p2(t.getUTCMinutes())+':'+p2(t.getUTCSeconds())+'.'+p3(t.getUTCMilliseconds())+'Z'")
	//*/
	

	//** Date helpers

	S.date = N.date = function(format) {
		var t = this, d = new Date(), m, n = +t || Date.parse(t) || ""+t;
		if (isNaN(n)) {
			// Big endian date, starting with the year, eg. 2011-01-31
			if (m = n.match(/(\d{4})-(\d{2})-(\d{2})/)) d.setFullYear(m[1], m[2]-1, m[3]);
			// Little endian date, starting with the day, eg. 31.01.2011
			else if (m = n.match(/(\d{2})\.(\d{2})\.(\d{4})/)) d.setFullYear(m[3], m[2]-1, m[1]);
			// Middle endian date, starting with the month, eg. 01/31/2011
			else if (m = n.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)) d.setFullYear(m[3], m[1]-1, m[2]);
			// Time
			m = n.match(/(\d{1,2}):(\d{2}):?(\d{2})?\.?(\d{3})?/) || [0, 0, 0];
			if (n.match(/pm/i) && m[1] < 12) m[1]+=12;
			d.setHours(m[1], m[2], m[3]||0, m[4]||0);
			// Timezone
			n.indexOf("Z")>-1 && d.setTime(d-(d.getTimezoneOffset()*60000));
		} else d.setTime( (n<4294967296?n*1000:n) );
		return format?d.format(format):d;
	}
	//*/

	//** Date.daysInMonth
	D.daysInMonth = function() {
		return (new Date(this.getFullYear(),this.getMonth()+1,0)).getDate();
		//return 32-new Date(this.getFullYear(),this.getMonth(),32).getDate();
	}
	//*/

	//** Date.startOfWeek
	D.startOfWeek = function() {
		var t = this;
		return new Date(t.getFullYear(), t.getMonth(), t.getDate() - (t.getDay() || 7) +1);
	}
	//*/


	N.words = S.words = function(steps, units, strings){
		var n = +this
		  , i = 0
		  , s = strings || {"default":"{0} {1}"};
		
		while(n>steps[i])n/=steps[i++];
		i=units[i];
		return (n<2&&s[i+"s"]||s[i]||s["default"]).format(n|0, i);
	}

	S.humanSize = N.humanSize = N.words.partial([1024,1024,1024],["byte","KB","MB","GB"])
	S.humanTime = N.humanTime = N.words.partial([60,60,24],["sec","min","hour","day"])



	//** Date.pretty convert dates to human-readable

	D.prettySteps = [8640000, 2592000, 604800, 86400, 3600,   60,       1];
	D.prettyUnits = [         "month", "week", "day", "hour", "minute", "second"];
	
	D.prettyStrings={"default":"{0} {1} ago", "day":"Yesterday"};

	D.pretty = function(format, custom) {
		var d = (new Date() - this + 1) / 1000
		  , a = D.prettySteps
		  , i = a.length;

		if (d<a[0]) {
			while(d>a[--i]);d/=a[i+1];
			return ((a=custom||D.prettyStrings)[(i=D.prettyUnits[i]+(d<2?"":"s"))]||a["default"]).format(d|0, i);
		}
		// use guard here
		return this.format(format);
	}

// 	D.pretty2 = function(){return (new Date() - this + 1)/1000}
// 		.sequence(N.words.partial( [2592000, 604800, 86400, 3600,   60,       1], ["month", "week", "day", "hour", "minute", "second"]))
// 		.guard("this<8640000", D.format)
	//*/


	if (!("JSON" in w)) {
		w.JSON = {
			map: {"\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t",'"':'\\"',"\\":"\\\\"},
			parse: "t->new Function('return('+t+')')()".fn(),
			stringify: new Function("o", "if(o==null)return'null';if(o instanceof Date)return'\"'+o.toISOString()+'\"';var i,s=[],c;if(Array.isArray(o)){for(i=o.length;i--;s[i]=JSON.stringify(o[i]));return'['+s.join(',')+']';}c=typeof o;if(c=='string'){for(i=o.length;c=o.charAt(--i);s[i]=JSON.map[c]||(c<' '?'\\\\u00'+((c=c.charCodeAt())|4)+(c%16).toString(16):c));return'\"'+s.join('')+'\"';}if(c=='object'){for(i in o)o.hasOwnProperty(i)&&s.push(JSON.stringify(i)+':'+JSON.stringify(o[i]));return'{'+s.join(',')+'}';}return''+o")
		}
	}


	// eval in a global context for non-IE & non-Chrome (removed form v8 on 2011-05-23: Version 3.3.9)
	// THANKS: Juriy Zaytsev - Global eval [http://perfectionkills.com/global-eval-what-are-the-options/]
	if (!("execScript" in w)) {
		w.execScript = (function(o,Object){return(1,eval)("(Object)")===o})(Object,1) ? eval : 
			"d t a->s->d.body[a](d.createElement(s))[a](d.createTextNode(s))".fn()(document, "script", "appendChild")
	}


	/** loader.CommonJS style modules
	var _required = {}
	w.require = function(file) {
		if (file in _required) return _required[file];
		var req = new XMLHttpRequest(), exports = {};
		req.open("GET", file.replace(/^[^\/]/, w.require.path+"$&"), false);
		req.send();
		eval(req.responseText);
		return _required[file] = exports;
	}
	w.require.path = b;
	//*/


	//** loader.async
	w.load = function(f, cb) {
		if (!Array.isArray(f)) f=[f];
		var i=0, len=f.length, res = [];
		while (i<len) !function(i) {
			xhr("GET", f[i].replace(/^[^\/]/, w.load.path+"$&"), function(str) {
				res[i] = str;
				//for (var str,e="";str=res[loaded];++loaded){e+=str};
				//e && execScript(e);
				if (!--len) {
					execScript( res.join(";") );
					cb && cb();
					res = null;
				}
			}).send();
		}(i++);
	}
	/** loader - helpers
	a = document.getElementsByTagName("script");
	b = a[a.length-1].src.replace(/[^\/]+$/,"");
	//*/

	w.load.path = ""
	//*/

}(this, "prototype");












/** Tests for String
!function(){
	var test = new TestCase("String");
	test.compare(
		"  test  ".trim()
	, "test"
	, " \n te st \n ".trim()
	, "te st"
	, "te \n st".trim()
	, "te \n st"
	, "String.trim()");

	test.compare(
		"'hello world'".slice(1,-1)
	, "hello world"
	, "String.slice()");

	test.done();
}()
//*/




/** Tests for Array
!function(){
	var test = new TestCase("Array")
		, arr = [1,2,3,4,2,5]
		, res

	res = arr.filter(function(val, key){return val == 2 || key == 3});
	test.compare(
		res.length, 3
	, res.join(), "2,4,2"
	, "Array.filter()");

	res = [];
	arr.forEach(function(val, key){res.push(val+key)});

	test.compare(
		res.length, 6
	, res.join(), "1,3,5,7,6,10"
	, "Array.foreach()");

	res = arr.map(function(val, key){return (val+key)});

	test.compare(
		res.length, 6
	, res.join(), "1,3,5,7,6,10"
	, "Array.map()");

	test.compare(
		arr.indexOf(1)   , 0
	, arr.indexOf(5)   , 5
	, arr.indexOf(2)   , 1
	, arr.indexOf(2,1) , 1
	, arr.indexOf(2,2) , 4
	, arr.indexOf(2,5) , -1
	, arr.indexOf(6)   , -1
	, "Array.indexOf()");

	test.compare(
	  arr.lastIndexOf(1)    , 0
	, arr.lastIndexOf(5)    , 5
	, arr.lastIndexOf(2)    , 4
	, arr.lastIndexOf(2,4)  , 4
	, arr.lastIndexOf(2,3)  , 1
	, arr.lastIndexOf(2,-1) , 4
	, arr.lastIndexOf(2,-3) , 1
	, arr.lastIndexOf(6)    , -1
	, "Array.lastIndexOf()");

	test.compare(
	  [2, 4, 6, 8].every(function(i){return !(i%2)})
	, true
	, [2, 5, 6, 8].every(function(i){return !(i%2)})
	, false
	, "Array.every()");

	test.compare(
	  [2, 4, 6, 8].some(function(i){return i==4})
	, true
	, [2, 4, 6, 8].some(function(i){return i==5})
	, false
	, "Array.some()");


	test.compare(
		[0, 1, 2, 3].reduce(function(a, b){ return a + b; }), 6
	, [0,1,2,3,4].reduce(function(previousValue, currentValue, index, array){return previousValue + currentValue;}, 10), 20
	, "Array.reduce()");

	test.compare(
		[1,2,3,2,1].remove(2).join(), "1,3,1"
	, ['1',2,3,2,1].remove(2,1).join(), "1,3"
	, "Array.remove()");

	var sort = function(a,b){return a-b};

	test.compare(
		[1,3,5].indexFor(2), 3
	, [1,3,5].indexFor(0, sort), 0
	, [1,3,5].indexFor(1, sort), 1
	, [1,3,5].indexFor(2, sort), 1
	, [1,3,5].indexFor(3, sort), 2
	, [1,3,5].indexFor(4, sort), 2
	, [1,3,5].indexFor(5, sort), 3
	, [1,3,5].indexFor(6, sort), 3
	, "Array.indexFor()");

	test.done();
}()
//*/



/** Tests
!function(){
	var test = new TestCase("Native methods");

	var obj = {a:1,b:"2","cde":[1,"2",null,false,true,void 0,"kala"]}
		, expected = '{"a":1,"b":"2","cde":[1,"2",null,false,true,null,"kala"]}'
		, arr = Object.keys(obj)
		, res
	
	test.compare(
		arr.length
	, 3
	, arr.join()
	, "a,b,cde"
	, "Object.keys()");

	test.compare(
		JSON.stringify( obj )
	, expected
	, JSON.stringify( JSON.parse( expected ) )
	, expected
	, JSON.stringify( arr )
	, '["a","b","cde"]'
	, "JSON");
	
	test.compare(
		"hasOwnProperty" in obj, true
	, obj.hasOwnProperty("a"), true
	, obj.hasOwnProperty("hasOwnProperty"), false
	, obj.hasOwnProperty("c"), false
	, "Object.hasOwnProperty()");

	var bind_test = function(var1,var2){return var1+this.b+var2}
		, fun = bind_test.bind(obj,"res1")

	test.compare(
		fun("res2")
	, "res12res2"
	, "Function.bind()");

	test.done()
}()
//*/



/** Tests for Date
!function(){
	var test = new TestCase("Date");

	var d1 = new Date(1276703114000);
	d1.setUTCHours(13, 45, 55, 12);
	var d2 = new Date(1000000000000);
	var d3 = new Date(1234567890000);

	test.compare(
		d1.format("isoUtcDateTime")
	, "2010-06-16T13:45:55Z"
	, d1.format("u")
	, "1276695955"
	, d1.format("U")
	, "1276695955012"
	, d2.format("isoUtcDateTime")
	, "2001-09-09T01:46:40Z"
	, d2.format("UTC:H:mm A")
	, "1:46 AM"
	, d2.format("YY A")
	, "01 AM"
	, d3.format("isoUtcDateTime")
	, "2009-02-13T23:31:30Z"
	, "Date.format()");

	var str = (new Date(1276703114000)).toISOString();

	test.compare(
		str == "2010-06-16T15:45:14.000Z" || str == "2010-06-16T15:45:14Z"
	, true
	, "Date.toISOString()");

	test.done();
}()
//*/

/** Tests for Date.pretty
!function(){
	var test = new TestCase("Date.pretty")
		, curr = new Date();

	curr.setMilliseconds(0);

	curr.setTime( curr.getTime() - 1000 );
	test.compare( curr.pretty() , "1 second ago");

	curr.setTime( curr.getTime() - 1000 );
	test.compare( curr.pretty() , "2 seconds ago");

	curr.setTime( curr.getTime() - 58000 );
	test.compare( curr.pretty() , "1 minute ago");

	curr.setTime( curr.getTime() - 60000 );
	test.compare( curr.pretty() , "2 minutes ago");

	curr.setTime( curr.getTime() - 3600000 );
	test.compare( curr.pretty() , "1 hour ago");

	curr.setTime( curr.getTime() - 3600000 );
	test.compare( curr.pretty() , "2 hours ago");

	curr.setTime( curr.getTime() - 22*3600000 );
	test.compare( curr.pretty() , "Yesterday");

	curr.setTime( curr.getTime() - 24*3600000 );
	test.compare( curr.pretty() , "2 days ago");

	test.done();
}()
//*/



/** Tests for Function
!function(){

	function Fn1(){
		var t = this;
		t.a = 1;
		"init" in t && t.init.apply(t,arguments);
		return t;
	}
	Fn1.prototype = {
		init: function(){
			this.b = 1;
		},
		c:1
	}

	var test = new TestCase("Function")
		, Fn2 = Fn1.extend({d:1})
		, Fn3 = Fn2.extend({init:function(){},e:1})
		, Fn4 = Fn3.extend({init:function(){Fn2.prototype.init.call(this);},f:1})
		, f1 = new Fn1()
		, f2 = new Fn2()
		, f3 = new Fn3()
		, f4 = new Fn4()
		, run = 0
		, actual = 0
		, fn = function(i) {
				actual++;
				return i*i;
			}.cache()
		, fn2 = fn.origin.cache(true);

	test.compare(
		"a" in f1, true
	, "b" in f1, true
	, "c" in f1, true
	, "d" in f1, false
	, "e" in f1, false
	, "f" in f1, false
	
	, "a" in f2, true
	, "b" in f2, true
	, "c" in f2, true
	, "d" in f2, true
	, "e" in f2, false
	, "f" in f2, false

	, "a" in f3, true
	, "b" in f3, false
	, "c" in f3, true
	, "d" in f3, true
	, "e" in f3, true
	, "f" in f3, false

	, "a" in f4, true
	, "b" in f4, true
	, "c" in f4, true
	, "d" in f4, true
	, "e" in f4, true
	, "f" in f4, true

	, f1 instanceof Fn1, true
	, f1 instanceof Fn2, false
	, f1 instanceof Fn3, false
	, f1 instanceof Fn4, false
	, f2 instanceof Fn1, true
	, f2 instanceof Fn2, true
	, f2 instanceof Fn3, false
	, f2 instanceof Fn4, false
	, f3 instanceof Fn1, true
	, f3 instanceof Fn2, true
	, f3 instanceof Fn3, true
	, f3 instanceof Fn4, false
	, f4 instanceof Fn1, true
	, f4 instanceof Fn2, true
	, f4 instanceof Fn3, true
	, f4 instanceof Fn4, true

	, "Function.extend()");

	test.compare(
		fn(2), 4, ++run, actual
	, fn(2), 4, run, actual
	, fn(3), 9, ++run, actual
	, fn(3), 9, run, actual
	, fn(3,1), 9, ++run, actual
	, fn(3,1), 9, run, actual
	, "Function.cache() function results");

	test.compare(
		new fn(), new fn(), ++run, actual
	, new fn(1, 2), new fn(1, 2), ++run, actual
	, "Function.cache() instances");

	test.compare(
		fn2(), new fn2(), ++run, actual
	, new fn2(1, 2), fn2(1, 2), ++run, actual
	, "Function.cache() and create instance");

	test.done();
}()
//*/


/** Tests for String extensions
!function(){
	var test = new TestCase("String extensions");

	test.compare(
		"Hello {0}!".format("world")
	, "Hello world!"
	, "Hello {0}!\nHello {1}!".format("world {1}", "moon {0}")
	, "Hello world {1}!\nHello moon {0}!"
	, "String.format()");

	test.compare(
		"background-color".camelCase()
	, "backgroundColor"
	, "String.camelCase()");

	test.compare(
		"71".toAccuracy(5)
	, "70"
	, "12.31".toAccuracy(0.2)
	, "12.4"
	, "String.toAccuracy()");

	test.compare(
		(4294967295).int2ip()
	, "255.255.255.255"
	, (0).int2ip()
	, "0.0.0.0"
	, "4294967295".int2ip()
	, "255.255.255.255"
	, "0".int2ip()
	, "0.0.0.0"
	, "String.int2ip()");

	test.compare(
		"255.255.255.255".ip2int()
	, 4294967295
	, "0.0.0.0".ip2int()
	, 0
	, "String.ip2int()");

	test.done();
}()
//*/


/** Tests for lambda
!function(){
	var test = new TestCase("lambda")

	test.compare(
		'->1'.fn()(), 1,
		'x -> x + 1'.fn()(1), 2,
		'x y -> x + 2*y'.fn()(1, 2), 5,
		'x, y -> x + 2*y'.fn()(1, 2), 5,
		'_ + 1'.fn()(1), 2,
		'/2'.fn()(4), 2,
		'2/'.fn()(4), 0.5,
		'/'.fn()(2,4), 0.5,
		'x + 1'.fn()(1), 2,
		'x + 2*y'.fn()(1, 2), 5,
		'y + 2*x'.fn()(1, 2), 5,
		'Math.cos(angle)'.fn()(Math.PI), -1,
		'point.x'.fn()({x:1, y:2}), 1,
		'({x:1, y:2})[key]'.fn()('x'), 1,
		'x -> y -> x + 2*y'.fn()(1)(2), 5,
		'x -> y -> z -> x + 2*y+3*z'.fn()(1)(2)(3), 14,
		
    '1+'.map([1,2,3]).join(), [2, 3, 4].join(),
    'x y -> 2*x+y'.reduce([1,0,1,0], 0), 10,
    '%2'.select([1,2,3,4]).join(), [1, 3].join(),

    '>2'.some([1,2,3]), true,
    '>10'.some([1,2,3]), false
      
	);
		//map('"im"+root', ["probable", "possible"]), ["improbable", "impossible"]
    //["improbable", "impossible"], map('"im"+root', ["probable", "possible"]) ,

	test.done();
}()
//*/

/** Tests for functional
!function(){
	var test = new TestCase("functional")

	test.compare(
		'1+'.fn().compose('2*'.fn())(3),  7,
		'1+'.fn().chain('2*'.fn())(3), 8)


	test.done();
}()
//*/

