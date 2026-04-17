import AsyncStorage from '@react-native-async-storage/async-storage';

export const PRODUTOS_KEY = '@FAST_produtos';
export const CATEGORIAS_KEY = '@FAST_categorias';
export const USUARIOS_KEY = '@FAST_usuarios';
export const CARRINHO_KEY = '@FAST_carrinho';
export const PEDIDOS_KEY = '@FAST_pedidos';
export const USUARIO_ATUAL_KEY = '@FAST_usuario_atual';

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

type PedidoSalvo = Omit<Pedido, 'itens'> & {
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

async function lerLista<T>(key: string): Promise<T[]> {
  const salvo = await AsyncStorage.getItem(key);
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

async function salvarLista<T>(key: string, lista: T[]) {
  await AsyncStorage.setItem(key, JSON.stringify(lista));
}

function normalizarEmail(email: string) {
  return email.trim().toLowerCase();
}

function chavePorUsuario(baseKey: string, email: string | null) {
  if (!email) {
    return baseKey;
  }

  return `${baseKey}:${encodeURIComponent(normalizarEmail(email))}`;
}

function emailDaChaveUsuario(key: string) {
  const prefixo = `${CARRINHO_KEY}:`;
  if (!key.startsWith(prefixo)) {
    return null;
  }

  try {
    return normalizarEmail(decodeURIComponent(key.slice(prefixo.length)));
  } catch {
    return null;
  }
}


function criarId(prefixo = 'id') {
  return `${prefixo}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function itemCarrinhoValido(item: unknown): item is ItemCarrinho {
  if (!item || typeof item !== 'object') {
    return false;
  }

  const candidato = item as ItemCarrinho;
  return !!candidato.produto?.id && typeof candidato.quantidade === 'number';
}

function normalizarQuantidade(quantidade: number) {
  if (!Number.isFinite(quantidade)) {
    return 1;
  }

  return Math.max(1, Math.floor(quantidade));
}

function estoqueDisponivel(produto: Produto) {
  const estoque = Number.parseInt(produto.estoque, 10);
  return Number.isFinite(estoque) ? estoque : null;
}

function validarQuantidadeEmEstoque(produto: Produto, quantidade: number) {
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
function converterProdutosAntigosParaCarrinho(dados: unknown[]) {
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

function normalizarPedido(pedido: PedidoSalvo): Pedido {
  return {
    ...pedido,
    compradorEmail: normalizarEmail(pedido.compradorEmail ?? ''),
    itens: converterProdutosAntigosParaCarrinho(pedido.itens ?? []),
  };
}

async function carregarPedidosAdminSemLimpeza() {
  const pedidos = await lerLista<PedidoSalvo>(PEDIDOS_KEY);
  return pedidos
    .map(normalizarPedido)
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());
}

export async function limparDadosDeUsuario(email: string) {
  const emailNormalizado = normalizarEmail(email);
  const pedidos = await carregarPedidosAdminSemLimpeza();
  const pedidosFiltrados = pedidos.filter((pedido) => pedido.compradorEmail !== emailNormalizado);
  const carrinhoKey = chavePorUsuario(CARRINHO_KEY, emailNormalizado);
  const carrinhoExiste = await AsyncStorage.getItem(carrinhoKey);

  if (pedidosFiltrados.length !== pedidos.length) {
    await salvarLista(PEDIDOS_KEY, pedidosFiltrados);
  }

  await AsyncStorage.removeItem(carrinhoKey);

  const usuarioAtual = await carregarUsuarioAtual();
  if (usuarioAtual === emailNormalizado) {
    await limparUsuarioAtual();
  }

  return {
    pedidosRemovidos: pedidos.length - pedidosFiltrados.length,
    carrinhosRemovidos: carrinhoExiste ? 1 : 0,
  };
}

export async function limparDadosDeUsuariosRemovidos() {
  const usuarios = await carregarUsuarios();
  const emailsValidos = new Set(usuarios.map((usuario) => normalizarEmail(usuario.email)));
  const pedidos = await carregarPedidosAdminSemLimpeza();
  const pedidosFiltrados = pedidos.filter((pedido) => emailsValidos.has(normalizarEmail(pedido.compradorEmail)));
  const chaves = await AsyncStorage.getAllKeys();
  const carrinhosParaRemover = chaves.filter((key) => {
    const email = emailDaChaveUsuario(key);
    return email !== null && !emailsValidos.has(email);
  });
  const usuarioAtual = await carregarUsuarioAtual();

  if (pedidosFiltrados.length !== pedidos.length) {
    await salvarLista(PEDIDOS_KEY, pedidosFiltrados);
  }

  if (carrinhosParaRemover.length > 0) {
    await AsyncStorage.multiRemove(carrinhosParaRemover);
  }

  if (usuarioAtual && !emailsValidos.has(usuarioAtual)) {
    await limparUsuarioAtual();
  }

  return {
    pedidosRemovidos: pedidos.length - pedidosFiltrados.length,
    carrinhosRemovidos: carrinhosParaRemover.length,
  };
}

export async function carregarTodosPedidosAdmin() {
  await limparDadosDeUsuariosRemovidos();
  return carregarPedidosAdminSemLimpeza();
}

export async function definirUsuarioAtual(email: string) {
  await AsyncStorage.setItem(USUARIO_ATUAL_KEY, normalizarEmail(email));
}

export async function carregarUsuarioAtual() {
  const email = await AsyncStorage.getItem(USUARIO_ATUAL_KEY);
  return email ? normalizarEmail(email) : null;
}

export async function limparUsuarioAtual() {
  await AsyncStorage.removeItem(USUARIO_ATUAL_KEY);
}

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

export function validarNovoUsuario(usuario: NovoUsuario) {
  if (!usuario.nome.trim() || !usuario.email.trim() || !usuario.senha.trim()) {
    return 'Preencha nome, e-mail e senha.';
  }

  if (!usuario.email.includes('@') || !usuario.email.includes('.')) {
    return 'Informe um e-mail válido.';
  }

  if (usuario.senha.trim().length < 6) {
    return 'A senha precisa ter pelo menos 6 caracteres.';
  }

  return null;
}

export async function carregarProdutos() {
  return lerLista<Produto>(PRODUTOS_KEY);
}

export async function salvarProdutos(produtos: Produto[]) {
  await salvarLista(PRODUTOS_KEY, produtos);
}

export async function carregarUsuarios() {
  const usuarios = await lerLista<Usuario>(USUARIOS_KEY);
  if (usuarios.length > 0) {
    return usuarios;
  }

  await salvarLista(USUARIOS_KEY, USUARIOS_PADRAO);
  return USUARIOS_PADRAO;
}

export async function salvarUsuarios(usuarios: Usuario[]) {
  await salvarLista(USUARIOS_KEY, usuarios);
  await limparDadosDeUsuariosRemovidos();
}

export async function criarUsuario(dados: NovoUsuario) {
  const erro = validarNovoUsuario(dados);
  if (erro) {
    throw new Error(erro);
  }

  const usuarios = await carregarUsuarios();
  const email = normalizarEmail(dados.email);
  const emailJaExiste = usuarios.some((usuario) => normalizarEmail(usuario.email) === email);

  if (emailJaExiste) {
    throw new Error('Este e-mail já está cadastrado.');
  }

  const novoUsuario: Usuario = {
    id: criarId('usuario'),
    nome: dados.nome.trim(),
    email,
    senha: dados.senha.trim(),
    perfil: dados.perfil,
  };

  await salvarUsuarios([...usuarios, novoUsuario]);
  return novoUsuario;
}

export async function autenticarUsuario(email: string, senha: string) {
  const usuarios = await carregarUsuarios();
  const emailNormalizado = normalizarEmail(email);

  return usuarios.find(
    (usuario) => normalizarEmail(usuario.email) === emailNormalizado && usuario.senha === senha
  );
}

export async function carregarCarrinho() {
  const emailAtual = await carregarUsuarioAtual();
  if (!emailAtual) {
    return [];
  }

  const key = chavePorUsuario(CARRINHO_KEY, emailAtual);
  const dados = await lerLista<unknown>(key);
  const carrinho = converterProdutosAntigosParaCarrinho(dados);
  await salvarLista(key, carrinho);
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

async function baixarEstoque(itensComprados: ItemCarrinho[]) {
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
  await salvarLista(PEDIDOS_KEY, [pedido, ...todosPedidos]);
  await limparCarrinho();
  return pedido;
}
export async function carregarResumoFinanceiroAdmin() {
  const pedidos = await carregarTodosPedidosAdmin();
  return calcularResumoFinanceiro(pedidos);
}


