

!function(h){
	if ("pushState" in h) return;

	h.pushState = function(data, title, url){
		location.replace("#"+url);
	}
}(window.history)


