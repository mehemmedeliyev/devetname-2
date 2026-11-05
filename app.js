// ====== AYARLAR ======
// Cavabların gələcəyi WhatsApp nömrəsi (ölkə kodu ilə, + və boşluqsuz), məs: "994501234567".
// Boş qalsa, WhatsApp açılır və qonaq mesajı kimə göndərəcəyini özü seçir.
const WHATSAPP_NUMBER = "";
// Fon musiqisi: mp3 faylını sayt qovluğuna qoyub adını yazın, məs: "music.mp3". Boş = musiqi yoxdur.
const MUSIC_FILE = "";
// Toyun vaxtı (Bakı vaxtı)
const WEDDING = new Date("2026-11-14T18:00:00+04:00");
// =====================

const root = document.documentElement;
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Görünmə animasiyaları ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  });
}, { rootMargin: "0px 0px -12% 0px" });
document.querySelectorAll(".rv, .an").forEach((el) => io.observe(el));

/* ---------- Giriş zərfi + musiqi ---------- */
const intro = document.getElementById("intro");
const musicBtn = document.getElementById("music");
let audio = null;

function startMusic() {
  if (!MUSIC_FILE) return;
  audio = new Audio(MUSIC_FILE);
  audio.loop = true;
  audio.volume = 0.6;
  audio.play().then(() => {
    musicBtn.hidden = false;
    musicBtn.classList.add("on");
  }).catch(() => {});
}
musicBtn.addEventListener("click", () => {
  if (!audio) return;
  if (audio.paused) { audio.play(); musicBtn.classList.add("on"); musicBtn.setAttribute("aria-label", "Musiqini dayandır"); }
  else { audio.pause(); musicBtn.classList.remove("on"); musicBtn.setAttribute("aria-label", "Musiqini aç"); }
});

function openInvite() {
  if (intro.classList.contains("open")) return;
  intro.classList.add("open");
  startMusic();
  const t1 = RM ? 50 : 2300, t2 = RM ? 400 : 3500;
  setTimeout(() => {
    intro.classList.add("gone");
    root.classList.remove("locked");
    root.classList.add("opened");
    window.scrollTo(0, 0);
  }, t1);
  setTimeout(() => intro.remove(), t2);
}
root.classList.add("locked");
intro.addEventListener("click", openInvite);
intro.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvite(); } });
intro.focus({ preventScroll: true });

/* ---------- Proqram: sürüşdürdükcə çəkilən mirvari ipi ---------- */
(() => {
  const page = document.getElementById("p2");
  const path = document.getElementById("neckPath");
  const end = document.getElementById("neckEnd");
  const items = [...page.querySelectorAll(".pi")].map((el) => ({ el, y: +el.dataset.y }));
  if (RM) { items.forEach((i) => i.el.classList.add("in")); return; }

  const len = path.getTotalLength();
  const N = 500, samp = [];
  let maxY = -Infinity;
  for (let k = 0; k <= N; k++) {
    const p = path.getPointAtLength((len * k) / N);
    maxY = Math.max(maxY, p.y);
    samp.push(maxY);
  }
  const endY = samp[N];
  const R_END = 170;
  path.style.strokeDasharray = `${len} ${len}`;
  end.setAttribute("r", 0);

  let cur = -200, target = -200, raf = 0;
  function targetY() {
    const r = page.getBoundingClientRect();
    return ((innerHeight * 0.68 - r.top) * 1080) / r.width;
  }
  function draw(y) {
    let k = 0;
    while (k < N && samp[k + 1] <= y) k++;
    path.style.strokeDashoffset = len * (1 - k / N);
    end.setAttribute("r", Math.max(0, Math.min(1, (y - endY + 40) / 160)) * R_END);
    items.forEach((i) => { if (y >= i.y) i.el.classList.add("in"); });
  }
  function loop() {
    cur += (target - cur) * 0.08;
    draw(cur);
    if (Math.abs(target - cur) > 0.5) raf = requestAnimationFrame(loop);
    else { cur = target; draw(cur); raf = 0; }
  }
  function onScroll() {
    const t = targetY();
    target = Math.max(target, t); // ip bir dəfə çəkildikdən sonra geri silinmir
    if (!raf) raf = requestAnimationFrame(loop);
  }
  draw(cur);
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();
})();

/* ---------- Geri sayım ---------- */
(() => {
  const box = document.getElementById("cd");
  const el = { d: "cd-d", h: "cd-h", m: "cd-m", s: "cd-s" };
  Object.keys(el).forEach((k) => (el[k] = document.getElementById(el[k])));
  const pad = (n) => String(n).padStart(2, "0");
  function set(node, v) {
    if (node.textContent === v) return;
    node.textContent = v;
    node.classList.remove("tick"); void node.offsetWidth; node.classList.add("tick");
  }
  function tick() {
    let ms = WEDDING - Date.now();
    if (ms <= 0) { box.classList.add("finished"); return; }
    const s = Math.floor(ms / 1000);
    set(el.d, pad(Math.floor(s / 86400)));
    set(el.h, pad(Math.floor((s % 86400) / 3600)));
    set(el.m, pad(Math.floor((s % 3600) / 60)));
    set(el.s, pad(s % 60));
    setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
  }
  tick();
})();

/* ---------- Mirvari konfetti ---------- */
function pearlBurst(fromEl) {
  if (RM) return;
  const fx = document.getElementById("fx");
  const r = fromEl.getBoundingClientRect();
  const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
  for (let k = 0; k < 34; k++) {
    const p = document.createElement("i");
    const size = 6 + Math.random() * 11;
    p.className = "pearl";
    p.style.cssText = `width:${size}px;height:${size}px;left:${cx - size / 2}px;top:${cy - size / 2}px`;
    fx.appendChild(p);
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
    const v = 120 + Math.random() * 220;
    const dx = Math.cos(ang) * v, dy = Math.sin(ang) * v;
    const fall = 260 + Math.random() * 220;
    p.animate([
      { transform: "translate(0,0) scale(.4)", opacity: 1 },
      { transform: `translate(${dx * 0.7}px,${dy * 0.7}px) scale(1)`, opacity: 1, offset: 0.35 },
      { transform: `translate(${dx}px,${dy + fall}px) scale(.9)`, opacity: 0 },
    ], { duration: 1500 + Math.random() * 700, easing: "cubic-bezier(.2,.6,.4,1)", fill: "forwards" })
      .onfinish = () => p.remove();
  }
}

/* ---------- Cavab forması ---------- */
const form = document.getElementById("rsvp");
const nameEl = document.getElementById("ad");
const countEl = document.getElementById("say");
const errEl = document.getElementById("err");
const opts = form.querySelectorAll(".opt");
let choice = null;

opts.forEach((b) => b.addEventListener("click", () => {
  choice = b.dataset.v;
  opts.forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
  countEl.disabled = choice === "no";
  countEl.style.opacity = choice === "no" ? 0.4 : 1;
  errEl.textContent = "";
}));

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  nameEl.classList.remove("bad");
  const name = nameEl.value.trim();
  if (!name) { nameEl.classList.add("bad"); errEl.textContent = "Zəhmət olmasa adınızı yazın."; nameEl.focus(); return; }
  if (!choice) { errEl.textContent = "Zəhmət olmasa iştirakınızı seçin."; return; }

  let msg;
  if (choice === "yes") {
    const n = parseInt(countEl.value, 10) || 1;
    msg = `Salam! Mən ${name}.\nCamal və Aysel, toyunuza məmnuniyyətlə gələcəm.\nNəfər sayı: ${n}\n14.11.2026, Neolit Wedding Hall`;
  } else {
    msg = `Salam! Mən ${name}.\nCamal və Aysel, təəssüf ki, toyunuza gələ bilməyəcəm. Sizi təbrik edir, xoşbəxtlik arzulayıram!`;
  }
  errEl.textContent = "";
  pearlBurst(form.querySelector(".send"));
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
});
