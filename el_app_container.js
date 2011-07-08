
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
					El("meta", {name:"apple-mobile-web-app-capable", content:"yes"}, head)
					El("meta", {name:"apple-mobile-web-app-status-bar-style", content:"black"}, head)
					El("link", {rel:"apple-touch-startup-image", href:"css/startup_" + 
						(screen.height == 396 ? "320x460" : "1004x768") + ".png"}, head)


					// TODO:2011-05-24:lauriro: build CSS handler
					var i=0, link, links = d.getElementsByTagName("link")
					while (link=links[i++]) if (link.rel=="alternate stylesheet"){
						link.disabled = true
						if (link.title == "iOS") link.disabled = false
					}

					var orient;
					
					setOrient()
					Event.add(b,"orientationchange",setOrient)

					if (nav.standalone) {
						Event.add(b,"touchmove",Event.stop)
						return setSize
					}

					return function(){
						setSize()
						if ("orientation" in w && orient !== (orient=w.orientation)) {
							//scrollTo(0,1)
							if (screen.height == 396) { // iPhone 3
								set( screen.height * 1.3, true )
							}
						}
						//View.bind_all("resize");
					}
				}
				
				// Väidetavalt mõni android oskab ainult apple-touch-icon-precomposed lugeda
				//<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png">

				return function(){
					setSize()
					setOrient()
					if ("devicePixelRatio"in w && w.devicePixelRatio > 1) {
						last !== (last=w.outerHeight) && set(  ~~(last/w.devicePixelRatio) )
					}
					//View.bind_all("resize");
				}
			}()

	resize()
	Event.add(w, "resize", resize.once(100) )


  		// setInterval(function(){
  		// 	el.style.height = '100%'
  		// 	el.innerHTML = 'el '+el.offsetHeight + ' b' + document.body.clientHeight
  		// 		+ ' s'+ screen.height + ' w'+w.outerHeight +','+w.innerHeight
  		// }, 500)

  		//El("div", {className:"app_title", append:"Title"}, el)


}


