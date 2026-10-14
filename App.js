import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import ProductListScreen from './screens/ProductListScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import { paperTheme } from './theme';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar style="dark" />
      {selectedProduct === null ? (
        <ProductListScreen onSelectProduct={setSelectedProduct} />
      ) : (
        <ProductDetailScreen product={selectedProduct} onBack={() => setSelectedProduct(null)} />
      )}
    </PaperProvider>
  );
}
