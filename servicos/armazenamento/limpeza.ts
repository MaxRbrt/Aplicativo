import AsyncStorage from '@react-native-async-storage/async-storage';

import { CARRINHO_KEY } from './chaves';
import { carregarPedidosAdminSemLimpeza, salvarPedidosAdmin } from './pedidos-repositorio';
import { carregarUsuarioAtual, limparUsuarioAtual } from './sessao';
import { chavePorUsuario, emailDaChaveUsuario, normalizarEmail } from './nucleo';
import { carregarUsuariosBase } from './usuarios-repositorio';

export async function limparDadosDeUsuario(email: string) {
  const emailNormalizado = normalizarEmail(email);
  const pedidos = await carregarPedidosAdminSemLimpeza();
  const pedidosFiltrados = pedidos.filter((pedido) => pedido.compradorEmail !== emailNormalizado);
  const carrinhoKey = chavePorUsuario(CARRINHO_KEY, emailNormalizado);
  const carrinhoExiste = await AsyncStorage.getItem(carrinhoKey);

  if (pedidosFiltrados.length !== pedidos.length) {
    await salvarPedidosAdmin(pedidosFiltrados);
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
  const usuarios = await carregarUsuariosBase();
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
    await salvarPedidosAdmin(pedidosFiltrados);
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
