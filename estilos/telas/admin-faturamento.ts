import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosAdminFaturamento = StyleSheet.create({
  centralizado: { alignItems: 'center', justifyContent: 'center', gap: 10 },
  cabecalhoLista: { gap: 18 },
  botaoVoltar: { backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  botaoVoltarTexto: { color: C.mutedLight, fontSize: 13, fontWeight: '900' },
  secaoLista: { marginTop: 4 },
  posicao: { width: 30, height: 30, textAlign: 'center', textAlignVertical: 'center', color: C.white, backgroundColor: C.accent, borderRadius: 10, fontWeight: '900' },
  rankingTexto: { flex: 1 },
  pedidosRecentes: { gap: 12, marginTop: 8 },
  pedidoNumero: { color: C.text, fontSize: 15, fontWeight: '900' },
  pedidoTotal: { color: C.accent, fontSize: 15, fontWeight: '900' },
});
