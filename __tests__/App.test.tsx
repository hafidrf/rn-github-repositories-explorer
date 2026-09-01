import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

jest.mock('../src/api/github', () => ({
  searchUsers: jest.fn().mockResolvedValue({ items: [], totalCount: 0 }),
  fetchRepos: jest.fn().mockResolvedValue([]),
}));

test('renders App correctly', async () => {
  const screen = await render(<App />);
  expect(screen.getByText('GitHub Repositories Explorer')).toBeTruthy();
  await screen.unmount();
});
