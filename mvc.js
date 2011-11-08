
/* Class: Model
   Model–view–controller (MVC)
*/

function Fn() {
	var t = this;
	"init" in t && t.init.apply(t, arguments);
	return t;
};

Fn.True = function(){return true}
Fn.False = function(){return false}

Fn.Events = {
	bind: function(ev, fn, scope) {
		var t = this, e = t._e || (t._e = {});
		//(e[ev] || (e[ev] = [])).push([fn, scope]);
		ev.replace(/\w+/g, function(ev){ (e[ev] || (e[ev] = [])).push([fn, scope]) });
		//ev.split(" ").forEach(function(w){Event[a](t, w, fn)})
		//for(a=ev.split(" "),i=0,b;b=a[i++];Event[a](t, w, fn))
		return t;
	},
	unbind: function(ev, fn) {
		var t = this;
		if (ev) {
			if ("_e" in t && ev in t._e) {
				if (fn) t._e[ev].remove(fn);
				else delete t._e[ev];
			}
		} else delete t._e;
		return t;
	},
	trigger: function(ev) {
		var t = this;
		if ("_e" in t && ev in t._e) {
			for (var i=0, e=t._e[ev], a=e.slice.call(arguments, 1); ev=e[i++];) ev[0].apply(ev[1]||t, a);
		}
		return t;
	}
};

Fn.Lazy = {
	wait: function() {
		var t = this, k, hooks = [], hooked = [];

		for (k in t) if (typeof t[k] == "function") !function(k){
			hooked.push(k);
			t[k] = function(){hooks.push([k, arguments]);return t}
		}(k);

		t.resume = function() {
			delete t.resume;
			var i = hooked.length, v;
			while (i--) delete t[hooked[i]];
			// i == -1 from previous loop
			while (v=hooks[++i]) t[v[0]].apply(t,v[1]);
			hooks = hooked = null;
		}
		return t;
	}
};

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
		t.items.splice( pos != null ? pos : t.items.length, 0, item);
		item.models.push(t);
		t.trigger("add", item);
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
		var t = this;
		0 in t.items && fn(t.items[0].data);
		return t;
	},
	each: function(fn) {
		var t = this, arr = t.items, i = 0, len = arr.length;
		while (i<len) fn(arr[i].data, i++);
		return t;
	},
	on_empty: function(fn) {
		this.items.length === 0 && fn();
		return this;
	},
	Item: Fn.extend({
		init: function(data) {
			this.data = data;
			this.models = [];
		},
		set: function(args) {
			var t = this, d = t.data, changed = [];
			for (var arg in args) if ( args.hasOwnProperty(arg) ) {
				if (arg in d && d[arg] === args[arg]) continue;
				d[arg] = args[arg];
				changed.push(arg);
			}
			return changed.length && changed;
		},
		get: function(name) {
			return this.data[name];
		},
		updated: function(fields) {
			var t = this, data = t.data, listeners = t.listeners.slice()

			t.models.forEach(
				function(model) {
					listeners.push.apply(listeners, model.listeners)
				}
			)

			listeners.length && listeners.forEach(
				function(fn) {
					if ("__listenKeys" in fn && t in fn.__listenKeys) {
						if (fn.__listenKeys[t](fields)) fn(data, fields)
					} else fn(data)
				}
			)
		}
	}),
	toString: function() {
		return "[Model: " + this.name +"]";
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
					return "i." + junk.substr(0,pos) + "==" + slash( junk.substr(pos+1) ) + sep;
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



