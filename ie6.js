


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function(w){
	var d = w.document, no = []
	
	//** DOMParser when XML needed
	if ("DOMParser"in w === false) {
		w.DOMParser=function(){}
		w.DOMParser.prototype.parseFromString=function(s){
			var x=new ActiveXObject("MSXML.DomDocument")
			x.loadXML(s)
			return x
		}
	}
	//*/

	// XMLHttpRequest was unsupported in IE 5.x-6.x + remove background image flickers on hover
	"XMLHttpRequest"in w||no.push("w.XMLHttpRequest=function(){function a(n){try{var x=new ActiveXObject(n);w.XMLHttpRequest=function(){return new ActiveXObject(n)};return x}catch(e){return false}}return a('Msxml2.XMLHTTP.6.0')||a('Msxml2.XMLHTTP.3.0')||a('Msxml2.XMLHTTP')};try{d.execCommand('BackgroundImageCache',false,true)}catch(e){}")

	eval(no.join(";"))

	"address,article,aside,canvas,details,figcaption,figure,footer,header,hgroup,menu,nav,section,summary,command,datalist,mark,meter,time,wbr".replace(/\w+/g,function(t){d.createElement(t)})
}(window)

