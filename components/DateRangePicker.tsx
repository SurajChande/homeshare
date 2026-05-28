import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { theme } from '@/lib/theme';
import { toDateString } from '@/lib/utils';

interface Props {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export function DateRangePicker({ startDate, endDate, onChange }: Props) {
  const [mode, setMode] = useState<'start' | 'end' | null>(null);
  const start = new Date(startDate);
  const end = new Date(endDate);

  const showPicker = (which: 'start' | 'end') => setMode(which);

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.row} onPress={() => showPicker('start')}>
        <Text style={styles.label}>Start</Text>
        <Text style={styles.value}>{startDate}</Text>
      </Pressable>
      <Pressable style={styles.row} onPress={() => showPicker('end')}>
        <Text style={styles.label}>End</Text>
        <Text style={styles.value}>{endDate}</Text>
      </Pressable>
      {mode && (
        <DateTimePicker
          value={mode === 'start' ? start : end}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minimumDate={mode === 'end' ? start : new Date()}
          onChange={(_, date) => {
            if (!date) {
              setMode(null);
              return;
            }
            if (mode === 'start') {
              const next = toDateString(date);
              onChange(next, endDate < next ? next : endDate);
            } else {
              onChange(startDate, toDateString(date));
            }
            if (Platform.OS !== 'ios') setMode(null);
          }}
        />
      )}
      {Platform.OS === 'ios' && mode ? (
        <Pressable onPress={() => setMode(null)}>
          <Text style={styles.done}>Done</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: theme.spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },
  value: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  done: {
    textAlign: 'center',
    color: theme.colors.primary,
    fontWeight: '600',
    padding: theme.spacing.sm,
  },
});
