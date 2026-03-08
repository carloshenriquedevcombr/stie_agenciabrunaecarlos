<?php
// BLINDAGEM: Impede que a HostGator suje a resposta com avisos de erro em HTML
error_reporting(0); 
header('Content-Type: application/json; charset=utf-8');

$senha_secreta = "bc_agencia_2026_seguro";
$upload_dir = 'up_imagens/';

if (!is_dir($upload_dir)) {
    @mkdir($upload_dir, 0755, true);
}

$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'upload';

// AÇÃO: LISTAR
if ($action === 'list') {
    $files = @scandir($upload_dir);
    if (!$files) {
        echo json_encode(['success' => true, 'files' => []]);
        exit;
    }
    $files = array_diff($files, array('..', '.'));
    $file_list = [];
    foreach ($files as $file) {
        $file_path = $upload_dir . $file;
        if (is_file($file_path)) {
            $file_list[] = [
                'name' => $file,
                'path' => $file_path,
                'time' => filemtime($file_path)
            ];
        }
    }
    usort($file_list, function($a, $b) { return $b['time'] - $a['time']; });
    echo json_encode(['success' => true, 'files' => $file_list]);
    exit;
}

// AÇÃO: UPLOAD
if ($action === 'upload') {
    if (!isset($_POST['token']) || $_POST['token'] !== $senha_secreta) {
        echo json_encode(['success' => false, 'message' => 'Token inválido.']);
        exit;
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'Nenhuma imagem recebida (Erro: ' . $_FILES['image']['error'] . ').']);
        exit;
    }

    $file = $_FILES['image'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Formato inválido: ' . $file['type']]);
        exit;
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('bc_img_') . '.' . $extension;
    $target_path = $upload_dir . $new_filename;

    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        echo json_encode(['success' => true, 'path' => $target_path]);
    } else {
        echo json_encode(['success' => false, 'message' => 'O servidor bloqueou a gravação na pasta up_imagens. Verifique as permissões.']);
    }
    exit;
}
?>