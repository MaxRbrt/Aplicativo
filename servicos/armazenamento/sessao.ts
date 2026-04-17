import AsyncStorage from '@react-native-async-storage/async-storage';

import { USUARIO_ATUAL_KEY } from './chaves';
import { normalizarEmail } from './nucleo';

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
