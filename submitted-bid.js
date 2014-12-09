$(document).on("pageshow", "#submitted-bid", function() {
	
	//$.mobile.loading("show", {text: "Henter bud...", textVisible: true, textonly: false, theme: "a"});
	var page = $("#submitted-bid"); 
	var playername = location.search.replace( "?", "" ).split("&")[0];
	var raceId = location.search.replace( "?", "" ).split("&")[1];
	var race = F2013.race;
	if (raceId !== undefined) race = F2013.allRaces.findRace(raceId);

	if (race.bids === undefined) return;

	if (playername != "result") {
		var bids = $.grep(race.bids, function(bid, index) {
			return bid.player.playername == playername;
		});
		
		if (bids.length == 1) displayBid(bids[0]);
	} else if (race.raceResult){
		displayBid(race.raceResult);
	}
	
	function displayBid(data) {
		var result = data.firstCrashes !== undefined;
		
		page.find("#title").text(result ? "Resultat" : data.player.name);
		jQuery.each(data.grid, function() {
			page.find("#fastest-lap").before(createLi(this));
		});
		page.find("#fastest-lap").after(createLi(data.fastestLap));
		jQuery.each(data.podium, function() {
			page.find("#selected-driver").before(createLi(this));
		});
		page.find("#selected-driver").after(createSelectedDriverLi("Slutter som nr.: ", data.selectedDriver[1], data.selectedDriverPoints[1]));
		page.find("#selected-driver").after(createSelectedDriverLi("Starter som nr.: ", data.selectedDriver[0], data.selectedDriverPoints[0]));
		if (result) {
			jQuery.each(data.firstCrashes, function() {
				page.find("#pole-position-time").before(createLi(this));
			});
		} else {
			page.find("#first-crash").after(createLi(data.firstCrash));
		}
		page.find("#pole-position-time").after($("<li>").text(data.polePositionTimeInText));
		page.find("#bid").listview("refresh");
		$.mobile.loading("hide");
		
		function createLi(driver) {
			li = $("<li>").text(driver.name);
			if (data.points != 0) {
				li.append($("<span>").prop("class", "ui-li-count").text(driver.points));
			}
			return li;
		}
		function createSelectedDriverLi(text, position, points) {
			li = $("<li>").text(text + position);
			if (data.points != 0) {
				li.append($("<span>").prop("class", "ui-li-count").text(points));
			}
			return li;
		}
	}
	
});	
