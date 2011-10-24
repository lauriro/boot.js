

!function(F){
	var s=Array.prototype.slice;
	"bind" in F || eval("F.bind=function(t){var f=this,a=s.call(arguments,1);return function(){return f.apply(t,a.concat(s.call(arguments)))}}");	
}(Function.prototype);


var t = new Date();
console.log('Init');


function print_net(resources) {
	//console.log('Request ' + JSON.stringify(resources, undefined, 2));
	//return;

	resources.forEach(function (resource) {
		var request = resource.request
		  , startReply = resource.startReply
		  , endReply = resource.endReply;

		if (!request || !startReply || !endReply) {
			return;
		}

		console.log('Net '+endReply.status+' '+request.url+' '+(endReply.time - request.time));
	});


}


!function(w){
	function it(name, pending){
		var t = this;
		if (!(t instanceof it)) return new it(name, pending);
		t.name = name;
		t.hooks = [];
		return t.wait();
	}

	it.prototype = {
		wait: function(time, condition){
			var t = this;
			t.run   = function(){t.hooks.push(["run",    arguments]);return t};
			t.click = function(){t.hooks.push(["click",  arguments]);return t};
			t.wait  = function(){t.hooks.push(["wait",   arguments]);return t};

			if (time) {
				if (condition) {
					var end = time + new Date()
						, test = function(){
								if (condition()) t.resume();
								else if ( +new Date() < end ) setTimeout(test, 100);
								else t.failed();
							}
					test();
				} else {
					setTimeout(function(){t.resume()},  time );
				}
				
			}

			return t;
		}
	, resume: function(){
			var t = this
				, step;

			delete t.run;
			delete t.click;
			delete t.wait;

			while (step = t.hooks.shift()) t[ step[0] ].apply(t, step[1]);
			return t;
		}
	, click: function(){
			var t = this;
			return t;
		}
	, run: function(fn){
			fn();
		return this;
		}
	, failed: function(){
			console.log("FAIL");
		}
	}

	var tests = [];

	function browser_phantomjs(){
		var self = this
		  , phantom = new WebPage();
		
		self.phantom = phantom;

		self.resources = [];

			phantom.onLoadStarted = function () {
				self.startTime = new Date();
			};

			phantom.onResourceRequested = function (req) {
				self.resources[req.id] = {
					request: req
				, startReply: null
				, endReply: null
				}
			};

			phantom.onResourceReceived = function (res) {
				if (res.stage === "start") {
					self.resources[res.id].startReply = res;
				}
				if (res.stage === "end") {
					self.resources[res.id].endReply = res;
				}
			}

			phantom.onConsoleMessage = function (msg) { console.log('LOG: '+msg); }

			//page.viewportSize = { width: 480, height: 800 }

		
	}
	browser_phantomjs.prototype = {
		go: function(url){
			var page = this.phantom, self = this;
			this.phantom.open(url, function (status) {
				if (status !== 'success') {
					console.log('FAIL to load the address');
				} else {
					console.log('Loaded');

					self.on_loaded && self.on_loaded.call(self);

				}

				t = Date.now() - t;
				console.log('Run time ' + t + ' msec');
				page.render('test.png');

			});
		},
		close: function(){
			this.phantom.exit();
		}
	}

	function describe(name) {
		var t = this
		if (t instanceof describe === false) return new describe(name);
		t.tests = [];
		tests.push(t);
		return t;
	}
	describe.prototype = {
		it: function(name){
			var t = this
				, test = new it(name);
			test.it = t.it.bind(t);
			test.done = t.done.bind(t);
			t.tests.push( test );
			return test;
		}
	, done: function(){
		
		}
	, run: function( cb ){
			var browser = new browser_phantomjs();
			browser.on_loaded = function(){
				var page = this.phantom;
				page.title = page.evaluate(function () {
					return document.title;
				});

				//console.log('Request ' + JSON.stringify(page.resources, undefined, 2));
				
				print_net(this.resources);
				browser.close();
					
			}
			browser.go("http://code/boot.js/test.html");
		}
	}

	w.describe = describe;

	w.describe.go = function(){
		var test;
		while (test = tests.shift()) test.run();
		
	}
	
}(this);


describe ("Sidebar camera").
	it ("Should let login").
		run(function(){
			console.log('Run0 '+new Date());
		}).
		wait(1000).
		run(function(){
			console.log('Run1 '+new Date());
		}).
		wait(2000, function(){
			return 1;
		}).
		run(function(){
			console.log('Run2 '+new Date());
		}).
		wait(2000, function(){
			return true;
		}).
		run(function(){
			console.log('Run3 '+new Date());
		}).
		click("#confirm .btn.ok").

	it ("Should show camera stream").
	it ("Should allow to change camera").
done()


describe.go();

