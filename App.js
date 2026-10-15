import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import RootDrawer from './navigation/RootDrawer';
import { CartProvider } from './context/CartContext';
import { api } from './lib/api';
import { setTokens } from './lib/tokenStore';
import { paperTheme } from './theme';

export default function App() {
  const [ready, setReady] = useState(false);

  // TEMPORARY: sign in automatically until the real login screen exists (Module 7).
  useEffect(() => {
    api
      .post('/auth/login', { email: 'trainee@shopfront.test', password: 'Passw0rd!' })
      .then((response) => setTokens(response.data.data))
      .catch((error) => console.log('Dev sign-in failed:', error.message))
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      <CartProvider>
        <NavigationContainer>
          <RootDrawer />
        </NavigationContainer>
      </CartProvider>
    </PaperProvider>
  );
}