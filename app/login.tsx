import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Animated,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
} from 'react-native';
import { useRouter } from 'expo-router';

// ─── Paleta ────────────────────────────────────────────────────────────────
const C = {
  bg: '#0A0F1E',
  surface: '#111827',
  border: '#1E2A3A',
  borderFocus: '#3B82F6',
  accent: '#3B82F6',
  accentSoft: '#1D4ED820',
  text: '#F1F5F9',
  muted: '#64748B',
  inputBg: '#0D1525',
  danger: '#EF4444',
  white: '#FFFFFF',
};

// ─── Componente de campo com animação de foco ───────────────────────────────
function AnimatedInput({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: any;
  autoCapitalize?: any;
}) {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border, C.borderFocus],
  });

  return (
    <View style={styles.fieldWrapper}>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      <Animated.View style={[styles.inputBox, { borderColor }]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          placeholderTextColor={C.muted}
          onFocus={onFocus}
          onBlur={onBlur}
          selectionColor={C.accent}
        />
      </Animated.View>
    </View>
  );
}

// ─── Tela de Login ──────────────────────────────────────────────────────────
export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pressing, setPressing] = useState(false);
  const router = useRouter();

  const realizarLogin = () => {
    const e = email.trim().toLowerCase();
    if (e === 'aluno@eduvale.com.br' && password === '123456') {
      router.replace({ pathname: '/(tabs)/home', params: { email: e } });
      return;
    }
    if (e === 'admin@eduvale.com.br' && password === '654321') {
      router.replace({ pathname: '/(admin)', params: { email: e } });
      return;
    }
    router.replace('/PaginaErro');
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Fundo decorativo */}
      <View style={styles.glow} />

      <View style={styles.card}>
        {/* Logo */}
        <View style={styles.logoWrapper}>
          <View style={styles.logoBg}>
            <Image
              source={require('@/assets/images/teste.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Bem-vindo</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar</Text>
        </View>

        {/* Campos */}
        <AnimatedInput
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <AnimatedInput
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Botão */}
        <Pressable
          style={[styles.btn, pressing && styles.btnPressed]}
          onPress={realizarLogin}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
        >
          <Text style={styles.btnText}>Entrar</Text>
        </Pressable>

        {/* Rodapé discreto */}
        <Text style={styles.footer}>EduVale · Plataforma Educacional</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Estilos ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  // brilho de fundo
  glow: {
    position: 'absolute',
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: '#1D4ED8',
    opacity: 0.08,
    top: '15%',
    alignSelf: 'center',
  },

  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: C.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: C.border,
    padding: 28,
    gap: 18,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },

  logoWrapper: {
    alignItems: 'center',
    marginBottom: 4,
  },
  logoBg: {
    backgroundColor: '#FFFFFF',
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
    width: 160,
    height: 52,
  },

  header: {
    gap: 4,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: C.muted,
    fontWeight: '400',
  },

  // campo
  fieldWrapper: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  labelFocused: {
    color: C.accent,
  },
  inputBox: {
    borderWidth: 1.5,
    borderRadius: 12,
    backgroundColor: C.inputBg,
    overflow: 'hidden',
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: C.text,
  },

  // botão
  btn: {
    marginTop: 6,
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
    fontSize: 16,
    letterSpacing: 0.3,
  },

  footer: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 12,
    marginTop: 4,
  },
});