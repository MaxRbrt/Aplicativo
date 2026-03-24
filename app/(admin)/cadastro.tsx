import React, { useState, useRef } from 'react';
import { StyleSheet, TextInput, Pressable, Alert, View, Text, Animated } from 'react-native';
import { useRouter } from 'expo-router';

// ─── Paleta ──────────────────────────────────────────────────────────────────
const C = {
  bg: '#0A0F1E',
  surface: '#111827',
  inputBg: '#0D1525',
  border: '#1E2A3A',
  borderFocus: '#3B82F6',
  accent: '#3B82F6',
  accentGlow: '#1D4ED8',
  danger: '#EF4444',
  dangerSoft: '#EF444415',
  text: '#F1F5F9',
  muted: '#64748B',
  mutedLight: '#94A3B8',
  white: '#FFFFFF',
};

// ─── Campo animado (reutilizado do login) ────────────────────────────────────
function AnimatedInput({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  keyboardType?: any;
  multiline?: boolean;
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
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.muted}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={C.accent}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </Animated.View>
    </View>
  );
}

// ─── Tela Cadastro ───────────────────────────────────────────────────────────
export default function Cadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [pressingSave, setPressingSave] = useState(false);
  const [pressingClear, setPressingClear] = useState(false);
  const [pressingBack, setPressingBack] = useState(false);

  const salvar = () => {
    const n = nome.trim();
    const p = preco.trim();

    if (!n || !p) {
      Alert.alert('Atenção', 'Preencha nome e preço.');
      return;
    }

    Alert.alert(
      '✅ Produto cadastrado',
      `Nome: ${n}\nDescrição: ${descricao.trim() || '—'}\nPreço: ${p}`
    );

    setNome('');
    setDescricao('');
    setPreco('');
    setImagemUrl('');
  };

  const limpar = () => {
    setNome('');
    setDescricao('');
    setPreco('');
    setImagemUrl('');
  };

  return (
    <View style={styles.screen}>
      {/* Glow de fundo */}
      <View style={styles.glowTop} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>Painel Admin</Text>
          <Text style={styles.title}>Cadastro</Text>
        </View>

        <Pressable
          style={[styles.backBtn, pressingBack && styles.btnPressed]}
          onPress={() => router.back()}
          onPressIn={() => setPressingBack(true)}
          onPressOut={() => setPressingBack(false)}
        >
          <Text style={styles.backBtnText}>← Voltar</Text>
        </Pressable>
      </View>

      {/* ── Formulário ── */}
      <View style={styles.card}>
        <AnimatedInput
          label="Nome do produto"
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Fone Bluetooth"
        />

        <AnimatedInput
          label="Descrição"
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Ex: Fone sem fio com cancelamento de ruído"
          multiline
        />

        <AnimatedInput
          label="Preço"
          value={preco}
          onChangeText={setPreco}
          placeholder="Ex: 129,90"
          keyboardType="numeric"
        />

        <Pressable
          style={[styles.primaryBtn, pressingSave && styles.btnPressed]}
          onPress={salvar}
          onPressIn={() => setPressingSave(true)}
          onPressOut={() => setPressingSave(false)}
        >
          <Text style={styles.primaryBtnText}>Salvar produto</Text>
        </Pressable>

        <Pressable
          style={[styles.dangerBtn, pressingClear && styles.btnPressed]}
          onPress={limpar}
          onPressIn={() => setPressingClear(true)}
          onPressOut={() => setPressingClear(false)}
        >
          <Text style={styles.dangerBtnText}>Limpar campos</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
    padding: 20,
    paddingTop: 64,
    gap: 20,
  },

  glowTop: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: C.accentGlow,
    opacity: 0.07,
    top: -60,
    left: -40,
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  kicker: {
    fontSize: 11,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: C.text,
    letterSpacing: -0.5,
  },

  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  backBtnText: {
    color: C.mutedLight,
    fontWeight: '700',
    fontSize: 13,
  },

  // card formulário
  card: {
    backgroundColor: C.surface,
    borderColor: C.border,
    borderWidth: 1,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },

  // campo
  fieldWrapper: { gap: 6 },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  labelFocused: { color: C.accent },
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
  inputMultiline: {
    minHeight: 80,
    paddingTop: 14,
  },

  // botão salvar
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
  primaryBtnText: {
    color: C.white,
    fontWeight: '800',
    fontSize: 15,
    letterSpacing: 0.3,
  },

  // botão limpar
  dangerBtn: {
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.danger,
    backgroundColor: C.dangerSoft,
  },
  dangerBtnText: {
    color: C.danger,
    fontWeight: '700',
    fontSize: 14,
  },

  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
});