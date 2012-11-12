


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



!function(w/* window */) {
	var a, b, c
	, xhrs = []
	, P = "prototype"
	, A = Array[P]
	, O = Object

	function I(o, n, s, x) {
		o[n] = o[n] || new Function("x","y","return function(a,b,c,d){"+s+"}").apply(null, x||[o, n])
	}

	function Nop(){}


	// We need bind in beginning, other ECMAScript 5 stuff will come later
	I(Function[P], "bind", "var t=this;b=x.call(arguments,1);c=function(){return t.apply(this instanceof c?this:a,b.concat.apply(b,arguments))};if(t[y])c[y]=t[y];return c", [A.slice, P])


	// instanceof not implemented in IE 5 MAC
	// Safari 2.0.2: 416     hasOwnProperty introduced October 31, 2005 (Mac OS X v10.4)
	/** hasOwnProperty
	I(Object[P], "hasOwnProperty", "try{b=this.constructor;while(b=b[x])if(b[a]===this[a])return false}catch(e){}return true", [P]);
	//*/


	// Object extensions
	// -----------------

	I(O, "create" , "x[y]=a;return new x", [Nop, P])
	I(O, "keys"   , "c=[];for(b in a)a.hasOwnProperty(b)&&c.push(b);return c")




	// Array extensions
	// ----------------

	I(Array, "isArray", "return a instanceof Array")

	a = "var t=this,l=t.length,o=[],i=-1;"
	c = "if(t[i]===a)return i;return -1"
	I(A, "indexOf",     a+"i+=b|0;while(++i<l)"+c)
	I(A, "lastIndexOf", a+"i=(b|0)||l;i>--l&&(i=l)||i<0&&(i+=l);++i;while(--i>-1)"+c)

	b = a+"if(arguments.length<2)b=t"
	c = "b=a.call(null,b,t[i],i,t);return b"
	I(A, "reduce",      b+"[++i];while(++i<l)"+c)
	I(A, "reduceRight", b+"[--l];i=l;while(i--)"+c)

	b = a+"while(++i<l)if(i in t)"
	I(A, "forEach",     b+"a.call(b,t[i],i,t)")
	I(A, "every",       b+"if(!a.call(b,t[i],i,t))return!1;return!0")

	c = ";return o"
	I(A, "map",         b+"o[i]=a.call(b,t[i],i,t)"+c)

	b += "if(a.call(b,t[i],i,t))"
	I(A, "filter",      b+"o.push(t[i])"+c)
	I(A, "some",        b+"return!0;return!1")




	I(Date[P], "toISOString", "return this.format('isoUtcDateTime')")



	// XMLHttpRequest was unsupported in IE 5.x-6.x
	// MSXML version 3.0 was the last version of MSXML to support version-independent ProgIDs.
	I(w, "XMLHttpRequest", "return new ActiveXObject('MSXML2.XMLHTTP')");
	//I(w, "XMLHttpRequest", "a=function(n){n='MSXML2.XMLHTTP'+n;try{x[y]=function(){return new ActiveXObject(n)};return new x[y]}catch(e){}};return a('.6.0')||a('')");


	//** xhr
	w.xhr = function(method, url, cb, sync) {
		var r = xhrs.shift() || new XMLHttpRequest()
		r.open(method, url, !sync)
		r.onreadystatechange = function() {
			if (r.readyState == 4) {
				cb && cb( r.responseText, r)
				r.onreadystatechange = cb = Nop
				xhrs.push(r)
			}
		}
		return r
	};
	//*/


	if (!("JSON" in w)) {
		w.JSON = {
			map: {"\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t",'"':'\\"',"\\":"\\\\"},
			parse: new Function("t", "return new Function('return('+t+')')()"),
			//parse: Fn("t->new Function('return('+t+')')()"),
			stringify: new Function("o", "if(o==null)return'null';if(o instanceof Date)return'\"'+o.toISOString()+'\"';var i,s=[],c;if(Array.isArray(o)){for(i=o.length;i--;s[i]=JSON.stringify(o[i]));return'['+s.join()+']'}c=typeof o;if(c=='string'){for(i=o.length;c=o.charAt(--i);s[i]=JSON.map[c]||(c<' '?'\\\\u00'+((c=c.charCodeAt(0))|4)+(c%16).toString(16):c));return'\"'+s.join('')+'\"'}if(c=='object'){for(i in o)o.hasOwnProperty(i)&&s.push(JSON.stringify(i)+':'+JSON.stringify(o[i]));return'{'+s.join()+'}'}return''+o")
		}
	}


}(this)





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


var str = (new Date(1276703114000)).toISOString();

test.compare(
str == "2010-06-16T15:45:14.000Z" || str == "2010-06-16T15:45:14Z"
, true
, "Date.toISOString()");

test.done();
}()
//*/






