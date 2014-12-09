var User = function() {
	
	this._token = localStorage["token"];
	this._playername = localStorage["playername"];
	this._name = localStorage["name"];
	
	this.isValid = function() {
		return this.token() != null;
	},
	this.playername = function(playername) {
		if (playername === undefined) return this._playername == null ? "" : this._playername;
		this._playername = playername;
		if (this.rememberMe()) localStorage["playername"] = playername;
	},
	this.token = function(token) {
		if (token === undefined) return this._token;
		this._token = token;
		if (this.rememberMe()) localStorage["token"] = token;
	},
	this.name = function(name) {
		if (name === undefined) return this._name;
		this._name = name;
		if (this.rememberMe())localStorage["name"] = name;
	},
	this.rememberMe = function(rememberMe) {
		if (rememberMe === undefined) return localStorage["remember-me"]  == null || localStorage["remember-me"] == "true";
		localStorage["remember-me"] = rememberMe;
	},
	this.reset = function() {
		localStorage.removeItem("playername");
		localStorage.removeItem("token");
		localStorage.removeItem("name");
	},
	this.authorizationValue = function() {
		if (this.isValid() == false) return null;
		return "Basic " + window.btoa(this.playername()+":"+this.token());
	}
}

raceFunction = {
		open: function() {
			return this.opened == true && this.participant == false;
		},
		viewable: function() {
			return this.participant || this.closed == true;
		},
		status: function() {
			if (this.participant == true) return "Du har allerede spillet";
			if (this.closed == true && this.completed == false) {
				return "Der kan ikke længere afgives bud";
			}
			if (this.opened == true) return "Spillet er åbent for bud";
			if (this.opened == false && this.completed == false) {
				return "Spillet er ikke åbent endnu";
			} 
			return "Ukendt status";
		}
}

var newRace = function(data) {
	return $.extend(Object.create(raceFunction), data);
}

driverFunction = {
		option: function() {
			return $("<option>").prop("value", this.id).text(this.name);
		}
}

newDriver = function(data) {
	return $.extend(Object.create(driverFunction), data);
}

newDrivers = function(data) {
	
	var drivers = [];
	$.each(data, function(i, driver){
		drivers.push(newDriver(driver));
	});
	
	return {
		populateWithDrivers: function(selectElement) {
			$.each(drivers, function(i, driver) {
				selectElement.append(driver.option());
			});
			selectElement.selectmenu("refresh");
		},
		populateWithPositions: function(selectElement) {
			$.each(drivers, function(i, driver) {
				selectElement.append($("<option>").prop("value", i+1).text(i+1));
			});
			selectElement.selectmenu("refresh");
		},
		getDriver: function(id) {
			return $.grep(drivers, function(driver) {
				return driver.id == id;
			})[0];
		}
	}
}

var Bid = function() {
	this.polePositionTime = 0;
	this.podium = [];
	this.grid = [];
	this.fastestLap = null; 
	this.firstCrash = null; 
	this.selectedDriver = [];
}