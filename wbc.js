'use strict';

function loadWBC() {
	if (!window.wbcPlayers) {
		$('#wbc-content').outerHeight($('#wbc').height());
		$.mobile.loading('show', {text: 'Henter WBC...', textVisible: true, textonly: false, theme: 'a'});
		$.getJSON(F2013.gameHost+'ws/v2/wbc/players').done(function(data, textStatus, jqXHR) {
			loadPlayers(window.wbcPlayers = data);
			$.mobile.loading('hide');
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	} 
	
	function loadPlayers(players) {
		var list = $('#wbc #wbc-players');
		players.forEach(function(wbc) {
			var player = wbc.player;
			var link = $('<a>').append(player.firstName + ' ' + player.lastName).prop('href', 'wbc-player.html?'+player.playername);
			if (player.wbcParticipant) {
				link.append(' ').append($('<i>').addClass('fa fa-star-o'));
			}
			if (player.lastYearWBC) {
				link.append(' ').append($('<i>').addClass('fa fa-trophy').addClass('lastYearWBC-'+player.lastYearWBC));
			}
			list.append($('<li>').append(link).append($('<span>').text(wbc.points).addClass('ui-li-count')));
			});
		list.listview('refresh');
	}
}

$('#btn-join-wbc').click(function() {
	$.mobile.loading('show', {text: 'Tilmelder WBC...', textVisible: true, textonly: false, theme: 'a'});
	$.ajax({
		url: F2013.gameHost+'ws/player/wbc',
		crossDomain: true,
		contentType: 'application/json; charset=UTF-8',
		type: 'POST'
	}).done(function() {
		$.mobile.loading('hide');
		F2013.user.wbcParticipant(true);
		F2013.user.updateAccount();
		$('#wbc-not-participating').fadeOut(function() {
			$('#wbc-participating').fadeIn();
		});
	});
});
