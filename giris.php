<?php
header('Content-Type: application/json');
require_once 'baglan.php'; // Veritabanı bağlantısı

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $sifre = $_POST['sifre'];

    if (empty($email) || empty($sifre)) {
        echo json_encode(["status" => "error", "message" => "Lütfen tüm alanları doldurun."]);
        exit;
    }

    try {
        // Veritabanında bu e-postaya sahip bir kullanıcı var mı diye bakıyoruz
        $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $kullanici = $stmt->fetch(PDO::FETCH_ASSOC);

        // Kullanıcı bulunduysa ve GİRİLEN şifre veritabanındaki HASH'li şifreyle eşleşiyorsa
        if ($kullanici && password_verify($sifre, $kullanici['sifre'])) {
            echo json_encode(["status" => "success", "ad_soyad" => $kullanici['ad_soyad']]);
        } else {
            // Güvenlik gereği "E-posta yanlış" veya "Şifre yanlış" diye ayrı ayrı söylemeyiz, genel hata veririz.
            echo json_encode(["status" => "error", "message" => "Hatalı e-posta veya şifre."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Sistem hatası oluştu."]);
    }
}
?>