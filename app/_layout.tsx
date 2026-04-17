import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useEsquemaCores } from '@/ganchos/usar-esquema-cores';

export default function RootLayout() {
  const esquemaCores = useEsquemaCores();

  return (
    <ThemeProvider value={esquemaCores === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="entrar" options={{ headerShown: false }} />
        <Stack.Screen name="criar-conta" options={{ headerShown: false }} />
        <Stack.Screen name="pagina-erro" options={{ title: 'Erro' }} />
        <Stack.Screen name="nota-fiscal" options={{ headerShown: false }} />
        <Stack.Screen name="(cliente)" options={{ headerShown: false }} />
        <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
