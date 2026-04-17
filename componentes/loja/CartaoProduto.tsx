import React from 'react';
import { Image, Text, View } from 'react-native';
import { BotaoAnimado } from '@/componentes/loja/BotaoAnimado';
import { estilosCartaoProduto as estilos } from '@/estilos/cartao-produto';
import { formatarMoeda, normalizarCategoria, precoParaNumero, Produto } from '@/servicos/armazenamento';

type CartaoProdutoProps = {
  produto: Produto;
  aoAbrirDetalhes: () => void;
  aoAdicionar: () => void;
};

export function CartaoProduto({ produto, aoAbrirDetalhes, aoAdicionar }: CartaoProdutoProps) {
  const categoria = normalizarCategoria(produto.categoria);

  return (
    <View style={estilos.cartao}>
      <BotaoAnimado style={estilos.areaImagem} onPress={aoAbrirDetalhes}>
        {produto.imagem ? (
          <Image source={{ uri: produto.imagem }} style={estilos.imagem} />
        ) : (
          <View style={estilos.imagemVazia}>
            <Text style={estilos.textoImagemVazia}>{produto.nome.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </BotaoAnimado>

      <View style={estilos.informacoes}>
        <Text style={estilos.seloCategoria} numberOfLines={1}>{categoria}</Text>
        <Text style={estilos.nome} numberOfLines={2}>{produto.nome}</Text>
        {!!produto.descricao && <Text style={estilos.descricao} numberOfLines={2}>{produto.descricao}</Text>}
        <View style={estilos.rodape}>
          <View>
            <Text style={estilos.preco}>{formatarMoeda(precoParaNumero(produto.preco))}</Text>
            {!!produto.estoque && <Text style={estilos.estoque}>{produto.estoque} un. em estoque</Text>}
          </View>
          <BotaoAnimado style={estilos.botaoAdicionar} onPress={aoAdicionar}>
            <Text style={estilos.textoAdicionar}>+</Text>
          </BotaoAnimado>
        </View>
      </View>
    </View>
  );
}
