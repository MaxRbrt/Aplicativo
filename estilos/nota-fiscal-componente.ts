import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosNotaFiscal = StyleSheet.create({
  nota: {
    gap: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 18,
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  empresa: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  legenda: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },
  caixaNumero: {
    alignItems: 'flex-end',
  },
  numeroRotulo: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
  },
  numero: {
    color: C.accent,
    fontSize: 16,
    fontWeight: '900',
  },
  divisor: {
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  gradeInfo: {
    gap: 10,
  },
  itemInfo: {
    gap: 3,
  },
  rotuloInfo: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  valorInfo: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '800',
  },
  itens: {
    borderTopColor: '#E2E8F0',
    borderTopWidth: 1,
  },
  linhaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderBottomColor: '#E2E8F0',
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  textoItem: {
    flex: 1,
  },
  nomeItem: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '900',
  },
  metaItem: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  precoItem: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
  },
  caixaTotal: {
    gap: 8,
  },
  linhaTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalRotulo: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '800',
  },
  totalValor: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '900',
  },
  totalFinalRotulo: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '900',
  },
  totalFinalValor: {
    color: C.accent,
    fontSize: 18,
    fontWeight: '900',
  },
});
