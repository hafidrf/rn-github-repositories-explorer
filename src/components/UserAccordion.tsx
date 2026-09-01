import React, { useCallback } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, List, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReposByUser, toggleExpand } from '../store/slices/reposSlice';
import RepoCard from './RepoCard';

export default function UserAccordion({ login, avatarUrl }: { login: string; avatarUrl: string }) {
  const dispatch = useAppDispatch();
  const expanded = useAppSelector(s => s.repos.expandedUser === login);
  const repos = useAppSelector(s => s.repos.byUser[login] ?? []);
  const status = useAppSelector(s => s.repos.statusByUser[login] ?? 'idle');
  const error = useAppSelector(s => s.repos.errorByUser[login]);

  const onPress = useCallback(() => {
    const willExpand = !expanded;
    dispatch(toggleExpand(login));
    if (willExpand && status === 'idle') {
      dispatch(fetchReposByUser(login));
    }
  }, [dispatch, login, expanded, status]);

  return (
    <List.Accordion
      title={login}
      description={expanded && repos.length ? `${repos.length} repositories` : 'Tap to view repositories'}
      left={() => <Image source={{ uri: avatarUrl }} style={styles.avatar} />}
      expanded={expanded}
      onPress={onPress}
      style={styles.accordion}
      titleStyle={styles.title}
      id={`accordion-${login}`}
    >
      <View style={styles.body}>
        {status === 'loading' ? (
          <View style={styles.center}><ActivityIndicator /></View>
        ) : status === 'failed' ? (
          <Text style={styles.error}>{error ?? 'Failed to load repos'}</Text>
        ) : repos.length === 0 ? (
          <Text style={styles.empty}>No repositories</Text>
        ) : (
          <View style={styles.repoList}>
            {repos.map(r => (
              <RepoCard key={String(r.id)} repo={r} />
            ))}
          </View>
        )}
        <Divider style={styles.divider} />
        <Button mode="text" icon="github" onPress={() => Linking.openURL(`https://github.com/${login}?tab=repositories`)}>
          Go to profile {login}
        </Button>
      </View>
    </List.Accordion>
  );
}

const styles = StyleSheet.create({
  accordion: { backgroundColor: '#fff', borderRadius: 12, marginBottom: 8 },
  title: { fontWeight: '700' as const },
  avatar: { width: 36, height: 36, borderRadius: 18, marginLeft: 8, backgroundColor: '#e5e7eb' },
  body: { paddingHorizontal: 12, paddingBottom: 12, backgroundColor: '#fff', borderBottomLeftRadius: 12, borderBottomRightRadius: 12 },
  center: { paddingVertical: 16, alignItems: 'center' },
  error: { color: '#b91c1c', textAlign: 'center', paddingVertical: 12 },
  empty: { textAlign: 'center', color: '#6b7280', paddingVertical: 12 },
  repoList: { gap: 10 as any },
  divider: { marginTop: 12 },
});
