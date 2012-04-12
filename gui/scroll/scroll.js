


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */

/*
*Inertial scrolling? (Note: iOS 5 only)
-webkit-overflow-scrolling: touch;
* */

El.cache(
	"scroll",
	El.haml(".scroll.rel\n .scrollBox\n .scrollBar.absr.transparent"),
	function(el){
		console.log(el)
		var d = document
		  , body = el.firstChild
		  , bar = el.lastChild
		  , startY, lastMove, pos=0, maxPos, barMult, tick
		  , inmove;


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
			if (inmove || (inmove = !(move < 10 && move > -10))) {
				Event.stop(e);
				pos-=(lastMove=startY-(startY=Event.pointerY(e)));
				scroll();
			}
		}

		var stop=function(){
			if (!(lastMove < 10 && lastMove >- 10)) {
				pos-=lastMove*8;
				el.addClass("inertia");
				scroll();
			}
			tick = setTimeout(function(){
				el.rmClass("inertia");
				bar.addClass("transparent")
			}, 800);

			Event.remove(d,"mousemove", move)
			Event.remove(d,"touchmove", move)
			Event.remove(d,"mouseup", stop);
			Event.remove(d,"touchend", stop);
		}
		el.append_hook = body.append_hook = function(){
			var barH = el.offsetHeight*el.offsetHeight/body.offsetHeight;
			bar.style.height = (barH|0) + "px";
			maxPos = el.offsetHeight-body.offsetHeight-50;
			barMult = (el.offsetHeight-barH)/maxPos;
		}
		el.append = body.append.bind(body);

		el.on("touchstart mousedown", function(e){
			inmove = false;
			lastMove = 0;
			Event.stop(e);
			startY = Event.pointerY(e);
			el.rmClass("inertia");
			el.append_hook();
			Event.add(d, "mousemove", move)
			Event.add(d, "touchmove", move)
			Event.add(d, "mouseup", stop);
			Event.add(d, "touchend", stop);
		}).on("mousewheel", function(e, delta){
			Event.stop(e);
			el.append_hook();
			lastMove = -delta*11;
			stop();
		});

		El.noselect(el);
		//El.fill(el);
	}
);


