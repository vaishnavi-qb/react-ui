export const TOTAL_EXERCISES = 10;
export const EXERCISE_SLUGS = [
  'advanced-hooks',
  'advanced-routing',
  'complex-forms',
  'authentication-cors',
  'tanstack-query',
  'global-state',
  'typescript-react',
  'performance',
  'nextjs',
  'capstone',
];

export function exercisePath(number) {
  const slug = EXERCISE_SLUGS[number - 1];
  if (!slug) throw new Error(`Unknown exercise number: ${number}`);
  return `.github/exercises/${String(number).padStart(2, '0')}-${slug}.md`;
}

export function parseExerciseMarkdown(markdown) {
  const heading = markdown.match(/^# Issue #(\d+):\s*(.+)$/m);

  if (!heading) {
    throw new Error('Exercise markdown must start with "# Issue #N: Title".');
  }

  return {
    number: Number(heading[1]),
    title: heading[2].trim(),
    body: markdown.replace(heading[0], '').trim(),
  };
}

export function exerciseIssueTitle(number, title) {
  return `Exercise ${String(number).padStart(2, '0')}: ${title}`;
}

export function canAdvanceExercise({
  issueState,
  exerciseNumber,
  previousExercisesClosed,
  nextExerciseExists,
  defaultBranchSha,
  successfulValidationSha,
}) {
  const hasNextExercise = exerciseNumber < TOTAL_EXERCISES;

  return issueState === 'closed'
    && Number.isInteger(exerciseNumber)
    && exerciseNumber >= 1
    && exerciseNumber <= TOTAL_EXERCISES
    && previousExercisesClosed
    && (!hasNextExercise || !nextExerciseExists)
    && Boolean(defaultBranchSha)
    && successfulValidationSha === defaultBranchSha;
}