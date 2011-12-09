
El.cache(
	"toggle",
	El.haml("%button.toggle.reset\n .anim\n  %b.on ON\n  %b OFF\n  %b.knob"),
	function(el){
		el.on("mousedown touchstart", function(e){
			Event.stop(e);
			el.toggleClass("is_on");
		});

	}
);

