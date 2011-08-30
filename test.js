


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
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
    this.status = this.fail.length == 0 ? 'OK' : 'Fail';
  }
, toString:function(){
		var str = this.name + " " + this.pass + " passed, " + this.fail.length + " failed"
		if (this.fail.length) str += this.fail.join("<br>")
		return "<li>"+str+"</li>";
  }
}
TestCase.read = function(file){
  if (file instanceof Array) {
    file.forEach(this.read)
  } else {
    var req = new XMLHttpRequest(), exports = {}
    req.open("GET", file, false)
    req.send()
    var q = req.responseText.split("\/** Tests")
    q.length > 1 && eval(q[1])
  }
}

