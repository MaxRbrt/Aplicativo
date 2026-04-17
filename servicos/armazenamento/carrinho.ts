import { CARRINHO_KEY } from './chaves';
import { ItemCarrinho, Produto } from './modelos';
import {
  chavePorUsuario,
  converterProdutosAntigosParaCarrinho,
  lerLista,
  normalizarQuantidade,
  salvarLista,
  validarQuantidadeEmEstoque,
} from './nucleo';
import { carregarUsuarioAtual } from './sessao';

export async function carregarCarrinho() {
  const emailAtual = await carregarUsuarioAtual();
  if (!emailAtual) {
    return [];
  }

  const chave = chavePorUsuario(CARRINHO_KEY, emailAtual);
  const dados = await lerLista<unknown>(chave);
  const carrinho = converterProdutosAntigosParaCarrinho(dados);
  await salvarLista(chave, carrinho);
  return carrinho;
}

export async function salvarCarrinho(itens: ItemCarrinho[]) {
  const emailAtual = await carregarUsuarioAtual();
  if (!emailAtual) {
    throw new Error('Faça login novamente para atualizar o carrinho.');
  }

  await salvarLista(chavePorUsuario(CARRINHO_KEY, emailAtual), itens);
}

export async function adicionarProdutoAoCarrinho(produto: Produto, quantidade = 1) {
  const carrinho = await carregarCarrinho();
  const quantidadeNormalizada = normalizarQuantidade(quantidade);
  const itemExistente = carrinho.find((item) => item.produto.id === produto.id);
  const novaQuantidade = (itemExistente?.quantidade ?? 0) + quantidadeNormalizada;

  validarQuantidadeEmEstoque(produto, novaQuantidade);

  const novaLista = itemExistente
    ? carrinho.map((item) =>
        item.produto.id === produto.id
          ? { ...item, produto, quantidade: novaQuantidade }
          : item
      )
    : [...carrinho, { produto, quantidade: quantidadeNormalizada }];

  await salvarCarrinho(novaLista);
  return novaLista;
}

export async function atualizarQuantidadeCarrinho(produtoId: string, quantidade: number) {
  const carrinho = await carregarCarrinho();
  const quantidadeNormalizada = normalizarQuantidade(quantidade);
  const itemSelecionado = carrinho.find((item) => item.produto.id === produtoId);

  if (quantidade > 0 && itemSelecionado) {
    validarQuantidadeEmEstoque(itemSelecionado.produto, quantidadeNormalizada);
  }

  const novaLista = quantidade <= 0
    ? carrinho.filter((item) => item.produto.id !== produtoId)
    : carrinho.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade: quantidadeNormalizada } : item
      );

  await salvarCarrinho(novaLista);
  return novaLista;
}

export async function removerItemCarrinho(produtoId: string) {
  const carrinho = await carregarCarrinho();
  const novaLista = carrinho.filter((item) => item.produto.id !== produtoId);
  await salvarCarrinho(novaLista);
  return novaLista;
}

export async function limparCarrinho() {
  await salvarCarrinho([]);
}
