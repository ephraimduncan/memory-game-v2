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
const btns = document.querySelectorAll('.click');

const intro = new Audio('../audio/intro.mp3');
const gamePlay = new Audio('../audio/gameplay.mp3');
const pauseMenu = new Audio('../audio/pause.mp3');
const wrong = new Audio('../audio/wrong.wav');
const pair = new Audio('../audio/pair.wav');
const clicks = new Audio('../audio/pair2.mp3');
const gameOver = new Audio('../audio/gameover.mp3');
const final = new Audio('../audio/final.wav');
const completed = new Audio('../audio/complete.mp3');

grid.setAttribute('class', 'grid');
game.appendChild(grid);
intro.play();

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
	pair.play();
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

	let selected = document.querySelectorAll('.selected');
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
		gameOver.play();
		setTimeout(() => (sb.style.display = 'flex'), 500);
		sb.innerHTML = `
    	<p>You Scored: ${score}</p>
			<span onclick="location.reload()" class="click">Replay</span>
    `;
	}

	if (timeLeft === 3) {
		gamePlay.pause();
		final.play();
		final.volume(200);
	}
	if (score === 12) {
		setTimeout(() => (sb.style.display = 'flex'), 500);
		completed.play();
		gamePlay.pause();
		sb.innerHTML = `
      <img src="https://www.mariowiki.com/images/1/15/MK8-Line-Mario-Trophy.gif">
    	<p>Level Complete. Well Done!</p>
			<span onclick="location.reload()" class="click">Replay</span>
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
			if (firstGuess !== secondGuess) {
				wrong.play();
			}
			setTimeout(resetGuesses, delay);
		}
		previousTarget = clicked;
	}
});

btns.forEach((btn) => {
	btn.addEventListener('click', () => {
		clicks.play();
	});
});

pauseBtn.addEventListener('click', () => {
	pauseMenu.play();
	gamePlay.pause();
	isPaused = true;
	paused.style.display = 'flex';
});

playBtn.addEventListener('click', () => {
	pauseMenu.pause();
	gamePlay.play();
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
	intro.pause();
	gamePlay.play();
});
