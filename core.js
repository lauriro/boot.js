


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



!function(w/* window */) {
	var a, b, c
	, fns = {}
	, P = "prototype"
	, A = Array[P], D = Date[P], F = Function[P], N = Number[P], S = String[P]
	, O = Object
	, sl = F.call.bind(A.slice)

	function Nop(){}



	// Function extensions
	// -------------------



	F.partial = function() {
		var t = this, a = sl(arguments)
		return function() {return t.apply(this, A.concat.apply(a, arguments))}
	}

	F.byWords = function(i) {
		var t = this
		i |= 0
		return function() {
			var s = this, r = s, a = arguments
			;(a[i]||"").replace(/\w+/g, function(w){a[i]=w;r=t.apply(s, a)})
			return r
		}
	}

	F.byKeyVal = function() {
		var t = this
		return function(o) {
			var s = this, a = sl(arguments), r
			if (typeof o == "object") for (r in o) {
				a[0] = r
				a[1] = o[r]
				r = t.apply(s, a)
			} else r = t.apply(s, a)
			return r
		}
	}

	F.construct = function(a) {
		return new(F.bind.apply(this, A.concat.apply([null], a)))
	}

	// Run function once and return cached value or cached instance
	F.cache = function(instance, keyFn, cache) {
		var t = this, c = cache || {}, f = function() {
			var a = arguments
			, i = !!instance || this instanceof f
			, k = keyFn ? keyFn(a, t) : i + ":" + a.length + ":" + A.join.call(a)

			return k in c ? c[k] : (c[k] = i ? t.construct(a) : t.apply(this, a))
		}
		f.origin = t
		f.cached = c
		f.extend = function() {
			return t.extend.apply(t, arguments).cache(instance, keyFn, c)
		}
		f[P] = t[P] // prototype for better access on extending 
		return f
	}

	F.extend = function() {
		var a, t = this, i = 0, f = function() {
			return t.apply(this, arguments)
		}
		f[P] = Object.create(t[P])
		while (a = arguments[i++]) Object.merge(f[P], a)
		return f
	}

	F.chain = function(a) {
		return "a b->->b.call(this,a.apply(this,arguments))".fold(Array.isArray(a) ? a : sl(arguments), this)
	}

	F.compose = function() {
		var a = [this].concat(sl(arguments)), t = a.pop()
		return t.chain(a)
	}

	F.guard = function(test, or) {
		var t = this
		, f = test.fn()
		, o = (or||Nop).fn()

		return function() {
			return (f.apply(this, arguments) ? t : o).apply(this, arguments)
		}
	}

	// Time to live - Run *fun* if Function not called on time
	F.ttl = function(ms, fun) {
		var t = this, s = setTimeout(function(){ms=0;fun&&fun()}, ms)
		return function() {
			clearTimeout(s)
			ms && t.apply(null, arguments)
		}
	}

	// Run Function once after last call
	F.once = function(ms) {
		var t = this, s, args
		return function() {
			clearTimeout(s)
			args = arguments
			s = setTimeout(function(){t.apply(null, args)}, ms)
		}
	}

	// Maximum call rate for Function
	F.rate = function(ms) {
		var t = this, n = 0
		return function() {
			var d = +new Date()
			if (d > n) {
				n = d + ms
				t.apply(null, arguments)
			}
		}
	}


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


	

	
	// Non-standard
	O.each = function(a, b, c, d) {
		if(a)for(d in a)a.hasOwnProperty(d)&&b.call(c,a[d],d,a)
	}
	O.merge = function(main) {
		var o, i = 1, k
		while (o = arguments[i++]) for (k in o) if (o.hasOwnProperty(k)) main[k] = o[k]
		return main
	}

	O.zip = function(keys, vals) {
		return keys.fold(function(_, key, i){
			_[key] = vals[i]
			return _
		}, {})
	}

	// Non-standard
	Array.from = function(a) {
		for(var b=[],c=a.length;c--;b.unshift(a[c]));
		return b
	}
	/*
	Array.flatten = function(arr) {
	for(var i=arr.length;i--;)
	0 in arr[i] && A.splice.apply(arr, [i, 1].concat(Array.flatten(arr[i])));
	return arr
	};
	flat([1,2,[3,4,[5,6]],7]);
	*/
	// Non-standard
	// // IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
	A.remove = function(a, b, c, d) {
		var t = this
		, l = t.length
		, o = sl(arguments)
		, i = -1

		while(l--)if(o.indexOf(t[l])>-1)t.splice(l,1);
		return t
	}
	A.indexFor = function(a, b, c, d) {
		var t = this
		, l = t.length
		, o = []
		, i = b ? 0 : l

		while(i<l)b.call(c,a,t[o=(i+l)>>1])<0?l=o:i=o+1
		return i
	}

	A.each = A.forEach
	A.fold = A.reduce
	A.foldr = A.reduceRight
	A.unique = A.filter.partial(function(s,i,a){return i == a.lastIndexOf(s)})

	!function(n) {
		F[n] = S[n] = function() {
			var a = arguments, l = a[0]
			a[0] = this.fn()
			return A[n].apply(l, a)
		}
	}.byWords()("every filter each map fold foldr some")




	// THANKS: Oliver Steele - String lambdas [http://osteele.com/javascripts/functional]
	function Fn(s) {
		if (s in fns) return fns[s]
		var a = ["_"]
		, t = s.split("->")

		if (t.length > 1) while (t.length) {
			s = t.pop()
			a = t.pop().match(/\w+/g)||""
			t.length && t.push("(function("+a+"){return("+s+")})")
		}
		return fns[s] = new Function(a, "return(" + s + ")")
	}
	w.Fn = Fn


	Fn.Nop = Nop
	Fn.This = F.fn = function() {return this}
	Fn.True = function() {return true}
	Fn.False = function() {return false}
	Fn.Init = function() {
		var t = this
		return "init" in t && t.init.apply(t, arguments) || t
	}

	S.fn = function() {
		return Fn(this)
	}



	// String extensions
	// -----------------

	S.trim = S.trim || S.replace.partial(/^\s+|\s+$/g, "")
	S.camelCase = S.replace.partial(/[ _-]+([a-z])/g, function(_, a){return a.toUpperCase()})

	S.format = function(m) {
		var a = typeof m == "object" ? m : arguments
		return this.replace(/\{(\w+)\}/g, function(_, i){return a[i]})
	}

	S.safe = function() {
		return this
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/\"/g, "&quot;")
	}

	S.toAccuracy = N.toAccuracy = function(a) {
		var x = (""+a).split("."), n = ~~((this/a)+.5) * a
		return ""+(1 in x ? n.toFixed(x[1].length) : n)
	}

	N.words = S.words = function(steps, units, strings, overflow) {
		var n = +this
		, i = 0
		, s = strings || {"default":"{0} {1}{2}"}

		while(n>steps[i])n/=steps[i++]
		if (i == steps.length && overflow) return overflow(this)
		i=units[i]
		n=(n+.5)|0
		return (s[n<2?i:i+"s"]||s["default"]).format(n, i, n<2?"":"s")
	}

	S.humanSize = N.humanSize = N.words.partial([1024,1024,1024],["byte","KB","MB","GB"])
	S.humanTime = N.humanTime = N.words.partial([60,60,24,7,30],["second","minute","hour","day","week","month"])


	//** String.utf8
	S.utf8_encode = function() {
		return unescape( encodeURIComponent( this ) )
	}

	S.utf8_decode = function() {
		return decodeURIComponent( escape( this ) )
	}
	//*/

	//** IP helpers
	S.ip2int = function() {
		var t = (this+".0.0.0").split(".")
		return ((t[0] << 24) | (t[1] << 16) | (t[2] << 8 ) | (t[3]))>>>0
	}

	S.int2ip = N.int2ip = function() {
		var t = +this
		return [t>>>24, (t>>>16)&0xFF, (t>>>8)&0xFF, t&0xFF].join(".")
	}
	//*/



	// Date extensions
	// ---------------

	function p2(n) {
		return n>9?n:"0"+n
	}

	function p3(n) {
		return (n>99?n:(n>9?"0":"00")+n)
	}

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
		, S = g + "Milliseconds"

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
				     : a
			}
		)
	}

	D.format.masks = {"default":"DDD MMM DD YYYY hh:mm:ss","isoUtcDateTime":'UTC:YYYY-MM-DD"T"hh:mm:ss"Z"'}
	D.monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December".split(" ")
	D.dayNames = "Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")



	S.date = N.date = function(format) {
		var t = this, d = new Date(), m, n = +t || ""+t; // n = +t || Date.parse(t) || ""+t; // In Chrome Date.parse("01.02.2001") is Jan
		if (isNaN(n)) {
			// Big endian date, starting with the year, eg. 2011-01-31
			if (m = n.match(/(\d{4})-(\d{2})-(\d{2})/)) d.setFullYear(m[1], m[2]-1, m[3])
			// Little endian date, starting with the day, eg. 31.01.2011
			else if (m = n.match(/(\d{2})\.(\d{2})\.(\d{4})/)) d.setFullYear(m[3], m[2]-1, m[1])
			// Middle endian date, starting with the month, eg. 01/31/2011
			else if (m = n.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)) d.setFullYear(m[3], m[1]-1, m[2])
			// Time
			m = n.match(/(\d{1,2}):(\d{2}):?(\d{2})?\.?(\d{3})?/) || [0, 0, 0]
			if (n.match(/pm/i) && m[1] < 12) m[1]+=12
			d.setHours(m[1], m[2], m[3]||0, m[4]||0)
			// Timezone
			n.indexOf("Z") && d.setTime(d-(d.getTimezoneOffset()*60000))
		} else d.setTime( (n<4294967296?n*1000:n) )
		return format?d.format(format):d
	}

	//** Date.daysInMonth
	D.daysInMonth = function() {
		return (new Date(this.getFullYear(),this.getMonth()+1,0)).getDate()
	}
	//*/

	//** Date.startOfWeek
	D.startOfWeek = function() {
		var t = this;
		return new Date(t.getFullYear(), t.getMonth(), t.getDate() - (t.getDay() || 7) +1)
	}
	//*/



	//** Date.timeAgo convert dates to human-readable
	D.timeAgo = function(format, custom) {
		var t = this, d = (new Date() - t + 1) / 1000
		return d.humanTime({"default":"{0} {1}{2} ago", "day":"Yesterday"}, function(){return t.format(format)})
	}
	//*/


}(this)










/** Tests for Array
!function(){
var test = new TestCase("Array extensions")
, arr = [1,2,3,4,2,5]
, res

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

test.compare(
Array.isArray([1])
, true
, Array.isArray(1)
, false
, Array.isArray(arguments)
, false
, Array.isArray({a:1})
, false
, "Array.isArray");

test.done();
}()
//*/




/** Tests for Date
!function(){
var test = new TestCase("Date extensions");

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

test.done();
}()
//*/

/** Tests for Date.timeAgo
!function(){
var test = new TestCase("Date.timeAgo")
, curr = new Date();

//curr.setMilliseconds(0);

curr.setTime( curr.getTime() - 1000 );
test.compare( curr.timeAgo() , "1 second ago");

curr.setTime( curr.getTime() - 1000 );
test.compare( curr.timeAgo() , "2 seconds ago");

curr.setTime( curr.getTime() - 58000 );
test.compare( curr.timeAgo() , "1 minute ago");

curr.setTime( curr.getTime() - 60000 );
test.compare( curr.timeAgo() , "2 minutes ago");

curr.setTime( curr.getTime() - 3600000 );
test.compare( curr.timeAgo() , "1 hour ago");

curr.setTime( curr.getTime() - 3600000 );
test.compare( curr.timeAgo() , "2 hours ago");

curr.setTime( curr.getTime() - 22*3600000 );
test.compare( curr.timeAgo() , "Yesterday");

curr.setTime( curr.getTime() - 24*3600000 );
test.compare( curr.timeAgo() , "2 days ago");

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
	var test = new TestCase("Object extensions")

	test.compare(
		JSON.stringify(Object.zip(["a","b"], [1, 2]))
	, '{"a":1,"b":2}'
	)

	test.done()
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
'x -> y -> x + 2*y'.fn()(1)(2), 5,
'x -> y -> z -> x + 2*y+3*z'.fn()(1)(2)(3), 14,

'1+_'.map([1,2,3]).join(), [2, 3, 4].join(),
'x y -> 2*x+y'.fold([1,0,1,0], 0), 10,
'_%2'.filter([1,2,3,4]).join(), [1, 3].join(),

'_>2'.some([1,2,3]), true,
'_>10'.some([1,2,3]), false

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
'1+_'.fn().compose('2*_'.fn())(3),  7,
'1+_'.fn().chain('2*_'.fn())(3), 8)


test.done();
}()
//*/

