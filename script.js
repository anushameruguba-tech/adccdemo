// Mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.nav');
if (menuBtn) menuBtn.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});

// Active nav link
const here = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav a').forEach(a => { if (a.getAttribute('href') === here) a.classList.add('active'); });

// Reveal on scroll
const io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// 3D tilt on cards
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

// Postcode checker (demo: London & Home Counties postcode areas)
const AREAS = ['E','EC','N','NW','SE','SW','W','WC','BR','CR','DA','EN','HA','IG','KT','RM','SM','TW','UB','WD','SL','AL','GU'];
document.querySelectorAll('[data-postcode]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const input = form.querySelector('input');
    const msg = document.getElementById(form.dataset.postcode);
    const pc = input.value.trim().toUpperCase();
    const area = (pc.match(/^[A-Z]+/) || [''])[0];
    if (!pc) { msg.textContent = 'Please enter your postcode.'; return; }
    msg.textContent = AREAS.includes(area)
      ? `Good news — we collect in ${pc}. Next available slot: tomorrow, 7–9am.`
      : `We don't collect in ${pc} yet. Call 0800 716 625 and we'll help.`;
    if (AREAS.includes(area) && form.dataset.go) location.href = form.dataset.go + '?postcode=' + encodeURIComponent(pc);
  });
});

// Booking / contact forms (demo submit)
document.querySelectorAll('form[data-demo]').forEach(form => {
  const params = new URLSearchParams(location.search);
  const pcField = form.querySelector('[name=postcode]');
  if (pcField && params.get('postcode')) pcField.value = params.get('postcode');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    form.style.display = 'none';
    document.getElementById(form.dataset.demo).style.display = 'block';
  });
});

// Branch filter
const bq = document.getElementById('branch-q');
if (bq) bq.addEventListener('input', () => {
  const q = bq.value.trim().toLowerCase();
  document.querySelectorAll('.branch').forEach(b => { b.style.display = b.textContent.toLowerCase().includes(q) ? '' : 'none'; });
});

// Year
document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
