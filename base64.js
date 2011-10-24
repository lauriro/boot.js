


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



!function(w, S){
	if (!("btoa" in w && "atob" in w)) {
		var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("")
		  , m = {"=":0}
		  , i = 64;

		while(m[a[i]]=i--);

		w.btoa = function(s){
			for (var out=[],b,i=0,len=s.length;i<len;) {
				b = s.charCodeAt(i++)<<16 | s.charCodeAt(i++)<<8 | s.charCodeAt(i++);
				out.push( a[b>>18&0x3f], a[b>>12&0x3f], a[b>>6&0x3f], a[b&0x3f]);
			}
			if (len%=3) {
				out.length-=3-len;
				out.push(len==1?"==":"=");
			}
			return out.join("");
		}
	  w.atob = function(s){
			for (var out=[],b,i=0,o=0,s=s.split(""),len=s.length;i<len;) {
				b = m[s[i++]]<<18 | m[s[i++]]<<12 | m[s[i++]]<<6 | m[s[i++]];
				out[o++] = String.fromCharCode(b>>16 & 0xff, b>>8 & 0xff, b & 0xff);
			}
			if (s[len-1] == "=") out[--o] = out[o].substr(0, s[len-2] == "=" ? 1 : 2 );
			return out.join("");
		}
	}

	S.base64_encode = function(){return w.btoa(this)}
	S.base64_decode = function(){return w.atob(this)}
}(this, String.prototype);


/** Tests

TestCase("Base64").compare(
	"b".base64_encode()
, "Yg=="
, "ba".base64_encode()
, "YmE="
, "bas".base64_encode()
, "YmFz"
, "base64 encode".base64_encode()
, "YmFzZTY0IGVuY29kZQ=="
, "{@:#}".base64_encode()
, "e0A6I30="
, "String.base64_encode()"
).compare(
	"Yg==".base64_decode()
, "b"
, "YmE=".base64_decode()
, "ba"
, "YmFz".base64_decode()
, "bas"
, "YmFzZTY0IGVuY29kZQ==".base64_decode()
, "base64 encode"
, "e0A6I30=".base64_decode()
, "{@:#}"
, "String.base64_decode()"
).done()

//*/




