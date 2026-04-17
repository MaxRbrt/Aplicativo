import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, Modal, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppColors } from '@/constantes/tema';
import { BotaoAnimado } from '@/componentes/loja/BotaoAnimado';
import { CartaoProduto } from '@/componentes/loja/CartaoProduto';
import { estilosLoja } from '@/estilos/loja';
import { estilosClienteVitrine as styles } from '@/estilos/telas/cliente-vitrine';
import {
  Produto,
  adicionarProdutoAoCarrinho,
  calcularQuantidadeCarrinho,
  carregarCarrinho,
  carregarProdutos,
  formatarMoeda,
  normalizarCategoria,
  precoParaNumero,
} from '@/servicos/armazenamento';

const C = AppColors;
const TODOS = 'Todos';

export default function VitrineCliente() {
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
    <View style={estilosLoja.tela}>
      <FlatList
        data={produtosFiltrados}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            <View style={estilosLoja.cabecalho}>
              <View style={styles.headerText}>
                <Text style={estilosLoja.selo}>Vitrine</Text>
                <Text style={estilosLoja.titulo}>Destaques</Text>
                <Text style={estilosLoja.subtitulo}>Produtos cadastrados pelo painel admin aparecem aqui.</Text>
              </View>
              <BotaoAnimado style={styles.cartShortcut} onPress={() => router.push('/(cliente)/carrinho')}>
                <Text style={styles.cartCount}>{itensCarrinho}</Text>
                <Text style={styles.cartText}>Carrinho</Text>
              </BotaoAnimado>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
              {categorias.map((categoria) => {
                const ativo = filtro === categoria;
                return (
                  <BotaoAnimado
                    key={categoria}
                    style={[styles.filterPill, ativo && styles.filterPillActive]}
                    onPress={() => setFiltro(categoria)}
                  >
                    <Text style={[styles.filterText, ativo && styles.filterTextActive]}>{categoria}</Text>
                  </BotaoAnimado>
                );
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          carregando ? (
            <View style={styles.centerBox}>
              <ActivityIndicator color={C.accent} size="large" />
              <Text style={estilosLoja.textoFraco}>Carregando produtos...</Text>
            </View>
          ) : (
            <View style={[estilosLoja.caixaVazia, estilosLoja.superficieElevada]}>
              <Text style={estilosLoja.vazioTitulo}>Nenhum produto disponível</Text>
              <Text style={estilosLoja.vazioTexto}>Cadastre produtos pelo painel admin para montar a vitrine.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View style={styles.productCell}>
            <CartaoProduto
              produto={item}
              aoAbrirDetalhes={() => setSelecionado(item)}
              aoAdicionar={() => adicionarCarrinho(item)}
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
              router.push('/(cliente)/carrinho');
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
          <BotaoAnimado style={estilosLoja.botaoSecundario} onPress={onClose}>
            <Text style={estilosLoja.botaoSecundarioTexto}>Fechar</Text>
          </BotaoAnimado>
          <BotaoAnimado style={estilosLoja.botaoSecundario} onPress={onCart}>
            <Text style={estilosLoja.botaoSecundarioTexto}>Carrinho</Text>
          </BotaoAnimado>
          <BotaoAnimado style={[estilosLoja.botaoPrimario, styles.flexAction]} onPress={onAdd}>
            <Text style={estilosLoja.botaoPrimarioTexto}>Adicionar</Text>
          </BotaoAnimado>
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
