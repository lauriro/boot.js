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
	toString: function() {
		return this.arr.map(function(val){
			return ((val>>>0).toString(2).split("").reverse().join("")+"0000000000000000000000000000000").slice(0, 32)
		}).join("")
	}
}

