/*
 A Succinct Trie for Javascript - http://stevehanov.ca/blog/index.php?id=120

 By Steve Hanov
 Released to the public domain.

 This file contains functions for creating a succinctly encoded trie structure
 from a list of words. The trie is encoded to a succinct bit string using the
 method of Jacobson (1989). The bitstring is then encoded using BASE-64. 
 
 The resulting trie does not have to be decoded to be used. This file also
 contains functions for looking up a word in the BASE-64 encoded data, in
 O(mlogn) time, where m is the number of letters in the target word, and n is
 the number of nodes in the trie.

 QUICK USAGE:

 Suppose we let data be some output of the demo encoder:

 var data = {
    "nodeCount": 37,
    "directory": "BMIg",
    "trie": "v2qqqqqqqpIUn4A5JZyBZ4ggCKh55ZZgBA5ZZd5vIEl1wx8g8A"
 };

 var frozenTrie = new SuccinctTrie().load( Data.trie, Data.directory, Data.nodeCount);

 alert( frozenTrie.lookup( "hello" ) ); // outputs true
 alert( frozenTrie.lookup( "kwijibo" ) ); // outputs false

*/   



/**
    The width of each unit of the encoding, in bits. Here we use 6, for base-64
    encoding.
    Math.log(64)/Math.LN2
 */

!function(root){

var BitsInByte = [ 
		0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4
	, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5
	, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5
	, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6
	, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5
	, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6
	, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6
	, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7
	, 1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5
	, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6
	, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6
	, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7
	, 2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6
	, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7
	, 3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7
	, 4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8 ]
var MaskTop= [ 0x3f, 0x1f, 0x0f, 0x07, 0x03, 0x01, 0x00 ]

var arr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split("")
  , map = {}

for(var i=0;i<64;map[arr[i]]=i++);


/**
  Given a string of data (eg, in BASE-64), the BitString class supports
  reading or counting a number of bits from an arbitrary position in the
  string.
*/
function BitString( str ) {
	this.load(str)
	return this
}

BitString.prototype = {
  load:function(str){
  	this.bytes = (str||"").split("")
  }
  /**
    Decode bytes to bits for writing.
  */
, decode:function(){
  	this.bits = []
  	for (var i=0, len=this.bytes.length; i<len;i++){
  		var c = map[this.bytes[i]]
  		this.bits.push((c>>5)&1, (c>>4)&1, (c>>3)&1, (c>>2)&1, (c>>1)&1, (c>>0)&1)
  	}
  }

  /**
    Write some data to the bit string. The number of bits must be 32 or fewer.
  */
, write: function( data, numBits ) {
  	"bits" in this || this.decode()
  	while( numBits-- ) {
  		this.bits.push( data & ( 1 << numBits ) ? 1 : 0);
  	}
  }

  /**
    Encode bits to bytes for reading.
  */
, encode:function(){
  	if ("bits" in this) {
  		var chars = [], b = 0, bit = 0

  		for (var i=0, len=this.bits.length; i < len; i++ ) {
  			b = ( b << 1 ) | this.bits[i];
  			bit += 1;
  			if ( bit === 6 ) {
  				chars.push( arr[b] );
  				bit = b = 0;
  			}
  		}

  		bit && chars.push( arr[b << ( 6 - bit )] );

  		this.bytes = chars;
  		delete this.bits
  	}
  	return this
  }

  /**
    Returns a decimal number, consisting of a certain number, n, of bits
    starting at a certain position, p.
  */
, get: function( p, n ) {
  	var mod = p % 6
  	  , result = map[ this.bytes[ p / 6 | 0 ] ] & MaskTop[ mod ]
  	  , l = 6 - mod;

  	// case 1: bits lie within the given byte
  	if ( mod + n <= 6 ) return result >> ( l - n );

  	// case 2: bits lie incompletely in the given byte

  	p += l;
  	n -= l;

  	while ( n >= 6 ) {
  		result = (result << 6) | map[ this.bytes[ p / 6 | 0 ] ];
  		p += 6;
  		n -= 6;
  	}

  	if ( n > 0 ) return (result << n) | ( map[ this.bytes[ p / 6 | 0 ] ] >> ( 6 - n ) );

  	return result;
  }
  /**
    Get the bitstring represented as a javascript string of bytes
  */
, getData: function() {
  	return this.encode().bytes.join("");
  }

  /**
    Counts the number of bits set to 1 starting at position p and
    ending at position p + n
  */
, count: function( p, n ) {
  	var count = 0;
  	while( n >= 8 ) {
  		count += BitsInByte[ this.get( p, 8 ) ];
  		p += 8;
  		n -= 8;
  	}
  	return count + BitsInByte[ this.get( p, n ) ];
  }

  /**
    Returns the number of bits set to 1 up to and including position x.
    This is the slow implementation used for testing.

, rank: function( x ) {
  	var rank = 0;
  	for( var i = 0; i <= x; i++ ) {
  		if ( this.get(i, 1) ) {
  			rank++;
  		}
  	}
  	return rank;
  }
  */
};

/**
    The rank directory allows you to build an index to quickly compute the
    rank() and select() functions. The index can itself be encoded as a binary
    string.
 */
function RankDirectory( nodeCount, l2Size, directoryData, bitData ) {
  var numBits = this.numBits = nodeCount*2+1;
  this.l2Size = l2Size;
  var l1Size = this.l1Size = l2Size*l2Size;
  this.l1Bits = (( Math.log( numBits ) / Math.LN2 )+.5)>>>0;
  this.l2Bits = (( Math.log( l1Size ) / Math.LN2 )+.5)>>>0;
  this.sectionBits = (l1Size / l2Size - 1) * this.l2Bits + this.l1Bits;
  this.rankCache = {0:{},1:{}}
  this.directory = new BitString( directoryData );
  this.data = new BitString( bitData );
  return this
}



RankDirectory.prototype = {
  load:function( directoryData, bitData ){
  	this.directory.load( directoryData );
  	this.data.load( bitData );
  	return this
  }
, fill:function( data ){
  	var p = 0, i = 0, count1 = 0, count2 = 0, L2 = this.l2Size, directory = new BitString();

  	var last = this.numBits - L2

  	while( p <= last ) {
  		count2 += data.count( p, L2 );
  		i += L2;
  		p += L2;
  		if ( i === this.l1Size ) {
  			count1 += count2;
  			directory.write( count1, this.l1Bits );
  			count2 = i = 0;
  		} else {
  			directory.write( count2, this.l2Bits );
  		}
  	}
  	this.directory = directory.encode()
  	this.data = data
  	return this
  }

  /**
  		Returns the string representation of the directory.
  */
, getData: function() {
  	return this.directory.bytes.join("");
  }

  /**
  		Returns the number of 1 or 0 bits (depending on the "which" parameter) to
  		to and including position x.
  */
, rank: function( which, x ) {
		if ( which === 0 ) return x - this.rank( 1, x ) + 1;

		var rank = 0;
		var o = x;
		var sectionPos = 0;

		if ( o >= this.l1Size ) {
			sectionPos = ( o / this.l1Size | 0 ) * this.sectionBits;
			rank = this.directory.get( sectionPos - this.l1Bits, this.l1Bits );
			o = o % this.l1Size;
		}

		if ( o >= this.l2Size ) {
			sectionPos += ( o / this.l2Size | 0 ) * this.l2Bits;
			rank += this.directory.get( sectionPos - this.l2Bits, this.l2Bits );
		}
		var mod = x % this.l2Size

		rank += this.data.count( x - mod, mod + 1 );

		return rank;
	}

	/**
			Returns the position of the y'th 0 or 1 bit, depending on the "which"
			parameter.
	*/
, select: function( which, find ) {
  	var lo = 0, hi = this.numBits, mid, val = -1, found;

  	while ( lo <= hi ) {
  		mid = lo + ((hi - lo)>>>1);
  		//*
  		found = this.rankCache[which][mid] || (this.rankCache[which][mid] = this.rank( which, mid ));
  		/*/
  		found = this.rank( which, mid );
  		//*/

  		if ( found < find ) {
  			lo = mid + 1;
  		} else {
  			// We have to continue searching after we have found it,
  			// because we want the _first_ occurrence.
  			if ( found === find )  val = mid;
  			hi = mid - 1;
  		}
  	}
  	return val;
  }
};


/**
    The SuccinctTrie is used for looking up words in the encoded trie.

    @param data A string representing the encoded trie.

    @param directoryData A string representing the RankDirectory. The global L1
    and L2 constants are used to determine the L1Size and L2size.

    @param nodeCount The number of nodes in the trie.
  */
/**
  You can decrease space usage and performance by increasing the L2 constant, 
  and setting L1 = L2*L2. This controls the number of bits summarized in each 
  section of the rank directory. L2 is the maximum number of bits that have to 
  be scanned to implement rank(). More bits means fewer directory entries, but 
  the select() and rank() functions will take longer to scan the range of bits.
*/

function SuccinctTrie( rankBits ) {
	this.L2 = rankBits || 32
	return this
}

SuccinctTrie.prototype = {
  load:function( nodeCount, data, directoryData ){
  	this.nodeCount = nodeCount;
  	this.letterStart = nodeCount * 2 + 1;
  	this.data = new BitString( data )
  	if (directoryData) {
  		this.rank = new RankDirectory( nodeCount , this.L2).load( directoryData, data )
		}
		return this
  }
, decode:function(){
  	this.previousWord = "";
  	this.root = [" ", false, [] ];
  	this.cache = [ this.root ];
  	this.nodeCount = 1;
  	//TODO:decode existing data from this.data
  }

  /**
    Look-up a word in the trie. Returns true if and only if the word exists
    in the trie.
  */
, lookup: function( word ) {
  	"root"in this && this.encode()
		"rank"in this || this.getRankDirectory()
		var t = this, mid = 0, i = 0, len = word.length, a = "a".charCodeAt(0)

		for (;i < len; i++ ) {
			var find = word.charCodeAt(i) - a, found
			  , lo = t.rank.select( 0, mid+1 ) - mid
			  , hi = t.rank.select( 0, mid+2 ) - mid - 2;

			while ( lo <= hi ) {
				mid = lo + ((hi-lo)>>>1)
				found = t.data.get( t.letterStart + mid * 6 + 1, 5 );
				if ( found === find ) break
				if ( found > find ) hi = mid - 1
				else lo = mid + 1
			}
			if (lo>hi) return false
		}
  	return t.data.get( t.letterStart + mid * 6, 1 ) === 1;
	}
	/**
	  Inserts a word into the trie. This function is fastest if the words are
	  inserted in alphabetical order.
	*/
, insert: function( word ) {
  	"root"in this || this.decode()

  	var commonPrefix = 0;
  	for( var i = 0; i < Math.min( word.length, this.previousWord.length ); i++ ){
  		if ( word[i] !== this.previousWord[i] ) { break; }
  		commonPrefix += 1;
  	}

  	this.cache.length = commonPrefix + 1;
  	var node = this.cache[ this.cache.length - 1 ];

  	for( i = commonPrefix; i < word.length; i++ ) {
  		var next = [ word[i], false, [] ];
  		this.nodeCount++;
  		node[2].push( next );
  		this.cache.push( next );
  		node = next;
  	}
  	node[1] = true;
  	this.previousWord = word;
  }
, apply: function(){
  	this.encode()
	}
, getRankDirectory: function(){
  	return this.rank = new RankDirectory( this.nodeCount, this.L2 ).fill( this.data );
  }

  /**
    Apply a function to each node, traversing the trie in level order.
  */
, applyNodes: function( fn ) {
  	var level = [ this.root ];
  	while( level.length > 0 ) {
  		var node = level.shift();
  		for( var i = 0, len = node[2].length; i < len; i++ ) {
  			level.push( node[2][i] );
  		}
  		fn( node );
  	}
  }
  
  /**
    Encode the trie and all of its nodes. Returns a string representing the
    encoded data.
  */
, encode: function() {
  	if ("root"in this) {
  		// Write the unary encoding of the tree in level order.
  		var bits = new BitString();
  		bits.write( 0x02, 2 );
  		this.applyNodes( function( node ) {
  			for( var i = 0; i < node[2].length; i++ ) {
  				bits.write( 1, 1 );
  			}
  			bits.write( 0, 1 );
  		});

  		// Write the data for each node, using 6 bits for node. 1 bit stores
  		// the "final" indicator. The other 5 bits store one of the 26 letters
  		// of the alphabet.

  		var a = ("a").charCodeAt(0);
  		this.applyNodes( function( node ) {
  			var value = node[0].charCodeAt(0) - a;
  			if ( node[1] ) {
  				value |= 0x20;
  			}
  			bits.write( value, 6 );
  		});

  		this.data = bits
  		delete this.rank
  		delete this.root

  		return bits.getData();
    }
  }
};

	root.Trie = root.SuccinctTrie = SuccinctTrie;
	root.FrozenTrie = SuccinctTrie;
	root.RankDirectory = RankDirectory;

}(this)


if ( typeof exports !== "undefined" ) {
	exports.Trie = SuccinctTrie;
	exports.FrozenTrie = SuccinctTrie;
	exports.RankDirectory = RankDirectory;
}


/** Tests
!function(){
	var data = {
    "nodeCount": 37,
    "directory": "BMIg",
    "trie": "v2qqqqqqqpIUn4A5JZyBZ4ggCKh55ZZgBA5ZZd5vIEl1wx8g8A"
  };
  var frozenTrie = new SuccinctTrie().load( data.nodeCount, data.trie);

  TestCase("Succinct Trie").compare(
    frozenTrie.lookup( "hello" )
  , true
  , frozenTrie.lookup( "hel" )
  , false
  , frozenTrie.lookup( "helloo" )
  , false
  ).done()

}()
//*/

