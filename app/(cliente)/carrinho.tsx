import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, Image, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { BotaoAnimado } from '@/componentes/loja/BotaoAnimado';
import { estilosLoja } from '@/estilos/loja';
import { estilosClienteCarrinho as styles } from '@/estilos/telas/cliente-carrinho';
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
} from '@/servicos/armazenamento';

export default function CarrinhoCliente() {
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
    <View style={estilosLoja.tela}>
      <FlatList
        data={itens}
        keyExtractor={(item) => item.produto.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={estilosLoja.cabecalho}>
              <View style={styles.headerText}>
                <Text style={estilosLoja.selo}>Checkout</Text>
                <Text style={estilosLoja.titulo}>Carrinho</Text>
                <Text style={estilosLoja.subtitulo}>Escolha a quantidade de cada produto antes de finalizar.</Text>
              </View>
              <BotaoAnimado style={estilosLoja.botaoSecundario} onPress={() => router.push('/(cliente)/vitrine')}>
                <Text style={estilosLoja.botaoSecundarioTexto}>Vitrine</Text>
              </BotaoAnimado>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={[estilosLoja.caixaVazia, estilosLoja.superficieElevada]}>
            <Text style={estilosLoja.vazioTitulo}>Seu carrinho está vazio</Text>
            <Text style={estilosLoja.vazioTexto}>Adicione produtos pela vitrine para finalizar a compra.</Text>
            <BotaoAnimado style={estilosLoja.botaoPrimario} onPress={() => router.push('/(cliente)/vitrine')}>
              <Text style={estilosLoja.botaoPrimarioTexto}>Ver produtos</Text>
            </BotaoAnimado>
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
              <View style={estilosLoja.entre}>
                <Text style={styles.summaryLabel}>Itens</Text>
                <Text style={styles.summaryValue}>{totalItens}</Text>
              </View>
              <View style={estilosLoja.entre}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatarMoeda(total)}</Text>
              </View>
              <BotaoAnimado
                style={[estilosLoja.botaoPrimario, finalizando && styles.disabled]}
                disabled={finalizando}
                onPress={concluirCompra}
              >
                <Text style={estilosLoja.botaoPrimarioTexto}>{finalizando ? 'Finalizando...' : 'Finalizar compra'}</Text>
              </BotaoAnimado>
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
          <BotaoAnimado style={styles.quantityButton} onPress={onDecrease}>
            <Text style={styles.quantityButtonText}>-</Text>
          </BotaoAnimado>
          <Text style={styles.quantityValue}>{quantidade}</Text>
          <BotaoAnimado style={styles.quantityButton} onPress={onIncrease}>
            <Text style={styles.quantityButtonText}>+</Text>
          </BotaoAnimado>
        </View>
      </View>
      <BotaoAnimado style={estilosLoja.botaoPerigo} onPress={onRemove}>
        <Text style={estilosLoja.botaoPerigoTexto}>Remover</Text>
      </BotaoAnimado>
    </View>
  );
}
