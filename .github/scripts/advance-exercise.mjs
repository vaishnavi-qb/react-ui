import { readFile } from 'node:fs/promises';
import {
  canAdvanceExercise,
  exerciseIssueTitle,
  exercisePath,
  parseExerciseMarkdown,
} from './exercise-workflow.mjs';
import {
  createExerciseIssue,
  getExerciseIssue,
  githubRequest,
  listAllIssues,
  repositoryPath,
} from './github-api.mjs';

const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
const repository = event.repository;
const trigger = process.env.GITHUB_EVENT_NAME;

if (trigger === 'workflow_run' && event.workflow_run.conclusion !== 'success') {
  console.log('Validation did not succeed; no exercise will be advanced.');
  process.exit(0);
}

const issues = await listAllIssues(repository);
const eventIssue = trigger === 'issues' ? event.issue : null;
const issueToAdvance = eventIssue
  ?? issues
    .filter((issue) => (
      issue.state === 'closed'
      && /^Exercise (\d{2}):/.test(issue.title)
      && issue.body?.match(/<!-- advanced-react-exercise: (\d+) -->/)
    ))
    .sort((left, right) => Number(right.body.match(/<!-- advanced-react-exercise: (\d+) -->/)[1])
      - Number(left.body.match(/<!-- advanced-react-exercise: (\d+) -->/)[1]))
    .find((issue) => {
      const number = Number(issue.body.match(/<!-- advanced-react-exercise: (\d+) -->/)[1]);
      return number === 10 || !issues.some((candidate) => (
        candidate.body?.includes(`<!-- advanced-react-exercise: ${number + 1} -->`)
      ));
    });

if (!issueToAdvance) {
  console.log('No completed exercise issue found.');
  process.exit(0);
}

const marker = issueToAdvance.body?.match(/<!-- advanced-react-exercise: (\d+) -->/);
const exerciseNumber = Number(marker?.[1]);
if (!marker || issueToAdvance.state !== 'closed') {
  console.log('The issue is not a closed exercise issue.');
  process.exit(0);
}

const defaultBranch = repository.default_branch;
const branch = await githubRequest(repositoryPath(
  repository,
  `/branches/${encodeURIComponent(defaultBranch)}`,
));
const defaultBranchSha = branch.commit.sha;

const runs = await githubRequest(repositoryPath(
  repository,
  `/actions/workflows/validate-exercise.yml/runs?branch=${encodeURIComponent(defaultBranch)}&status=completed&per_page=100`,
));
const successfulRun = runs.workflow_runs.find((run) => (
  run.conclusion === 'success' && run.head_sha === defaultBranchSha
));

if (trigger === 'workflow_run' && event.workflow_run.head_sha !== defaultBranchSha) {
  console.log('Validation run is not for the current default branch commit.');
  process.exit(0);
}

const nextExerciseNumber = exerciseNumber + 1;
const nextExercise = nextExerciseNumber <= 10
  ? await getExerciseIssue(repository, nextExerciseNumber, issues)
  : null;
const priorExerciseIssues = await Promise.all(
  Array.from({ length: exerciseNumber - 1 }, (_, index) => (
    getExerciseIssue(repository, index + 1, issues)
  )),
);

const eligible = canAdvanceExercise({
  issueState: issueToAdvance.state,
  exerciseNumber,
  previousExercisesClosed: priorExerciseIssues.every((issue) => issue?.state === 'closed'),
  nextExerciseExists: Boolean(nextExercise),
  defaultBranchSha,
  successfulValidationSha: successfulRun?.head_sha,
});

if (!eligible) {
  console.log('Exercise is not eligible to advance: close prior exercises and pass validation on the current default branch commit.');
  process.exit(0);
}

if (nextExerciseNumber > 10) {
  await githubRequest(repositoryPath(repository, `/issues/${issueToAdvance.number}/comments`), {
    method: 'POST',
    body: { body: 'All 10 Advanced React Architecture exercises are complete.' },
  });
  console.log('The Advanced React Architecture track is complete.');
  process.exit(0);
}

const nextMarkdown = await readFile(
  exercisePath(nextExerciseNumber),
  'utf8',
);
const parsedNextExercise = parseExerciseMarkdown(nextMarkdown);

await createExerciseIssue(repository, {
  ...parsedNextExercise,
  title: exerciseIssueTitle(parsedNextExercise.number, parsedNextExercise.title),
});
await githubRequest(repositoryPath(repository, `/issues/${issueToAdvance.number}/comments`), {
  method: 'POST',
  body: { body: `Exercise ${exerciseNumber} is complete and validated. Exercise ${nextExerciseNumber} has been created.` },
});