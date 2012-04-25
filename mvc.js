


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



var Model = Fn.Init.extend(Fn.Events, {
	init: function(data) {
		var t = this;
		t.data = data;
		t.previous = {};
		t.lists = [];
	},
	set: function(args, silent) {
		var t = this, d = t.data, changed = [];
		for (var arg in args) if ( args.hasOwnProperty(arg) ) {
			if (arg in d && d[arg] === args[arg]) continue;
			t.previous[arg] = d[arg];
			d[arg] = args[arg];
			changed.push(arg);
		}
		if (!silent && changed.length) {
			t.trigger("change", changed);
		}
		return changed;
	},
	get: function(name) {
		return this.data[name];
	}
}).cache(true, function(a){return a[0]["id"]});

var List = Fn.Init.extend(Fn.Items, Fn.Events, {
	init: function(name) {
		var t = this;
		t.name = name;
		t.items = [];
	},
	model: Model,
	add: function(data, pos) {
		var t = this, item = data;
		item instanceof t.model || (item = t.model(data), item.set(data, true));
		if (item.lists.indexOf(t) > -1) return false;
		item.lists.push(t);
		pos = pos !== void 0 ? pos : t.items.indexFor(item, t.sortFn, t);
		t.items.splice(pos , 0, item);
		t.trigger("add", item, pos);
		return t;
	},
	remove: function(item) {
		var t = this, m = item.lists;
		if (m.length != m.remove(t).length) {
			t.items.remove(item);
			t.trigger("remove", item);
		}
	},
	toString: function() {
		return "[List: " + this.name +"]";
	}
}).cache(true);


List.Filter = Fn.Init.extend({
	init: function(str) {
		var t = this, slash = function(input) {
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
				if (junk.indexOf(".") > -1)
					return slash(junk)+'.split(".").reduce(function(a,b){return a && b in a && a[b]}, i)'
				return slash(junk) + " in i" + sep;
			}
		)

		if (rules.length > 0) {
			t.str = rules;
			t.test = new Function("i", "return i&&" + rules);
		}
	},
	test: Fn.True,
	str: "all",
	subset: function(target) {
		// TODO:2011-11-07:lauriro:Find better way to compare filters.
		return target.str == "all" || this.str.indexOf(target.str) !== -1;
	},
	toString: function() {
		return "[Filter: " + this.str +"]";
	}
}).cache(true);



/** Tests
!function(){
	var test = new TestCase("Model");

	var sortedList = List.extend({sortFn: function(a, b){return a.get("id") - b.get("id")}});
	var list = sortedList("test");

	list.add({id:1})
	list.add({id:3})
	list.add({id:2})
	list.add({id:3})

	test.compare(
	  list.pluck("id").join(",")
	, "1,2,3"
	, "List.add");

	test.done();
}()
//*/

