const turtle = document.getElementById("turtle");
const gameContainer = document.querySelector(".game-container");
const scoreDisplay = document.getElementById("score");
const gameOverDiv = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

let obstacles = [];
let score = 0;
let gameSpeed = 5;
let positionY = 0;
let velocity = 0;
let isJumping = false;
const gravity = 0.5;
let gameInterval;
let obstacleInterval;
let speedIncreaseInterval;

// 점프 함수
function jump() {
  if (isJumping) return;
  isJumping = true;
  velocity = 8;

  function animate() {
    positionY += velocity;
    velocity -= gravity;

    if (positionY <= 0) {
      positionY = 0;
      isJumping = false;
      turtle.style.bottom = positionY + "px";
      return;
    }

    turtle.style.bottom = positionY + "px";
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// 키보드 이벤트
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    jump();
  }
});

// 장애물 생성
function createGroundObstacle() {
  const el = document.createElement("div");
  el.classList.add("obstacle");
  el.style.right = "-20px";
  gameContainer.appendChild(el);

  obstacles.push({
    element: el,
    position: 0,
    speed: gameSpeed + Math.random() * 2,
    type: "ground"
  });
}

function createSkyObstacle() {
  const el = document.createElement("div");
  el.classList.add("obstacle", "sky");
  el.style.right = "-20px";
  gameContainer.appendChild(el);

  obstacles.push({
    element: el,
    position: 0,
    speed: gameSpeed + Math.random() * 2,
    type: "sky"
  });
}

// 장애물 이동
function moveObstacles() {
  obstacles.forEach((ob, idx) => {
    ob.position += ob.speed;
    ob.element.style.right = ob.position + "px";

    if (ob.position > 620) {
      gameContainer.removeChild(ob.element);
      obstacles.splice(idx, 1);
      score += 10;
    }
  });
}

// 충돌 감지
function checkCollision() {
  const tRect = turtle.getBoundingClientRect();
  for (const ob of obstacles) {
    const oRect = ob.element.getBoundingClientRect();

    const isColliding =
      tRect.right > oRect.left &&
      tRect.left < oRect.right &&
      tRect.bottom > oRect.top &&
      tRect.top < oRect.bottom;

    if (isColliding) {
      if (ob.type === "sky" && !isJumping) continue;
      return true;
    }
  }
  return false;
}

// 점수 업데이트
function updateScore() {
  scoreDisplay.textContent = `점수: ${score}`;
}

// 게임 루프
function gameLoop() {
  moveObstacles();
  if (checkCollision()) {
    endGame();
  }
  updateScore();
}

// 게임 시작
function startGame() {
  obstacles.forEach(o => o.element.remove());
  obstacles = [];
  score = 0;
  updateScore();
  gameSpeed = 5;
  positionY = 0;
  turtle.style.bottom = "0px";
  gameOverDiv.style.display = "none";

  obstacleInterval = setInterval(() => {
    if (Math.random() < 0.6) createGroundObstacle();
    if (Math.random() < 0.4) createSkyObstacle();
  }, 1500);

  speedIncreaseInterval = setInterval(() => {
    if (gameSpeed < 15) gameSpeed += 0.5;
  }, 7000);

  gameInterval = setInterval(gameLoop, 20);
}

// 게임 종료
function endGame() {
  clearInterval(gameInterval);
  clearInterval(obstacleInterval);
  clearInterval(speedIncreaseInterval);
  gameOverDiv.style.display = "block";
}

// 다시 시작
restartBtn.addEventListener("click", startGame);

// 자동 시작
startGame();





