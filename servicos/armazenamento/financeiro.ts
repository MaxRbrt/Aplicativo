import { calcularResumoFinanceiro } from './calculos';
import { carregarTodosPedidosAdmin } from './limpeza';

export async function carregarResumoFinanceiroAdmin() {
  const pedidos = await carregarTodosPedidosAdmin();
  return calcularResumoFinanceiro(pedidos);
}
