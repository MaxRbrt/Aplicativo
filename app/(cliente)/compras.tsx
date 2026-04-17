import React, { useCallback, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { BotaoAnimado } from '@/componentes/loja/BotaoAnimado';
import { estilosLoja } from '@/estilos/loja';
import { calcularQuantidadeCarrinho, carregarPedidos, formatarMoeda, Pedido } from '@/servicos/armazenamento';
import { estilosClienteCompras as styles } from '@/estilos/telas/cliente-compras';

export default function ComprasCliente() {
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
    <View style={estilosLoja.tela}>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.headerText}>
            <Text style={estilosLoja.selo}>Histórico</Text>
            <Text style={estilosLoja.titulo}>Minhas compras</Text>
            <Text style={estilosLoja.subtitulo}>Acesse suas notas fiscais geradas no checkout.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={[estilosLoja.caixaVazia, estilosLoja.superficieElevada]}>
            <Text style={estilosLoja.vazioTitulo}>Nenhuma compra ainda</Text>
            <Text style={estilosLoja.vazioTexto}>Finalize uma compra no carrinho para gerar sua primeira nota fiscal.</Text>
            <BotaoAnimado style={estilosLoja.botaoPrimario} onPress={() => router.push('/(cliente)/vitrine')}>
              <Text style={estilosLoja.botaoPrimarioTexto}>Ver vitrine</Text>
            </BotaoAnimado>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={estilosLoja.entre}>
              <View>
                <Text style={styles.orderNumber}>{item.numero}</Text>
                <Text style={styles.orderDate}>{new Date(item.criadoEm).toLocaleDateString('pt-BR')}</Text>
              </View>
              <Text style={styles.orderTotal}>{formatarMoeda(item.total)}</Text>
            </View>
            <Text style={styles.orderMeta}>{calcularQuantidadeCarrinho(item.itens)} item(ns) comprados</Text>
            <BotaoAnimado
              style={estilosLoja.botaoSecundario}
              onPress={() => router.push({ pathname: '/nota-fiscal', params: { pedidoId: item.id } })}
            >
              <Text style={estilosLoja.botaoSecundarioTexto}>Abrir nota fiscal</Text>
            </BotaoAnimado>
          </View>
        )}
      />
    </View>
  );
}
