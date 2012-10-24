function BitArray(){
	this.arr = []
}

BitArray.prototype = {
	set: function(bit, val) {
		if (val) this.arr[bit>>>5] |= 1 << (bit&0xff)
		else this.arr[bit>>>5] &= ~(1 << (bit&0xff))
	},
	get: function(bit) {
		return 1 & (this.arr[bit>>>5] >>> (bit&0xff))
	},
	count: function() {
		var v
		, sum = 0, arr = this.arr, len = arr.length

		while (len--) {
			v = arr[len]
			v = v - ((v >> 1) & 0x55555555)
			v = (v & 0x33333333) + ((v >> 2) & 0x33333333)
			sum += ((v + (v >> 4) & 0xF0F0F0F) * 0x1010101) >> 24
		}
		return sum
	},
	toString: function() {
		return this.arr.map(function(val){
			return ((val>>>0).toString(2).split("").reverse().join("")+"0000000000000000000000000000000").slice(0, 32)
		}).join("")
	}
}

