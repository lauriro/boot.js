


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



!function(w, d, s){
	var ls = d.getElementsByTagName(s)
	  , tag = ls[ls.length-1];

	// eval in a global context for non-IE & non-Chrome (removed form v8 on 2011-05-23: Version 3.3.9)
	// THANKS: Juriy Zaytsev - Global eval [http://perfectionkills.com/global-eval-what-are-the-options/]
	if (!("execScript" in w)) {
		w.execScript = (function(o,Object){return(1,eval)("(Object)")===o})(Object,1) ? eval : 
			"d t a->s->d.body[a](d.createElement(s))[a](d.createTextNode(s))".fn()(d, s, "appendChild")
	}


	/** loader.CommonJS style modules
	var _required = {}
	w.require = function(file) {
		if (file in _required) return _required[file];
		var req = new XMLHttpRequest(), exports = {};
		req.open("GET", file.replace(/^[^\/]/, w.require.path+"$&"), false);
		req.send();
		eval(req.responseText);
		return _required[file] = exports;
	}
	w.require.path = b;
	//*/


	//** loader.async
	w.load = function(f, cb) {
		if (!Array.isArray(f)) f=[f];
		var i=0, len=f.length, res = [];
		while (i<len) !function(i) {
			xhr("GET", f[i].replace(/^[^\/]/, w.load.path+"$&"), function(str) {
				res[i] = str;
				//for (var str,e="";str=res[loaded];++loaded){e+=str};
				//e && execScript(e);
				if (!--len) {
					execScript( res.join(";") );
					cb && cb();
					res = null;
				}
			}).send();
		}(i++);
	}
	w.load.path = tag.src.replace(/[^\/]+$/, "");
	/** loader - helpers
	a = document.getElementsByTagName("script");
	b = a[a.length-1].src.replace(/[^\/]+$/,"");
	//*/

	//*/

	execScript(tag.innerHTML+";")
}(this, document, "script");

