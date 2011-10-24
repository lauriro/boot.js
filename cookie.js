


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



function Cookie (name) {
	for (var a=document.cookie.split("; "),i=0,c,n=name+'=';c=a[i++];){
		if (c.indexOf(n)===0) return unescape(c.substr(n.length));
	}
	return false;
}
Cookie.set = function (name, value, expires /* in seconds*/, path, domain, secure) {
	if (expires) {
		var e = new Date();
		e.setTime( e.getTime() + (expires*1000) );
		expires = "; expires=" + e.toUTCString();
	}
	return document.cookie = name + "=" + escape(value||"") + (expires||"")
		+ (path?"; path="+path:"") + (domain?"; domain="+domain:"") + (secure?"; secure":"");
}
Cookie.destroy = function (name) {
	return Cookie.set(name, "", -1);
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




