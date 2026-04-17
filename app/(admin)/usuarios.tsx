import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardTypeOptions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constants/app-theme';
import {
  PerfilUsuario,
  Usuario,
  carregarUsuarios,
  criarUsuario,
  limparDadosDeUsuariosRemovidos,
  salvarUsuarios,
} from '@/services/storage';

const C = AppColors;

type Aba = 'form' | 'lista';

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

export default function UsuariosAdmin() {
  const router = useRouter();
  const [aba, setAba] = useState<Aba>('form');
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState<PerfilUsuario>('cliente');
  const [busca, setBusca] = useState('');

  const carregar = useCallback(async () => {
    try {
      await limparDadosDeUsuariosRemovidos();
      setUsuarios(await carregarUsuarios());
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os usuários.');
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return usuarios;

    return usuarios.filter((usuario) =>
      [usuario.nome, usuario.email, usuario.perfil].join(' ').toLowerCase().includes(termo)
    );
  }, [busca, usuarios]);

  const limpar = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setPerfil('cliente');
  };

  const salvar = async () => {
    try {
      const novoUsuario = await criarUsuario({ nome, email, senha, perfil });
      setUsuarios((lista) => [...lista, novoUsuario]);
      limpar();
      setAba('lista');
      Alert.alert('Usuário salvo', `${novoUsuario.nome} foi cadastrado.`);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : 'Não foi possível salvar o usuário.';
      Alert.alert('Atenção', mensagem);
    }
  };

  const remover = (usuario: Usuario) => {
    Alert.alert('Remover usuário', `Deseja excluir ${usuario.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const novaLista = usuarios.filter((item) => item.id !== usuario.id);
          await salvarUsuarios(novaLista);
          setUsuarios(novaLista);
        },
      },
    ]);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Painel Admin</Text>
          <Text style={styles.title}>Usuários</Text>
        </View>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, aba === 'form' && styles.tabActive]} onPress={() => setAba('form')}>
          <Text style={[styles.tabText, aba === 'form' && styles.tabTextActive]}>Cadastro</Text>
        </Pressable>
        <Pressable
          style={[styles.tab, aba === 'lista' && styles.tabActive]}
          onPress={() => {
            setAba('lista');
            carregar();
          }}
        >
          <Text style={[styles.tabText, aba === 'lista' && styles.tabTextActive]}>Consulta ({usuarios.length})</Text>
        </Pressable>
      </View>

      {aba === 'form' ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Campo label="Nome" value={nome} onChangeText={setNome} placeholder="Ex: Maria Silva" />
            <Campo
              label="E-mail"
              value={email}
              onChangeText={setEmail}
              placeholder="usuario@loja.com"
              keyboardType="email-address"
            />
            <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="Mínimo 6 caracteres" secureTextEntry />

            <View style={styles.field}>
              <Text style={styles.label}>Perfil</Text>
              <View style={styles.profileRow}>
                {(['cliente', 'admin'] as PerfilUsuario[]).map((tipo) => (
                  <Pressable
                    key={tipo}
                    style={[styles.profileButton, perfil === tipo && styles.profileButtonActive]}
                    onPress={() => setPerfil(tipo)}
                  >
                    <Text style={[styles.profileButtonText, perfil === tipo && styles.profileButtonTextActive]}>
                      {tipo === 'admin' ? 'Admin' : 'Cliente'}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={salvar}>
            <Text style={styles.primaryButtonText}>Salvar usuário</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={limpar}>
            <Text style={styles.dangerButtonText}>Limpar campos</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <FlatList
          data={usuariosFiltrados}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <TextInput
              style={styles.searchInput}
              value={busca}
              onChangeText={setBusca}
              placeholder="Buscar por nome, e-mail ou perfil"
              placeholderTextColor={C.muted}
              autoCapitalize="none"
              autoCorrect={false}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>Nenhum usuário encontrado</Text>
              <Text style={styles.emptySub}>Cadastre usuários pela aba Cadastro.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <View style={[styles.avatar, item.perfil === 'admin' ? styles.avatarAdmin : styles.avatarClient]}>
                <Text style={styles.avatarText}>{item.nome.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.nome}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userProfile}>{item.perfil === 'admin' ? 'Admin' : 'Cliente'}</Text>
              </View>
              <Pressable style={styles.removeButton} onPress={() => remover(item)}>
                <Text style={styles.removeButtonText}>Excluir</Text>
              </Pressable>
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
  profileRow: { flexDirection: 'row', gap: 10 },
  profileButton: { flex: 1, alignItems: 'center', backgroundColor: C.inputBg, borderColor: C.border, borderRadius: 12, borderWidth: 1, paddingVertical: 12 },
  profileButtonActive: { backgroundColor: C.accentSoft, borderColor: C.accent },
  profileButtonText: { color: C.mutedLight, fontWeight: '800' },
  profileButtonTextActive: { color: C.accent },
  primaryButton: { alignItems: 'center', backgroundColor: C.accent, borderRadius: 12, paddingVertical: 15 },
  primaryButtonText: { color: C.white, fontSize: 15, fontWeight: '900' },
  dangerButton: { alignItems: 'center', backgroundColor: C.dangerSoft, borderColor: C.danger, borderRadius: 12, borderWidth: 1, paddingVertical: 14 },
  dangerButtonText: { color: C.danger, fontSize: 14, fontWeight: '800' },
  secondaryButton: { backgroundColor: C.surface, borderColor: C.border, borderRadius: 999, borderWidth: 1, paddingHorizontal: 16, paddingVertical: 10 },
  secondaryButtonText: { color: C.mutedLight, fontSize: 13, fontWeight: '800' },
  listContent: { gap: 12, paddingBottom: 40 },
  searchInput: { ...baseInput, marginBottom: 8 },
  emptyBox: { alignItems: 'center', gap: 8, paddingTop: 60 },
  emptyTitle: { color: C.text, fontSize: 18, fontWeight: '900' },
  emptySub: { color: C.muted, fontSize: 14 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderColor: C.border, borderRadius: 16, borderWidth: 1, padding: 14 },
  avatar: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, borderWidth: 1 },
  avatarAdmin: { backgroundColor: C.amberSoft, borderColor: C.amber },
  avatarClient: { backgroundColor: C.greenSoft, borderColor: C.green },
  avatarText: { color: C.text, fontSize: 18, fontWeight: '900' },
  userInfo: { flex: 1, gap: 3 },
  userName: { color: C.text, fontSize: 15, fontWeight: '900' },
  userEmail: { color: C.mutedLight, fontSize: 13 },
  userProfile: { color: C.accent, fontSize: 12, fontWeight: '800' },
  removeButton: { backgroundColor: C.dangerSoft, borderColor: C.danger, borderRadius: 10, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 8 },
  removeButtonText: { color: C.danger, fontSize: 12, fontWeight: '900' },
});

