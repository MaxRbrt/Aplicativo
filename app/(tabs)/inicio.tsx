import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { calcularQuantidadeCarrinho, carregarCarrinho, carregarPedidos, carregarProdutos, limparUsuarioAtual, Produto } from '@/services/storage';

const C = AppColors;

const categorias = ['Calçados', 'Roupas', 'Eletrônicos', 'Acessórios', 'Cuidados'];

export default function HomeCliente() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [totalCarrinho, setTotalCarrinho] = useState(0);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [pressingBtn, setPressingBtn] = useState(false);
  const [pressingOut, setPressingOut] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [listaProdutos, carrinho, pedidos] = await Promise.all([
        carregarProdutos(),
        carregarCarrinho(),
        carregarPedidos(),
      ]);
      setProdutos(listaProdutos);
      setTotalCarrinho(calcularQuantidadeCarrinho(carrinho));
      setTotalPedidos(pedidos.length);
    } catch {
      setProdutos([]);
      setTotalCarrinho(0);
      setTotalPedidos(0);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const nomeUsuario = email ? email.split('@')[0] : 'cliente';
  const resumo = [
    { label: 'Produtos', valor: `${produtos.length} disponíveis` },
    { label: 'Carrinho', valor: `${totalCarrinho} itens` },
    { label: 'Compras', valor: `${totalPedidos} notas` },
    { label: 'Favoritos', valor: '0 salvos' },
  ];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>F</Text>
            </View>
            <Text style={styles.brand}>FAST</Text>
          </View>
          <Pressable
            style={[styles.secondaryButton, pressingOut && styles.pressed]}
            onPress={async () => {
              await limparUsuarioAtual();
              router.replace('/entrar');
            }}
            onPressIn={() => setPressingOut(true)}
            onPressOut={() => setPressingOut(false)}
          >
            <Text style={styles.secondaryButtonText}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <Text style={styles.kicker}>Olá, bem-vindo de volta</Text>
          <Text style={styles.title}>{nomeUsuario}</Text>
          <Text style={styles.subtitle}>{email ?? 'conta ativa'}</Text>
        </View>

        <View style={styles.banner}>
          <Text style={styles.bannerTag}>Novidades</Text>
          <Text style={styles.bannerTitle}>Confira os destaques da loja</Text>
          <Text style={styles.bannerText}>Escolha seus produtos, finalize o carrinho e acompanhe suas notas fiscais.</Text>
        </View>

        <View style={styles.grid}>
          {resumo.map((item) => (
            <View key={item.label} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>{item.label}</Text>
              <Text style={styles.summaryValue}>{item.valor}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorias</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
          {categorias.map((categoria) => (
            <View key={categoria} style={styles.categoryPill}>
              <Text style={styles.categoryText}>{categoria}</Text>
            </View>
          ))}
        </ScrollView>

        <Pressable
          style={[styles.primaryButton, pressingBtn && styles.pressed]}
          onPress={() => router.push('/(tabs)/destaques')}
          onPressIn={() => setPressingBtn(true)}
          onPressOut={() => setPressingBtn(false)}
        >
          <Text style={styles.primaryButtonText}>Ver vitrine</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={() => router.push('/(tabs)/carrinho')}>
            <Text style={styles.actionButtonText}>Carrinho</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/(tabs)/compras')}>
            <Text style={styles.actionButtonText}>Minhas compras</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { gap: 20, padding: 20, paddingTop: 60, paddingBottom: 40 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandMark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, borderRadius: 12 },
  brandMarkText: { color: C.white, fontSize: 20, fontWeight: '900' },
  brand: { color: C.text, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  hero: { gap: 6 },
  kicker: { color: C.mutedLight, fontSize: 13, fontWeight: '700' },
  title: { color: C.text, fontSize: 28, fontWeight: '900', textTransform: 'capitalize' },
  subtitle: { color: C.mutedLight, fontSize: 14 },
  banner: { gap: 8, backgroundColor: C.accentSoft, borderColor: C.accent, borderWidth: 1, borderRadius: 18, padding: 18 },
  bannerTag: { color: C.accent, fontSize: 11, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase' },
  bannerTitle: { color: C.text, fontSize: 22, fontWeight: '900' },
  bannerText: { color: C.mutedLight, fontSize: 13, lineHeight: 19 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryCard: { width: '47%', gap: 5, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 16 },
  summaryLabel: { color: C.muted, fontSize: 11, fontWeight: '900', letterSpacing: 0.6, textTransform: 'uppercase' },
  summaryValue: { color: C.text, fontSize: 14, fontWeight: '900' },
  sectionHeader: { marginTop: 2 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '900' },
  categoryRow: { gap: 10, paddingRight: 20 },
  categoryPill: { backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 999, paddingHorizontal: 16, paddingVertical: 10 },
  categoryText: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  primaryButton: { alignItems: 'center', backgroundColor: C.accent, borderRadius: 12, paddingVertical: 15 },
  primaryButtonText: { color: C.white, fontSize: 15, fontWeight: '900' },
  secondaryButton: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  secondaryButtonText: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 12, paddingVertical: 13 },
  actionButtonText: { color: C.mutedLight, fontSize: 13, fontWeight: '900' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});