


!function(exports){

	function Router() {
		this.map = { "": { cb: function(){} } }
		this.stat = { "": 0 }
	}

	Router.prototype = {
		add: function(path, fn) {

			var junk
			, t = this
			, i = 0
			, junks = path.split("/")
			, route = junks[0]
			, last = junks.length - 1
			, names = {}
			, obj = { cb: fn, names: names }

			while (true) {
				if (i == last || junks[i+1].charAt(0) == "*") {
					t.map[route] = obj
					t.stat[route] = 0
				}

				if (++i > last) break
				
				junk = junks[i]
				if (junk.charAt(0) == ":" || junk.charAt(0) == "*") {
					names[i] = junk.slice(1)
					junk = ":?"
				}
				route += "/" + junk
			}
		},

		route: function ex(route, cb, scope) {
			var key = ""
			, map = this.map

			// Fast case
			if (route in map) {
				key = route
				route = ""
			} else {
				var junks = route.split("/")
				, i = 0
				, next = junks[0]


				while (true) {
					key = next
					next += "/" + junks[++i]

					if (!map.hasOwnProperty(next)) {
						next = key + "/:?"
						if (map.hasOwnProperty(next)) {
							(scope.args || (scope.args = {}))[ map[next].names[i] ] = junks[i]
						} else {
							break
						}
					}
				}
				route = junks.slice(i).join("/")
			}

			this.stat[key]++
			map[key].cb(route, cb, scope )
		}
	}

	exports.Router = Router
}(this)



/** Tests
!function(){
	var x
	, test = new TestCase("Router")
	, r = new Router()


	r.add("/api/", function(){x = 1})

	r.route("/api/")


	test.compare( x , 1 , "Router.route");

	test.done();
}()
//*/
