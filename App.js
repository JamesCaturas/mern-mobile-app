import { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  SectionList,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { products, categories } from './data/products';
import { formatPrice } from './utils/format';

function toSections(list) {
  const byCategory = {};
  list.forEach((product) => {
    if (!byCategory[product.category]) {
      byCategory[product.category] = [];
    }
    byCategory[product.category].push(product);
  });
  return Object.keys(byCategory).map((title) => ({ title, data: byCategory[title] }));
}

function ProductRow({ product }) {
  return (
    <View style={styles.row}>
      <Image source={{ uri: product.imageUrl }} style={styles.thumb} />
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>
          Price: <Text style={styles.priceValue}>{formatPrice(product.price)}</Text>
        </Text>
      </View>
    </View>
  );
}

function EmptyList() {
  return <Text style={styles.empty}>No products match your search.</Text>;
}

function Separator() {
  return <View style={styles.separator} />;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [grouped, setGrouped] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesQuery = product.name.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });

  const listProps = {
    keyExtractor: (item) => item.id,
    renderItem: ({ item }) => <ProductRow product={item} />,
    ItemSeparatorComponent: Separator,
    ListEmptyComponent: EmptyList,
    contentContainerStyle: styles.listContent,
    keyboardShouldPersistTaps: 'handled',
    keyboardDismissMode: 'on-drag',
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen}>
        <StatusBar style="dark" />

        <View style={styles.top}>
          <View style={styles.header}>
            <Image source={require('./assets/icon.png')} style={styles.logo} />
            <View>
              <Text style={styles.title}>Shopfront</Text>
              <Text style={styles.subtitle}>Product catalog</Text>
            </View>
          </View>

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search products"
            placeholderTextColor="#999999"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            clearButtonMode="while-editing"
            style={styles.searchInput}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.chipScroll}
            contentContainerStyle={styles.chips}
          >
            {categories.map((category) => {
              const selected = category === selectedCategory;
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[styles.chip, selected && styles.chipSelected]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>{visibleProducts.length} products</Text>
            <Pressable onPress={() => setGrouped((value) => !value)}>
              <Text style={styles.toggleText}>
                {grouped ? 'Show flat list' : 'Group by category'}
              </Text>
            </Pressable>
          </View>
        </View>

        {grouped ? (
          <SectionList
            {...listProps}
            sections={toSections(visibleProducts)}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionHeader}>{section.title}</Text>
            )}
          />
        ) : (
          <FlatList {...listProps} data={visibleProducts} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  top: {
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#666666',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chips: {
    paddingVertical: 12,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1e6fd9',
    backgroundColor: '#ffffff',
  },
  chipSelected: {
    backgroundColor: '#1e6fd9',
  },
  chipText: {
    color: '#1e6fd9',
    fontWeight: '600',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  resultsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
  },
  resultsText: {
    color: '#666666',
  },
  toggleText: {
    color: '#1e6fd9',
    fontWeight: '600',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  thumb: {
    width: 96,
    height: 96,
    borderRadius: 8,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  category: {
    color: '#888888',
    marginTop: 2,
  },
  price: {
    marginTop: 8,
  },
  priceValue: {
    fontWeight: '700',
    color: '#0a7d3b',
  },
  separator: {
    height: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#888888',
    marginTop: 32,
  },
});