import { spawnHazard, hazardTypes } from './hazards.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const bestEl  = document.getElementById('best');
const livesEl = document.getElementById('lives');

const W = canvas.width, H = canvas.height;
const keys = new Set();

addEventListener('keydown', e => keys.add(e.key.toLowerCase()));
addEventListener('keyup', e => keys.delete(e.key.toLowerCase()));

const clamp = (x,a,b)=>Math.max(a,Math.min(b,x));
const rand=(a,b)=>a+Math.random()*(b-a);

const state = {
  running:true, score:0, best:+(localStorage.getItem('pd.best')||0),
  lives:3, t:0, difficulty:1,
  player:{x:W/2,y:H-40,w:22,h:22,speed:210},
  hazards:[], spawnTimer:0
};
bestEl.textContent=state.best.toFixed(1);

function reset(full=false){
  state.score=0; state.t=0; state.difficulty=1;
  state.player.x=W/2; state.player.y=H-40;
  state.hazards.length=0; state.spawnTimer=0;
  if(full) state.lives=3;
  livesEl.textContent=state.lives;
}

function update(dt){
  state.t+=dt; state.difficulty=1+state.t*0.08;
  const p=state.player;
  const left=keys.has('a')||keys.has('arrowleft');
  const right=keys.has('d')||keys.has('arrowright');
  const up=keys.has('w')||keys.has('arrowup');
  const down=keys.has('s')||keys.has('arrowdown');
  p.x+= (right-left)*p.speed*dt;
  p.y+= (down-up)*p.speed*dt;
  p.x=clamp(p.x,p.w/2,W-p.w/2);
  p.y=clamp(p.y,p.h/2,H-p.h/2);

  state.spawnTimer-=dt;
  const spawnRate=clamp(0.9-state.t*0.03,0.18,0.9);
  if(state.spawnTimer<=0){
    state.hazards.push(spawnHazard(W,state.difficulty,rand));
    state.spawnTimer=spawnRate;
  }

  for(const h of state.hazards){
    if(h.type==='zig') hazardTypes.zig.behavior(h,dt,state.t);
    else hazardTypes.fall.behavior(h,dt);
  }

  for(let i=state.hazards.length-1;i>=0;i--){
    const h=state.hazards[i];
    if(h.y-h.h>H) state.hazards.splice(i,1);
    if(Math.abs(p.x-h.x)<(p.w/2+h.w/2)&&Math.abs(p.y-h.y)<(p.h/2+h.h/2)){
      state.hazards.splice(i,1);
      state.lives--; livesEl.textContent=state.lives;
      if(state.lives<=0) gameOver();
    }
  }

  state.score+=dt*10*Math.sqrt(state.difficulty);
  scoreEl.textContent=state.score.toFixed(1);
}

function gameOver(){
  state.running=false;
  state.best=Math.max(state.best,state.score);
  localStorage.setItem('pd.best',state.best.toFixed(1));
  bestEl.textContent=state.best.toFixed(1);

  // Save score to leaderboard
  const currentUser = JSON.parse(localStorage.getItem('pd.currentUser')||'null');
  if (currentUser) {
    let scores = JSON.parse(localStorage.getItem('pd.scores')||'[]');
    const existing = scores.find(s=>s.username===currentUser.username);
    if (existing) {
      existing.score = Math.max(existing.score,state.score);
    } else {
      scores.push({username:currentUser.username,score:state.score});
    }
    localStorage.setItem('pd.scores',JSON.stringify(scores));
  }
}

function render(){
  ctx.fillStyle='#0f1117'; ctx.fillRect(0,0,W,H);
  const p=state.player;
  ctx.fillStyle='#79c0ff';
  ctx.fillRect(p.x-p.w/2,p.y-p.h/2,p.w,p.h);
  for(const h of state.hazards){
    ctx.fillStyle=h.color;
    ctx.fillRect(h.x-h.w/2,h.y-h.h/2,h.w,h.h);
  }
}

let acc=0,last=performance.now(),step=1/120;
function loop(now){
  const dt=Math.min(0.25,(now-last)/1000); last=now;
  if(state.running) acc+=dt;
  while(acc>=step){update(step); acc-=step;}
  render(); requestAnimationFrame(loop);
}
reset(true); requestAnimationFrame(loop);

// Show player name
const currentUser = JSON.parse(localStorage.getItem('pd.currentUser')||'null');
if(currentUser) document.getElementById('player-name').textContent = currentUser.username;