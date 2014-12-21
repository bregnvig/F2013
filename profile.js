'use strict';

$(document).on('pageinit', '#profile', function() {
	$('#firstName').val(F2013.user.firstName());
	$('#lastName').val(F2013.user.lastName());
	$('#email').val(F2013.user.emailAddress());
	$('#sms').val(F2013.user.sms());
	$('#receive-'+ (F2013.user.reminderWanted() ? 'yes' : 'no')).prop('selected', true);
	$('#receive-sms').slider('refresh');

	$('#profile #submit').click(function() {
		$.mobile.loading('show', {text: 'Gemmer profil...', textVisible: true, textonly: false, theme: 'a'});

		F2013.user.firstName($('#firstName').val());
		F2013.user.lastName($('#lastName').val());
		F2013.user.emailAddress($('#email').val());
		F2013.user.sms($('#sms').val());
		F2013.user.reminderWanted( $('#receive-yes').prop('selected'));

		$.ajax(F2013.gameHost+'ws/player', {
			type: 'POST',
			contentType: 'application/json; charset=UTF-8',
			data: F2013.user.json()
		}).done(function() {
			$.mobile.loading('hide');
			window.history.back();
		});
	});

});