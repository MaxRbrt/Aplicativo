import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, KeyboardTypeOptions, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { AppColors } from '@/constantes/tema';
import { estilosAdminUsuarios as styles } from '@/estilos/telas/admin-usuarios';
import {
  PerfilUsuario,
  Usuario,
  carregarUsuarios,
  criarUsuario,
  limparDadosDeUsuariosRemovidos,
  salvarUsuarios,
} from '@/servicos/armazenamento';

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
