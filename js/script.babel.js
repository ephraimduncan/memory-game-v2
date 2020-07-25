'use strict';

var cardsArray = [
	{
		name: 'shell',
		img: 'img/blueshell.png',
	},
	{
		name: 'star',
		img: 'img/star.png',
	},
	{
		name: 'bobomb',
		img: 'img/bobomb.png',
	},
	{
		name: 'mario',
		img: 'img/mario.png',
	},
	{
		name: 'luigi',
		img: 'img/luigi.png',
	},
	{
		name: 'peach',
		img: 'img/peach.png',
	},
	{
		name: '1up',
		img: 'img/1up.png',
	},
	{
		name: 'mushroom',
		img: 'img/mushroom.png',
	},
	{
		name: 'thwomp',
		img: 'img/thwomp.png',
	},
	{
		name: 'bulletbill',
		img: 'img/bulletbill.png',
	},
	{
		name: 'coin',
		img: 'img/coin.png',
	},
	{
		name: 'goomba',
		img: 'img/goomba.png',
	},
];

var gameGrid = cardsArray.concat(cardsArray).sort(function () {
	return 0.5 - Math.random();
});

var firstGuess = '';
var secondGuess = '';
var count = 0;
var previousTarget = null;
var delay = 1200;
var score = 0;
var timeLeft = 60;
var isPaused = false;

var game = document.getElementById('game');
var grid = document.createElement('section');
var scoreboard = document.querySelector('.score');
var time = document.querySelector('.time');
var sb = document.querySelector('.scoreboard');
var start = document.querySelector('.start');
var startBtn = document.querySelector('.start-btn');
var pauseBtn = document.querySelector('.pause-btn');
var playBtn = document.querySelector('.play-btn');
var paused = document.querySelector('.paused');
var btns = document.querySelectorAll('.click');
var icons = document.querySelectorAll('.social a');

var intro = new Audio('../audio/intro.mp3');
var gamePlay = new Audio('../audio/gameplay.mp3');
var pauseMenu = new Audio('../audio/pause.mp3');
var wrong = new Audio('../audio/wrong.wav');
var pair = new Audio('../audio/pair.wav');
var clicks = new Audio('../audio/pair2.mp3');
var gameOver = new Audio('../audio/gameover.mp3');
var final = new Audio('../audio/final.wav');
var completed = new Audio('../audio/complete.mp3');

grid.setAttribute('class', 'grid');
game.appendChild(grid);
intro.play();

gameGrid.forEach(function (item) {
	var name = item.name,
		img = item.img;
	var card = document.createElement('div');
	card.classList.add('card');
	card.dataset.name = name;
	var front = document.createElement('div');
	front.classList.add('front');
	var back = document.createElement('div');
	back.classList.add('back');
	back.style.backgroundImage = 'url('.concat(img, ')');
	grid.appendChild(card);
	card.appendChild(front);
	card.appendChild(back);
});

var match = function match() {
	pair.play();
	var selected = document.querySelectorAll('.selected');
	selected.forEach(function (card) {
		card.classList.add('match');
	});
};

var resetGuesses = function resetGuesses() {
	firstGuess = '';
	secondGuess = '';
	count = 0;
	previousTarget = null;
	var selected = document.querySelectorAll('.selected');
	selected.forEach(function (card) {
		card.classList.remove('selected');
	});
};

var increaseScore = function increaseScore() {
	score++;
	scoreboard.textContent = 'SCORE: '.concat(score);
	setTimeout(match, delay);
};

var timer = function timer() {
	time.textContent = 'Time Left: '.concat(timeLeft);
	timeLeft--;

	if (timeLeft < 0) {
		timeLeft = 0;
		gameOver.play();
		setTimeout(function () {
			return (sb.style.display = 'flex');
		}, 500);
		sb.innerHTML = '\n      <h1> Game Over \uD83D\uDE14</h1>\n    \t<p>You Scored: '.concat(
			score,
			'</p>\n\t\t\t<span onclick="location.reload()" class="click">Replay</span>\n    ',
		);
	}

	if (timeLeft === 3) {
		gamePlay.pause();
		final.play();
		final.volume(200);
	}

	if (score === 12) {
		setTimeout(function () {
			return (sb.style.display = 'flex');
		}, 500);
		completed.play();
		gamePlay.pause();
		sb.innerHTML =
			'\n      <img src="https://www.mariowiki.com/images/1/15/MK8-Line-Mario-Trophy.gif">\n    \t<p>Level Complete. Well Done!\uD83C\uDF1F\uD83C\uDF89</p>\n\t\t\t<span onclick="location.reload()" class="click">Replay</span>\n    ';
	}
};

var pauseGame = function pauseGame() {
	pauseMenu.play();
	gamePlay.pause();
	isPaused = true;
	paused.style.display = 'flex';
};

var playGame = function playGame() {
	pauseMenu.pause();
	gamePlay.play();
	isPaused = false;
	paused.style.display = 'none';
};

grid.addEventListener('click', function (event) {
	var clicked = event.target;

	if (
		clicked.nodeName === 'SECTION' ||
		clicked === previousTarget ||
		clicked.parentNode.classList.contains('selected') ||
		clicked.parentNode.classList.contains('match')
	) {
		return;
	}

	if (count < 2) {
		count++;

		if (count === 1) {
			firstGuess = clicked.parentNode.dataset.name;
			console.log(firstGuess);
			clicked.parentNode.classList.add('selected');
		} else {
			secondGuess = clicked.parentNode.dataset.name;
			console.log(secondGuess);
			clicked.parentNode.classList.add('selected');
		}

		if (firstGuess && secondGuess) {
			if (firstGuess === secondGuess) {
				increaseScore();
			}

			if (firstGuess !== secondGuess) {
				wrong.play();
			}

			setTimeout(resetGuesses, delay);
		}

		previousTarget = clicked;
	}
});

btns.forEach(function (btn) {
	return btn.addEventListener('click', function () {
		clicks.play();
	});
});

icons.forEach(function (icon) {
	return icon.addEventListener('click', pauseGame);
});

pauseBtn.addEventListener('click', pauseGame);
playBtn.addEventListener('click', playGame);

startBtn.addEventListener('click', function () {
	setInterval(function () {
		if (!isPaused) {
			timer();
		}
	}, 1000);
	start.style.display = 'none';
	intro.pause();
	gamePlay.play();
});
