if (typeof Object.create !== 'function') {
	Object.create = function(o) {
		var F = new function() {};
		F.prototype = o;
		return new F();
	}
}

$.fn.doesExist = function(){
    return jQuery(this).length > 0;
};

var F2013 = {};

F2013.user = new User();
F2013.race = null;
F2013.drivers = null;
F2013.bid = new Bid();
F2013.error = "";
F2013.forceReload = false;
F2013.testMode = window.location.search.replace( "?", "" ) == "test";
F2013.gameHost = location.host == "m.formel1.loopit.eu" ? "http://formel1.loopit.eu/" : "../";
F2013.allRaces = [];
F2013.allRaces.loaded = false;
F2013.allRaces.findRace = findRace;
F2013.allRaces.replaceRace = replaceRace;

$(document).on('pageinit', function(event) {
	$("[id^=dot]").click(function(event) {
		var index = event.currentTarget.id.replace(/\D/g, ""); 
		if (mySwiper.activeIndex != index) {
			$(".dot").removeClass("active");
			$("#dot"+index).addClass("active");
			mySwiper.swipeTo(index, Math.abs(index-mySwiper.activeIndex)*300);
		}
	});
	$.ajaxSetup({
		beforeSend: function(jqXHR){
			if (F2013.user.isValid()) jqXHR.setRequestHeader("Authorization", F2013.user.authorizationValue());
		},
		cache: false
	});
	if (Modernizr.localstorage == false) {
		$.mobile.changePage($("#no-support-local-storage"));
		return;
	} else if ('withCredentials' in new XMLHttpRequest() == false) {
		$.mobile.changePage($("#no-support-xhr"));
		return;
	} else {
		$(document).on("pageshow", "#home", function(event, ui) {
			if (F2013.user.isValid() == false && F2013.seasonname != undefined) {
				setTimeout(function() {
					$.mobile.changePage("login.html", {transition: "slidedown"});
				}, 500)
				;
			} 
			if (F2013.forceReload || ui.prevPage.length == 0) loadHome();
		});
	}
	switch (event.target.id) {
	case "home":
		$.ajax({url: F2013.gameHost + "ws/season-name", crossDomain: true, type: "GET", dataType: 'text'}).done(function(data) {
			$('#title').text(F2013.seasonname = data);
			document.title = data;
			$("#home").height($("#home").height());
			F2013.homeSize = F2013.graphSize = $("#home").height();
			mySwiper.resizeFix();
			if (F2013.user.isValid() == false) $.mobile.changePage("login.html", {transition: "slidedown"});
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
		break;
	}
});

$().on

function loadHome() {
	F2013.forceReload = false;
	$("#participate").parent().hide();
	$("#players").parent().hide();

	if (F2013.user.isValid()) {
		$.mobile.loading("show", {text: "Henter løbet...", textVisible: true, textonly: false, theme: "a"});
		$.ajax({url: F2013.gameHost+'ws/race', dataType: 'json'}).done(function(data, textStatus, jqXHR) {
			F2013.race = newRace(data);
			$("#race-name").text(F2013.race.name);
			$("#race-status").text(F2013.race.status());
			if (F2013.race.open()) {
				$("#participate").parent().show();
				$.ajax({url: F2013.gameHost+"ws/race/drivers", dataType: 'json'}).done(function(data) {
					F2013.drivers = newDrivers(data);
					$.mobile.loading("hide");
				}).fail(function(jqxhr, textStatus, error) {
					gotoErrorPage(error);
				});
			} else {
				if (F2013.race.viewable()) {
					$("#players").parent().show();
				}
				$.mobile.loading("hide");
			}
		}).fail(function(jqxhr, textStatus, error) {
			gotoErrorPage(error);
		});
	} else {
		$("#race-status").text("Du er ikke logget ind");
	}
}

$("#not-working").on("pageshow", function(event, ui) {
	$("#error-text").text(F2013.error);
});

function gotoErrorPage(error) {
	$.mobile.loading("hide");
	F2013.error = error;
	$.mobile.changePage($("#not-working"));
}

function pageSwiped(swiper) {
	if (swiper.previousIndex != swiper.activeIndex) {
		$(".dot").removeClass("active");
		$("#dot"+swiper.activeIndex).addClass("active");
		switch (swiper.activeIndex) {
		case 0:
			setHomeSize(F2013.homeSize);
			$('#title').text('Alle løb');
			loadRaces();
			break;
		case 1:
			setHomeSize(F2013.homeSize);
			$('#title').text(F2013.seasonname);
			break;
		case 2:
			setHomeSize(F2013.homeSize);
			$('#title').text('WBC');
			loadWBC();
			break;
		case 3:
			setHomeSize(F2013.graphSize);
			$('#title').text('WBC Samlet graf');
			F2013.loadGraph();
			break;
		}
	}
}

function setHomeSize(size) {
	$("#home").height(size);
}

function findRace(id) {
	return $.grep(F2013.allRaces, function(race, index) {
		return race.id == id;
	})[0];
}
function replaceRace(race) {
	if (race.id == F2013.race.id) F2013.race = race;
	$.each(F2013.allRaces, function(i) {
		if (this.id == race.id) {
			F2013.allRaces[i] = race;
			return false;
		}
	});
	return race;
}
