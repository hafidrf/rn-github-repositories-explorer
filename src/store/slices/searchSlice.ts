import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { searchUsers } from '../../api/github';
import type { AsyncStatus, GithubUser } from '../../types';

interface SearchState {
  query: string;
  page: number;
  users: GithubUser[];
  totalCount: number;
  status: AsyncStatus;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  page: 1,
  users: [],
  totalCount: 0,
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'search/fetchUsers',
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      const data = await searchUsers(query, page);
      return data;
    } catch (e: any) {
      return rejectWithValue(e.message ?? 'Unknown error');
    }
  },
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    clearSearch(state) {
      state.users = [];
      state.totalCount = 0;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.items;
        state.totalCount = action.payload.totalCount;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) || 'Failed to search users';
      });
  },
});

export const { setQuery, setPage, clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
