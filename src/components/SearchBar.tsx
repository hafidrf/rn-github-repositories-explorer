import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, HelperText } from 'react-native-paper';

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
    <View style={styles.wrap}>
      <TextInput
        mode="outlined"
        placeholder="Enter username"
        value={value}
        onChangeText={t => {
          setValue(t);
          if (touched) setTouched(false);
        }}
        onSubmitEditing={submit}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
        outlineStyle={styles.inputOutline}
        testID="input-query"
      />
      {hasError ? <HelperText type="error" visible>Username is required</HelperText> : null}
      <Button
        mode="contained"
        onPress={submit}
        loading={!!loading}
        disabled={!!loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
        testID="btn-search"
      >
        SEARCH
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  input: { backgroundColor: '#fff' },
  inputOutline: { borderRadius: 12 },
  button: { marginTop: 10, borderRadius: 12, backgroundColor: '#b91c1c' },
  buttonContent: { paddingVertical: 6 },
});
