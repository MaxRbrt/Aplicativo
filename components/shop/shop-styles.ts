import { StyleSheet } from 'react-native';
import { AppColors } from '@/constants/app-theme';

const C = AppColors;

export const shopStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    gap: 18,
    padding: 18,
    paddingTop: 58,
    paddingBottom: 34,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 14,
  },
  eyebrow: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  title: {
    color: C.text,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitle: {
    color: C.mutedLight,
    fontSize: 14,
    lineHeight: 20,
  },
  surface: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
  },
  elevatedSurface: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accent,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  secondaryButtonText: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: '800',
  },
  dangerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.dangerSoft,
    borderColor: C.danger,
    borderWidth: 1,
    borderRadius: 12,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  dangerButtonText: {
    color: C.danger,
    fontSize: 13,
    fontWeight: '900',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  mutedText: {
    color: C.mutedLight,
    fontSize: 13,
    lineHeight: 19,
  },
  emptyBox: {
    alignItems: 'center',
    gap: 8,
    padding: 28,
  },
  emptyTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  emptySub: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});