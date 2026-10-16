import { useState } from 'react';
import { FlatList, Linking, RefreshControl, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Checkbox,
  Divider,
  IconButton,
  List,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import ErrorState from '../components/ErrorState';
import OfflineBanner from '../components/OfflineBanner';
import useShoppingList from '../hooks/useShoppingList';
import useLocationTags from '../hooks/useLocationTags';
import { formatCoords } from '../utils/format';
import { colors, spacing } from '../theme';

export default function ShoppingListScreen() {
  const { items, status, error, refreshing, reload, refresh, add, toggle, remove } =
    useShoppingList();
  const { tags, tagItem, clearTag } = useLocationTags();
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [needsSettings, setNeedsSettings] = useState(false);

  // Shows a failure in the Snackbar. A failed tick or delete never keeps an old Settings button.
  const report = (result) => {
    setNeedsSettings(false);
    if (!result.ok) {
      setMessage(result.message);
    }
  };

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (trimmed === '') {
      return;
    }
    const result = await add(trimmed);
    if (result.ok) {
      setName('');
    }
    report(result);
  };

  const handleTag = async (item) => {
    if (tags[item.id]) {
      clearTag(item.id);
      return;
    }
    const result = await tagItem(item.id);
    if (!result.ok) {
      setNeedsSettings(result.needsSettings);
      setMessage(result.message);
    }
  };

  const handleRefresh = async () => {
    const worked = await refresh();
    if (!worked) {
      setMessage('Could not refresh. Showing your list from earlier.');
    }
  };

  let emptyComponent = <Text style={styles.empty}>Your list is empty. Add something above.</Text>;
  if (status === 'loading') {
    emptyComponent = <ActivityIndicator style={styles.spinner} />;
  } else if (status === 'error') {
    emptyComponent = <ErrorState message={error} onRetry={reload} />;
  }

  return (
    <View style={styles.screen}>
      <OfflineBanner />
      <View style={styles.addRow}>
        <TextInput
          mode="outlined"
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Add an item"
          onSubmitEditing={handleAdd}
          returnKeyType="done"
        />
        <Button mode="contained" onPress={handleAdd}>
          Add
        </Button>
      </View>

      <FlatList
        data={items}
        extraData={tags}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={Divider}
        ListEmptyComponent={emptyComponent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        renderItem={({ item }) => {
          const tag = tags[item.id];
          return (
            <List.Item
              title={item.name}
              titleStyle={item.done ? styles.done : undefined}
              description={tag ? `Tagged at ${formatCoords(tag)}` : undefined}
              left={() => (
                <Checkbox
                  status={item.done ? 'checked' : 'unchecked'}
                  onPress={async () => report(await toggle(item))}
                />
              )}
              right={() => (
                <View style={styles.actions}>
                  <IconButton
                    icon={tag ? 'map-marker-check' : 'map-marker-plus-outline'}
                    iconColor={tag ? colors.primary : colors.muted}
                    accessibilityLabel={
                      tag ? `Remove location tag from ${item.name}` : `Tag ${item.name} with my location`
                    }
                    onPress={() => handleTag(item)}
                  />
                  <IconButton
                    icon="delete-outline"
                    accessibilityLabel={`Remove ${item.name}`}
                    onPress={async () => report(await remove(item))}
                  />
                </View>
              )}
            />
          );
        }}
      />

      <Snackbar
        visible={message !== ''}
        onDismiss={() => setMessage('')}
        duration={3000}
        action={needsSettings ? { label: 'Settings', onPress: () => Linking.openSettings() } : undefined}
      >
        {message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
  },
  input: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  done: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  empty: {
    textAlign: 'center',
    color: colors.muted,
    marginTop: spacing.xl,
  },
  spinner: {
    marginTop: spacing.xl,
  },
});
