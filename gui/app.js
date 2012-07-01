


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */



El.app_container = function( el ) {
	var w = window, d = w.document, b = El.get(d.body), nav = w.navigator, last
		, tick
		, lastSize
		, lastOrient
		, setClasses = function(){
				var width = b.offsetWidth, next = width < 601?"mob":(width < 1025?"tab":"full")
				if (next!=lastSize) {
					b.rmClass( lastSize ).addClass( lastSize=next )
				}
				next = "orientation"in w?"o"+w.orientation : (width>b.offsetHeight?"landscape":"portrait")
				if (next!=lastOrient){
					b.rmClass( lastOrient ).addClass( lastOrient=next )
				}
			}
		, setSize = function(size, reset){
				//alert(size)
				//	scrollTo(0,0)
				d.body.style.height = size + "px"
				clearTimeout(tick);
				tick = setTimeout(function(){
					scrollTo(0,2)
					reset && size > w.innerHeight && setSize(w.innerHeight+1)
				},300)
			}
		, resize = function(){
				setClasses();
				if ("devicePixelRatio"in w && w.devicePixelRatio > 1) {
					last !== (last=w.outerHeight) && setSize(  ~~(last/w.devicePixelRatio) );
				} else if ( "orientation" in w && last !== (last=w.orientation)){
					setSize( screen.height * 1.3, true );
					//View.bind_all("resize");
				}
			}.once(200)
		, theme = "theme/android.css"
		, meta = [];


		if ("standalone" in nav) { // iOS
			theme = "theme/ios.css";
			meta.push(
				El("meta", {name:"apple-mobile-web-app-capable", content:"yes"}),
				El("meta", {name:"apple-mobile-web-app-status-bar-style", content:"black"}),
				El("link", {rel:"apple-touch-startup-image", href:"apple-startup-320x460.png"})
			);


			//if (screen.width > 320) {
			//	El("link", {rel:"apple-touch-startup-image", href:"apple-startup-640x920.png"}, head);
			//} else {
			//}

			Event.add(b, "orientationchange", setClasses);

			if (nav.standalone) {
				Event.add(d, "touchmove", Event.stop); // disable drag on standalone mode
				resize = setClasses;
			}
		}
		
		//meta.push(El("link", {rel:"stylesheet", type:"text/css", href: theme}));
		
		El.get(d.getElementsByTagName("head")[0]).append(meta);

/*
				<!-- startup image for web apps - iPad - landscape (748x1024) 
						 Note: iPad landscape startup image has to be exactly 748x1024 pixels (portrait, with contents rotated).-->
						 <link rel="apple-touch-startup-image" href="img/ipad-landscape.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)" />

						 <!-- startup image for web apps - iPad - portrait (768x1004) -->
						 <link rel="apple-touch-startup-image" href="img/ipad-portrait.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)" />

						 <!-- startup image for web apps (320x460) -->
						 <link rel="apple-touch-startup-image" href="img/iphone.png" media="screen and (max-device-width: 320px)" />
*/

				

			//setSize( screen.height * 1.3, true )

			
			// Vanem android oskab ainult apple-touch-icon-precomposed lugeda
			//<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png">
			//<link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-114x114.png">


	Event.add(w, "resize", resize );
	resize();


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
	
	var resize = function() {
		var sum = 0;
		if ( el && el.parentNode ) {
			Array.from(el.parentNode.childNodes).forEach(function( child ){
				if (child) child != el && ( sum += child.offsetHeight|0 );
			});
			el.style.height = ( parseInt(el.parentNode.offsetHeight|0) - sum ) + "px";
		}
	}.once(100)
	el.append_hook = resize;

	Event.add(window, "resize", resize )
	Event.add(window, "load", resize )
}


