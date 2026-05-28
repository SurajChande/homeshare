import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/lib/theme';

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message?: string;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
  },
  message: {
    marginTop: theme.spacing.sm,
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
