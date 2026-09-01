import { configureStore } from '@reduxjs/toolkit';
import reposReducer, { toggleExpand, collapseAll, fetchReposByUser } from '../slices/reposSlice';

jest.mock('../../api/github', () => ({
  fetchRepos: jest.fn(),
}));

import { fetchRepos } from '../../api/github';
const mockedFetch = fetchRepos as jest.MockedFunction<typeof fetchRepos>;

describe('reposSlice — reducers', () => {
  it('initial state', () => {
    const s = reposReducer(undefined, { type: '@@INIT' } as any);
    expect(s.expandedUser).toBeNull();
    expect(s.byUser).toEqual({});
  });

  it('toggleExpand opens and closes same user', () => {
    let s = reposReducer(undefined, toggleExpand('hafidrf'));
    expect(s.expandedUser).toBe('hafidrf');
    s = reposReducer(s, toggleExpand('hafidrf'));
    expect(s.expandedUser).toBeNull();
  });

  it('toggleExpand switches user', () => {
    let s = reposReducer(undefined, toggleExpand('alice'));
    s = reposReducer(s, toggleExpand('bob'));
    expect(s.expandedUser).toBe('bob');
  });

  it('collapseAll', () => {
    let s = reposReducer(undefined, toggleExpand('x'));
    s = reposReducer(s, collapseAll());
    expect(s.expandedUser).toBeNull();
  });

  it('pending sets loading for user', () => {
    const s = reposReducer(undefined, { type: fetchReposByUser.pending.type, meta: { arg: 'hafidrf' } } as any);
    expect(s.statusByUser['hafidrf']).toBe('loading');
  });

  it('fulfilled stores repos', () => {
    const repos = [{ id: 1, name: 'my-repo' } as any];
    const s = reposReducer(undefined, {
      type: fetchReposByUser.fulfilled.type,
      payload: { username: 'hafidrf', repos },
    } as any);
    expect(s.byUser['hafidrf']).toEqual(repos);
    expect(s.statusByUser['hafidrf']).toBe('succeeded');
  });

  it('rejected stores error', () => {
    const s = reposReducer(undefined, {
      type: fetchReposByUser.rejected.type,
      payload: { username: 'hafidrf', message: 'not found' },
      meta: { arg: 'hafidrf' },
    } as any);
    expect(s.statusByUser['hafidrf']).toBe('failed');
    expect(s.errorByUser['hafidrf']).toBe('not found');
  });
});

describe('reposSlice — thunk integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('fetchReposByUser success', async () => {
    mockedFetch.mockResolvedValue([{ id: 10, name: 'rn-app' } as any]);

    const store = configureStore({ reducer: { repos: reposReducer } });
    await store.dispatch(fetchReposByUser('hafidrf') as any);

    expect(store.getState().repos.byUser['hafidrf']).toHaveLength(1);
    expect(mockedFetch).toHaveBeenCalledWith('hafidrf');
  });

  it('fetchReposByUser failure', async () => {
    mockedFetch.mockRejectedValue(new Error('rate limited'));

    const store = configureStore({ reducer: { repos: reposReducer } });
    await store.dispatch(fetchReposByUser('unknown') as any);

    expect(store.getState().repos.statusByUser['unknown']).toBe('failed');
  });
});
