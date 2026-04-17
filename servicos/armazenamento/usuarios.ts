import { limparDadosDeUsuariosRemovidos } from './limpeza';
import { NovoUsuario, Usuario } from './modelos';
import { criarId, normalizarEmail } from './nucleo';
import { carregarUsuariosBase, salvarUsuariosBase } from './usuarios-repositorio';

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

export async function salvarUsuarios(usuarios: Usuario[]) {
  await salvarUsuariosBase(usuarios);
  await limparDadosDeUsuariosRemovidos();
}

export async function criarUsuario(dados: NovoUsuario) {
  const erro = validarNovoUsuario(dados);
  if (erro) {
    throw new Error(erro);
  }

  const usuarios = await carregarUsuarios();
  const email = normalizarEmail(dados.email);
  const emailJaExiste = usuarios.some((usuario) => normalizarEmail(usuario.email) === email);

  if (emailJaExiste) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const novoUsuario: Usuario = {
    id: criarId('usuario'),
    nome: dados.nome.trim(),
    email,
    senha: dados.senha.trim(),
    perfil: dados.perfil,
  };

  await salvarUsuarios([...usuarios, novoUsuario]);
  return novoUsuario;
}

export async function autenticarUsuario(email: string, senha: string) {
  const usuarios = await carregarUsuarios();
  const emailNormalizado = normalizarEmail(email);

  return usuarios.find(
    (usuario) => normalizarEmail(usuario.email) === emailNormalizado && usuario.senha === senha
  );
}
