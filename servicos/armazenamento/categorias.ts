import { CATEGORIAS_KEY } from './chaves';
import { lerLista, salvarLista } from './nucleo';

export const CATEGORIAS_PADRAO = ['Calçados', 'Roupas', 'Eletrônicos', 'Acessórios', 'Cuidados'];

export async function carregarCategorias() {
  const categorias = await lerLista<string>(CATEGORIAS_KEY);
  if (categorias.length > 0) {
    return categorias;
  }

  await salvarCategorias(CATEGORIAS_PADRAO);
  return CATEGORIAS_PADRAO;
}

export async function salvarCategorias(categorias: string[]) {
  await salvarLista(CATEGORIAS_KEY, categorias);
}
