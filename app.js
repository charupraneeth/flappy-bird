const bird = document.querySelector(".bird");
const container = document.querySelector(".main-container");
const obstacle = document.querySelector(".obstacle");
const hole = document.querySelector(".hole");
const root = document.documentElement;
const scorecard = document.querySelector(".scorecard");
const gameLoopTime = 100;
const holeMinTop = bird.clientHeight;
const holeMinBottom =
  container.clientHeight - hole.clientHeight - bird.clientHeight;

let gameId;
let counter = 0;
const gameState = {
  started: false,
  height: 0,
  gravity: 10,
  isChanged: false,
};

const trimPx = (word) => word.slice(0, word.length - 2);

// get computed styles
const gcs = (element) => getComputedStyle(element);

function jump(e) {
  if ((e.type == "keyup" && e.keyCode == 32) || e.type == "touchstart") {
    if (!gameState.started) {
      gameState.height += 300;
      gameState.started = true;
      gameId = setInterval(gameLoop, gameLoopTime);
    }
    gameState.height -= 60;
    checkHeight();
    bird.style.top = gameState.height + "px";
  }
}

function randomizeHole() {
  counter += 1;
  const randomTop = Math.floor(
    Math.random() * (holeMinBottom - holeMinTop + 1) + holeMinTop
  );

  root.style.setProperty("--hole-top", randomTop + "px");
}
function checkCollision() {
  const obstacleLeft = +trimPx(gcs(obstacle).left);

  if (
    obstacleLeft >=
      container.clientWidth / 2 - bird.clientWidth - obstacle.clientWidth &&
    obstacleLeft <= container.clientWidth / 2 + bird.clientWidth
  ) {
    const birdTop = +trimPx(gcs(bird).top);
    const holeTop = +trimPx(gcs(hole).top);
    // bird top<=holetop || birdbottom>=holebotton = hit
    // - here birdbottom = birdtop+birdheight & holebottom = holebottom+holeheight
    if (
      birdTop <= holeTop ||
      birdTop + bird.clientHeight >= holeTop + hole.clientHeight
    ) {
      endGame();
    }
  }
}

function checkHeight() {
  if (
    gameState.height - bird.clientHeight / 2 >= container.clientHeight ||
    gameState.height + bird.clientHeight / 2 <= 0
  ) {
    endGame();
  }
}

function endGame() {
  clearInterval(gameId);
  container.classList.add("game-over");
  window.removeEventListener("keyup", jump);
  window.removeEventListener("touchstart", jump);
  container.removeEventListener("animationiteration", randomizeHole);
  scorecard.textContent = counter;
  scorecard.style.textDecoration = "none";
}

function gameLoop() {
  gameState.height += gameState.gravity;
  checkCollision();
  checkHeight();
  bird.style.top = gameState.height + "px";
}

container.addEventListener("animationiteration", randomizeHole);
window.addEventListener("touchstart", jump);
window.addEventListener("keyup", jump);
