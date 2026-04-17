import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosLoja = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: C.bg,
  },
  conteudo: {
    gap: 18,
    padding: 18,
    paddingTop: 58,
    paddingBottom: 34,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 14,
  },
  selo: {
    color: C.muted,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  titulo: {
    color: C.text,
    fontSize: 28,
    fontWeight: '900',
  },
  subtitulo: {
    color: C.mutedLight,
    fontSize: 14,
    lineHeight: 20,
  },
  superficie: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 16,
  },
  superficieElevada: {
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
  botaoPrimario: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accent,
    borderRadius: 12,
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  botaoPrimarioTexto: {
    color: C.white,
    fontSize: 14,
    fontWeight: '900',
  },
  botaoSecundario: {
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
  botaoSecundarioTexto: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: '800',
  },
  botaoPerigo: {
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
  botaoPerigoTexto: {
    color: C.danger,
    fontSize: 13,
    fontWeight: '900',
  },
  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  entre: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  textoFraco: {
    color: C.mutedLight,
    fontSize: 13,
    lineHeight: 19,
  },
  caixaVazia: {
    alignItems: 'center',
    gap: 8,
    padding: 28,
  },
  vazioTitulo: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  vazioTexto: {
    color: C.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
