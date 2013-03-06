


/**
 * THE BEER-WARE LICENSE
 * <lauri@rooden.ee> wrote this file. As long as you retain this notice you 
 * can do whatever you want with this stuff at your own risk. If we meet some 
 * day, and you think this stuff is worth it, you can buy me a beer in return.
 * -- Lauri Rooden -- https://github.com/lauriro/boot.js
 */

/*
*
* by default Safari takes the document’s title and crop it to 13 characters. From iOS 6 we can define an alternative title for the Home Screen using:
* <meta name="apple-mobile-web-app-title" content="My App Name">
*
*
* iPhone 1-4s 
* 320 x 356 px       
*              iPhone 1-4s      iPhone 5
*
*              640×1096
*
* Portrait (WxH)	320 x 356 px
* (320 x 416* / 320 x 460**)	320 x 444 px
* (320 x 504* / 320 x 548**)
* Landscape (WxH)	480 x 196 px
* (480 x 256* / 480 x 300**)	568 x 196 px
* (568 x 256* / 568 x 300**)
* * – measurements without the browser navigation bar
* ** – measurements without any browser chrome for a web app
* The default full screen size of the iPhone 5 is 568 x 320 px (w x h). This is half of the screen resolution because of the pixel doubling in a Retina Display.
*

var p = navigator.platform
, iOS = p == 'iPad' || p == 'iPhone' || p == 'iPod'

var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );


var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};



){
		    iOS = true;
}

* */



!function(w, d, n) {
  var last, lastSize, lastOrient
	, b = d.body
	, head = d.head || d.getElementsByTagName("head")[0]
	, heights = 
		{ 196: 416 // iPhone1-5 Landscape
		, 356: 416 // iPhone 1-4s Portrait
		, 444: 504 // iPhone 5 Portrait
		}
  , resize = (heights[b.offsetHeight] ? by_size : "devicePixelRatio" in w && w.devicePixelRatio > 1 ? by_ratio : by_size).once(300)
	
	function by_ratio() {
		last !== ( last = w.outerHeight) && setSize( (last/w.devicePixelRatio)|0 )
	}

	function by_size() {
		setSize( heights[b.offsetHeight] || forecast_height() )
	}

	function forecast_height() {
		setTimeout(function(){
			screen.height > w.innerHeight && setSize(w.innerHeight+1)
		}, 300)
		return screen.height + 100
	}

	

  function setSize(size) {
		if (size < 700) {
			d.body.style.height = (size < 300 ? 300 : size) + "px"
			setTimeout(function() { scrollTo(0, 1) }, 99)
		}
		//var el = d.activeElement
		//if (lastSize && el && el.tagName == "INPUT") return
		setClasses()
  }

  function setClasses() {
    var width = b.offsetWidth
		, next = width < 601 ? "mob" : ( width < 1025 ? "tab" : "full")

    if ( next != lastSize ) {
      b.addClass( next ).rmClass( lastSize )
			lastSize = next
    }

    next = width > b.offsetHeight ? "landscape" : "portrait"

    if ( next != lastOrient) {
      b.addClass( next ).rmClass( lastOrient )
			lastOrient = next
    }
  }

  if ("standalone" in n) {
		/* iOS
		* [1] iOS always report screen.width 320 (iPhone 1-4) or 768 (iPad) regardless of orientation
		* height 480 = 320x460
		* height 1024 = 768x1004
		*/
		El.get(head).append(
			[ El("meta", { name:"apple-mobile-web-app-capable", content:"yes"})
			, El("meta", { name:"apple-mobile-web-app-status-bar-style", content:"black"})
			, El("link", { rel: "apple-touch-startup-image"
					         , href: "startup_" + screen.height + ".png"
			             , media: "screen and (orientation:landscape)"})
			, El("link", { rel: "apple-touch-startup-image"
					         , href: "startup_" + (screen.height - 20) + ".png"
			             , media: "screen and (orientation:portrait)"})
			]
    )

    if (n.standalone || b.offsetHeight > 600) {
      //Event.add(d, "touchmove", Event.stop); // disable drag on standalone mode
      resize = setClasses
    }
  } else {
		Event.add(w, "resize", resize )
	}

	Event.add(b, "orientationchange", setClasses)
		
/*
				<!-- startup image for web apps - iPad - landscape (748x1024) 
						 Note: iPad landscape startup image has to be exactly 748x1024 pixels (portrait, with contents rotated).-->
						 <link rel="apple-touch-startup-image" href="img/ipad-landscape.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:landscape)" />

						 <!-- startup image for web apps - iPad - portrait (768x1004) -->
						 <link rel="apple-touch-startup-image" href="img/ipad-portrait.png" media="screen and (min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)" />

						 <!-- startup image for web apps (320x460) -->
						 <link rel="apple-touch-startup-image" href="img/iphone.png" media="screen and (max-device-width: 320px)" />
*/

				

	// Vanem android oskab ainult apple-touch-icon-precomposed lugeda
	//<link rel="apple-touch-icon-precomposed" href="/apple-touch-icon.png">
	//<link rel="apple-touch-icon" sizes="114x114" href="apple-touch-icon-114x114.png">

	Event.add(w, "load", resize)
}(this, document, navigator)




