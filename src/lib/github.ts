// Fetch dependency files from a GitHub repo (public or authenticated)

const DEPENDENCY_FILES = [
  'package.json',
  'requirements.txt',
  'Gemfile',
  'go.mod',
  'Cargo.toml',
] as const;

interface RepoFile {
  name: string;
  content: string;
}

export interface GitHubRepo {
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  private: boolean;
  default_branch: string;
}

function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  // Handles: https://github.com/owner/repo, github.com/owner/repo, owner/repo
  const cleaned = url.trim().replace(/\/+$/, '');
  const ghMatch = cleaned.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/]+)/);
  if (ghMatch) return { owner: ghMatch[1], repo: ghMatch[2] };

  const slashMatch = cleaned.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);
  if (slashMatch) return { owner: slashMatch[1], repo: slashMatch[2] };

  return null;
}

async function fetchFileFromRepo(
  owner: string,
  repo: string,
  path: string,
  token?: string
): Promise<string | null> {
  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github.v3.raw',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      { headers }
    );
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function fetchDepFilesFromRepo(
  repoUrl: string,
  token?: string
): Promise<RepoFile[]> {
  const parsed = parseRepoUrl(repoUrl);
  if (!parsed) throw new Error('Invalid GitHub URL. Use: https://github.com/owner/repo');

  const files: RepoFile[] = [];

  const results = await Promise.all(
    DEPENDENCY_FILES.map(async (name) => {
      const content = await fetchFileFromRepo(parsed.owner, parsed.repo, name, token);
      return content ? { name, content } : null;
    })
  );

  for (const r of results) {
    if (r) files.push(r);
  }

  if (files.length === 0) {
    throw new Error(
      `No dependency files found in ${parsed.owner}/${parsed.repo}. ` +
      `Looked for: ${DEPENDENCY_FILES.join(', ')}`
    );
  }

  return files;
}

export async function fetchUserRepos(token: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (page <= 5) {
    const res = await fetch(
      `https://api.github.com/user/repos?sort=updated&per_page=50&page=${page}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!res.ok) {
      if (page === 1) throw new Error('Invalid GitHub token or API error.');
      break;
    }

    const data: GitHubRepo[] = await res.json();
    if (data.length === 0) break;

    repos.push(...data);
    page++;
  }

  return repos;
}
