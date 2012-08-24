!function(w){var P="prototype",A=Array[P],D=Date[P],F=Function[P],N=Number[P],S=String[P],sl,xhrs=[],a,b,c
function I(o,n,s,x){o[n]=o[n]||new Function("x","y","return function(a,b,c,d){"+s+"}").apply(null,x||[o,n])}
function Nop(){}
I(F,"bind","var t=this;b=x.call(arguments,1);c=function(){return t.apply(this instanceof c?this:a,b.concat.apply(b,arguments))};if(t[y])c[y]=t[y];return c",[A.slice,P])
sl=F.call.bind(A.slice)
F.construct=function(a){return new(F.bind.apply(this,A.concat.apply([null],a)))}
F.partial=function(){var t=this,a=sl(arguments)
return function(){return t.apply(this,A.concat.apply(a,arguments))}}
F.cache=function(instance,keyFn,cache){var t=this,c=cache||{},f=function(){var a=arguments,i=!!instance||this instanceof f,k=keyFn?keyFn(a,t):i+":"+a.length+":"+A.join.call(a)
return k in c?c[k]:(c[k]=i?t.construct(a):t.apply(this,a))}
f.origin=t
f.cached=c
f.extend=function(){return t.extend.apply(t,arguments).cache(instance,keyFn,c)}
f[P]=t[P]
return f}
F.extend=function(){var a,t=this,i=0,f=function(){return t.apply(this,arguments)}
f[P]=Object.create(t[P])
while(a=arguments[i++])Object.merge(f[P],a);
return f}
F.chain=function(a){return "a b->->b.call(this,a.apply(this,arguments))".fold(Array.isArray(a)?a:sl(arguments),this)}
F.compose=function(){var a=[this].concat(sl(arguments)),t=a.pop()
return t.chain(a)}
F.guard=function(test,or){var t=this,f=test.fn(),o=(or||Nop).fn()
return function(){return(f.apply(this,arguments)?t:o).apply(this,arguments)}}
F.ttl=function(ms,fun){var t=this,s=setTimeout(function(){ms=0;fun&&fun()},ms)
return function(){clearTimeout(s)
ms&&t.apply(null,arguments)}}
F.once=function(ms){var t=this,s,args
return function(){clearTimeout(s)
args=arguments
s=setTimeout(function(){t.apply(null,args)},ms)}}
F.rate=function(ms){var t=this,n=0
return function(){var d=+new Date
if(d>n){n=d+ms
t.apply(null,arguments)}}}
F.byWords=function(i){var t=this
i|=0
return function(){var s=this,r=s,a=arguments
;(a[i]||"").replace(/\w+/g,function(w){a[i]=w;r=t.apply(s,a)})
return r}}
F.byKeyVal=function(){var t=this
return function(o){var s=this,a=sl(arguments),r
if(typeof o=="object")for(r in o){a[0]=r
a[1]=o[r]
r=t.apply(s,a)}else r=t.apply(s,a)
return r}}
w.Fn=function(s){var a=["_"],t=s.split("->")
if(t.length>1)while(t.length){s=t.pop()
a=t.pop().match(/\w+/g)||""
t.length&&t.push("(function("+a+"){return("+s+")})")}
return new Function(a,"return("+s+")")}.cache()
Fn.Nop=Nop
Fn.This=F.fn=function(){return this}
Fn.True=function(){return!0}
Fn.False=function(){return!1}
Fn.Init=function(){var t=this
return "init"in t&&t.init.apply(t,arguments)||t}
S.fn=function(){return Fn(this)}
a=Object
I(a,"create","x[y]=a;return new x",[Nop,P])
I(a,"keys","c=[];for(b in a)a.hasOwnProperty(b)&&c.push(b);return c")
I(a,"each","if(a)for(d in a)a.hasOwnProperty(d)&&b.call(c,a[d],d,a)")
a.merge=function(main){var o,i=1,k
while(o=arguments[i++])for(k in o)if(o.hasOwnProperty(k))main[k]=o[k]
return main}
a=Array
I(a,"isArray","return a instanceof Array")
I(a,"from","for(b=[],c=a.length;c--;b.unshift(a[c]));return b")
a="var t=this,l=t.length,o=[],i=-1;"
c="if(t[i]===a)return i;return -1"
I(A,"indexOf",a+"i+=b|0;while(++i<l)"+c)
I(A,"lastIndexOf",a+"i=(b|0)||l;i>--l&&(i=l)||i<0&&(i+=l);++i;while(--i>-1)"+c)
b=a+"if(arguments.length<2)b=t"
c="b=a.call(null,b,t[i],i,t);return b"
I(A,"reduce",b+"[++i];while(++i<l)"+c)
I(A,"reduceRight",b+"[--l];i=l;while(i--)"+c)
b=a+"while(++i<l)if(i in t)"
I(A,"forEach",b+"a.call(b,t[i],i,t)")
I(A,"every",b+"if(!a.call(b,t[i],i,t))return!1;return!0")
c=";return o"
I(A,"map",b+"o[i]=a.call(b,t[i],i,t)"+c)
b+="if(a.call(b,t[i],i,t))"
I(A,"filter",b+"o.push(t[i])"+c)
I(A,"some",b+"return!0;return!1")
I(A,"remove",a+"o=x(arguments);while(l--)if(o.indexOf(t[l])>-1)t.splice(l,1);return t",[sl])
I(A,"indexFor",a+"i=b?0:l;while(i<l)b.call(c,a,t[o=(i+l)>>1])<0?l=o:i=o+1;return i")
A.each=A.forEach
A.fold=A.reduce
A.foldr=A.reduceRight
A.unique=A.filter.partial(function(s,i,a){return i==a.lastIndexOf(s)})
!function(n){F[n]=S[n]=function(){var a=arguments,l=a[0]
a[0]=this.fn()
return A[n].apply(l,a)}}.byWords()("every filter each map fold foldr some")
S.trim=S.trim||S.replace.partial(/^[\s\r\n\u2028\u2029]+|[\s\r\n\u2028\u2029]+$/g,"")
S.camelCase=S.replace.partial(/[ _-]+([a-z])/g,function(_,a){return a.toUpperCase()})
S.format=function(m){var a=typeof m=="object"?m:arguments
return this.replace(/\{(\w+)\}/g,function(_,i){return a[i]})}
S.safe=function(){return this.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;")}
S.toAccuracy=N.toAccuracy=function(a){var x=(""+a).split("."),n=~~((this/a)+.5)*a
return ""+(1 in x?n.toFixed(x[1].length):n)}
N.words=S.words=function(steps,units,strings){var n=+this,i=0,s=strings||{"default":"{0} {1}"}
while(n>steps[i])n/=steps[i++];
i=units[i]
return(n<2&&s[i+"s"]||s[i]||s["default"]).format(n|0,i)}
S.humanSize=N.humanSize=N.words.partial([1024,1024,1024],["byte","KB","MB","GB"])
S.humanTime=N.humanTime=N.words.partial([60,60,24],["sec","min","hour","day"])
S.utf8_encode=function(){return unescape(encodeURIComponent(this))}
S.utf8_decode=function(){return decodeURIComponent(escape(this))}
S.ip2int=function(){var t=(this+".0.0.0").split(".")
return((t[0]<<24)|(t[1]<<16)|(t[2]<<8)|(t[3]))>>>0}
S.int2ip=N.int2ip=function(){var t=+this
return[t>>>24,(t>>>16)&0xFF,(t>>>8)&0xFF,t&0xFF].join(".")}
function p2(n){return n>9?n:"0"+n}
function p3(n){return(n>99?n:(n>9?"0":"00")+n)}
D.format=function(_){var t=this,x=D.format.masks[_]||_||D.format.masks["default"],g="get"+(x.slice(0,4)=="UTC:"?(x=x.slice(4),"UTC"):""),Y=g+"FullYear",M=g+"Month",d=g+"Date",w=g+"Day",h=g+"Hours",m=g+"Minutes",s=g+"Seconds",S=g+"Milliseconds"
return x.replace(/(")([^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|(YY(?:YY)?|M{1,4}|D{1,4}|([HhmsS])\4?|[uUaAZw])/g,function(a,b,c){return a=="YY"?(""+t[Y]()).slice(2):a=="YYYY"?t[Y]():a=="M"?t[M]()+1:a=="MM"?p2(t[M]()+1):a=="MMM"?D.monthNames[t[M]()]:a=="MMMM"?D.monthNames[t[M]()+12]:a=="D"?t[d]():a=="DD"?p2(t[d]()):a=="DDD"?D.dayNames[t[w]()]:a=="DDDD"?D.dayNames[t[w]()+7]:a=="H"?(""+t[h]()%12||12):a=="HH"?p2(t[h]()%12||12):a=="h"?t[h]():a=="hh"?p2(t[h]()):a=="m"?t[m]():a=="mm"?p2(t[m]()):a=="s"?t[s]():a=="ss"?p2(t[s]()):a=="S"?t[S]():a=="SS"?p3(t[S]()):a=="u"?(""+(t/1000)>>>0):a=="U"?+t:a=="a"?(t[h]()>11?"pm":"am"):a=="A"?(t[h]()>11?"PM":"AM"):a=="Z"?"GMT "+(-t.getTimezoneOffset()/60):a=="w"?1+Math.floor((t-new Date(t[Y](),0,4))/604800000):b?c:a})}
D.format.masks={"default":"DDD MMM DD YYYY hh:mm:ss","isoUtcDateTime":'UTC:YYYY-MM-DD"T"hh:mm:ss"Z"'};
D.monthNames="Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December".split(" ")
D.dayNames="Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")
I(D,"toISOString","return this.format('isoUtcDateTime')")
S.date=N.date=function(format){var t=this,d=new Date,m,n=+t||""+t
if(isNaN(n)){if(m=n.match(/(\d{4})-(\d{2})-(\d{2})/))d.setFullYear(m[1],m[2]-1,m[3])
else if(m=n.match(/(\d{2})\.(\d{2})\.(\d{4})/))d.setFullYear(m[3],m[2]-1,m[1])
else if(m=n.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/))d.setFullYear(m[3],m[1]-1,m[2])
m=n.match(/(\d{1,2}):(\d{2}):?(\d{2})?\.?(\d{3})?/)||[0,0,0]
if(n.match(/pm/i)&&m[1]<12)m[1]+=12
d.setHours(m[1],m[2],m[3]||0,m[4]||0)
n.indexOf("Z")&&d.setTime(d-(d.getTimezoneOffset()*60000))}else d.setTime((n<4294967296?n*1000:n))
return format?d.format(format):d}
D.daysInMonth=function(){return(new Date(this.getFullYear(),this.getMonth()+1,0)).getDate()}
D.startOfWeek=function(){var t=this
return new Date(t.getFullYear(),t.getMonth(),t.getDate()-(t.getDay()||7)+1)}
D.pretty=function(format,custom){var d=(new Date-this+1)/1000,a=D.prettySteps,i=a.length
if(d<a[0]){while(d>a[--i]);d/=a[i+1];
return((a=custom||D.prettyStrings)[(i=D.prettyUnits[i]+(d<2?"":"s"))]||a["default"]).format(d|0,i)}
return this.format(format)}
D.prettySteps=[8640000,2592000,604800,86400,3600,60,1]
D.prettyUnits=["month","week","day","hour","minute","second"]
D.prettyStrings={"default":"{0} {1} ago","day":"Yesterday"}
I(w,"XMLHttpRequest","return new ActiveXObject('MSXML2.XMLHTTP')")
w.xhr=function(method,url,cb,sync){var r=xhrs.shift()||new XMLHttpRequest
r.open(method,url,!sync)
r.onreadystatechange=function(){if(r.readyState==4){cb&&cb(r.responseText,r)
r.onreadystatechange=cb=Nop
xhrs.push(r)}}
return r}
if(!("JSON"in w)){w.JSON={map:{"\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t",'"':'\\"',"\\":"\\\\"},parse:Fn("t->new Function('return('+t+')')()"),stringify:new Function("o","if(o==null)return'null';if(o instanceof Date)return'\"'+o.toISOString()+'\"';var i,s=[],c;if(Array.isArray(o)){for(i=o.length;i--;s[i]=JSON.stringify(o[i]));return'['+s.join()+']'}c=typeof o;if(c=='string'){for(i=o.length;c=o.charAt(--i);s[i]=JSON.map[c]||(c<' '?'\\\\u00'+((c=c.charCodeAt())|4)+(c%16).toString(16):c));return'\"'+s.join('')+'\"'}if(c=='object'){for(i in o)o.hasOwnProperty(i)&&s.push(JSON.stringify(i)+':'+JSON.stringify(o[i]));return'{'+s.join()+'}'}return''+o")}}}(this)
Fn.Events={on:function(ev,fn,scope){var t=this,e=t._e||(t._e={})
;(e[ev]||(e[ev]=[])).push([fn,scope])
return t}.byWords(),non:function(ev,fn){var t=this
if(ev){if("_e"in t&&ev in t._e){if(fn)t._e[ev].remove(fn)
else delete t._e[ev]}}else delete t._e
return t}.byWords(),once:function(ev,fn,scope){return this.on(ev,fn,scope).on(ev,this.non.partial(ev,fn))},emit:function(ev){var t=this
if("_e"in t&&ev in t._e){for(var i=0,e=t._e[ev],a=e.slice.call(arguments,1);ev=e[i++];)ev[0].apply(ev[1]||t,a)}
return t}}
Fn.Iter=Fn.Items={each:function(fn){var t=this
t.items.forEach(fn,t)
return t},map:function(fn){return this.items.map(fn,this)},pluck:function(name){return this.items.map(function(item){return item.get(name)},this)},at:function(index,fn){var t=this,item=t.items[index]
return fn?(item&&fn.call(t,item),t):item},first:function(fn){return this.at(0,fn)},on_empty:function(fn){0 in this.items||fn()
return this}}
Fn.Lazy={wait:function(ignore){var t=this,k,hooks=[],hooked=[]
ignore=ignore||[]
for(k in t)if(typeof t[k]=="function"&&ignore.indexOf(k)==-1)!function(k){hooked.push(k)
t[k]=function(){hooks.push([k,arguments]);return t}}(k)
t.resume=function(){delete t.resume
var i=hooked.length,v
while(i--)delete t[hooked[i]];
while(v=hooks[++i])t[v[0]].apply(t,v[1]);
t=hooks=hooked=null}
return t}}
!function(w,d,P){var Event=w.Event||(w.Event={}),fn_id=0,kbMaps=[],S=String[P],rendering=false
function cacheEvent(el,type,fn,fix_fn){var _e=el._e||(el._e={})
type in _e||(_e[type]={})
return(_e[type][fn._fn_id||(fn._fn_id=++fn_id)]=type=="mousewheel"?function(e){if(!e)e=w.event
var delta="wheelDelta"in e?e.wheelDelta/120 : -e.detail/3
delta!=0&&fn.call(el,e,delta)}:fix_fn)}
function uncacheEvent(el,type,fn){var _e=el._e||{}
if(type in _e&&"_fn_id"in fn&&fn._fn_id in _e[type]){var _fn=_e[type][fn._fn_id]
delete _e[type][fn._fn_id]
return _fn}
return fn}
if("addEventListener"in w){Event.add=function(el,ev,fn){var _fn=cacheEvent(el,ev,fn,fn)
ev=="mousewheel"&&el.addEventListener("DOMMouseScroll",_fn,false)
el.addEventListener(ev,_fn,false)
return Event}
Event.remove=function(el,ev,fn){var _fn=uncacheEvent(el,ev,fn)
ev=="mousewheel"&&el.removeEventListener("DOMMouseScroll",_fn,false)
el.removeEventListener(ev,_fn,false)
return Event}}else{Event.add=function(el,ev,fn){el.attachEvent("on"+ev,cacheEvent(el,ev,fn,function(){fn.call(el,w.event)}))
return Event}
Event.remove=function(el,ev,fn){el.detachEvent("on"+ev,uncacheEvent(el,ev,fn))
return Event}}
Event.stop=function(e){"stopPropagation"in e&&e.stopPropagation()
"preventDefault"in e&&e.preventDefault()
e.cancelBubble=e.cancel=true
return e.returnValue=false}
Event.removeAll=function(el,ev){var _e=el._e||{}
for(var t in _e)
if(!ev||ev==t){var fnList=_e[t]
for(var fn in fnList)
Event.remove(el,t,fnList[fn])
delete _e[t]}}
Event.pointerX=function(e){if("changedTouches"in e)e=e.changedTouches[0]
return e.pageX||e.clientX+d.body.scrollLeft||0}
Event.pointerY=function(e){if("changedTouches"in e)e=e.changedTouches[0]
return e.pageY||e.clientY+d.body.scrollTop||0}
Event.pointer=function(e){var x=Event.pointerX(e),y=Event.pointerY(e)
return{x:x,y:y,left:x,top:y}}
function keyup(e){var key=e.keyCode||e.which,map=kbMaps[0]
if(key in map)map[key](key)
else if("num"in map&&key>47&&key<58)map.num(key-48)
else if("all"in map)map.all(key)
else{var i=0
while("bubble"in map&&(map=kbMaps[++i])){if(key in map)map[key](key)
else if("all"in map)map.all(key)}}}
Event.setKeyMap=function(map){kbMaps.unshift(map)
kbMaps.length==1&&Event.add(document,"keyup",keyup)}
Event.removeKeyMap=function(map){if(kbMaps.length>0){var index=kbMaps.indexOf(map)
kbMaps.splice(index==-1?0:index,1)
kbMaps.length==0&&Event.remove(document,"keyup",keyup)}}
function touchHandler(e){Event.stop(e)
var touch=e.changedTouches[0],ev=d.createEvent("MouseEvent")
ev.initMouseEvent(
e.type.replace("touch","mouse").replace("start","down").replace("end","up"),true,true,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,false,false,false,false,0,null)
touch.target.dispatchEvent(ev)}
function touchStart(e){if(e.touches.length==1){Event.add(d,"touchend",touchEnd).add(d,"touchcancel",touchEnd).add(d,"touchmove",touchHandler)
touchHandler(e)}}
function touchEnd(e){Event.remove(d,"touchend",touchEnd).remove(d,"touchcancel",touchEnd).remove(d,"touchmove",touchHandler)
touchHandler(e)}
Event.touch_as_mouse=function(el){Event.add(el,"touchstart",touchStart)}
var elCache={},fnCache={},dv=d.defaultView,getStyle=(dv&&"getComputedStyle"in dv?function(el,a){return el.style[a]||dv.getComputedStyle(el,null)[a]||null}:function(el,a){if(a=="opacity"){var opacity=el.filters("alpha").opacity
return isNaN(opacity)?1:(opacity?opacity/100:0)}
a=a.camelCase()
return el.style[a]||el.currentStyle[a]||null}),el_re=/([.#:])([-\w]+)/g,El=function(n,a){var pre={}
n=n.replace(el_re,function(_,o,s){pre[o=="."?(o="class",(o in pre&&(s=pre[o]+" "+s)),o):o=="#"?"id":s]=s
return ""})||"div"
var el=(elCache[n]||(elCache[n]=d.createElement(n))).cloneNode(true).set(pre)
return n in fnCache&&fnCache[n](el,a)||el.set(a)},css_map={"float":"cssFloat"},a={append:function(e,b){var t=this
if(e){if(typeof e=="string"||typeof e=="number")e=El.text(e)
else if(!("nodeType"in e)&&"length"in e){var len=e.length,i=0,f=d.createDocumentFragment()
while(i<len)t.append.call(f,e[i++]);
e=f}
if("nodeType"in e)t.insertBefore(e,b?(b===true?t.firstChild:typeof b=="number"?t.childNodes[b]:b):null)
"append_hook"in e&&e.append_hook()}
return t},after:function(e,b){e.parentNode.append(this,b?e:e.nextSibling)
return this},to:function(e,b){e.append(this,b)
return this},hasClass:function(n){return(" "+this.className+" ").indexOf(" "+n+" ")>-1},addClass:function(n){var t=this
t.className+=t.className==""?n:t.hasClass(n)?"":" "+n
return t}.byWords(),rmClass:function(n){var t=this
t.className=(" "+t.className+" ").replace(" "+n+" "," ").trim()
return t}.byWords(),toggleClass:function(n,s){if(s===void 0)s=!this.hasClass(n)
this[s?"addClass":"rmClass"](n)
return s}.byWords(),empty:function(){var t=this,n
while(n=t.firstChild)t.kill.call(n);
return t},kill:function(){var t=this
if(t.parentNode)t.parentNode.removeChild(t)
Event.removeAll(t)
if("empty"in t)t.empty()
if("kill_hook"in t)t.kill_hook()
return t},css:function(atr,val){var t=this
if(val)t.style[(css_map[atr]||atr).camelCase()]=val
else return getStyle(t,atr)
return t}.byKeyVal(),on:function(w,fn){Event.add(this,w,fn)
return this}.byWords(),non:function(w,fn){Event.remove(this,w,fn)
return this}.byWords(),set:function(args){var t=this,k=typeof args,v
if(args){if(k=="string"||k=="number"||"nodeType"in args||"length"in args)t.append(args)
else for(k in args){v=args[k]
if(k=="class"||k=="className")t.addClass(v)
else if(typeof v=="string")t.setAttribute(k,v)
else if(!v)t.removeAttribute(k)
else t[k]=v}}
return t},find:"querySelector"in d?function(sel){return this.querySelector(sel)}:function(sel){var rules=["_"],tag=sel.replace(el_re,function(_,o,s){rules.push(o=="."?"(' '+_.className+' ').indexOf(' "+s+" ')>-1":o=="#"?"_.id=='"+s+"'":"_."+s)
return ""})||"*",fn=rules.join("&&").fn(),el,els=this.getElementsByTagName(tag),i=0
while(el=els[i++])if(fn(el))return "to"in el?el:extend(el)}}
function extend(e,p,k){if(e){if(!p)p=El[P]
for(k in p)e[k]=p[k]}
return e}
El.get=function(el){if(typeof el=="string")el=d.getElementById(el)
return "to"in el?el:extend(el)}
El.cache=function(n,el,custom){elCache[n]=typeof el=="string"?El(el):el
if(custom){fnCache[n]=custom}}
El.cache.el=elCache
El.cache.fn=fnCache
El.text=function(str){return d.createTextNode(str)}
if(!(El[P]=extend((w.HTMLElement||w.Element||{})[P],a))){El[P]=a
var c=d.createElement
extend(d.body)
d.createElement=function(n){return extend(c(n))}
/*@cc_on
try{document.execCommand('BackgroundImageCache',false,true)}catch(e){}
@*/}
w.El=El
function custom_init(el,data){if(!rendering){/*@cc_on el=El.get(el);@*/
var template,node=el.firstChild
if(template=el.getAttribute("data-template")){El.cache.fn[template].call(el,el,data)
el.removeAttribute("data-template")}
for(;node;node=node.nextSibling)if(node.nodeType==1)custom_init(node,data)}}
function template(id,parent){var t=this
t.id=id
t.el=El("div")
t.el.haml_done=function(){var str=t.el.innerHTML,fn=str.indexOf("data-template")>-1?custom_init:null
if(str.indexOf("{{")<0&&str.indexOf("{%")<0&&t.el.childNodes.length==1){El.cache(t.id,t.el.firstChild,fn)}else{t.fn=El.liquid(str)
El.cache(t.id,t,t.parse.bind(t))}
return parent}
return t}
template.prototype={cloneNode:Fn.This,set:Fn.This,parse:function(el,data){var t=this
t.el.innerHTML=t.fn(data)
custom_init(t.el,data)
el=t.el.childNodes
return(el.length==1)?el[0]:Array.from(el)}}
El.liquid=function(str){var s="var _=[];with(o||{}){_.push('"+str.replace(/\s+/g," ").replace(/{{\s*((?:[^}]|}(?!}))+)\s*}}/g,function(_,a){return "',("+a.replace(/([^|])\|\s*([^|\s:]+)(?:\s*\:([^|]+))?/g,"$1).$2($3")+"),'"}).replace(/{%\s*(if|for)?\s*((?:[^%]|%(?!}))+)%}/g,function(_,a,b,m){if(a){if(m=b.match(/^(\w+) in (\w+)?/)){a="var limit,offset,i=0,w,q="+(m[2]?"o."+m[2]+"||{}":"")+b.slice(m[0].length).replace(/^ (limit|offset):(\d+)/ig,";$1=$2")+";if(q)for"
b="w in q)if(q.hasOwnProperty(w)){if(offset&&offset--)continue;i++;if(limit&&i>limit)break;var "+m[1]+"=q[w];"
m=""}else m="){"}
return(a?"');"+a+"("+b.replace(/^\(|\)\s*$/g,"")+m:b=="else "?"')}else{":"')};")+"_.push('"})+"')}return _.join('')"
return new Function("o",s)}
El.haml=function(str){var root=El("div"),i,parent=root,stack=[-1]
str.replace(/^( *)((?:[.#%][\w:\-]+)+)?(\{.*\})? ?(.*)$/igm,function(all,indent,name,args,text){if(all){var el,m
i=indent.length
while(i<=stack[0]){stack.shift()
parent=("haml_done"in parent)?parent.haml_done():parent.parentNode}
if(name){args=args?JSON.parse(args):{}
el=El(name.replace(/^[^%]/,"%div$&").substr(1),args)
if(text)el.append(text.replace(/'/g,"\\'"))
if(m=name.match(/^%(\w+)/))m[1]in fnCache&&el.setAttribute("data-template",m[1])}else{m=text.split(" ")
switch(m[1]){case"template":el=new template(m[2],parent).el
break
case"markdown":break
default:el=El.text(args?all:text)}}
!el.haml_done&&parent.append(el)
if(el.nodeType!==3){parent=el
stack.unshift(i)}}
return ""})
i=root.childNodes
return i.length==1?i[0]:Array.from(i)}
El.render=function(id,data,parent){rendering=true
var src=El.get(id)
new template(id).el.append(El.haml(src.innerHTML)).haml_done()
rendering=false}
S.capitalize=function(){return this.charAt(0).toUpperCase()+this.slice(1)}
S.upcase=S.toUpperCase
S.downcase=S.toLowerCase
S.size=function(){return this.length}}(this,document,"prototype")
!function(w,d,s){var ls=d.getElementsByTagName(s),tag=ls[ls.length-1]
if(!("execScript"in w)){w.execScript=(function(o,Object){return(1,eval)("(Object)")===o})(Object,1)?eval:"d t a->s->d.body[a](d.createElement(s))[a](d.createTextNode(s))".fn()(d,s,"appendChild")}
w.load=function(f,cb){if(!Array.isArray(f))f=[f]
var i=0,len=f.length,res=[]
while(i<len)!function(i){xhr("GET",f[i].replace(/^[^\/]/,w.load.path+"$&"),function(str){res[i]=str
if(!--len){execScript(res.join(";"))
cb&&cb()
res=null}}).send()}(i++)}
w.load.path=tag.src.replace(/[^\/]+$/,"")
execScript(tag.innerHTML+";")}(this,document,"script")
