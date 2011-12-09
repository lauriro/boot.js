


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



function Fn() {
	var t = this;
	return "init" in t && t.init.apply(t, arguments) || t;
};

Fn.True = function(){return true}
Fn.False = function(){return false}

Fn.Events = {
	on: function(ev, fn, scope) {
		var t = this, e = t._e || (t._e = {});
		(e[ev] || (e[ev] = [])).push([fn, scope]);
		return t;
	}.byWords(),
	non: function(ev, fn) {
		var t = this;
		if (ev) {
			if ("_e" in t && ev in t._e) {
				if (fn) t._e[ev].remove(fn);
				else delete t._e[ev];
			}
		} else delete t._e;
		return t;
	}.byWords(),
	trigger: function(ev) {
		var t = this;
		if ("_e" in t && ev in t._e) {
			for (var i=0, e=t._e[ev], a=e.slice.call(arguments, 1); ev=e[i++];) ev[0].apply(ev[1]||t, a);
		}
		return t;
	}
};

Fn.Lazy = {
	wait: function(ignore) {
		var t = this, k, hooks = [], hooked = [];
		ignore = ignore || [];

		for (k in t) if (typeof t[k] == "function" && ignore.indexOf(k) == -1) !function(k){
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

