<?php
header('Content-Type: application/json');
require_once 'baglan.php';

try {
    // Ürünleri veritabanından çekiyoruz
    $stmt = $db->prepare("SELECT * FROM products ORDER BY id DESC");
    $stmt->execute();
    $urunler = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode(["status" => "success", "data" => $urunler]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Ürünler getirilemedi."]);
}
?>