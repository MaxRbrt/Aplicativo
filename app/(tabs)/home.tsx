import React, { useState } from 'react';
import { StyleSheet, Image, Pressable, View, Text, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// ─── Paleta ─────────────────────────────────────────────────
const C = {
  bg: '#0A0F1E',
  surface: '#111827',
  surfaceHigh: '#162032',
  border: '#1E2A3A',
  accent: '#3B82F6',
  accentGlow: '#1D4ED8',
  text: '#F1F5F9',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  white: '#FFFFFF',
};

export default function HomeAluno() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [pressingBtn, setPressingBtn] = useState(false);
  const [pressingOut, setPressingOut] = useState(false);

  const nomeUsuario = email ? email.split('@')[0] : 'usuário';

  return (
    <View style={styles.screen}>
      {/* Glow de fundo */}
      <View style={styles.glowTop} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={styles.logoBg}>
            <Image
              source={require('@/assets/images/teste.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── Saudação ── */}
        <View style={styles.greetRow}>
          <View style={styles.greetLeft}>
            <Text style={styles.kicker}>Bem-vindo de volta</Text>
            <Text style={styles.greetName}>Olá, {nomeUsuario} 👋</Text>
          </View>

          <Pressable
            style={[styles.outlineBtn, pressingOut && styles.btnPressed]}
            onPress={() => router.replace('/login')}
            onPressIn={() => setPressingOut(true)}
            onPressOut={() => setPressingOut(false)}
          >
            <Text style={styles.outlineBtnText}>Sair</Text>
          </Pressable>
        </View>

        {/* ── Chip de e-mail ── */}
        <View style={styles.chip}>
          <Text style={styles.chipText}>👤 {email ?? 'usuário'}</Text>
        </View>

        {/* ── Card informativo ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>O que tem aqui?</Text>
          <Text style={styles.cardText}>
            Na aba{' '}
            <Text style={styles.highlight}>Destaques</Text>
            {' '}você encontra os produtos em cards (imagem, título e preço) e pode abrir um Alert em cada item.
          </Text>
        </View>

        {/* ── Quick stats ── */}
        <View style={styles.quickGrid}>
          <View style={styles.quickCard}>
            <Text style={styles.quickEmoji}>📦</Text>
            <Text style={styles.quickTitle}>Produtos</Text>
            <Text style={styles.quickSub}>5 itens em destaque</Text>
          </View>

          <View style={styles.quickCard}>
            <Text style={styles.quickEmoji}>🔔</Text>
            <Text style={styles.quickTitle}>Alertas</Text>
            <Text style={styles.quickSub}>Nome + preço</Text>
          </View>
        </View>

        {/* ── Botão principal ── */}
        <Pressable
          style={[styles.primaryBtn, pressingBtn && styles.btnPressed]}
          onPress={() => router.push('/(tabs)/destaque')}
          onPressIn={() => setPressingBtn(true)}
          onPressOut={() => setPressingBtn(false)}
        >
          <Text style={styles.primaryBtnText}>Ver Destaques →</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  glowTop: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: C.accentGlow,
    opacity: 0.07,
    top: -60,
    right: -60,
  },

  scroll: {
    padding: 20,
    gap: 16,
    paddingBottom: 40,
    paddingTop: 80,
  },

  // header / logo
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  logoBg: {
    backgroundColor: C.white,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  logo: {
    width: 150,
    height: 48,
  },

  // saudação
  greetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetLeft: {
    gap: 2,
  },
  kicker: {
    fontSize: 12,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  greetName: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },

  // botão sair (outline)
  outlineBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  outlineBtnText: {
    color: C.mutedLight,
    fontWeight: '700',
    fontSize: 13,
  },

  // chip de e-mail
  chip: {
    alignSelf: 'flex-start',
    backgroundColor: C.surfaceHigh,
    borderColor: C.border,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  chipText: {
    color: C.mutedLight,
    fontWeight: '600',
    fontSize: 13,
  },

  // card informativo
  card: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  cardTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  cardText: {
    color: C.muted,
    lineHeight: 21,
    fontSize: 14,
  },
  highlight: {
    color: C.accent,
    fontWeight: '800',
  },

  // quick cards
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    gap: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  quickEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  quickTitle: {
    fontWeight: '800',
    color: C.text,
    fontSize: 14,
  },
  quickSub: {
    color: C.muted,
    fontSize: 12,
  },

  // botão principal
  primaryBtn: {
    marginTop: 4,
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
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  primaryBtnText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});