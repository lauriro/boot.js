

/*
* GET	PUT	POST	DELETE
*
* The default sync handler maps CRUD to REST like so:
*
* create → POST   /collection
* read → GET   /collection[/id]
* update → PUT   /collection/id
* delete → DELETE   /collection/id
*/


!function(exports) {

	function Router() {
		this.map = { "": { cb: function(){} } }
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
		, obj = { cb: fn, path: path, names: names, opts: opts || {} }

		while (true) {
			junk = junks[++i]

			if (i == last || junk.charAt(junk.length - 1) == "?") {
				t.map[route] = t.map[route + "/"] = obj
			}

			if (i >= last) break

			if (junk.charAt(0) == ":" || junk.charAt(junk.length - 1) == "?") {
				names[i] = junk.replace(/^:+|\?+$/g, "")
				junk = ":?"
			}
			route += "/" + junk
		}
		t.stat[path] = 0
	}

	function RouterRoute(path, cb, scope) {
		var junks
		, i = 0
		, map = this.map
		, route = map[path] || ""

		// Fast case
		if (route) {
			route.cb.call(scope, "", cb)
			this.stat[route.path]++
		} else {
			junks = path.split("/")
			path = junks[0]

			while (true) {
				path += "/" + junks[++i]

				if (!map[path]) {
					path = route + "/:?"
					if (map[path]) {
						(scope.args || (scope.args = {}))[ map[path].names[i] ] = junks[i]
					} else {

						// TODO:2012-12-28: Should we add route to map for cache?
						break
					}
				}
				route = path
			}
			map[route].cb.call(scope, junks.slice(i).join("/"), cb)
			this.stat[ map[route].path ]++
		}
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
	r.add("/api/v3/", function(){x = 4})
	r.add("/api/v3/:name", function(){x = 5})

	r.route("")
	test.compare( x , 0 , r.stat[""], 1, "Router.route")
	r.route("none")
	test.compare( x , 0 , r.stat[""], 2)
	r.route("none/e")
	test.compare( x , 0 , r.stat[""], 3)
	r.route("/apv2")
	test.compare( x , 0 , r.stat[""], 4)
	//r.route("toString")
	//test.compare( x , 0 , r.stat[""], 5)

	r.route("/api")
	test.compare( x , 1, r.stat["/api/"], 1)
	r.route("/api/")
	test.compare( x , 1, r.stat["/api/"], 2)
	r.route("/api/none")
	test.compare( x , 1, r.stat["/api/"], 3)

	r.route("/api/v1")
	test.compare( x , 2, r.stat["/api/v1"], 1)
	r.route("/api/v1/")
	test.compare( x , 2, r.stat["/api/v1"], 2)
	r.route("/api/v1/none")
	test.compare( x , 2, r.stat["/api/v1"], 3)

	r.route("/api/v2", null, scope)
	test.compare( x , 3)
	r.route("/api/v2/", null, scope)
	test.compare( x , 3)
	r.route("/api/v2/toString", null, scope)
	test.compare( x , 3, scope.args.method, "toString")
	
	r.route("/api/v3", null, scope)
	test.compare( x , 4)
	r.route("/api/v3/", null, scope)
	test.compare( x , 4)
	r.route("/api/v3/hello", null, scope)
	test.compare( x , 5, scope.args.name, "hello")
	
	test.done()
}()
//*/



