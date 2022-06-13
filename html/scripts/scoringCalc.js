$(function () {
	$("#addPlayer").click(function (e) {
		e.preventDefault();
	});
});

function createPlayers(count) {
	for (let index = 0; index < count; index++) {
		players.push(playerScore());
	}
}
