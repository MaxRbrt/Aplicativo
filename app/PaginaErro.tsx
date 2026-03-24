import React, { useState } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

// ─── Paleta (mesma do restante do app) ──────────────────────────────────────
const C = {
  bg: '#0A0F1E',
  surface: '#111827',
  border: '#1E2A3A',
  accent: '#3B82F6',
  danger: '#EF4444',
  dangerSoft: '#EF444415',
  dangerBorder: '#EF444440',
  text: '#F1F5F9',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  white: '#FFFFFF',
};

export default function PaginaErro() {
  const router = useRouter();
  const [pressing, setPressing] = useState(false);

  const voltarLogin = () => {
    router.replace('/login');
  };

  return (
    <View style={styles.screen}>
      {/* Glow vermelho de fundo */}
      <View style={styles.glowRed} />

      <View style={styles.card}>
        {/* Ícone de erro */}
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>✕</Text>
        </View>

        {/* Textos */}
        <View style={styles.textBlock}>
          <Text style={styles.title}>Erro de login</Text>
          <Text style={styles.subtitle}>
            O e‑mail ou a senha não conferem.{'\n'}Verifique os dados e tente novamente.
          </Text>
        </View>

        {/* Dica */}
        <View style={styles.hint}>
          <Text style={styles.hintText}>
            💡 Use <Text style={styles.hintBold}>aluno@eduvale.com.br</Text> ou{' '}
            <Text style={styles.hintBold}>admin@eduvale.com.br</Text>
          </Text>
        </View>

        {/* Botão voltar */}
        <Pressable
          style={[styles.btn, pressing && styles.btnPressed]}
          onPress={voltarLogin}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
        >
          <Text style={styles.btnText}>← Voltar ao login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  glowRed: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: C.danger,
    opacity: 0.06,
    top: '20%',
    alignSelf: 'center',
  },

  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: C.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.dangerBorder,
    padding: 28,
    gap: 20,
    alignItems: 'center',
    shadowColor: C.danger,
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },

  // ícone
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.dangerSoft,
    borderWidth: 1.5,
    borderColor: C.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
    color: C.danger,
    fontWeight: '900',
  },

  // textos
  textBlock: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 21,
  },

  // dica
  hint: {
    backgroundColor: '#0D1525',
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
  hintText: {
    color: C.mutedLight,
    fontSize: 13,
    lineHeight: 20,
    textAlign: 'center',
  },
  hintBold: {
    color: C.accent,
    fontWeight: '700',
  },

  // botão
  btn: {
    width: '100%',
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
  btnText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});