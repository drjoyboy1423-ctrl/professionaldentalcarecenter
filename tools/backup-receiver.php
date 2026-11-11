<?php
// ProDental Records - backup receiver for your own web hosting (works on ordinary PHP hosting).
// 1) Upload this file to your hosting, e.g. https://yourwebsite.com/prodental/receive.php
// 2) Change SECRET below to the same secret you type in the app (Settings > Where backups are kept).
// 3) In the app paste the address of this file. Backups are saved in the "backups" folder next to this file.
const SECRET = 'CHANGE-ME';
const KEEP   = 20;                       // newest backups kept per clinic

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, X-Backup-Token, X-Backup-Name');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
header('Content-Type: application/json');
$tok = $_SERVER['HTTP_X_BACKUP_TOKEN'] ?? '';
if (SECRET === 'CHANGE-ME' || !hash_equals(SECRET, $tok)) { http_response_code(403); echo '{"error":"Wrong secret"}'; exit; }
$body = file_get_contents('php://input');
$j = json_decode($body, true);
if (!$body) { echo '{"ok":true,"note":"test"}'; exit; }        // empty body = connection test
if (!is_array($j) || !isset($j['format'])) { http_response_code(400); echo '{"error":"Not a backup file"}'; exit; }
$dir = __DIR__ . '/backups';
if (!is_dir($dir)) { mkdir($dir, 0750, true); file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n"); }
$name = preg_replace('/[^A-Za-z0-9._-]/', '-', $_SERVER['HTTP_X_BACKUP_NAME'] ?? ('backup-' . date('Y-m-d') . '.json'));
if (substr($name, -5) !== '.json') { $name .= '.json'; }
file_put_contents($dir . '/' . $name, $body);
$prefix = preg_replace('/-\d{4}-\d{2}-\d{2}.*$/', '', $name);
$files = glob($dir . '/' . $prefix . '-*.json'); rsort($files);
foreach (array_slice($files, KEEP) as $f) { @unlink($f); }
echo json_encode(['ok' => true, 'saved' => $name, 'kb' => round(strlen($body) / 1024)]);
