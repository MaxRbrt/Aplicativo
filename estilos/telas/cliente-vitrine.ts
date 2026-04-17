import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosClienteVitrine = StyleSheet.create({
  listContent: {
    gap: 14,
    padding: 18,
    paddingTop: 58,
    paddingBottom: 36,
  },
  headerContent: {
    gap: 18,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  cartShortcut: {
    minWidth: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cartCount: {
    color: C.accent,
    fontSize: 20,
    fontWeight: '900',
  },
  cartText: {
    color: C.mutedLight,
    fontSize: 11,
    fontWeight: '800',
  },
  filterRow: {
    gap: 9,
    paddingRight: 18,
  },
  filterPill: {
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterPillActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  filterText: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: C.white,
  },
  productRow: {
    gap: 12,
  },
  productCell: {
    flex: 1,
  },
  centerBox: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 80,
  },
  toast: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 20,
    alignItems: 'center',
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 12,
  },
  toastText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '900',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: C.overlay,
  },
  modalCard: {
    maxHeight: '90%',
    overflow: 'hidden',
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalImage: {
    width: '100%',
    height: 230,
  },
  modalImagePlaceholder: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surfaceHigh,
  },
  modalImageText: {
    color: C.mutedLight,
    fontSize: 42,
    fontWeight: '900',
  },
  modalContent: {
    gap: 12,
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    color: C.accent,
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '900',
  },
  modalName: {
    color: C.text,
    fontSize: 24,
    fontWeight: '900',
  },
  modalPrice: {
    color: C.accent,
    fontSize: 22,
    fontWeight: '900',
  },
  modalDesc: {
    color: C.mutedLight,
    fontSize: 15,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    minWidth: 112,
    gap: 3,
    backgroundColor: C.surfaceHigh,
    borderRadius: 12,
    padding: 12,
  },
  metaLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  flexAction: {
    flex: 1,
  },
});
