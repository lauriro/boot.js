

!function(S) {
	var tables = {}

  function reverse(x, n) {
    var b = 0
    while (n--) {
      b = b * 2 + x % 2
      x /= 2
      x -= x % 1
    }
    return b
  }

	function fill_table(polynomial) {
		var i, j, c, tbl = []

		for (i = 255; i >= 0; i--) {
			c = reverse(i, 32)

			for (j = 0; j < 8; j++) {
				c = ((c * 2) ^ (((c >>> 31) % 2) * polynomial)) >>> 0
			}

			tbl[i] = reverse(c, 32)
		}
		return tables[polynomial] = tbl
	}

	//function crc(s/*, polynomial = 0x04C11DB7, initialValue = 0xFFFFFFFF, finalXORValue = 0xFFFFFFFF*/) {
	function crc(polynomial, initialValue, finalXORValue, s) {
		var i = 0
		, crc = initialValue
		, tbl = tables[polynomial] || fill_table(polynomial)

		s += ""

		for (; i < s.length; i++) {
			crc = (crc>>>8) ^ tbl[ 0xFF & (crc ^ s.charCodeAt(i)) ]
		}

		return (crc ^ finalXORValue) >>> 0
	}

	S.crc32 = crc.bind(null, 0x04C11DB7, 0xFFFFFFFF, 0xFFFFFFFF)

}(String)

/*
console.log(String.crc32('test').toString(16), "D87F7E0C")
console.log(String.crc32('test', 0x04c11db7, 0, 0xFFFFFFFF).toString(16), "6C45EEF")
console.log(String.crc32('test', 0x04c11db7, 0xFFFFFFFF, 0).toString(16), "278081F3")
console.log(String.crc32('test', 0x04c11db7, 0, 0).toString(16), "F93BA110")
*/

/** Tests

TestCase("CRC").compare(
	String.crc32('test').toString(16)
, "d87f7e0c"
, "String.crc32()"
).done()

//*/


