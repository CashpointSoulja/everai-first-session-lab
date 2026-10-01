const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, 'lab.js'), 'utf8'), context);
function completeQuestions(condition = 'treatment') {
  const session = context.startConversation(condition);
  for (const value of ['Sam', 'Sketching', 'Gentle']) context.answerQuestion(session, value);
  return session;
}
test('Page keeps the three sections in the required order', () => {
  assert.equal([...html.matchAll(/<section id="([^"]+)"/g)].map(match => match[1]).join(','), 'today,memory,experiment');
});
test('Independent notice and synthetic-result disclosure are present', () => {
  for (const text of ['Independent concept by Ayo Ahmed', 'Synthetic data', 'Not affiliated with EverAI.', 'Illustrative synthetic numbers']) assert.ok(html.includes(text));
});
test('Every local page reference exists', () => {
  for (const [, file] of html.matchAll(/(?:href|src)="([^"#]+)"/g)) if (!file.startsWith('https://')) assert.ok(fs.existsSync(path.join(__dirname, file)), file);
});
test('A fresh session begins with two Nova messages and no memory', () => {
  const session = context.startConversation('treatment');
  assert.equal(session.messages.length, 2);
  assert.equal(session.memory.length, 0);
});
test('Unknown conditions are rejected', () => assert.throws(() => context.startConversation('other')));
test('Unexpected answers are rejected without advancing the conversation', () => {
  const session = context.startConversation('treatment');
  assert.throws(() => context.answerQuestion(session, '<unexpected>'));
  assert.equal(session.messages.length, 2);
  assert.equal(session.step, 0);
});
test('Memory is not exposed before all three questions are answered', () => {
  const session = context.startConversation('treatment');
  context.answerQuestion(session, 'Sam');
  assert.equal(session.messages.length, 4);
  assert.equal(session.memory.length, 0);
  context.answerQuestion(session, 'Sketching');
  assert.equal(session.messages.length, 6);
  assert.equal(session.memory.length, 0);
});
test('Treatment plays back three details at exactly message eight', () => {
  const session = completeQuestions();
  assert.equal(session.messages.length, 8);
  assert.equal(session.messages[7].review, true);
  assert.equal(session.memory.length, 3);
  assert.equal(session.candidates.length, 0);
});
test('Control reaches message eight without retained details or review', () => {
  const session = completeQuestions('control');
  assert.equal(session.messages.length, 8);
  assert.equal(session.messages[7].review, false);
  assert.equal(session.memory.length, 0);
  assert.equal(session.candidates.length, 0);
});
test('Pending memories prevent continuing', () => assert.throws(() => context.continueConversation(completeQuestions())));
test('Keep retains the chosen detail', () => {
  const session = completeQuestions();
  context.changeMemory(session, 'name', 'keep');
  assert.equal(context.retainedMemory(session).length, 1);
  assert.equal(session.memory[0].value, 'Sam');
});
test('Edit validates and replaces a detail with a fictional alternative', () => {
  const session = completeQuestions();
  assert.throws(() => context.changeMemory(session, 'interest', 'edit', '<unexpected>'));
  assert.equal(session.memory[1].value, 'Sketching');
  context.changeMemory(session, 'interest', 'edit', 'Reading');
  assert.equal(session.memory[1].value, 'Reading');
  assert.equal(session.memory[1].status, 'edited');
});
test('Forget clears the value and cannot silently restore it', () => {
  const session = completeQuestions();
  context.changeMemory(session, 'pace', 'forget');
  assert.equal(session.memory[2].value, '');
  assert.equal(session.memory[2].status, 'forgotten');
  assert.throws(() => context.changeMemory(session, 'pace', 'keep'));
  assert.throws(() => context.changeMemory(session, 'pace', 'edit', 'Gentle'));
});
test('Continuation uses kept and edited details and excludes forgotten details', () => {
  const session = completeQuestions();
  context.changeMemory(session, 'name', 'keep');
  context.changeMemory(session, 'interest', 'edit', 'Reading');
  context.changeMemory(session, 'pace', 'forget');
  context.continueConversation(session);
  assert.equal(session.messages.length, 10);
  assert.ok(session.messages[9].text.includes('Sam'));
  assert.ok(session.messages[9].text.includes('reading'));
  assert.ok(!session.messages[9].text.includes('gentle'));
  assert.ok(!session.messages[9].text.includes('sketching'));
});
test('Forgetting all three details yields the same neutral reply as control', () => {
  const treatment = completeQuestions();
  for (const key of ['name', 'interest', 'pace']) context.changeMemory(treatment, key, 'forget');
  const control = completeQuestions('control');
  context.continueConversation(treatment);
  context.continueConversation(control);
  assert.equal(treatment.messages[9].text, control.messages[9].text);
});
test('Completed sessions cannot submit extra answers or continue twice', () => {
  const session = completeQuestions('control');
  context.continueConversation(session);
  assert.throws(() => context.continueConversation(session));
  assert.throws(() => context.answerQuestion(session, 'Sam'));
  assert.equal(session.messages.length, 10);
});
test('Restart creates a clean session without carried-over details', () => {
  const old = completeQuestions();
  context.changeMemory(old, 'name', 'keep');
  const fresh = context.startConversation(old.condition);
  assert.equal(fresh.messages.length, 2);
  assert.equal(fresh.memory.length, 0);
  assert.equal(fresh.candidates.length, 0);
});
test('Synthetic chart percentages match the labelled cohort counts', () => {
  assert.equal(280 * 100 / 1000, 28);
  assert.equal(340 * 100 / 1000, 34);
  assert.ok(html.includes('280 (28%)'));
  assert.ok(html.includes('340 (34%)'));
  assert.ok(html.includes('width:70%'));
  assert.ok(html.includes('width:85%'));
});
