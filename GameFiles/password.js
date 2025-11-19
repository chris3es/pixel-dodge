// password.js
const form = document.getElementById('login-form');
const msg = document.getElementById('login-msg');
const leaderboardList = document.getElementById('leaderboard-list');

let accounts = JSON.parse(localStorage.getItem('pd.accounts') || '[]');
let scores = JSON.parse(localStorage.getItem('pd.scores') || '[]');

function saveAccounts() {
  localStorage.setItem('pd.accounts', JSON.stringify(accounts));
}
function saveScores() {
  localStorage.setItem('pd.scores', JSON.stringify(scores));
}

function renderLeaderboard() {
  leaderboardList.innerHTML = '';
  const sorted = [...scores].sort((a,b)=>b.score-a.score).slice(0,10);
  sorted.forEach((s,i)=>{
    const li = document.createElement('li');
    li.textContent = `${i+1}. ${s.username} — ${s.score.toFixed(1)}`;
    leaderboardList.appendChild(li);
  });
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (!username || !password) return;

  const existing = accounts.find(a => a.username === username);
  if (existing) {
    if (existing.password !== password) {
      msg.textContent = 'Wrong password!';
      msg.style.color = 'var(--danger)';
      msg.style.animation = 'shake 0.4s';
      return;
    }
    localStorage.setItem('pd.currentUser', JSON.stringify(existing));
    window.location.href = 'game.html';
  } else {
    const id = accounts.length + 1;
    const newAcc = { id, username, password };
    accounts.push(newAcc);
    saveAccounts();
    localStorage.setItem('pd.currentUser', JSON.stringify(newAcc));
    window.location.href = 'game.html';
  }
});

renderLeaderboard();

// Shake animation for errors
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-5px); }
  100% { transform: translateX(0); }
}`;
document.head.appendChild(style);