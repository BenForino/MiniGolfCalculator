class playerScore {
	constructor(name) {
		this.name = name;
	}
	addScore(score) {
		this.scoreArray.push(score);
	}

	getScore() {
		total = 0;
		scoreArray.forEach((element) => {
			total = total + element;
		});

		return total;
	}
}
