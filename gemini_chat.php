<?php
header('Content-Type: application/json');

require_once 'config.php';
$API_KEY = GROQ_API_KEY;
$API_URL = 'https://api.groq.com/openai/v1/chat/completions';

$input = json_decode(file_get_contents('php://input'), true);
$message = $input['message'] ?? '';
$history = $input['history'] ?? [];

if (empty($message)) {
    echo json_encode(['reply' => 'Mesaj boş olamaz.']);
    exit;
}

$system_prompt = "Sen Kuvars Teknoloji'nin canlı destek asistanısın. Kuvars Teknoloji, Türkiye'nin güvenilir teknoloji e-ticaret sitesidir. Laptop, monitör (ekran), klavye, mouse, kulaklık ve mousepad kategorilerinde ürünler satmaktayız. Tüm ürünler orijinaldir ve garantilidir. Saat 14:00'e kadar verilen siparişler aynı gün kargoya verilir. 30 gün ücretsiz iade garantisi var. Güvenli ödeme (3D Secure, SSL) kullanıyoruz. Üyelere özel indirim kuponları verilmektedir. Kısa, samimi ve Türkçe cevaplar ver. Çok uzun yazma, sohbet gibi ol.";

$messages = [['role' => 'system', 'content' => $system_prompt]];

foreach ($history as $item) {
    $messages[] = ['role' => $item['role'] === 'model' ? 'assistant' : 'user', 'content' => $item['text']];
}
$messages[] = ['role' => 'user', 'content' => $message];

$payload = json_encode([
    'model'       => 'llama3-8b-8192',
    'messages'    => $messages,
    'temperature' => 0.7,
    'max_tokens'  => 400
]);

$response = false;

if (function_exists('curl_init')) {
    $ch = curl_init($API_URL);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $API_KEY
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_TIMEOUT, 15);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    $response = curl_exec($ch);
    curl_close($ch);
}

if ($response === false && ini_get('allow_url_fopen')) {
    $context = stream_context_create([
        'http' => [
            'method'  => 'POST',
            'header'  => "Content-Type: application/json\r\nAuthorization: Bearer $API_KEY\r\n",
            'content' => $payload,
            'timeout' => 15,
            'ignore_errors' => true
        ],
        'ssl' => ['verify_peer' => false, 'verify_peer_name' => false]
    ]);
    $response = @file_get_contents($API_URL, false, $context);
}

if ($response === false) {
    echo json_encode(['reply' => 'Bağlantı kurulamadı. Lütfen tekrar deneyin.']);
    exit;
}

$data = json_decode($response, true);

if (isset($data['error'])) {
    echo json_encode(['reply' => 'Hata: ' . ($data['error']['message'] ?? 'Bilinmeyen hata')]);
    exit;
}

$reply = $data['choices'][0]['message']['content'] ?? 'Yanıt alınamadı.';
echo json_encode(['reply' => $reply]);
?>
