const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = { x: 50, y: 180, size: 20, color: "#28a745" };
let commits = [];
let bugs = [];
let score = 0;

function spawnItem(type) {
  let item = { x: 600, y: Math.random() * 380, size: 20 };
  if (type === "commit") commits.push(item);
  else bugs.push(item);
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawCommits() {
  ctx.fillStyle = "#000";
  commits.forEach(c => ctx.fillRect(c.x, c.y, c.size, c.size));
}

function drawBugs() {
  ctx.fillStyle = "red";
  bugs.forEach(b => ctx.fillRect(b.x, b.y, b.size, b.size));
}

function updateItems() {
  commits.forEach(c => c.x -= 3);
  bugs.forEach(b => b.x -= 4);
}

function checkCollisions() {
  commits.forEach((c, i) => {
    if (player.x < c.x + c.size &&
        player.x + player.size > c.x &&
        player.y < c.y + c.size &&
        player.y + player.size > c.y) {
      score++;
      commits.splice(i, 1);
    }
  });

  bugs.forEach((b, i) => {
    if (player.x < b.x + b.size &&
        player.x + player.size > b.x &&
        player.y < b.y + b.size &&
        player.y + player.size > b.y) {
      alert("🐛 You hit a bug! Final Score: " + score);
      document.location.reload();
    }
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawCommits();
  drawBugs();
  updateItems();
  checkCollisions();

  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 10, 20);

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp" && player.y > 0) player.y -= 20;
  if (e.key === "ArrowDown" && player.y < canvas.height - player.size) player.y += 20;
});

setInterval(() => spawnItem("commit"), 2000);
setInterval(() => spawnItem("bug"), 3000);

gameLoop();
