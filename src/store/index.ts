import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './slices/searchSlice';
import reposReducer from './slices/reposSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    repos: reposReducer,
  },
  middleware: getDefault => getDefault({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
