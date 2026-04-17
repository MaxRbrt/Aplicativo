import { USUARIOS_KEY } from './chaves';
import { USUARIOS_PADRAO, Usuario } from './modelos';
import { lerLista, salvarLista } from './nucleo';

export async function carregarUsuariosBase() {
  const usuarios = await lerLista<Usuario>(USUARIOS_KEY);
  if (usuarios.length > 0) {
    return usuarios;
  }

  await salvarLista(USUARIOS_KEY, USUARIOS_PADRAO);
  return USUARIOS_PADRAO;
}

export async function salvarUsuariosBase(usuarios: Usuario[]) {
  await salvarLista(USUARIOS_KEY, usuarios);
}
