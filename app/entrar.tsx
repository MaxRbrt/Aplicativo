import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { autenticarUsuario, definirUsuarioAtual } from '@/services/storage';

const C = AppColors;

function CampoAnimado({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}) {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const animate = (toValue: number) => {
    Animated.timing(anim, { toValue, duration: 180, useNativeDriver: false }).start();
  };

  const borderColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border, C.borderFocus],
  });

  return (
    <View style={styles.field}>
      <Text style={[styles.label, focused && styles.labelFocused]}>{label}</Text>
      <Animated.View style={[styles.inputBox, { borderColor }]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor={C.muted}
          selectionColor={C.accent}
          onFocus={() => {
            setFocused(true);
            animate(1);
          }}
          onBlur={() => {
            setFocused(false);
            animate(0);
          }}
        />
      </Animated.View>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();
  const [email, setEmail] = useState(params.email ?? '');
  const [password, setPassword] = useState('');
  const [pressing, setPressing] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const realizarLogin = async () => {
    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Informe e-mail e senha para entrar.');
      return;
    }

    try {
      setCarregando(true);
      const usuario = await autenticarUsuario(emailNormalizado, password);

      if (!usuario) {
        router.replace('/pagina-erro');
        return;
      }

      await definirUsuarioAtual(usuario.email);

      if (usuario.perfil === 'admin') {
        router.replace({ pathname: '/(admin)', params: { email: usuario.email } });
        return;
      }

      router.replace({ pathname: '/(tabs)/inicio', params: { email: usuario.email } });
    } catch {
      Alert.alert('Erro', 'Não foi possível validar o login.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <View style={styles.brandBlock}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>F</Text>
          </View>
          <Text style={styles.brandName}>FAST</Text>
          <Text style={styles.brandTagline}>sua loja premium</Text>
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Entrar</Text>
          <Text style={styles.subtitle}>Acesse sua conta para continuar.</Text>
        </View>

        <CampoAnimado label="E-mail" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <CampoAnimado label="Senha" value={password} onChangeText={setPassword} secureTextEntry />

        <Pressable
          style={[styles.primaryButton, pressing && styles.pressed, carregando && styles.disabled]}
          onPress={realizarLogin}
          onPressIn={() => setPressing(true)}
          onPressOut={() => setPressing(false)}
          disabled={carregando}
        >
          <Text style={styles.primaryButtonText}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
        </Pressable>

        <View style={styles.createAccountBox}>
          <Text style={styles.createAccountText}>Ainda não tem conta?</Text>
          <Pressable onPress={() => router.push('/criar-conta')}>
            <Text style={styles.createAccountLink}>Criar conta</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, padding: 20 },
  card: { width: '100%', maxWidth: 400, gap: 18, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 24 },
  brandBlock: { alignItems: 'center', gap: 6 },
  brandIcon: { width: 56, height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, borderRadius: 14 },
  brandIconText: { color: C.white, fontSize: 26, fontWeight: '900' },
  brandName: { color: C.text, fontSize: 22, fontWeight: '900', letterSpacing: 6 },
  brandTagline: { color: C.muted, fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase' },
  header: { gap: 4 },
  title: { color: C.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: C.mutedLight, fontSize: 14 },
  field: { gap: 6 },
  label: { color: C.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  labelFocused: { color: C.accent },
  inputBox: { overflow: 'hidden', backgroundColor: C.inputBg, borderRadius: 12, borderWidth: 1.5 },
  input: { color: C.text, fontSize: 15, paddingHorizontal: 16, paddingVertical: 14 },
  primaryButton: { alignItems: 'center', backgroundColor: C.accent, borderRadius: 12, paddingVertical: 15 },
  primaryButtonText: { color: C.white, fontSize: 16, fontWeight: '900' },
  createAccountBox: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  createAccountText: { color: C.mutedLight, fontSize: 14 },
  createAccountLink: { color: C.accent, fontSize: 14, fontWeight: '900' },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.65 },
});