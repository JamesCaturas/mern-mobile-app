import { View, StyleSheet } from 'react-native';
import { SkeletonPulse, SkeletonBlock } from './Skeleton';
import { spacing } from '../theme';

const ROWS = 4;

// Grey placeholder rows in the same shape as the shopping list, so nothing jumps when the data arrives.
export default function ListSkeleton() {
  return (
    <SkeletonPulse accessibilityLabel="Loading your list" style={styles.list}>
      {Array.from({ length: ROWS }, (_, row) => (
        <View key={row} style={styles.row}>
          <SkeletonBlock style={styles.check} />
          <SkeletonBlock style={styles.name} />
        </View>
      ))}
    </SkeletonPulse>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
    padding: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  check: {
    height: 24,
    width: 24,
  },
  name: {
    height: 16,
    flex: 1,
  },
});
