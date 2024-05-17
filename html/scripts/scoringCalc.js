gameComplete = false;
currentRound = -1;
holes = -1;
const players = [];
class playerScore {
	name = "";
	scoreArray = [];
	constructor() { }
	addScore(score) {
		this.scoreArray.push(score);
	}
	addName(name) {
		this.name = name;
	}
	getName() {
		return this.name;
	}
	getScore() {
		let total = 0;
		this.scoreArray.forEach((element) => {
			total = total + element;
		});

		return total;
	}
	getScoreArray() {
		return this.scoreArray;
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

function restartGame() {
	//Clears game state
	Cookies.remove("PlayerState");
	Cookies.remove("holes");
	Cookies.remove("names");
	players.length = 0;
	currentRound = -1;
	runGame();
}

function runGame() {
	if (!loadPlayerState()) {
		Cookies.remove("PlayerState");
		Cookies.remove("holes");
		Cookies.remove("names");
		initSetup();
	} else {
		calcInit();
	}
}

function createPlayers(count) {
	//Creates an array of player classes, these are empty
	if (players.length == 0) {
		for (let index = 0; index < count - 1; index++) {
			players.push(new playerScore());
		}
	} else {
		console.log("players already created");
	}
}

function savePlayerState(jsonData) {
	//Saves the player state to the cookie
	Cookies.set("PlayerState", jsonData);
}

function playersToJSON(players) {
	//Converts the players array to json to be saved to the cookie
	jsonArray = [];
	players.forEach((element) => {
		jsonArray.push(JSON.parse(element.getScoresJSON()));
	});
	return JSON.stringify(jsonArray);
}

function loadPlayerState() {
	//Loads the player stated from the stored cookie
	playerState = Cookies.get("PlayerState");
	playerNames = Cookies.get("names");
	let tempHoles = Cookies.get("holes");
	if (tempHoles != null) {
		holes = tempHoles;
	} else {
		return false;
	}
	if (playerState != null && playerNames != null) {
		if (currentRound == -1) {
			jsonObject = JSON.parse(playerState);
			playerNames = JSON.parse(playerNames);
			jsonArray = [];
			for (var i in jsonObject) {
				jsonArray.push([jsonObject[i]]);
			}
			createPlayers(Number(jsonArray.length) + 1);
			jsonArray.forEach(function (value, i) {
				value.forEach(function (value1, ii) {
					value1.forEach(function (value2) {
						players[i].addScore(value2);
					});
				});
				if (players.length == playerNames.length)
					players[i].addName(playerNames[i]);
			});
			return true;
		}
		return true;
	} else {
		return false;
	}
}

function initSetup() {
	//Runs inital setup, intened to be run if no game can be found in cookies
	$("#playerSetup").empty();
	$("#playerSetup").show();
	$("#calcContainer").empty();
	$form = $('<form id="playerSelect" class="form-primary"></form>');
	$form.append(
		'<input type="number" class="input-primary" placeholder="Number of Players" name="playerCount" min="1" max="10" > '
	);
	$form.append(
		'<input type="number" class="input-primary" placeholder="Number of Holes" name="holesCount" min="1" max="20" > '
	);
	$form.append('<input type="button" value="Enter" id="psBt" >');
	$form.appendTo("#playerSetup");
	$("#psBt").click(function (e) {
		e.preventDefault();
		var playerCount = $("form").serializeArray()[0].value;
		holes = $("form").serializeArray()[1].value;
		createPlayers(Number(playerCount) + 1);
		drawNameInput();
	});
}

function drawNameInput() {
	$("#playerSetup").empty();
	$form = $('<form id="playerNames" class="form-primary"></form>');
	for (let index = 0; index < players.length; index++) {
		$form.append(
			'<input type="text" class="input-primary" placeholder="Player ' +
			(Number(index) + 1) +
			' name" name="' +
			index +
			'">'
		);
	}
	$form.append('<input type="button" value="Enter" id="pnBt" >');
	$form.appendTo("#playerSetup");
	$("#pnBt").click(function (e) {
		e.preventDefault();
		console.log($("#playerNames").serializeArray());
		saveNames($("#playerNames").serializeArray());
		$("#playerSetup").hide();
		calcInit();
	});
}

function saveNames(array) {
	if (players.length == array.length) {
		for (let index = 0; index < players.length; index++) {
			players[index].addName(array[index].value);
		}
	} else {
		for (let index = 0; index < players.length; index++) {
			players[index].addName("Player "(index + 1));
		}
	}
}

function calcInit() {
	currentRound = Number(players[0].getLength()) + 1;
	if (holes >= currentRound) {
		drawCalculator();
	} else {
		showResults();
	}
}

function drawCalculator() {
	$("#calcContainer").show();
	$("#calcContainer").empty();

	createPlayerInput(currentRound);
}

function createPlayerInput(count) {
	let holesRemaining = holes - currentRound;
	$("#calcContainer").append(
		"<p>Input Scores For Round " + currentRound + " out of " + holes + "</p>"
	);
	$form = $('<form id="scoreInput" class="form-primary"></form>');
	for (let index = 0; index < players.length; index++) {
		$form.append(
			'<input type="number" class="input-primary" placeholder="Player: ' +
			players[index].getName() +
			'" name="' +
			index +
			'" min="1" max="20" > '
		);
	}
	$form.append('<input type="button" value="Submit" id="scoreBt" >');
	$form.appendTo("#calcContainer");
	$("#scoreBt").click(function (e) {
		e.preventDefault();
		tallyScores($("#scoreInput").serializeArray());
	});
}

function tallyScores(scoresArray) {
	let i = 0;
	scoresArray.forEach((element) => {
		players[i].addScore(Number(element.value));
		i++;
	});
	saveGameState();
	printScoreSheet();
	runGame();
}

function saveGameState() {
	let nameArray = [];
	players.forEach((element) => {
		nameArray.push(element.getName());
	});
	Cookies.set("names", JSON.stringify(nameArray));
	savePlayerState(playersToJSON(players));
	Cookies.set("holes", holes);
}

function showResults() {
	$("#calcContainer").empty();
	let scoreArray = [];
	let drawArray = [];
	for (let index = 0; index < players.length; index++) {
		scoreArray[index] = players[index].getScore();
	}
	scoreArray = Object.entries(scoreArray);
	scoreArray.sort(function (a, b) {
		return a[1] - b[1];
	});
	drawArray = calculateDraw(scoreArray);
	for (let index = 0; index < scoreArray.length; index++) {
		if (drawArray[scoreArray[index][0]] != null) {
			if (drawArray[scoreArray[index][0]].length != 0) {
				$("#calcContainer").append(
					"<p>Player " +
					players[scoreArray[index][0]].getName() +
					" drew with:</p>"
				);
				drawArray[scoreArray[index][0]].forEach((element) => {
					$("#calcContainer").append(
						"<p>Player: " + players[element].getName() + "</p>"
					);
				});
			} else if (index == 0) {
				$("#calcContainer").append(
					"<p>Player: " +
					players[scoreArray[index][0]].getName() +
					" Wins! </p>"
				);
			} else {
				$("#calcContainer").append(
					"<p>Player: " +
					players[scoreArray[index][0]].getName() +
					" is position " +
					(Number(index) + 1) +
					"</p>"
				);
			}
		} else if (
			index == scoreArray.length - 1 &&
			scoreArray[index][1] != scoreArray[index - 1][1]
		) {
			$("#calcContainer").append(
				"<p>Player: " +
				players[scoreArray[index][0]].getName() +
				" is position " +
				(Number(index) + 1) +
				"</p>"
			);
		}
	}
	printFullScore(scoreArray);
}

function calculateDraw(scores) {
	finalScores = [];
	tempScores = [];
	let counter = scores[0][0];
	for (let index = 0; index < scores.length - 1; index++) {
		if (scores[index][1] == scores[index + 1][1]) {
			tempScores.push(scores[index + 1][0]);
			if (index == scores.length - 2) {
				finalScores[counter] = createArray(tempScores);
			}
		} else {
			finalScores[counter] = createArray(tempScores);
			tempScores.length = 0;
			counter = scores[index + 1][0];
		}
	}
	return finalScores;
}

function createArray(array) {
	let newarray = [];
	array.forEach((element) => {
		newarray.push(element);
	});
	return newarray;
}

function printFullScore(scoreArray) {
	var table = $("<table>").addClass("foo");
	for (let index = 0; index < scoreArray.length; index++) {
		var row = $("<tr>")
			.addClass("bar")
			.text(players[scoreArray[index][0]].getName() + " : " + scoreArray[index][1]);
		table.append(row);
	}
	$("#calcContainer").append(table);
}

function printScoreSheet() {

	var table = $("<table>").addClass("foo");
	//create headers
	var header = $("<tr>").addclass("header");
	for (let index = 0; index < holes + 2; index++) {
		if (index == 0) {
			var row = $("<th>")
				.text("Players");
			header.append(row);
		}
		else if (index == holes) {
			var row = $("<th>")
				.text("Total");
			header.append(row);
		}
		else {
			var row = $("<th>")
				.text(index);
			header.append(row);
		}
	}
	table.append(header);
	for (let playerIndex = 0; index < index < players.length; index++) {
		var scoreRow = $("<tr>");
		for (let index = 0; index < index < holes + 2; index++) {
			if (index == 0) {
				var row = $("<td>")
					.text(players[playerIndex].getName);
				scoreRow.append(row);
			}
			else if (index == holes) {
				var row = $("<td>")
					.text(players[playerIndex].getScore);
				scoreRow.append(row);
			}
			else {
				var row = $("<td>")
					.text(players[playerIndex].getScoreArray[index - 1]);
				scoreRow.append(row);
			}
		}
		table.append(scoreRow);
	}

	$("#scoresheet").append(table);
}
