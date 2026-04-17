import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosClienteCompras = StyleSheet.create({
  content: {
    gap: 14,
    padding: 18,
    paddingTop: 58,
    paddingBottom: 34,
  },
  headerText: {
    gap: 4,
    marginBottom: 4,
  },
  orderCard: {
    gap: 12,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
  },
  orderNumber: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
  },
  orderDate: {
    color: C.muted,
    fontSize: 12,
    marginTop: 2,
  },
  orderTotal: {
    color: C.accent,
    fontSize: 18,
    fontWeight: '900',
  },
  orderMeta: {
    color: C.mutedLight,
    fontSize: 13,
  },
});
