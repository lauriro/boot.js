


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



El.cache(
	"slider",
	El.haml("%button.slider\n .slider_track\n  .slider_fill.anim\n   .slider_knob"),
	function(el){
		var drag = false, undef, doc = document, knobLen, offset, px, maxPx,
			min, max, step, value = el.val || 0,
			v = ((" "+el.className+" ").indexOf(" vertical ") !== -1),
			o = "offset"+(v?"Height":"Width"),
			od = v?"height":"width",
			op = "offset"+(v?"Top":"Left"),
			track = el.childNodes[0],
			fill = track.childNodes[0],
			knob = fill.childNodes[0];

		function load(){
			min = el.min || 0
			max = el.max || 100
			step = el.step || 1
			knobLen = knob[o]>>1
			maxPx = track[o] - knobLen - knobLen
			var obj = el;
			offset = obj[op] + knobLen;
			while (obj=obj.offsetParent) offset+=obj[op];
			px = maxPx / (max - min);
		}

		function move(e){
			var diff = v ? maxPx - Event.pointerY(e) + offset : Event.pointerX(e) - offset;
			diff = (diff>maxPx ? maxPx : (diff<0?0:diff));
			el.set( diff / px, diff );
			"on_move" in el && el.on_move( diff + knobLen );
			return false;
		}

		function stop(e){
			fill.addClass("anim")
			drag = false;
			Event.remove(doc, "mouseup", stop).remove(doc, "mousemove", move);
			el.set(value);
		}

		el.set = function(val, pos, scroll){
			px || load();
			val = (val<min?min:val>max?max:val).toAccuracy(step);
			;(drag || scroll) && value !== val && "on_change" in el && el.on_change(val);
			value = val;
			if (!drag || pos !== undef) fill.style[od] = ((pos || value*px)+knobLen) + "px";
		}

		el.append_hook = function(){
			setTimeout(function(){
				el.set(value);
			}, 150);
		}

		el.on("mousedown", function(e){
			fill.removeClass("anim")
			drag = true;
			load();
			move(e);
			Event.add(doc, "mouseup", stop).add(doc, "mousemove", move).stop(e);
		}).on("mousewheel", function(e,delta){
			Event.stop(e);
			el.set( 1*value + delta*step, 0, 1 );
		});

		Event.touch_as_mouse(el);
	}
);


