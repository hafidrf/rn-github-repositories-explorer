import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchRepos } from '../../api/github';
import type { AsyncStatus, GithubRepo } from '../../types';

interface ReposState {
  byUser: Record<string, GithubRepo[]>;
  statusByUser: Record<string, AsyncStatus>;
  errorByUser: Record<string, string | null>;
  expandedUser: string | null;
}

const initialState: ReposState = {
  byUser: {},
  statusByUser: {},
  errorByUser: {},
  expandedUser: null,
};

export const fetchReposByUser = createAsyncThunk(
  'repos/fetchByUser',
  async (username: string, { rejectWithValue }) => {
    try {
      const repos = await fetchRepos(username);
      return { username, repos };
    } catch (e: any) {
      return rejectWithValue({ username, message: e.message ?? 'Unknown error' });
    }
  },
);

const reposSlice = createSlice({
  name: 'repos',
  initialState,
  reducers: {
    toggleExpand(state, action) {
      const u = action.payload as string;
      state.expandedUser = state.expandedUser === u ? null : u;
    },
    collapseAll(state) {
      state.expandedUser = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchReposByUser.pending, (state, action) => {
        const u = action.meta.arg;
        state.statusByUser[u] = 'loading';
        state.errorByUser[u] = null;
      })
      .addCase(fetchReposByUser.fulfilled, (state, action) => {
        const { username, repos } = action.payload as { username: string; repos: GithubRepo[] };
        state.byUser[username] = repos;
        state.statusByUser[username] = 'succeeded';
      })
      .addCase(fetchReposByUser.rejected, (state, action) => {
        const payload: any = action.payload;
        const u: string = payload?.username ?? (action.meta.arg as string);
        state.statusByUser[u] = 'failed';
        state.errorByUser[u] = payload?.message ?? 'Failed to load repos';
      });
  },
});

export const { toggleExpand, collapseAll } = reposSlice.actions;
export default reposSlice.reducer;
