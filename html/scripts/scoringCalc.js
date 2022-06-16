// $(function () {
// 	$("#addPlayer").click(function (e) {
// 		e.preventDefault();
// 	});
// });
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
}

createPlayers(4);
function createPlayers(count) {
	const players = [];
	for (let index = 0; index < count; index++) {
		players.push(new playerScore());
	}

	players.forEach((element) => {
		element.addScore(Math.floor(Math.random() * 10));
	});

	players.forEach((element) => {
		console.log(element.getScore());
	});
}
