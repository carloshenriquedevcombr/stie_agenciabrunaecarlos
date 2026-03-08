<?php
// BLINDAGEM: Impede que a HostGator suje a resposta com avisos invisíveis
error_reporting(0);
header('Content-Type: application/json; charset=utf-8');

// Senha de segurança
$senha_secreta = "bc_agencia_2026_seguro";
$upload_dir = 'up_imagens/';

// Cria a pasta automaticamente se ela não existir
if (!is_dir($upload_dir)) {
    @mkdir($upload_dir, 0755, true);
}

$action = isset($_REQUEST['action']) ? $_REQUEST['action'] : 'upload';

// ----------------------------------------------------
// AÇÃO 1: LISTAR IMAGENS (GALERIA)
// ----------------------------------------------------
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
                'time' => filemtime($file_path) // Pega a data para ordenar
            ];
        }
    }
    // Ordena da mais nova para a mais velha
    usort($file_list, function($a, $b) { return $b['time'] - $a['time']; });
    echo json_encode(['success' => true, 'files' => $file_list]);
    exit;
}

// ----------------------------------------------------
// AÇÃO 2: UPLOAD DE NOVA IMAGEM
// ----------------------------------------------------
if ($action === 'upload') {
    if (!isset($_POST['token']) || $_POST['token'] !== $senha_secreta) {
        echo json_encode(['success' => false, 'message' => 'Token inválido. Acesso negado.']);
        exit;
    }

    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['success' => false, 'message' => 'Nenhuma imagem recebida ou erro no envio.']);
        exit;
    }

    $file = $_FILES['image'];
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['success' => false, 'message' => 'Formato inválido. Use JPG, PNG, GIF ou WEBP.']);
        exit;
    }

    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('bc_img_') . '.' . $extension;
    $target_path = $upload_dir . $new_filename;

    if (move_uploaded_file($file['tmp_name'], $target_path)) {
        echo json_encode(['success' => true, 'path' => $target_path]);
    } else {
        echo json_encode(['success' => false, 'message' => 'A HostGator bloqueou a gravação na pasta up_imagens.']);
    }
    exit;
}

// ----------------------------------------------------
// AÇÃO 3: EXCLUIR IMAGEM
// ----------------------------------------------------
if ($action === 'delete') {
    if (!isset($_POST['token']) || $_POST['token'] !== $senha_secreta) {
        echo json_encode(['success' => false, 'message' => 'Token inválido. Acesso negado.']);
        exit;
    }

    $filename = isset($_POST['filename']) ? basename($_POST['filename']) : '';

    if (empty($filename)) {
        echo json_encode(['success' => false, 'message' => 'Arquivo não especificado.']);
        exit;
    }

    $file_path = $upload_dir . $filename;

    if (file_exists($file_path)) {
        if (unlink($file_path)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Erro de permissão na HostGator ao tentar excluir.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Este arquivo já não existe no servidor.']);
    }
    exit;
}
?>