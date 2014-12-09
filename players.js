$(document).on("pageshow", "#bid-players", function() {
	
	var raceId = Number(location.search.replace( "?", "" ));
	var currentRace = (raceId != 0) ? F2013.allRaces.findRace(raceId) : F2013.race;
	
	$("#bid-players #title").text(currentRace.name);
	if (currentRace.fullyLoaded == false) {
		$.mobile.loading("show", {text: "Henter bud...", textVisible: true, textonly: false, theme: "a"});
		$.getJSON(F2013.gameHost+"ws/race/"+currentRace.id).done(function(data, textStatus, jqXHR) {
			loadPlayers(F2013.allRaces.replaceRace(newRace(data)));
			$.mobile.loading("hide");
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	} else loadPlayers(currentRace);
	
	function loadPlayers(race) {
		var list = $("#bid-players #players");
		var raceParam = raceId != 0 ? "&"+raceId : "";
		if (race.raceResult) {
			var link = $("<a>").text("Resultat").prop("href", "submitted-bid.html?result"+raceParam);
			list.append($("<li>").append(link));
		}
		$.each(race.bids, function() {
			var link = $("<a>").text(this.player.name).prop("href", "submitted-bid.html?"+this.player.playername+raceParam);
			if (race.completed) {
				link.append($("<span>").prop("class", "ui-li-count").text(this.points));
			}
			list.append($("<li>").append(link));
		})
		list.listview("refresh");
	}
});	
