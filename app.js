// ====== AYARLAR ======
// Cavabların gələcəyi WhatsApp nömrəsi (ölkə kodu ilə, + və boşluqsuz), məs: "994501234567".
// Boş qalsa, WhatsApp açılır və qonaq mesajı kimə göndərəcəyini özü seçir.
const WHATSAPP_NUMBER = "";
// =====================

document.documentElement.classList.add('js');

// Görünmə animasiyası
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.rv').forEach((el) => io.observe(el));

// Cavab forması
const form = document.getElementById('rsvp');
const nameEl = document.getElementById('ad');
const countEl = document.getElementById('say');
const errEl = document.getElementById('err');
const opts = form.querySelectorAll('.opt');
let choice = null;

opts.forEach((b) => b.addEventListener('click', () => {
  choice = b.dataset.v;
  opts.forEach((o) => o.setAttribute('aria-pressed', String(o === b)));
  countEl.disabled = choice === 'no';
  countEl.style.opacity = choice === 'no' ? .4 : 1;
  errEl.textContent = '';
}));

form.addEventListener('submit', (ev) => {
  ev.preventDefault();
  nameEl.classList.remove('bad');
  const name = nameEl.value.trim();
  if (!name) { nameEl.classList.add('bad'); errEl.textContent = 'Zəhmət olmasa adınızı yazın.'; nameEl.focus(); return; }
  if (!choice) { errEl.textContent = 'Zəhmət olmasa iştirakınızı seçin.'; return; }

  let msg;
  if (choice === 'yes') {
    const n = parseInt(countEl.value, 10) || 1;
    msg = `Salam! Mən ${name}.\nCamal və Aysel, toyunuza məmnuniyyətlə gələcəm.\nNəfər sayı: ${n}\n14.11.2026, Neolit Wedding Hall`;
  } else {
    msg = `Salam! Mən ${name}.\nCamal və Aysel, təəssüf ki, toyunuza gələ bilməyəcəm. Sizi təbrik edir, xoşbəxtlik arzulayıram!`;
  }
  errEl.textContent = '';
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
});
