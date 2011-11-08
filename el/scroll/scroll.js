


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



El.cache(
	"scroll",
	El(".scroll.rel"),
	function(el){
		var d = El.get(document)
		  , body = El(".scrollBox")
		  , bar = El(".scrollBar.abs.anim.transparent")
		  , startY, lastMove, pos=0, maxPos, barMult, tick;

		el.append([body,bar]);

		var scroll=function(){
			clearTimeout(tick);
			if(pos>0)pos=0;
			else if(pos<maxPos)pos=maxPos;
			bar.rmClass("transparent");
			El.smoothScroll(body, pos);
			El.smoothScroll(bar, ( barMult*pos )|0);
		}
		var move=function(e){
			var move = startY-Event.pointerY(e);
			if (!(move < 3 && move > -3)) {
				pos-=(lastMove=startY-(startY=Event.pointerY(e)));
				scroll();
			}
		}

		var stop=function(){
			if ( (lastMove<0?-lastMove:lastMove) > 5 ) {
				pos-=lastMove*6;
				//body.css("transition", "-vendor-transform .35s ease-out", true);
				body.addClass("anim");
				scroll();
			}
			tick = setTimeout(function(){
				//body.css("transition", "-vendor-transform 0s linear", true);

				//body.css("transition","none 0 ease",true);
				body.rmClass("anim");
				bar.addClass("transparent")
			}, 600);

			d.on("touchmove mousemove", move, false).on("touchend mouseup", stop, false);
		}
		el.append_hook = body.append_hook = function(){
			lastMove = 0;
			var barH = el.offsetHeight*el.offsetHeight/body.offsetHeight;
			bar.style.height = (barH|0) + "px";
			maxPos = el.offsetHeight-body.offsetHeight-50;
			barMult = (el.offsetHeight-barH)/maxPos;
		}
		el.append = body.append.bind(body)

		el.on("touchstart mousedown", function(e){
			Event.stop(e);
			startY = Event.pointerY(e);
			el.append_hook();
			body.rmClass("anim");
			d.on("touchmove mousemove", move).on("touchend mouseup", stop);
		}).on("mousewheel", function(e, delta){
			Event.stop(e);
			el.append_hook();
			lastMove = -delta*10;
			stop();
		});

		El.noselect(el);
	}
);


