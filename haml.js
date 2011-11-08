


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function(S/* String.prototype */){
	function haml_compyle(str){
		var out = [], parent, i;
		str.replace(/^( *)((?:[.#%][a-z_\-][a-z0-9_:\-]*)+)? ?(.*)$/igm,
			function(all,indent,name,text){
				if (all) {

					if (name) {
						var el = El(name.replace(/^[^%]/,"%div$&").substr(1));

						if (text) el.innerHTML = text;
					} else {
						console.log('text',text)
						var el = document.createTextNode( text )
					}
					i = indent.length;

					if (indent=="") {
						parent = el
						out.push(el)
					} else {
						while (i <= parent._i) parent = parent.parentNode;
						parent.append(el)
						if (el.nodeType !== 3) {
							el._i = i
							parent = el
						}
					}
				}
				return ""
			}
		);
		console.log('out',out)
		return out.length === 1 ? out[0] : out;
	}
	S.haml = function(){
		return haml_compyle(this);
	}
}(String.prototype);



/*
var out = [], parent, a="%h1.title Tere maailm\n  %h2\n    .a aidaa"
out
*/
