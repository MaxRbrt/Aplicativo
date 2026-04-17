import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/app-theme';

const C = AppColors;

export const estilosFinanceiro = StyleSheet.create({
  destaque: { gap: 10, backgroundColor: C.accentSoft, borderColor: C.accent, borderWidth: 1, borderRadius: 24, padding: 20 },
  destaqueLinha: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  valorPrincipal: { color: C.text, fontSize: 30, fontWeight: '900' },
  valorLucro: { color: C.green, fontSize: 26, fontWeight: '900' },
  valorCusto: { color: C.amber, fontSize: 22, fontWeight: '900' },
  etiqueta: { color: C.mutedLight, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.7 },
  rankingLinha: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  rankingNome: { flex: 1, color: C.text, fontSize: 14, fontWeight: '900' },
  rankingDetalhe: { color: C.mutedLight, fontSize: 12, marginTop: 2 },
  positivo: { color: C.green, fontSize: 14, fontWeight: '900' },
  negativo: { color: C.danger, fontSize: 14, fontWeight: '900' },
});