import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosEntrar = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, padding: 20 },
  card: { width: '100%', maxWidth: 400, gap: 18, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 24 },
  brandBlock: { alignItems: 'center', gap: 6 },
  brandIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, borderRadius: 14 },
  brandIconText: { color: C.white, fontSize: 26, fontWeight: '900' },
  brandName: { color: C.text, fontSize: 22, fontWeight: '900', letterSpacing: 6 },
  brandTagline: { color: C.muted, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
  header: { gap: 4 },
  title: { color: C.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: C.mutedLight, fontSize: 14 },
  field: { gap: 6 },
  label: { color: C.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  labelFocused: { color: C.accent },
  inputBox: { overflow: 'hidden', backgroundColor: C.inputBg, borderRadius: 12, borderWidth: 1.5 },
  input: { color: C.text, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 },
  primaryButton: { alignItems: 'center', backgroundColor: C.accent, borderRadius: 12, paddingVertical: 15 },
  primaryButtonText: { color: C.white, fontSize: 16, fontWeight: '900' },
  createAccountBox: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  createAccountText: { color: C.mutedLight, fontSize: 14 },
  createAccountLink: { color: C.accent, fontSize: 14, fontWeight: '900' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.65 },
});
