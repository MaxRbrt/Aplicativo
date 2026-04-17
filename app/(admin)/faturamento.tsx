import React, { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { AppColors } from '@/constantes/tema';
import { BotaoAnimado } from '@/componentes/loja/BotaoAnimado';
import { estilosGlobais } from '@/estilos/estilos-globais';
import { estilosCartoes } from '@/estilos/estilos-cartoes';
import { estilosFinanceiro } from '@/estilos/estilos-financeiro';
import { estilosAdminFaturamento as styles } from '@/estilos/telas/admin-faturamento';
import {
  ProdutoFinanceiro,
  ResumoFinanceiro,
  carregarResumoFinanceiroAdmin,
  calcularQuantidadeCarrinho,
  formatarMoeda,
} from '@/servicos/armazenamento';

const C = AppColors;

export default function FaturamentoAdmin() {
  const router = useRouter();
  const [resumo, setResumo] = useState<ResumoFinanceiro | null>(null);
  const [carregando, setCarregando] = useState(true);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      setResumo(await carregarResumoFinanceiroAdmin());
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar])
  );

  if (carregando) {
    return (
      <View style={[estilosGlobais.tela, styles.centralizado]}>
        <ActivityIndicator color={C.accent} size="large" />
        <Text style={estilosGlobais.textoFraco}>Calculando faturamento...</Text>
      </View>
    );
  }

  if (!resumo) {
    return (
      <View style={[estilosGlobais.tela, styles.centralizado]}>
        <Text style={estilosCartoes.metricaValor}>Sem dados financeiros</Text>
      </View>
    );
  }

  return (
    <View style={estilosGlobais.tela}>
      <FlatList
        data={resumo.produtosVendidos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilosGlobais.conteudo}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.cabecalhoLista}>
            <View style={estilosGlobais.cabecalho}>
              <View style={estilosGlobais.blocoTitulo}>
                <Text style={estilosGlobais.selo}>Financeiro</Text>
                <Text style={estilosGlobais.titulo}>Faturamento</Text>
                <Text style={estilosGlobais.subtitulo}>Vendas, lucro estimado, custos e desempenho dos produtos.</Text>
              </View>
              <BotaoAnimado style={styles.botaoVoltar} onPress={() => router.back()}>
                <Text style={styles.botaoVoltarTexto}>Voltar</Text>
              </BotaoAnimado>
            </View>

            <View style={estilosFinanceiro.destaque}>
              <Text style={estilosFinanceiro.etiqueta}>Faturamento total</Text>
              <Text style={estilosFinanceiro.valorPrincipal}>{formatarMoeda(resumo.faturamentoTotal)}</Text>
              <View style={estilosFinanceiro.destaqueLinha}>
                <View>
                  <Text style={estilosFinanceiro.etiqueta}>Lucro estimado</Text>
                  <Text style={estilosFinanceiro.valorLucro}>{formatarMoeda(resumo.lucroTotal)}</Text>
                </View>
                <View>
                  <Text style={estilosFinanceiro.etiqueta}>Custos</Text>
                  <Text style={estilosFinanceiro.valorCusto}>{formatarMoeda(resumo.custoTotal)}</Text>
                </View>
              </View>
            </View>

            <View style={estilosCartoes.grade}>
              <Metrica label="Pedidos" valor={`${resumo.totalPedidos}`} detalhe="notas fiscais" />
              <Metrica label="Itens vendidos" valor={`${resumo.totalItensVendidos}`} detalhe="unidades" />
              <Metrica label="Ticket médio" valor={formatarMoeda(resumo.ticketMedio)} detalhe="por pedido" />
              <Metrica label="Margem" valor={resumo.faturamentoTotal > 0 ? `${Math.round((resumo.lucroTotal / resumo.faturamentoTotal) * 100)}%` : '0%'} detalhe="lucro sobre venda" />
            </View>

            <View style={estilosCartoes.painelForte}>
              <Text style={estilosGlobais.secaoTitulo}>Destaques</Text>
              <Text style={estilosGlobais.textoFraco}>Mais vendido: {resumo.produtoMaisVendido?.nome ?? 'Sem vendas'}</Text>
              <Text style={estilosGlobais.textoFraco}>Mais lucrativo: {resumo.produtoMaisLucrativo?.nome ?? 'Sem vendas'}</Text>
            </View>

            <View style={styles.secaoLista}>
              <Text style={estilosGlobais.secaoTitulo}>Ranking de produtos</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={estilosCartoes.painel}>
            <Text style={estilosCartoes.metricaValor}>Nenhuma venda registrada</Text>
            <Text style={estilosGlobais.textoFraco}>Finalize compras pelo app cliente para alimentar o faturamento.</Text>
          </View>
        }
        renderItem={({ item, index }) => <ProdutoRanking item={item} posicao={index + 1} />}
        ListFooterComponent={
          resumo.pedidosRecentes.length > 0 ? (
            <View style={styles.pedidosRecentes}>
              <Text style={estilosGlobais.secaoTitulo}>Vendas recentes</Text>
              {resumo.pedidosRecentes.map((pedido) => (
                <View key={pedido.id} style={estilosCartoes.listaItem}>
                  <View style={estilosGlobais.entre}>
                    <Text style={styles.pedidoNumero}>{pedido.numero}</Text>
                    <Text style={styles.pedidoTotal}>{formatarMoeda(pedido.total)}</Text>
                  </View>
                  <Text style={estilosGlobais.textoFraco}>{pedido.compradorEmail}</Text>
                  <Text style={estilosGlobais.textoFraco}>{calcularQuantidadeCarrinho(pedido.itens)} item(ns)</Text>
                </View>
              ))}
            </View>
          ) : null
        }
      />
    </View>
  );
}

function Metrica({ label, valor, detalhe }: { label: string; valor: string; detalhe: string }) {
  return (
    <View style={estilosCartoes.metrica}>
      <Text style={estilosCartoes.metricaRotulo}>{label}</Text>
      <Text style={estilosCartoes.metricaValor}>{valor}</Text>
      <Text style={estilosCartoes.metricaTexto}>{detalhe}</Text>
    </View>
  );
}

function ProdutoRanking({ item, posicao }: { item: ProdutoFinanceiro; posicao: number }) {
  return (
    <View style={estilosCartoes.listaItem}>
      <View style={estilosFinanceiro.rankingLinha}>
        <Text style={styles.posicao}>{posicao}</Text>
        <View style={styles.rankingTexto}>
          <Text style={estilosFinanceiro.rankingNome}>{item.nome}</Text>
          <Text style={estilosFinanceiro.rankingDetalhe}>{item.quantidade} vendido(s) · {formatarMoeda(item.faturamento)}</Text>
        </View>
        <Text style={item.lucro >= 0 ? estilosFinanceiro.positivo : estilosFinanceiro.negativo}>{formatarMoeda(item.lucro)}</Text>
      </View>
    </View>
  );
}
