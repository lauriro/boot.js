

/**
 * @version  0.1-dev
 * @author   Lauri Rooden - https://github.com/lauriro/css-min
 * @license  MIT License  - http://lauri.rooden.ee/mit-license.txt
 */



!function(root) {
	var D = Date.prototype

	// Date extensions
	// ---------------

	function p2(n) {
		return n>9?n:"0"+n
	}

	function p3(n) {
		return (n>99?n:(n>9?"0":"00")+n)
	}

	//** Date.format
	// ISO 8601 specifies numeric representations of date and time.
	// The international standard date notation is
	//
	// YYYY-MM-DD
	// The international standard notation for the time of day is
	//
	// TODO:2012-03-05:lauriro:Date week number not complete
	// http://en.wikipedia.org/wiki/ISO_week_date
	//
	// hh:mm:ss
	//
	// Time zone
	//
	// The strings
	//
	// +hh:mm, +hhmm, or +hh
	//
	// can be added to the time to indicate that the used local time zone is hh hours and mm minutes ahead of UTC. For time zones west of the zero meridian, which are behind UTC, the notation
	//
	// -hh:mm, -hhmm, or -hh
	//
	// is used instead. For example, Central European Time (CET) is +0100 and U.S./Canadian Eastern Standard Time (EST) is -0500. The following strings all indicate the same point of time:
	//
	// 12:00Z = 13:00+01:00 = 0700-0500
	
	var maskRe = /(")([^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|(YY(?:YY)?|M{1,4}|D{1,4}|([HhmsS])\4?|[uUaAZw])/g
	
	function dateFormat(mask) {
		var t = this
		, x = dateFormat.masks[mask] || mask || dateFormat.masks["default"]
		, g = "get" + (x.slice(0,4) == "UTC:" ? (x=x.slice(4), "UTC"):"")
		, Y = g + "FullYear"
		, M = g + "Month"
		, d = g + "Date"
		, w = g + "Day"
		, h = g + "Hours"
		, m = g + "Minutes"
		, s = g + "Seconds"
		, S = g + "Milliseconds"

		return x.replace(maskRe, function(a, b, c) {
			return a == "YY"   ? (""+t[Y]()).slice(2)
					 : a == "YYYY" ? t[Y]()
					 : a == "M"    ? t[M]()+1
					 : a == "MM"   ? p2(t[M]()+1)
					 : a == "MMM"  ? root.monthNames[ t[M]() ]
					 : a == "MMMM" ? root.monthNames[ t[M]()+12 ]
					 : a == "D"    ? t[d]()
					 : a == "DD"   ? p2(t[d]())
					 : a == "DDD"  ? root.dayNames[ t[w]() ]
					 : a == "DDDD" ? root.dayNames[ t[w]()+7 ]
					 : a == "H"    ? (""+t[h]()%12||12)
					 : a == "HH"   ? p2(t[h]()%12||12)
					 : a == "h"    ? t[h]()
					 : a == "hh"   ? p2(t[h]())
					 : a == "m"    ? t[m]()
					 : a == "mm"   ? p2(t[m]())
					 : a == "s"    ? t[s]()
					 : a == "ss"   ? p2(t[s]())
					 : a == "S"    ? t[S]()
					 : a == "SS"   ? p3(t[S]())
					 : a == "u"    ? (t/1000)>>>0
					 : a == "U"    ? +t
					 : a == "a"    ? (t[h]() > 11 ? "pm" : "am")
					 : a == "A"    ? (t[h]() > 11 ? "PM" : "AM")
					 : a == "Z"    ? "GMT " + (-t.getTimezoneOffset()/60)
					 : a == "w"    ? 1+Math.floor((t - new Date(t[Y](),0,4))/604800000)
					 : b           ? c
					 : a
			}
		)
	}

	dateFormat.masks = {"default":"DDD MMM DD YYYY hh:mm:ss","isoUtcDateTime":'UTC:YYYY-MM-DD"T"hh:mm:ss"Z"'}
	root.monthNames = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December".split(" ")
	root.dayNames = "Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" ")


	D.format = dateFormat


	//*/



	//** Date.toDate
	var bigEnd = /(\d\d\d\d)-(\d\d?)-(\d\d?)/
	, midEnd = /(\d\d?)\/(\d\d?)\/(\d\d\d\d)/
	, litEnd = /(\d\d?)\.(\d\d?)\.(\d\d\d\d)/

	function toDate(format) {
		var m
		, t = this
		, d = new Date()
		, n = +t || ""+t
		// n = +t || Date.parse(t) || ""+t; // In Chrome Date.parse("01.02.2001") is Jan

		if (isNaN(n)) {
			// Big endian date, starting with the year, eg. 2011-01-31
			if (m = n.match(bigEnd)) d.setFullYear(m[1], m[2]-1, m[3])

			// Middle endian date, starting with the month, eg. 01/31/2011
			else if (m = n.match(toDate.us ? litEnd : midEnd)) d.setFullYear(m[3], m[1]-1, m[2])
			
			// Little endian date, starting with the day, eg. 31.01.2011
			else if (m = n.match(litEnd)) d.setFullYear(m[3], m[2]-1, m[1])
			
			// Time
			m = n.match(/(\d{1,2}):(\d{2}):?(\d{2})?\.?(\d{3})?/) || [0, 0, 0]
			if (n.match(/pm/i) && m[1] < 12) m[1]+=12
			d.setHours(m[1], m[2], m[3]||0, m[4]||0)
			// Timezone
			n.indexOf("Z") && d.setTime(d-(d.getTimezoneOffset()*60000))
		} else d.setTime( (n<4294967296?n*1000:n) )
		return format ? d.format(format) : d
	}

	String.prototype.date = Number.prototype.date = toDate
	//*/

	//** Date.daysInMonth
	D.daysInMonth = function() {
		return (new Date(this.getFullYear(), this.getMonth()+1, 0)).getDate()
	}
	//*/

	//** Date.startOfWeek
	D.startOfWeek = function() {
		var t = this
		return new Date(t.getFullYear(), t.getMonth(), t.getDate() - (t.getDay() || 7) +1)
	}
	//*/

	//** Date.timeAgo convert dates to human-readable
	D.timeAgo = function(format, custom) {
		var t = this, d = (new Date() - t + 1) / 1000
		return d.humanTime({"default":"{0} {1}{2} ago", "day":"Yesterday"}, function(){return t.format(format)})
	}
	//*/

}(this)








/** Tests for Date
!function(){
var test = new TestCase("Date extensions");

var d1 = new Date(1276703114000);
d1.setUTCHours(13, 45, 55, 12);
var d2 = new Date(1000000000000);
var d3 = new Date(1234567890000);

test.compare(
d1.format("isoUtcDateTime")
, "2010-06-16T13:45:55Z"
, d1.format("u")
, "1276695955"
, d1.format("U")
, "1276695955012"
, d2.format("isoUtcDateTime")
, "2001-09-09T01:46:40Z"
, d2.format("UTC:H:mm A")
, "1:46 AM"
, d2.format("YY A")
, "01 AM"
, d3.format("isoUtcDateTime")
, "2009-02-13T23:31:30Z"
, "Date.format()");

test.done();
}()
//*/

/** Tests for Date.timeAgo
!function(){
var test = new TestCase("Date.timeAgo")
, curr = new Date();

//curr.setMilliseconds(0);

curr.setTime( curr.getTime() - 1000 );
test.compare( curr.timeAgo() , "1 second ago");

curr.setTime( curr.getTime() - 1000 );
test.compare( curr.timeAgo() , "2 seconds ago");

curr.setTime( curr.getTime() - 58000 );
test.compare( curr.timeAgo() , "1 minute ago");

curr.setTime( curr.getTime() - 60000 );
test.compare( curr.timeAgo() , "2 minutes ago");

curr.setTime( curr.getTime() - 3600000 );
test.compare( curr.timeAgo() , "1 hour ago");

curr.setTime( curr.getTime() - 3600000 );
test.compare( curr.timeAgo() , "2 hours ago");

curr.setTime( curr.getTime() - 22*3600000 );
test.compare( curr.timeAgo() , "Yesterday");

curr.setTime( curr.getTime() - 24*3600000 );
test.compare( curr.timeAgo() , "2 days ago");

test.done();
}()
//*/


