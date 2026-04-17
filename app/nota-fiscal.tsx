import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { AnimatedPressable } from '@/components/shop/AnimatedPressable';
import { InvoiceView } from '@/components/shop/InvoiceView';
import { shopStyles } from '@/components/shop/shop-styles';
import { buscarPedidoPorId, Pedido } from '@/services/storage';

const C = AppColors;

export default function NotaFiscalScreen() {
  const router = useRouter();
  const { pedidoId } = useLocalSearchParams<{ pedidoId?: string }>();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      if (!pedidoId) {
        setPedido(null);
        return;
      }
      setPedido(await buscarPedidoPorId(pedidoId));
    } finally {
      setCarregando(false);
    }
  }, [pedidoId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  if (carregando) {
    return (
      <View style={[shopStyles.screen, styles.center]}>
        <ActivityIndicator color={C.accent} size="large" />
        <Text style={shopStyles.mutedText}>Carregando nota fiscal...</Text>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={[shopStyles.screen, styles.emptyScreen]}>
        <View style={[shopStyles.emptyBox, shopStyles.elevatedSurface]}>
          <Text style={shopStyles.emptyTitle}>Nota fiscal não encontrada</Text>
          <Text style={shopStyles.emptySub}>Volte para suas compras e tente abrir a nota novamente.</Text>
          <AnimatedPressable style={shopStyles.primaryButton} onPress={() => router.replace('/(tabs)/compras')}>
            <Text style={shopStyles.primaryButtonText}>Minhas compras</Text>
          </AnimatedPressable>
        </View>
      </View>
    );
  }

  return (
    <View style={shopStyles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={shopStyles.header}>
          <View style={styles.headerText}>
            <Text style={shopStyles.eyebrow}>Compra finalizada</Text>
            <Text style={shopStyles.title}>Nota fiscal</Text>
            <Text style={shopStyles.subtitle}>Guarde esse comprovante no histórico de compras.</Text>
          </View>
          <AnimatedPressable style={shopStyles.secondaryButton} onPress={() => router.replace('/(tabs)/compras')}>
            <Text style={shopStyles.secondaryButtonText}>Compras</Text>
          </AnimatedPressable>
        </View>

        <InvoiceView pedido={pedido} />

        <View style={styles.actions}>
          <AnimatedPressable style={shopStyles.primaryButton} onPress={() => router.replace('/(tabs)/destaques')}>
            <Text style={shopStyles.primaryButtonText}>Continuar comprando</Text>
          </AnimatedPressable>
          <AnimatedPressable style={shopStyles.secondaryButton} onPress={() => router.replace('/(tabs)/compras')}>
            <Text style={shopStyles.secondaryButtonText}>Ver minhas compras</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 18,
    padding: 18,
    paddingTop: 58,
    paddingBottom: 34,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  actions: {
    gap: 12,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyScreen: {
    justifyContent: 'center',
    padding: 18,
  },
});