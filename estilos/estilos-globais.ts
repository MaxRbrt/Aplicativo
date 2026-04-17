import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/app-theme';

const C = AppColors;

export const estilosGlobais = StyleSheet.create({
  tela: { flex: 1, backgroundColor: C.bg },
  conteudo: { gap: 20, padding: 20, paddingTop: 60, paddingBottom: 42 },
  cabecalho: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 14 },
  blocoTitulo: { flex: 1, gap: 5 },
  selo: { color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  titulo: { color: C.text, fontSize: 29, fontWeight: '900' },
  subtitulo: { color: C.mutedLight, fontSize: 14, lineHeight: 21 },
  secaoTitulo: { color: C.text, fontSize: 17, fontWeight: '900' },
  linha: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  entre: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  textoFraco: { color: C.mutedLight, fontSize: 13, lineHeight: 20 },
  divisor: { height: 1, backgroundColor: C.border },
});