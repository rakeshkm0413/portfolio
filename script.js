/* =========================================================
   1. THEME TOGGLE (Light / Dark)
   ========================================================= */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'dark';

root.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

themeToggle.addEventListener('click', () => {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
  updateParticlesForTheme(next);
});

/* =========================================================
   2. THREE.JS 3D PARTICLE BACKGROUND
   ========================================================= */
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const particlesGeometry = new THREE.BufferGeometry();
const count = 2500;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 25;
  colors[i] = Math.random() > 0.5 ? 0.55 : 0.02;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
  size: 0.045,
  vertexColors: true,
  transparent: true,
  opacity: 0.85,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);
camera.position.z = 6;

function updateParticlesForTheme(theme) {
  if (theme === 'light') {
    particlesMaterial.opacity = 0.55;
    particlesMaterial.blending = THREE.NormalBlending;
  } else {
    particlesMaterial.opacity = 0.85;
    particlesMaterial.blending = THREE.AdditiveBlending;
  }
  particlesMaterial.needsUpdate = true;
}
updateParticlesForTheme(savedTheme);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();

  particles.rotation.y = t * 0.05;
  particles.rotation.x = Math.sin(t * 0.1) * 0.15;

  camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 0.8 - camera.position.y) * 0.05;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =========================================================
   3. MOBILE MENU
   ========================================================= */
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* =========================================================
   4. SCROLL REVEAL
   ========================================================= */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('active'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
revealElements.forEach(el => revealObserver.observe(el));

/* =========================================================
   5. TYPING EFFECT
   ========================================================= */
const typingEl = document.querySelector('.typing');
const texts = [
  'Data Analyst | MIS Reporting | BI Dashboards',
  'SQL • Python • Power BI • Tableau',
  'Turning Data Into Decisions'
];
let textIndex = 0, charIndex = 0, deleting = false;

function typeLoop() {
  const current = texts[textIndex];

  if (!deleting) {
    typingEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typingEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

/* =========================================================
   6. CONTACT FORM (Formspree → rakeshkumarmistri010413@gmail.com)
   ========================================================= */
const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusEl.textContent = 'Sending...';
  statusEl.className = 'form-status';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      statusEl.textContent = '✅ Message sent successfully! I will reply soon.';
      statusEl.className = 'form-status success';
      form.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (err) {
    statusEl.textContent = '❌ Oops! Something went wrong. Please email me directly.';
    statusEl.className = 'form-status error';
  }
});
