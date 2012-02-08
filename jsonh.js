


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



// THANKS: Andrea Giammarchi, @WebReflection - JSONH [https://github.com/WebReflection/JSONH] 

JSON.H = {
	unpack_fn: function(keys) {
		var i = keys.length - 1;
		return new Function("a","var l=a.length/"+(i+1)+",i="+i+";while((i-="+i+")<l)a.splice(i,"+(i+1)+',{"'+keys.join('":a[i++],"')+'":a[i++]})');
	}.cache(),
	pack_fn: function(keys) {
		return new Function("a","var l=a.length,o;while(l--){o=a[l];a.splice(l,1,o['"+keys.join("'],o['")+"'])};a.unshift(['"+keys.join("','")+"'])");
	}.cache(),

	// transforms [{a:"A"},{a:"B"}] to [["a"],"A","B"]
	pack: function(arr) {
		if (arr.length) {
			JSON.H.pack_fn(Object.keys(arr[0]))(arr);
		}
	},

	// transforms [["a"],"A","B"] or [1,"a","A","B"] to [{a:"A"},{a:"B"}]
	unpack: function(arr) {
		// for Andrea Giammarchi's [1,"a","A","B"] format
		if (typeof arr[0] === "number") arr.unshift(arr.splice(0,arr.shift()));
		JSON.H.unpack_fn(arr.shift())(arr);
	}
}


/** Tests for JSONH
!function(){
	var test = new TestCase("JSONH")
	  , o = [{a:"A",b:"Ab"}, {a:"B",b:"Bb"}];

	JSON.H.pack(o);
	test.compare( JSON.stringify(o), '[["a","b"],"A","Ab","B","Bb"]');
	JSON.H.unpack(o);
	test.compare( JSON.stringify(o), '[{"a":"A","b":"Ab"},{"a":"B","b":"Bb"}]');

	test.done();
}()
//*/



