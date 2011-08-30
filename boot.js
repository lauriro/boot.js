


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function boot_init(w/* window */, d/* document */, P/* String "prototype" */, undef){
	var A = Array[P], D = Date[P], F = Function[P], N = Number[P], O = Object[P], S = String[P]
	  , pad = function(n){return n>9?n:"0"+n}
	  , pad2 = function(n){return (n>99?n:(n>9?"0":"00")+n)}
	  , jsonMap = {"\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t",'"':'\\"',"\\":"\\\\"}
	  , no = []

	//** DOMParser when XML needed
	"DOMParser" in w || no.push("w.DOMParser=function(){};w.DOMParser[P].parseFromString=function(s,m) {var r=new XMLHttpRequest;r.open('GET','data:'+(m||'application/xml')+';charset=utf-8,'+encodeURIComponent(s),false);m&&'overrideMimeType'in r&&r.overrideMimeType(m);r.send();return r.responseXML}");
	//*/

	/* hasOwnProperty was unsupported in Safari/WebKit until 2.0.2 */
	"hasOwnProperty" in O || no.push("O.hasOwnProperty=function(n){try{var p=this.constructor;while(p=p[P])if(p[n]===this[n])return false}catch(e){}return true}");

	// non-IE
	"execScript" in w || no.push("w.execScript=function(s){!function(){w.eval.call(w,s)}()}");

	/* ECMAScript 5 stuff */
	"trim" in S || no.push("S.trim=function(){return this.replace(/^[\\s\\r\\n\\u2028\\u2029]+|[\\s\\r\\n\\u2028\\u2029]+$/g,'')}");
	"filter" in A || no.push("A.filter=function(f,s){var i=-1,l=this.length,r=[];while(++i<l)if(i in this&&f.call(s,this[i],i,this))r.push(this[i]);return r}");
	"forEach" in A || no.push("A.forEach=function(f,s){var i=-1,l=this.length;while(++i<l)if(i in this)f.call(s,this[i],i,this)}");
	"indexOf" in A || no.push("A.indexOf=function(e,s){var i=(s|0)-1,l=this.length;while(++i<l)if(this[i]===e)return i;return -1}");
	"lastIndexOf" in A || no.push("A.lastIndexOf=function(e,s){var l=this.length-1,i=(s|0)||l;i>l&&(i=l)||i<0&&(i+=l);++i;while(--i>-1)if(this[i]===e)return i;return -1}");
	"bind" in F || no.push("var s=A.slice;F.bind=function(t){var f=this,a=s.call(arguments,1);return function(){return f.apply(t,a.concat(s.call(arguments)))}}");
	
	//** Date helpers
	"toISOString" in D || no.push("D.toISOString=function(){return this.format('isoUtcDateTime')}");

	D.format = function(mask) {
		var t=this, g="get", mask=D.format.masks[mask]||mask||D.format.masks["default"]
		if (mask.substr(0,4) === "UTC:") { mask=mask.substr(4); g="getUTC" }
		return mask.replace(/(\")([^\"]*)\"|\'([^\']*)\'|(yy(yy)?|m{1,4}|d{1,4}|([HhMsS])\6?|[uUaAZ])/g,
			function(a, b, c){
				return a == "yy" ? (""+t[g+"FullYear"]()).substr(2) :
					a == "yyyy" ? t[g+"FullYear"]() :
					a == "m"    ? t[g+"Month"]()+1 :
					a == "mm"   ? pad(t[g+"Month"]()+1) :
					a == "mmm"  ? D.monthNames[ t[g+"Month"]() ] :
					a == "mmmm" ? D.monthNames[ t[g+"Month"]()+12 ] :
					a == "d"    ? t[g+"Date"]() :
					a == "dd"   ? pad(t[g+"Date"]()) :
					a == "ddd"  ? D.dayNames[ t[g+"Day"]() ] :
					a == "dddd" ? D.dayNames[ t[g+"Day"]()+7 ] :
					a == "h"    ? t[g+"Hours"]()%12||12 :
					a == "hh"   ? pad(t[g+"Hours"]()%12||12) :
					a == "H"    ? t[g+"Hours"]() :
					a == "HH"   ? pad(t[g+"Hours"]()) :
					a == "M"    ? t[g+"Minutes"]() : 
					a == "MM"   ? pad(t[g+"Minutes"]()) :
					a == "s"    ? t[g+"Seconds"]() :
					a == "ss"   ? pad(t[g+"Seconds"]()) :
					a == "S"    ? t[g+"Milliseconds"]() :
					a == "SS"   ? pad2(t[g+"Milliseconds"]()) :
					a == "u"    ? (t/1000)>>>0 :
					a == "U"    ? t/1 :
					a == "a"    ? t[g+"Hours"]() > 11 ? "pm" : "am" :
					a == "A"    ? t[g+"Hours"]() > 11 ? "PM" : "AM" :
					a == "Z"    ? "GMT " + (-t.getTimezoneOffset()/60) : b ? c : a
			}
		)
	}

	S.date = N.date = function(format) {
		var d, n = Number(this) || Date.parse(this);
		if (isNaN(n)) {
			var s = ""+this;
			d = new Date();
			if (n = s.match(/(\d{4})-(\d{2})-(\d{2})/)) d.setFullYear(n[1], n[2]-1, n[3]);
			else if (n = s.match(/(\d{2})\.(\d{2})\.(\d{4})/)) d.setFullYear(n[3], n[2]-1, n[1]);
			else if (n = s.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)) d.setFullYear(n[3], n[1]-1, n[2]);
			n = s.match(/(\d{1,2}):(\d{2}):?(\d{2})?\.?(\d{3})?/) || [0, 0, 0];
			if (s.match(/pm/i) && n[1] < 12) n[1]+=12;
			d.setHours(n[1], n[2], n[3]||0, n[4]||0);
			s.indexOf("Z")>-1 && d.setTime(d-(d.getTimezoneOffset()*60000));
		} else d = new Date( (n<4294967296?n*1000:n) );
		return format?d.format(format):d;
	}

	D.daysInMonth = function(){
		//return 32-new Date(this.getFullYear(),this.getMonth(),32).getDate();
		return (new Date(this.getFullYear(),this.getMonth()+1,0)).getDate();
	}

	D.startOfWeek = function(){
		var t = this;
		return new Date(t.getFullYear(), t.getMonth(), t.getDate() - (t.getDay() || 7) +1);
	}

	D.format.masks={
	  "default":"ddd mmm dd yyyy HH:MM:ss"
	, "fullDate":"dddd, mmmm d, yyyy"
	, "isoDate":"yyyy-mm-dd"
	, "isoTime":"HH:MM:ss"
	, "isoDateTime":"yyyy-mm-dd HH:MM:ss"
	, "isoUtcDateTime":'UTC:yyyy-mm-dd"T"HH:MM:ss"Z"'
	}

	D.monthNames=[ "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
		"January","February","March","April","May","June","July","August","September","October","November","December" ];
	D.dayNames=[ "Sun","Mon","Tue","Wed","Thu","Fri","Sat",
		"Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday" ];

	/*/
	"toISOString" in D || no.push("D.toISOString=function(){var t=this;return t.getUTCFullYear()+'-'+pad(t.getUTCMonth()+1)+'-'+pad(t.getUTCDate())+'T'+pad(t.getUTCHours())+':'+pad(t.getUTCMinutes())+':'+pad(t.getUTCSeconds())+'.'+pad2(t.getUTCMilliseconds())+'Z'}")
	//*/

	"keys" in Object || no.push("Object.keys=function(o){var a=[],k;for(k in o)o.hasOwnProperty(k)&&a.push(k);return a}");

	"JSON" in w || no.push("w.JSON={parse:function(t){return eval('('+t+')')},stringify:function json_encode(o){if(o===undef||o===null)return'null';var i,s=[];switch(O.toString.call(o)){case'[object String]':var c,a,m=jsonMap;for(i=o.length;c=o.charAt(--i);s[i]=m[c]||(c<' '?'\\\\u00'+((a=c.charCodeAt())|4)+(a%16).toString(16):c));return'\"'+s.join('')+'\"';case'[object Array]':for(i=o.length;i--;s[i]=json_encode(o[i]));return'['+s.join(',')+']';case'[object Object]':for(i in o)o.hasOwnProperty(i)&&s.push(json_encode(i)+':'+json_encode(o[i]));return'{'+s.join(',')+'}';case'[object Date]':return'\"'+o.toISOString()+'\"'}return''+o}}");

	no.length && eval(no.join(";"));




	//** Event handling
	var Event = w.Event || (w.Event={})
	  , de = d.documentElement
	  , db = d.body

	function cacheEvent(el, type, fn) {
		var _e = el._e || (el._e={});
		type in _e || (_e[type]={});
		return (_e[type][fn] = type === "mousewheel" ? function(e) {
				e || (e = w.event);
				var delta = "wheelDelta" in e ? e.wheelDelta/120 : -e.detail/3;
				delta != 0 && fn.call(el, e, delta);
			} 
			// In IE the event handling function is referenced, not copied, so 
			// the this keyword always refers to the window and is completely useless.
			: ("attachEvent"in el?function(){ fn.call(el, w.event); }:fn)
		);
	};

	function uncacheEvent(el, type, fn) {
		var _e = el._e||{};
		if (type in _e && fn in _e[type]) {
			var __fn = _e[type][fn];
			delete _e[type][fn];
			return __fn;
		};
		return fn;
	};

	//NOTE: The addEventListener method is supported in Internet Explorer from version 9.
	if ("addEventListener" in w) {
		Event.add = function(el, type, fn) {
			var __fn = cacheEvent(el, type, fn);
			type === "mousewheel" && el.addEventListener("DOMMouseScroll", __fn, false);
			el.addEventListener(type, __fn, false);
			return Event;
		}
		Event.remove = function(el, type, fn) {
			var __fn = uncacheEvent(el, type, fn);
			type === "mousewheel" && el.removeEventListener("DOMMouseScroll", __fn, false);
			el.removeEventListener(type, __fn, false);
			return Event;
		}
	} else {
		Event.add = function(el, type, fn) {
			el.attachEvent("on"+type, cacheEvent(el, type, fn) );
			return Event;
		}
		Event.remove = function(el, type, fn) {
			el.detachEvent("on"+type, uncacheEvent(el, type, fn) );
			return Event;
		}
	};
	Event.stop = function(e) {
		"stopPropagation" in e && e.stopPropagation();
		"preventDefault" in e && e.preventDefault();
		e.cancelBubble = e.cancel = true;
		return e.returnValue = false;
	};

	Event.removeAll = function(el, type) {
		var _e = el._e||{};
		for (var t in _e) if (_e.hasOwnProperty(t) && (!type || type == t)) {
			var fnList = _e[t];
			for (var fn in fnList) {
				fnList.hasOwnProperty(fn) && Event.remove(el, t, fn);
			}
			delete _e[t];
		}
	};

	Event.pointerX = function(e) {
		return e.pageX || e.clientX + (de.scrollLeft || db.scrollLeft) || 0;
	};
	Event.pointerY = function(e) {
		return e.pageY || e.clientY + (de.scrollTop || db.scrollTop) || 0;
	};
	Event.pointer = function(e) {
		var x = Event.pointerX(e), y = Event.pointerY(e);
		return { x: x, y: y, left: x, top: y };
	};

	function touchHandler(e){
		Event.stop(e);
		var touch = e.changedTouches[0], ev = d.createEvent("MouseEvent");
		ev.initMouseEvent(
			e.type.replace("touch", "mouse").replace("start", "down").replace("end", "up"),
			true, true, window, 1, 
			touch.screenX, touch.screenY, touch.clientX, touch.clientY,
			false, false, false, false, 0/*left*/, null);
		touch.target.dispatchEvent(ev);
	};
	
	function touchStart(e){
		if(e.touches.length == 1){
			Event.add(d, "touchend", touchEnd)
				.add(d, "touchcancel", touchEnd)
				.add(d, "touchmove", touchHandler);
			touchHandler(e);
		}
	};
 
	function touchEnd(e){
		Event.remove(d, "touchend", touchEnd)
			.remove(d, "touchcancel", touchEnd)
			.remove(d, "touchmove", touchHandler);
		touchHandler(e);
	};

	Event.touch_as_mouse = function(el) {
		Event.add(el, "touchstart", touchStart);
	};

	var kbMaps = []
	function keyup(e){
		var key = e.keyCode || e.which
		  , map = kbMaps[0];

		if ( key in map ) map[key](key)
		else if ( "num" in map && key > 47 && key < 58) map.num(key-48)
		else if ( "_default" in map ) map._default(key)
		else {
			var i = 0;
			while ("_bubble" in map && (map = kbMaps[++i])) {
				if ( key in map ) map[key](key)
				else if ( "_default" in map ) map._default(key)
			}
		}
	}

	Event.setKeyMap = function(map){
		kbMaps.unshift(map);
		kbMaps.length == 1 && Event.add(document, "keyup", keyup);
	}
	Event.removeKeyMap = function(map){
		if (kbMaps.length > 0) {
			var index = kbMaps.indexOf(map)
			kbMaps.splice( index == -1 ? 0 : index, 1);
			kbMaps.length == 0 && Event.remove(document, "keyup", keyup);
		}
	}
	//*/


	//** Page builder

	var elCache = {}
	  , customExtend = {}
	  , parse = function(s, o) {
	    	for(var k in o)if(o.hasOwnProperty(k))s=s.split("{"+k+"}").join(""+o[k]);
	    	return s
	    }
	  , dv = d.defaultView
	  , getStyle = ( dv && "getComputedStyle" in dv ?
	    	function(el, a) {
	    		return el.style[a] || dv.getComputedStyle(el,null)[a] || null;
	    	} :
	    	function(el, a) {
	    		if (a === "opacity") {
	    			var opacity = el.filters("alpha").opacity;
	    			return isNaN(opacity) ? 1 : (opacity?opacity/100:0);
	    		}
	    		a = a.camelCase();
	    		return el.style[a]||el.currentStyle[a]||null;
	    	}
	    )
	  , setStyle = function(el, name, val) {
	    	try{
	    		if (name == 'float') name = 'cssFloat'
	    		return el.style[ name.camelCase() ] = val;
	    	}catch(e){
	    		if (val.indexOf('rgba')>-1) setStyle(el, name, val.repalce('rgba','rgb'));
	    	}
	    }

	function __append(el, before) {
		// instanceof not implemented in IE 5 MAC
		// if ( O.toString.call(el) === "[object Array]" ) {
		// obj.constructor == Array
		var t = this, i = 0;
		if (el) {
			if ( el instanceof Array ) {
				var len = el.length;
				if ("createDocumentFragment" in d) {
					var frag = d.createDocumentFragment();
					for(; i<len; __append.call(frag, el[i++]));
					t.append(frag, before);
				} else {
					/* document.createDocumentFragment is unsupported in IE5.5 */
					for(; i<len; t.append(el[i++], before));
				}
			} else {
				if ("string" === (i = typeof(el)) || i === "number") el = d.createTextNode(el);
				before && t.insertBefore(el,(before===true?t.firstChild:before)) || t.appendChild(el);
				"append_hook" in el && el.append_hook();
			}
		}
		return t;
	}

	function __prepend(el) {
		return this.append(el, true);
	}

	function __before(el) {
		__append.call(el.parentNode, this, el);
		return this;
	}

	function __after(el) {
		__append.call(el.parentNode, this, el.nextSibling);
		return this;
	}

	function __hasClass(name) {
		return (" "+this.className+" ").indexOf(" "+name+" ") > -1;
	}

	function __addClass(name) {
		var t = this, c = t.className || "";
		if (name) {
			if (c == "") t.className = name;
			else if (!t.hasClass(name)) t.className = c+" "+name;
		}
		return t;
	}

	function __removeClass(name) {
		var t = this;
		t.className = (" "+t.className+" ").replace(" "+name+" "," ").trim();
		return t;
	}

	function __toggleClass(name, status) {
		if ( (status===undef && !this.hasClass(name)) || status ) {
			this.addClass(name);
			return true;
		}
		this.rmClass(name);
		return false;
	}

	function __empty() {
		var t = this;
		while (t.firstChild) __kill.call(t.firstChild);
		return t;
	}

	function __kill() {
		var t = __empty.call(this);
		t.parentNode && t.parentNode.removeChild(t);
		Event.removeAll(t);
		"kill_hook" in t && t.kill_hook();
		return t;
	}

	function __css(atr, new_val) {
		var t = this;
		if (typeof(atr)=="object") {
			for (var style in atr) atr.hasOwnProperty(style) && setStyle(t,style,atr[style]);
			return t;
		} else {
			return new_val?setStyle(t,atr,new_val):getStyle(t,atr);
		}
	}

	function __on(type, fn) {
		var t = this;
		type.replace(/\w+/g,function(w){Event.add(t, w, fn)})
		return t;
	}

	function __set(args) {
		var t = this;
		if (args) switch (typeof(args)) {
			case "object":
			if ("nodeType" in args || args instanceof Array ) {
				t.append(args);
			} else {
				for (var arg in args) if (args.hasOwnProperty(arg)) {
					var val = args[arg];
					switch (arg) {
						case "append":
							if (typeof(val) === "object") {
								if ("nodeType" in val || val instanceof Array ) {
									t.append(val);
									break;
								}
								val = parse(t.innerHTML, val);
							}
						case "innerHTML":
							t.innerHTML = val || "";
							break;
						case "style":
							t.css(val);
							break;
						case "class":
						case "className":
							val && t.addClass(val);
							break;
						case "autocorrect":
						case "autocomplete":
						case "autocapitalize":
						case "selected":
						case "type":
							if (val === false) {
								t.removeAttribute(arg);
							} else {
								t.setAttribute(arg, val);
							}
							break;
						default:
							t[arg] = val;
					}
				}
			}
			break;

			case "string":
			t.innerHTML = args;
			break;
		}
		return t;

	}

	function __extend(el) {
		el.append = __append;
		el.prepend = __prepend;
		el.before = __before;
		el.after = __after;
		el.addClass = __addClass;
		el.removeClass = el.rmClass = __removeClass;
		el.toggleClass = __toggleClass;
		el.hasClass = __hasClass;
		el.css = __css;
		el.empty = __empty;
		el.kill = __kill;
		el.on = __on;
		el.set = __set;
		return el;
	}
	
	if ("HTMLElement" in w) __extend( HTMLElement[P] );
	else if ("Element" in w) __extend( Element[P] ); // for IE8
	else {
		// for IE 6-7
		var create = d.createElement;
		d.createElement = function(name){
			return __extend(create(name));
		}
	}

	var argsRe = /([.#:])(\w+)/g
	  , argsMap = {".":"className", "#":"id"};

	w.El = function El(name, args, parent, before) {
		var pre = {};
		name = name.replace(argsRe, function(m, m1, m2){
			pre[ argsMap[m1] || m2 ] = m2;
			return "";
		}) || "div";

		var el = (elCache[name] || (elCache[name] = d.createElement(name))).cloneNode(true).set(pre).set(args);

		name in customExtend && customExtend[name](el, args);

		if (typeof(parent) === "string") parent = El.get(parent)
		parent && __append.call(parent, el, before)
		
		return el
	}

	w.El.get = function(id) {
		var el = (typeof id === "string") ? d.getElementById(id) : id
		el && "append"in el === false && __extend(el)
		return el
	}

	w.El.cache = function(name, el, custom) {
		elCache[name] = el
		custom && (customExtend[name]=custom)
	}
	//*/

	//** Random stuff

	// Time to live - Run *fun* if Function not called on time
	F.ttl = function(ms, fun){
		var t = this, s = setTimeout(function(){ms=0;fun&&fun()}, ms);
		return function(){
			clearTimeout(s);
			ms && t.apply(null, arguments);
		}
	}

	// Run Function once after last call
	F.after = function(ms){
		var t = this, s, args;
		return function(){
			clearTimeout(s);
			args = arguments;
			s = setTimeout(function(){t.apply(null, args)}, ms);
		}
	}

	F.once = function(){
		var t = this, r, ran;
		return function(){
			return ran ? r : (ran = true) && (r = t.apply(null, arguments));
		}
	}

	// Maximum call rate for Function
	F.rate = function(ms, last_call){
		var t = this, s, args, next = 0;
		return function(){
			clearTimeout(s);
			var now = (new Date()).getTime();
			if (now > next) {
				next = now + ms;
				t.apply(null, arguments);
			} else if (last_call) {
				args = arguments;
				s = setTimeout(function(){t.apply(null, args)}, next-now);
			}
		}
	}

	F.extend = function(superclass, proto) {
		// create our new subclass
		this.prototype = new superclass();

		// optional subclass methods and properties
		if (proto) {
			for (var i in proto) this.prototype[i] = proto[i];
		}
	}


  S.utf8_encode = function(){
    return unescape( encodeURIComponent( this ) );
  }

  S.utf8_decode = function(){
    return decodeURIComponent( escape( this ) );
  }

  S.safe = function() {
  	return this
  		.replace(/&/g, "&amp;")
  		.replace(/</g, "&lt;")
  		.replace(/>/g, "&gt;");
	}

	S.camelCase = function () {
		return this.replace(/[ _-]+([a-z])/g,function($0,$1){return $1.toUpperCase()});
	}

  S.toAccuracy = N.toAccuracy = function(a){
    var x = (""+a).split("."), n = ~~((this/a)+.5) * a;
    return 1 in x ? n.toFixed(x[1].length) : n;
  }
	//*/

	//** CommonJS style module loader
	var _required = {}
	w.require = function(file){
		if (file in _required) return _required[file];
		var req = new XMLHttpRequest(), exports = {};
		req.open("GET", file.replace(/^[^\/]/, w.require.path+"$&"), false);
		req.send();
		eval(req.responseText);
		return _required[file] = exports;
	}
	//*/


	//** async loader
	w.load = function(files, cb){
		files instanceof Array || (files=[files]);
		var i=0, pos=0, len=files.length, source = [];
		while (i<len) !function(req, i){
			req.open("GET", files[i].replace(/^[^\/]/, w.load.path+"$&"), true);
			req.onreadystatechange = function(){
				if (req.readyState === 4) {
					source[i] = req.responseText || ";";
					for (var str,e="";str=source[pos];++pos){e+=str};
					e && w.execScript(e);
					if (pos == len ) {
						cb && cb();
						source = null;
					}
				}
			}
			req.send();
		}(new XMLHttpRequest(), i++);
	}
	//*/

	no = d.getElementsByTagName("script");
	no = no[no.length-1];
	w.load.path=w.require.path=no.src.replace(/[^\/]+$/,"");
	w.execScript(no.innerHTML);

	delete boot_init;
}(window, document, "prototype")


/** Tests
!function(undef){
	var test = new TestCase("Core")

	var obj = {a:1,b:"2","cde":[1,"2",null,false,true,undef,"kala"]}
	  , arr = [1,2,3,4,2,5]
	  , expected = '{"a":1,"b":"2","cde":[1,"2",null,false,true,null,"kala"]}'
	  , res
	
	test.compare(
	  JSON.stringify( obj )
	, expected
	, JSON.stringify( JSON.parse( expected ) )
	, expected
	, "JSON"
	)
	
	test.ok(
	  "hasOwnProperty" in obj
	, obj.hasOwnProperty("a")
	, !obj.hasOwnProperty("hasOwnProperty")
	, !obj.hasOwnProperty("c")
	)

	var bind_test = function(var1,var2){return var1+this.b+var2}
	  , fun = bind_test.bind(obj,"res1")

	test.compare(
	  fun("res2")
	, "res12res2"
	, "Function.bind()"
	)


	test.compare(
		"  test  ".trim()
	, "test"
	, " \n te st \n ".trim()
	, "te st"
	, "te \n st".trim()
	, "te \n st"
	, "String.trim()")


	res = arr.filter(function(val, key){return val == 2 || key == 3});
	test.ok(
	  res.length == 3
	, res[0] == 2
	, res[1] == 4
	, res[2] == 2
	)

  res = [];
  arr.forEach(function(val, key){res.push(val)});

	test.ok(
	  res.length == 6
	, res[0] == 1
	, res[1] == 2
	)

	test.compare(
	  arr.indexOf(2)
	, 1
	, arr.indexOf(2,2)
	, 4
	, "Array.indexOf()"
	)

	test.compare(
	  arr.lastIndexOf(2)
	, 4
	, arr.lastIndexOf(6)
	, -1
	, arr.lastIndexOf(2,-3)
	, 1
	, "Array.lastIndexOf()"
	)


	var str = (new Date(1276703114000)).toISOString();
	test.ok(
	  str == "2010-06-16T15:45:14.000Z" || str == "2010-06-16T15:45:14Z"
	)


	var d1 = new Date(1276703114000);
	var d2 = new Date(0);
	d2.setHours(13, 45, 55, 12);
	test.compare(
	  d1.format("isoUtcDateTime")
	, "2010-06-16T15:45:14Z"
	, d1.format("u")
	, "1276703114"
	, d2.format("isoUtcDateTime")
	, "1970-01-01T11:45:55Z"
	, d2.format("UTC:h:MM A")
	, "11:45 AM"
	, d2.format("yy A")
	, "70 PM"
	, "Date.format()"
	)


  test.done()

	var test_el = new TestCase("El")

	var el = El("div");
	var h1 = El("h1");
	var h2 = El("h2");
	var h3 = El("h3");
	var h4 = El("h4");

	el.append(h2);
	test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.append");
	el.prepend(h4);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h4></h4><h2></h2>", "El.prepend");
	h4.kill();
	test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.kill");
	h1.before(h2);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2>", "El.before");
	h3.after(h2);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2><h3></h3>", "El.after");
	el.empty();
	test_el.compare(el.innerHTML.toLowerCase(), "", "El.empty");
	el.append([h3,h4])
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h3></h3><h4></h4>", "El.append array");
	el.prepend([h1,h2]);
	test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2><h3></h3><h4></h4>", "El.prepend array");

	el.addClass("test1");
	test_el.compare(el.className, "test1", "El.addClass");

	el.addClass("test2");
	test_el.compare(el.className, "test1 test2");

	el.addClass("test3");
	test_el.compare(el.className, "test1 test2 test3");

	el.addClass("test4");
	test_el.compare(el.className, "test1 test2 test3 test4");

	el.removeClass("test2");
	test_el.compare(el.className, "test1 test3 test4", "El.removeClass");

	el.removeClass("test1");
	test_el.compare(el.className, "test3 test4");

	el.removeClass("test4");
	test_el.compare(el.className, "test3");

	el.removeClass("c4");
	test_el.compare(el.className, "test3");

	el.toggleClass("test4");
	test_el.compare(el.className, "test3 test4", "El.toggleClass");

	el.toggleClass("test4", true);
	test_el.compare(el.className, "test3 test4");

	el.toggleClass("test4");
	test_el.compare(el.className, "test3");

	el.toggleClass("test4", false);
	test_el.compare(el.className, "test3");
	test_el.compare(el.hasClass("test3"), true, el.hasClass("test4"), false, "El.hasClass");


  test_el.done();

}()
//*/




