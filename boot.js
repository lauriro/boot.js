


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
	  , de = d.documentElement
	  , slice = A.slice
	  , no = []
	  , a = "XMLHttpRequest"; // Reusable

	/*@cc_on
		// HTML5 elements suport for IE should be in head before stylesheets
		// "address article aside canvas details figcaption figure footer header hgroup menu nav section summary command datalist mark meter time wbr".replace(/\w+/g, function(t){d.createElement(t)});

		// XMLHttpRequest was unsupported in IE 5.x-6.x + remove background image flickers on hover
		a in w || no.push("w."+a+"=function(){function a(n){n='Msxml2.XMLHTTP'+n;try{w."+a+"=function x(){return new ActiveXObject(n)};return new x}catch(e){}}return a('.6.0')||a('')};try{d.execCommand('BackgroundImageCache',false,true)}catch(e){}");
	@*/


	/** hasOwnProperty
	// hasOwnProperty was unsupported in Safari/WebKit until 2.0.2
	"hasOwnProperty" in O || no.push("O.hasOwnProperty=function(n){try{var p=this.constructor;while(p=p[P])if(p[n]===this[n])return false}catch(e){}return true}");
	//*/

	// eval in a global context for non-IE & Chrome
	"execScript" in w || no.push("w.execScript=function(s){!function(){w.eval.call(w,s)}()}");


	/* ECMAScript 5 stuff */

	"trim" in S || no.push("S.trim=function(){return this.replace(/^[\\s\\r\\n\\u2028\\u2029]+|[\\s\\r\\n\\u2028\\u2029]+$/g,'')}");

	a = "=function(f,s){var t=this,l=t.length,";

	"filter"      in A || no.push("A.filter"     +a+"i=-1,a=[];while(++i<l)if(i in t&&f.call(s,t[i],i,t))a.push(t[i]);return a}");
	"forEach"     in A || no.push("A.forEach"    +a+"i=-1;while(++i<l)if(i in t)f.call(s,t[i],i,t)}");
	"indexOf"     in A || no.push("A.indexOf"    +a+"i=(s|0)-1;while(++i<l)if(t[i]===f)return i;return -1}");
	"lastIndexOf" in A || no.push("A.lastIndexOf"+a+"i=(s|0)||l;i>--l&&(i=l)||i<0&&(i+=l);++i;while(--i>-1)if(t[i]===f)return i;return -1}");
	"map"         in A || no.push("A.map"        +a+"a=[];while(l--)a[l]=f.call(s,t[l],l,t);return a}");
	"reduce"      in A || no.push("A.reduce"     +a+"i=0,a=arguments.length<2?t[i++]:s;while(i<l)a=f.call(null,a,t[i],i++,t);return a}");

	"isArray" in Array || no.push("Array.isArray=function(a){return O.toString.call(a)=='[object Array]'}");

	// Non-standard
	no.push("A.remove"+a+"a=slice.call(arguments);while(l--)if(a.indexOf(t[l])>-1)t.splice(l,1);return t}");
	no.push("A.indexFor"+a+"i=s?0:l,m;while(i<l)s(f,t[m=(i+l)>>1])<0?l=m:i=m+1;return i}");
	Array.from=function(l){for(var a=[],i=l.length;i--;a.unshift(l[i]));return a}
	/*
	Array.flatten = function(arr){
		for(var i=arr.length;i--;)
			Array.isArray(arr[i]) && A.splice.apply(arr, [i, 1].concat(Array.flatten(arr[i])));
		return arr
	};
	flat([1,2,[3,4,[5,6]],7]);
	*/

	"bind" in F || no.push("F.bind=function(t){var f=this,a=slice.call(arguments,1);return function(){return f.apply(t,a.concat(slice.call(arguments)))}}");

	/** hasOwnProperty
	a = "o.hasOwnProperty(i)&&";
	/*/
	a = "";
	//*/
	
	"keys" in Object || no.push("Object.keys=function(o){var a=[],i;for(i in o)o.hasOwnProperty(i)&&a.push(i);return a}");
	//"create" in Object || no.push("Object.create=function(o){function f(){};f[P]=o;return new f()}");
	
	"JSON" in w || no.push("w.JSON={parse:function(t){return eval('('+t+')')},stringify:function j_enc(o){if(o==null)return'null';if(o instanceof Date)return'\"'+o.toISOString()+'\"';var i,s=[],c;if(Array.isArray(o)){for(i=o.length;i--;s[i]=j_enc(o[i]));return'['+s.join(',')+']';}c=typeof o;if(c=='string'){for(i=o.length;c=o.charAt(--i);s[i]=jsonMap[c]||(c<' '?'\\\\u00'+((c=c.charCodeAt())|4)+(c%16).toString(16):c));return'\"'+s.join('')+'\"';}if(c=='object'){for(i in o)"+a+"s.push(j_enc(i)+':'+j_enc(o[i]));return'{'+s.join(',')+'}';}return''+o}}");
	

	/** Date.now
	// ECMA-262 5th edition, FF3, Chrome 5, IE9, Opera 10.5, Safari 4
	// When using now to create timestamps or unique IDs, keep in mind that 
	// the resolution may be 15 milliseconds on Windows (see bug 363258 ), 
	// so you could end up with several equal values if now is called multiple 
	// times within a short time span.
	// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/now
	"now" in Date || no.push("Date.now=function(){return +new Date()}");
	//*/


	//** Date.format

	D.format = function(m/*ask */) {
		var t = this
		  , m = D.format.masks[m]||m||D.format.masks["default"]
		  , g = "get" + (m.substr(0,4) == "UTC:" ? (m=m.substr(4), "UTC"):"")
		return m.replace(/(\")([^\"]*)\"|\'([^\']*)\'|(yy(yy)?|m{1,4}|d{1,4}|([HhMsS])\6?|[uUaAZ])/g,
			function(a, b, c) {
				return a == "yy"   ? (""+t[g+"FullYear"]()).substr(2)
				     : a == "yyyy" ? t[g+"FullYear"]()
				     : a == "m"    ? t[g+"Month"]()+1
				     : a == "mm"   ? p2(t[g+"Month"]()+1)
				     : a == "mmm"  ? D.monthNames[ t[g+"Month"]() ]
				     : a == "mmmm" ? D.monthNames[ t[g+"Month"]()+12 ]
				     : a == "d"    ? t[g+"Date"]()
				     : a == "dd"   ? p2(t[g+"Date"]())
				     : a == "ddd"  ? D.dayNames[ t[g+"Day"]() ]
				     : a == "dddd" ? D.dayNames[ t[g+"Day"]()+7 ]
				     : a == "h"    ? (""+t[g+"Hours"]()%12||12)
				     : a == "hh"   ? p2(t[g+"Hours"]()%12||12)
				     : a == "H"    ? t[g+"Hours"]()
				     : a == "HH"   ? p2(t[g+"Hours"]())
				     : a == "M"    ? t[g+"Minutes"]()
				     : a == "MM"   ? p2(t[g+"Minutes"]())
				     : a == "s"    ? t[g+"Seconds"]()
				     : a == "ss"   ? p2(t[g+"Seconds"]())
				     : a == "S"    ? t[g+"Milliseconds"]()
				     : a == "SS"   ? p3(t[g+"Milliseconds"]())
				     : a == "u"    ? (""+(t/1000)>>>0)
				     : a == "U"    ? +t
				     : a == "a"    ? (t[g+"Hours"]() > 11 ? "pm" : "am")
				     : a == "A"    ? (t[g+"Hours"]() > 11 ? "PM" : "AM")
				     : a == "Z"    ? "GMT " + (-t.getTimezoneOffset()/60)
				     : b           ? c
				     : a;
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
		return this.format(format);
	}
	//*/


	no.length && eval(no.join(";"));


	//** Function extensions

	// Run function once and return cached value or cached instance
	F.cache = function(instance) {
		var t = this, c = {}, f = function() {
			var a = arguments, l = a.length, i = !!instance || this instanceof f, k = i + ":" + l + ":" + A.join.call(a);
			return k in c ? c[k] : (c[k] = i ? l ? eval("new t(a["+Object.keys(slice.call(a)).join("],a[")+"])") : new t() : t.apply(t, a));
		}
		f.origin = t;
		f.cached = c;
		return f;
	}

	F.extend = function() {
		var t = function(){}, Fn, i = 0, e;
		eval("Fn="+this.toString());
		t[P] = this[P];
		Fn[P] = new t();
		while (e = arguments[i++]) for (t in e) 
		/** hasOwnProperty
		if (e.hasOwnProperty(t)) 
		//*/
			Fn[P][t] = e[t];
		return Fn;
	}

	F.byWords = function(i) {
		var t = this;
		i |= 0;
		return function() {
			var s = this, a = arguments, r;
			a[i].replace(/\w+/g,function(w){a[i]=w;r=t.apply(s, a)});
			return r;
		}
	}

	//function b(){
	//	if (!(this instanceof b)) return b.apply( new b(), arguments );
	//	if (!(this instanceof b)) return new b();
	//	return this;
	//}


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






	//** Event handling
	//TODO:sync with Fn.Events

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
		return (_e[type][ fn._fn_id || (fn._fn_id = ++fn_id) ] = type == "mousewheel" ? function(e) {
				if (!e) e = w.event;
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
			ev == "mousewheel" && el.addEventListener("DOMMouseScroll", _fn, false);
			el.addEventListener(ev, _fn, false);
			return Event;
		}
		Event.remove = function(el, ev, fn) {
			var _fn = uncacheEvent(el, ev, fn);
			ev == "mousewheel" && el.removeEventListener("DOMMouseScroll", _fn, false);
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
		for (var t in _e)
		/** hasOwnProperty
		if (_e.hasOwnProperty(t))
		//*/
		if (!ev || ev == t) {
			var fnList = _e[t];
			for (var fn in fnList)
			/** hasOwnProperty
			if (fnList.hasOwnProperty(fn))
			//*/

			Event.remove(el, t, fnList[fn]);
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
	    		if (a == "opacity") {
	    			var opacity = el.filters("alpha").opacity;
	    			return isNaN(opacity) ? 1 : (opacity?opacity/100:0);
	    		}
	    		a = a.camelCase();
	    		return el.style[a]||el.currentStyle[a]||null;
	    	}
	    )



	function El(n/*ame */, a/*rgs */) {
		var pre = {};
		n = n.replace(/([.#:])(\w+)/g, function(_, o, s) {
			pre[ o == "." ? (o = "class", (o in pre && (s = pre[o]+" "+s)), o) : o == "#" ? "id" : s ] = s;
			return "";
		}) || "div";

		var el = (elCache[n] || (elCache[n] = d.createElement(n))).cloneNode(true).set(pre);

		return n in fnCache && fnCache[n](el, a) || el.set(a);
	}

	function extend(e,p,k){
		if(e){
			if(!p)p=El[P];
			for(k in p)e[k]=p[k];
		}
		return e;
	}

	El.get = function(el) {
		if (typeof el == "string") el = d.getElementById(el);
		return "to" in el ? el : extend(el);
	}

	El.cache = function(n, el, custom) {
		elCache[n] = typeof el == "string" ? El(el) : el;
		if (custom) {
			fnCache[n] = custom;
		}
	}
	El.cache.el = elCache;
	El.cache.fn = fnCache;
	El.css_supported = function(name) {
		return name in de.style || (vendor_dom+name).camelCase() in de.style;
	}

		/*
		Browser proprietary CSS extensions and DOM node prefixes

		Browser       CSS extension prefix	 DOM style extension prefix
		Firefox             -moz-            Moz
		Safari/Chrome       -webkit-         Webkit
		Opera               -o-              O
		Internet Explorer   -ms-             None: lower case initial
		*/

		var vendor, vendors = ["webkit","Moz","khtml","o","ms"], vendor_dom = "", vendor_css = "";
		while (vendor = vendors.shift()) if (vendor+"Opacity" in de.style) {
			vendor_dom = vendor+"-";
			vendor_css = "-" + vendor_dom.toLowerCase();
			break;
		}

	a = {
		append: function(el, b/*efore*/) {
			var t = this;
			if (el) {
				if (typeof el == "string" || typeof el == "number") el = d.createTextNode(el);
				else if ( !("nodeType" in el) && "length" in el ) {
					// document.createDocumentFragment is unsupported in IE5.5
					var len = el.length, i = 0, f = "createDocumentFragment" in d ? d.createDocumentFragment() : El("div");
					while (i<len) t.append.call(f, el[i++]);
					el = f;
				}

				if ("nodeType" in el) b ? t.insertBefore(el, b===true ? t.firstChild : b) : t.appendChild(el);
				//else "to" in el && el.to(t, b);
				"append_hook" in el && el.append_hook();
				//"child_hook" in t && t.child_hook();
			}
			return t;
		},

		after: function(el, before) {
			var t = this;
			t.append.call(el.parentNode, t, before ? el : el.nextSibling);
			return t;
		},

		to: function(el, before) {
			var t = this;
			t.append.call(el, t, before);
			return t;
		},

		hasClass: function(name) {
			return (" "+this.className+" ").indexOf(" "+name+" ") > -1;
		},

		addClass: function(name) {
			var t = this, c = t.className;
			if (name) {
				if (c == "") t.className = name;
				else if (!t.hasClass(name)) t.className = c+" "+name;
				//else name.replace(/\w+/g, function(n){if(!t.hasClass(n))t.className=c+" "+n});
			}
			return t;
		},

		rmClass: function(name) {
			var t = this;
			t.className = (" "+t.className+" ").replace(" "+name+" "," ").trim();
			//t.className = (" "+t.className+" ").replace(new RegExp(" ("+name.replace(" ","|")+") ", "g")," ").trim();
			return t;
		},

		toggleClass: function(name, status) {
			var t = this;
			//if ( (arguments.length == 1 && !t.hasClass(name)) || status ) {
			if ( (status===void 0 && !t.hasClass(name)) || status ) {
				t.addClass(name);
				return true;
			}
			t.rmClass(name);
			return false;
		},

		empty: function _empty() {
			var t = this, n;
			while (n = t.firstChild) t.kill.call(n);
			return t;
		},

		kill: function() {
			var t = this;
			if (t.parentNode) t.parentNode.removeChild(t);
			Event.removeAll(t);
			if ("empty" in t) t.empty();
			if ("kill_hook" in t) t.kill_hook();
			return t;
		},

		css: function(atr, val, vendor) {
			var t = this;
			if (typeof atr == "object") {
				for (var a in atr)
				/** hasOwnProperty
				if (atr.hasOwnProperty(a))
				//*/
				t.css(a, atr[a], vendor);
			} else if (val) {
				if (atr == 'float') atr = 'cssFloat'
				try{
					if (vendor) t.style[ (vendor_dom + atr).camelCase() ] = val.replace("-vendor-",vendor_css);
					else t.style[ atr.camelCase() ] = val;
				}catch(e){
					/*
					In most cases you don't need to use the rgba classes, as browsers can do the fallback naturally:
					.my_container {
						background-color: #ccc;
						background-color: rgba(255,255,255, .5);
					}
					*/
					if (val.indexOf('rgba')>-1) t.css(atr, val.repalce('rgba','rgb'), vendor);
				}
			} else getStyle(t,atr);
			return t;
		},

		on: function(type, fn, set) {
			var t = this, a = (set === false) ? "remove" : "add";
			type.replace(/\w+/g,function(w){Event[a](t, w, fn)})
			return t;
		},

		set: function(args) {
			var t = this, k, v;
			if (args) {
				if (typeof args == "string" || "nodeType" in args || "length" in args) t.append(args);
				else for (k in args) 
				/** hasOwnProperty
				if (args.hasOwnProperty(arg)) 
				//*/
				{
					v = args[k];
					if (k == "class" || k == "className") t.addClass(v);
					else if (k == "append") t.append(v);
					else if (typeof v == "string") t.setAttribute(k, v);
					else if (!v) t.removeAttribute(k);
					else t[k] = v;
				}
			}
			return t;
		}
	}

	if (!(El[P] = extend( (w.HTMLElement || w.Element || {})[P] , a))) {
		// for IE 6-7, IE8 supports Element
		El[P] = a;
		var c = d.createElement
		  //, g = d.getElementById

		extend(d.body);
	
		d.createElement = function(n/*ame */) {return extend(c(n))}
		//d.getElementById = function(i){var e=g(i);return "append"in e ? e : extend(e)}
	}

	w.El = El;
	 




	a = d.getElementsByTagName("script");
	a = a[a.length-1].src.replace(/[^\/]+$/,"");

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
	w.require.path = a;
	//*/


	//** async loader
	w.load = function(f/*iles */, cb) {
		if (!Array.isArray(f)) f=[f];
		var i=0, len=f.length, res = [];
		while (i<len) !function(req, i) {
			req.open("GET", f[i].replace(/^[^\/]/, w.load.path+"$&"), true);
			req.onreadystatechange = function() {
				if (req.readyState == 4) {
					res[i] = req.responseText;
					//for (var str,e="";str=res[loaded];++loaded){e+=str};
					//e && execScript(e);
					if (!--len) {
						execScript( res.join(";") );
						cb && cb();
						res = null;
					}
				}
			}
			req.send();
		}(new XMLHttpRequest(), i++);
	}
	w.load.path = a;
	//*/

}(window, document, "prototype");







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
	arr.forEach(function(val, key){res.push(val)});

	test.compare(
		res.length, 6
	, res.join(), "1,2,3,4,2,5"
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
	var str = el.innerHTML.toLowerCase().replace(/[\s\t\n\r]+/g,"");
	test_el.compare(
		str == "<h3></h3><h4></h4>" || str == "<div><h3></h3><h4></h4></div>", true, "El.append array");

	el.addClass("test1");
	test_el.compare(el.className, "test1", "El.addClass");

	el.addClass("test2");
	test_el.compare(el.className, "test1 test2");

	el.addClass("test3");
	test_el.compare(el.className, "test1 test2 test3");

	el.addClass("test4");
	test_el.compare(el.className, "test1 test2 test3 test4");

	el.rmClass("test2");
	test_el.compare(el.className, "test1 test3 test4", "El.rmClass");

	el.rmClass("test1");
	test_el.compare(el.className, "test3 test4");

	el.rmClass("test4");
	test_el.compare(el.className, "test3");

	el.rmClass("c4");
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


