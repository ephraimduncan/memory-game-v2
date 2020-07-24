const cardsArray = [
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

const gameGrid = cardsArray.concat(cardsArray).sort(() => 0.5 - Math.random());

let firstGuess = '';
let secondGuess = '';
let count = 0;
let previousTarget = null;
let delay = 1200;
let score = 0;
let timeLeft = 60;
let isPaused = false;

const game = document.getElementById('game');
const grid = document.createElement('section');
const scoreboard = document.querySelector('.score');
const time = document.querySelector('.time');
const sb = document.querySelector('.scoreboard');
const start = document.querySelector('.start');
const startBtn = document.querySelector('.start-btn');
const pauseBtn = document.querySelector('.pause-btn');
const playBtn = document.querySelector('.play-btn');
const paused = document.querySelector('.paused');
grid.setAttribute('class', 'grid');
game.appendChild(grid);

gameGrid.forEach((item) => {
	const { name, img } = item;

	const card = document.createElement('div');
	card.classList.add('card');
	card.dataset.name = name;

	const front = document.createElement('div');
	front.classList.add('front');

	const back = document.createElement('div');
	back.classList.add('back');
	back.style.backgroundImage = `url(${img})`;

	grid.appendChild(card);
	card.appendChild(front);
	card.appendChild(back);
});

const match = () => {
	const selected = document.querySelectorAll('.selected');
	selected.forEach((card) => {
		card.classList.add('match');
	});
};

const resetGuesses = () => {
	firstGuess = '';
	secondGuess = '';
	count = 0;
	previousTarget = null;

	var selected = document.querySelectorAll('.selected');
	selected.forEach((card) => {
		card.classList.remove('selected');
	});
};

const increaseScore = () => {
	score++;
	scoreboard.textContent = `SCORE: ${score}`;
	setTimeout(match, delay);
};

const timer = () => {
	time.textContent = `Time Left: ${timeLeft}`;
	timeLeft--;
	if (timeLeft < 0) {
		timeLeft = 0;
		setTimeout(() => (sb.style.display = 'flex'), 500);
		sb.innerHTML = `
    	<p>You Scored: ${score}</p>
			<span onclick="location.reload()">Replay</span>
    `;
	}
};

grid.addEventListener('click', (event) => {
	const clicked = event.target;

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
			setTimeout(resetGuesses, delay);
		}
		previousTarget = clicked;
	}
});

pauseBtn.addEventListener('click', () => {
	isPaused = true;
	paused.style.display = 'flex';
});

playBtn.addEventListener('click', () => {
	isPaused = false;
	paused.style.display = 'none';
});

startBtn.addEventListener('click', () => {
	setInterval(() => {
		if (!isPaused) {
			timer();
		}
	}, 1000);

	start.style.display = 'none';
});
