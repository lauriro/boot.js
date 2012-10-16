
String.version_compare = function(){
	var vm = {
		"dev": -6,
		"alpha": -5, "a": -5,
		"beta": -4, "b": -4,
		"RC": -3, "rc": -3,
		"#": -2,
		"p": -1, "pl": -1
	}

	function toNum(n) {
		return !n ? 0 : (isNaN(n) ? vm[n] || -7 : parseInt(n, 10))
	}

	return function(v1, v2, operator) {
		v1 = (""+v1).split(/[-+_.,]+/)
		v2 = (""+v2).split(/[-+_.,]+/)
		var diff = 0
		, i = 0
		, len = Math.max(v1.length, v2.length)

		for (;len > i;i++) {
			diff = toNum(v1[i]) - toNum(v2[i])
			console.log("compare", toNum(v1[i]), toNum(v2[i]))
			if (diff != 0) {
				diff = (diff > 0) - (diff < 0); // -1, 0, or +1
				break
			}
		}

		switch (operator) {
			case '>':
				return (diff > 0)
			case '>=':
				return (diff >= 0);
			case '<':
				return (diff < 0);
			case '<=':
				return (diff <= 0);
			case '=':
				return (diff === 0);
			case '<>':
			case '!=':
				return (diff !== 0);
			default:
				return diff;
		}
	}
}()



/** Tests
!function(){
	var test = new TestCase("String.version_compare");

	test.compare(
	  String.version_compare("1", "1.0", "=")
	, true
	, String.version_compare("1", "1.0.1", "<")
	, true
	, String.version_compare("2", "1.0.1", ">")
	, true
	);

  test.done();
}()

//*/



