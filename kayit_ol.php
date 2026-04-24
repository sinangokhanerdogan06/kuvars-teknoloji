<?php
header('Content-Type: application/json');
require_once 'baglan.php'; // Veritabanı bağlantımızı dahil ettik

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $ad_soyad = $_POST['ad_soyad'];
    $email = $_POST['email'];
    $sifre = $_POST['sifre'];

    // Boş alan kontrolü
    if (empty($ad_soyad) || empty($email) || empty($sifre)) {
        echo json_encode(["status" => "error", "message" => "Lütfen tüm alanları doldurun."]);
        exit;
    }

    // Şifreyi BCRYPT ile şifreliyoruz (En güvenli yöntem)
    $hashli_sifre = password_hash($sifre, PASSWORD_BCRYPT);

    try {
        // Hazırlıklı sorgu ile SQL Injection'ı engelliyoruz
        $stmt = $db->prepare("INSERT INTO users (ad_soyad, email, sifre) VALUES (:ad_soyad, :email, :sifre)");
        $stmt->bindParam(':ad_soyad', $ad_soyad);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':sifre', $hashli_sifre);
        
        if ($stmt->execute()) {
            echo json_encode(["status" => "success"]);
        }
    } catch (PDOException $e) {
        if ($e->getCode() == 23000) { // Bu e-posta zaten varsa SQL hata kodu 23000 döner
            echo json_encode(["status" => "error", "message" => "Bu e-posta adresi zaten kayıtlı."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Kayıt sırasında bir hata oluştu."]);
        }
    }
}
?>