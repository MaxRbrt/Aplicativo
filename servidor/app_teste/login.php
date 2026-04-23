<?php
require "db.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    responder(["status" => "erro", "msg" => "Metodo nao permitido"], 405);
}

$dados = lerJson();
$email = strtolower(trim($dados["email"] ?? ""));
$senha = trim($dados["senha"] ?? "");

if ($email === "" || $senha === "") {
    responder(["status" => "erro", "msg" => "Informe email e senha"], 422);
}

$consulta = $pdo->prepare("SELECT id, nome, email, senha FROM usuario WHERE email = ?");
$consulta->execute([$email]);
$usuario = $consulta->fetch();

if (!$usuario || !hash_equals($usuario["senha"], $senha)) {
    responder(["status" => "erro", "msg" => "Email ou senha incorretos"], 401);
}

responder([
    "status" => "sucesso",
    "usuario" => usuarioResposta($usuario),
]);
?>
