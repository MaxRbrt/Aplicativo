import React, { useState } from 'react';
import {
  StyleSheet, Image, FlatList, Pressable,
  View, Text, Modal, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

// ─── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#0A0F1E',
  surface: '#111827',
  surfaceHigh: '#162032',
  border: '#1E2A3A',
  accent: '#3B82F6',
  accentGlow: '#1D4ED8',
  accentSoft: '#1D4ED815',
  text: '#F1F5F9',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.75)',
};

type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: string;
  imagem: any;
  tag?: string;
};

// ─── Dados mockados com imagens corretas ─────────────────────────────────────
const produtos: Produto[] = [
  {
    id: '1',
    nome: 'Tênis Runner',
    descricao: 'Solado extra leve, ideal para corridas longas no asfalto. Amortecimento de alto desempenho.',
    preco: 'R$ 199,90',
    imagem: require('@/assets/images/tenis.png'),
    tag: 'Mais vendido',
  },
  {
    id: '2',
    nome: 'Camisa Dry Fit',
    descricao: 'Tecido de secagem rápida, perfeito para treinos intensos. Disponível em várias cores.',
    preco: 'R$ 79,90',
    imagem: require('@/assets/images/camiseta.png'),
    tag: 'Leve',
  },
  {
    id: '3',
    nome: 'Fone Bluetooth',
    descricao: 'Cancelamento de ruído ativo e 30h de bateria. Conectividade Bluetooth 5.3.',
    preco: 'R$ 129,90',
    imagem: require('@/assets/images/fone.png'),
    tag: 'Sem fio',
  },
  {
    id: '4',
    nome: 'Mochila Urbana',
    descricao: 'Compartimento para notebook 15" e alças ergonômicas. Material impermeável.',
    preco: 'R$ 149,90',
    imagem: require('@/assets/images/mochila.png'),
    tag: 'Resistente',
  },
  {
    id: '5',
    nome: 'Garrafa Térmica',
    descricao: 'Mantém bebidas geladas por até 24h. Aço inox 500ml com tampa hermética.',
    preco: 'R$ 59,90',
    imagem: require('@/assets/images/garrafa.png'),
    tag: 'Top',
  },
];

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function DestaquesAluno() {
  const router = useRouter();
  const [pressingBack, setPressingBack] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

  return (
    <View style={styles.screen}>
      <View style={styles.glowTop} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Confira os melhores</Text>
          <Text style={styles.title}>Destaques</Text>
        </View>
        <Pressable
          style={[styles.backBtn, pressingBack && styles.btnPressed]}
          onPress={() => router.replace('/home')}
          onPressIn={() => setPressingBack(true)}
          onPressOut={() => setPressingBack(false)}
        >
          <Text style={styles.backBtnText}>← Voltar</Text>
        </Pressable>
      </View>

      {/* ── Lista ── */}
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProdutoCard item={item} onVerDetalhes={() => setProdutoSelecionado(item)} />
        )}
      />

      {/* ── Modal de detalhes ── */}
      <Modal
        visible={produtoSelecionado !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setProdutoSelecionado(null)}
      >
        {produtoSelecionado && (
          <DetalheModal
            produto={produtoSelecionado}
            onFechar={() => setProdutoSelecionado(null)}
          />
        )}
      </Modal>
    </View>
  );
}

// ─── Card da lista ────────────────────────────────────────────────────────────
function ProdutoCard({ item, onVerDetalhes }: { item: Produto; onVerDetalhes: () => void }) {
  const [pressing, setPressing] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {/* Imagem */}
        <View style={styles.imageWrapper}>
          <Image source={item.imagem} style={styles.cardImage} resizeMode="contain" />
        </View>

        {/* Info */}
        <View style={styles.cardInfo}>
          {item.tag && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.tag}</Text>
            </View>
          )}
          <Text style={styles.cardTitle} numberOfLines={2}>{item.nome}</Text>
          <Text style={styles.cardPrice}>{item.preco}</Text>
        </View>
      </View>

      {/* Descrição */}
      <Text style={styles.cardDesc} numberOfLines={2}>{item.descricao}</Text>

      {/* Botão */}
      <Pressable
        style={[styles.cardBtn, pressing && styles.btnPressed]}
        onPress={onVerDetalhes}
        onPressIn={() => setPressing(true)}
        onPressOut={() => setPressing(false)}
      >
        <Text style={styles.cardBtnText}>Ver detalhes</Text>
      </Pressable>
    </View>
  );
}

// ─── Modal de detalhes ────────────────────────────────────────────────────────
function DetalheModal({ produto, onFechar }: { produto: Produto; onFechar: () => void }) {
  const [pressing, setPressing] = useState(false);

  return (
    <View style={styles.overlay}>
      <View style={styles.modalCard}>

        {/* Imagem grande */}
        <View style={styles.modalImageWrapper}>
          <Image source={produto.imagem} style={styles.modalImage} resizeMode="cover" />
          {produto.tag && (
            <View style={styles.modalBadge}>
              <Text style={styles.badgeText}>{produto.tag}</Text>
            </View>
          )}
        </View>

        {/* Conteúdo */}
        <ScrollView
          contentContainerStyle={styles.modalContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.modalTitle}>{produto.nome}</Text>
          <Text style={styles.modalPrice}>{produto.preco}</Text>
          <View style={styles.divider} />
          <Text style={styles.modalDescLabel}>Descrição</Text>
          <Text style={styles.modalDesc}>{produto.descricao}</Text>
        </ScrollView>

        {/* Botão fechar */}
        <Pressable
          style={[styles.closeBtn, pressing && styles.btnPressed]}
          onPress={onFechar}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
        >
          <Text style={styles.closeBtnText}>Fechar</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingTop: 56,
  },
  glowTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: C.accentGlow,
    opacity: 0.07,
    top: -80,
    left: -60,
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  kicker: {
    fontSize: 11,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  backBtnText: {
    color: C.mutedLight,
    fontWeight: '700',
    fontSize: 13,
  },

  // lista
  listContent: {
    paddingBottom: 32,
    gap: 14,
  },

  // card
  card: {
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    gap: 5,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: C.accent,
    fontWeight: '800',
    fontSize: 11,
  },
  imageWrapper: {
    width: 90,
    height: 90,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: C.surfaceHigh,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontWeight: '800',
    color: C.text,
    fontSize: 15,
  },
  cardPrice: {
    color: C.accent,
    fontWeight: '700',
    fontSize: 15,
  },
  cardDesc: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  cardBtn: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardBtnText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 13,
  },

  // modal
  overlay: {
    flex: 1,
    backgroundColor: C.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  modalImageWrapper: {
    width: '100%',
    height: 280,
    backgroundColor: C.surfaceHigh,
    overflow: 'hidden',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: C.accentSoft,
    borderColor: C.accent,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  modalContent: {
    padding: 22,
    gap: 8,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: C.accent,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 4,
  },
  modalDescLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  modalDesc: {
    fontSize: 15,
    color: C.mutedLight,
    lineHeight: 23,
  },
  closeBtn: {
    margin: 16,
    backgroundColor: C.accent,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: C.accent,
    shadowOpacity: 0.35,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  closeBtnText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
});