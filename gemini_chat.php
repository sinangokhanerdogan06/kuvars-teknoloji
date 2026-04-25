<?php
header('Content-Type: application/json');

$API_KEY = 'AIzaSyBRJbULzrIrPXIRZXKVVfwDYpiD7jmbHuY';
$API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=$API_KEY";

$input = json_decode(file_get_contents('php://input'), true);
$message = $input['message'] ?? '';
$history = $input['history'] ?? [];

if (empty($message)) {
    echo json_encode(['reply' => 'Mesaj boş olamaz.']);
    exit;
}

$system_prompt = "Sen Kuvars Teknoloji'nin canlı destek asistanısın. Kuvars Teknoloji, Türkiye'nin güvenilir teknoloji e-ticaret sitesidir. Laptop, monitör (ekran), klavye, mouse, kulaklık ve mousepad kategorilerinde ürünler satmaktayız. Tüm ürünler orijinal ve garantilidir. Saat 14:00'e kadar verilen siparişler aynı gün kargoya verilir. 30 gün ücretsiz iade garantisi mevcuttur. Güvenli ödeme sistemi (3D Secure, SSL) kullanıyoruz. Üyelere özel indirim kuponları tanımlanmaktadır. Kısa, samimi, yardımcı ve Türkçe cevaplar ver. Ürün önerisi isteyenlere quiz.html veya urunler.html sayfalarını öner. Fazla uzun cevap verme, sohbet havasında ol.";

$contents = [
    ['role' => 'user', 'parts' => [['text' => $system_prompt]]],
    ['role' => 'model', 'parts' => [['text' => 'Anlaşıldı, Kuvars Teknoloji destek asistanı olarak hizmet veriyorum.']]]
];

foreach ($history as $item) {
    $contents[] = ['role' => $item['role'], 'parts' => [['text' => $item['text']]]];
}

$contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

$payload = [
    'contents' => $contents,
    'generationConfig' => ['temperature' => 0.7, 'maxOutputTokens' => 400]
];

$ch = curl_init($API_URL);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
$reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Şu an yanıt veremiyorum, lütfen tekrar deneyin.';

echo json_encode(['reply' => $reply]);
?>
