$(document).on("pageshow", "#wbc-player", function() {
	
	$.mobile.loading("show", {text: "Henter WBC...", textVisible: true, textonly: false, theme: "a"});
	var page = $("#wbc-player"); 
	var userId = location.search.replace( "?", "" );
	
	if (F2013.wbcPlayer == undefined) F2013.wbcPlayer = {};
	
	if (F2013.wbcPlayer[userId] == undefined) {
		$.getJSON(F2013.gameHost+"ws/wbc/"+userId)
		.done(function(data, textStatus, jqXHR) {
			displayWBC(F2013.wbcPlayer[userId] = data);
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	} else {
		displayWBC(F2013.wbcPlayer[userId]);
	}
	
	function displayWBC(data) {
		if (data == null || data.length == 0) return;
		page.find("#title").text(data[0].player.name);
		var list = page.find("#wbc");
		$.each(data, function() {
			// var link = $("<a>").text(this.race.name).prop("href", "submitted-bid.html?"+this.player.playername+"&"+this.race.id);
			//link.append($("<span>").prop("class", "ui-li-count").text(this.points));
			var span = $("<span>").prop("class", "ui-li-count").text(this.points);
			list.append($("<li>").text(this.race.name).append(span));
		});
		page.find("#wbc").listview("refresh");
		$.mobile.loading("hide");
	}
});	
