<?php
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(204);
    exit;
}

$host = "localhost";
$db = "app_db";
$user = "root";
$pass = "";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $erro) {
    http_response_code(500);
    echo json_encode(["status" => "erro", "msg" => "Erro ao conectar com o banco"]);
    exit;
}

function lerJson(): array
{
    $entrada = file_get_contents("php://input");
    $dados = json_decode($entrada, true);

    return is_array($dados) ? $dados : [];
}

function responder(array $dados, int $codigo = 200): void
{
    http_response_code($codigo);
    echo json_encode($dados);
    exit;
}

function perfilPorEmail(string $email): string
{
    return strtolower(trim($email)) === "admin@loja.com" ? "admin" : "cliente";
}

function usuarioResposta(array $usuario): array
{
    return [
        "id" => (string) $usuario["id"],
        "nome" => $usuario["nome"],
        "email" => $usuario["email"],
        "senha" => "",
        "perfil" => perfilPorEmail($usuario["email"]),
    ];
}
?>
