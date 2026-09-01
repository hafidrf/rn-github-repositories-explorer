import { searchUsers, fetchRepos } from '../github';

const makeJsonResponse = (data: any, ok = true, status = 200) =>
  ({
    ok,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  } as any);

describe('github api', () => {
  const originalFetch = (global as any).fetch;

  beforeEach(() => jest.resetAllMocks());
  afterAll(() => {
    (global as any).fetch = originalFetch;
  });

  it('searchUsers returns items + totalCount and encodes query', async () => {
    const fake = { items: [{ login: 'hafidrf', id: 1 }], total_count: 1 };
    (global as any).fetch = jest.fn().mockResolvedValue(makeJsonResponse(fake));

    const res = await searchUsers('hafid rf', 2);

    expect(res.items[0].login).toBe('hafidrf');
    expect(res.totalCount).toBe(1);
    expect((global as any).fetch).toHaveBeenCalledWith(
      expect.stringContaining('q=hafid%20rf'),
      expect.any(Object),
    );
    expect((global as any).fetch).toHaveBeenCalledWith(
      expect.stringContaining('page=2'),
      expect.any(Object),
    );
  });

  it('searchUsers throws on non-ok', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue(makeJsonResponse({ message: 'API rate limit' }, false, 403));
    await expect(searchUsers('x')).rejects.toThrow();
  });

  it('fetchRepos returns repos', async () => {
    const repos = [{ id: 1, name: 'my-repo' }];
    (global as any).fetch = jest.fn().mockResolvedValue(makeJsonResponse(repos));
    const res = await fetchRepos('hafidrf');
    expect(res).toHaveLength(1);
  });

  it('fetchRepos throws on non-ok', async () => {
    (global as any).fetch = jest.fn().mockResolvedValue(makeJsonResponse({ message: 'Not found' }, false, 404));
    await expect(fetchRepos('nope')).rejects.toThrow();
  });
});
