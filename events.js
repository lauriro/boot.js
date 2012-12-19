


!function(exports) {
	var sl = Function.prototype.call.bind(Array.prototype.slice)

	function Emitter() {
	}

	Emitter.prototype = {
		on: function(name, fn) {
			var t = this
			, e = t._events || (t._events = {})

			if (name in e) {
				// Keep listeners in reversed order
				if (typeof e[name] == "function") e[name] = [fn, e[name]]
				else e[name].unshift(fn)
			} else e[name] = fn
			return t
		},
		non: function(name, fn) {
			var e, l, t = this
			if ("_events" in t) {
				if (name) {
					if (e = t._events[name]) {
						if (!fn || e == fn || (e[0] == fn && e.length == 1)) {
							delete t._events[name]
						}
						else if (typeof e != "function") {
							l = e.length
							while (l--) if (e[l] == fn) e.splice(l, 1)
						}
					}
				} else delete t._events
			}
			return t
		},
		once: function(name, fn) {
			return this.on(name, fn).on(name, this.non.partial(name, fn))
		},
		emit: function(name) {
			var e, i, t = this
			if (e = "_events" in t && t._events[name]) {
				if (typeof e == "function") {
					switch (arguments.length) {
						// fast cases
						case 1:  e.call(t); break;
						case 2:  e.call(t, arguments[1]); break;
						case 3:  e.call(t, arguments[1], arguments[2]); break;
						// slower
						default: e.apply(t, sl(arguments, 1))
					}
				}
				else {
					e = e.slice()
					i = e.length
					switch (arguments.length) {
						// fast cases
						case 1:  while (i--) e[i].call(t); break;
						case 2:  while (i--) e[i].call(t, arguments[1]); break;
						case 3:  while (i--) e[i].call(t, arguments[1], arguments[2]); break;
						// slower
						default: for (var a = e.slice.call(arguments, 1); i--;) e[i].apply(t, a)
					}
				}
				return true
			}
			return false
		}
	}

	exports.Emitter = Emitter

//** Node
}( typeof exports != "undefined" ? exports : this, this.Event || (this.Event={}) )
/*/
}( this.Event || (this.Event={}) )
//*/



