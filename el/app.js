


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice
 * you can do whatever you want with this stuff. If we meet some day, and
 * you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden
 */



El.app_container = function( el ) {
	var w = window, d = w.document, b = El.get(d.body), nav = w.navigator, last
		, head = d.getElementsByTagName("head")[0]
		, tick
		, lastOrient
		, setOrient = function(){
				var next = "orientation"in w?"o"+w.orientation : (b.offsetWidth>b.offsetHeight?"landscape":"portrait")
				if (next!=lastOrient){
					b.rmClass( lastOrient ).addClass( lastOrient=next )
				}
			}
		, lastSize
		, setSize = function(){
				var width = b.offsetWidth, next = width < 601?"mob":(width < 1025?"tab":"full")
				if (next!=lastSize) {
					b.rmClass( lastSize ).addClass( lastSize=next )
				}
			}
		, set = function(size, reset){
				d.body.style.height = size + "px"
				clearTimeout(tick);
				tick = setTimeout(function(){
					scrollTo(0,2)
					reset && size > w.innerHeight && set(w.innerHeight+1)
				},300)
			}
		, resize = function(){
				if ("standalone"in nav) { // iOS
					El("meta", {name:"apple-mobile-web-app-capable", content:"yes"}, head);
					El("meta", {name:"apple-mobile-web-app-status-bar-style", content:"black"}, head);

					//if (screen.width > 320) {
					//	El("link", {rel:"apple-touch-startup-image", href:"apple-startup-640x920.png"}, head);
					//} else {
					El("link", {rel:"apple-touch-startup-image", href:"apple-startup-320x460.png"}, head);
					//}

/*
					<!-- startup image for web apps - iPad - landscape (748x1024) 
					     Note: iPad landscape startup image has to be exactly 748x1024 pixels (portrait, with contents rotated).-->
					     <link rel="apple-touch-startup-image" href="img/ipad-landscape.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)" />

					     <!-- startup image for web apps - iPad - portrait (768x1004) -->
					     <link rel="apple-touch-startup-image" href="img/ipad-portrait.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)" />

					     <!-- startup image for web apps (320x460) -->
					     <link rel="apple-touch-startup-image" href="img/iphone.png" media="screen and (max-device-width: 320px)" />
*/

					var orient;
					
					setOrient();
					Event.add(b,"orientationchange",setOrient);

					if (nav.standalone) {
						//Event.add(b,"touchmove",Event.stop);
						return setSize;
					}
					//			set( screen.height * 1.3, true )

					return function(){
						setSize();
						"orientation" in w && orient !== (orient=w.orientation) && set( screen.height * 1.3, true );
						//View.bind_all("resize");
					}
				}
				
				// Vanem android oskab ainult apple-touch-icon-precomposed lugeda
				//<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png">
				//<link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-114x114.png">

				return function(){
					setSize();
					setOrient();
					if ("devicePixelRatio"in w && w.devicePixelRatio > 1) {
						last !== (last=w.outerHeight) && set(  ~~(last/w.devicePixelRatio) );
					}
					//View.bind_all("resize");
				}
			}()

	Event.add(w, "resize", resize.once(200) );
	Event.add(w, "load", resize );


  		// setInterval(function(){
  		// 	el.style.height = '100%'
  		// 	el.innerHTML = 'el '+el.offsetHeight + ' b' + document.body.clientHeight
  		// 		+ ' s'+ screen.height + ' w'+w.outerHeight +','+w.innerHeight
  		// }, 500)

  		//El("div", {className:"app_title", append:"Title"}, el)


}



El.smoothScroll = function(){
	return El.css_supported("perspective") ?
		function(el, pos){
			el.css("transform", "translate3d(0, " + pos + "px, 0)", true);
		}:
		function(el, pos){
			el.style.marginTop = pos + "px";
		}
}();


El.noselect = function(el){
	el.addClass("noselect");
	/*@cc_on
	el.onselectstart = function() {return false;} // user-select: none; for IE
	@*/
}


El.fill = function(el){
	Event.add(w, "resize", resize.once(100) )
	
}


