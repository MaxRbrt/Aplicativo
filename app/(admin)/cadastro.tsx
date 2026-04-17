import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardTypeOptions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import {
  CATEGORIAS_KEY,
  Produto,
  carregarProdutos,
  salvarProdutos,
} from '@/services/storage';

const C = AppColors;
const CATEGORIAS_PADRAO = ['Calçados', 'Roupas', 'Eletrônicos', 'Acessórios', 'Cuidados'];

type Aba = 'form' | 'lista';

function Campo({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        keyboardType={keyboardType}
        autoCorrect={false}
        selectionColor={C.accent}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

export default function CadastroProdutos() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>('form');
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState(CATEGORIAS_PADRAO);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [custo, setCusto] = useState('');
  const [estoque, setEstoque] = useState('');
  const [sku, setSku] = useState('');
  const [categoria, setCategoria] = useState<string | null>(null);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [imagem, setImagem] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      const [listaProdutos, categoriasSalvas] = await Promise.all([
        carregarProdutos(),
        AsyncStorage.getItem(CATEGORIAS_KEY),
      ]);
      setProdutos(listaProdutos);
      if (categoriasSalvas) {
        setCategorias(JSON.parse(categoriasSalvas));
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const produtosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return produtos;
    return produtos.filter((produto) =>
      [produto.nome, produto.categoria ?? '', produto.sku, produto.descricao]
        .join(' ')
        .toLowerCase()
        .includes(termo)
    );
  }, [busca, produtos]);

  const limpar = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setEstoque('');
    setSku('');
    setCategoria(null);
    setImagem(null);
  };

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImagem(result.assets[0].uri);
    }
  };

  const salvarCategoria = async () => {
    const nomeCategoria = novaCategoria.trim();
    if (!nomeCategoria) return;

    const existe = categorias.some((item) => item.toLowerCase() === nomeCategoria.toLowerCase());
    if (existe) {
      Alert.alert('Categoria já existe', 'Informe um nome diferente.');
      return;
    }

    const novaLista = [...categorias, nomeCategoria];
    setCategorias(novaLista);
    setNovaCategoria('');
    await AsyncStorage.setItem(CATEGORIAS_KEY, JSON.stringify(novaLista));
  };

  const salvarProduto = async () => {
    if (!nome.trim() || !preco.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha pelo menos nome e preço.');
      return;
    }

    const produtoSalvo: Produto = {
      id: editandoId ?? Date.now().toString(),
      nome: nome.trim(),
      descricao: descricao.trim(),
      preco: preco.trim(),
      estoque: estoque.trim(),
      sku: sku.trim(),
      categoria,
      imagem: imagem || undefined,
    };

    try {
      const novaLista = editandoId
        ? produtos.map((produto) => (produto.id === editandoId ? produtoSalvo : produto))
        : [...produtos, produtoSalvo];

      await salvarProdutos(novaLista);
      setProdutos(novaLista);
      limpar();
      setAba('lista');
      Alert.alert(
        editandoId ? 'Produto atualizado' : 'Produto salvo',
        editandoId ? `${produtoSalvo.nome} foi atualizado.` : `${produtoSalvo.nome} foi adicionado à loja.`
      );
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar o produto.');
    }
  };


  const editarProduto = (produto: Produto) => {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setPreco(produto.preco);
    setEstoque(produto.estoque);
    setSku(produto.sku);
    setCategoria(produto.categoria);
    setImagem(produto.imagem ?? null);
    setAba('form');
  };
  const removerProduto = (produto: Produto) => {
    Alert.alert('Remover produto', `Deseja excluir ${produto.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const novaLista = produtos.filter((item) => item.id !== produto.id);
          await salvarProdutos(novaLista);
          setProdutos(novaLista);
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Painel Admin</Text>
          <Text style={styles.title}>Produtos</Text>
        </View>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, aba === 'form' && styles.tabActive]} onPress={() => setAba('form')}>
          <Text style={[styles.tabText, aba === 'form' && styles.tabTextActive]}>Cadastro</Text>
        </Pressable>
        <Pressable style={[styles.tab, aba === 'lista' && styles.tabActive]} onPress={() => setAba('lista')}>
          <Text style={[styles.tabText, aba === 'lista' && styles.tabTextActive]}>Consulta ({produtos.length})</Text>
        </Pressable>
      </View>

      {aba === 'form' ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Campo label="Nome do produto *" value={nome} onChangeText={setNome} placeholder="Ex: Tênis Runner Pro" />
            <Campo label="Descrição" value={descricao} onChangeText={setDescricao} placeholder="Materiais e características" multiline />
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Campo label="Preço (R$) *" value={preco} onChangeText={setPreco} placeholder="0,00" keyboardType="numeric" />
              </View>
              <View style={styles.rowItem}>
                <Campo label="Custo (R$)" value={custo} onChangeText={setCusto} placeholder="0,00" keyboardType="numeric" />
              </View>
            </View>
            <View style={styles.row}>
              <View style={styles.rowItem}>
                <Campo label="Estoque" value={estoque} onChangeText={setEstoque} placeholder="0" keyboardType="numeric" />
              </View>
            </View>
            <Campo label="SKU / Código" value={sku} onChangeText={setSku} placeholder="Ex: TNS-RNR-001" />
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Imagem</Text>
            {imagem ? (
              <View style={styles.imageBlock}>
                <Image source={{ uri: imagem }} style={styles.previewImage} />
                <View style={styles.row}>
                  <Pressable style={styles.secondaryAction} onPress={selecionarImagem}>
                    <Text style={styles.secondaryActionText}>Trocar imagem</Text>
                  </Pressable>
                  <Pressable style={styles.dangerAction} onPress={() => setImagem(null)}>
                    <Text style={styles.dangerActionText}>Remover</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable style={styles.imagePicker} onPress={selecionarImagem}>
                <Text style={styles.imagePickerTitle}>Selecionar imagem</Text>
                <Text style={styles.imagePickerSub}>Opcional</Text>
              </Pressable>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {categorias.map((item) => (
                <Pressable
                  key={item}
                  style={[styles.categoryPill, categoria === item && styles.categoryPillActive]}
                  onPress={() => setCategoria(categoria === item ? null : item)}
                >
                  <Text style={[styles.categoryText, categoria === item && styles.categoryTextActive]}>{item}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.row}>
              <TextInput
                style={[styles.input, styles.rowItem]}
                value={novaCategoria}
                onChangeText={setNovaCategoria}
                placeholder="Nova categoria"
                placeholderTextColor={C.muted}
              />
              <Pressable style={styles.smallButton} onPress={salvarCategoria}>
                <Text style={styles.smallButtonText}>Adicionar</Text>
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={salvarProduto}>
            <Text style={styles.primaryButtonText}>{editandoId ? 'Atualizar produto' : 'Salvar produto'}</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={limpar}>
            <Text style={styles.dangerButtonText}>{editandoId ? 'Cancelar edição' : 'Limpar campos'}</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <TextInput
              style={styles.searchInput}
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar por nome, categoria ou SKU"
              placeholderTextColor={C.muted}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nenhum produto encontrado</Text>
              <Text style={styles.emptySub}>Cadastre produtos pela aba Cadastro.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {item.imagem ? (
                <Image source={{ uri: item.imagem }} style={styles.productImage} />
              ) : (
                <View style={styles.productImagePlaceholder}>
                  <Text style={styles.productImageText}>P</Text>
                </View>
              )}
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.nome}</Text>
                <Text style={styles.productPrice}>R$ {item.preco}</Text>
                {!!item.custo && <Text style={styles.productMeta}>Custo: R$ {item.custo}</Text>}
                {!!item.categoria && <Text style={styles.productMeta}>{item.categoria}</Text>}
                {!!item.estoque && <Text style={styles.productMeta}>{item.estoque} un. em estoque</Text>}
                {!!item.sku && <Text style={styles.productMeta}>SKU: {item.sku}</Text>}
              </View>
              <View style={styles.productActions}>
                <Pressable style={styles.editButton} onPress={() => editarProduto(item)}>
                  <Text style={styles.editButtonText}>Editar</Text>
                </Pressable>
                <Pressable style={styles.removeButton} onPress={() => removerProduto(item)}>
                  <Text style={styles.removeButtonText}>Excluir</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const baseInput = {
  backgroundColor: C.inputBg,
  borderColor: C.border,
  borderRadius: 12,
  borderWidth: 1,
  color: C.text,
  fontSize: 15,
  paddingHorizontal: 14,
  paddingVertical: 13,
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg, paddingHorizontal: 20, paddingTop: 60 },
  header: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 18 },
  kicker: { color: C.amber, fontSize: 11, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },
  title: { color: C.text, fontSize: 28, fontWeight: '900' },
  tabs: { flexDirection: 'row', gap: 10, marginBottom: 18 },
  tab: { flex: 1, alignItems: 'center', backgroundColor: C.surface, borderColor: C.border, borderRadius: 12, borderWidth: 1, paddingVertical: 12 },
  tabActive: { backgroundColor: C.accentSoft, borderColor: C.accent },
  tabText: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  tabTextActive: { color: C.accent },
  content: { gap: 16, paddingBottom: 40 },
  card: { gap: 14, backgroundColor: C.surface, borderColor: C.border, borderRadius: 18, borderWidth: 1, padding: 16 },
  field: { gap: 6 },
  label: { color: C.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.7, textTransform: 'uppercase' },
  input: baseInput,
  inputMultiline: { minHeight: 86, paddingTop: 13 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  rowItem: { flex: 1 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '800' },
  imageBlock: { gap: 12 },
  previewImage: { width: '100%', height: 180, borderRadius: 12 },
  imagePicker: { alignItems: 'center', borderColor: C.border, borderRadius: 12, borderStyle: 'dashed', borderWidth: 1, paddingVertical: 26 },
  imagePickerTitle: { color: C.mutedLight, fontSize: 14, fontWeight: '800' },
  imagePickerSub: { color: C.muted, fontSize: 12, marginTop: 4 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  categoryPill: { backgroundColor: C.inputBg, borderColor: C.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 },
  categoryPillActive: { backgroundColor: C.accentSoft, borderColor: C.accent },
  categoryText: { color: C.mutedLight, fontWeight: '700' },
  categoryTextActive: { color: C.accent },
  primaryButton: { alignItems: 'center', backgroundColor: C.accent, borderRadius: 12, paddingVertical: 15 },
  primaryButtonText: { color: C.white, fontSize: 15, fontWeight: '900' },
  secondaryButton: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  secondaryButtonText: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  smallButton: { backgroundColor: C.accent, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 13 },
  smallButtonText: { color: C.white, fontWeight: '900' },
  dangerButton: { alignItems: 'center', backgroundColor: C.dangerSoft, borderColor: C.danger, borderRadius: 12, borderWidth: 1, paddingVertical: 14 },
  dangerButtonText: { color: C.danger, fontSize: 14, fontWeight: '800' },
  secondaryAction: { flex: 1, alignItems: 'center', borderColor: C.accent, borderRadius: 12, borderWidth: 1, paddingVertical: 12 },
  secondaryActionText: { color: C.accent, fontWeight: '800' },
  dangerAction: { flex: 1, alignItems: 'center', backgroundColor: C.dangerSoft, borderColor: C.danger, borderRadius: 12, borderWidth: 1, paddingVertical: 12 },
  dangerActionText: { color: C.danger, fontWeight: '800' },
  listContent: { gap: 12, paddingBottom: 40 },
  searchInput: { ...baseInput, marginBottom: 8 },
  emptyBox: { alignItems: 'center', gap: 8, paddingTop: 60 },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: '900' },
  emptySub: { color: C.muted, fontSize: 14 },
  productCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderColor: C.border, borderRadius: 16, borderWidth: 1, padding: 14 },
  productImage: { width: 58, height: 58, borderRadius: 12 },
  productImagePlaceholder: { width: 58, height: 58, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surfaceHigh, borderRadius: 12 },
  productImageText: { color: C.mutedLight, fontSize: 22, fontWeight: '900' },
  productInfo: { flex: 1, gap: 3 },
  productActions: { gap: 8 },
  productName: { color: C.text, fontSize: 15, fontWeight: '900' },
  productPrice: { color: C.accent, fontSize: 15, fontWeight: '800' },
  productMeta: { color: C.muted, fontSize: 12 },
  editButton: { backgroundColor: C.accentSoft, borderColor: C.accent, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  editButtonText: { color: C.accent, fontSize: 12, fontWeight: '900' },
  removeButton: { backgroundColor: C.dangerSoft, borderColor: C.danger, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  removeButtonText: { color: C.danger, fontSize: 12, fontWeight: '900' },
});