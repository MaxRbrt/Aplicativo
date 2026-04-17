import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { Produto, carregarProdutos, carregarResumoFinanceiroAdmin, carregarUsuarios, formatarMoeda, limparUsuarioAtual } from '@/services/storage';

const C = AppColors;

const acoes: { label: string; sub: string; rota: Href }[] = [
  { label: 'Novo produto', sub: 'Cadastrar item', rota: '/(admin)/cadastro' },
  { label: 'Produtos', sub: 'Consultar estoque', rota: '/(admin)/cadastro' },
  { label: 'Faturamento', sub: 'Vendas e lucro', rota: '/(admin)/faturamento' },
  { label: 'Usuários', sub: 'Cadastrar e consultar', rota: '/(admin)/usuarios' },
];

export default function AdminHome() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [faturamento, setFaturamento] = useState(0);
  const [lucro, setLucro] = useState(0);
  const [pressingOut, setPressingOut] = useState(false);
  const [pressingAcao, setPressingAcao] = useState<string | null>(null);

  const carregarResumo = useCallback(async () => {
    try {
      const [produtos, usuarios, resumoFinanceiro] = await Promise.all([
        carregarProdutos(),
        carregarUsuarios(),
        carregarResumoFinanceiroAdmin(),
      ]);
      setTotalProdutos(produtos.length);
      setTotalUsuarios(usuarios.length);
      setTotalEstoque(produtos.reduce((acc: number, produto: Produto) => acc + (parseInt(produto.estoque || '0', 10) || 0), 0));
      setFaturamento(resumoFinanceiro.faturamentoTotal);
      setLucro(resumoFinanceiro.lucroTotal);
    } catch {
      setTotalProdutos(0);
      setTotalUsuarios(0);
      setTotalEstoque(0);
      setFaturamento(0);
      setLucro(0);
    }
  }, []);

  useEffect(() => {
    carregarResumo();
  }, [carregarResumo]);

  const metricas = useMemo(
    () => [
      { label: 'Produtos', valor: `${totalProdutos}`, sub: 'cadastrados', color: C.accent, bg: C.accentSoft },
      { label: 'Estoque', valor: `${totalEstoque}`, sub: 'itens totais', color: C.green, bg: C.greenSoft },
      { label: 'Usuários', valor: `${totalUsuarios}`, sub: 'cadastrados', color: C.amber, bg: C.amberSoft },
      { label: 'Vendas', valor: formatarMoeda(faturamento), sub: 'faturamento', color: C.accent, bg: C.accentSoft },
      { label: 'Lucro', valor: formatarMoeda(lucro), sub: 'estimado', color: C.green, bg: C.greenSoft },
    ],
    [totalProdutos, totalEstoque, totalUsuarios, faturamento, lucro]
  );

  const nomeAdmin = email ? email.split('@')[0] : 'admin';

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Text style={styles.brandMarkText}>F</Text>
            </View>
            <View>
              <Text style={styles.brand}>FAST</Text>
              <Text style={styles.role}>ADMIN</Text>
            </View>
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
          <Text style={styles.kicker}>Painel de controle</Text>
          <Text style={styles.title}>Olá, {nomeAdmin}</Text>
          <Text style={styles.subtitle}>{email ?? 'conta admin'}</Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Visão geral</Text>
        </View>

        <View style={styles.grid}>
          {metricas.map((item) => (
            <View key={item.label} style={[styles.metricCard, { borderColor: item.color, backgroundColor: item.bg }]}>
              <Text style={[styles.metricValue, { color: item.color }]}>{item.valor}</Text>
              <Text style={styles.metricLabel}>{item.label}</Text>
              <Text style={styles.metricSub}>{item.sub}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ações rápidas</Text>
        </View>

        <View style={styles.actionGrid}>
          {acoes.map((acao) => (
            <Pressable
              key={acao.label}
              style={[styles.actionCard, pressingAcao === acao.label && styles.pressed]}
              onPress={() => router.push(acao.rota)}
              onPressIn={() => setPressingAcao(acao.label)}
              onPressOut={() => setPressingAcao(null)}
            >
              <Text style={styles.actionLabel}>{acao.label}</Text>
              <Text style={styles.actionSub}>{acao.sub}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Dados locais</Text>
          <Text style={styles.infoText}>Produtos e usuários são armazenados no dispositivo com AsyncStorage.</Text>
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
  brandMark: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', backgroundColor: C.amber, borderRadius: 12 },
  brandMarkText: { color: C.white, fontSize: 20, fontWeight: '900' },
  brand: { color: C.text, fontSize: 16, fontWeight: '900', letterSpacing: 3 },
  role: { color: C.amber, fontSize: 11, fontWeight: '900', letterSpacing: 1 },
  hero: { gap: 6 },
  kicker: { color: C.amber, fontSize: 13, fontWeight: '800' },
  title: { color: C.text, fontSize: 28, fontWeight: '900', textTransform: 'capitalize' },
  subtitle: { color: C.mutedLight, fontSize: 14 },
  sectionHeader: { marginTop: 4 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '900' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { width: '47%', gap: 3, borderWidth: 1, borderRadius: 16, padding: 16 },
  metricValue: { fontSize: 24, fontWeight: '900' },
  metricLabel: { color: C.text, fontSize: 13, fontWeight: '800' },
  metricSub: { color: C.muted, fontSize: 11 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: { width: '47%', gap: 5, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 16 },
  actionLabel: { color: C.text, fontSize: 15, fontWeight: '900' },
  actionSub: { color: C.muted, fontSize: 12 },
  infoCard: { gap: 5, backgroundColor: C.surfaceHigh, borderColor: C.border, borderWidth: 1, borderRadius: 16, padding: 16 },
  infoTitle: { color: C.text, fontSize: 14, fontWeight: '900' },
  infoText: { color: C.mutedLight, fontSize: 13, lineHeight: 19 },
  secondaryButton: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  secondaryButtonText: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
});