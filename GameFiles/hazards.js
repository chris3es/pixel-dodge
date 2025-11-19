// hazards.js
export const hazardTypes = {
  fall: {
    color: '#5aa9ff',
    behavior: (h, dt) => { h.y += h.vy * dt; }
  },
  zig: {
    color: '#ff8c69',
    behavior: (h, dt, t) => {
      h.y += h.vy * dt;
      h.x += h.vx * dt;
      h.vx += Math.sin(t * 2.2) * 8 * dt;
    }
  }
};

export function spawnHazard(W, difficulty, rand) {
  const size = rand(10, 28);
  const x = rand(size, W - size);
  const speed = rand(80, 180) * (0.7 + difficulty * 0.3);
  const type = Math.random() < 0.15 ? 'zig' : 'fall';
  const def = hazardTypes[type];
  return {
    x, y: -size,
    w: size, h: size,
    vy: speed,
    vx: (type === 'zig' ? rand(-60,60) : 0),
    type,
    color: def.color
  };
}
