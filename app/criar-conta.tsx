import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import { criarUsuario } from '@/services/storage';

const C = AppColors;

function Campo({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.muted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
        autoCorrect={false}
        selectionColor={C.accent}
      />
    </View>
  );
}

export default function CriarConta() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const cadastrar = async () => {
    if (senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'Confirme a senha digitada.');
      return;
    }

    try {
      setCarregando(true);
      const usuario = await criarUsuario({
        nome,
        email,
        senha,
        perfil: 'cliente',
      });

      Alert.alert('Conta criada', 'Seu cadastro foi concluído. Você já pode entrar.', [
        {
          text: 'Entrar',
          onPress: () => router.replace({ pathname: '/entrar', params: { email: usuario.email } }),
        },
      ]);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Não foi possível criar a conta.';
      Alert.alert('Atenção', mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.brandBlock}>
            <View style={styles.brandIcon}>
              <Text style={styles.brandIconText}>F</Text>
            </View>
            <Text style={styles.brandName}>FAST</Text>
          </View>

          <View style={styles.header}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>Cadastre-se para acessar a vitrine de produtos.</Text>
          </View>

          <Campo label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
          <Campo
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="voce@email.com"
            keyboardType="email-address"
          />
          <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry />
          <Campo
            label="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Digite a senha novamente"
            secureTextEntry
          />

          <Pressable style={[styles.primaryButton, carregando && styles.disabled]} onPress={cadastrar} disabled={carregando}>
            <Text style={styles.primaryButtonText}>{carregando ? 'Criando conta...' : 'Criar conta'}</Text>
          </Pressable>

          <Pressable style={styles.linkButton} onPress={() => router.replace('/entrar')}>
            <Text style={styles.linkButtonText}>Já tenho conta</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 420, gap: 18, backgroundColor: C.surface, borderColor: C.border, borderWidth: 1, borderRadius: 18, padding: 24 },
  brandBlock: { alignItems: 'center', gap: 8 },
  brandIcon: { width: 54, height: 54, alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, borderRadius: 14 },
  brandIconText: { color: C.white, fontSize: 24, fontWeight: '900' },
  brandName: { color: C.text, fontSize: 20, fontWeight: '900', letterSpacing: 5 },
  header: { gap: 5 },
  title: { color: C.text, fontSize: 24, fontWeight: '900' },
  subtitle: { color: C.mutedLight, fontSize: 14, lineHeight: 20 },
  field: { gap: 6 },
  label: { color: C.muted, fontSize: 11, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' },
  input: { backgroundColor: C.inputBg, borderColor: C.border, borderWidth: 1, borderRadius: 12, color: C.text, fontSize: 15, paddingHorizontal: 14, paddingVertical: 13 },
  primaryButton: { alignItems: 'center', backgroundColor: C.accent, borderRadius: 12, paddingVertical: 15 },
  primaryButtonText: { color: C.white, fontSize: 15, fontWeight: '900' },
  linkButton: { alignItems: 'center', paddingVertical: 4 },
  linkButtonText: { color: C.accent, fontSize: 14, fontWeight: '800' },
  disabled: { opacity: 0.65 },
});