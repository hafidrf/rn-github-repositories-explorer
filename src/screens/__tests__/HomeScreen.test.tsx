import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { configureStore } from '@reduxjs/toolkit';
import HomeScreen from '../HomeScreen';
import searchReducer, { fetchUsers } from '../../store/slices/searchSlice';
import reposReducer from '../../store/slices/reposSlice';

const mockSearchUsers = jest.fn().mockResolvedValue({
  items: [
    { id: 1, login: 'hafidrf', avatar_url: 'https://avatars.githubusercontent.com/u/1' },
    { id: 2, login: 'torvalds', avatar_url: 'https://avatars.githubusercontent.com/u/2' },
  ],
  totalCount: 2,
});
const mockFetchRepos = jest.fn().mockResolvedValue([
  {
    id: 101,
    name: 'awesome-rn',
    html_url: 'https://github.com/hafidrf/awesome-rn',
    description: 'cool',
    stargazers_count: 42,
    language: 'TypeScript',
    forks_count: 3,
    open_issues_count: 1,
    updated_at: new Date().toISOString(),
  },
]);

jest.mock('../../api/github', () => ({
  get searchUsers() {
    return mockSearchUsers;
  },
  get fetchRepos() {
    return mockFetchRepos;
  },
}));

const makeStore = () =>
  configureStore({
    reducer: { search: searchReducer, repos: reposReducer },
  });

describe('HomeScreen integration', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders title and search input', async () => {
    const screen = await render(
      <Provider store={makeStore()}>
        <PaperProvider>
          <HomeScreen />
        </PaperProvider>
      </Provider>,
    );
    expect(screen.getByText('GitHub Repositories Explorer')).toBeTruthy();
    expect(screen.getByTestId('input-query')).toBeTruthy();
    await screen.unmount();
  });

  it('searches and shows users (direct dispatch)', async () => {
    const store = makeStore();
    const screen = await render(
      <Provider store={store}>
        <PaperProvider>
          <HomeScreen />
        </PaperProvider>
      </Provider>,
    );
    await store.dispatch(fetchUsers({ query: 'hafidrf', page: 1 }) as any);
    expect(await screen.findByText('hafidrf')).toBeTruthy();
    expect(await screen.findByText('torvalds')).toBeTruthy();
    await screen.unmount();
  });

  it('expands user to load repos', async () => {
    const store = makeStore();
    const screen = await render(
      <Provider store={store}>
        <PaperProvider>
          <HomeScreen />
        </PaperProvider>
      </Provider>,
    );
    await store.dispatch(fetchUsers({ query: 'hafidrf', page: 1 }) as any);
    await screen.findByText('hafidrf');
    fireEvent.press(screen.getByText('hafidrf'));
    expect(await screen.findByText('awesome-rn')).toBeTruthy();
    await screen.unmount();
  });
});
