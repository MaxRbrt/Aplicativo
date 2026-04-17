import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppColors } from '@/constants/app-theme';
import { formatarMoeda, normalizarCategoria, precoParaNumero, Produto } from '@/services/storage';
import { AnimatedPressable } from './AnimatedPressable';

const C = AppColors;

type ProductCardProps = {
  produto: Produto;
  onDetails: () => void;
  onAdd: () => void;
};

export function ProductCard({ produto, onDetails, onAdd }: ProductCardProps) {
  const categoria = normalizarCategoria(produto.categoria);

  return (
    <View style={styles.card}>
      <AnimatedPressable style={styles.imageArea} onPress={onDetails}>
        {produto.imagem ? (
          <Image source={{ uri: produto.imagem }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{produto.nome.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </AnimatedPressable>

      <View style={styles.info}>
        <Text style={styles.badge} numberOfLines={1}>{categoria}</Text>
        <Text style={styles.name} numberOfLines={2}>{produto.nome}</Text>
        {!!produto.descricao && <Text style={styles.desc} numberOfLines={2}>{produto.descricao}</Text>}
        <View style={styles.footer}>
          <View>
            <Text style={styles.price}>{formatarMoeda(precoParaNumero(produto.preco))}</Text>
            {!!produto.estoque && <Text style={styles.stock}>{produto.estoque} un. em estoque</Text>}
          </View>
          <AnimatedPressable style={styles.addButton} onPress={onAdd}>
            <Text style={styles.addText}>+</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 18,
  },
  imageArea: {
    height: 154,
    backgroundColor: C.surfaceHigh,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: C.mutedLight,
    fontSize: 40,
    fontWeight: '900',
  },
  info: {
    gap: 8,
    padding: 14,
  },
  badge: {
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
  name: {
    minHeight: 40,
    color: C.text,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 20,
  },
  desc: {
    minHeight: 34,
    color: C.mutedLight,
    fontSize: 12,
    lineHeight: 17,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  price: {
    color: C.text,
    fontSize: 17,
    fontWeight: '900',
  },
  stock: {
    color: C.muted,
    fontSize: 11,
    marginTop: 2,
  },
  addButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accent,
    borderRadius: 12,
  },
  addText: {
    color: C.white,
    fontSize: 24,
    fontWeight: '900',
    marginTop: -2,
  },
});