import { StyleSheet, Text } from 'react-native';
import { burnCpu } from '../lib/burnCpu';
import { renderLog } from '../lib/renderLog';
import { colors, spacing } from '../theme';

// Pretend this does something heavy, like grouping and scoring every item.
const SUMMARY_WORK_MS = 40;

export const summaryStats = { computeCount: 0 };

function summarise(items) {
  summaryStats.computeCount += 1;
  burnCpu(SUMMARY_WORK_MS);
  const done = items.filter((item) => item.done).length;
  return `${done} of ${items.length} done`;
}

export default function ListSummary({ items }) {
  renderLog('ListSummary');
  const text = summarise(items);
  return <Text style={styles.text}>{text}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: colors.muted,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
});