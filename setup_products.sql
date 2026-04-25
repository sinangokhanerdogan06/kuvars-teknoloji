-- Kuvars Teknoloji - Ürün Kurulum SQL
-- phpMyAdmin'de kuvars_db seçiliyken çalıştır

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS resimler TEXT,
  ADD COLUMN IF NOT EXISTS marka VARCHAR(100),
  ADD COLUMN IF NOT EXISTS alt_kategori VARCHAR(100);

TRUNCATE TABLE products;

INSERT INTO `products` (`id`, `kategori`, `isim`, `fiyat`, `resim_url`, `ozellikler`, `resimler`, `marka`, `alt_kategori`) VALUES
(1, 'ekran', 'Kuvars UltraGear 27" 144Hz Gaming Monitör', 18499.00, 'img/final photos/ekran1/monitör 1.1 .png',
 '["27 inç OLED Panel","144Hz Yenileme Hızı","3ms Yanıt Süresi","Full HD 1920x1080","HDR10 Desteği","AMD FreeSync Premium","2x HDMI + 1x DisplayPort","Yükseklik Ayarlı Stand"]',
 '["img/final photos/ekran1/monitör 1.1 .png","img/final photos/ekran1/monitör 1.2 .png"]',
 'Kuvars', 'oyun-monitoru'),

(2, 'ekran', 'Kuvars S2722DGM 27" 360Hz FHD Monitör', 24999.00, 'img/final photos/ekran2/monitör 2.1 .png',
 '["27 inç IPS Panel","360Hz Yenileme Hızı","0.05ms MPRT","FHD 2560x1440","HDR400 Sertifikalı","AMD FreeSync Premium","USB Hub (2x USB 3.0)","Pivot & Tilt Stand"]',
 '["img/final photos/ekran2/monitör 2.1 .png","img/final photos/ekran2/monitör 2.2 .png"]',
 'Kuvars', 'oyun-monitoru'),

(3, 'klavye', 'Kuvars K552 Mekanik Gaming Klavye', 2299.00, 'img/final photos/klavye1/klavye 6 .png',
 '["Mekanik Blue Switch","RGB Arka Aydınlatma","87 Tuş TKL Tasarım","Anti-Ghosting","Metal Üst Plaka","Ayarlanabilir Ayaklar","Windows/Mac Uyumlu"]',
 '["img/final photos/klavye1/klavye 6 .png","img/final photos/klavye1/klavye6.1.png"]',
 'Kuvars', 'gaming'),

(4, 'klavye', 'Kuvars K70 RGB TKL Mekanik Klavye', 3499.00, 'img/final photos/klavye2/klavye7.png',
 '["Per-Key White Aydınlatma","TKL Kompakt Tasarım","iCUE Yazılım Desteği","USB Passthrough","Alüminyum Çerçeve","Anti-Ghosting + N-Key Rollover"]',
 '["img/final photos/klavye2/klavye7.png","img/final photos/klavye2/klavye7yan.png"]',
 'Kuvars', 'sessiz'),

(5, 'kulaklik', 'Kuvars Cloud II Gaming Kulaklık', 3199.00, 'img/final photos/kulaklık1/kulaklık 1.1 .png',
 '["7.1 Sanal Surround Ses","53mm Bellek Köpük Sürücüler","Gürültü Önleyici Mikrofon","Hafıza Köpüğü Kulak Yastıkları","USB + 3.5mm Bağlantı","Ağırlık: 336g"]',
 '["img/final photos/kulaklık1/kulaklık 1.1 .png","img/final photos/kulaklık1/kulaklık 1.2 .png","img/final photos/kulaklık1/kulaklık 1.3 .png"]',
 'Kuvars', 'kulak-ustu'),

(6, 'kulaklik', 'Kuvars Arctis 7 Wireless Kulaklık', 9299.00, 'img/final photos/kulaklık2/kulaklık 2.1 .png',
 '["Kablosuz 2.4GHz Bağlantı","24 Saat Pil Ömrü","Lossless Ses Kalitesi","ClearCast Mikrofon","S1 Hoparlör Sistemi","ChatMix Kadranı","PC/PS4/PS5 Uyumlu"]',
 '["img/final photos/kulaklık2/kulaklık 2.1 .png","img/final photos/kulaklık2/kulaklık 2.2 .png","img/final photos/kulaklık2/kulaklık 2.3 .png"]',
 'Kuvars', 'kulak-ustu'),

(7, 'kulaklik', 'Kuvars Tune 230NC TWS Kulak İçi', 1599.00, 'img/final photos/kulaklık3/kulaklık 3.1.png',
 '["Aktif Gürültü Önleme (ANC)","40 Saat Toplam Pil","JBL Pure Bass Ses","Bluetooth 5.2","IPX4 Su Direnci","Dokunmatik Kontrol","Hızlı Şarj (10dk = 1 saat)"]',
 '["img/final photos/kulaklık3/kulaklık 3.1.png","img/final photos/kulaklık3/kulaklık 3.2 .png","img/final photos/kulaklık3/kulaklık 3.3 .png"]',
 'Kuvars', 'kulak-ici'),

(8, 'laptop', 'Kuvars ROG Strix G15 Gaming Laptop', 42999.00, 'img/final photos/laptop1/LAPTOP 1.1 .png',
 '["AMD Ryzen 9 6900HX","NVIDIA RTX 3070 Ti 8GB","16GB DDR5 RAM","512GB NVMe SSD","15.6 300Hz FHD Ekran","RGB Klavye","Wi-Fi 6E"]',
 '["img/final photos/laptop1/LAPTOP 1.1 .png","img/final photos/laptop1/LAPTOP 1.2 .png","img/final photos/laptop1/LAPTOP 1.3 .png"]',
 'Kuvars', 'gaming'),

(9, 'laptop', 'Kuvars Tulpar T6 V3.4.9', 54999.00, 'img/final photos/laptop2/laptop 2.1 .png',
 '["Intel Core i7-12800H","NVIDIA RTX 5060 8GB","32GB DDR5 RAM","1TB NVMe SSD","17.3 144Hz FHD Ekran","Wi-Fi 6"]',
 '["img/final photos/laptop2/laptop 2.1 .png","img/final photos/laptop2/laptop 2.2 .png","img/final photos/laptop2/laptop 2.3 .png"]',
 'Kuvars', 'gaming'),

(10, 'laptop', 'Kuvars D16 2026 V2', 34999.00, 'img/final photos/laptop3/laptop 3.1 .png',
 '["Intel i9 Çip (12 Çekirdek CPU)","16GB Unified Memory","512GB SSD","13.6 Liquid Retina Ekran","18 Saat Pil Ömrü","Windows 11 Pro"]',
 '["img/final photos/laptop3/laptop 3.1 .png","img/final photos/laptop3/laptop 3.2 .png","img/final photos/laptop3/laptop 3.3 .png"]',
 'Kuvars', 'ultrabook'),

(11, 'mouse', 'Kuvars G502 X Gaming Mouse', 4899.00, 'img/final photos/mouse1/mouse1.png',
 '["HERO 25K Sensör","25.600 DPI","13 Programlanabilir Tuş","RGB Aydınlatma","USB Bağlantı","1000Hz Polling Rate","Sağ El Ergonomik Tasarım"]',
 '["img/final photos/mouse1/mouse1.png","img/final photos/mouse1/mouse1.1.png"]',
 'Kuvars', 'oyun-mouse'),

(12, 'mouse', 'Kuvars DeathAdder V3 Pro Wireless', 4299.00, 'img/final photos/mouse2/mouse2.png',
 '["Focus Pro 30K Optik Sensör","30.000 DPI","Kablosuz 2.4GHz","90 Saat Pil Ömrü","USB-C Şarj","Ağırlık: 64g"]',
 '["img/final photos/mouse2/mouse2.png","img/final photos/mouse2/mouse2.1.png"]',
 'Kuvars', 'oyun-mouse'),

(13, 'mouse', 'Kuvars Sculpt Ergonomic Ofis Mouse', 1899.00, 'img/final photos/mouse3/mouse3.png',
 '["Ergonomik Yay Tasarımı","BlueTrack Teknoloji","Kablosuz 2.4GHz","USB Nano Alıcı","4 Tuş","Windows Uyumlu","1000 DPI"]',
 '["img/final photos/mouse3/mouse3.png","img/final photos/mouse3/mouse3.1.png"]',
 'Kuvars', 'ofis-mouse'),

(14, 'mousepad', 'Kuvars QcK XXL Extended Mousepad', 699.00, 'img/final photos/mousepad1/mousepad 1 .png',
 '["900x400mm Boyut","Micro-dokuma Yüzey","Kaymaz Kauçuk Alt","3mm Kalınlık","Dikiş Kenarlı","Yıkanabilir","Siyah Renk"]',
 '["img/final photos/mousepad1/mousepad 1 .png"]',
 'Kuvars', 'buyuk-boy'),

(15, 'mousepad', 'Kuvars Firefly V2 RGB Mousepad', 1299.00, 'img/final photos/mousepad2/mousepad 2 .png',
 '["Chroma RGB Aydınlatma (19 bölge)","Sert Yüzey","360° Kenar Aydınlatma","Kaymaz Alt","USB Kablo","355x255mm Boyut"]',
 '["img/final photos/mousepad2/mousepad 2 .png"]',
 'Kuvars', 'rgb'),

(16, 'mousepad', 'Kuvars MM300 Pro Extended Mousepad', 849.00, 'img/final photos/mousepad3/mousepad 3 .png',
 '["930x300mm Geniş Alan","Spill-Resistant Yüzey","Micro-dokuma Bez","Kaymaz Alt","Dikiş Kenarlı","Klavye + Mouse Uyumlu","Siyah/Gri Renk"]',
 '["img/final photos/mousepad3/mousepad 3 .png"]',
 'Kuvars', 'buyuk-boy');

ALTER TABLE `products` ADD PRIMARY KEY (`id`);
ALTER TABLE `products` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
