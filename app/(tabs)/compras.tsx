import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { AnimatedPressable } from '@/components/shop/AnimatedPressable';
import { shopStyles } from '@/components/shop/shop-styles';
import { calcularQuantidadeCarrinho, carregarPedidos, formatarMoeda, Pedido } from '@/services/storage';

const C = AppColors;

export default function ComprasScreen() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  const carregar = useCallback(async () => {
    setPedidos(await carregarPedidos());
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  return (
    <View style={shopStyles.screen}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerText}>
            <Text style={shopStyles.eyebrow}>Histórico</Text>
            <Text style={shopStyles.title}>Minhas compras</Text>
            <Text style={shopStyles.subtitle}>Acesse suas notas fiscais geradas no checkout.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={[shopStyles.emptyBox, shopStyles.elevatedSurface]}>
            <Text style={shopStyles.emptyTitle}>Nenhuma compra ainda</Text>
            <Text style={shopStyles.emptySub}>Finalize uma compra no carrinho para gerar sua primeira nota fiscal.</Text>
            <AnimatedPressable style={shopStyles.primaryButton} onPress={() => router.push('/(tabs)/destaques')}>
              <Text style={shopStyles.primaryButtonText}>Ver vitrine</Text>
            </AnimatedPressable>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={shopStyles.between}>
              <View>
                <Text style={styles.orderNumber}>{item.numero}</Text>
                <Text style={styles.orderDate}>{new Date(item.criadoEm).toLocaleDateString('pt-BR')}</Text>
              </View>
              <Text style={styles.orderTotal}>{formatarMoeda(item.total)}</Text>
            </View>
            <Text style={styles.orderMeta}>{calcularQuantidadeCarrinho(item.itens)} item(ns) comprados</Text>
            <AnimatedPressable
              style={shopStyles.secondaryButton}
              onPress={() => router.push({ pathname: '/nota-fiscal', params: { pedidoId: item.id } })}
            >
              <Text style={shopStyles.secondaryButtonText}>Abrir nota fiscal</Text>
            </AnimatedPressable>
          </View>
        )}
      />
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