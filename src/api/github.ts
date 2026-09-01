import { GH_API_BASE, PER_PAGE } from '../constants';
import type { GithubRepo, GithubUser } from '../types';

const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json',
};

export async function searchUsers(query: string, page = 1): Promise<{ items: GithubUser[]; totalCount: number }> {
  const q = encodeURIComponent(query.trim());
  const url = `${GH_API_BASE}/search/users?q=${q}&per_page=${PER_PAGE}&page=${page}`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `GitHub search failed: ${res.status}`);
  }
  const json = await res.json();
  return { items: json.items as GithubUser[], totalCount: json.total_count as number };
}

export async function fetchRepos(username: string): Promise<GithubRepo[]> {
  const url = `${GH_API_BASE}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Fetch repos failed: ${res.status}`);
  }
  return (await res.json()) as GithubRepo[];
}
