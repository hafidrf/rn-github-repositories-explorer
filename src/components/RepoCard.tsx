import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Card, Chip, Text, IconButton } from 'react-native-paper';
import type { GithubRepo } from '../types';

export default function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <Card mode="outlined" style={styles.card} onPress={() => Linking.openURL(repo.html_url)}>
      <Card.Title
        title={repo.name}
        titleNumberOfLines={2}
        titleStyle={styles.title}
        subtitle={repo.language ? `• ${repo.language}` : undefined}
        right={props => (
          <View style={styles.right}>
            <Chip icon="star" compact style={styles.chip} textStyle={styles.chipText}>
              {String(repo.stargazers_count)}
            </Chip>
            <IconButton icon="open-in-new" {...props} size={18} onPress={() => Linking.openURL(repo.html_url)} />
          </View>
        )}
      />
      <Card.Content>
        <Text variant="bodyMedium" style={styles.desc}>
          {repo.description || 'No description'}
        </Text>
        <View style={styles.metaRow}>
          <Text variant="labelSmall" style={styles.meta}>🍴 {repo.forks_count}</Text>
          <Text variant="labelSmall" style={styles.meta}>• Updated {new Date(repo.updated_at).toLocaleDateString()}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#f3f4f6', borderRadius: 14 },
  title: { fontSize: 15, fontWeight: '700' },
  desc: { color: '#374151', marginBottom: 8 },
  right: { flexDirection: 'row', alignItems: 'center', paddingRight: 4 },
  chip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb' },
  chipText: { fontWeight: '700' as const },
  metaRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  meta: { color: '#6b7280' },
});
