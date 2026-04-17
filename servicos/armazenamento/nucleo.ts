import AsyncStorage from '@react-native-async-storage/async-storage';

import { CARRINHO_KEY } from './chaves';
import { ItemCarrinho, Pedido, PedidoSalvo, Produto } from './modelos';

export async function lerLista<T>(chave: string): Promise<T[]> {
  const salvo = await AsyncStorage.getItem(chave);
  if (!salvo) {
    return [];
  }

  try {
    const dados = JSON.parse(salvo);
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

export async function salvarLista<T>(chave: string, lista: T[]) {
  await AsyncStorage.setItem(chave, JSON.stringify(lista));
}

export function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

export function chavePorUsuario(chaveBase: string, email: string | null) {
  if (!email) {
    return chaveBase;
  }

  return `${chaveBase}:${encodeURIComponent(normalizarEmail(email))}`;
}

export function emailDaChaveUsuario(chave: string) {
  const prefixo = `${CARRINHO_KEY}:`;
  if (!chave.startsWith(prefixo)) {
    return null;
  }

  try {
    return normalizarEmail(decodeURIComponent(chave.slice(prefixo.length)));
  } catch {
    return null;
  }
}

export function criarId(prefixo = 'id') {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function itemCarrinhoValido(item: unknown): item is ItemCarrinho {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const candidato = item as ItemCarrinho;
  return !!candidato.produto?.id && typeof candidato.quantidade === 'number';
}

export function normalizarQuantidade(quantidade: number) {
  if (!Number.isFinite(quantidade)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantidade));
}

export function estoqueDisponivel(produto: Produto) {
  const estoque = Number.parseInt(produto.estoque, 10);
  return Number.isFinite(estoque) ? estoque : null;
}

export function validarQuantidadeEmEstoque(produto: Produto, quantidade: number) {
  const estoque = estoqueDisponivel(produto);
  if (estoque === null) {
    return;
  }

  if (estoque <= 0) {
    throw new Error(`${produto.nome} está sem estoque.`);
  }

  if (quantidade > estoque) {
    throw new Error(`Estoque disponível para ${produto.nome}: ${estoque} unidade(s).`);
  }
}

export function converterProdutosAntigosParaCarrinho(dados: unknown[]) {
  const mapa = new Map<string, ItemCarrinho>();

  dados.forEach((item) => {
    if (itemCarrinhoValido(item)) {
      const existente = mapa.get(item.produto.id);
      const quantidade = normalizarQuantidade(item.quantidade);
      mapa.set(item.produto.id, {
        produto: item.produto,
        quantidade: (existente?.quantidade ?? 0) + quantidade,
      });
      return;
    }

    const produto = item as Produto;
    if (!produto?.id) {
      return;
    }

    const existente = mapa.get(produto.id);
    mapa.set(produto.id, {
      produto,
      quantidade: (existente?.quantidade ?? 0) + 1,
    });
  });

  return Array.from(mapa.values());
}

export function normalizarPedido(pedido: PedidoSalvo): Pedido {
  return {
    ...pedido,
    compradorEmail: normalizarEmail(pedido.compradorEmail ?? ''),
    itens: converterProdutosAntigosParaCarrinho(pedido.itens ?? []),
  };
}
