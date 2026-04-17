import React from 'react';
import { Text, View } from 'react-native';
import { estilosNotaFiscal as estilos } from '@/estilos/nota-fiscal-componente';
import { formatarMoeda, Pedido, precoParaNumero } from '@/servicos/armazenamento';

export function NotaFiscal({ pedido }: { pedido: Pedido }) {
  const data = new Date(pedido.criadoEm).toLocaleString('pt-BR');

  return (
    <View style={estilos.nota}>
      <View style={estilos.cabecalho}>
        <View>
          <Text style={estilos.empresa}>FAST STORE</Text>
          <Text style={estilos.legenda}>Nota fiscal simplificada</Text>
        </View>
        <View style={estilos.caixaNumero}>
          <Text style={estilos.numeroRotulo}>NF</Text>
          <Text style={estilos.numero}>{pedido.numero}</Text>
        </View>
      </View>

      <View style={estilos.divisor} />

      <View style={estilos.gradeInfo}>
        <Info label="Cliente" value={pedido.compradorEmail} />
        <Info label="Emissão" value={data} />
      </View>

      <View style={estilos.itens}>
        {pedido.itens.map((item) => {
          const subtotal = precoParaNumero(item.produto.preco) * item.quantidade;

          return (
            <View key={item.produto.id} style={estilos.linhaItem}>
              <View style={estilos.textoItem}>
                <Text style={estilos.nomeItem}>{item.produto.nome}</Text>
                <Text style={estilos.metaItem}>{item.produto.categoria ?? 'Sem categoria'}</Text>
                <Text style={estilos.metaItem}>
                  Qtd: {item.quantidade} x {formatarMoeda(precoParaNumero(item.produto.preco))}
                </Text>
              </View>
              <Text style={estilos.precoItem}>{formatarMoeda(subtotal)}</Text>
            </View>
          );
        })}
      </View>

      <View style={estilos.caixaTotal}>
        <View style={estilos.linhaTotal}>
          <Text style={estilos.totalRotulo}>Subtotal</Text>
          <Text style={estilos.totalValor}>{formatarMoeda(pedido.subtotal)}</Text>
        </View>
        <View style={estilos.linhaTotal}>
          <Text style={estilos.totalFinalRotulo}>Total pago</Text>
          <Text style={estilos.totalFinalValor}>{formatarMoeda(pedido.total)}</Text>
        </View>
      </View>
    </View>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={estilos.itemInfo}>
      <Text style={estilos.rotuloInfo}>{label}</Text>
      <Text style={estilos.valorInfo}>{value}</Text>
    </View>
  );
}
