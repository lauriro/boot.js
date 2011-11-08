


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



function Cookie (n/*ame*/) {
	return (n = ("; "+document.cookie).split("; "+n+"=")[1]) ? unescape(n.split("; ")[0]) : false;
}

Cookie.set = function (n/*ame*/, v/*alue*/, e/*xpires in seconds*/, p/*ath*/, d/*omain*/, s/*ecure*/) {
	return document.cookie = n + "=" + escape(v)
		+ (e?"; expires=" + new Date(+new Date()+(1e3*e)).toUTCString():"")
		+ (p?"; path="+p:"") + (d?"; domain="+d:"") + (s?"; secure":"");
}

Cookie.destroy = function (n/*ame*/) {
	return Cookie.set(n, "", -9e4);
}



/** Tests
!function(){
	var test = new TestCase("Cookie");

	test.compare(
	  Cookie.set("_test1","Test")
	, "_test1=Test"
	, Cookie.set("_test2","2")
	, "_test2=2"
	, "Cookie.set()");

	test.compare(
	  Cookie("_test1")
	, "Test"
	, Cookie("_test2")
	, "2"
	, Cookie("_test3_not_found")
	, false
	, "Cookie()");

	Cookie.destroy("_test1");

	test.compare(
	  Cookie("_test1")
	, false
	, Cookie("_test2")
	, "2"
	, "Cookie.destroy()");
	
  test.done();
}()

//*/



