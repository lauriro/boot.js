


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function(S/* String.prototype */){
	var custom = El.cache.fn, rendering  = false;


	function custom_init(el){
		var template, node = el.firstChild;
		for (; node; node = node.nextSibling) if (node.nodeType == 1) custom_init(node);
		if (template = el.getAttribute("data-template")) {
			El.cache.fn[template].call(el, el);
			rendering || el.removeAttribute("data-template");
		}
	}
	function template(id) {
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
		//	delete t.el.haml_done;
			
		}
		return t;
	}

	template.prototype = {
		cloneNode: function() {
			return this;
		},
		set: function() {
			return this;
		},
		parse: function(el, data) {
			var t = this;
			t.el.innerHTML = t.fn(data);
			custom_init(t.el);
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
		       .replace(/{{\s*((?:[^}]|}(?!}))+)\s*}}/g, function(_,$1){
		       	 return "',("+$1.replace(/([^|])\|\s*([^|\s:]+)(?:\s*\:\s*([^|]+))?/g,"$1).$2($3")+"),'";
		       })
		       .replace(/{%\s*if\s((?:[^%]|%(?!}))+)%}/g, "');if($1){_.push('")
		       .replace(/{%\s*for\s*\(\s*(?:var)?\s*([^}]+)\)\s*%}/g, "');for (var $1) {_.push('")
		       .replace(/{%\s*for\s(\w+)\sin\s([^}]*?)(?: limit:(\d))?(?: offset:(\d))?\s*%}/g, "');var _1=o.$2||{}, offset=$4+0, limit=$3+0, i=0; if(_1)for(var _2 in _1)if(_1.hasOwnProperty(_2)) {if(offset&&offset--)continue;i++;if(limit&&i>limit)break;var $1=_1[_2];_.push('")
		       .replace(/{%\s*(endif|endfor)\s*%}/g, "')};_.push('")
		  + "')}return _.join('')";
		
		//console.log('str',s);
		return new Function("o", s);
	}

	El.haml = function(str) {
		var out = [], parent, i;
		str.replace(/^( *)((?:[.#%][\w:\-]+)+)?(\{.*\})? ?(.*)$/igm, function(all, indent, name, args, text) {
			if (all) {
				var el, m;
				i = indent.length;
					while (parent && i <= parent._i) {

						//delete parent._i;

						if ("haml_done" in parent) parent.haml_done();
						parent = parent._parent || parent.parentNode;
					}

				if (name) {
					args = args ? JSON.parse(args) : {};
					el = El(name.replace(/^[^%]/,"%div$&").substr(1), args);
					if (text) el.append( text.replace(/'/g,"\\'") );
					if (m = name.match(/^%(\w+)/)) m[1] in custom && el.setAttribute("data-template", m[1]);
				} else {
					m = text.split(" ");
					switch (m[1]) {
						case "template":
							el = new template(m[2]).el;
							el._parent = parent
							el._i = i
							parent = el
							return
						break;
						case "markdown":
							//TODO:2011-11-09:lauriro:Write markdown support for haml
						break;
						default:
							el = document.createTextNode( args ? all : text )
					}
				}

				if (indent=="") {
					parent = el;
					"nodeType" in el && out.push(el);
				} else {
					parent.append(el);
					if (el.nodeType !== 3) {
						el._i = i;
						parent = el;
					}
				}
			}
			return "";
		});
		return out.length === 1 ? out[0] : out;
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

}(String.prototype);


