import React, { useCallback, useMemo } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { Appbar, Card, Chip, Divider, Text, ActivityIndicator, Button, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, setPage, setQuery } from '../store/slices/searchSlice';
import SearchBar from '../components/SearchBar';
import UserAccordion from '../components/UserAccordion';
import { PER_PAGE } from '../constants';
import { contentMaxWidth, horizontalPadding, palette, radius, shadow } from '../theme/tokens';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const { query, page, users, totalCount, status, error } = useAppSelector(s => s.search);

  const onSearch = useCallback((q: string) => {
    dispatch(setQuery(q));
    dispatch(setPage(1));
    dispatch(fetchUsers({ query: q, page: 1 }));
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    if (!query) return;
    dispatch(fetchUsers({ query, page }));
  }, [dispatch, query, page]);

  const canPrev = page > 1;
  const canNext = users.length === PER_PAGE && page * PER_PAGE < Math.min(totalCount, 1000);

  const goPage = useCallback(
    (next: number) => {
      dispatch(setPage(next));
      dispatch(fetchUsers({ query, page: next }));
    },
    [dispatch, query],
  );

  const header = useMemo(
    () => (
      <View style={[styles.headerWrap, isWide && styles.headerWrapWide]}>
        {/* Hero */}
        <View style={[styles.hero, isWide && styles.heroWide]}>
          <View style={styles.heroText}>
            <View style={styles.badge}>
              <Text variant="labelSmall" style={styles.badgeText}>
                Bare React Native • Redux Toolkit
              </Text>
            </View>
            <Text variant="headlineSmall" style={styles.appTitle}>
              GitHub Repositories
              <Text style={styles.appTitleAccent}> Explorer</Text>
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Search any GitHub username and explore public repositories — fast, native, delightful.
            </Text>
            <View style={styles.heroMeta}>
              <Chip icon="github" compact style={styles.metaChip} textStyle={styles.metaChipText}>
                GitHub API
              </Chip>
              <Chip icon="lightning-bolt" compact style={styles.metaChip} textStyle={styles.metaChipText}>
                Fast
              </Chip>
              <Chip icon="cellphone" compact style={styles.metaChip} textStyle={styles.metaChipText}>
                Native
              </Chip>
            </View>
          </View>
          <View style={styles.lottieWrap}>
            <View style={styles.lottieCard}>
              <LottieView
                source={require('../../assets/lottie/animation.json')}
                autoPlay
                loop
                style={styles.lottie}
              />
            </View>
          </View>
        </View>

        {/* Search */}
        <Surface style={styles.searchSurface} elevation={1}>
          <SearchBar loading={status === 'loading'} onSearch={onSearch} />
        </Surface>

        {/* Results meta */}
        {query ? (
          <View style={styles.resultRow}>
            <Text variant="bodySmall" style={styles.resultCopy}>
              Showing
              <Text style={styles.resultStrong}> {users.length ? `${users.length} of ` : ''}</Text>
              users for
              <Text style={styles.resultStrong}> ‘{query}’</Text>
              {totalCount ? <Text style={styles.resultMuted}> • {totalCount} results</Text> : null}
            </Text>
            {status === 'loading' ? <ActivityIndicator size="small" color={palette.primary} /> : null}
          </View>
        ) : null}

        {status === 'failed' && error ? (
          <Card mode="outlined" style={styles.errorCard}>
            <Card.Content>
              <Text variant="labelLarge" style={styles.errorTitle}>
                Something went wrong
              </Text>
              <Text variant="bodySmall" style={styles.errorText}>
                {String(error).slice(0, 420)}
              </Text>
            </Card.Content>
          </Card>
        ) : null}
      </View>
    ),
    [onSearch, query, totalCount, status, error, users.length, isWide],
  );

  const empty = useMemo(() => {
    if (status === 'loading')
      return (
        <View style={styles.center}>
          <ActivityIndicator animating color={palette.primary} />
          <Text variant="bodySmall" style={styles.emptySub}>
            Searching GitHub…
          </Text>
        </View>
      );
    if (!query)
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text variant="titleSmall" style={styles.emptyTitle}>
            Start exploring
          </Text>
          <Text variant="bodySmall" style={styles.emptyText}>
            Try “hafidrf”, “torvalds”, or any GitHub username.
          </Text>
        </View>
      );
    if (status === 'succeeded' && users.length === 0)
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🫥</Text>
          <Text variant="titleSmall" style={styles.emptyTitle}>
            No users found
          </Text>
          <Text variant="bodySmall" style={styles.emptyText}>
            Check the spelling or try another username.
          </Text>
        </View>
      );
    return null;
  }, [status, query, users.length]);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <Appbar.Header style={styles.appbar} elevated={false}>
        <Appbar.Content title="Explorer" titleStyle={styles.appbarTitle} />
        <Appbar.Action icon="github" onPress={() => {}} accessibilityLabel="GitHub" />
      </Appbar.Header>

      <View style={styles.contentClip}>
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          ListHeaderComponent={header}
          ListEmptyComponent={empty as any}
          renderItem={({ item }) => <UserAccordion login={item.login} avatarUrl={item.avatar_url} />}
          contentContainerStyle={[styles.listContent, isWide && styles.listContentWide]}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={onRefresh} tintColor={palette.primary} colors={[palette.primary]} />}
          ListFooterComponent={
            users.length ? (
              <View style={styles.pager}>
                <Button
                  mode="outlined"
                  disabled={!canPrev}
                  onPress={() => goPage(page - 1)}
                  style={styles.pagerBtn}
                  textColor={canPrev ? palette.text : palette.textFaint}
                >
                  Prev
                </Button>
                <View style={styles.pagePill}>
                  <Text variant="labelLarge" style={styles.pageLabel}>
                    Page {page}
                  </Text>
                  {totalCount ? (
                    <Text variant="labelSmall" style={styles.pageSub}>
                      of {Math.min(Math.ceil(Math.min(totalCount, 1000) / PER_PAGE), 100)}
                    </Text>
                  ) : null}
                </View>
                <Button
                  mode="contained"
                  disabled={!canNext}
                  onPress={() => goPage(page + 1)}
                  style={styles.pagerBtnPrimary}
                  buttonColor={canNext ? palette.primary : palette.surface2}
                  textColor={canNext ? '#fff' : palette.textFaint}
                >
                  Next
                </Button>
              </View>
            ) : null
          }
        />
      </View>

      <View style={styles.footer}>
        <Text variant="labelSmall" style={styles.footerText}>
          Built with React Native + Redux Toolkit • GitHub API • 29 tests
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.bg },
  appbar: { backgroundColor: palette.surface, elevation: 0, borderBottomWidth: 1, borderBottomColor: palette.border },
  appbarTitle: { fontWeight: '800' as const, color: palette.text, letterSpacing: -0.3 },
  contentClip: { flex: 1, alignItems: 'center' as const },
  headerWrap: {
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center' as const,
    paddingHorizontal: horizontalPadding,
    paddingTop: 8,
    paddingBottom: 12,
    gap: 14,
  },
  headerWrapWide: { paddingHorizontal: 24, paddingTop: 16 },
  hero: { gap: 16 },
  heroWide: { flexDirection: 'row' as const, alignItems: 'center' as const, gap: 20 },
  heroText: { flex: 1, gap: 10 },
  badge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: palette.primarySoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  badgeText: { color: palette.primary, fontWeight: '700' as const, fontSize: 11, letterSpacing: 0.2 },
  appTitle: { color: palette.text, fontWeight: '800' as const, letterSpacing: -0.5, lineHeight: 30 },
  appTitleAccent: { color: palette.primary },
  subtitle: { color: palette.textMuted, lineHeight: 20, maxWidth: 480 },
  heroMeta: { flexDirection: 'row' as const, gap: 8, flexWrap: 'wrap' as const },
  metaChip: { backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, height: 28 },
  metaChipText: { fontSize: 11, color: palette.textMuted, marginVertical: 0 },
  lottieWrap: { alignItems: 'center' as const, justifyContent: 'center' as const },
  lottieCard: {
    width: 160,
    height: 160,
    borderRadius: 22,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.soft,
  },
  lottie: { width: 150, height: 150 },
  searchSurface: {
    width: '100%',
    maxWidth: contentMaxWidth,
    alignSelf: 'center' as const,
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.soft,
  },
  resultRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: 12,
    paddingHorizontal: 2,
  },
  resultCopy: { color: palette.textMuted, flex: 1 },
  resultStrong: { color: palette.text, fontWeight: '700' as const },
  resultMuted: { color: palette.textFaint },
  errorCard: { backgroundColor: '#fef2f2', borderColor: '#fecaca', borderRadius: radius.lg },
  errorTitle: { color: '#7f1d1d', fontWeight: '700' as const, marginBottom: 4 },
  errorText: { color: '#991b1b', lineHeight: 18 },
  center: { paddingVertical: 28, alignItems: 'center' as const, gap: 10 },
  emptySub: { color: palette.textMuted },
  emptyCard: {
    marginHorizontal: horizontalPadding,
    backgroundColor: palette.surface,
    borderRadius: radius.xl,
    padding: 24,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: palette.border,
    ...shadow.card,
  },
  emptyEmoji: { fontSize: 28, marginBottom: 6 },
  emptyTitle: { color: palette.text, fontWeight: '700' as const, marginBottom: 4 },
  emptyText: { color: palette.textMuted, textAlign: 'center' as const, lineHeight: 18 },
  listContent: { paddingHorizontal: horizontalPadding, paddingBottom: 24, gap: 0, width: '100%', maxWidth: contentMaxWidth, alignSelf: 'center' as const },
  listContentWide: { paddingHorizontal: 24 },
  pager: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginTop: 16,
    gap: 12,
  },
  pagerBtn: { borderRadius: radius.pill, borderColor: palette.border, minWidth: 86 },
  pagerBtnPrimary: { borderRadius: radius.pill, minWidth: 86 },
  pagePill: {
    flexDirection: 'row' as const,
    alignItems: 'baseline' as const,
    gap: 6,
    backgroundColor: palette.surface,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.border,
  },
  pageLabel: { color: palette.text, fontWeight: '700' as const },
  pageSub: { color: palette.textFaint },
  footer: { paddingVertical: 10, alignItems: 'center' as const, borderTopWidth: 1, borderTopColor: palette.border, backgroundColor: palette.surface },
  footerText: { color: palette.textFaint, fontSize: 11 },
});
