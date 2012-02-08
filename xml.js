


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



function XML(ver, enc){
	var t = this
	if (t instanceof XML === false) return new XML(ver, enc)
	t.root = t
	t.ver = ver||"1.0"
	t.enc = enc||"utf-8"
	t.childs = []
	t.toString = function(){
		return '<?xml version="'+t.ver+'" encoding="'+t.enc+'"?>'+t.childs.join("")+(t.str||"")
	}
}

XML.node = function(name, attr){
	this.name = name
	this.attr = attr||{}
	this.childs = []
}

XML.parse_attr = function(str){
	var attr = {}
	str.replace(/([^= ]+)=("|')([^"']*)\2/g,function(all,name,ap,val){attr[name]=val})
	return attr
}

XML.prototype = XML.node.prototype = {
  add: function(name, attr){
  	var t = this, n = typeof(name)=="string" ? new XML.node(name, attr) : name
  	n.up = t
  	n.root = t.root
  	n.id = t.childs.length
  	t.childs[n.id] = n
  	return n
  }
, set:function(key,val){
  	this.attr[key]=val
  	return this
  }
, cut:function(){
  	this.up && this.up.childs.splice(this.id,1)
  	return this
  }
, text:function(str){
  	this.childs.push(str)
  	return this
  }
, parse: function(str){
  	if (str.substr(0,5)==="<?xml") {
  		var end=str.indexOf("?>"), a=XML.parse_attr(str.substring(5,end))
  		if (a.version) this.ver=a.version
  		if (a.encoding) this.enc=a.encoding
  		str=str.substr(end+2)
		}
  	this.str=str
  	return this
  }
, toString: function(){
  	var t = this, a = t.attr, attr = "", sub = "" + t.childs.join("") + (t.str||"")
  	for (var k in a) if (a.hasOwnProperty(k)) attr += " "+k+'="'+a[k]+'"'
  	return "<"+t.name+attr+(sub?">"+sub+"</"+t.name:"/")+">"
  }
, getAll:function(name){
		var arr=[], n, i=0
		if (this.str) while (this.get());
  	while (n=this.childs[i++]) if (!name||name===n.name) arr.push(n)
		return arr
  }
, get:function(name,key,val){
  	var t = this, n = null, m
  	if (name) {
  		var i=0, test = function(n){
  			return name === n.name && (!key || key in n.attr) && (!val || n.attr[key] === val)
  		}
  		while (m=t.childs[i++]) if (test(m)) return m
  		if (t.str) while (m=t.get()) if (test(m)) return m
  	} else if (m = t.str.match(/\s*<([^ \/>]+)([^>]*)>\s*/m)) {
  		n = new XML.node(m[1], XML.parse_attr(m[2]) )
  		n.root = t.root
  		var len = m[0].length
  		if (m[2].charAt(m[2].length-1)!=="/") {
				var end = t.str.indexOf('</'+m[1]+'>')
  			n.str = t.str.substring(len, end)
  			len=end+3+m[1].length
  		}
  		t.str = t.str.substr( len )
  		t.childs.push(n)
  	}
  	return n
  }
}
if (typeof(exports)==="object") exports.XML = XML

/** Tests
!function(){

	TestCase("XML")
		.compare(
		  ""+XML()
		, '<?xml version="1.0" encoding="utf-8"?>')
		.compare(
		  ""+XML().add("root").root
		, '<?xml version="1.0" encoding="utf-8"?><root/>')
		.compare(
		  ""+XML().add("root", {name:"home"}).root
		, '<?xml version="1.0" encoding="utf-8"?><root name="home"/>')
		.compare(
		  ""+XML().add("root", {name:"home"}).text("a").root
		, '<?xml version="1.0" encoding="utf-8"?><root name="home">a</root>')
		.compare(
		  ""+XML().add("root").add("doc1").up.add("doc2").text("dokument").root
		, '<?xml version="1.0" encoding="utf-8"?><root><doc1/><doc2>dokument</doc2></root>')
		.done()
}()
//*/

