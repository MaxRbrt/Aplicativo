<?php
require "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(["status" => "erro", "msg" => "Metodo nao permitido"], 405);
}

$dados = lerJson();
$nome = trim($dados["nome"] ?? "");
$email = strtolower(trim($dados["email"] ?? ""));
$senha = trim($dados["senha"] ?? "");

if ($nome === "" || $email === "" || $senha === "") {
    responder(["status" => "erro", "msg" => "Informe nome, email e senha"], 422);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(["status" => "erro", "msg" => "Informe um email valido"], 422);
}

if (strlen($senha) < 6) {
    responder(["status" => "erro", "msg" => "A senha precisa ter pelo menos 6 caracteres"], 422);
}

$consulta = $pdo->prepare("SELECT id FROM usuario WHERE email = ?");
$consulta->execute([$email]);

if ($consulta->fetch()) {
    responder(["status" => "erro", "msg" => "Este email ja esta cadastrado"], 409);
}

$inserir = $pdo->prepare("INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)");
$inserir->execute([$nome, $email, $senha]);

$id = $pdo->lastInsertId();
$consulta = $pdo->prepare("SELECT id, nome, email FROM usuario WHERE id = ?");
$consulta->execute([$id]);

responder([
    "status" => "sucesso",
    "usuario" => usuarioResposta($consulta->fetch()),
], 201);
?>
