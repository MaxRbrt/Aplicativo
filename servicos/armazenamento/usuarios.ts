import { limparDadosDeUsuario } from './limpeza';
import { autenticarUsuarioApi, criarUsuarioApi, excluirUsuarioApi } from '../api/usuarios';
import { NovoUsuario, Usuario, usuarioEhAdminPadrao } from './modelos';
import { normalizarEmail } from './nucleo';
import { carregarUsuariosBase } from './usuarios-repositorio';

export function validarNovoUsuario(usuario: NovoUsuario) {
  if (!usuario.nome.trim() || !usuario.email.trim() || !usuario.senha.trim()) {
    return 'Preencha nome, e-mail e senha.';
  }

  if (!usuario.email.includes('@') || !usuario.email.includes('.')) {
    return 'Informe um e-mail válido.';
  }

  if (usuario.senha.trim().length < 6) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }

  return null;
}

export async function carregarUsuarios() {
  return carregarUsuariosBase();
}

export async function criarUsuario(dados: NovoUsuario) {
  const erro = validarNovoUsuario(dados);
  if (erro) {
    throw new Error(erro);
  }

  const email = normalizarEmail(dados.email);

  return criarUsuarioApi({
    ...dados,
    nome: dados.nome.trim(),
    email,
    senha: dados.senha.trim(),
  });
}

export async function autenticarUsuario(email: string, senha: string) {
  const emailNormalizado = normalizarEmail(email);

  return autenticarUsuarioApi(emailNormalizado, senha.trim());
}

export async function removerUsuario(usuario: Usuario) {
  if (usuarioEhAdminPadrao(usuario.email)) {
    throw new Error('O administrador padrão não pode ser excluído.');
  }

  await excluirUsuarioApi(usuario);
  await limparDadosDeUsuario(usuario.email);
}
