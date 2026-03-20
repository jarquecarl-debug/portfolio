/* ============================================
   CARL CHRISTIAN JARQUE — PORTFOLIO
   Shared JS: Background, Cursor, ARIA, Admin
   ============================================ */

// ============================================
// PARTICLE NETWORK BACKGROUND
// ============================================
const bgCanvas = document.getElementById('bg-canvas');
const bgCtx = bgCanvas.getContext('2d');
let bgWidth, bgHeight, particles = [];
const PARTICLE_COUNT = 90;

function resizeBg() {
  bgWidth = bgCanvas.width = window.innerWidth;
  bgHeight = bgCanvas.height = window.innerHeight;
}

function Particle() {
  this.x = Math.random() * bgWidth;
  this.y = Math.random() * bgHeight;
  this.z = Math.random() * 2 + 0.5;
  this.vx = (Math.random() - 0.5) * 0.4 * this.z;
  this.vy = (Math.random() - 0.5) * 0.4 * this.z;
  this.radius = Math.random() * 2.5 + 0.8;
  this.gold = Math.random() > 0.45;
  this.pulse = Math.random() * Math.PI * 2;
  this.pulseSpeed = Math.random() * 0.02 + 0.005;
  this.brightness = Math.random() * 0.5 + 0.5;
}

Particle.prototype.update = function() {
  this.x += this.vx;
  this.y += this.vy;
  this.pulse += this.pulseSpeed;
  if (this.x < -20) this.x = bgWidth + 20;
  if (this.x > bgWidth + 20) this.x = -20;
  if (this.y < -20) this.y = bgHeight + 20;
  if (this.y > bgHeight + 20) this.y = -20;
};

Particle.prototype.draw = function() {
  const alpha = (Math.sin(this.pulse) * 0.3 + 0.7) * this.brightness;
  const color = this.gold ? `rgba(201,168,76,${alpha})` : `rgba(0,160,220,${alpha * 0.7})`;
  const r = this.radius * (Math.sin(this.pulse * 0.7) * 0.3 + 1);
  bgCtx.beginPath();
  bgCtx.arc(this.x, this.y, r, 0, Math.PI * 2);
  bgCtx.fillStyle = color;
  bgCtx.fill();
  if (this.gold && r > 2) {
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, r * 2.5, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(201,168,76,${alpha * 0.1})`;
    bgCtx.fill();
  }
};

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}

function drawConnections() {
  const MAX_DIST = 140;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.4;
        const bothGold = particles[i].gold && particles[j].gold;
        bgCtx.beginPath();
        bgCtx.moveTo(particles[i].x, particles[i].y);
        bgCtx.lineTo(particles[j].x, particles[j].y);
        bgCtx.strokeStyle = bothGold ? `rgba(201,168,76,${alpha * 0.8})` : `rgba(0,120,180,${alpha * 0.5})`;
        bgCtx.lineWidth = bothGold ? 0.8 : 0.4;
        bgCtx.stroke();
      }
    }
  }
}

function animateBg() {
  bgCtx.clearRect(0, 0, bgWidth, bgHeight);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateBg);
}

// ============================================
// ARIA SPHERE
// ============================================
function initAriaSphere(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let angle = 0;
  const phi = Math.PI * (3 - Math.sqrt(5));
  const nodes = [];
  for (let i = 0; i < 24; i++) {
    const y = 1 - (i / 23) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    nodes.push({ x: Math.cos(theta) * r, y, z: Math.sin(theta) * r });
  }

  function draw() {
    ctx.clearRect(0, 0, 80, 80);
    angle += 0.012;
    const cx = 40, cy = 40, r = 30;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    const projected = nodes.map(n => {
      const x2 = n.x * cos - n.z * sin;
      const z2 = n.x * sin + n.z * cos;
      const scale = r / (1.8 - z2 * 0.3);
      return { sx: cx + x2 * scale, sy: cy + n.y * scale, z: z2, visible: z2 > -0.3 };
    });
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i], b = projected[j];
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dz = nodes[i].z - nodes[j].z;
        if (Math.sqrt(dx*dx+dy*dy+dz*dz) < 0.85 && a.visible && b.visible) {
          const alpha = ((a.z + b.z) / 2 + 1) / 2 * 0.7 + 0.1;
          ctx.beginPath();
          ctx.moveTo(a.sx, a.sy);
          ctx.lineTo(b.sx, b.sy);
          ctx.strokeStyle = `rgba(0,217,255,${alpha * 0.6})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    projected.forEach(p => {
      if (!p.visible) return;
      const alpha = (p.z + 1) / 2 * 0.8 + 0.2;
      ctx.beginPath();
      ctx.arc(p.sx, p.sy, Math.max(0.8, (p.z + 1) * 1.5), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,217,255,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// ============================================
// ARIA CHAT
// ============================================
let ariaOpen = false;

function toggleAria() {
  const panel = document.getElementById('aria-panel');
  if (!panel) return;
  ariaOpen = !ariaOpen;
  panel.classList.toggle('open', ariaOpen);
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function appendMessage(text, sender) {
  const messages = document.getElementById('aria-messages');
  if (!messages) return;
  const isAria = sender === 'aria';
  const div = document.createElement('div');
  div.className = `msg ${sender}`;
  const avatarSvg = isAria
    ? `<svg viewBox="0 0 24 24" fill="#00d9ff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="#c9a84c"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`;
  div.innerHTML = `
    <div class="msg-avatar ${isAria ? 'aria-av' : ''}">${avatarSvg}</div>
    <div class="msg-bubble">
      <div class="msg-text">${text}</div>
      <div class="msg-time">${getTime()}</div>
    </div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

async function sendAriaMessage() {
  const input = document.getElementById('aria-input');
  const text = input.value.trim();
  if (!text) return;
  appendMessage(text, 'user');
  input.value = '';
  const typing = document.getElementById('aria-typing');
  if (typing) typing.classList.add('show');
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are ARIA — Adaptive Response Intelligence Assistant. You are Carl Christian Jarque's personal AI assistant embedded in his portfolio. You speak on his behalf with calm precision and warmth. You occasionally say things like "Carl would want you to know..." You're like a devoted, bright companion who genuinely believes in Carl.

Carl Christian Jarque is a Computer Engineering student at San Sebastian College Recoletos De Cavite, based in Cavite, Philippines. Frontend Developer, Prompt Engineer, Computer Engineer.

Skills: React, HTML, CSS, JavaScript, Python, Java, C#, Responsive Design, UI/UX. Soft skills: Adaptability, Teamwork, Communication, Voice Impression.

Projects: 1) PhiNex — ARM-FPGA phishing detection gateway (PYNQ-Z2, thesis). 2) MRF Digitalization — QA internship, digitizing Modification Request Forms.

Hobbies: Baking, Cosplay, Coffee, Food Exploring, Merch Collecting.
Contact: GitHub: jarquecarl-debug | Email: jarquecarl@gmail.com | Facebook: carlchristian.jarque.7

Directive: To create meaningful experiences through curiosity and exploration.
Philosophy: Be Adventurous — every step into the unknown shapes who you become.

Keep responses concise (2-4 sentences), warm, and helpful.`,
        messages: [{ role: 'user', content: text }]
      })
    });
    const data = await response.json();
    if (typing) typing.classList.remove('show');
    appendMessage(data.content?.[0]?.text || "I'm having a moment — try again!", 'aria');
  } catch (err) {
    if (typing) typing.classList.remove('show');
    appendMessage("Apologies, my connection is disrupted. Feel free to explore Carl's portfolio in the meantime!", 'aria');
  }
}

function handleAriaKey(e) {
  if (e.key === 'Enter') sendAriaMessage();
}

// ============================================
// ADMIN CMS
// ============================================
const ADMIN_PASSWORD = 'carl2024admin';

function openAdminModal() {
  const modal = document.getElementById('admin-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  const log = document.getElementById('admin-terminal-log');
  log.innerHTML = '';
  const msgs = ['SYSTEM: UNAUTHORIZED ACCESS DETECTED', 'INITIATING SECURITY PROTOCOL...', 'ENTER ACCESS CREDENTIALS TO PROCEED'];
  let i = 0;
  const type = () => {
    if (i < msgs.length) {
      const line = document.createElement('div');
      line.textContent = '> ' + msgs[i];
      line.style.color = i === 0 ? '#e03c3c' : 'var(--cyan)';
      log.appendChild(line);
      i++;
      setTimeout(type, 400);
    }
  };
  type();
  setTimeout(() => document.getElementById('admin-password-input')?.focus(), 1400);
}

function closeAdminModal() {
  document.getElementById('admin-modal').style.display = 'none';
  document.getElementById('admin-password-input').value = '';
}

function handleAdminKey(e) {
  if (e.key === 'Enter') attemptAdminLogin();
  if (e.key === 'Escape') closeAdminModal();
}

function attemptAdminLogin() {
  const input = document.getElementById('admin-password-input');
  const log = document.getElementById('admin-terminal-log');
  const terminal = document.getElementById('admin-terminal');
  if (input.value === ADMIN_PASSWORD) {
    const line = document.createElement('div');
    line.textContent = '> ACCESS GRANTED — WELCOME, CARL.';
    line.style.color = '#00ff88';
    log.appendChild(line);
    setTimeout(() => { closeAdminModal(); openAdminPanel(); }, 1200);
  } else {
    input.value = '';
    const line = document.createElement('div');
    line.textContent = '> ACCESS DENIED — INVALID CREDENTIALS';
    line.style.color = '#e03c3c';
    log.appendChild(line);
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(terminal, { x: -10 }, { x: 0, duration: 0.4, ease: 'elastic.out(1,0.3)' });
    }
  }
}

function openAdminPanel() {
  window.location.href = 'admin.html';
}

// ============================================
// CURSOR
// ============================================
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');
  if (!cursor || !cursorRing) return;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  document.addEventListener('mousedown', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(0.8)';
  });

  document.addEventListener('mouseup', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}

// ============================================
// INIT ALL SHARED
// ============================================
window.addEventListener('resize', () => { resizeBg(); initParticles(); });

window.addEventListener('load', () => {
  resizeBg();
  initParticles();
  animateBg();
  initCursor();
  initAriaSphere('aria-canvas');
});
