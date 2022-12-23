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
playersToJSON(players);
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
}

function playersToJSON(players) {
	jsonArray = [];
	players.forEach((element) => {
		jsonArray.push(element.getScoresJSON());
	});
	console.log(jsonArray);
}

function loadPlayers() {
	Cookies.set("test", "Test Value");
}
