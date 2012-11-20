

min:
	@../js-min/js-min.sh browser_upgrade.js core.js el.js load.js > min.js

# Now call Google Closure Compiler to produce a minified version
# $ curl -d output_info=compiled_code -d output_format=text -d compilation_level=ADVANCED_OPTIMIZATIONS --data-urlencode js_code@min.js "http://closure-compiler.appspot.com/compile" > min2.js



# 1 round trip to get 2904 bytes, Initial Window (IW) = 2
# 2 round trips to get 8712 bytes, Congestion Window (CW)=4
# 3 round trips to get 20328 bytes, CW = 8
# 4 round trips to get 43560 bytes, CW = 16
