import test from 'node:test';
import assert from 'node:assert/strict';
import {
  canAdvanceExercise,
  exerciseIssueTitle,
  parseExerciseMarkdown,
} from './exercise-workflow.mjs';

test('parses the exercise number, title, and issue body', () => {
  assert.deepEqual(
    parseExerciseMarkdown('# Issue #3: Complex Forms\n\nImplement validation.'),
    {
      number: 3,
      title: 'Complex Forms',
      body: 'Implement validation.',
    },
  );
});

test('rejects exercise markdown without a numbered title', () => {
  assert.throws(() => parseExerciseMarkdown('# Missing issue number'), /Issue #N/);
});

test('formats issue titles with a two-digit exercise number', () => {
  assert.equal(exerciseIssueTitle(4, 'Authentication'), 'Exercise 04: Authentication');
});

test('advances only after closure, prior completion, and validation of the current default head', () => {
  const eligibleExercise = {
    issueState: 'closed',
    exerciseNumber: 2,
    previousExercisesClosed: true,
    nextExerciseExists: false,
    defaultBranchSha: 'abc123',
    successfulValidationSha: 'abc123',
  };

  assert.equal(canAdvanceExercise(eligibleExercise), true);
  assert.equal(canAdvanceExercise({ ...eligibleExercise, issueState: 'open' }), false);
  assert.equal(canAdvanceExercise({ ...eligibleExercise, previousExercisesClosed: false }), false);
  assert.equal(canAdvanceExercise({ ...eligibleExercise, nextExerciseExists: true }), false);
  assert.equal(canAdvanceExercise({ ...eligibleExercise, successfulValidationSha: 'old-sha' }), false);
});

test('allows the final exercise to complete without creating an eleventh issue', () => {
  assert.equal(canAdvanceExercise({
    issueState: 'closed',
    exerciseNumber: 10,
    previousExercisesClosed: true,
    nextExerciseExists: false,
    defaultBranchSha: 'final-sha',
    successfulValidationSha: 'final-sha',
  }), true);
});