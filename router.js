


!function(exports) {

	function Router() {
		this.map = { "": { cb: function(){} } }
		this.stat = { "": 0 }
	}

	Router.prototype = {
		add: function(path, fn) {

			var junk
			, t = this
			, i = 0
			, junks = path.replace(/\/+$/, "").split("/")
			, route = junks[0]
			, last = junks.length
			, names = {}
			, obj = { cb: fn, names: names }

			while (true) {
				junk = junks[++i]

				if (i == last || junk.charAt(junk.length - 1) == "?") {
					t.map[route] = obj
					t.stat[route] = 0
				}

				if (i >= last) break
				
				if (junk.charAt(0) == ":" || junk.charAt(junk.length - 1) == "?") {
					names[i] = junk.replace(/^:+|\?+$/g, "")
					junk = ":?"
				}
				route += "/" + junk
			}
		},

		route: function ex(path, cb, scope) {
			var junks, route
			, i = 0
			, key = ""
			, map = this.map

			// Fast case
			if (map[path]) {
				key = path
				path = ""
			} else {
				junks = path.split("/")
				route = junks[0]

				while (true) {
					key = route
					route += "/" + junks[++i]

					if (!map.hasOwnProperty(route)) {
						route = key + "/:?"
						if (map.hasOwnProperty(route)) {
							(scope.args || (scope.args = {}))[ map[route].names[i] ] = junks[i]
						} else {
							// TODO:2012-12-28: Should we add route to map for cache?
							break
						}
					}
				}
				path = junks.slice(i).join("/")
			}

			this.stat[key]++
			map[key].cb.call(scope, path, cb)
		}
	}

	exports.Router = Router
}(this)



/** Tests
!function(){
	var x, undef
	, scope = {}
	, test = new TestCase("Router")
	, r = new Router()


	r.add("", function(){x = 0})
	r.add("/api/", function(){x = 1})
	r.add("/api/v1", function(){x = 2})
	r.add("/api/v2/:method?", function(){x = 3})

	r.route("/api/")
	test.compare( x , 1 , "Router.route")
	r.route("/api/v1/")
	test.compare( x , 2)
	r.route("/api/v2")
	test.compare( x , 3)
	r.route("/api/v2/hello", null, scope)
	test.compare( x , 3, scope.args.method, "hello")
	r.route("/apv2")
	test.compare( x , 0)

	test.done()
}()
//*/



