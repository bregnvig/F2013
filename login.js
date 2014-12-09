$(document).on("pageinit", "#login", function() {
	$('#login #playername').val(F2013.user.playername());
	$('#login #remember-me').prop("checked", F2013.user.rememberMe()).checkboxradio("refresh");

	$('#login #login-btn').click(function() {
		F2013.user.playername($('#login #playername').val());

		$.ajax({url: F2013.gameHost+'ws/login/'+F2013.user.playername()+"/"+$('#login #password').val(), crossDomain: true, dataType: "json"}).done(function(data) {
			F2013.user.name(data.name);
			F2013.user.token(data.token);
			F2013.forceReload = true;
			history.back();
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