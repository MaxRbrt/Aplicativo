import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosClienteCarrinho = StyleSheet.create({
  content: {
    gap: 14,
    padding: 18,
    paddingTop: 58,
    paddingBottom: 34,
  },
  headerBlock: {
    marginBottom: 4,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: 12,
  },
  itemPlaceholder: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surfaceHigh,
    borderRadius: 12,
  },
  itemPlaceholderText: {
    color: C.mutedLight,
    fontSize: 26,
    fontWeight: '900',
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    color: C.text,
    fontSize: 15,
    fontWeight: '900',
  },
  itemMeta: {
    color: C.muted,
    fontSize: 12,
  },
  itemPrice: {
    color: C.accent,
    fontSize: 14,
    fontWeight: '900',
  },
  itemSubtotal: {
    color: C.mutedLight,
    fontSize: 12,
    fontWeight: '800',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 10,
    marginTop: 4,
  },
  quantityButton: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surfaceHigh,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 10,
  },
  quantityButtonText: {
    color: C.text,
    fontSize: 20,
    fontWeight: '900',
  },
  quantityValue: {
    minWidth: 24,
    color: C.text,
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
  },
  summaryCard: {
    gap: 14,
    backgroundColor: C.surface,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  summaryLabel: {
    color: C.mutedLight,
    fontSize: 14,
    fontWeight: '800',
  },
  summaryValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
  },
  totalLabel: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
  },
  totalValue: {
    color: C.accent,
    fontSize: 22,
    fontWeight: '900',
  },
  disabled: {
    opacity: 0.65,
  },
});
