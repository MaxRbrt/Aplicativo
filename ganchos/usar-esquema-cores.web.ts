import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export function useEsquemaCores() {
  const [hidratado, setHidratado] = useState(false);

  useEffect(() => {
    setHidratado(true);
  }, []);

  const esquemaCores = useRNColorScheme();

  return hidratado ? esquemaCores : 'light';
}
