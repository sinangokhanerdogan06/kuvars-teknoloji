<?php
require_once 'baglan.php';
$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
if (!$id) { header('Location: urunler.html'); exit; }

$stmt = $db->prepare("SELECT * FROM products WHERE id = ?");
$stmt->execute([$id]);
$urun = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$urun) { header('Location: urunler.html'); exit; }

$resimler = json_decode($urun['resimler'] ?? '[]', true) ?: [$urun['resim_url']];
$ozellikler = json_decode($urun['ozellikler'] ?? '[]', true) ?: [];
$ana_resim = $resimler[0] ?? $urun['resim_url'];
?>
<!DOCTYPE html>
<html lang="tr" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($urun['isim']) ?> – Kuvars Teknoloji</title>
  <link rel="stylesheet" href="css/style.css">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    .detay-container { max-width: 1100px; margin: 120px auto 60px; padding: 0 2rem; }
    .detay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
    @media (max-width: 768px) { .detay-grid { grid-template-columns: 1fr; } }

    /* Gallery */
    .gallery-main { width: 100%; aspect-ratio: 1/1; border-radius: 16px; border: 1px solid var(--border2); background: var(--bg2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .gallery-main img { max-width: 90%; max-height: 90%; object-fit: contain; transition: opacity 0.3s; }
    .gallery-thumbs { display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
    .gallery-thumb { width: 72px; height: 72px; border-radius: 10px; border: 2px solid var(--border2); background: var(--bg2); cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s; }
    .gallery-thumb.active, .gallery-thumb:hover { border-color: var(--red2); }
    .gallery-thumb img { max-width: 85%; max-height: 85%; object-fit: contain; }

    /* Info */
    .urun-marka { font-size: 0.85rem; font-weight: 700; color: var(--red2); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.4rem; }
    .urun-isim { font-size: 1.8rem; font-weight: 700; line-height: 1.25; margin-bottom: 1rem; }
    .urun-fiyat { font-size: 2.2rem; font-weight: 800; color: var(--red2); margin-bottom: 2rem; }
    .urun-fiyat span { font-size: 1rem; font-weight: 500; color: var(--muted); margin-left: 4px; }

    /* Specs */
    .specs-title { font-size: 1rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); margin-bottom: 1rem; }
    .specs-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 8px; }
    .specs-list li { display: flex; align-items: flex-start; gap: 10px; font-size: 0.95rem; padding: 10px 14px; background: var(--bg2); border-radius: 8px; border: 1px solid var(--border2); }
    .specs-list li::before { content: '✓'; color: var(--red2); font-weight: 800; flex-shrink: 0; }

    /* Actions */
    .detay-actions { display: flex; gap: 14px; margin-top: 2rem; flex-wrap: wrap; }
    .btn-sepet { background: linear-gradient(135deg, var(--red), var(--red2)); color: white; border: none; padding: 0.85rem 2.2rem; border-radius: 10px; font-size: 1rem; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
    .btn-sepet:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(229,57,53,0.35); }
    .btn-geri { background: var(--bg2); color: var(--text); border: 1px solid var(--border2); padding: 0.85rem 1.8rem; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; text-decoration: none; transition: border-color 0.2s; display: inline-block; }
    .btn-geri:hover { border-color: var(--red2); }
  </style>
</head>
<body>

<header class="topbar">
  <div class="topbar-main">
    <a href="index.html" class="site-logo">
      <svg class="logo-crystal" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="24,3 44,14 44,34 24,45 4,34 4,14" fill="none" stroke="url(#lg1)" stroke-width="2.2"/>
        <polygon points="24,3 34,10 34,22 24,28 14,22 14,10" fill="url(#lg2)" opacity="0.25"/>
        <polygon points="24,45 34,38 34,26 24,20 14,26 14,38" fill="url(#lg2)" opacity="0.12"/>
        <line x1="24" y1="3" x2="24" y2="45" stroke="url(#lg1)" stroke-width="1.2" opacity="0.5"/>
        <line x1="4" y1="14" x2="44" y2="34" stroke="url(#lg1)" stroke-width="1.2" opacity="0.4"/>
        <line x1="44" y1="14" x2="4" y2="34" stroke="url(#lg1)" stroke-width="1.2" opacity="0.4"/>
        <defs>
          <linearGradient id="lg1" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ef5350"/>
            <stop offset="100%" stop-color="#b71c1c"/>
          </linearGradient>
          <linearGradient id="lg2" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stop-color="#ef5350"/>
            <stop offset="100%" stop-color="#b71c1c"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="logo-text-wrap"><span class="logo-brand">Kuvars</span><span class="logo-sub">Teknoloji</span></div>
    </a>

    <div class="topbar-actions" style="margin-left:auto;">
      <button class="theme-toggle" id="themeToggle" title="Tema Değiştir">☀️</button>
      <a href="sepet.html" class="cart-btn" style="text-decoration:none;">🛒<span class="cart-badge" id="cartBadge">0</span></a>
      <div id="authArea" style="display:flex;gap:0.75rem;align-items:center;">
        <a href="giris.html" class="btn-login">Giriş Yap</a>
        <a href="uye_ol.html" class="btn-register">Üye Ol</a>
      </div>
    </div>

    <nav class="subnav">
      <ul>
        <li><a href="index.html">Ana Sayfa</a></li>
        <li><a href="urunler.html">Ürünler</a></li>
      </ul>
    </nav>
  </div>
</header>

<div class="detay-container">

  <div style="margin-bottom:1.5rem;">
    <a href="javascript:history.back()" class="btn-geri">← Geri Dön</a>
  </div>

  <div class="detay-grid">

    <!-- Gallery -->
    <div>
      <div class="gallery-main">
        <img id="anaResim" src="<?= htmlspecialchars($ana_resim) ?>" alt="<?= htmlspecialchars($urun['isim']) ?>">
      </div>
      <?php if (count($resimler) > 1): ?>
      <div class="gallery-thumbs">
        <?php foreach ($resimler as $i => $r): ?>
        <div class="gallery-thumb <?= $i === 0 ? 'active' : '' ?>" onclick="resimDegistir(this, '<?= htmlspecialchars($r) ?>')">
          <img src="<?= htmlspecialchars($r) ?>" alt="Görsel <?= $i+1 ?>">
        </div>
        <?php endforeach; ?>
      </div>
      <?php endif; ?>
    </div>

    <!-- Info -->
    <div>
      <?php if (!empty($urun['marka'])): ?>
      <div class="urun-marka"><?= htmlspecialchars($urun['marka']) ?></div>
      <?php endif; ?>
      <h1 class="urun-isim"><?= htmlspecialchars($urun['isim']) ?></h1>
      <div class="urun-fiyat"><?= number_format($urun['fiyat'], 0, ',', '.') ?> ₺<span>KDV Dahil</span></div>

      <?php if (!empty($ozellikler)): ?>
      <div class="specs-title">Teknik Özellikler</div>
      <ul class="specs-list">
        <?php foreach ($ozellikler as $oz): ?>
        <li><?= htmlspecialchars($oz) ?></li>
        <?php endforeach; ?>
      </ul>
      <?php endif; ?>

      <div class="detay-actions">
        <button class="btn-sepet" onclick="sepeteEkleDetay()">Sepete Ekle 🛒</button>
        <a href="urunler.html" class="btn-geri">Tüm Ürünler</a>
      </div>
    </div>

  </div>
</div>

<script src="js/main.js"></script>
<script>
  function resimDegistir(el, url) {
    document.getElementById('anaResim').src = url;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  }

  function sepeteEkleDetay() {
    gercekSepeteEkle(
      <?= intval($urun['id']) ?>,
      <?= json_encode($urun['isim']) ?>,
      <?= floatval($urun['fiyat']) ?>,
      <?= json_encode($ana_resim) ?>
    );
  }
</script>

</body>
</html>
