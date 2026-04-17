import { ItemCarrinho, Pedido, Produto, ProdutoFinanceiro, ResumoFinanceiro } from './modelos';

export function precoParaNumero(preco: string | number) {
  if (typeof preco === 'number') {
    return Number.isFinite(preco) ? preco : 0;
  }

  const limpo = preco
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(\D|$))/g, '')
    .replace(',', '.');

  const valor = Number.parseFloat(limpo);
  return Number.isFinite(valor) ? valor : 0;
}

export function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function calcularCustoProduto(produto: Produto) {
  return precoParaNumero(produto.custo ?? '0');
}

export function calcularLucroItem(item: ItemCarrinho) {
  const preco = precoParaNumero(item.produto.preco);
  const custo = calcularCustoProduto(item.produto);
  return (preco - custo) * item.quantidade;
}

export function calcularCustoItem(item: ItemCarrinho) {
  return calcularCustoProduto(item.produto) * item.quantidade;
}

export function calcularResumoFinanceiro(pedidos: Pedido[]): ResumoFinanceiro {
  const mapaProdutos = new Map<string, ProdutoFinanceiro>();
  let faturamentoTotal = 0;
  let lucroTotal = 0;
  let custoTotal = 0;
  let totalItensVendidos = 0;

  pedidos.forEach((pedido) => {
    pedido.itens.forEach((item) => {
      const faturamentoItem = precoParaNumero(item.produto.preco) * item.quantidade;
      const custoItem = calcularCustoItem(item);
      const lucroItem = faturamentoItem - custoItem;
      const produtoAtual = mapaProdutos.get(item.produto.id) ?? {
        id: item.produto.id,
        nome: item.produto.nome,
        quantidade: 0,
        faturamento: 0,
        lucro: 0,
      };

      produtoAtual.quantidade += item.quantidade;
      produtoAtual.faturamento += faturamentoItem;
      produtoAtual.lucro += lucroItem;
      mapaProdutos.set(item.produto.id, produtoAtual);

      faturamentoTotal += faturamentoItem;
      custoTotal += custoItem;
      lucroTotal += lucroItem;
      totalItensVendidos += item.quantidade;
    });
  });

  const produtosVendidos = Array.from(mapaProdutos.values()).sort((a, b) => b.faturamento - a.faturamento);
  const produtoMaisVendido = [...produtosVendidos].sort((a, b) => b.quantidade - a.quantidade)[0] ?? null;
  const produtoMaisLucrativo = [...produtosVendidos].sort((a, b) => b.lucro - a.lucro)[0] ?? null;

  return {
    faturamentoTotal,
    lucroTotal,
    custoTotal,
    totalPedidos: pedidos.length,
    totalItensVendidos,
    ticketMedio: pedidos.length > 0 ? faturamentoTotal / pedidos.length : 0,
    produtosVendidos,
    produtoMaisVendido,
    produtoMaisLucrativo,
    pedidosRecentes: pedidos.slice(0, 8),
  };
}

export function calcularTotalProdutos(produtos: Produto[]) {
  return produtos.reduce((total, produto) => total + precoParaNumero(produto.preco), 0);
}

export function calcularTotalCarrinho(itens: ItemCarrinho[]) {
  return itens.reduce(
    (total, item) => total + precoParaNumero(item.produto.preco) * item.quantidade,
    0
  );
}

export function calcularQuantidadeCarrinho(itens: ItemCarrinho[]) {
  return itens.reduce((total, item) => total + item.quantidade, 0);
}

export function normalizarCategoria(categoria?: string | null) {
  const texto = categoria?.trim();
  if (!texto) {
    return 'Sem categoria';
  }

  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
