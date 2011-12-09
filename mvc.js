


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



var Model = Fn.extend(Fn.Events, {
	init: function(name) {
		var t = this;
		t.name = name;
		t.items = [];
	},
	add: function(item, pos) {
		var t = this;
		item instanceof t.Item || (item = new t.Item(item));
		if (item.models.indexOf(t) > -1) return false;
		item.models.push(t);
		pos = pos === void 0 ? pos : t.items.indexFor(item, t.sortFn);
		t.items.splice(pos , 0, item);
		t.trigger("add", item, pos);
		return t;
	},
	remove: function(item) {
		var t = this, m = item.models;
		if (m.length != m.remove(t).length) {
			t.items.remove(item);
			t.trigger("remove", item);
		}
	},
	first: function(fn) {
		var t = this, item = t.items[0];
		return fn ? (item && fn(item), t) : item;
	},
	each: function(fn) {
		var t = this;
		/*, arr = t.items, i = 0, len = arr.length;
		while (i<len) fn(arr[i].data, i++);*/
		t.items.forEach(fn, t);
		return t;
	},
	on_empty: function(fn) {
		0 in this.items || fn();
		return this;
	},
	toString: function() {
		return "[Model: " + this.name +"]";
	}
});


Model.Item = Model.prototype.Item = Fn.extend(Fn.Events, {
	init: function(data) {
		this.data = data;
		this.previous = {};
		this.models = [];
	},
	set: function(args) {
		var t = this, d = t.data, changed = [];
		for (var arg in args) if ( args.hasOwnProperty(arg) ) {
			if (arg in d && d[arg] === args[arg]) continue;
			previous[arg] = d[arg];
			d[arg] = args[arg];
			changed.push(arg);
		}
		if (changed.length) {
			t.trigger("changed", changed);
		}
		return changed;
	},
	get: function(name) {
		return this.data[name];
	}
});

Model.Filter = Fn.extend({
	init: function(str) {
		var slash = function(input) {
			if ( /[^0-9]/.test(input) ) input = '"' + input + '"';
			return input;
		}

		var rules = str.replace(/([^&\|\(\)]+)(\)?)(&|\||$)/g,
			function(_, junk, bracket, sep) {
				var sep = bracket + sep + sep;

				// Extract id=1*

				if (junk.indexOf("*") !== -1) {
					return '(""+i.' + junk.split(".").join("\\.").split("*").join(".*").replace("=",").search(/") + "/i)>-1" + sep;
				}

				// Extract id={1,3-6,9-,one,two}

				var list = junk.match(/^([^\[\{=]+)=?(\[|\{)([^\]\}]+)(\]|\})$/);
				if (list) {
					var comp = "i." + list[1], list = list[3].replace(
						/[^,]+/g
					, function(all,from,to) {
							var range = all.split("-");
							if (range.length == 1) {
								return comp + "==" + slash(all);
							}
							var a = [];
							range[0].length && a.push( comp + ">=" + slash(range[0]) );
							range[1].length && a.push( comp + "<=" + slash(range[1]) );
							return "(" + a.join("&&") + ")";
						}
					)
					return "(" + list.split(",").join("||") + ")" + sep;
				}

				// Extract id=1
				var pos = junk.indexOf("=");
				if (pos !== -1) {
					return "''+i." + junk.substr(0,pos) + "==''+" + slash( junk.substr(pos+1) ) + sep;
				}

				// Extract required fields /collection[id&name]
				return slash(junk) + " in i" + sep;
			}
		)

		if (rules.length > 0) {
			this.str = rules;
			this.test = new Function("i", "return i&&" + rules);
		}
	},
	test: Fn.True,
	str: "all",
	subset: function(target) {
		// TODO:2011-11-07:lauriro:Find better way to compare filters.
		return target.str === "all" || target.str.indexOf(this.str) !== -1;
	},
	toString: function() {
		return "[Filter: " + this.str +"]";
	}
}).cache(true);




// View
function V(name, args, parent) {
	var args = args || {}
	args.name = name
	El("view", args, parent || Stack.open(name) )
}


// Controller
function C(name){
	if (name in this) return this[name].apply(null, Array.prototype.slice.call(arguments,1))
}







El.cache(
	"view"
, El("div", { className:"view" })
, function() {
  	var cache = {}
  	  , opened = []

  	//M.broadcast = function(event, view_name){
  	//	var len = opened.length, view
  	//	while ( view = opened[--len] ) {
  	//		if (!view_name || view_name == view.name) "handle" in view && view.handle( event )
  	//	}
  	//}

  	return function build_view(el) {
  		var name = el.name

  		if (name in cache === false) {
  			var req = new XMLHttpRequest()
  			req.open("GET", "views/" + name + ".js" + "?r=" + Math.random(), false)
  			req.send()
  			if (req.status === 200) {
  				cache[name] = eval("(function(el){"+req.responseText+"})")
				}
  		}
  		cache[name](el)

  		opened.push(el)

  		el.kill_hook = function() {
  			var key = opened.indexOf( el )
  			key !== -1 && opened.splice(key, 1)
  			"close_hook" in el && el.close_hook()
  		}
  		
  	}
  }()
)



