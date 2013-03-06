
El.fastClick = function(el){
	var moved;
	function move(){
		el.non("touchmove", move)
		el.non("touchend", end)
	}
	function end(e){

		//var theEvent = document.createEvent("MouseEvents");
		//theEvent.initEvent('click', true, true);
		//el.dispatchEvent(theEvent)
		var touch = e.changedTouches[0], ev = document.createEvent("MouseEvent");
		var theTarget = document.elementFromPoint(touch.clientX, touch.clientY);
		if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;

		Event.stop(e);
		ev.initMouseEvent( "click", true, true);
		theTarget.dispatchEvent(ev);
		move();
	}

	el.on("touchstart", function(e){
		el.on("touchmove", move)
		el.on("touchend", end)
		moved = false;
	})
}
/*
			El.fastClick(el)
*/
