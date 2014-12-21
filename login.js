$(document).on('pageinit', '#login', function() {
	$('#login #playername').val(F2013.user.playername());
	$('#login #remember-me').prop('checked', F2013.user.rememberMe()).checkboxradio('refresh');

	$('#login #login-btn').click(function() {
		$.ajax({url: F2013.gameHost+'ws/login/'+$('#login #playername').val()+'/'+$('#login #password').val(), crossDomain: true, dataType: 'json'}).done(function(data) {
			F2013.user.set(data);
			F2013.forceReload = true;
			window.location = 'mobile.html';
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	});
	$('#login #remember-me').click(function() {
		F2013.user.rememberMe($(this).is(':checked'));
		if(F2013.user.rememberMe() == false) {
			F2013.user.reset();
		}
	});
});