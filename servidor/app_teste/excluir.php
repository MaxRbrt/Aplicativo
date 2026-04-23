<?php
require "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(["status" => "erro", "msg" => "Metodo nao permitido"], 405);
}

$dados = lerJson();
$id = (int) ($dados["id"] ?? 0);
$email = strtolower(trim($dados["email"] ?? ""));

if ($id <= 0 && $email === "") {
    responder(["status" => "erro", "msg" => "Informe o usuario para excluir"], 422);
}

if ($id > 0) {
    $consulta = $pdo->prepare("SELECT id, nome, email FROM usuario WHERE id = ?");
    $consulta->execute([$id]);
} else {
    $consulta = $pdo->prepare("SELECT id, nome, email FROM usuario WHERE email = ?");
    $consulta->execute([$email]);
}

$usuario = $consulta->fetch();

if (!$usuario) {
    responder(["status" => "erro", "msg" => "Usuario nao encontrado"], 404);
}

if (perfilPorEmail($usuario["email"]) === "admin") {
    responder(["status" => "erro", "msg" => "O administrador padrao nao pode ser excluido"], 403);
}

$excluir = $pdo->prepare("DELETE FROM usuario WHERE id = ?");
$excluir->execute([$usuario["id"]]);

responder([
    "status" => "sucesso",
]);
?>
