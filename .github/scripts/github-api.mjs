const apiRoot = 'https://api.github.com';

export async function githubRequest(path, { method = 'GET', body } = {}) {
  const response = await fetch(`${apiRoot}${path}`, {
    method,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    const responseBody = await response.text();
    throw new Error(`GitHub API ${method} ${path} failed (${response.status}): ${responseBody}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export function repositoryPath(repository, suffix) {
  return `/repos/${repository.owner.login}/${repository.name}${suffix}`;
}

export async function listAllIssues(repository) {
  const issues = [];

  for (let page = 1; ; page += 1) {
    const results = await githubRequest(
      repositoryPath(repository, `/issues?state=all&per_page=100&page=${page}`),
    );
    issues.push(...results.filter((issue) => !issue.pull_request));
    if (results.length < 100) return issues;
  }
}

export async function createExerciseIssue(repository, exercise) {
  const issues = await listAllIssues(repository);
  const marker = `<!-- advanced-react-exercise: ${exercise.number} -->`;
  const existingIssue = issues.find((issue) => (
    issue.title === exercise.title || issue.body?.includes(marker)
  ));

  if (existingIssue) {
    console.log(`Exercise ${exercise.number} already exists as issue #${existingIssue.number}.`);
    return existingIssue;
  }

  const labels = ['exercise', `exercise:${String(exercise.number).padStart(2, '0')}`];
  await ensureLabels(repository, labels);

  return githubRequest(repositoryPath(repository, '/issues'), {
    method: 'POST',
    body: {
      title: exercise.title,
      body: `${marker}\n\n${exercise.body}`,
      labels,
    },
  });
}

async function ensureLabels(repository, labels) {
  const existing = await githubRequest(repositoryPath(repository, '/labels?per_page=100'));
  const names = new Set(existing.map((label) => label.name));

  for (const name of labels) {
    if (names.has(name)) continue;
    try {
      await githubRequest(repositoryPath(repository, '/labels'), {
        method: 'POST',
        body: { name, color: '176B87', description: 'Advanced React exercise tracking' },
      });
    } catch (error) {
      if (!String(error.message).includes('(422)')) throw error;
    }
  }
}

export async function getExerciseIssue(repository, exerciseNumber, issues) {
  const marker = `<!-- advanced-react-exercise: ${exerciseNumber} -->`;
  return issues.find((issue) => issue.body?.includes(marker)) ?? null;
}