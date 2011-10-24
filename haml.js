


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function(S/* String.prototype */){
	function haml_compyle(str){
		var out = [];
		str.replace(/^(\s*)((?:[.#%][a-z_\-][a-z0-9_:\-]*)+)(.*)$/igm
		,	function(all,indent,name,text){
				var el = El(name.replace(/^[^%]/,"%div$&").substr(1));

				if (name) el.innerHTML = text.trim();
				el._i = indent.length;

				if (indent=="") {
					parent = el
					out.push(el)
				} else {
					while (el._i <= parent._i) parent = parent.parentNode;
					parent.append(el)
					parent = el
				}
				return ""
			}
		);
		return out;
	}
	S.haml = function(){
		return haml_compyle(this);
	}
}(String.prototype);



/*
var out = [], parent, a="%h1.title Tere maailm\n  %h2\n    .a aidaa"
out
*/
