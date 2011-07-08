


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



var binaryGet = function() {
	"ActiveXObject"in window && document.write('<scr'+'ipt type="text/vbscript">\n'+
		'Class myFakeString\n'+
		'  Public byteArray\n'+
		//'  Public length\n'+
		'  Public Function charCodeAt(n)\n'+
		'    charCodeAt = AscB(MidB(byteArray,n+1,1))\n'+
		'  End function\n'+
		//'  Public Function charAt(n)\n'+
		//'    charAt = Chr(AscB(MidB(byteArray,n+1,1)))\n'+
		//'  End function\n'+
		'End Class\n'+
		'Function vbFakeString(byteArray)\n'+
		'  set vbFakeString = New myFakeString\n'+
		'  vbFakeString.byteArray = byteArray\n'+
		//'  vbFakeString.length = LenB(byteArray)\n'+
		'End Function\n'+
		'Function vbBinLen(byteArray)\n'+
		'  vbBinLen = LenB(byteArray)\n'+
		'End Function\n'+
		'</scr'+'ipt>');

	return function(url, callback, feedback) {
		var req = new XMLHttpRequest(), len, done;
		req.open("GET", url, true);
		req.onreadystatechange = function() {
			if (req.readyState == 3) {
				if ( feedback ) try {
					len || (len = req.getResponseHeader( "Content-Length" ));
					var i = ("responseBody" in req) ? vbBinLen(req.responseBody) : req.responseText.length;
					i = ((i/len*20)>>>0)*5;
					done == i || feedback(done = i);
				}catch(e){}
			} else if (req.readyState == 4) {
				feedback && feedback( (req.status == 200) , req);
				req.status == 200 && callback( "responseBody" in req ? vbFakeString(req.responseBody) : req.responseText);
			}
		}
		"overrideMimeType" in req && req.overrideMimeType("text/plain; charset=x-user-defined");
		req.send();
	}
}();

