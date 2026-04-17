export type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  custo?: string;
  estoque: string;
  sku: string;
  categoria: string | null;
  imagem?: string;
};

export type ItemCarrinho = {
  produto: Produto;
  quantidade: number;
};

export type PerfilUsuario = 'admin' | 'cliente';

export type Usuario = {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
};

export type NovoUsuario = Omit<Usuario, 'id'>;

export type Pedido = {
  id: string;
  numero: string;
  criadoEm: string;
  compradorEmail: string;
  itens: ItemCarrinho[];
  subtotal: number;
  total: number;
};

export type PedidoSalvo = Omit<Pedido, 'itens'> & {
  itens: unknown[];
};

export type ProdutoFinanceiro = {
  id: string;
  nome: string;
  quantidade: number;
  faturamento: number;
  lucro: number;
};

export type ResumoFinanceiro = {
  faturamentoTotal: number;
  lucroTotal: number;
  custoTotal: number;
  totalPedidos: number;
  totalItensVendidos: number;
  ticketMedio: number;
  produtosVendidos: ProdutoFinanceiro[];
  produtoMaisVendido: ProdutoFinanceiro | null;
  produtoMaisLucrativo: ProdutoFinanceiro | null;
  pedidosRecentes: Pedido[];
};

export const USUARIOS_PADRAO: Usuario[] = [
  {
    id: 'admin-padrao',
    nome: 'Administrador',
    email: 'admin@loja.com',
    senha: '654321',
    perfil: 'admin',
  },
];
