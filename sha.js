


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



!function(S, nuls) {
	function l(x, n) { // rotate left
		return (x<<n) | (x>>>(32-n))
	}
	function i2s(a) { // integer array to hex string
		var i = a.length
		while (i--) a[i] = ("0000000"+(a[i]>>>0).toString(16)).slice(-8)
		return a.join("")
	}
	function s2B(s) { // string to byte array
		var a = unescape(encodeURIComponent(s)).split(""), i = a.length
		while (i--) a[i] = a[i].charCodeAt()
		return a
	}
	function B2w(a) { // byte array ta integer array
		var i = 0, bin = [], len = a.length
		while (i < len) bin[i>>2] = a[i++]<<24|a[i++]<<16|a[i++]<<8|a[i++]
		return bin
	}

	function sha_init(bin, len) {
		if (typeof bin == "string") {
			bin = s2B(bin)
			len = bin.length
			bin = B2w(bin)
		} else if (!len) len = bin.length * 4

		bin[len>>2] |= 0x80 << (24 - (31 & len<<3))
		return bin.concat(nuls.slice( bin.length & 15 ), [0, len<<3])
	}

	function sha1(data, raw, _len) {
		var a, b, c, d, e, t, j
		, i = 0
		, w = []
		, A = 0x67452301
		, B = 0xefcdab89
		, C = 0x98badcfe
		, D = 0x10325476
		, E = 0xc3d2e1f0
		, bin = sha_init(data, _len)
		, len = bin.length

		while (i < len) {
			w = bin.slice(i, i+=(j=16))
			while (j < 80) w[j++] = l(w[j-4]^w[j-9]^w[j-15]^w[j-17], 1)
			a = A
			b = B
			c = C
			d = D
			e = E
			j = 0
			while (j<80) {
				t = (j<20 ? ((b&c)|(~b&d))+0x5A827999 : j<40 ? (b^c^d)+0x6ED9EBA1 : j<60 ? ((b&c)|(b&d)|(c&d))+0x8F1BBCDC : (b^c^d)+0xCA62C1D6)+l(a,5)+e+w[j++]
				e = d
				d = c
				c = l(b,30)
				b = a
				a = t>>>0
			}
			A += a
			B += b
			C += c
			D += d
			E += e
		}
		t = [A, B, C, D, E]
		return raw ? t : i2s(t)
	}

	S.sha1 = function(raw) {
		return sha1(""+this, raw)
	}


	function r(x, n) { // rotate right
		return (x>>>n) | (x<<(32-n))
	}

	function sha256(data, raw, _len) {
		var a, b, c, d, e, f, g, h, t1, t2, j
		, i = 0
		, w = []
		, A = 0x6a09e667
		, B = 0xbb67ae85
		, C = 0x3c6ef372
		, D = 0xa54ff53a
		, E = 0x510e527f
		, F = 0x9b05688c
		, G = 0x1f83d9ab
		, H = 0x5be0cd19
		, bin = sha_init(data, _len)
		, len = bin.length
		, K = [ 
			0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5
			, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174
			, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da
			, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967
			, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85
			, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070
			, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3
			, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
		]

		while (i < len) {
			w = bin.slice(i, i+=(j=16))
			while (j < 64) {
				t1 = w[j-2]
				t2 = w[j-15]
				w[j] = (r(t1, 17)^r(t1,19)^(t1>>>10)) + w[j-7] + (r(t2,7)^r(t2,18)^(t2>>>3)) + w[++j-17] // j-16
			}
			a = A
			b = B
			c = C
			d = D
			e = E
			f = F
			g = G
			h = H
			j = 0
			while (j < 64) {
				t1 = h + (r(e,6)^r(e,11)^r(e,25)) + ((e&f)^((~e)&g)) + K[j] + w[j++]
				t2 = (r(a,2)^r(a,13)^r(a,22)) + ((a&b)^(a&c)^(b&c))
				h = g
				g = f
				f = e
				e = (d + t1)>>>0
				d = c
				c = b
				b = a
				a = (t1 + t2)>>>0
			}
			A += a
			B += b
			C += c
			D += d
			E += e
			F += f
			G += g
			H += h
		}
		t = [A, B, C, D, E, F, G, H]
		return raw ? t : i2s(t)
	}

	S.sha256 = function(raw) {
		return sha256(""+this, raw)
	}

	//** HMAC 
	function hmac(hasher, blocksize, key, txt, raw) {
		var i = 0, ipad = [], opad = [], txt_len
		key = (key.length > 4*blocksize) ? hasher(key, "raw") : B2w(s2B(key))
	
		while (i<blocksize) {
			ipad[i]=key[i]^0x36363636
			opad[i]=key[i++]^0x5c5c5c5c
		}

		if (typeof txt == "string") {
			txt = s2B(txt)
			txt_len = txt.length
			txt = B2w(txt)
		} else txt_len = txt.length * 4
		i = hasher(opad.concat(hasher(ipad.concat(txt), 1, 64 + txt_len)), 1)
		return raw ? i : i2s(i)
	}

	S.hmac_sha1 = function(key) {
		return hmac(sha1, 16, key, ""+this)
	}

	S.hmac_sha256 = function(key) {
		return hmac(sha256, 16, key, ""+this)
	}
  //*/
	
	//** PBKDF2
	String.pbkdf2 = function (password, salt, count, length) {
		var u, ui, i, j, k
		, out = []
		, wlen = length>>2 || 5

		/**
		 * A minimum iteration count of 1,000 is recommended. 
		 * For especially critical keys, 
		 * or for very powerful systems 
		 * or systems where user-perceived performance is not critical, 
		 * an iteration count of 10,000,000 may be appropriate.
		 */

		count = count || 1000

		for (k = 1; out.length < wlen; k++) {
			u = ui = hmac(sha1, 16, password, salt+String.fromCharCode.call(null, k >> 24 & 0xF, k >> 16 & 0xF, k >>  8 & 0xF, k  & 0xF), 1)

			for (i=1; i<count; i++) {
				ui =  hmac(sha1, 16, password, ui, 1)
				for (j=ui.length; j--;) u[j] ^= ui[j]
			}

			out = out.concat(u)
		}
		return i2s(out).slice(0, length*2 || 40)
	}

	//*/
	

}(String.prototype, [0,0,0,0,0,0,0,0,0,0,0,0,0,0]);


/** Tests

TestCase("SHA").compare(
	"".sha1()
, "da39a3ee5e6b4b0d3255bfef95601890afd80709"
, "abc".sha1()
, "a9993e364706816aba3e25717850c26c9cd0d89d"
, "abc1ö".sha1()
, "ed9006416a835d01c054c9272c52a1885571a9fc"
, "kkkkkkkkkkkkkkkkkkkkkkkkk".sha1()
, "005cb6065579bb259bdc966dcc3d800b4c0e631b"
, "efgfsfgjfkdslkeföl".sha1()
, "3228c5ff9b3f008816452fd2c55b6063abfcebf3"
, "String.sha1()"
).compare(
	"".sha256()
, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
, "abc".sha256()
, "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
, "abc1ö".sha256()
, "555944eb51d8305f11989edc037c0a0fa9999b470c327b3940377fd2c6507ab3"
, "String.sha256()"
).compare(
	"q".hmac_sha1("w")
, "697e084de5f14b207f78bd51e748fdd625e5d4e3"
, "8d48be98c11eb482f08afbce6d1902b0f0c028f987d58a595fd7fbf365a3dcc95".hmac_sha1("w23e")
, "d2308ef241f9163aa65105959600f870f8c0e60b"
, "a".hmac_sha1("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551")
, "658b181b4f17bb6223cf448e8ed0c54cea8f6a0b"
, "päike".hmac_sha1("abc1ö")
, "0ea68376b52a7de043d75a4551d29301d487b393"
, "String.hmac_sha1()"
).compare(
	"q".hmac_sha256("w")
, "aa0faac9b60e5d328675f33221327654ad791e2935a4ae12e94c1ac939afdf22"
, "8d48be98c11eb482f08afbce6d1902b0f0c028f987d58a595fd7fbf365a3dcc95".hmac_sha256("w23e")
, "1769221eb6c4f6e52bed133c64d1ba118ef72bfaf91b39f065e0aa43a4788031"
, "a".hmac_sha256("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b8551")
, "4d7a8cb0bb07af2b8ef6273aa50852033eea4236c97934b58727f7ad68180ad4"
, "String.hmac_sha256()"
).compare(
	String.pbkdf2("password", "salt", 1)
, "0c60c80f961f0e71f3a9b524af6012062fe037a6"
, String.pbkdf2("password", "salt", 2)
, "ea6c014dc72d6f8ccd1ed92ace1d41f0d8de8957"
//, String.pbkdf2("password", "salt", 4096)
//, "4b007901b765489abead49d926f721d065a429c1"
//, String.pbkdf2("pass\0word", "sa\0lt", 4096, 16)
//, "56fa6aa75548099dcc37d7f03425e0c3"
//, String.pbkdf2("passwordPASSWORDpassword", "saltSALTsaltSALTsaltSALTsaltSALTsalt", 4096, 25)
//, "3d2eec4fe41c849b80c8d83662c0e44a8b291a964cf2f07038"
, "String.pbkdf2"
).done()

//*/


