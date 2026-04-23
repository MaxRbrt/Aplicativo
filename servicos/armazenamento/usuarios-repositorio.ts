import { listarUsuariosApi } from '../api/usuarios';

export async function carregarUsuariosBase() {
  return listarUsuariosApi();
}
