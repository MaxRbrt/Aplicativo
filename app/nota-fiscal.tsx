import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constantes/tema';
import { BotaoAnimado } from '@/componentes/loja/BotaoAnimado';
import { NotaFiscal } from '@/componentes/loja/NotaFiscal';
import { estilosLoja } from '@/estilos/loja';
import { buscarPedidoPorId, Pedido } from '@/servicos/armazenamento';
import { estilosNotaFiscalTela as styles } from '@/estilos/telas/nota-fiscal-tela';

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
      <View style={[estilosLoja.tela, styles.center]}>
        <ActivityIndicator color={C.accent} size="large" />
        <Text style={estilosLoja.textoFraco}>Carregando nota fiscal...</Text>
      </View>
    );
  }

  if (!pedido) {
    return (
      <View style={[estilosLoja.tela, styles.emptyScreen]}>
        <View style={[estilosLoja.caixaVazia, estilosLoja.superficieElevada]}>
          <Text style={estilosLoja.vazioTitulo}>Nota fiscal não encontrada</Text>
          <Text style={estilosLoja.vazioTexto}>Volte para suas compras e tente abrir a nota novamente.</Text>
          <BotaoAnimado style={estilosLoja.botaoPrimario} onPress={() => router.replace('/(cliente)/compras')}>
            <Text style={estilosLoja.botaoPrimarioTexto}>Minhas compras</Text>
          </BotaoAnimado>
        </View>
      </View>
    );
  }

  return (
    <View style={estilosLoja.tela}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={estilosLoja.cabecalho}>
          <View style={styles.headerText}>
            <Text style={estilosLoja.selo}>Compra finalizada</Text>
            <Text style={estilosLoja.titulo}>Nota fiscal</Text>
            <Text style={estilosLoja.subtitulo}>Guarde esse comprovante no histórico de compras.</Text>
          </View>
          <BotaoAnimado style={estilosLoja.botaoSecundario} onPress={() => router.replace('/(cliente)/compras')}>
            <Text style={estilosLoja.botaoSecundarioTexto}>Compras</Text>
          </BotaoAnimado>
        </View>

        <NotaFiscal pedido={pedido} />

        <View style={styles.actions}>
          <BotaoAnimado style={estilosLoja.botaoPrimario} onPress={() => router.replace('/(cliente)/vitrine')}>
            <Text style={estilosLoja.botaoPrimarioTexto}>Continuar comprando</Text>
          </BotaoAnimado>
          <BotaoAnimado style={estilosLoja.botaoSecundario} onPress={() => router.replace('/(cliente)/compras')}>
            <Text style={estilosLoja.botaoSecundarioTexto}>Ver minhas compras</Text>
          </BotaoAnimado>
        </View>
      </ScrollView>
    </View>
  );
}
