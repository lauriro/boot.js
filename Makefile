

min:
	@../web_tools/js-min.sh boot.js eval_inline.js > min.js

# Now call Google Closure Compiler to produce a minified version
# $ curl -d output_info=compiled_code -d output_format=text -d compilation_level=ADVANCED_OPTIMIZATIONS --data-urlencode js_code@min.js "http://closure-compiler.appspot.com/compile" > min2.js


