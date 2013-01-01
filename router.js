


!function(exports) {

	function Router() {
		this.map = { "": function(){} }
		this.stat = { "": 0 }
	}

	function RouterAdd(path, fn, opts) {

		var junk
		, t = this
		, i = 0
		, junks = path.replace(/\/+$/, "").split("/")
		, route = junks[0]
		, last = junks.length
		, names = {}
		, obj = fn

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
				if (obj === fn) {
					obj = { cb: fn, names: names, opts: opts || {} }
				}
			}
			route += "/" + junk
		}
	}

	function RouterRoute(path, cb, scope) {
		var junks
		, i = 0
		, route = ""
		, map = this.map

		// Fast case
		if (map[path]) {
			route = path
			path = ""
		} else {
			junks = path.split("/")
			path = junks[0]

			while (true) {
				path += "/" + junks[++i]

				if (!map.hasOwnProperty(path)) {
					path = route + "/:?"
					if (map.hasOwnProperty(path)) {
						(scope.args || (scope.args = {}))[ map[path].names[i] ] = junks[i]
					} else {

						// TODO:2012-12-28: Should we add route to map for cache?
						break
					}
				}
				route = path
			}
			path = junks.slice(i).join("/")
		}

		this.stat[route]++
		;(map[route].cb || map[route]).call(scope, path, cb)
	}


	Router.prototype = 
		{ add: RouterAdd
		, route: RouterRoute
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

	r.route("apv2")
	test.compare( x , 0)

	r.route("/api/")
	test.compare( x , 1 , "Router.route")
	r.route("/api/v1/")
	test.compare( x , 2)
	r.route("/api/v2")
	test.compare( x , 3)

	r.route("/api/v2/hello", null, scope)
	test.compare( x , 3, scope.args.method, "hello")
	
	r.route("/api/v2/hello", null, scope)
	test.compare( x , 3, scope.args.method, "hello")
	
	r.route("/apv2")
	test.compare( x , 0)

	test.done()
}()
//*/



