


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

	//** base64
	if (!("atob" in w)) {
		var ba = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("")
		, bm = {"=":0}
		
		for (i = 64; bm[ba[--i]]=i;);

		// base64_encode
		w.btoa = function(s) {
			for (var out=[],b,i=0,len=s.length;i<len;) {
				b = s.charCodeAt(i++)<<16 | s.charCodeAt(i++)<<8 | s.charCodeAt(i++)
				out.push(ba[b>>18&0x3f], ba[b>>12&0x3f], ba[b>>6&0x3f], ba[b&0x3f])
			}
			if (len%=3) out.splice(len-3, 2, len==1?"==":"=")
			return out.join("")
		}

		// base64_decode
		w.atob = function(s) {
			for (var out=[],b,i=0,len=s.length,s=s.split("");i<len;) {
				b = bm[s[i++]]<<18 | bm[s[i++]]<<12 | bm[s[i++]]<<6 | bm[s[i++]]
				out.push(b>>16 & 0xff, b>>8 & 0xff, b & 0xff)
			}
			if (s[len-1] == "=") out.length -= s[len-2] == "=" ? 2 : 1
			return String.fromCharCode.apply(null, out)
		}
	}

	//*/

	// XMLHttpRequest was unsupported in IE 5.x-6.x
	// MSXML version 3.0 was the last version of MSXML to support version-independent ProgIDs.
	I(w, "XMLHttpRequest", "return new ActiveXObject('MSXML2.XMLHTTP')");
	//I(w, "XMLHttpRequest", "a=function(n){n='MSXML2.XMLHTTP'+n;try{x[y]=function(){return new ActiveXObject(n)};return new x[y]}catch(e){}};return a('.6.0')||a('')");


	//** xhr
	w.xhr = function(method, url, cb, sync) {
		var r = xhrs.shift() || new XMLHttpRequest()
		r.open(method, url, !sync)
		if (!sync) r.onreadystatechange = function() {
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





/** Tests for base64
!function(){
	var map = {
		"b": "Yg==",
		"ba": "YmE=",
		"bas": "YmFz",
		"base64 encode": "YmFzZTY0IGVuY29kZQ==",
		"{@:#}": "e0A6I30=",
		"Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius. Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram, anteposuerit litterarum formas humanitatis per seacula quarta decima et quinta decima. Eodem modo typi, qui nunc nobis videntur parum clari, fiant sollemnes in futurum.": "TG9yZW0gaXBzdW0gZG9sb3Igc2l0IGFtZXQsIGNvbnNlY3RldHVlciBhZGlwaXNjaW5nIGVsaXQsIHNlZCBkaWFtIG5vbnVtbXkgbmliaCBldWlzbW9kIHRpbmNpZHVudCB1dCBsYW9yZWV0IGRvbG9yZSBtYWduYSBhbGlxdWFtIGVyYXQgdm9sdXRwYXQuIFV0IHdpc2kgZW5pbSBhZCBtaW5pbSB2ZW5pYW0sIHF1aXMgbm9zdHJ1ZCBleGVyY2kgdGF0aW9uIHVsbGFtY29ycGVyIHN1c2NpcGl0IGxvYm9ydGlzIG5pc2wgdXQgYWxpcXVpcCBleCBlYSBjb21tb2RvIGNvbnNlcXVhdC4gRHVpcyBhdXRlbSB2ZWwgZXVtIGlyaXVyZSBkb2xvciBpbiBoZW5kcmVyaXQgaW4gdnVscHV0YXRlIHZlbGl0IGVzc2UgbW9sZXN0aWUgY29uc2VxdWF0LCB2ZWwgaWxsdW0gZG9sb3JlIGV1IGZldWdpYXQgbnVsbGEgZmFjaWxpc2lzIGF0IHZlcm8gZXJvcyBldCBhY2N1bXNhbiBldCBpdXN0byBvZGlvIGRpZ25pc3NpbSBxdWkgYmxhbmRpdCBwcmFlc2VudCBsdXB0YXR1bSB6enJpbCBkZWxlbml0IGF1Z3VlIGR1aXMgZG9sb3JlIHRlIGZldWdhaXQgbnVsbGEgZmFjaWxpc2kuIE5hbSBsaWJlciB0ZW1wb3IgY3VtIHNvbHV0YSBub2JpcyBlbGVpZmVuZCBvcHRpb24gY29uZ3VlIG5paGlsIGltcGVyZGlldCBkb21pbmcgaWQgcXVvZCBtYXppbSBwbGFjZXJhdCBmYWNlciBwb3NzaW0gYXNzdW0uIFR5cGkgbm9uIGhhYmVudCBjbGFyaXRhdGVtIGluc2l0YW07IGVzdCB1c3VzIGxlZ2VudGlzIGluIGlpcyBxdWkgZmFjaXQgZW9ydW0gY2xhcml0YXRlbS4gSW52ZXN0aWdhdGlvbmVzIGRlbW9uc3RyYXZlcnVudCBsZWN0b3JlcyBsZWdlcmUgbWUgbGl1cyBxdW9kIGlpIGxlZ3VudCBzYWVwaXVzLiBDbGFyaXRhcyBlc3QgZXRpYW0gcHJvY2Vzc3VzIGR5bmFtaWN1cywgcXVpIHNlcXVpdHVyIG11dGF0aW9uZW0gY29uc3VldHVkaXVtIGxlY3RvcnVtLiBNaXJ1bSBlc3Qgbm90YXJlIHF1YW0gbGl0dGVyYSBnb3RoaWNhLCBxdWFtIG51bmMgcHV0YW11cyBwYXJ1bSBjbGFyYW0sIGFudGVwb3N1ZXJpdCBsaXR0ZXJhcnVtIGZvcm1hcyBodW1hbml0YXRpcyBwZXIgc2VhY3VsYSBxdWFydGEgZGVjaW1hIGV0IHF1aW50YSBkZWNpbWEuIEVvZGVtIG1vZG8gdHlwaSwgcXVpIG51bmMgbm9iaXMgdmlkZW50dXIgcGFydW0gY2xhcmksIGZpYW50IHNvbGxlbW5lcyBpbiBmdXR1cnVtLg=="
	}

	var test = TestCase("Base64");
	
	for (var key in map) if (map.hasOwnProperty(key)) test.compare(btoa(key), map[key], "base64_encode btoa");
	for (var key in map) if (map.hasOwnProperty(key)) test.compare(key, atob(map[key]), "base64_decode atob");
	
	test.done();

}();

//*/

