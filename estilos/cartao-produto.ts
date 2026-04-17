import { StyleSheet } from 'react-native';
import { AppColors } from '@/constantes/tema';

const C = AppColors;

export const estilosCartaoProduto = StyleSheet.create({
  cartao: {
    overflow: 'hidden',
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
  },
  areaImagem: {
    height: 154,
    backgroundColor: C.surfaceHigh,
  },
  imagem: {
    width: '100%',
    height: '100%',
  },
  imagemVazia: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoImagemVazia: {
    color: C.mutedLight,
    fontSize: 40,
    fontWeight: '900',
  },
  informacoes: {
    gap: 8,
    padding: 14,
  },
  seloCategoria: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    color: C.accent,
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontSize: 10,
    fontWeight: '900',
  },
  nome: {
    minHeight: 40,
    color: C.text,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  descricao: {
    minHeight: 34,
    color: C.mutedLight,
    fontSize: 12,
    lineHeight: 17,
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  preco: {
    color: C.text,
    fontSize: 17,
    fontWeight: '900',
  },
  estoque: {
    color: C.muted,
    fontSize: 11,
    marginTop: 2,
  },
  botaoAdicionar: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accent,
    borderRadius: 12,
  },
  textoAdicionar: {
    color: C.white,
    fontSize: 24,
    fontWeight: '900',
    marginTop: -2,
  },
});
