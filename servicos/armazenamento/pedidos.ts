import { calcularTotalCarrinho } from './calculos';
import { carregarCarrinho, limparCarrinho } from './carrinho';
import { Pedido } from './modelos';
import { criarId, normalizarEmail } from './nucleo';
import { salvarPedidosAdmin } from './pedidos-repositorio';
import { baixarEstoque } from './produtos';
import { carregarUsuarioAtual } from './sessao';
import { carregarTodosPedidosAdmin } from './limpeza';

export async function carregarPedidos() {
  const emailAtual = await carregarUsuarioAtual();
  const pedidos = await carregarTodosPedidosAdmin();

  if (!emailAtual) {
    return [];
  }

  return pedidos.filter((pedido) => normalizarEmail(pedido.compradorEmail) === emailAtual);
}

export async function buscarPedidoPorId(id: string) {
  const pedidos = await carregarPedidos();
  return pedidos.find((pedido) => pedido.id === id) ?? null;
}

export async function finalizarCompra(compradorEmail?: string) {
  const emailAtual = compradorEmail ? normalizarEmail(compradorEmail) : await carregarUsuarioAtual();

  if (!emailAtual) {
    throw new Error('Faça login novamente para finalizar a compra.');
  }

  const carrinho = await carregarCarrinho();
  if (carrinho.length === 0) {
    throw new Error('Seu carrinho está vazio.');
  }

  const todosPedidos = await carregarTodosPedidosAdmin();
  const pedidosUsuario = todosPedidos.filter((pedido) => normalizarEmail(pedido.compradorEmail) === emailAtual);
  const total = calcularTotalCarrinho(carrinho);
  const pedido: Pedido = {
    id: criarId('pedido'),
    numero: `NF-${String(pedidosUsuario.length + 1).padStart(4, '0')}`,
    criadoEm: new Date().toISOString(),
    compradorEmail: emailAtual,
    itens: carrinho,
    subtotal: total,
    total,
  };

  await baixarEstoque(carrinho);
  await salvarPedidosAdmin([pedido, ...todosPedidos]);
  await limparCarrinho();
  return pedido;
}
