# Click Mania

<!DOCTYPE html>

<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Reflex Game</title>

<style>

  body {

    background: #fff;

    font-family: 'Press Start 2P', monospace;

    color: #222;

    display: flex;

    justify-content: center;

    align-items: center;

    height: 100vh;

    margin: 0;

  }

  #gameContainer {

    width: 320px;

    height: 70vh;

    border: 2px solid #222;

    display: flex;

    flex-direction: column;

    justify-content: space-between;

    align-items: center;

    padding: 20px;

    box-sizing: border-box;

  }

  #topBar {

    width: 100%;

    display: flex;

    justify-content: space-between;

    font-size: 12px;

  }

  #gameArea {

    position: relative;

    width: 100%;

    height: 100%;

    background: #fff;

    overflow: hidden;

  }

  .target {

    position: absolute;

    width: 40px;

    height: 40px;

    background: #00c853;

    border-radius: 50%;

    box-shadow: 0 0 6px #00c853;

    cursor: pointer;

  }

  button {

    background: none;

    border: 2px solid #222;

    padding: 10px 20px;

    font-family: 'Press Start 2P', monospace;

    text-transform: uppercase;

    cursor: pointer;

  }

</style>

</head>

<body>

  <div id="gameContainer">

    <div id="topBar">

      <span id="timer">TIME LEFT: 30</span>

      <span id="score">SCORE: 0</span>

    </div>

    <div id="gameArea">

      <p id="status" style="text-align:center;">CLICK FAST!</p>

    </div>

    <button id="startBtn">START</button>

  </div>

<script>

let score = 0, timeLeft = 30, gameInterval, timerInterval;

function startGame() {

  score = 0; timeLeft = 30;

  updateDisplay();

  document.getElementById('status').textContent = 'CLICK FAST!';

  timerInterval = setInterval(() => {

    timeLeft--; updateDisplay();

    if (timeLeft <= 0) endGame();

  }, 1000);

  gameInterval = setInterval(spawnTarget, 1000);

}

function spawnTarget() {

  const area = document.getElementById('gameArea');

  const target = document.createElement('div');

  target.className = 'target';

  target.style.top = Math.random() * 80 + '%';

  target.style.left = Math.random() * 80 + '%';

  target.onclick = () => { score++; updateDisplay(); target.remove(); };

  area.appendChild(target);

  setTimeout(() => target.remove(), 800);

}

function endGame() {

  clearInterval(gameInterval);

  clearInterval(timerInterval);

  document.getElementById('status').textContent = 'Game Over! Score: ' + score;

  // TODO: send score to backend API

}

function updateDisplay() {

  document.getElementById('timer').textContent = 'TIME LEFT: ' + timeLeft;

  document.getElementById('score').textContent = 'SCORE: ' + score;

}

document.getElementById('startBtn').onclick = startGame;

</script>

</body>

</html>

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c7678198-766f-4239-bfbf-e650f7773243).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
