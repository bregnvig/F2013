function loadWBC() {
	if (window.wbcPlayers == undefined) {
		$("#wbc-content").outerHeight($("#wbc").height());
		$.mobile.loading("show", {text: "Henter WBC...", textVisible: true, textonly: false, theme: "a"});
		$.getJSON(F2013.gameHost+"ws/wbc").done(function(data, textStatus, jqXHR) {
			loadPlayers(window.wbcPlayers = data);
			$.mobile.loading("hide");
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	} 
	
	function loadPlayers(players) {
		var list = $("#wbc #wbc-players");
		$.each(players, function() {
			list.append($("<li>")
				    .append($("<a>").text(this.player.name).prop("href", "wbc-player.html?"+this.player.playername).append($("<span>").text(this.points).addClass("ui-li-count"))
				    ));
			})
		list.listview("refresh");
	}
}
