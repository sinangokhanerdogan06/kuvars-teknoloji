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
      cards.forEach(card => card.classList.toggle('hidden', !(f === 'all' || card.dataset.category === f)));
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
      q: 'Ne amaçla kullanacaksınız?',
      opts: [
        { icon: '🎮', label: 'Oyun & Espor',   key: 'gaming' },
        { icon: '💼', label: 'İş & Ofis',       key: 'office' },
        { icon: '🎵', label: 'Müzik & Ses',     key: 'music' },
        { icon: '🎨', label: 'Tasarım & İçerik', key: 'creative' },
      ]
    },
    {
      label: 'Adım 2 / 3',
      q: 'Kullanım alanınız hangisi?',
      opts: [
        { icon: '🖥️', label: 'Masaüstü Kurulum', key: 'desktop' },
        { icon: '💻', label: 'Taşınabilir',       key: 'mobile' },
        { icon: '🔄', label: 'İkisi de',           key: 'both' },
      ]
    },
    {
      label: 'Adım 3 / 3',
      q: 'Bütçe aralığınız nedir?',
      opts: [
        { icon: '💚', label: 'Ekonomik\n(0 – 3.000 ₺)',  key: 'budget' },
        { icon: '💛', label: 'Orta\n(3.000 – 8.000 ₺)', key: 'mid' },
        { icon: '🔴', label: 'Premium\n(8.000 ₺+)',       key: 'high' },
      ]
    }
  ];

  const results = {
    'gaming-desktop-budget':  { icon:'🖱️', title:'Gaming Mouse + Mouse Pad', desc:'Masaüstü oyun kurulumunuz için yüksek hassasiyetli gaming mouse ve hızlı yüzey sağlayan mouse pad ikilisi tam size göre.', cat:'mouse' },
    'gaming-desktop-mid':     { icon:'⌨️', title:'Mekanik Klavye + Gaming Mouse', desc:'Performans odaklı oyun kurulumu için mekanik tuş hissi ve hassas optik sensör birlikteliği.', cat:'klavye' },
    'gaming-desktop-high':    { icon:'🖥️', title:'Yüksek Hz Oyun Monitörü', desc:'144Hz ve üzeri yenileme hızı ile rekabetçi oyunlarda üst düzey görsel performans.', cat:'ekran' },
    'gaming-mobile-budget':   { icon:'🎧', label:'Hafif Gaming Kulaklık', desc:'Taşınabilir oyun deneyimi için hafif ve rahat gaming kulaklık.', cat:'kulaklik' },
    'gaming-mobile-mid':      { icon:'💻', title:'Gaming Laptop', desc:'Her yerde oyun oynamak için yüksek performanslı ekran kartı ve hızlı yenileme hızlı ekranıyla gaming laptop.', cat:'laptop' },
    'gaming-mobile-high':     { icon:'💻', title:'Premium Gaming Laptop', desc:'RTX serisi ekran kartı, QHD ekran ve ultra hız — oyunculuğun zirvesi.', cat:'laptop' },
    'gaming-both-budget':     { icon:'🖱️', title:'Kablosuz Gaming Mouse', desc:'Masaüstü ve taşınabilir kullanım için ideal kablosuz gaming mouse.', cat:'mouse' },
    'gaming-both-mid':        { icon:'💻', title:'Gaming Laptop + Aksesuar', desc:'Hem evde hem dışarıda güçlü performans için gaming laptop ve taşınabilir aksesuar seti.', cat:'laptop' },
    'gaming-both-high':       { icon:'💻', title:'Üst Segment Gaming Laptop', desc:'Her ortamda ödün vermeden oyun deneyimi için amiral gemisi gaming laptop.', cat:'laptop' },
    'office-desktop-budget':  { icon:'⌨️', title:'Sessiz Ofis Klavyesi', desc:'Uzun çalışma saatleri için ergonomik ve sessiz ofis klavyesi.', cat:'klavye' },
    'office-desktop-mid':     { icon:'🖥️', title:'IPS Ofis Monitörü', desc:'Renk doğruluğu yüksek, göz yorgunluğunu azaltan IPS panel ofis monitörü.', cat:'ekran' },
    'office-desktop-high':    { icon:'🖥️', title:'4K Çift Monitör Kurulumu', desc:'Verimlilik odaklı 4K çözünürlük ve geniş renk gamı ile profesyonel çalışma ortamı.', cat:'ekran' },
    'office-mobile-budget':   { icon:'💻', title:'İş Laptopu', desc:'Hafif gövde, uzun pil ve güçlü işlemci ile her yerde çalışmak için iş laptopu.', cat:'laptop' },
    'office-mobile-mid':      { icon:'💻', title:'Ultrabook', desc:'İnce, hafif ve güçlü — iş yolculukları için ideal ultrabook.', cat:'laptop' },
    'office-mobile-high':     { icon:'💻', title:'Premium İş Laptopu', desc:'Uzun pil, OLED ekran ve kurumsal güvenlik özellikleri ile premium iş laptopu.', cat:'laptop' },
    'office-both-budget':     { icon:'🖱️', title:'Kablosuz Ofis Mouse', desc:'Hem masaüstünde hem de seyahatte rahat kullanım için ergonomik kablosuz mouse.', cat:'mouse' },
    'office-both-mid':        { icon:'⌨️', title:'Kablosuz Klavye + Mouse Set', desc:'Çok cihazlı bağlantı ile ofis ve taşınabilir kullanım için kablosuz set.', cat:'klavye' },
    'office-both-high':       { icon:'💻', title:'Yüksek Performans Ultrabook', desc:'En ince gövde, en uzun pil, maksimum işlemci gücü — hibrit çalışmanın zirvesi.', cat:'laptop' },
    'music-desktop-budget':   { icon:'🎧', title:'Kablolu Stüdyo Kulaklık', desc:'Müziği detaylı analiz etmek ve dinlemek için geniş ses sahnesi sunan stüdyo kulaklık.', cat:'kulaklik' },
    'music-desktop-mid':      { icon:'🎧', title:'Hi-Fi Kulaklık', desc:'Yüksek çözünürlüklü ses ve doğal müzik deneyimi için Hi-Res Audio sertifikalı kulaklık.', cat:'kulaklik' },
    'music-desktop-high':     { icon:'🎧', title:'Premium Referans Kulaklık', desc:'Stüdyo kalitesinde müzik dinleme deneyimi için açık kulak premium kulaklık.', cat:'kulaklik' },
    'music-mobile-budget':    { icon:'🎧', title:'TWS Kablosuz Kulaklık', desc:'Günlük kullanım için kompakt, kablosuz ve ANC özellikli kulaklık.', cat:'kulaklik' },
    'music-mobile-mid':       { icon:'🎧', title:'Kablosuz ANC Kulaklık', desc:'Aktif gürültü önleme ile seyahatte ve dışarıda mükemmel müzik deneyimi.', cat:'kulaklik' },
    'music-mobile-high':      { icon:'🎧', title:'Premium TWS + Boyun Bandı Set', desc:'Farklı durumlar için iki farklı kulaklık — TWS ve boyun bandı en iyi kombinasyonu.', cat:'kulaklik' },
    'music-both-budget':      { icon:'🎧', title:'Çok Amaçlı Kulaklık', desc:'Hem evde hem dışarıda kaliteli ses için USB-C ve kablosuz bağlantılı kulaklık.', cat:'kulaklik' },
    'music-both-mid':         { icon:'🎧', title:'Hibrit Kulaklık Seti', desc:'Kablolu + Bluetooth seçeneği ile her ortama uyum sağlayan premium kulaklık.', cat:'kulaklik' },
    'music-both-high':        { icon:'🎧', title:'Audiophile Kulaklık', desc:'En yüksek ses kalitesi arayanlar için sınıf en iyisi akustik performans.', cat:'kulaklik' },
    'creative-desktop-budget':{ icon:'🖥️', title:'IPS Renk Kalibreli Monitör', desc:'Grafik çalışmaları için doğru renk üretimi ve geniş görüş açısı sunan IPS monitör.', cat:'ekran' },
    'creative-desktop-mid':   { icon:'🖥️', title:'2K QHD Tasarım Monitörü', desc:'sRGB %100, 2K çözünürlük ve geniş renk gamı ile yaratıcı çalışmalar için ideal.', cat:'ekran' },
    'creative-desktop-high':  { icon:'🖥️', title:'4K OLED Profesyonel Monitör', desc:'Adobe RGB %99 ve OLED panel ile renk kritik iş akışı için referans monitör.', cat:'ekran' },
    'creative-mobile-budget': { icon:'💻', title:'Tasarım Laptopu', desc:'Renk kalibreli ekran ve güçlü GPU ile yaratıcı çalışmalar için taşınabilir laptop.', cat:'laptop' },
    'creative-mobile-mid':    { icon:'💻', title:'İçerik Üretici Laptop', desc:'Renk doğruluğu yüksek ekran, hızlı işlemci ve NVMe SSD ile içerik üretimi laptopu.', cat:'laptop' },
    'creative-mobile-high':   { icon:'💻', title:'Profesyonel Yaratıcı Laptop', desc:'M-serisi çip veya RTX GPU, mini-LED ekran ile profesyonel yaratıcı iş akışı.', cat:'laptop' },
    'creative-both-budget':   { icon:'⌨️', title:'Grafik Tablet + Klavye', desc:'Dijital çizim ve verimli kısayol kullanımı için grafik tablet ve kompakt klavye.', cat:'klavye' },
    'creative-both-mid':      { icon:'💻', title:'Yaratıcı Laptop + Monitör', desc:'Taşınabilir yaratıcı çalışmalar için laptop, evde ek monitör ile genişletilebilir kurulum.', cat:'laptop' },
    'creative-both-high':     { icon:'💻', title:'Üst Segment Yaratıcı Laptop', desc:'Her ortamda profesyonel renk yönetimi ve maksimum işlemci gücü ile amiral gemisi laptop.', cat:'laptop' },
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
    const r = results[key] || { icon: '🎯', title: 'Özel Öneri', desc: 'Size özel en iyi ürünü uzmanlarımızla birlikte bulalım!', cat: 'all' };
    app.innerHTML = `
      <div class="finder-result-card">
        <div class="finder-result-badge">Sonuç ✨</div>
        <div class="finder-result-icon">${r.icon}</div>
        <div class="finder-result-title">${r.title}</div>
        <div class="finder-result-desc">${r.desc}</div>
        <div class="finder-result-actions">
          <a href="urunler.html${r.cat !== 'all' ? '?cat=' + r.cat : ''}" class="btn-primary">Ürünleri Gör →</a>
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
      q: 'Teknolojiyi genellikle nerede kullanırsın?',
      opts: [
        { text: '🏃 Spor yaparken veya dışarıda',          s: { bileklik:3, kulaklik:1, hoparlor:0, aksesuar:0 } },
        { text: '🎵 Müzik dinlerken veya vakit geçirirken', s: { bileklik:0, kulaklik:3, hoparlor:1, aksesuar:0 } },
        { text: '🏠 Evde arkadaşlarla eğlenirken',          s: { bileklik:0, kulaklik:0, hoparlor:3, aksesuar:1 } },
      ]
    },
    {
      q: 'Seni en iyi tanımlayan özellik hangisi?',
      opts: [
        { text: '💪 Aktif ve sportif biri',   s: { bileklik:3, kulaklik:1, hoparlor:0, aksesuar:0 } },
        { text: '🎧 Müzik tutkunuyum',         s: { bileklik:0, kulaklik:3, hoparlor:1, aksesuar:0 } },
        { text: '📱 Her zaman bağlantıda',     s: { bileklik:1, kulaklik:0, hoparlor:0, aksesuar:3 } },
      ]
    },
    {
      q: 'Bir üründe en önemli özellik senin için nedir?',
      opts: [
        { text: '🔋 Uzun pil ömrü',     s: { bileklik:2, kulaklik:2, hoparlor:1, aksesuar:0 } },
        { text: '🔊 Harika ses kalitesi', s: { bileklik:0, kulaklik:2, hoparlor:3, aksesuar:0 } },
        { text: '🎨 Şık tasarım',        s: { bileklik:1, kulaklik:1, hoparlor:0, aksesuar:3 } },
      ]
    },
    {
      q: 'Bu haftasonu planın ne?',
      opts: [
        { text: '🏞️ Outdoor aktivite veya spor', s: { bileklik:3, kulaklik:1, hoparlor:0, aksesuar:0 } },
        { text: '🎉 Arkadaşlarla parti / buluşma', s: { bileklik:0, kulaklik:1, hoparlor:3, aksesuar:1 } },
        { text: '🛋️ Evde rahat bir gün',           s: { bileklik:0, kulaklik:3, hoparlor:1, aksesuar:0 } },
      ]
    }
  ];

  const products = {
    bileklik: { name:'Akıllı Bileklik Pro', price:'₺1.299', desc:'Aktif yaşam tarzına özel nabız takibi, adım sayar ve uyku analizi ile her an seni destekler.', img:'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80' },
    kulaklik: { name:'Kablosuz Kulaklık X1', price:'₺2.499', desc:'Aktif gürültü önleme ve 30 saat pil ömrüyle müziğini farklı boyuta taşı.', img:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' },
    hoparlor: { name:'Mini Hoparlör Boom', price:'₺999', desc:'Su geçirmez 360° ses teknolojisiyle her ortamda yanında olan hoparlör.', img:'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80' },
    aksesuar: { name:'Mobil Aksesuar Set', price:'₺599', desc:'Hızlı şarj standı, örgülü kablo ve şık kılıflarla tarzını tamamla.', img:'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80' }
  };

  let current = 0, selected = null;
  const scores = { bileklik:0, kulaklik:0, hoparlor:0, aksesuar:0 };

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
        <p style="color:var(--muted);font-size:.88rem;margin-bottom:.25rem">Sana en uygun ürün:</p>
        <img src="${p.img}" alt="${p.name}" class="result-product-img"/>
        <div class="result-product-name">${p.name}</div>
        <div style="font-size:1.4rem;font-weight:700;color:var(--red);margin-bottom:1rem">${p.price}</div>
        <div class="result-product-desc">${p.desc}</div>
        <div class="result-actions">
          <a href="urunler.html" class="btn-primary">Ürünü İncele →</a>
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

      const aramaKelimesi = new URLSearchParams(window.location.search).get('arama');
      let urunler = result.data;

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
        <div class="flip-card fade-in visible" data-category="${urun.kategori}">
          <div class="flip-card-inner">
            <div class="flip-card-front">
              <img src="${urun.resim_url}" alt="${urun.isim}" class="product-img"/>
              <div class="product-info">
                <div class="product-category">${urun.kategori}</div>
                <div class="product-name">${urun.isim}</div>
                <div class="product-price">₺${urun.fiyat}</div>
              </div>
            </div>
            <div class="flip-card-back">
              <div class="back-title">${urun.isim}</div>
              <ul class="back-features">${ozellikListesi}</ul>
              <button class="btn-sm" onclick="gercekSepeteEkle('${urun.id}','${isimSafe}','${urun.fiyat}','${urun.resim_url}')">Sepete Ekle 🛒</button>
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

// ── BOOT ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initUserStatus();
  initCart();
  initSearch();
  initMobileMenu();
  initCategorySlider();
  initScrollAnimations();
  initCountdown('2026-04-27T23:59:59');
  initProductFilter();
  initFinderQuiz();
  initQuiz();
  urunleriYukle();
});
