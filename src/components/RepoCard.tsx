import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Card, Chip, Icon, Text } from 'react-native-paper';
import type { GithubRepo } from '../types';
import { palette, radius, shadow } from '../theme/tokens';

function timeAgo(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return d.toLocaleDateString();
}

export default function RepoCard({ repo }: { repo: GithubRepo }) {
  return (
    <Card
      mode="contained"
      style={styles.card}
      contentStyle={styles.cardContent}
      onPress={() => Linking.openURL(repo.html_url)}
      testID={`repo-${repo.id}`}
    >
      <View style={styles.topRow}>
        <View style={styles.titleWrap}>
          <Text variant="titleSmall" numberOfLines={2} style={styles.title}>
            {repo.name}
          </Text>
          {repo.language ? (
            <View style={styles.langRow}>
              <View style={[styles.dot, { backgroundColor: langColor(repo.language) }]} />
              <Text variant="labelSmall" style={styles.lang}>
                {repo.language}
              </Text>
            </View>
          ) : null}
        </View>
        <Chip
          icon={() => <Icon source="star" size={14} color={palette.star} />}
          compact
          elevated
          style={styles.starChip}
          textStyle={styles.starText}
          onPress={() => Linking.openURL(`${repo.html_url}/stargazers`)}
        >
          {formatCount(repo.stargazers_count)}
        </Chip>
      </View>

      <Text variant="bodySmall" numberOfLines={3} style={styles.desc}>
        {repo.description?.trim() || 'No description'}
      </Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon source="source-fork" size={14} color={palette.textFaint} />
          <Text variant="labelSmall" style={styles.meta}>
            {repo.forks_count}
          </Text>
        </View>
        <View style={styles.metaItem}>
          <Icon source="alert-circle-outline" size={14} color={palette.textFaint} />
          <Text variant="labelSmall" style={styles.meta}>
            {repo.open_issues_count}
          </Text>
        </View>
        <Text variant="labelSmall" style={styles.metaFaint}>
          Updated {timeAgo(repo.updated_at)}
        </Text>
        <View style={styles.openBtn}>
          <Icon source="open-in-new" size={14} color={palette.primary} />
        </View>
      </View>
    </Card>
  );
}

function langColor(lang: string) {
  const map: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    Python: '#3572A5',
    Kotlin: '#A97BFF',
    Swift: '#ffac45',
    Go: '#00ADD8',
    Rust: '#dea584',
    Java: '#b07219',
    Dart: '#00B4AB',
  };
  return map[lang] ?? palette.borderStrong;
}

function formatCount(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return String(n);
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardContent: { padding: 14 },
  topRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  titleWrap: { flex: 1, gap: 4 },
  title: { color: palette.text, fontWeight: '700' as const, lineHeight: 18 },
  langRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  lang: { color: palette.textMuted, fontWeight: '600' as const, fontSize: 11 },
  starChip: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
    borderWidth: 1,
    height: 28,
  },
  starText: { color: '#92400e', fontWeight: '700' as const, fontSize: 12, marginVertical: 0 },
  desc: { color: palette.textMuted, lineHeight: 18, marginBottom: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' as const },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { color: palette.textMuted, fontWeight: '600' as const },
  metaFaint: { color: palette.textFaint, marginLeft: 'auto' as any },
  openBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
});
