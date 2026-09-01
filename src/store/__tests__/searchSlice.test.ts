import { configureStore } from '@reduxjs/toolkit';
import searchReducer, { setQuery, setPage, clearSearch, fetchUsers } from '../slices/searchSlice';

jest.mock('../../api/github', () => ({
  searchUsers: jest.fn(),
}));

import { searchUsers } from '../../api/github';

const mockedSearch = searchUsers as jest.MockedFunction<typeof searchUsers>;

describe('searchSlice — reducers', () => {
  it('has correct initial state', () => {
    const s = searchReducer(undefined, { type: '@@INIT' } as any);
    expect(s.query).toBe('');
    expect(s.page).toBe(1);
    expect(s.users).toEqual([]);
    expect(s.status).toBe('idle');
  });

  it('setQuery updates query', () => {
    const s = searchReducer(undefined, setQuery('hafidrf'));
    expect(s.query).toBe('hafidrf');
  });

  it('setPage updates page', () => {
    const s = searchReducer(undefined, setPage(3));
    expect(s.page).toBe(3);
  });

  it('clearSearch resets list and status', () => {
    let s = searchReducer(undefined, setQuery('foo'));
    s = searchReducer(s, { type: 'search/fetchUsers/pending' } as any);
    s = searchReducer(s, clearSearch());
    expect(s.users).toEqual([]);
    expect(s.status).toBe('idle');
    expect(s.error).toBeNull();
  });
});

describe('searchSlice — fetchUsers thunk', () => {
  beforeEach(() => jest.clearAllMocks());

  it('pending → loading', () => {
    const s = searchReducer(undefined, { type: fetchUsers.pending.type, meta: { arg: { query: 'a', page: 1 } } } as any);
    expect(s.status).toBe('loading');
    expect(s.error).toBeNull();
  });

  it('fulfilled → stores users and totalCount', () => {
    const payload = { items: [{ id: 1, login: 'hafidrf' } as any], totalCount: 42 };
    const s = searchReducer(
      { query: 'hafidrf', page: 1, users: [], totalCount: 0, status: 'loading', error: null },
      { type: fetchUsers.fulfilled.type, payload } as any,
    );
    expect(s.status).toBe('succeeded');
    expect(s.users).toHaveLength(1);
    expect(s.totalCount).toBe(42);
  });

  it('rejected → failed with message', () => {
    const s = searchReducer(
      { query: 'x', page: 1, users: [], totalCount: 0, status: 'loading', error: null },
      { type: fetchUsers.rejected.type, payload: 'API limit' } as any,
    );
    expect(s.status).toBe('failed');
    expect(s.error).toBe('API limit');
  });

  it('integration: dispatch fetchUsers resolves via mocked api', async () => {
    mockedSearch.mockResolvedValue({ items: [{ id: 99, login: 'torvalds' } as any], totalCount: 1 });

    const store = configureStore({ reducer: { search: searchReducer } });
    await store.dispatch(fetchUsers({ query: 'torvalds', page: 1 }) as any);

    const st = store.getState().search;
    expect(st.status).toBe('succeeded');
    expect(st.users[0].login).toBe('torvalds');
    expect(mockedSearch).toHaveBeenCalledWith('torvalds', 1);
  });

  it('integration: dispatch fetchUsers rejects and stores error', async () => {
    mockedSearch.mockRejectedValue(new Error('boom'));

    const store = configureStore({ reducer: { search: searchReducer } });
    await store.dispatch(fetchUsers({ query: 'bad', page: 1 }) as any);

    expect(store.getState().search.status).toBe('failed');
    expect(store.getState().search.error).toMatch(/boom/);
  });
});
