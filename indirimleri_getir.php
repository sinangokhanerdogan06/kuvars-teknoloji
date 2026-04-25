<?php
header('Content-Type: application/json');
require_once 'baglan.php';
try {
    $stmt = $db->query("SELECT * FROM discounts ORDER BY yuzde ASC");
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "data" => $data]);
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "data" => []]);
}
?>
