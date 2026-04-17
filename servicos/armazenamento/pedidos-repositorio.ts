import { PEDIDOS_KEY } from './chaves';
import { Pedido, PedidoSalvo } from './modelos';
import { lerLista, normalizarPedido, salvarLista } from './nucleo';

export async function carregarPedidosAdminSemLimpeza() {
  const pedidos = await lerLista<PedidoSalvo>(PEDIDOS_KEY);
  return pedidos
    .map(normalizarPedido)
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export async function salvarPedidosAdmin(pedidos: Pedido[]) {
  await salvarLista(PEDIDOS_KEY, pedidos);
}
