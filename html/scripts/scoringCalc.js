gameComplete = false;
currentRound = -1;
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
	getLength() {
		return this.scoreArray.length;
	}
}

$(function () {
	runGame();
	$("#restartBt").click(function (e) {
		e.preventDefault();
		restartGame();
	});
});

function restartGame() { //Clears game state
	Cookies.remove("PlayerState")
	players.length = 0;
	currentRound = -1;
	runGame();
}

function runGame() {
	if (!loadPlayerState()) {
		initSetup();
	} else {
		calcInit();
	}
}

function createPlayers(count) { //Creates an array of player classes, these are empty
	if (players.length == 0) {
		for (let index = 0; index < count - 1; index++) {
			players.push(new playerScore());
		}
	}
	else {
		console.log("players already created")
	}
}

function savePlayerState(jsonData) { //Saves the player state to the cookie
	Cookies.set("PlayerState", jsonData);
}

function playersToJSON(players) { //Converts the players array to json to be saved to the cookie
	jsonArray = [];
	players.forEach((element) => {
		jsonArray.push(JSON.parse(element.getScoresJSON()));
	});
	return JSON.stringify(jsonArray);
}

function loadPlayerState() { //Loads the player stated from the stored cookie
	playerState = Cookies.get("PlayerState");
	if (playerState != null) {
		if (currentRound == -1) {
			jsonObject = JSON.parse(playerState);
			jsonArray = [];
			for (var i in jsonObject) {
				jsonArray.push([jsonObject[i]]);
			}
			console.log(jsonArray);

			createPlayers(Number(jsonArray.length) + 1);

			jsonArray.forEach(function (value, i) {
				value.forEach(function (value1, ii) {
					value1.forEach(function (value2) {
						players[i].addScore(value2);
					});
				});
			});
			console.log(players);

			return true;
		}
		return true;
	} else {
		return false;
	}
}

function initSetup() { //Runs inital setup, intened to be run if no game can be found in cookies
	$("#playerSetup").empty();
	$("#playerSetup").show();
	$("#calcContainer").empty();
	$form = $('<form id="playerSelect"></form>');
	$form.append('<input type="number" <placeholder="Number of Players"> name="playerCount" min="1" max="10" > ');
	$form.append('<input type="number" <placeholder="Number of Holes"> name="holesCount" min="1" max="20" > ');
	$form.append('<input type="button" value="Enter" id="psBt" >');
	$form.appendTo('#playerSetup');
	$("#psBt").click(function (e) {
		e.preventDefault();
		var playerCount = $("form").serializeArray()[0].value;
		createPlayers(Number(playerCount) + 1);
		$("#playerSetup").hide();
		calcInit();
	});
}

function calcInit() {
	drawCalculator();
}

function drawCalculator() {
	$("#calcContainer").show();
	$("#calcContainer").empty();

	currentRound = Number(players[0].getLength()) + 1;

	createPlayerInput(currentRound);

}

function createPlayerInput(count) {
	$("#calcContainer").append('<p>Input Scores for round ' + currentRound + '</p>');
	$form = $('<form id="scoreInput"></form>');
	for (let index = 0; index < players.length; index++) {
		$form.append('<input type="number" name="' + index + '" min="1" max="20" > ');
	}
	$form.append('<input type="button" value="button" id="scoreBt" >');
	$form.appendTo('#calcContainer');
	$("#scoreBt").click(function (e) {
		e.preventDefault();
		console.log($("#scoreInput").serializeArray())
		tallyScores($("#scoreInput").serializeArray());
	});
}

function tallyScores(scoresArray) {
	let i = 0;
	scoresArray.forEach(element => {
		players[i].addScore(Number(element.value))
		i++;
	});
	savePlayerState(playersToJSON(players));
	runGame();

}