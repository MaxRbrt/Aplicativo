import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, KeyboardTypeOptions, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constantes/tema';
import { criarUsuario } from '@/servicos/armazenamento';
import { estilosCriarConta as styles } from '@/estilos/telas/criar-conta';

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
