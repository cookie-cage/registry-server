// Global by intention.
var builder;
window.getCookie = function(name) {
  match = document.cookie.match(new RegExp(name + '=([^;]+)'));
  if (match) return match[1];
}

jQuery(document).ready(function($) {
	var form = $("#form");
	builder = new Builder(form);

	$.getJSON("json/schema.json", function(data) {
		builder.init(data);
		reset();
	});

	var preview = $("#preview");
	var iframe = $("#iframe");

	(function() {
		var timer = null;
		form.on("change", function() {
			clearTimeout(timer);
			preview.addClass("loading");
			timer = setTimeout(function() {
				var data = builder.getFormValues();
				form.data("resume", data);
				postResume(data);
			}, 200);
		});
	})();

	function postResume(data) {
		var theme = "flat";
		var hash = window.location.hash;
		if (hash != "") {
			theme = hash.replace("#", "");
		}
		$.ajax({
			type: "POST",
			contentType: "application/json",
			data: JSON.stringify({resume: data}, null, "  "),
			url: "https://themes.jsonresume.org/" + theme,
			success: function(html) {
				iframe.contents().find("body").html(html);
				preview.removeClass("loading");
			}
		});
		(function toggleActive() {
			$("#theme-current").html(theme);
			var active = $("#themes-list .item[href='#" + theme + "']").addClass("active");
			active.siblings().removeClass("active");
			document.cookie = "theme="+theme;
		})();
	}

	enableTSEplugin();
	enableCSStransitions();

	$("#export").on("click", function() {
		var data = form.data("resume");
		download(JSON.stringify(data, null, "  "), "resume.json", "text/plain");
	});


	$("#save").on("click", function() {

		var data = form.data("resume");
		var email = getCookie("email");
		var session = getCookie("session");
		var theme = getCookie("theme");
		var jsonData = JSON.stringify({
            'resume': data,
            'email': email,
            'session': session,
			'theme' : theme
        });

		console.log(data);
        fetch('/resume', {
            method: 'POST',
            mode: 'cors',
            redirect: 'follow',
            body: jsonData,
            headers: new Headers({
                'Content-Type': 'application/json; charset=utf-8'
            })
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            if (json.error) {
                alert(json.error.message);
            }

			console.log(json);

        });

	});

	$("#reset").on("click", function() {
		if (confirm("Are you sure?")) {
			reset();
		}
	});

	$("#clear").on("click", function() {
		if (confirm("Are you sure?")) {
			clear();
		}
	});

	var tabs = $("#sidebar .tabs a");
	tabs.on("click", function() {
		var self = $(this);
		self.addClass("active").siblings().removeClass("active");
	});

	(function getThemes() {
		var list = $("#themes-list");
		var item = list.find(".item").remove();
		$.getJSON("https://themes.jsonresume.org/themes.json", function(json) {
			var themes = json.themes;
			if (!themes) {
				return;
			}
			for (var t in themes) {
				var theme = item
					.clone()
					.attr("href", "#" + t)
					.find(".name")
					.html(t)
					.end()
					.find(".version")
					.html(themes[t].versions.shift())
					.end()
					.appendTo(list);
			}
		});
		list.on("click", ".item", function() {
			form.trigger("change");
		});
	})();

	var jsonEditor = $("#json-editor");

	(function() {
		var timer = null;
		jsonEditor.on("keyup", function() {
			clearTimeout(timer);
			timer = setTimeout(function() {
				try {
					var text = jsonEditor.val();
					builder.setFormValues(JSON.parse(text))
				} catch(e) {
					// ..
				}
			}, 200);
		});
	})();

	form.on("change", function() {
		var json = builder.getFormValuesAsJSON();
		if (jsonEditor.val() !== json) {
			jsonEditor.val(json);
		}
	});

	$("#sidebar .view").on("click", "a", function(e) {
		e.preventDefault();
		var self = $(this);
		var type = self.data("type");
		self.addClass("active").siblings().removeClass("active");
		jsonEditor.toggleClass("show", type == "json");
	});
});

function reset() {
	var username = getCookie('username');
	$.getJSON("/"+ username +".json", function(data) {
		builder.setFormValues(data);
	});
}

function clear() {
	builder.setFormValues({});
}

function enableTSEplugin() {
	var preview = $("#preview");
	var scrollable = $(".tse-scrollable");
	scrollable.TrackpadScrollEmulator();
	scrollable.on("startDrag", function() {
		preview.addClass("scroll");
	});
	scrollable.on("endDrag", function() {
		preview.removeClass("scroll");
	});
}

function enableCSStransitions() {
	setTimeout(function() {
		$("body").removeClass("preload");
	}, 200);
}
