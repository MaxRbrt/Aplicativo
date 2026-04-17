import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { AnimatedPressable } from '@/components/shop/AnimatedPressable';
import { ProductCard } from '@/components/shop/ProductCard';
import { shopStyles } from '@/components/shop/shop-styles';
import {
  Produto,
  adicionarProdutoAoCarrinho,
  calcularQuantidadeCarrinho,
  carregarCarrinho,
  carregarProdutos,
  formatarMoeda,
  normalizarCategoria,
  precoParaNumero,
} from '@/services/storage';

const C = AppColors;
const TODOS = 'Todos';

export default function Destaques() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [itensCarrinho, setItensCarrinho] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [selecionado, setSelecionado] = useState<Produto | null>(null);
  const [filtro, setFiltro] = useState(TODOS);
  const [mensagem, setMensagem] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const [listaProdutos, carrinho] = await Promise.all([carregarProdutos(), carregarCarrinho()]);
      setProdutos(listaProdutos);
      setItensCarrinho(calcularQuantidadeCarrinho(carrinho));
    } catch {
      setProdutos([]);
      setItensCarrinho(0);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  const categorias = useMemo(() => {
    const mapa = new Map<string, string>();

    produtos.forEach((produto) => {
      const categoria = normalizarCategoria(produto.categoria);
      mapa.set(categoria.toLowerCase(), categoria);
    });

    return [TODOS, ...Array.from(mapa.values()).sort((a, b) => a.localeCompare(b))];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    if (filtro === TODOS) {
      return produtos;
    }

    return produtos.filter((produto) => normalizarCategoria(produto.categoria) === filtro);
  }, [filtro, produtos]);

  const adicionarCarrinho = async (produto: Produto) => {
    try {
      await adicionarProdutoAoCarrinho(produto);
      setItensCarrinho((valor) => valor + 1);
      setMensagem(`${produto.nome} entrou no carrinho`);
      setTimeout(() => setMensagem(''), 1600);
    } catch (error) {
      const mensagemErro = error instanceof Error ? error.message : 'Não foi possível adicionar ao carrinho.';
      Alert.alert('Atenção', mensagemErro);
    }
  };

  return (
    <View style={shopStyles.screen}>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={shopStyles.header}>
              <View style={styles.headerText}>
                <Text style={shopStyles.eyebrow}>Vitrine</Text>
                <Text style={shopStyles.title}>Destaques</Text>
                <Text style={shopStyles.subtitle}>Produtos cadastrados pelo painel admin aparecem aqui.</Text>
              </View>
              <AnimatedPressable style={styles.cartShortcut} onPress={() => router.push('/(tabs)/carrinho')}>
                <Text style={styles.cartCount}>{itensCarrinho}</Text>
                <Text style={styles.cartText}>Carrinho</Text>
              </AnimatedPressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {categorias.map((categoria) => {
                const ativo = filtro === categoria;
                return (
                  <AnimatedPressable
                    key={categoria}
                    style={[styles.filterPill, ativo && styles.filterPillActive]}
                    onPress={() => setFiltro(categoria)}
                  >
                    <Text style={[styles.filterText, ativo && styles.filterTextActive]}>{categoria}</Text>
                  </AnimatedPressable>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          carregando ? (
            <View style={styles.centerBox}>
              <ActivityIndicator color={C.accent} size="large" />
              <Text style={shopStyles.mutedText}>Carregando produtos...</Text>
            </View>
          ) : (
            <View style={[shopStyles.emptyBox, shopStyles.elevatedSurface]}>
              <Text style={shopStyles.emptyTitle}>Nenhum produto disponível</Text>
              <Text style={shopStyles.emptySub}>Cadastre produtos pelo painel admin para montar a vitrine.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.productCell}>
            <ProductCard
              produto={item}
              onDetails={() => setSelecionado(item)}
              onAdd={() => adicionarCarrinho(item)}
            />
          </View>
        )}
      />

      {!!mensagem && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{mensagem}</Text>
        </View>
      )}

      <Modal visible={!!selecionado} transparent animationType="fade" onRequestClose={() => setSelecionado(null)}>
        {selecionado && (
          <DetalheModal
            produto={selecionado}
            onClose={() => setSelecionado(null)}
            onAdd={() => adicionarCarrinho(selecionado)}
            onCart={() => {
              setSelecionado(null);
              router.push('/(tabs)/carrinho');
            }}
          />
        )}
      </Modal>
    </View>
  );
}

function DetalheModal({
  produto,
  onClose,
  onAdd,
  onCart,
}: {
  produto: Produto;
  onClose: () => void;
  onAdd: () => void;
  onCart: () => void;
}) {
  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>
        {produto.imagem ? (
          <Image source={{ uri: produto.imagem }} style={styles.modalImage} />
        ) : (
          <View style={styles.modalImagePlaceholder}>
            <Text style={styles.modalImageText}>{produto.nome.charAt(0).toUpperCase()}</Text>
          </View>
        )}

        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.badge}>{normalizarCategoria(produto.categoria)}</Text>
          <Text style={styles.modalName}>{produto.nome}</Text>
          <Text style={styles.modalPrice}>{formatarMoeda(precoParaNumero(produto.preco))}</Text>
          {!!produto.descricao && <Text style={styles.modalDesc}>{produto.descricao}</Text>}

          <View style={styles.metaGrid}>
            {!!produto.estoque && <Meta label="Estoque" value={`${produto.estoque} un.`} />}
            {!!produto.sku && <Meta label="SKU" value={produto.sku} />}
          </View>
        </ScrollView>

        <View style={styles.modalActions}>
          <AnimatedPressable style={shopStyles.secondaryButton} onPress={onClose}>
            <Text style={shopStyles.secondaryButtonText}>Fechar</Text>
          </AnimatedPressable>
          <AnimatedPressable style={shopStyles.secondaryButton} onPress={onCart}>
            <Text style={shopStyles.secondaryButtonText}>Carrinho</Text>
          </AnimatedPressable>
          <AnimatedPressable style={[shopStyles.primaryButton, styles.flexAction]} onPress={onAdd}>
            <Text style={shopStyles.primaryButtonText}>Adicionar</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metaItem}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    gap: 14,
    padding: 18,
    paddingTop: 58,
    paddingBottom: 36,
  },
  headerContent: {
    gap: 18,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  cartShortcut: {
    minWidth: 82,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cartCount: {
    color: C.accent,
    fontSize: 20,
    fontWeight: '900',
  },
  cartText: {
    color: C.mutedLight,
    fontSize: 11,
    fontWeight: '800',
  },
  filterRow: {
    gap: 9,
    paddingRight: 18,
  },
  filterPill: {
    justifyContent: 'center',
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterPillActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  filterText: {
    color: C.mutedLight,
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: C.white,
  },
  productRow: {
    gap: 12,
  },
  productCell: {
    flex: 1,
  },
  centerBox: {
    alignItems: 'center',
    gap: 10,
    paddingTop: 80,
  },
  toast: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 20,
    alignItems: 'center',
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 12,
  },
  toastText: {
    color: C.white,
    fontSize: 13,
    fontWeight: '900',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: C.overlay,
  },
  modalCard: {
    maxHeight: '90%',
    overflow: 'hidden',
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalImage: {
    width: '100%',
    height: 230,
  },
  modalImagePlaceholder: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.surfaceHigh,
  },
  modalImageText: {
    color: C.mutedLight,
    fontSize: 42,
    fontWeight: '900',
  },
  modalContent: {
    gap: 12,
    padding: 20,
  },
  badge: {
    alignSelf: 'flex-start',
    overflow: 'hidden',
    color: C.accent,
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 11,
    fontWeight: '900',
  },
  modalName: {
    color: C.text,
    fontSize: 24,
    fontWeight: '900',
  },
  modalPrice: {
    color: C.accent,
    fontSize: 22,
    fontWeight: '900',
  },
  modalDesc: {
    color: C.mutedLight,
    fontSize: 15,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    minWidth: 112,
    gap: 3,
    backgroundColor: C.surfaceHigh,
    borderRadius: 12,
    padding: 12,
  },
  metaLabel: {
    color: C.muted,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: '800',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
  },
  flexAction: {
    flex: 1,
  },
});