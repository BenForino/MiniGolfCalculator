const players = [];
class playerScore {
	scoreArray = [];
	constructor() { }
	addScore(score) {
		this.scoreArray.push(score);
	}

	getScore() {
		let total = 0;
		this.scoreArray.forEach((element) => {
			total = total + element;
		});

		return total;
	}
	getScoresJSON() {
		return JSON.stringify(this.scoreArray);
	}
}
$(function () {
	if (!loadPlayerState()) {
		initSetup();
	}
});

function createPlayers(count) {
	if (players.length == 0) {
		for (let index = 0; index < count; index++) {
			players.push(new playerScore());
		}
		savePlayerState(playersToJSON(players));
	}
	else {
		console.log("players already created")
	}
}

function savePlayerState(jsonData) {
	Cookies.set("PlayerState", jsonData);
}

function playersToJSON(players) {
	jsonArray = [];
	players.forEach((element) => {
		jsonArray.push(JSON.parse(element.getScoresJSON()));
	});
	return JSON.stringify(jsonArray);
}

function loadPlayerState() {
	playerState = Cookies.get("PlayerState");
	if (playerState != null) {
		jsonObject = JSON.parse(playerState);
		jsonArray = [];
		for (var i in jsonObject) {
			jsonArray.push([jsonObject[i]]);
		}
		console.log(jsonArray);

		createPlayers(jsonArray.length);

		jsonArray.forEach(function (value, i) {
			value.forEach(function (value1, ii) {
				players[i].addScore(value1);
			});
		});
		console.log(players);

		return true;
	} else {
		return false;
	}
}

function initSetup() {
	$form = $('<form id="playerSelect"></form>');
	$form.append('<input type="number" id="playerCount" name="playerCount" min="1" max="10" > ');
	$form.append('<input type="button" value="button" id="psBt" >');
	$form.appendTo('#playerSetup');
	$("#psBt").click(function (e) {
		e.preventDefault();
		var playerCount = $("form").serializeArray()[0].value;
		createPlayers(Number(playerCount) + 1);
		$("#playerSetup").hide();
	});
}