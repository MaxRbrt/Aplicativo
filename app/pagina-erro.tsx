import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { estilosPaginaErro as styles } from '@/estilos/telas/pagina-erro';

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
