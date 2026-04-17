import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosAdminPainel = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { gap: 20, padding: 20, paddingTop: 60, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: C.amber, borderRadius: 12 },
  brandMarkText: { color: C.white, fontSize: 20, fontWeight: '900' },
  brand: { color: C.text, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  role: { color: C.amber, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  hero: { gap: 6 },
  kicker: { color: C.amber, fontSize: 13, fontWeight: '800' },
  title: { color: C.text, fontSize: 28, fontWeight: '900', textTransform: 'capitalize' },
  subtitle: { color: C.mutedLight, fontSize: 14 },
  sectionHeader: { marginTop: 4 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '47%', gap: 3, borderWidth: 1, borderRadius: 16, padding: 16 },
  metricValue: { fontSize: 24, fontWeight: '900' },
  metricLabel: { color: C.text, fontSize: 13, fontWeight: '800' },
  metricSub: { color: C.muted, fontSize: 11 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '47%', gap: 5, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 16 },
  actionLabel: { color: C.text, fontSize: 15, fontWeight: '900' },
  actionSub: { color: C.muted, fontSize: 12 },
  infoCard: { gap: 5, backgroundColor: C.surfaceHigh, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 16 },
  infoTitle: { color: C.text, fontSize: 14, fontWeight: '900' },
  infoText: { color: C.mutedLight, fontSize: 13, lineHeight: 19 },
  secondaryButton: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  secondaryButtonText: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});
