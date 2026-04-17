import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/app-theme';

const C = AppColors;

export const estilosFormularios = StyleSheet.create({
  campo: { gap: 6 },
  rotulo: { color: C.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase' },
  entrada: { backgroundColor: C.inputBg, borderColor: C.border, borderRadius: 12, borderWidth: 1, color: C.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  entradaGrande: { minHeight: 86, paddingTop: 13 },
  botaoPrimario: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, borderRadius: 12, minHeight: 48, paddingHorizontal: 16, paddingVertical: 14 },
  botaoPrimarioTexto: { color: C.white, fontSize: 15, fontWeight: '900' },
  botaoSecundario: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 12, minHeight: 44, paddingHorizontal: 14, paddingVertical: 11 },
  botaoSecundarioTexto: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  botaoPerigo: { alignItems: 'center', justifyContent: 'center', backgroundColor: C.dangerSoft, borderColor: C.danger, borderWidth: 1, borderRadius: 12, minHeight: 44, paddingHorizontal: 14, paddingVertical: 11 },
  botaoPerigoTexto: { color: C.danger, fontSize: 13, fontWeight: '900' },
});