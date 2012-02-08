
var rpc = function(){
	var rpc_id = 0, xhr_pool = [];

	function message(method, params, cb){
		var data = {jsonrpc:"2.0", method:method};
		params && (data.params = params);
		cb && (data.id = ++rpc_id);
		return JSON.stringify( data );
	}

	return function rpc_xhr(method, params, cb, err){
		var req = xhr_pool.pop() || new XMLHttpRequest();

		req.open("POST", conf.api, true);
		req.onreadystatechange = function(){
			if (req.readyState === 4) {
				cb && cb( req.status === 200 && JSON.parse(req.responseText||"{}") || null, req);
				xhr_pool.push(req);
			}
		}

		// some versions of Mozilla browsers won't work properly (there's just no responseXML)
		// if response from server doesn't have xml mime-type header
		// "overrideMimeType" in req && req.overrideMimeType ( "text/xml" );

		req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		req.send( message(method, params, cb) );
		return req;
	}
}();


/** Tests
!function(){
	var rpc_id = 0, xhr_pool = [];

	function get(url, cb) {

		var req = xhr_pool.pop() || new XMLHttpRequest();
		req.open("GET", url, true);
		req.onreadystatechange = function(){
			if (req.readyState === 4) {
				cb && cb( req.status === 200 && req.responseText || null, req);
				xhr_pool.push(req);
			}
		}

		// some versions of Mozilla browsers won't work properly (there's just no responseXML)
		// if response from server doesn't have xml mime-type header
		// "overrideMimeType" in req && req.overrideMimeType ( "text/xml" );

		req.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
		req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		req.send();
	}

	get("LICENSE",function(data, req){
		get("LICENSE",function(data2, req2){
			TestCase("RPC")
				.compare(
					data
				, data2
				, "get"
				).done()

			
		})
		
	})


}()
//*/




