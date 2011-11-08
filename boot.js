


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function(w/* window */, d/* document */, P/* String "prototype" */) {
	var A = Array[P], D = Date[P], F = Function[P], N = Number[P], O = Object[P], S = String[P]
	  , p2 = function(n){return n>9?n:"0"+n}
	  , p3 = function(n){return (n>99?n:(n>9?"0":"00")+n)}
	  , jsonMap = {"\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t",'"':'\\"',"\\":"\\\\"}
	  , no = []
	  , de = d.documentElement
	  , slice = A.slice
	  , a;

	/*@cc_on
		// XMLHttpRequest was unsupported in IE 5.x-6.x + remove background image flickers on hover
		"XMLHttpRequest" in w || no.push("w.XMLHttpRequest=function(){function a(n){try{var x=new ActiveXObject(n);w.XMLHttpRequest=function(){return new ActiveXObject(n)};return x}catch(e){return false}}return a('Msxml2.XMLHTTP.6.0')||a('Msxml2.XMLHTTP')};try{d.execCommand('BackgroundImageCache',false,true)}catch(e){}");
	@*/


	/* hasOwnProperty was unsupported in Safari/WebKit until 2.0.2 */
	"hasOwnProperty" in O || no.push("O.hasOwnProperty=function(n){try{var p=this.constructor;while(p=p[P])if(p[n]===this[n])return false}catch(e){}return true}");

	// for non-IE
	"execScript" in w || no.push("w.execScript=function(s){!function(){w.eval.call(w,s)}()}");


	/* ECMAScript 5 stuff */

	"trim" in S || no.push("S.trim=function(){return this.replace(/^[\\s\\r\\n\\u2028\\u2029]+|[\\s\\r\\n\\u2028\\u2029]+$/g,'')}");

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

	a = "=function(f,s){var t=this,l=t.length,";

	"filter"      in A || no.push("A.filter"     +a+"i=-1,a=[];while(++i<l)if(i in t&&f.call(s,t[i],i,t))a.push(t[i]);return a}");
	"forEach"     in A || no.push("A.forEach"    +a+"i=-1;while(++i<l)if(i in t)f.call(s,t[i],i,t)}");
	"indexOf"     in A || no.push("A.indexOf"    +a+"i=(s|0)-1;while(++i<l)if(t[i]===f)return i;return -1}");
	"lastIndexOf" in A || no.push("A.lastIndexOf"+a+"i=(s|0)||l;i>--l&&(i=l)||i<0&&(i+=l);++i;while(--i>-1)if(t[i]===f)return i;return -1}");
	"map"         in A || no.push("A.map"        +a+"a=[];while(l--)a[l]=f.call(s,t[l],l,t);return a}");
	"reduce"      in A || no.push("A.reduce"     +a+"i=0,a=arguments.length<2?t[i++]:s;while(i<l)a=f.call(null,a,t[i],i++,t);return a}");
	// Non-standard
	no.push("A.remove"+a+"a=slice.call(arguments);while(l--)if(a.indexOf(t[l])>-1)t.splice(l,1);return t}");


	/** Tests for Array
	!function(){
		var test = new TestCase("Array")
		  , arr = [1,2,3,4,2,5]
		  , res

		res = arr.filter(function(val, key){return val == 2 || key == 3});
		test.compare(
		  res.length
		, 3
		, res.join()
		, "2,4,2"
		, "Array.filter()");

		res = [];
		arr.forEach(function(val, key){res.push(val)});

		test.compare(
			res.length
		, 6
		, res.join()
		, "1,2,3,4,2,5"
		, "Array.foreach()");

		test.compare(
			arr.indexOf(2) , 1
		, arr.indexOf(2,2) , 4
		, "Array.indexOf()");

		test.compare(
			arr.lastIndexOf(2) , 4
		, arr.lastIndexOf(6) , -1
		, arr.lastIndexOf(2,-3) , 1
		, "Array.lastIndexOf()");

		res = [1,2,3].map(function(i){return i+2});

		test.compare(
			res[0] , 3
		, res[1] , 4
		, res[2] , 5
		, "Array.map()");

		test.compare(
			[0, 1, 2, 3].reduce(function(a, b){ return a + b; })
		, 6
		, [0,1,2,3,4].reduce(function(previousValue, currentValue, index, array){return previousValue + currentValue;}, 10)
		, 20
		, "Array.reduce()");

		test.compare(
		  [1,2,3,2,1].remove(2).join()
		, "1,3,1"
		, ['1',2,3,2,1].remove(2,1).join()
		, "1,3"
		, "Array.remove()");

		test.done();
	}()
	//*/

	"bind" in F || no.push("F.bind=function(t){var f=this,a=slice.call(arguments,1);return function(){return f.apply(t,a.concat(slice.call(arguments)))}}");
	
	"keys" in Object || no.push("Object.keys=function(o){var a=[],k;for(k in o)o.hasOwnProperty(k)&&a.push(k);return a}");
	//"create" in Object || no.push("Object.create=function(o){function f(){};f[P]=o;return new f()}");
	
	"JSON" in w || no.push("w.JSON={parse:function(t){return eval('('+t+')')},stringify:function json_encode(o){if(o===void 0||o===null)return'null';var i,s=[];switch(O.toString.call(o)){case'[object String]':var c,a,m=jsonMap;for(i=o.length;c=o.charAt(--i);s[i]=m[c]||(c<' '?'\\\\u00'+((a=c.charCodeAt())|4)+(a%16).toString(16):c));return'\"'+s.join('')+'\"';case'[object Array]':for(i=o.length;i--;s[i]=json_encode(o[i]));return'['+s.join(',')+']';case'[object Object]':for(i in o)o.hasOwnProperty(i)&&s.push(json_encode(i)+':'+json_encode(o[i]));return'{'+s.join(',')+'}';case'[object Date]':return'\"'+o.toISOString()+'\"'}return''+o}}");

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


	/** Date.now
	// ECMA-262 5th edition, FF3, Chrome 5, IE9, Opera 10.5, Safari 4
	// When using now to create timestamps or unique IDs, keep in mind that the resolution may be 15 milliseconds on Windows (see bug 363258 ), so you could end up with several equal values if now is called multiple times within a short time span.
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
	"now" in Date || no.push("Date.now=function(){return +new Date()}");
	//*/

	//** Date format
	D.format = function(mask) {
		var t=this, g="get", mask=D.format.masks[mask]||mask||D.format.masks["default"];
		if (mask.substr(0,4) === "UTC:") { mask=mask.substr(4); g="getUTC" }
		return mask.replace(/(\")([^\"]*)\"|\'([^\']*)\'|(yy(yy)?|m{1,4}|d{1,4}|([HhMsS])\6?|[uUaAZ])/g,
			function(a, b, c) {
				switch (a) {
					case "yy"   : return (""+t[g+"FullYear"]()).substr(2);
					case "yyyy" : return t[g+"FullYear"]();
					case "m"    : return t[g+"Month"]()+1;
					case "mm"   : return p2(t[g+"Month"]()+1);
					case "mmm"  : return D.monthNames[ t[g+"Month"]() ];
					case "mmmm" : return D.monthNames[ t[g+"Month"]()+12 ];
					case "d"    : return t[g+"Date"]();
					case "dd"   : return p2(t[g+"Date"]());
					case "ddd"  : return D.dayNames[ t[g+"Day"]() ];
					case "dddd" : return D.dayNames[ t[g+"Day"]()+7 ];
					case "h"    : return t[g+"Hours"]()%12||12;
					case "hh"   : return p2(t[g+"Hours"]()%12||12);
					case "H"    : return t[g+"Hours"]();
					case "HH"   : return p2(t[g+"Hours"]());
					case "M"    : return t[g+"Minutes"]();
					case "MM"   : return p2(t[g+"Minutes"]());
					case "s"    : return t[g+"Seconds"]();
					case "ss"   : return p2(t[g+"Seconds"]());
					case "S"    : return t[g+"Milliseconds"]();
					case "SS"   : return p3(t[g+"Milliseconds"]());
					case "u"    : return (t/1000)>>>0;
					case "U"    : return +t;
					case "a"    : return t[g+"Hours"]() > 11 ? "pm" : "am";
					case "A"    : return t[g+"Hours"]() > 11 ? "PM" : "AM";
					case "Z"    : return "GMT " + (-t.getTimezoneOffset()/60);
				}
				return b ? c : a;
			}
		)
	}

	D.format.masks = {"default":"ddd mmm dd yyyy HH:MM:ss","isoUtcDateTime":'UTC:yyyy-mm-dd"T"HH:MM:ss"Z"'};
	D.monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December".split(" ");
	D.dayNames = "Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ");

	"toISOString" in D || no.push("D.toISOString=function(){return this.format('isoUtcDateTime')}");
	/*/
	"toISOString" in D || no.push("D.toISOString=function(){var t=this;return t.getUTCFullYear()+'-'+p2(t.getUTCMonth()+1)+'-'+p2(t.getUTCDate())+'T'+p2(t.getUTCHours())+':'+p2(t.getUTCMinutes())+':'+p2(t.getUTCSeconds())+'.'+p3(t.getUTCMilliseconds())+'Z'}")
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
		, d2.format("UTC:h:MM A")
		, "1:46 AM"
		, d2.format("yy A")
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


	no.length && eval(no.join(";"));




	//** Event handling

	var Event = w.Event || (w.Event={})
	  , fn_id = 0
	  , kbMaps = []

	function cacheEvent(el, type, fn, fix_fn) {
		var _e = el._e || (el._e={});
		type in _e || (_e[type]={});
		/*
		var hash = {};
		hash[fn] = 1;
		JavaScript converts fn to a string via .toString(), we use unique id instead of fn source as a key.
		*/
		return (_e[type][ fn._fn_id || (fn._fn_id = ++fn_id) ] = type === "mousewheel" ? function(e) {
				e || (e = w.event);
				var delta = "wheelDelta" in e ? e.wheelDelta/120 : -e.detail/3;
				delta != 0 && fn.call(el, e, delta);
			} 
			: fix_fn
		);
	};

	function uncacheEvent(el, type, fn) {
		var _e = el._e||{};
		if (type in _e && "_fn_id" in fn && fn._fn_id in _e[type]) {
			var _fn = _e[type][fn._fn_id];
			delete _e[type][fn._fn_id];
			return _fn;
		};
		return fn;
	};

	// The addEventListener method is supported in Internet Explorer from version 9.
	if ("addEventListener" in w) {
		Event.add = function(el, ev, fn) {
			var _fn = cacheEvent(el, ev, fn, fn);
			ev === "mousewheel" && el.addEventListener("DOMMouseScroll", _fn, false);
			el.addEventListener(ev, _fn, false);
			return Event;
		}
		Event.remove = function(el, ev, fn) {
			var _fn = uncacheEvent(el, ev, fn);
			ev === "mousewheel" && el.removeEventListener("DOMMouseScroll", _fn, false);
			el.removeEventListener(ev, _fn, false);
			return Event;
		}
	} else {
		Event.add = function(el, ev, fn) {
			// In IE the event handling function is referenced, not copied, so 
			// the this keyword always refers to the window and is completely useless.
			el.attachEvent("on"+ev, cacheEvent(el, ev, fn, function(){fn.call(el,w.event)}) );
			return Event;
		}
		Event.remove = function(el, ev, fn) {
			el.detachEvent("on"+ev, uncacheEvent(el, ev, fn) );
			return Event;
		}
	};
	Event.stop = function(e) {
		"stopPropagation" in e && e.stopPropagation();
		"preventDefault" in e && e.preventDefault();
		e.cancelBubble = e.cancel = true;
		return e.returnValue = false;
	};

	Event.removeAll = function(el, ev) {
		var _e = el._e||{};
		for (var t in _e) if (_e.hasOwnProperty(t) && (!ev || ev == t)) {
			var fnList = _e[t];
			for (var fn in fnList) if (fnList.hasOwnProperty(fn)) Event.remove(el, t, fn);
			delete _e[t];
		}
	};


	// http://www.softcomplex.com/docs/get_window_size_and_scrollbar_position.html

	Event.pointerX = function(e) {
		if ("changedTouches" in e) e = e.changedTouches[0];
		return e.pageX || e.clientX + d.body.scrollLeft || 0;
	};
	Event.pointerY = function(e) {
		if ("changedTouches" in e) e = e.changedTouches[0];
		return e.pageY || e.clientY + d.body.scrollTop || 0;
	};
	Event.pointer = function(e) {
		var x = Event.pointerX(e), y = Event.pointerY(e);
		return { x: x, y: y, left: x, top: y };
	};

	function keyup(e) {
		var key = e.keyCode || e.which
		  , map = kbMaps[0];

		if ( key in map ) map[key](key);
		else if ( "num" in map && key > 47 && key < 58) map.num(key-48);
		else if ( "all" in map ) map.all(key);
		else {
			var i = 0;
			while ("bubble" in map && (map = kbMaps[++i])) {
				if ( key in map ) map[key](key);
				else if ( "all" in map ) map.all(key);
			}
		}
	}

	Event.setKeyMap = function(map) {
		kbMaps.unshift(map);
		kbMaps.length == 1 && Event.add(document, "keyup", keyup);
	}
	Event.removeKeyMap = function(map) {
		if (kbMaps.length > 0) {
			var index = kbMaps.indexOf(map);
			kbMaps.splice( index == -1 ? 0 : index, 1);
			kbMaps.length == 0 && Event.remove(document, "keyup", keyup);
		}
	}
	//*/


	//** Touch as mouse

	function touchHandler(e) {
		Event.stop(e);
		var touch = e.changedTouches[0], ev = d.createEvent("MouseEvent");
		ev.initMouseEvent(
			e.type.replace("touch", "mouse").replace("start", "down").replace("end", "up"),
			true, true, window, 1, 
			touch.screenX, touch.screenY, touch.clientX, touch.clientY,
			false, false, false, false, 0/*left*/, null);
		touch.target.dispatchEvent(ev);
	};
	
	function touchStart(e) {
		if(e.touches.length == 1) {
			Event.add(d, "touchend", touchEnd)
				.add(d, "touchcancel", touchEnd)
				.add(d, "touchmove", touchHandler);
			touchHandler(e);
		}
	};
 
	function touchEnd(e) {
		Event.remove(d, "touchend", touchEnd)
			.remove(d, "touchcancel", touchEnd)
			.remove(d, "touchmove", touchHandler);
		touchHandler(e);
	};

	Event.touch_as_mouse = function(el) {
		Event.add(el, "touchstart", touchStart);
	};
	//*/



	//** Page builder

	var elCache = {}
	  , fnCache = {}
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

	function _append(el, before) {
		// instanceof not implemented in IE 5 MAC
		// if ( O.toString.call(el) === "[object Array]" ) {
		// obj.constructor == Array
		var t = this, i = 0;
		if (el) {
			if ( el instanceof Array ) {
				var len = el.length;
				if ("createDocumentFragment" in d) {
					var frag = d.createDocumentFragment();
					for(; i<len; _append.call(frag, el[i++]));
					t.append(frag, before);
				} else {
					/* document.createDocumentFragment is unsupported in IE5.5 */
					for(; i<len; t.append(el[i++], before));
				}
			} else {
				// if (typeof(el) === "string" || typeof(el) === "number")
				if ("string" === (i = typeof(el)) || i === "number") el = d.createTextNode(el);
				before && t.insertBefore(el,(before===true?t.firstChild:before)) || t.appendChild(el);
				"append_hook" in el && el.append_hook();
			}
		}
		return t;
	}

	function _after(el, before) {
		_append.call(el.parentNode, this, before ? el : el.nextSibling);
		return this;
	}

	function _to(el) {
		_append.call(el, this);
		return this;
	}

	function _hasClass(name) {
		return (" "+this.className+" ").indexOf(" "+name+" ") > -1;
	}

	function _addClass(name) {
		var t = this, c = t.className || "";
		if (name) {
			if (c == "") t.className = name;
			else if (!t.hasClass(name)) t.className = c+" "+name;
			//else name.replace(/\w+/g, function(n){if(!t.hasClass(n))t.className=c+" "+n});
		}
		return t;
	}

	function _rmClass(name) {
		var t = this;
		t.className = (" "+t.className+" ").replace(" "+name+" "," ").trim();
		//t.className = (" "+t.className+" ").replace(new RegExp(" ("+name.replace(" ","|")+") ", "g")," ").trim();
		return t;
	}

	function _toggleClass(name, status) {
		var t = this;
		if ( (status===void 0 && !t.hasClass(name)) || status ) {
			t.addClass(name);
			return true;
		}
		t.rmClass(name);
		return false;
	}

	function _empty() {
		var t = this;
		while (t.firstChild) _kill.call(t.firstChild);
		return t;
	}

	function _kill() {
		var t = _empty.call(this);
		t.parentNode && t.parentNode.removeChild(t);
		Event.removeAll(t);
		"kill_hook" in t && t.kill_hook();
		return t;
	}

	/*
	Browser proprietary CSS extensions and DOM node prefixes

	Browser       CSS extension prefix	 DOM style extension prefix
	Firefox             -moz-            Moz
	Safari/Chrome       -webkit-         Webkit
	Opera               -o-              O
	Internet Explorer   -ms-             None: lower case initial
	*/

	var vendors = "webkit Moz khtml o ms".split(" "), vendor_dom = "", vendor_css = "";
	for (var i=0, pref; pref = vendors[i++];) if (pref+"Opacity" in de.style) {
		vendor_dom = pref+"-";
		vendor_css = "-" + vendor_dom.toLowerCase();
		break;
	}

	function _css(atr, val, vendor) {
		var t = this;
		if (typeof(atr)=="object") {
			for (var a in atr) atr.hasOwnProperty(a) && t.css(a, atr[a], vendor);
		} else if (val) {
			if (atr == 'float') atr = 'cssFloat'
			try{
				if (vendor) t.style[ (vendor_dom + atr).camelCase() ] = val.replace("-vendor-",vendor_css);
				else t.style[ atr.camelCase() ] = val;
			}catch(e){
				if (val.indexOf('rgba')>-1) t.css(atr, val.repalce('rgba','rgb'), vendor);
			}
		} else getStyle(t,atr);
		return t;
	}

	function _on(type, fn, set) {
		var t = this, a = (set === false) ? "remove" : "add";
		type.replace(/\w+/g,function(w){Event[a](t, w, fn)})
		return t;
	}

	function _set(args) {
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
								val = t.innerHTML.replace(/\{(\w+)\}/g, function(_, i){return val[i]});
							}
						case "innerHTML":
							t.innerHTML = val || "";
							break;
						case "style":
							t.css(val);
							break;
						case "class":
						case "className":
							t.addClass(val);
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

	function _extend(e) {
		e.append = _append;
		e.to = _to;
		e.after = _after;
		e.addClass = _addClass;
		e.removeClass = e.rmClass = _rmClass;
		e.toggleClass = _toggleClass;
		e.hasClass = _hasClass;
		e.css = _css;
		e.empty = _empty;
		e.kill = _kill;
		e.on = _on;
		e.set = _set;
		return e;
	}
	
	if ("HTMLElement" in w) _extend( HTMLElement[P] );
	else if ("Element" in w) _extend( Element[P] ); // for IE8
	else {
		// for IE 6-7
		var c = d.createElement;
		d.createElement = function(name) {
			return _extend(c(name));
		}
	}


	w.El = function(n/*ame*/, args, parent, before) {
		var pre = {};
		n = n.replace(/([.#:])(\w+)/g, function(_, a, s) {
			pre[ a == "." && (a = "class", (a in pre && (s = pre[a]+" "+s)), a) || a == "#" && "id" || s ] = s;
			return "";
		}) || "div";

		var el = (elCache[n] || (elCache[n] = d.createElement(n))).cloneNode(true).set(pre).set(args);

		n in fnCache && fnCache[n](el, args);

		parent && w.El.get(parent).append(el, before);
		
		return el;
	}

	w.El.get = function(el) {
		if (typeof(el) === "string") el = d.getElementById(el);
		return "append" in el ? el : _extend(el);
	}

	w.El.cache = function(n, el, custom) {
		elCache[n] = el;
		custom && (fnCache[n]=custom);
	}
	w.El.css_supported = function(name) {
		return name in de.style || (vendor_dom+name).camelCase() in de.style;
	}
	
	/** Tests for El
	!function(){
		var test_el = new TestCase("El");

		var el = El("div");
		var h1 = El("h1");
		var h2 = El("h2");
		var h3 = El("h3");
		var h4 = El("h4");

		el.append(h2);
		test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.append");
		el.append(h4, true);
		test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h4></h4><h2></h2>", "El.append");
		h4.kill();
		test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.kill");
		h1.after(h2, true);
		test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2>", "El.after");
		h3.after(h2);
		test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h1></h1><h2></h2><h3></h3>", "El.after");
		el.empty();
		test_el.compare(el.innerHTML.toLowerCase(), "", "El.empty");
		el.append([h3,h4])
		test_el.compare(el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,""), "<h3></h3><h4></h4>", "El.append array");

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



	//** Function extensions

	// Run function once and return cached value or cached instance
	F.cache = function(instance) {
		var t = this, c = {}, f = function() {
			var a = arguments, l = a.length, i = instance || this instanceof f, k = i + ":" + l + ":" + A.join.call(a);
			return k in c ? c[k] : (c[k] = i ? l ? eval("new t(a["+Object.keys(slice.call(a)).join("],a[")+"])") : new t() : t.apply(t, a));
		}
		f.origin = t;
		f.cached = c;
		return f;
	}

	F.extend = function() {
		var t = function(){}, Fn, i = 0, e;
		t[P] = this[P];
		eval("Fn="+this.toString());
		Fn[P] = new t();
		Fn[P]._sup = t[P];
		while (e = arguments[i++]) for (t in e) if (e.hasOwnProperty(t)) Fn[P][t] = e[t];
		return Fn;
	}

	//function b(){
	//	if (!(this instanceof b)) return b.apply( new b(), arguments );
	//	if (!(this instanceof b)) return new b();
	//	return this;
	//}

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
		  , Fn4 = Fn3.extend({init:function(){this._sup._sup.init.call(this);},f:1})
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
	F.rate = function(ms, last_call) {
		var t = this, s, args, next = 0;
		return function() {
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

	//*/




	//** String extensions

	S.format = function() {
		var a = arguments;
		return this.replace(/\{(\d+)\}/g, function(_, i){return a[i]});
	}

  S.utf8_encode = function() {
    return unescape( encodeURIComponent( this ) );
  }

  S.utf8_decode = function() {
    return decodeURIComponent( escape( this ) );
  }

  S.safe = function() {
  	return this
  		.replace(/&/g, "&amp;")
  		.replace(/</g, "&lt;")
  		.replace(/>/g, "&gt;")
  		.replace(/\"/g, "&quot;");
	}

	S.camelCase = function() {
		return this.replace(/[ _-]+([a-z])/g,function(_, a){return a.toUpperCase()});
	}

  S.toAccuracy = N.toAccuracy = function(a) {
    var x = (""+a).split("."), n = ~~((this/a)+.5) * a;
    return ""+(1 in x ? n.toFixed(x[1].length) : n);
  }

  S.ip2int = function() {
  	var t = (this+".0.0.0").split(".");
  	return ((t[0] << 24) | (t[1] << 16) | (t[2] << 8 ) | (t[3]))>>>0;
  }

  S.int2ip = N.int2ip = function() {
  	var t = this;
  	return [t>>>24, (t>>>16)&0xFF, (t>>>8)&0xFF, t&0xFF].join(".");
  }

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



	//** Date helpers
	S.date = N.date = function(format) {
		var t = this, d = new Date(), m, n = Number(t) || Date.parse(t) || ""+t;
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

	D.daysInMonth = function() {
		//return 32-new Date(this.getFullYear(),this.getMonth(),32).getDate();
		return (new Date(this.getFullYear(),this.getMonth()+1,0)).getDate();
	}

	D.startOfWeek = function() {
		var t = this;
		return new Date(t.getFullYear(), t.getMonth(), t.getDate() - (t.getDay() || 7) +1);
	}

	//*/



	//** convert dates to human-readable

	D.prettySteps = [8640000, 2592000, 604800, 86400, 3600,   60,       1];
	D.prettyUnits = [         "month", "week", "day", "hour", "minute", "second"];
	
	D.prettyStrings={"default":"{0} {1} ago", "day":"Yesterday"};

	D.pretty = function(format, custom) {
		var d = ((new Date()) - this) / 1000
		  , a = D.prettySteps
		  , i = a.length;

		if (d<a[0]) {
			while(d>a[--i]);d/=a[i+1];
			return ((a=custom||D.prettyStrings)[(i=D.prettyUnits[i]+(d<2?"":"s"))]||a["default"]).format(d|0, i);
		}
		return this.format(format);
	}

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



	//** CommonJS style module loader
	var _required = {}
	w.require = function(file) {
		if (file in _required) return _required[file];
		var req = new XMLHttpRequest(), exports = {};
		req.open("GET", file.replace(/^[^\/]/, w.require.path+"$&"), false);
		req.send();
		eval(req.responseText);
		return _required[file] = exports;
	}
	//*/


	//** async loader
	w.load = function(files, cb) {
		files instanceof Array || (files=[files]);
		var i=0, loaded=0, len=files.length, res = [];
		while (i<len) !function(req, i) {
			req.open("GET", files[i].replace(/^[^\/]/, w.load.path+"$&"), true);
			req.onreadystatechange = function() {
				if (req.readyState === 4) {
					res[i] = req.responseText || ";";
					//for (var str,e="";str=res[loaded];++loaded){e+=str};
					//e && execScript(e);
					if (++loaded == len ) {
						execScript( res.join(";") );
						cb && cb();
						res = null;
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
	Event.add(w, "load", function(){ execScript(no.innerHTML); });

}(window, document, "prototype");






