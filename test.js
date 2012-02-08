


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



var _tests = []
function TestCase(name){
	var t = this
	if (t instanceof TestCase === false) return new TestCase(name)
  t.begin = new Date()
  t.name = name
  t.tests = []
  t.pass = 0
  t.fail = []
  t.unitCase = 0;
  _tests.push(t)
  return t
}
TestCase.prototype = {
  compare:function(test, expected, comment){
  	var i = 0, len = arguments.length-1;
  	if (len%2 == 0) {
  		this.unitName = arguments[len];
  		this.unitCase = 0;
		}
    for (; i<len;i+=2) {
    	this.unitCase++;
      if (arguments[i] === arguments[i+1]) this.pass++
      else this.fail.push( ((this.unitName || "") + " #" + this.unitCase + " [" + arguments[i] + " != "+arguments[i+1] + "]").safe() )
    }
    return this
  }
, ok:function(){
    for (var i = 0, len = arguments.length; i<len;i++) {
      if (arguments[i]) this.pass++
      else this.fail.push('')
    }
    return this
  }
, done:function(){
    this.end = new Date()
    this.time = this.end - this.begin;
    this.status = this.fail.length == 0 ? 'OK' : 'Fail';
  }
, result:function(){
		var str = this.name + " " + this.pass + " passed, " + this.fail.length + " failed in "+this.time+" ms."
		if (this.fail.length) str += this.fail.join("<br>")
		return El("li."+(this.fail.length?"fail":"pass"), str);
  }
}
TestCase.read = function(file){
  if (file instanceof Array) {
    file.forEach(this.read)
  } else {
    var req = new XMLHttpRequest(), exports = {}
    req.open("GET", file, false)
    req.send()
    var q = req.responseText
    	//.replace(/\/\/.*$/gm,"")
    	//.replace(/\/\*\* ?(Test[^s]|Tes[^t]|Te[^s]|T[^e]|[^T])*\n(([^*]\/|[^\/])*)\*\//mg,"")
    	.replace(/\/\*\* Tests.*\n((:?[^*]\/|[^\/])*)\*\//mg,function(_,s){
    	eval(s)
    })
  }
}

