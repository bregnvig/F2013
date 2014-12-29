'use strict';

var User = function() {
	
	var _user = localStorage.user ? JSON.parse(localStorage.user) : {};
	var that = this;

	function save() {
		if (that.rememberMe()) {
			localStorage.user = JSON.stringify(_user);
		}
	}
	this.json = function() {
		return JSON.stringify(_user);
	};
	this.isValid = function() {
		return !!this.token();
	};
	this.set = function(userJSON) {
		localStorage.user = JSON.stringify(_user = userJSON);
	};
	this.playername = function(playerName) {
		if (playerName === undefined) {
			return _user ? _user.playername : '';
		}
		_user.playerName = playerName;
		save();
	};
	this.wbcParticipant = function(participant) {
		if (participant === undefined) {
			return _user ? _user.wbcParticipant : false;
		}
		_user.wbcParticipant = participant;
		save();
	};
	this.token = function(token) {
		if (token === undefined) {
			return _user ? _user.token : undefined;
		}
		_user.token = token;
		save();
	};
	this.name = function() {
			return _user ? _user.name : '';
	};
	this.firstName = function(firstName) {
		if (firstName === undefined) {
			return _user ? _user.firstName : '';
		}
		_user.firstName = firstName;
		save();
	};
	this.lastName = function(lastName) {
		if (lastName === undefined) {
			return _user ? _user.lastName : '';
		}
		_user.lastName = lastName;
		save();
	};
	this.sms = function(sms) {
		if (sms === undefined) {
			return _user ? _user.sms : '';
		}
		_user.sms = sms;
		save();
	};
	this.emailAddress = function(emailAddress) {
		if (emailAddress === undefined) {
			return _user ? _user.emailAddress : '';
		}
		_user.emailAddress = emailAddress;
		save();
	};
	this.reminderWanted = function(reminderWanted) {
		if (reminderWanted === undefined) {
			return _user ? _user.reminderWanted : '';
		}
		_user.reminderWanted = reminderWanted;
		save();
	};

	this.rememberMe = function(rememberMe) {
		if (rememberMe === undefined) {
			return !localStorage['remember-me'] || localStorage['remember-me'] === 'true';
		}
		localStorage['remember-me'] = rememberMe;
	};
	this.reset = function() {
		localStorage.removeItem('user');
	};
	this.authorizationValue = function() {
		if (this.isValid() === false) {
			return null;
		}
		return 'Basic ' + window.btoa(this.playername()+':'+this.token());
	};
	this.updateAccount = function() {
		$.ajax({url: F2013.gameHost+'ws/player/account', dataType: 'json'}).done(function(account) {
			$('#amount').text(account.balance);
			F2013.user.account = account;
			if (account.balance < 30) {
				$('#transfer-money-help').show();
			}
		});
	};
};

var raceFunction = {
		open: function() {
			return this.opened === true && this.participant === false;
		},
		viewable: function() {
			return this.participant || this.completed === true;
		},
		status: function() {
			if (this.participant === true) {
				return 'Du har allerede spillet';
			}
			if (this.closed === true && this.completed === false) {
				return 'Der kan ikke længere afgives bud';
			}
			if (this.opened === true) {
				return 'Spillet er åbent for bud';
			}
			if (this.opened === false && this.completed === false) {
				return 'Spillet er ikke åbent endnu';
			} 
			return 'Ukendt status';
		}
};

var newRace = function(data) {
	return $.extend(Object.create(raceFunction), data);
};

var driverFunction = {
		option: function() {
			return $('<option>').prop('value', this.id).text(this.name);
		}
};


var newDrivers = function(data) {

	var newDriver = function(data) {
		return $.extend(Object.create(driverFunction), data);
	};

	var drivers = [];
	data.forEach(function(driver){
		drivers.push(newDriver(driver));
	});
	
	return {
		populateWithDrivers: function(selectElement) {
			drivers.forEach(function(driver) {
				selectElement.append(driver.option());
			});
			selectElement.selectmenu('refresh');
		},
		populateWithPositions: function(selectElement) {
			drivers.forEach(function(driver, i) {
				selectElement.append($('<option>').prop('value', i+1).text(i+1));
			});
			selectElement.selectmenu('refresh');
		},
		getDriver: function(id) {
			return drivers.filter(function(driver) {
				return driver.id === id;
			})[0];
		}
	};
};

var Bid = function() {
	this.polePositionTime = 0;
	this.podium = [];
	this.grid = [];
	this.fastestLap = null; 
	this.firstCrash = null; 
	this.selectedDriver = [];
}