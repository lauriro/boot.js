


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



;(function(){
	var cache = {}
	  , html = {}
	  , S = String.prototype
	  , format = function(str){
	  		var e = document.createElement("div")
	  		e.innerHTML = str
	  		if (e.childs.length == 1) return e.childs[0]
	  		else return e.childs
	  	}
	  , init = function(str){
	  		var el = document.getElementById(str)
	  		if (el && "type" in el && el.type == "text/html") str=el.innerHTML
	  		else {
					var req = new XMLHttpRequest();
					req.open("GET", "tpl/" + str + ".tpl", false);
					req.send();
					if (req.status == 200) str = req.responseText;
	  		}

			str=str
				.replace(/<!--[^\[]([^-]->|[^-]>|[^>])*-->/g,"")
				.replace(/[\r\t\n\s]+/gm, " ")
				.replace(/{{\s*(([^}]}|[^}])+)\s*}}/g, function(_,$1){
					return "',("+$1.replace(/([^|])\|\s*([^|\s:]+)(\s*\:\s*([^|]+))?/g,"$1).$2($4")+"),'"
				})
				.replace(/{%\s*if\s([^}]*)%}/g, "');if($1){a.push('")
				.replace(/{%\s*for\s*\(\s*(var)?\s*([^}]+)\)\s*%}/g, "');for (var $2) {a.push('")
				.replace(/{%\s*for\s([^ ]+)\sin\s([^ ]+)\s*%}/g, "');for (var key in $2) if ($2.hasOwnProperty(key)) {var $1=$2[key];a.push('")
				.replace(/{%\s*(}|endif|endfor)\s*%}/g, "')};a.push('")



			var s = "var a=[];with(o){a.push('" + str + "')}return (a.join(''))"

			var fun = new Function("o",s)
			//console.log(s)
			return function(name){
				var str = fun(name)
				var dummy = El("div",str)
				var tags = dummy.getElementsByTagName("*")
				for (var i=0,len=tags.length;i<len;i++){
					var tag = tags[i]
					if(tag.nodeName in html)continue
					console.log("tag",tags[i])
					
				}
				if (dummy.children.length == 1) return dummy.children[0]
				return dummy.children
			}
		}
		"A,B,DIV,LI".replace(/\w+/g,function(e){html[e]=true})


	S.capitalize = function(){
		return this.charAt(0).toUpperCase() + this.slice(1)
	}

  
  window.tmpl2 = function tmpl2(str, data){
    var fn = cache[str] || (init(str))
    
    // Provide some basic currying to the user
    return data ? fn( data ) : fn;
  };
})();

// tmpl2("test", {id:1,from:"kala",name:"test",users:[{name:"nimi1",url:"url1"}]} )
