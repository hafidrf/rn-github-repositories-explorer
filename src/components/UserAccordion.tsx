import React, { useCallback } from 'react';
import { Image, Linking, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Divider, List, Text } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchReposByUser, toggleExpand } from '../store/slices/reposSlice';
import RepoCard from './RepoCard';
import { palette, radius, shadow } from '../theme/tokens';

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
    <View style={[styles.shell, expanded && styles.shellExpanded]}>
      <List.Accordion
        title={login}
        titleStyle={styles.title}
        description={expanded && repos.length ? `${repos.length} repositories` : 'Tap to view repositories'}
        descriptionStyle={styles.desc}
        descriptionNumberOfLines={1}
        left={() => (
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          </View>
        )}
        expanded={expanded}
        onPress={onPress}
        style={styles.accordion}
        theme={{ colors: { background: 'transparent' } }}
        id={`accordion-${login}`}
      >
        <View style={styles.body}>
          {status === 'loading' ? (
            <View style={styles.center}>
              <ActivityIndicator size="small" color={palette.primary} />
              <Text variant="labelMedium" style={styles.loadingText}>
                Loading repositories…
              </Text>
            </View>
          ) : status === 'failed' ? (
            <View style={styles.alert}>
              <Text variant="bodySmall" style={styles.error}>
                {error ?? 'Failed to load repos'}
              </Text>
              <Button
                mode="outlined"
                compact
                style={styles.retryBtn}
                onPress={() => dispatch(fetchReposByUser(login))}
              >
                Retry
              </Button>
            </View>
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
          <Button
            mode="contained-tonal"
            icon="github"
            buttonColor={palette.surface2}
            textColor={palette.text}
            style={styles.profileBtn}
            onPress={() => Linking.openURL(`https://github.com/${login}?tab=repositories`)}
          >
            Open @{login} on GitHub
          </Button>
        </View>
      </List.Accordion>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  shellExpanded: {
    borderColor: palette.borderStrong,
    ...shadow.soft,
  },
  accordion: {
    backgroundColor: 'transparent',
    paddingRight: 4,
  },
  title: { fontWeight: '700' as const, color: palette.text, fontSize: 15 },
  desc: { color: palette.textMuted, fontSize: 12, marginTop: 1 },
  avatarWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 4,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
  },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: palette.surface2 },
  body: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 14,
    gap: 0,
  },
  center: { paddingVertical: 24, alignItems: 'center', gap: 10 },
  loadingText: { color: palette.textMuted },
  alert: {
    backgroundColor: '#fef2f2',
    borderRadius: radius.md,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  error: { color: '#991b1b', textAlign: 'center' },
  retryBtn: { borderColor: palette.primary, borderRadius: radius.pill },
  empty: { textAlign: 'center', color: palette.textMuted, paddingVertical: 18 },
  repoList: { gap: 10 as any },
  divider: { marginTop: 14, backgroundColor: palette.border, opacity: 0.7 },
  profileBtn: { marginTop: 12, borderRadius: radius.pill },
});
