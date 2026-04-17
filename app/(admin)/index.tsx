import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Href, useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constantes/tema';
import { Produto, carregarProdutos, carregarResumoFinanceiroAdmin, carregarUsuarios, formatarMoeda, limparUsuarioAtual } from '@/servicos/armazenamento';
import { estilosAdminPainel as styles } from '@/estilos/telas/admin-painel';

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
