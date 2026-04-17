import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';

const C = AppColors;

export default function PaginaErro() {
  const router = useRouter();
  const [pressing, setPressing] = useState(false);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconBox}>
          <Text style={styles.iconText}>!</Text>
        </View>

        <View style={styles.textBlock}>
          <Text style={styles.title}>Acesso negado</Text>
          <Text style={styles.subtitle}>E-mail ou senha incorretos. Verifique os dados e tente novamente.</Text>
        </View>

        <Pressable
          style={[styles.primaryButton, pressing && styles.pressed]}
          onPress={() => router.replace('/entrar')}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
        >
          <Text style={styles.primaryButtonText}>Voltar ao login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bg,
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    gap: 20,
    alignItems: 'center',
    backgroundColor: C.surface,
    borderColor: C.dangerBorder,
    borderWidth: 1,
    borderRadius: 18,
    padding: 28,
  },
  iconBox: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.dangerSoft,
    borderColor: C.danger,
    borderWidth: 1,
    borderRadius: 32,
  },
  iconText: {
    color: C.danger,
    fontSize: 30,
    fontWeight: '900',
  },
  textBlock: {
    gap: 8,
    alignItems: 'center',
  },
  title: {
    color: C.text,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: C.mutedLight,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  primaryButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: C.accent,
    borderRadius: 12,
    paddingVertical: 15,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});