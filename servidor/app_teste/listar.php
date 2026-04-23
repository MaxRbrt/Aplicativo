<?php
require "db.php";

$consulta = $pdo->query("SELECT id, nome, email FROM usuario ORDER BY id DESC");
$usuarios = array_map("usuarioResposta", $consulta->fetchAll());

responder([
    "status" => "sucesso",
    "usuarios" => $usuarios,
]);
?>
