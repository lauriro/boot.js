


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



!function(w/* window */, d/* document */, P/* String "prototype" */) {
	//** Event handling
	//TODO:sync with Fn.Events

	var Event = w.Event || (w.Event={})
	, fn_id = 0
	, kbMaps = []
	, S = String[P]
	, rendering  = false;

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
			false, false, false, false, 0, null);
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
	, el_re = /([.#:])([-\w]+)/g
	, El = function(n/*ame */, a/*rgs */) {
		var pre = {};
		n = n.replace(el_re, function(_, o, s) {
			pre[ o == "." ? (o = "class", (o in pre && (s = pre[o]+" "+s)), o) : o == "#" ? "id" : s ] = s;
			return "";
		}) || "div";

		var el = (elCache[n] || (elCache[n] = d.createElement(n))).cloneNode(true).set(pre);

		return n in fnCache && fnCache[n](el, a) || el.set(a);
	}
	, css_map = {"float": "cssFloat"}
	, a = {
		append: function(e, b/*efore*/) {
			var t = this;
			if (e) {
				if (typeof e == "string" || typeof e == "number") e = El.text(e);
				else if ( !("nodeType" in e) && "length" in e ) {
					// document.createDocumentFragment is unsupported in IE5.5
					// f = "createDocumentFragment" in d ? d.createDocumentFragment() : El("div");
					var len = e.length, i = 0, f = d.createDocumentFragment();
					while (i<len) t.append.call(f, e[i++]);
					e = f;
				}

				if ("nodeType" in e) t.insertBefore(e, b ? (b===true ? t.firstChild : typeof b == "number" ? t.childNodes[b] : b) : null)
				"append_hook" in e && e.append_hook();
				//"child_hook" in t && t.child_hook();
			}
			return t;
		},

		after: function(e, b) {
			e.parentNode.append(this, b ? e : e.nextSibling);
			return this;
		},

		to: function(e, b) {
			e.append(this, b);
			return this;
		},

		hasClass: function(n) {
			return (" "+this.className+" ").indexOf(" "+n+" ") > -1;
		},

		addClass: function(n) {
			var t = this;
			t.className += t.className == "" ? n : t.hasClass(n) ? "" : " " + n;
			return t;
		}.byWords(),

		rmClass: function(n) {
			var t = this;
			t.className = (" "+t.className+" ").replace(" "+n+" "," ").trim();
			return t;
		}.byWords(),

		toggleClass: function(n, s) {
			if (s === void 0) s = !this.hasClass(n); // arguments.length == 1
			this[ s ? "addClass" : "rmClass" ](n);
			return s;
		}.byWords(),

		empty: function() {
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

		css: function(atr, val) {
			var t = this;
			if (val) t.style[ (css_map[atr]||atr).camelCase() ] = val;
			else return getStyle(t, atr);
			return t;
		}.byKeyVal(),

		on: function(w, fn) {
			Event.add(this, w, fn);
			return this;
		}.byWords(),

		non: function(w, fn) {
			Event.remove(this, w, fn);
			return this;
		}.byWords(),

		set: function(args) {
			var t = this, k = typeof args, v;
			if (args) {
				if (k == "string" || k == "number" || "nodeType" in args || "length" in args) t.append(args);
				else for (k in args) 
				/** hasOwnProperty
				if (args.hasOwnProperty(arg)) 
				//*/
				{
					v = args[k];
					// there are bug in ie<9 where changed 'name' param not accepted on form submit
					/* cc_on
					if (@_jscript_version < 9 && k == "name") {
						//console.log(t.outerHTML.replace(/<\w+/, '$& name="'+v+'"'))
						t = d.createElement( t.outerHTML.replace(/<\w+/, '$& name="'+v+'"'));
					} else @*/ 
					if (k == "class" || k == "className") t.addClass(v);
					else if (typeof v == "string") t.setAttribute(k, v);
					else if (!v) t.removeAttribute(k);
					else t[k] = v;
				}
			}
			return t;
		},

		find: "querySelector" in d ?
			function(sel){
				// IE8 don't support :disabled
				return this.querySelector(sel);
			} :
			function(sel) {
				var rules = ["_"]
					, tag = sel.replace(el_re, function(_, o, s) {
							rules.push( o == "." ? "(' '+_.className+' ').indexOf(' "+s+" ')>-1" : o == "#" ? "_.id=='"+s+"'" : "_."+s );
							return "";
						}) || "*"
					, fn = rules.join("&&").fn()
					, el
					, els = this.getElementsByTagName(tag)
					, i = 0;

				while (el = els[i++]) if (fn(el)) return "to" in el ? el : extend(el);
			}
	}

	function extend(e,p,k){
		if(e){
			if(!p)p=El[P];
			for(k in p)e[k]=p[k]
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
	El.text = function(str){
		return d.createTextNode(str);
	}

	if (!(El[P] = extend( (w.HTMLElement || w.Element || {})[P] , a))) {
		// for IE 6-7, IE8 supports Element
		El[P] = a;
		var c = d.createElement
		  //, g = d.getElementById

		extend(d.body);
	
		d.createElement = function(n/*ame */) {return extend(c(n))}
		//d.getElementById = function(i){var e=g(i);return "append"in e ? e : extend(e)}
	/*@cc_on
		// remove background image flickers on hover in IE6
		// You can also use CSS
		// html { filter: expression(document.execCommand("BackgroundImageCache", false, true)); }
		try{document.execCommand('BackgroundImageCache',false,true)}catch(e){};
	@*/

	}

	w.El = El;
	//*/





	/*
	function getTextNodesIn(node, includeWhitespaceNodes) {
		var textNodes = [], whitespace = /^\s*$/;

		function getTextNodes(node) {
			if (node.nodeType == 3) {
				if (includeWhitespaceNodes || !whitespace.test(node.nodeValue)) {
					textNodes.push(node);
				}
			} else {
				for (var i = 0, len = node.childNodes.length; i < len; ++i) {
					getTextNodes(node.childNodes[i]);
				}
			}
		}

    getTextNodes(node);
		return textNodes;
	}
	*/


	function custom_init(el, data){
		if (!rendering) {
			/*@cc_on el=El.get(el);@*/
			var template, node = el.firstChild;
			if (template = el.getAttribute("data-template")) {
				El.cache.fn[template].call(el, el, data);
				el.removeAttribute("data-template");
			}
			for (; node; node = node.nextSibling) if (node.nodeType == 1) custom_init(node, data);
		}
	}
	function template(id, parent) {
		var t = this;
		t.id = id;
		t.el = El("div");
		t.el.haml_done = function(){
			var str = t.el.innerHTML
			  , fn = str.indexOf("data-template") > -1 ? custom_init : null;

			if (str.indexOf("{{") < 0 && str.indexOf("{%") < 0 && t.el.childNodes.length == 1){
				El.cache(t.id, t.el.firstChild, fn);
			} else {
				t.fn = El.liquid(str)
				El.cache(t.id, t, t.parse.bind(t));
			}
			return parent;
		//	delete t.el.haml_done;
			
		}
		return t;
	}

	template.prototype = {
		cloneNode: Fn.This,
		set: Fn.This,
		parse: function(el, data) {
			var t = this;
			t.el.innerHTML = t.fn(data);
			custom_init(t.el, data);
/*
			var node, nodes = t.el.getElementsByTagName("*"), i = 0, template, fn = El.cache.fn;
			while (node = nodes[i++]) {
				if (template = node.getAttribute("data-template")) {
					fn[template].call(node, node, data);
					rendering || node.removeAttribute("data-template");
				}
			}
			*/
			/*

			var next, node = t.el, template, fn = El.cache.fn;
			while (node) {
				if (template = node.getAttribute("data-template")) {
					fn[template].call(node, node);
					rendering || node.removeAttribute("data-template");
				}
				while ((next = node.firstChild || node.nextSibling) && next.nodeType != 1);
				if (!next) {
					next = node
					while ((node = node.parentNode) && (next = node.nextSibling) && next.nodeType != 1);
				}
				node = next
			}
			*/

			el = t.el.childNodes;
			return (el.length == 1) ? el[0] : Array.from(el);
		}
	}

	El.liquid = function(str) {
		var s = "var _=[];with(o||{}){_.push('"
		  + str.replace(/\s+/g, " ")
		       .replace(/{{\s*((?:[^}]|}(?!}))+)\s*}}/g, function(_, a) {
		       	 return "',(" + a.replace(/([^|])\|\s*([^|\s:]+)(?:\s*\:([^|]+))?/g, "$1).$2($3") + "),'";
		       })
		       //.replace(/{%\s*for\s(\w+)\sin\s([^}]*?)(?: limit:(\d))?(?: offset:(\d))?\s*%}/g, "');var _1=o.$2||{}, offset=$4+0, limit=$3+0, i=0; if(_1)for(var _2 in _1)if(_1.hasOwnProperty(_2)) {if(offset&&offset--)continue;i++;if(limit&&i>limit)break;var $1=_1[_2];_.push('")
		       .replace(/{%\s*(if|for)?\s*((?:[^%]|%(?!}))+)%}/g, function(_, a, b, m) {
		       	 if (a) {
		       	 	 if (m = b.match(/^(\w+) in (\w+)?/)) {
		       	 	 	 a = "var limit,offset,i=0,w,q="+(m[2]?"o."+m[2]+"||{}":"")+b.slice(m[0].length).replace(/^ (limit|offset):(\d+)/ig, ";$1=$2")+";if(q)for";
		       	 	 	 b = "w in q)if(q.hasOwnProperty(w)){if(offset&&offset--)continue;i++;if(limit&&i>limit)break;var "+m[1]+"=q[w];"
		       	 	 	 m = "";

		       	 	 	 /*

		       	 	 	 a = "var limit,offset,i=0,w,q=";
		       	 	 	 if(m[2])a += "o."+m[2]+"||{}";
		       	 	 	 a += b.slice(m[0].length).replace(/^ (limit|offset):(\d+)/ig, ";$1=$2")+";if(q)for";
		       	 	 	 b = "w in q)if(q.hasOwnProperty(w)){if(offset&&offset--)continue;i++;if(limit&&i>limit)break;var "+m[1]+"=q[w];"
		       	 	 	 m = "";
		       	 	 	 /*

		       	 	 	 a = "";
		       	 	 	 b = b.slice(m[0].length).replace(/^ (limit|offset):(\d+)/ig, function(_,n,v){a+=";"+n+"="+v;return""});
		       	 	 	 a = "var limit,offset,i=0,w,q="+(m[2]?"o."+m[2]+"||{}":b)+a+";if(q)for";
		       	 	 	 b = "w in q)if(q.hasOwnProperty(w)){if(offset&&offset--)continue;i++;if(limit&&i>limit)break;var "+m[1]+"=q[w];"
		       	 	 	 m = "";
		       	 	 	 */
		       	 	 } else m = "){";
		       	 }
		       	 //if (a) return "');"+a+"("+b.replace(/^\s*\(|\)\s*$/g,"")+"){_.push('"
		       	 //return "')};_.push('"
		       	 return (a ? "');"+a+"("+b.replace(/^\(|\)\s*$/g,"")+m :
                     b == "else " ? "')}else{" :
                     "')};") + "_.push('";
		       })
		  + "')}return _.join('')";
		
		//console.log('str',s);
		return new Function("o", s);
	}

	El.haml = function(str) {
		var root = El("div"), i, parent = root, stack = [-1];

		str.replace(/^( *)((?:[.#%][\w:\-]+)+)?(\{.*\})? ?(.*)$/igm, function(all, indent, name, args, text) {
			if (all) {
				var el, m;
				i = indent.length;
				while (i <= stack[0]) {
					stack.shift();
					
					parent = ("haml_done" in parent) ? parent.haml_done() : parent.parentNode;
				}

				if (name) {
					args = args ? JSON.parse(args) : {};
					el = El(name.replace(/^[^%]/,"%div$&").substr(1), args);
					if (text) el.append( text.replace(/'/g,"\\'") );
					if (m = name.match(/^%(\w+)/)) m[1] in fnCache && el.setAttribute("data-template", m[1]);
				} else {
					m = text.split(" ");
					switch (m[1]) {
						case "template":
							el = new template(m[2], parent).el;
						break;
						case "markdown":
							//TODO:2011-11-09:lauriro:Write markdown support for haml
						break;
						default:
							el = El.text( args ? all : text )
					}
				}

				!el.haml_done && parent.append(el);
				if (el.nodeType !== 3) {
					parent = el;
					stack.unshift(i)
				}
			}
			return "";
		});
		//console.log("root",root)
		i = root.childNodes;
		return i.length == 1 ? i[0] : Array.from(i);
	}

	El.render = function(id, data, parent) {
		rendering = true;
		var src = El.get(id);
		new template(id).el.append( El.haml(src.innerHTML) ).haml_done();
		//src.kill();
		rendering = false;

	}


	// Liquid Standard Filters
	/*
		date - reformat a date syntax reference
		capitalize - capitalize words in the input sentence
		downcase - convert an input string to lowercase
		upcase - convert an input string to uppercase
		first - get the first element of the passed in array
		last - get the last element of the passed in array
		join - join elements of the array with certain character between them
		sort - sort elements of the array
		map - map/collect an array on a given property
		size - return the size of an array or string
		escape - escape a string
		escape_once - returns an escaped version of html without affecting existing escaped entities
		strip_html - strip html from string
		strip_newlines - strip all newlines (\n) from string
		newline_to_br - replace each newline (\n) with html break
		replace - replace each occurrence e.g. {{ 'foofoo' | replace:'foo','bar' }} #=> 'barbar'
		replace_first - replace the first occurrence e.g. {{ 'barbar' | replace_first:'bar','foo' }} #=> 'foobar'
		remove - remove each occurrence e.g.{{ 'foobarfoobar' | remove:'foo' }} #=> 'barbar'`
		remove_first - remove the first occurrence e.g. {{ 'barbar' | remove_first:'bar' }} #=> 'bar'
		truncate - truncate a string down to x characters
		truncatewords - truncate a string down to x words
		prepend - prepend a string e.g. {{ 'bar' | prepend:'foo' }} #=> 'foobar'
		append - append a string e.g. {{ 'foo' | append:'bar' }} #=> 'foobar'
		minus - subtraction e.g. {{ 4 | minus:2 }} #=> 2
		plus - addition e.g. {{ '1' | plus:'1' }} #=> '11', {{ 1 | plus:1 }} #=> 2
		times - multiplication e.gw {{ 5 | times:4 }} #=> 20
		divided_by - division e.g. {{ 10 | divided_by:2 }} #=> 5
		split - split a string on a matching pattern e.g. {{ "a~b" | split:~ }} #=> ['a','b']	
	*/
	S.capitalize = function(){
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
	S.upcase = S.toUpperCase;
	S.downcase = S.toLowerCase;
	S.size = function(){
		return this.length;
	}


}(this, document, "prototype");



/** Tests for El
!function(){
	var test_el = new TestCase("El");

	var el = El("div")
	  , select = El("select#id2.cl2:disabled")

	var h1 = El("h1");
	var h2 = El("h2");
	var h3 = El("h3");
	var h4 = El("h4");

	el.append(h2);
	test_el.compare(el.innerHTML.toLowerCase(), "<h2></h2>", "El.append");
	h2.append(select)
	test_el.compare(
	  el.find("#id2"), select
	, el.find(".cl2"), select
	//, el.find("select:disabled"), select
	, el.find("#id2.cl2"), select
	//, el.find("#id2.cl2:disabled"), select
	//, el.find("select#id2.cl2:disabled"), select
	, el.find("select#id2.cl2"), select
	, el.find("select#id2"), select
	, el.find("select"), select
	, el.find("h2"), h2
	//, !!el.find("select:enabled"), false
	, !!el.find("select.cl3"), false
	, "El.find()");
	select.kill();

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

	var s;

	s = el.toggleClass("test4");
	test_el.compare(el.className, "test3 test4", s, true, "El.toggleClass");

	s = el.toggleClass("test4", true);
	test_el.compare(el.className, "test3 test4", s, true);

	s = el.toggleClass("test4");
	test_el.compare(el.className, "test3", s, false);

	s = el.toggleClass("test4", false);
	test_el.compare(el.className, "test3", s, false);
	test_el.compare(el.hasClass("test3"), true, el.hasClass("test4"), false, "El.hasClass");

	el.css("left","1px");
	test_el.compare(el.css("left"), "1px", "El.css");

	el.css({"top":"2px","left":"3px"});
	test_el.compare(el.css("top"), "2px", el.css("left"), "3px", "El.css");


	test_el.done();
}()
//*/


