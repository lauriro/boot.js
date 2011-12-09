

El.cache(
	"tabs"
, El.haml(".tabs\n .tabs_panel\n %stack") 
, function (el) {

		var d = El.get(document)
		var tabs = [], active, panel = el.firstChild, body = el.childNodes[1]
		  , inmove, startX

		var pages = El("stack").to(document.body);
		/*

		el.add = function( name, builder ){
			var tab = El("div",{className:"tabs_tab", append:name}, panel)

			tab.open = function(){
				if (active) {
					active.removeClass("active")
					active.content.addClass("hidden")
				}
				active = tab.addClass("active")

				if ( "content" in tab === false) {
					tab.content = typeof(builder) != "function" && builder || builder()
					//tab.content && body.append( tab.content )
				}
				tab.content && tab.content.removeClass("hidden")

			}
			tab.on("click", tab.open)

			tabs.push( tab )
			
		}
		var move=function(e){
			var move = startX-Event.pointerX(e);
			if (inmove || (inmove = !(move < 10 && move > -10))) {
				Event.stop(e);
				page.style.marginLeft = move + "px";
			}
		}
		var stop=function(){
			d.on("touchmove mousemove", move, false).on("touchend mouseup", stop, false);
		}
		*/

		panel.on("click", function(e){
			var target = e.target || e.srcElement, view, id = 0, node = target;
			console.log('click', target, target.parentNode)
			if (target.parentNode == el) {
				Event.stop(e);
				while (node = node.previousSibling) id++;
				body.select(id);
				target.addClass("selected");

			//if (view = target.getAttribute("data-view")) {
			//	body.innerHTML = '';
			//	target.div.childNodes.length && body.append(Array.from(target.div.childNodes));
			//	//body.append(target.div.childNodes);
			//	console.log(target.div, target.div.childNodes)
			//}
			}
			
		});

		/*
		body.on("touchstart mousedown", function(e){
			startX = Event.pointerX(e);
			d.on("touchmove mousemove", move).on("touchend mouseup", stop);
			
		});
		*/

		el.append = function(tab){
			var content = body.open( tab.hasClass("selected") )
			  , id 
			panel.append(tab);

			tab.append = content.append.bind(content);
		}
		/*

		body.child_hook = function(){
			Array.from(body.childNodes).forEach(function(tab, i){
				el.add( tab.name || "tab"+i, tab );
				tab.addClass("hidden");
			});
			!active && el.select(0);
		}.once(20);
		*/


		/*
		el.select = function( id ){
			id in tabs && tabs[id].open()
		}
		*/
		//body.child_hook();
	}
);

El.cache(
	"tab",
	El(".tab"),
	function(el){
		var div = el.div = El("div.bla",'hello');
		el.append = div.append.bind(div);
		//el.append = function(el){
		//	div.append(el);
		//	console.log('append',el)
		//}
		
	}
);




