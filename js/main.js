/* ================================================================
   Kuvars Teknoloji – main.js
================================================================ */

// ── THEME TOGGLE ──────────────────────────────────────────────────
function initTheme() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('kt-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kt-theme', next);
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ── KULLANICI DURUMU VE KARŞILAMA ─────────────────────────────────
function initUserStatus() {
  const authArea = document.getElementById('authArea');
  const userName = localStorage.getItem('user_name');
  if (authArea && userName) {
    authArea.innerHTML = `
      <span style="font-size:0.85rem;color:var(--muted);margin-right:5px;">Merhaba, <strong style="color:var(--red2);">${userName}</strong> 👋</span>
      <button onclick="cikisYap()" class="btn-login" style="background:transparent;border:1px solid var(--border);cursor:pointer;padding:0.4rem 0.8rem;">Çıkış Yap</button>
    `;
  }
}

function cikisYap() {
  if (confirm('Çıkış yapmak istediğinize emin misiniz?')) {
    localStorage.removeItem('user_name');
    window.location.reload();
  }
}

// ── CART BADGE ────────────────────────────────────────────────────
function initCart() {
  const badge = document.getElementById('cartBadge');
  if (!badge) return;
  const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  const count = sepet.reduce((acc, item) => acc + item.miktar, 0);
  badge.textContent = count;
}

// ── ARAMA SİSTEMİ ─────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.querySelector('.search-bar input');
  const searchBtn = document.querySelector('.search-bar button');
  if (!searchInput || !searchBtn) return;

  function aramaYap() {
    const kelime = searchInput.value.trim();
    if (kelime) {
      window.location.href = `urunler.html?arama=${encodeURIComponent(kelime)}`;
    }
  }

  searchBtn.addEventListener('click', aramaYap);
  searchInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') { e.preventDefault(); aramaYap(); }
  });

  const aramaKelimesi = new URLSearchParams(window.location.search).get('arama');
  if (aramaKelimesi) searchInput.value = aramaKelimesi;
}

// ── MOBILE MENU ───────────────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileMenu.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => mobileMenu.classList.remove('open'))
  );

  // Active page highlight
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.subnav a, .mobile-menu a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });
}

// ── CATEGORY SLIDER (drag-scroll + 3D tilt) ───────────────────────
function initCategorySlider() {
  const wrap = document.querySelector('.cat-slider-wrap');
  const slider = document.querySelector('.cat-slider');
  if (!wrap || !slider) return;

  // Drag-to-scroll
  let isDown = false, startX, scrollLeft;

  wrap.addEventListener('mousedown', e => {
    isDown = true;
    wrap.classList.add('dragging');
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });
  wrap.addEventListener('mouseleave', () => { isDown = false; wrap.classList.remove('dragging'); });
  wrap.addEventListener('mouseup', () => { isDown = false; wrap.classList.remove('dragging'); });
  wrap.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - wrap.offsetLeft;
    slider.scrollLeft = scrollLeft - (x - startX) * 1.6;
  });

  // 3D tilt on each card
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotY =  ((x - cx) / cx) * 18;
      const rotX = -((y - cy) / cy) * 12;
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ── SCROLL FADE-IN ────────────────────────────────────────────────
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-in');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

// ── COUNTDOWN ────────────────────────────────────────────────────
function initCountdown(isoTarget) {
  const wrapper = document.getElementById('countdown');
  if (!wrapper) return;
  const pad = n => String(n).padStart(2, '0');
  const target = new Date(isoTarget).getTime();
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const dEl = wrapper.querySelector('[data-unit="days"]');    if (dEl) dEl.textContent = pad(d);
    const hEl = wrapper.querySelector('[data-unit="hours"]');   if (hEl) hEl.textContent = pad(h);
    const mEl = wrapper.querySelector('[data-unit="minutes"]'); if (mEl) mEl.textContent = pad(m);
    const sEl = wrapper.querySelector('[data-unit="seconds"]'); if (sEl) sEl.textContent = pad(s);
  }
  tick(); setInterval(tick, 1000);
}

// ── PRODUCT FILTER ────────────────────────────────────────────────
function initProductFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.flip-card');
  if (!btns.length || !cards.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const match = f === 'all' || card.dataset.altCategory === f || card.dataset.category === f;
        card.classList.toggle('hidden', !match);
      });
    });
  });
}

// ── HOMEPAGE FINDER QUIZ ──────────────────────────────────────────
function initFinderQuiz() {
  const app = document.getElementById('finder-quiz-app');
  if (!app) return;

  const steps = [
    {
      label: 'Adım 1 / 3',
      q: 'Ürünü ne amaçla kullanacaksınız?',
      opts: [
        { icon: '🎮', label: 'Oyun & Espor',     key: 'gaming' },
        { icon: '💼', label: 'Ofis & Çalışma',   key: 'ofis' },
        { icon: '🎵', label: 'Müzik & Eğlence',  key: 'muzik' },
        { icon: '🔄', label: 'Genel Kullanım',   key: 'genel' },
      ]
    },
    {
      label: 'Adım 2 / 3',
      q: 'Hangi ürün kategorisiyle ilgileniyorsunuz?',
      opts: [
        { icon: '💻', label: 'Laptop',             key: 'laptop' },
        { icon: '🖥️', label: 'Ekran / Monitör',   key: 'ekran' },
        { icon: '⌨️', label: 'Klavye & Mouse',    key: 'periferal' },
        { icon: '🎧', label: 'Kulaklık',           key: 'kulaklik' },
      ]
    },
    {
      label: 'Adım 3 / 3',
      q: 'Bütçe aralığınız nedir?',
      opts: [
        { icon: '💚', label: 'Ekonomik\n(0 – 3.000 ₺)',    key: 'budget' },
        { icon: '💛', label: 'Orta\n(3.000 – 15.000 ₺)',   key: 'mid' },
        { icon: '🔴', label: 'Premium\n(15.000 ₺+)',        key: 'high' },
      ]
    }
  ];

  const results = {
    // GAMING
    'gaming-laptop-budget':    { icon:'💻', title:'Kuvars D16 2026 V2',               price:'34.999 ₺', desc:'Intel i9, 512GB SSD ve 18 saat pil ömrüyle her ortamda güçlü performans.', link:'urun_detay.php?id=10', cat:'laptop' },
    'gaming-laptop-mid':       { icon:'💻', title:'Kuvars ROG Strix G15 Gaming Laptop', price:'42.999 ₺', desc:'RTX 3070 Ti, 300Hz FHD ekran ve RGB klavye ile üst düzey gaming deneyimi.', link:'urun_detay.php?id=8', cat:'laptop' },
    'gaming-laptop-high':      { icon:'💻', title:'Kuvars Tulpar T6 V3.4.9',           price:'54.999 ₺', desc:'RTX 5060, 32GB DDR5, 1TB SSD — maksimum güç ve hız isteyen oyuncular için.', link:'urun_detay.php?id=9', cat:'laptop' },
    'gaming-ekran-budget':     { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED panel ve 144Hz yenileme hızıyla keskin, akıcı oyun görüntüsü.', link:'urun_detay.php?id=1', cat:'ekran' },
    'gaming-ekran-mid':        { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED panel ve 144Hz yenileme hızıyla keskin, akıcı oyun görüntüsü.', link:'urun_detay.php?id=1', cat:'ekran' },
    'gaming-ekran-high':       { icon:'🖥️', title:'Kuvars S2722DGM 27" 360Hz',        price:'24.999 ₺', desc:'360Hz IPS panel ve 0.05ms tepki süresiyle espor seviyesi görsel performans.', link:'urun_detay.php?id=2', cat:'ekran' },
    'gaming-periferal-budget': { icon:'⌨️', title:'Kuvars K552 Mekanik Gaming Klavye', price:'2.299 ₺',  desc:'Blue switch, RGB aydınlatma ve TKL kompakt tasarımla oyunlarda hız ve konfor.', link:'urun_detay.php?id=3', cat:'klavye' },
    'gaming-periferal-mid':    { icon:'🖱️', title:'Kuvars G502 X Gaming Mouse',       price:'4.899 ₺',  desc:'25.600 DPI HERO sensör, 13 programlanabilir tuş ve RGB ile FPS\'te tam kontrol.', link:'urun_detay.php?id=11', cat:'mouse' },
    'gaming-periferal-high':   { icon:'🖱️', title:'Kuvars DeathAdder V3 Pro Wireless',price:'4.299 ₺',  desc:'Kablosuz 30.000 DPI, 64g ultra hafif tasarım ve 90 saat pil ömrü.', link:'urun_detay.php?id=12', cat:'mouse' },
    'gaming-kulaklik-budget':  { icon:'🎧', title:'Kuvars Tune 230NC TWS',             price:'1.599 ₺',  desc:'ANC, 40 saat pil ve Bluetooth 5.2 ile taşınabilir gaming ses deneyimi.', link:'urun_detay.php?id=7', cat:'kulaklik' },
    'gaming-kulaklik-mid':     { icon:'🎧', title:'Kuvars Cloud II Gaming Kulaklık',   price:'3.199 ₺',  desc:'7.1 Surround ses, 53mm sürücüler ve gürültü önleyici mikrofon ile tam dalmak.', link:'urun_detay.php?id=5', cat:'kulaklik' },
    'gaming-kulaklik-high':    { icon:'🎧', title:'Kuvars Arctis 7 Wireless Kulaklık', price:'9.299 ₺',  desc:'Kablosuz, 24 saat pil, lossless ses kalitesi ve ChatMix kadranı — premium gaming ses.', link:'urun_detay.php?id=6', cat:'kulaklik' },
    // OFİS
    'ofis-laptop-budget':      { icon:'💻', title:'Kuvars D16 2026 V2',               price:'34.999 ₺', desc:'İnce ultrabook tasarım, Windows 11 Pro ve 18 saat pil ömrüyle iş her yerde.', link:'urun_detay.php?id=10', cat:'laptop' },
    'ofis-laptop-mid':         { icon:'💻', title:'Kuvars D16 2026 V2',               price:'34.999 ₺', desc:'İnce ultrabook tasarım, Windows 11 Pro ve 18 saat pil ömrüyle iş her yerde.', link:'urun_detay.php?id=10', cat:'laptop' },
    'ofis-laptop-high':        { icon:'💻', title:'Kuvars ROG Strix G15 Gaming Laptop', price:'42.999 ₺', desc:'Güçlü işlemci ve büyük ekranıyla yoğun iş temposuna ve çok görevliliğe ideal.', link:'urun_detay.php?id=8', cat:'laptop' },
    'ofis-ekran-budget':       { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED panel ile göz yorulmayan, canlı renkli çalışma ekranı.', link:'urun_detay.php?id=1', cat:'ekran' },
    'ofis-ekran-mid':          { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED panel ile göz yorulmayan, canlı renkli çalışma ekranı.', link:'urun_detay.php?id=1', cat:'ekran' },
    'ofis-ekran-high':         { icon:'🖥️', title:'Kuvars S2722DGM 27" 360Hz',        price:'24.999 ₺', desc:'Yüksek renk doğruluğu ve geniş çalışma alanıyla profesyonel verimlilik.', link:'urun_detay.php?id=2', cat:'ekran' },
    'ofis-periferal-budget':   { icon:'🖱️', title:'Kuvars Sculpt Ergonomic Ofis Mouse',price:'1.899 ₺', desc:'Ergonomik yay tasarım, kablosuz ve 6 ay pil ömrüyle uzun çalışma konforlu.', link:'urun_detay.php?id=13', cat:'mouse' },
    'ofis-periferal-mid':      { icon:'⌨️', title:'Kuvars K70 RGB TKL Mekanik Klavye', price:'3.499 ₺',  desc:'Sessiz tuşlar, alüminyum çerçeve ve şık tasarımla profesyonel yazma deneyimi.', link:'urun_detay.php?id=4', cat:'klavye' },
    'ofis-periferal-high':     { icon:'⌨️', title:'Kuvars K70 RGB TKL Mekanik Klavye', price:'3.499 ₺',  desc:'Sessiz tuşlar, alüminyum çerçeve ve şık tasarımla profesyonel yazma deneyimi.', link:'urun_detay.php?id=4', cat:'klavye' },
    'ofis-kulaklik-budget':    { icon:'🎧', title:'Kuvars Tune 230NC TWS',             price:'1.599 ₺',  desc:'ANC ile toplantılarda odaklanma ve 40 saat pil ömrüyle günlük kullanım kolaylığı.', link:'urun_detay.php?id=7', cat:'kulaklik' },
    'ofis-kulaklik-mid':       { icon:'🎧', title:'Kuvars Cloud II Gaming Kulaklık',   price:'3.199 ₺',  desc:'Gürültü önleyici mikrofon ve konforlu tasarımla net sesli toplantılar.', link:'urun_detay.php?id=5', cat:'kulaklik' },
    'ofis-kulaklik-high':      { icon:'🎧', title:'Kuvars Arctis 7 Wireless Kulaklık', price:'9.299 ₺',  desc:'Kablosuz özgürlük, ClearCast mikrofon ve 24 saat pil ile tam iş konforu.', link:'urun_detay.php?id=6', cat:'kulaklik' },
    // MÜZİK
    'muzik-laptop-budget':     { icon:'💻', title:'Kuvars D16 2026 V2',               price:'34.999 ₺', desc:'Kaliteli ses çıkışı ve uzun pil ömrüyle müzik dinleme ve üretim için ideal.', link:'urun_detay.php?id=10', cat:'laptop' },
    'muzik-laptop-mid':        { icon:'💻', title:'Kuvars D16 2026 V2',               price:'34.999 ₺', desc:'Kaliteli ses çıkışı ve uzun pil ömrüyle müzik dinleme ve üretim için ideal.', link:'urun_detay.php?id=10', cat:'laptop' },
    'muzik-laptop-high':       { icon:'💻', title:'Kuvars Tulpar T6 V3.4.9',           price:'54.999 ₺', desc:'Güçlü işlemci ve yüksek RAM ile yoğun ses prodüksiyon iş akışları için.', link:'urun_detay.php?id=9', cat:'laptop' },
    'muzik-ekran-budget':      { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED\'in canlı renkleriyle müzik video ve içerik izleme keyfi.', link:'urun_detay.php?id=1', cat:'ekran' },
    'muzik-ekran-mid':         { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED\'in canlı renkleriyle müzik video ve içerik izleme keyfi.', link:'urun_detay.php?id=1', cat:'ekran' },
    'muzik-ekran-high':        { icon:'🖥️', title:'Kuvars S2722DGM 27" 360Hz',        price:'24.999 ₺', desc:'Üstün renk kalitesi ve keskin görüntüyle içerik üretimi ve izleme.', link:'urun_detay.php?id=2', cat:'ekran' },
    'muzik-periferal-budget':  { icon:'⌨️', title:'Kuvars K552 Mekanik Gaming Klavye', price:'2.299 ₺',  desc:'Mekanik tuşların konforlu hissiyle uzun yazma ve prodüksiyon seansları.', link:'urun_detay.php?id=3', cat:'klavye' },
    'muzik-periferal-mid':     { icon:'⌨️', title:'Kuvars K70 RGB TKL Mekanik Klavye', price:'3.499 ₺',  desc:'Sessiz ve hassas tuşlarla konforlu yazma, şık beyond tasarım.', link:'urun_detay.php?id=4', cat:'klavye' },
    'muzik-periferal-high':    { icon:'🖱️', title:'Kuvars DeathAdder V3 Pro Wireless',price:'4.299 ₺',  desc:'Hafif, kablosuz ve hassas kontrol ile içerik üretiminde tam özgürlük.', link:'urun_detay.php?id=12', cat:'mouse' },
    'muzik-kulaklik-budget':   { icon:'🎧', title:'Kuvars Tune 230NC TWS',             price:'1.599 ₺',  desc:'ANC ile konsantre müzik dinleme, güçlü bas ve 40 saat pil ömrü.', link:'urun_detay.php?id=7', cat:'kulaklik' },
    'muzik-kulaklik-mid':      { icon:'🎧', title:'Kuvars Cloud II Gaming Kulaklık',   price:'3.199 ₺',  desc:'53mm geniş sürücüler ve zengin ses sahnesiyle müziğin içine dal.', link:'urun_detay.php?id=5', cat:'kulaklik' },
    'muzik-kulaklik-high':     { icon:'🎧', title:'Kuvars Arctis 7 Wireless Kulaklık', price:'9.299 ₺',  desc:'Lossless ses kalitesi ve kablosuz bağlantıyla premium müzik deneyimi.', link:'urun_detay.php?id=6', cat:'kulaklik' },
    // GENEL
    'genel-laptop-budget':     { icon:'💻', title:'Kuvars D16 2026 V2',               price:'34.999 ₺', desc:'Her iş için yeterli güç, ince tasarım ve 18 saat pil ile günlük kullanım.', link:'urun_detay.php?id=10', cat:'laptop' },
    'genel-laptop-mid':        { icon:'💻', title:'Kuvars ROG Strix G15 Gaming Laptop', price:'42.999 ₺', desc:'Oyun, iş ve eğlence — her senaryoda güçlü, dengeli performans.', link:'urun_detay.php?id=8', cat:'laptop' },
    'genel-laptop-high':       { icon:'💻', title:'Kuvars Tulpar T6 V3.4.9',           price:'54.999 ₺', desc:'En yüksek performans, en büyük ekran — her şeyin en iyisi.', link:'urun_detay.php?id=9', cat:'laptop' },
    'genel-ekran-budget':      { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED kalitesi ve 144Hz akıcılığı her kullanıma uygun evrensel ekran.', link:'urun_detay.php?id=1', cat:'ekran' },
    'genel-ekran-mid':         { icon:'🖥️', title:'Kuvars UltraGear 27" 144Hz',       price:'18.499 ₺', desc:'OLED kalitesi ve 144Hz akıcılığı her kullanıma uygun evrensel ekran.', link:'urun_detay.php?id=1', cat:'ekran' },
    'genel-ekran-high':        { icon:'🖥️', title:'Kuvars S2722DGM 27" 360Hz',        price:'24.999 ₺', desc:'360Hz ve sıfıra yakın tepki süresiyle her içerik akıcı ve keskin.', link:'urun_detay.php?id=2', cat:'ekran' },
    'genel-periferal-budget':  { icon:'⌨️', title:'Kuvars K552 Mekanik Gaming Klavye', price:'2.299 ₺',  desc:'Dayanıklı mekanik tuşlar ve RGB aydınlatmayla her kullanıma uygun klavye.', link:'urun_detay.php?id=3', cat:'klavye' },
    'genel-periferal-mid':     { icon:'🖱️', title:'Kuvars G502 X Gaming Mouse',       price:'4.899 ₺',  desc:'Hassas sensör ve ergonomik tasarımla hem oyun hem ofis kullanımı için ideal.', link:'urun_detay.php?id=11', cat:'mouse' },
    'genel-periferal-high':    { icon:'🖱️', title:'Kuvars DeathAdder V3 Pro Wireless',price:'4.299 ₺',  desc:'Hafif, kablosuz ve uzun pil ömrüyle her ortamda özgür kullanım.', link:'urun_detay.php?id=12', cat:'mouse' },
    'genel-kulaklik-budget':   { icon:'🎧', title:'Kuvars Tune 230NC TWS',             price:'1.599 ₺',  desc:'ANC, Bluetooth 5.2 ve 40 saat pille günlük kullanım için ideal kulak içi.', link:'urun_detay.php?id=7', cat:'kulaklik' },
    'genel-kulaklik-mid':      { icon:'🎧', title:'Kuvars Cloud II Gaming Kulaklık',   price:'3.199 ₺',  desc:'Konforlu tasarım, geniş ses sahnesi ve mikrofonuyla çok amaçlı kullanım.', link:'urun_detay.php?id=5', cat:'kulaklik' },
    'genel-kulaklik-high':     { icon:'🎧', title:'Kuvars Arctis 7 Wireless Kulaklık', price:'9.299 ₺',  desc:'Kablosuz premium ses ve 24 saat pil ömrüyle en iyi genel kullanım kulaklığı.', link:'urun_detay.php?id=6', cat:'kulaklik' },
  };

  let step = 0;
  const answers = [];

  function render() {
    const s = steps[step];
    app.innerHTML = `
      <div class="finder-progress">
        ${steps.map((_, i) => `<div class="finder-dot ${i < step ? 'done' : i === step ? 'active' : ''}"></div>`).join('')}
      </div>
      <div class="finder-step-label">${s.label}</div>
      <div class="finder-question">${s.q}</div>
      <div class="finder-options">
        ${s.opts.map((o, i) => `
          <button class="finder-opt" data-key="${o.key}" data-idx="${i}">
            <span class="finder-opt-icon">${o.icon}</span>
            <span class="finder-opt-label">${o.label.replace('\n', '<br>')}</span>
          </button>`).join('')}
      </div>`;

    app.querySelectorAll('.finder-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        answers[step] = btn.dataset.key;
        step++;
        if (step >= steps.length) showResult();
        else render();
      });
    });
  }

  function showResult() {
    const key = answers.join('-');
    const r = results[key] || { icon: '🎯', title: 'Kuvars Koleksiyonu', price: '', desc: 'Tüm ürünlerimizi inceleyerek size en uygun olanı bulun!', link: 'urunler.html', cat: 'all' };
    app.innerHTML = `
      <div class="finder-result-card">
        <div class="finder-result-badge">Sonuç ✨</div>
        <div class="finder-result-icon">${r.icon}</div>
        <div class="finder-result-title">${r.title}</div>
        ${r.price ? `<div style="font-size:1.3rem;font-weight:800;color:var(--red2);margin:0.4rem 0 0.6rem;">${r.price}</div>` : ''}
        <div class="finder-result-desc">${r.desc}</div>
        <div class="finder-result-actions">
          <a href="${r.link || (r.cat !== 'all' ? r.cat + '.html' : 'urunler.html')}" class="btn-primary">Ürünü İncele →</a>
          <button class="btn-outline" id="finder-retry">Tekrar Dene</button>
        </div>
      </div>`;
    document.getElementById('finder-retry').addEventListener('click', () => {
      step = 0; answers.length = 0; render();
    });
  }

  render();
}

// ── FULL QUIZ (quiz.html) ─────────────────────────────────────────
function initQuiz() {
  const app = document.getElementById('quiz-app');
  if (!app) return;

  const questions = [
    {
      q: 'Bilgisayarı en çok ne için kullanıyorsun?',
      opts: [
        { text: '🎮 FPS / Rekabetçi oyunlar (CS, Valorant vb.)', s: { mouse:3, klavye:2, kulaklik:1, laptop:0 } },
        { text: '🌍 Açık dünya / RPG oyunları (Witcher, RDR2 vb.)', s: { mouse:1, klavye:1, kulaklik:3, laptop:1 } },
        { text: '💼 Ofis, okul veya içerik üretimi',               s: { mouse:1, klavye:3, kulaklik:1, laptop:2 } },
        { text: '💻 Her yerde taşınabilir kullanım',               s: { mouse:0, klavye:0, kulaklik:2, laptop:3 } },
      ]
    },
    {
      q: 'Kurulumunla ilgili hangisi seni en iyi tanımlıyor?',
      opts: [
        { text: '🖥️ Sabit masaüstü gaming kurulumum var',    s: { mouse:2, klavye:2, kulaklik:1, laptop:0 } },
        { text: '💻 Laptop ile oyun oynuyorum / çalışıyorum', s: { mouse:1, klavye:1, kulaklik:1, laptop:3 } },
        { text: '🎧 Ses kalitesi benim için her şeyden önemli', s: { mouse:0, klavye:0, kulaklik:3, laptop:1 } },
        { text: '⌨️ Klavye ve mouse\'uma çok önem veriyorum',  s: { mouse:2, klavye:3, kulaklik:0, laptop:0 } },
      ]
    },
    {
      q: 'Bir üründe seni en çok ne etkiler?',
      opts: [
        { text: '⚡ Performans ve hız — her milisaniye önemli', s: { mouse:3, klavye:2, kulaklik:1, laptop:2 } },
        { text: '🔋 Kablosuz kullanım ve uzun pil ömrü',        s: { mouse:2, klavye:1, kulaklik:3, laptop:2 } },
        { text: '🎨 Tasarım ve RGB — setup estetiği önemli',    s: { mouse:1, klavye:3, kulaklik:1, laptop:0 } },
        { text: '💰 En iyi fiyat/performans oranı',             s: { mouse:2, klavye:2, kulaklik:2, laptop:1 } },
      ]
    },
    {
      q: 'Bütçe aralığın hangisine daha yakın?',
      opts: [
        { text: '💚 0 – 3.000 ₺',    s: { mouse:2, klavye:3, kulaklik:2, laptop:0 } },
        { text: '💛 3.000 – 10.000 ₺', s: { mouse:3, klavye:2, kulaklik:3, laptop:0 } },
        { text: '🔴 10.000 – 45.000 ₺', s: { mouse:1, klavye:1, kulaklik:1, laptop:2 } },
        { text: '💎 45.000 ₺ ve üzeri', s: { mouse:0, klavye:0, kulaklik:0, laptop:3 } },
      ]
    }
  ];

  const products = {
    mouse:    { name:'Kuvars G502 X Gaming Mouse',        price:'4.899 ₺', desc:'25.600 DPI HERO sensör, 13 programlanabilir tuş ve RGB aydınlatmayla FPS\'te tam kontrol ve üstün hassasiyet.', img:'img/final photos/mouse1/mouse1.png', link:'urun_detay.php?id=11' },
    klavye:   { name:'Kuvars K552 Mekanik Gaming Klavye', price:'2.299 ₺', desc:'Mekanik Blue switch, RGB arka aydınlatma ve TKL kompakt tasarımla her gaming kurulumuna mükemmel eşlik.', img:'img/final photos/klavye1/klavye 6 .png', link:'urun_detay.php?id=3' },
    kulaklik: { name:'Kuvars Arctis 7 Wireless Kulaklık', price:'9.299 ₺', desc:'Kablosuz 2.4GHz bağlantı, 24 saat pil ömrü ve lossless ses kalitesiyle gaming ve müzikte premium deneyim.', img:'img/final photos/kulaklık2/kulaklık 2.1 .png', link:'urun_detay.php?id=6' },
    laptop:   { name:'Kuvars Tulpar T6 V3.4.9',           price:'54.999 ₺', desc:'RTX 5060, 32GB DDR5 RAM, 1TB NVMe SSD ve 17.3" 144Hz ekranıyla her yerde maksimum güç ve performans.', img:'img/final photos/laptop2/laptop 2.1 .png', link:'urun_detay.php?id=9' }
  };

  let current = 0, selected = null;
  const scores = { mouse:0, klavye:0, kulaklik:0, laptop:0 };

  function render() {
    const { q, opts } = questions[current];
    const pct = Math.round((current / questions.length) * 100);
    app.innerHTML = `
      <div class="quiz-step-label">Soru ${current + 1} / ${questions.length}</div>
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" id="qpf"></div></div>
      <div class="quiz-question">${q}</div>
      <div class="quiz-options">
        ${opts.map((o, i) => `
          <button class="quiz-option" data-idx="${i}">
            <span class="option-letter">${String.fromCharCode(65+i)}</span>${o.text}
          </button>`).join('')}
      </div>
      <div class="quiz-nav">
        <button class="btn-outline" id="qback" ${current===0?'disabled':''}>← Geri</button>
        <button class="btn-primary" id="qnext" disabled style="opacity:.4;cursor:not-allowed">
          ${current===questions.length-1?'Sonucu Gör ✨':'İlerle →'}
        </button>
      </div>`;
    requestAnimationFrame(() => { const f=document.getElementById('qpf'); if(f) f.style.width=pct+'%'; });
    app.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => {
        app.querySelectorAll('.quiz-option').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected'); selected=parseInt(btn.dataset.idx);
        const nx=document.getElementById('qnext'); nx.disabled=false; nx.style.opacity='1'; nx.style.cursor='pointer';
      });
    });
    document.getElementById('qback').addEventListener('click', () => { if(current>0){current--;selected=null;render();} });
    document.getElementById('qnext').addEventListener('click', () => {
      if(selected===null) return;
      Object.keys(opts[selected].s).forEach(k=>{scores[k]+=opts[selected].s[k];});
      selected=null; current++;
      if(current>=questions.length) showResult(); else render();
    });
  }

  function showResult() {
    const winner = Object.entries(scores).sort((a,b)=>b[1]-a[1])[0][0];
    const p = products[winner];
    app.innerHTML = `
      <div class="quiz-progress-bar" style="margin-bottom:2rem"><div class="quiz-progress-fill" style="width:100%"></div></div>
      <div class="result-card">
        <div class="result-badge">Sana Özel Öneri ✨</div>
        <p style="color:var(--muted);font-size:.88rem;margin-bottom:.25rem">Yanıtlarına göre sana en uygun ürün:</p>
        <img src="${p.img}" alt="${p.name}" class="result-product-img"/>
        <div class="result-product-name">${p.name}</div>
        <div style="font-size:1.4rem;font-weight:700;color:var(--red);margin-bottom:1rem">${p.price}</div>
        <div class="result-product-desc">${p.desc}</div>
        <div class="result-actions">
          <a href="${p.link}" class="btn-primary">Ürünü İncele →</a>
          <button class="btn-outline" id="share-btn">Paylaş 📤</button>
          <button class="btn-outline" id="retry-btn">Tekrar Dene</button>
        </div>
      </div>`;
    document.getElementById('retry-btn').addEventListener('click', () => {
      current=0; selected=null; Object.keys(scores).forEach(k=>scores[k]=0); render();
    });
    document.getElementById('share-btn').addEventListener('click', () => {
      const text = `Kuvars Teknoloji testine göre bana en uygun ürün: ${p.name}! ${window.location.href}`;
      if(navigator.share) navigator.share({title:'Kuvars Teknoloji Quiz',text,url:window.location.href}).catch(()=>{});
      else navigator.clipboard.writeText(text).then(()=>alert('Kopyalandı!')).catch(()=>alert(text));
    });
  }

  render();
}

// ── ÜRÜN VERİTABANINDAN ÇEKME + ARAMA FİLTRESİ ──────────────────
async function urunleriYukle() {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  try {
    const response = await fetch('urunleri_getir.php');
    const result = await response.json();
    if (result.status === 'success') {
      grid.innerHTML = '';

      const params = new URLSearchParams(window.location.search);
      const aramaKelimesi = params.get('arama');
      const catParam = params.get('cat');

      // Sayfa adından kategori çıkar (klavye.html → klavye)
      const sayfaAdi = window.location.pathname.split('/').pop().replace('.html', '');
      const kategoriSayfalar = ['klavye','kulaklik','mouse','mousepad','ekran','laptop'];
      const sayfaKategorisi = kategoriSayfalar.includes(sayfaAdi) ? sayfaAdi : null;

      let urunler = result.data;

      // Kategori sayfasındaysa sadece o kategorinin ürünlerini göster
      if (sayfaKategorisi) {
        urunler = urunler.filter(u => u.kategori.toLowerCase() === sayfaKategorisi);
      }

      // Alt kategori filtresi (?cat=mekanik gibi)
      if (catParam) {
        urunler = urunler.filter(u => u.alt_kategori && u.alt_kategori.toLowerCase() === catParam.toLowerCase());
      }

      // Arama filtresi
      if (aramaKelimesi) {
        const kucuk = aramaKelimesi.toLowerCase();
        urunler = urunler.filter(u =>
          u.isim.toLowerCase().includes(kucuk) ||
          u.kategori.toLowerCase().includes(kucuk) ||
          (u.marka && u.marka.toLowerCase().includes(kucuk))
        );
        if (urunler.length === 0) {
          grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:4rem;color:var(--muted);font-size:1.2rem;">"${aramaKelimesi}" için sonuç bulunamadı. 😔</div>`;
          return;
        }
      }

      urunler.forEach(urun => {
        let ozellikListesi = '';
        try { ozellikListesi = JSON.parse(urun.ozellikler).map(oz => `<li>${oz}</li>`).join(''); } catch(e) {}
        const isimSafe = urun.isim.replace(/'/g, "\\'");
        const kart = `
        <div class="flip-card fade-in visible" data-category="${urun.kategori}" data-alt-category="${urun.alt_kategori || ''}">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <img src="${urun.resim_url}" alt="${urun.isim}" class="product-img"/>
              <div class="product-info">
                <div class="product-category">${urun.kategori}</div>
                <div class="product-name">${urun.isim}</div>
                <div class="product-price">₺${urun.fiyat}</div>
              </div>
              <a href="urun_detay.php?id=${urun.id}" class="mobile-incele">İncele →</a>
            </div>
            <div class="flip-card-back">
              <div class="back-title">${urun.isim}</div>
              <ul class="back-features">${ozellikListesi}</ul>
              <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                <button class="btn-sm" onclick="gercekSepeteEkle('${urun.id}','${isimSafe}','${urun.fiyat}','${urun.resim_url}')">Sepete Ekle 🛒</button>
                <a href="urun_detay.php?id=${urun.id}" class="btn-sm" style="text-decoration:none;background:var(--bg1);border:1px solid var(--border2);color:var(--text);">İncele →</a>
              </div>
            </div>
          </div>
        </div>`;
        grid.innerHTML += kart;
      });
      initProductFilter();
      initCart();
    }
  } catch (error) {
    console.error('Ürünler yüklenirken hata:', error);
  }
}

// ── SEPETE EKLE (veritabanı ürünleriyle çalışan) ──────────────────
function gercekSepeteEkle(id, isim, fiyat, resim) {
  let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  const mevcut = sepet.find(item => item.id == id);
  if (mevcut) {
    mevcut.miktar += 1;
  } else {
    sepet.push({ id, isim, fiyat: parseFloat(fiyat), resim, miktar: 1 });
  }
  localStorage.setItem('sepet', JSON.stringify(sepet));
  initCart();
  const badge = document.getElementById('cartBadge');
  if (badge) {
    badge.style.transform = 'scale(1.5)';
    setTimeout(() => badge.style.transform = '', 300);
  }
  alert(isim + ' sepete eklendi!');
}

// ── BİLDİRİM ZİLİ ────────────────────────────────────────────────
function initNotifications() {
  const actions = document.querySelector('.topbar-actions');
  if (!actions) return;

  const kisiselYuzde = localStorage.getItem('indirim_yuzde');
  const kisiselMesaj = localStorage.getItem('indirim_mesaj');
  const userName = localStorage.getItem('user_name');

  if (!userName || !kisiselYuzde || parseInt(kisiselYuzde) <= 0) return;

  const wrap = document.createElement('div');
  wrap.className = 'notif-wrap';
  wrap.innerHTML = `
    <button class="notif-btn" id="notifBtn">🔔<span class="notif-badge">1</span></button>
    <div class="notif-dropdown" id="notifDropdown">
      <div class="notif-header">🎁 Kişisel Kuponunuz</div>
      <div class="notif-item" style="background:rgba(34,197,94,0.08);border-color:rgba(34,197,94,0.3);">
        <span class="notif-pct" style="background:linear-gradient(135deg,#16a34a,#22c55e);">%${kisiselYuzde}</span>
        <span class="notif-msg"><strong>Sana Özel!</strong><br>${kisiselMesaj || 'Kişisel indiriminiz sepete otomatik uygulandı.'}</span>
      </div>
    </div>`;

  const cartBtn = actions.querySelector('.cart-btn');
  actions.insertBefore(wrap, cartBtn);

  document.getElementById('notifBtn').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('notifDropdown').classList.toggle('open');
  });
  document.addEventListener('click', () => {
    const dd = document.getElementById('notifDropdown');
    if (dd) dd.classList.remove('open');
  });
}

// ── CANLI DESTEK CHAT ────────────────────────────────────────────
function initLiveChat() {
  const widget = document.createElement('div');
  widget.className = 'chat-widget';
  widget.innerHTML = `
    <div class="chat-window hidden" id="chatWindow">
      <div class="chat-header">
        <div class="chat-header-avatar">🤖</div>
        <div class="chat-header-info">
          <div class="chat-header-name">Kuvars Destek</div>
          <div class="chat-header-status">Çevrimiçi · Yapay Zeka Destekli</div>
        </div>
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="chat-msg bot">Merhaba! 👋 Kuvars Teknoloji'ye hoş geldiniz. Size nasıl yardımcı olabilirim?</div>
      </div>
      <div class="chat-quick-btns" id="chatQuickBtns">
        <button class="chat-quick-btn">📦 Kargo durumu</button>
        <button class="chat-quick-btn">🔄 İade nasıl?</button>
        <button class="chat-quick-btn">💻 Laptop öner</button>
        <button class="chat-quick-btn">🎧 Kulaklık öner</button>
      </div>
      <div class="chat-input-area">
        <textarea class="chat-input" id="chatInput" placeholder="Mesajınızı yazın…" rows="1"></textarea>
        <button class="chat-send-btn" id="chatSendBtn">➤</button>
      </div>
    </div>
    <button class="chat-toggle-btn" id="chatToggle">💬</button>
  `;
  document.body.appendChild(widget);

  const win = document.getElementById('chatWindow');
  const msgs = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const quickBtns = document.getElementById('chatQuickBtns');
  let history = [];
  let isOpen = false;

  document.getElementById('chatToggle').addEventListener('click', () => {
    isOpen = !isOpen;
    win.classList.toggle('hidden', !isOpen);
    document.getElementById('chatToggle').textContent = isOpen ? '✕' : '💬';
  });

  quickBtns.querySelectorAll('.chat-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.textContent.trim());
      quickBtns.style.display = 'none';
    });
  });

  sendBtn.addEventListener('click', () => sendMessage(input.value.trim()));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input.value.trim()); }
  });

  async function sendMessage(text) {
    if (!text) return;
    input.value = '';
    quickBtns.style.display = 'none';

    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = text;
    msgs.appendChild(userMsg);

    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;

    history.push({ role: 'user', text });

    try {
      const res = await fetch('gemini_chat.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-10) })
      });
      const data = await res.json();
      typing.remove();
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.textContent = data.reply || 'Bir hata oluştu.';
      msgs.appendChild(botMsg);
      history.push({ role: 'model', text: data.reply });
    } catch {
      typing.remove();
      const errMsg = document.createElement('div');
      errMsg.className = 'chat-msg bot';
      errMsg.textContent = 'Bağlantı hatası, lütfen tekrar deneyin.';
      msgs.appendChild(errMsg);
    }
    msgs.scrollTop = msgs.scrollHeight;
  }
}

// ── BOOT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUserStatus();
  initCart();
  initNotifications();
  initSearch();
  initMobileMenu();
  initCategorySlider();
  initScrollAnimations();
  initCountdown('2026-04-27T23:59:59');
  initProductFilter();
  initFinderQuiz();
  initQuiz();
  urunleriYukle();
  initLiveChat();
});
