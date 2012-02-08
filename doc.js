
!function(w, d){
	var last_page
	  , last_hash = "";

	var select_page = function(el){
		// find page
		var page = el;
		while (page && page.className.indexOf("page") == -1) page = page.parentNode;
		if (!page || last_page == page) return;

		if (last_page) last_page.style.display = "none";
		page.style.display = "";

		last_page = page;
	}

	var monitor_hash = function(){
		if (location.hash != last_hash) {
			last_hash =	location.hash;
			var i = 0, a, as = d.getElementsByTagName("a");
			while (a = as[i++]) if ("#" + (a.name||a.id) == last_hash) {
				select_page(a);
				location.href = last_hash;
				return;
			}
		}
	}

	w.onload = function() {
		var i = 1
		  , j = 0
		  , body = d.getElementsByTagName("body")[0]
		  , tag
			, tags = body.childNodes
			, list = "H1 H2 H3 H4 H5 H6"
			, root = d.createElement("div")
			, page
			, parent = d.createElement("ul");

		root.className = "tree";
		root.appendChild(parent);
		parent.className = "H0";

		while (tag = tags[i]) {

			if (!page || tag.tagName == "H1") {
				page = d.createElement("div");
				page.className = "page";
				page.style.display = "none";
				body.insertBefore(page, tag);
				i++;
			}

			page.appendChild(tag);

			if (list.indexOf(tag.tagName) != -1) {
				while (parent.className >= tag.tagName) {
					var x = parent.parentNode;
					if (parent.childNodes.length == 0) {
						x.removeChild(parent);
						x.className += " leaf";
					}
					parent = x.parentNode;
				}

				var a = d.createElement("a");
				a.id = "p" + j;
				tag.appendChild(a);

				var li = d.createElement("li");
				parent.appendChild(li);
				li.innerHTML = tag.innerText || tag.textContent;
				parent = d.createElement("ul");
				parent.className = tag.tagName + " hidden";
				li.onclick = function(ul, li, i, tag){
					return function(e){
						e = e || w.event;
						select_page(tag);
						monitor_hash();
						location.href = "#p" + i;
						var cls = ul.className;
						if (ul.parentNode === li) ul.className = cls.indexOf("hidden") < 0 ? cls + " hidden" : cls.replace(" hidden","");
						"stopPropagation" in e && e.stopPropagation();
						"preventDefault" in e && e.preventDefault();
						e.cancelBubble = e.cancel = true;
						return e.returnValue = false;
					}
				}(parent, li, j++, tag)
				li.appendChild(parent);
			}
		}

		body.appendChild(root);

		setInterval(monitor_hash, 150);

	}
}(window, document);

