import React, { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Appbar, Card, Divider, Text, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUsers, setPage, setQuery } from '../store/slices/searchSlice';
import SearchBar from '../components/SearchBar';
import UserAccordion from '../components/UserAccordion';
import { PER_PAGE } from '../constants';

export default function HomeScreen() {
  const dispatch = useAppDispatch();
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

  const goPage = useCallback((next: number) => {
    dispatch(setPage(next));
    dispatch(fetchUsers({ query, page: next }));
  }, [dispatch, query]);

  const header = useMemo(() => (
    <View style={styles.headerWrap}>
      <View style={styles.lottieWrap}>
        <LottieView
          source={require('../../assets/lottie/animation.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>
      <Text variant="headlineSmall" style={styles.appTitle}>GitHub Repositories Explorer</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>Search by GitHub username and browse public repositories.</Text>
      <Card mode="elevated" style={styles.searchCard}>
        <Card.Content>
          <SearchBar loading={status === 'loading'} onSearch={onSearch} />
        </Card.Content>
      </Card>
      {query ? (
        <Text variant="bodyMedium" style={styles.resultCopy}>
          Showing users for '{query}' {totalCount ? `• ${totalCount} results` : ''}
        </Text>
      ) : null}
      {status === 'failed' && error ? (
        <Card mode="outlined" style={styles.errorCard}>
          <Card.Content><Text style={styles.errorText}>{String(error).slice(0, 400)}</Text></Card.Content>
        </Card>
      ) : null}
    </View>
  ), [onSearch, query, totalCount, status, error]);

  const empty = useMemo(() => {
    if (status === 'loading') return <View style={styles.center}><ActivityIndicator animating /></View>;
    if (!query) return <Text style={styles.emptyText}>Try searching for a username like "hafidrf" or "torvalds"</Text>;
    if (status === 'succeeded' && users.length === 0) return <Text style={styles.emptyText}>No user found</Text>;
    return null;
  }, [status, query, users.length]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.Content title="Explorer" titleStyle={styles.appbarTitle} />
      </Appbar.Header>
      <FlatList
        data={users}
        keyExtractor={item => String(item.id)}
        ListHeaderComponent={header}
        ListEmptyComponent={empty as any}
        renderItem={({ item }) => <UserAccordion login={item.login} avatarUrl={item.avatar_url} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
        refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={onRefresh} />}
        ListFooterComponent={
          users.length ? (
            <View style={styles.pager}>
              <Button mode="outlined" disabled={!canPrev} onPress={() => goPage(page - 1)}>Prev</Button>
              <Text variant="labelLarge" style={styles.pageLabel}>Page {page}</Text>
              <Button mode="outlined" disabled={!canNext} onPress={() => goPage(page + 1)}>Next</Button>
            </View>
          ) : null
        }
      />
      <Divider />
      <View style={styles.footer}><Text variant="labelSmall" style={styles.footerText}>Built with React Native + Redux Toolkit • GitHub API</Text></View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fafafa' },
  appbar: { backgroundColor: '#ffffff', elevation: 0 },
  appbarTitle: { fontWeight: '800' as const },
  headerWrap: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  lottieWrap: { alignItems: 'center', marginBottom: 8 },
  lottie: { width: 180, height: 180 },
  appTitle: { fontWeight: '800' as const, textAlign: 'center', marginBottom: 4 },
  subtitle: { textAlign: 'center', color: '#6b7280', marginBottom: 14 },
  searchCard: { backgroundColor: '#fff', borderRadius: 16 },
  resultCopy: { textAlign: 'center', color: '#6b7280', marginTop: 14 },
  errorCard: { marginTop: 12, backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  errorText: { color: '#991b1b' },
  center: { paddingVertical: 24, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#6b7280', paddingVertical: 16, paddingHorizontal: 16 },
  listContent: { paddingHorizontal: 16, paddingBottom: 24, gap: 4 as any },
  pager: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 },
  pageLabel: { fontWeight: '700' as const },
  footer: { paddingVertical: 10, alignItems: 'center', backgroundColor: '#fff' },
  footerText: { color: '#9ca3af' },
});
