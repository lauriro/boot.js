


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function(w/* window */){
	if ("DOMParser" in w) return;
	
	// When you are querying the DOM with SelectNodes or SelectSingleNode the default selection language in MSXML6 is XPath while the default selection language in MSXML3 is XSLPatterns.  To switch MSXML3 to the standard XPath 1.0 query language set the second-level DOM property Selection Language like this - xmlDoc.setProperty("SelectionLanguage", "XPath");
	w.DOMParser=function(){};
	w.DOMParser["prototype"].parseFromString = /*@cc_on
		function(s){
			var d=new ActiveXObject('MSXML.DomDocument');
			d.loadXML(s);
			return d
		}@*/function(s,m){
			var r=new XMLHttpRequest;
			r.open('GET','data:'+(m||'application/xml')+';charset=utf-8,'+encodeURIComponent(s),false);
			m&&'overrideMimeType'in r&&r.overrideMimeType(m);
			r.send();
			return r.responseXML
		}

}(window);

