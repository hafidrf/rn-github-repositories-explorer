# rn-github-repositories-explorer 🚀

React Native (Bare) revamp of [hafidrf/github-repositories-explorer](https://github.com/hafidrf/github-repositories-explorer) — now with **Redux Toolkit**.

Search GitHub users and browse their public repositories, natively on Android & iOS.

## Features
- Search GitHub users via \GET /search/users\
- Expand any user to load repos via \GET /users/{username}/repos\
- Pagination (PER_PAGE = 5), pull-to-refresh, avatar
- Redux Toolkit (createAsyncThunk + slices), typed hooks
- React Native Paper UI + Lottie animation (ported from web)
- Deep link to GitHub profile / repo

## Tech Stack
- React Native 0.81 (Bare) + TypeScript
- Redux Toolkit + React Redux
- React Native Paper, Safe Area, Gesture Handler, Screens
- Lottie React Native

## Getting Started
```bash
npm install
# Android
npm run android
# iOS
npm run ios
```

No API token required for public search (rate-limited). For higher limits, patch \src/api/github.ts\ headers.

## Project Structure
```
src/
  api/github.ts          # GitHub REST calls
  store/                 # Redux store + slices
  components/            # SearchBar, UserAccordion, RepoCard
  screens/HomeScreen.tsx # Main screen
  theme/                 # Paper theme
  types/                 # Shared types
assets/lottie/           # animation.json
```

## Original Web App
https://github-repositories-explorer-two-sepia.vercel.app/
