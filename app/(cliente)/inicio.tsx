import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { calcularQuantidadeCarrinho, carregarCarrinho, carregarPedidos, carregarProdutos, limparUsuarioAtual, Produto } from '@/servicos/armazenamento';
import { estilosClienteInicio as styles } from '@/estilos/telas/cliente-inicio';

const categorias = ['Calçados', 'Roupas', 'Eletrônicos', 'Acessórios', 'Cuidados'];

export default function InicioCliente() {
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
          onPress={() => router.push('/(cliente)/vitrine')}
          onPressIn={() => setPressingBtn(true)}
          onPressOut={() => setPressingBtn(false)}
        >
          <Text style={styles.primaryButtonText}>Ver vitrine</Text>
        </Pressable>

        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={() => router.push('/(cliente)/carrinho')}>
            <Text style={styles.actionButtonText}>Carrinho</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => router.push('/(cliente)/compras')}>
            <Text style={styles.actionButtonText}>Minhas compras</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
