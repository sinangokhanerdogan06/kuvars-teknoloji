<?php
header('Content-Type: application/json');
require_once 'baglan.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $sifre = $_POST['sifre'];

    if (empty($email) || empty($sifre)) {
        echo json_encode(["status" => "error", "message" => "Lütfen tüm alanları doldurun."]);
        exit;
    }

    try {
        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $kullanici = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($kullanici && password_verify($sifre, $kullanici['sifre'])) {
            
            $indirim_id = $kullanici['indirim_id'];
            $indirim_yuzde = 0;
            $indirim_mesaj = "";

            // Kullanıcının henüz bir indirimi yoksa, rastgele bir tane seç ve ona ata!
            if (!$indirim_id) {
                $stmt = $db->query("SELECT id, yuzde, mesaj FROM discounts ORDER BY RAND() LIMIT 1");
                $randDiscount = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($randDiscount) {
                    $indirim_id = $randDiscount['id'];
                    $indirim_yuzde = $randDiscount['yuzde'];
                    $indirim_mesaj = $randDiscount['mesaj'];

                    // Kullanıcının satırına bu indirim ID'sini kaydet
                    $update = $db->prepare("UPDATE users SET indirim_id = :d_id WHERE id = :u_id");
                    $update->execute([':d_id' => $indirim_id, ':u_id' => $kullanici['id']]);
                }
            } else {
                // Kullanıcının zaten bir indirimi varsa, onu veritabanından çek
                $stmt = $db->prepare("SELECT yuzde, mesaj FROM discounts WHERE id = :d_id");
                $stmt->execute([':d_id' => $indirim_id]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);
                if ($existing) {
                    $indirim_yuzde = $existing['yuzde'];
                    $indirim_mesaj = $existing['mesaj'];
                }
            }

            // Başarı durumunda isminin yanında indirim verilerini de JavaScript'e yolluyoruz
            echo json_encode([
                "status" => "success", 
                "ad_soyad" => $kullanici['ad_soyad'],
                "indirim_yuzde" => $indirim_yuzde,
                "indirim_mesaj" => $indirim_mesaj
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => "Hatalı e-posta veya şifre."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Sistem hatası oluştu."]);
    }
}
?>