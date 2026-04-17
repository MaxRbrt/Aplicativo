<?php
header('Content-Type: application/json; charset=utf-8');

$host = 'localhost';
$banco = 'mobile';
$usuario = 'root';
$senha = '1234';

try {
    $conexao = new PDO(
        "mysql:host=$host;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha
    );

    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $conexao->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $erro) {
    http_response_code(500);

    echo json_encode([
        'erro' => 'Erro ao conectar com o banco de dados'
    ]);

    exit;
}
