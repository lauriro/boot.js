

all:
	@../js-min/js-min.sh browser_upgrade.js core.js el.js load.js > min.js
	@wc -c min.js
	@gzip -c min.js | wc -c


# Call Google Closure Compiler to produce a minified version
min:
	@curl -s \
		    --data-urlencode 'output_info=compiled_code' \
				--data-urlencode 'output_format=text' \
				--data-urlencode 'js_code@min.js' \
				'http://closure-compiler.appspot.com/compile' > min2.js
	@curl -s \
		    --data-urlencode 'output_info=errors' \
				--data-urlencode 'output_format=text' \
				--data-urlencode 'js_code@min.js' \
				'http://closure-compiler.appspot.com/compile' > error.log



# 1 round trip to get 2904 bytes, Initial Window (IW) = 2
# 2 round trips to get 8712 bytes, Congestion Window (CW)=4
# 3 round trips to get 20328 bytes, CW = 8
# 4 round trips to get 43560 bytes, CW = 16
