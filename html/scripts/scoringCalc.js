const players = [];
class playerScore {
	scoreArray = [];
	constructor() {}
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
createPlayers(4);
function createPlayers(count) {
	for (let index = 0; index < count; index++) {
		players.push(new playerScore());
	}

	players.forEach((element) => {
		element.addScore(Math.floor(Math.random() * 10));
		element.addScore(Math.floor(Math.random() * 10));
	});

	players.forEach((element) => {
		console.log(element.getScore());
	});

	savePlayerState(playersToJSON(players));
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
	if (playerState !== null) {
		jsonObject = JSON.parse(playerState);
		jsonArray = [];
		for (var i in jsonObject) {
			jsonArray.push([jsonObject[i]]);
		}
		console.log(jsonArray);

		return true;
	}
}
