class playerScore {
	constructor() {}
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
