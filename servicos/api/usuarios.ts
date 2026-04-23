import { NovoUsuario, PerfilUsuario, Usuario, perfilPorEmail } from '../armazenamento/modelos';

import { API_BASE_URL } from './config';

type UsuarioApi = {
  id: number | string;
  nome: string;
  email: string;
  senha?: string;
  perfil?: PerfilUsuario;
};

type RespostaApi<T> = T & {
  status?: 'sucesso' | 'erro';
  msg?: string;
};

function mapearUsuario(usuario: UsuarioApi): Usuario {
  const email = String(usuario.email ?? '').trim().toLowerCase();

  return {
    id: String(usuario.id),
    nome: String(usuario.nome ?? ''),
    email,
    senha: '',
    perfil: usuario.perfil ?? perfilPorEmail(email),
  };
}

async function lerResposta<T>(response: Response): Promise<RespostaApi<T>> {
  try {
    return (await response.json()) as RespostaApi<T>;
  } catch {
    throw new Error('A API retornou uma resposta invalida.');
  }
}

async function requisitar<T>(rota: string, init?: RequestInit): Promise<RespostaApi<T>> {
  const response = await fetch(`${API_BASE_URL}/${rota}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await lerResposta<T>(response);

  if (!response.ok || data.status === 'erro') {
    throw new Error(data.msg ?? 'Nao foi possivel completar a operacao.');
  }

  return data;
}

export async function listarUsuariosApi() {
  const data = await requisitar<{ usuarios: UsuarioApi[] }>('listar.php');
  return data.usuarios.map(mapearUsuario);
}

export async function criarUsuarioApi(dados: NovoUsuario) {
  const data = await requisitar<{ usuario: UsuarioApi }>('salvar.php', {
    method: 'POST',
    body: JSON.stringify({
      nome: dados.nome,
      email: dados.email,
      senha: dados.senha,
    }),
  });

  return mapearUsuario(data.usuario);
}

export async function autenticarUsuarioApi(email: string, senha: string) {
  const response = await fetch(`${API_BASE_URL}/login.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, senha }),
  });
  const data = await lerResposta<{ usuario?: UsuarioApi }>(response);

  if (response.status === 401) {
    return null;
  }

  if (!response.ok || data.status === 'erro' || !data.usuario) {
    throw new Error(data.msg ?? 'Nao foi possivel validar o login.');
  }

  return mapearUsuario(data.usuario);
}

export async function excluirUsuarioApi(usuario: Usuario) {
  await requisitar('excluir.php', {
    method: 'POST',
    body: JSON.stringify({
      id: usuario.id,
      email: usuario.email,
    }),
  });
}
