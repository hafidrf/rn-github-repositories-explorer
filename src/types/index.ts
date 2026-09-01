export interface GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  html_url: string;
  type: string;
  score: number;
}

export interface GithubRepo {
  id: number;
  node_id: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
}

export interface SearchUsersPayload {
  total_count: number;
  incomplete_results: boolean;
  items: GithubUser[];
}

export type AsyncStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
