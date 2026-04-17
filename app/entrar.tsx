import React, { useRef, useState } from 'react';
import { Alert, Animated, KeyboardAvoidingView, KeyboardTypeOptions, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { AppColors } from '@/constantes/tema';
import { autenticarUsuario, definirUsuarioAtual } from '@/servicos/armazenamento';
import { estilosEntrar as styles } from '@/estilos/telas/entrar';

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

      router.replace({ pathname: '/(cliente)/inicio', params: { email: usuario.email } });
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
