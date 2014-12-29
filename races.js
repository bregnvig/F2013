'use strict';

function loadRaces() {
	if (F2013.allRaces.loaded === false) {
		$('#races-content').outerHeight($('#races').height());
		$.mobile.loading('show', {text: 'Henter løb...', textVisible: true, textonly: false, theme: 'a'});
		$.getJSON(F2013.gameHost+'ws/races').done(function(data, textStatus, jqXHR) {
			F2013.allRaces.length = 0; //empty array
			$.each(data, function() {
				F2013.allRaces.push(newRace(this));
			});
			displayRaces(F2013.allRaces);
			F2013.allRaces.loaded = true;
			$.mobile.loading('hide');
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	}
	
	function displayRaces(races) {
		var list = $('#races #races-list');
		races.forEach(function(race) {
			if (race.viewable()) {
				list.append($('<li>').append($('<a>').text(race.name).prop('href', 'players.html?'+race.id)));
			} else {
				list.append($('<li>').text(race.name));
			}
		});
		list.listview('refresh');
	}
}
