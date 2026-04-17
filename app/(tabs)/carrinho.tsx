import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { AnimatedPressable } from '@/components/shop/AnimatedPressable';
import { shopStyles } from '@/components/shop/shop-styles';
import {
  ItemCarrinho,
  atualizarQuantidadeCarrinho,
  calcularQuantidadeCarrinho,
  calcularTotalCarrinho,
  carregarCarrinho,
  finalizarCompra,
  formatarMoeda,
  precoParaNumero,
  removerItemCarrinho,
} from '@/services/storage';

const C = AppColors;

export default function CarrinhoScreen() {
  const router = useRouter();
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [finalizando, setFinalizando] = useState(false);

  const carregar = useCallback(async () => {
    setItens(await carregarCarrinho());
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const total = useMemo(() => calcularTotalCarrinho(itens), [itens]);
  const totalItens = useMemo(() => calcularQuantidadeCarrinho(itens), [itens]);

  const alterarQuantidade = async (produtoId: string, quantidade: number) => {
    try {
      setItens(await atualizarQuantidadeCarrinho(produtoId, quantidade));
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Não foi possível atualizar a quantidade.';
      Alert.alert('Atenção', mensagem);
    }
  };

  const remover = async (produtoId: string) => {
    setItens(await removerItemCarrinho(produtoId));
  };

  const concluirCompra = async () => {
    try {
      setFinalizando(true);
      const pedido = await finalizarCompra();
      setItens([]);
      router.push({ pathname: '/nota-fiscal', params: { pedidoId: pedido.id } });
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Não foi possível finalizar a compra.';
      Alert.alert('Atenção', mensagem);
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <View style={shopStyles.screen}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.produto.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={shopStyles.header}>
              <View style={styles.headerText}>
                <Text style={shopStyles.eyebrow}>Checkout</Text>
                <Text style={shopStyles.title}>Carrinho</Text>
                <Text style={shopStyles.subtitle}>Escolha a quantidade de cada produto antes de finalizar.</Text>
              </View>
              <AnimatedPressable style={shopStyles.secondaryButton} onPress={() => router.push('/(tabs)/destaques')}>
                <Text style={shopStyles.secondaryButtonText}>Vitrine</Text>
              </AnimatedPressable>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={[shopStyles.emptyBox, shopStyles.elevatedSurface]}>
            <Text style={shopStyles.emptyTitle}>Seu carrinho está vazio</Text>
            <Text style={shopStyles.emptySub}>Adicione produtos pela vitrine para finalizar a compra.</Text>
            <AnimatedPressable style={shopStyles.primaryButton} onPress={() => router.push('/(tabs)/destaques')}>
              <Text style={shopStyles.primaryButtonText}>Ver produtos</Text>
            </AnimatedPressable>
          </View>
        }
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onDecrease={() => alterarQuantidade(item.produto.id, item.quantidade - 1)}
            onIncrease={() => alterarQuantidade(item.produto.id, item.quantidade + 1)}
            onRemove={() => remover(item.produto.id)}
          />
        )}
        ListFooterComponent={
          itens.length > 0 ? (
            <View style={styles.summaryCard}>
              <View style={shopStyles.between}>
                <Text style={styles.summaryLabel}>Itens</Text>
                <Text style={styles.summaryValue}>{totalItens}</Text>
              </View>
              <View style={shopStyles.between}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatarMoeda(total)}</Text>
              </View>
              <AnimatedPressable
                style={[shopStyles.primaryButton, finalizando && styles.disabled]}
                disabled={finalizando}
                onPress={concluirCompra}
              >
                <Text style={shopStyles.primaryButtonText}>{finalizando ? 'Finalizando...' : 'Finalizar compra'}</Text>
              </AnimatedPressable>
            </View>
          ) : null
        }
      />
    </View>
  );
}

function CartItem({
  item,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  item: ItemCarrinho;
  onDecrease: () => void;
  onIncrease: () => void;
  onRemove: () => void;
}) {
  const { produto, quantidade } = item;
  const subtotal = precoParaNumero(produto.preco) * quantidade;

  return (
    <View style={styles.itemCard}>
      {produto.imagem ? (
        <Image source={{ uri: produto.imagem }} style={styles.itemImage} />
      ) : (
        <View style={styles.itemPlaceholder}>
          <Text style={styles.itemPlaceholderText}>{produto.nome.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{produto.nome}</Text>
        <Text style={styles.itemMeta}>{produto.categoria ?? 'Sem categoria'}</Text>
        <Text style={styles.itemPrice}>{formatarMoeda(precoParaNumero(produto.preco))} un.</Text>
        <Text style={styles.itemSubtotal}>Subtotal: {formatarMoeda(subtotal)}</Text>
        <View style={styles.quantityRow}>
          <AnimatedPressable style={styles.quantityButton} onPress={onDecrease}>
            <Text style={styles.quantityButtonText}>-</Text>
          </AnimatedPressable>
          <Text style={styles.quantityValue}>{quantidade}</Text>
          <AnimatedPressable style={styles.quantityButton} onPress={onIncrease}>
            <Text style={styles.quantityButtonText}>+</Text>
          </AnimatedPressable>
        </View>
      </View>
      <AnimatedPressable style={shopStyles.dangerButton} onPress={onRemove}>
        <Text style={shopStyles.dangerButtonText}>Remover</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
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