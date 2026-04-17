import { PRODUTOS_KEY } from './chaves';
import { ItemCarrinho, Produto } from './modelos';
import { lerLista, salvarLista } from './nucleo';

export async function carregarProdutos() {
  return lerLista<Produto>(PRODUTOS_KEY);
}

export async function salvarProdutos(produtos: Produto[]) {
  await salvarLista(PRODUTOS_KEY, produtos);
}

export async function baixarEstoque(itensComprados: ItemCarrinho[]) {
  const produtos = await carregarProdutos();

  const produtosAtualizados = produtos.map((produto) => {
    const itemComprado = itensComprados.find((item) => item.produto.id === produto.id);
    if (!itemComprado || !produto.estoque.trim()) {
      return produto;
    }

    const estoqueAtual = Number.parseInt(produto.estoque, 10);
    if (!Number.isFinite(estoqueAtual)) {
      return produto;
    }

    return {
      ...produto,
      estoque: String(Math.max(estoqueAtual - itemComprado.quantidade, 0)),
    };
  });

  await salvarProdutos(produtosAtualizados);
}
