'use strict';

$(document).on('pageshow', '#bid-players', function() {
	
	var raceId = Number(location.search.replace( '?', '' ));
	var currentRace = (raceId != 0) ? F2013.allRaces.findRace(raceId) : F2013.race;
	
	$('#bid-players #title').text(currentRace.name);
	if (currentRace.fullyLoaded == false) {
		$.mobile.loading('show', {text: 'Henter bud...', textVisible: true, textonly: false, theme: 'a'});
		$.getJSON(F2013.gameHost+'ws/race/'+currentRace.id).done(function(data, textStatus, jqXHR) {
			loadPlayers(F2013.allRaces.replaceRace(newRace(data)));
			$.mobile.loading('hide');
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	} else loadPlayers(currentRace);
	
	function loadPlayers(race) {
		var list = $('#bid-players #players');
		var raceParam = raceId != 0 ? '&'+raceId : '';
		if (race.raceResult) {
			var link = $('<a>').text('Resultat').prop('href', 'submitted-bid.html?result'+raceParam);
			list.append($('<li>').append(link));
		}
		race.bids.forEach(function(bid) {
			var player = bid.player;
			var link = $('<a>').text(player.firstName + ' ' + player.lastName).prop('href', 'submitted-bid.html?'+player.playername+raceParam);
			if (player.wbcParticipant) {
				link.append(' ').append($('<i>').addClass('fa fa-star-o'));
			}
			if (player.lastYearWBC) {
				link.append(' ').append($('<i>').addClass('fa fa-trophy').addClass('lastYearWBC-'+player.lastYearWBC));
			}
			if (race.completed) {
				link.append($('<span>').prop('class', 'ui-li-count').text(bid.points));
			}
			list.append($('<li>').append(link));
		})
		list.listview('refresh');
	}
});	
