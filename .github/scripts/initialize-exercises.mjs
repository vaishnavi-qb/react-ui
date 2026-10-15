import { readFile } from 'node:fs/promises';
import { exerciseIssueTitle, exercisePath, parseExerciseMarkdown } from './exercise-workflow.mjs';
import { createExerciseIssue } from './github-api.mjs';

const event = JSON.parse(await readFile(process.env.GITHUB_EVENT_PATH, 'utf8'));
const repository = event.repository;
const exerciseMarkdown = await readFile(exercisePath(1), 'utf8');
const parsedExercise = parseExerciseMarkdown(exerciseMarkdown);

await createExerciseIssue(repository, {
  ...parsedExercise,
  title: exerciseIssueTitle(parsedExercise.number, parsedExercise.title),
});