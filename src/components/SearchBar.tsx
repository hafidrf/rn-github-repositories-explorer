import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { palette, radius, shadow } from '../theme/tokens';

interface Props {
  initialValue?: string;
  loading?: boolean;
  onSearch: (query: string) => void;
}

export default function SearchBar({ initialValue = '', loading, onSearch }: Props) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);

  const submit = useCallback(() => {
    const q = value.trim();
    if (!q) {
      setTouched(true);
      return;
    }
    onSearch(q);
  }, [value, onSearch]);

  const hasError = touched && value.trim().length === 0;

  return (
    <View style={styles.wrap} testID="search-bar">
      <View style={[styles.inputCard, hasError && styles.inputCardError]}>
        <TextInput
          mode="flat"
          placeholder="Search GitHub username..."
          placeholderTextColor={palette.textFaint}
          value={value}
          onChangeText={t => {
            setValue(t);
            if (touched) setTouched(false);
          }}
          onSubmitEditing={submit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          left={<TextInput.Icon icon="magnify" color={palette.textFaint} size={20} testID="search-icon" />}
          right={
            value.length ? (
              <TextInput.Icon
                icon="close-circle"
                color={palette.textFaint}
                size={18}
                onPress={() => setValue('')}
                testID="clear-btn"
                forceTextInputFocus={false}
              />
            ) : undefined
          }
          underlineColor="transparent"
          activeUnderlineColor="transparent"
          style={styles.input}
          contentStyle={styles.inputContent}
          testID="input-query"
        />
      </View>
      {hasError ? (
        <HelperText type="error" visible style={styles.helper}>
          Username is required
        </HelperText>
      ) : null}
      <Button
        mode="contained"
        onPress={submit}
        loading={!!loading}
        disabled={!!loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        buttonColor={palette.primary}
        textColor="#fff"
        icon={loading ? undefined : 'arrow-right'}
        testID="btn-search"
      >
        {loading ? 'Searching…' : 'Search'}
      </Button>
      <View style={styles.hintRow}>
        <HelperText type="info" visible style={styles.hint}>
          Try “hafidrf” or “torvalds”
        </HelperText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', gap: 10 },
  inputCard: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
    ...shadow.soft,
  },
  inputCardError: { borderColor: '#fecaca', backgroundColor: '#fff' },
  input: {
    backgroundColor: 'transparent',
    minHeight: 52,
  },
  inputContent: {
    paddingVertical: Platform.select({ ios: 14, android: 10 }),
    fontSize: 15,
    color: palette.text,
  },
  helper: { paddingHorizontal: 4, fontSize: 12, marginTop: -2 },
  hint: { paddingHorizontal: 4, fontSize: 11, color: palette.textFaint },
  hintRow: { marginTop: -6 },
  button: {
    borderRadius: radius.pill,
    marginTop: 2,
    ...shadow.soft,
  },
  buttonContent: { paddingVertical: 8, flexDirection: 'row-reverse' as const },
  buttonLabel: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 0.2 },
});
