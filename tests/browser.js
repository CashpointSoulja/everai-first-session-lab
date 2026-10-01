const frame = document.getElementById('app');
const runButton = document.getElementById('run');
let page;
let sequence = 0;
const suites = [];
function assert(value, message) { if (!value) throw new Error(message); }
function check(name, fn) { suites.push({ name, fn }); }
function text(selector) { return page.querySelector(selector).textContent; }
function click(selector) { const control = page.querySelector(selector); assert(control && !control.disabled, `Unavailable control: ${selector}`); control.click(); }
function choose(value) {
  const button = [...page.querySelectorAll('#answer-choices button')].find(button => button.textContent === value);
  assert(button, `Missing fictional choice: ${value}`);
  button.click();
}
async function fresh(condition = 'treatment') {
  await new Promise((resolve, reject) => {
    frame.onload = resolve;
    frame.onerror = () => reject(new Error('The local page did not load'));
    frame.src = `../index.html?check=${++sequence}`;
  });
  page = frame.contentDocument;
  await page.fonts.ready;
  if (condition === 'control') click('input[value="control"]');
}
function completeQuestions() { for (const value of ['Sam', 'Sketching', 'Gentle']) choose(value); }
check('Page notice, real logo, local fonts and section order', async () => {
  await fresh();
  assert([...page.querySelectorAll('main > section')].map(node => node.id).join(',') === 'today,memory,experiment', 'Section order changed');
  assert(text('.notice').includes('Independent concept by Ayo Ahmed'), 'Notice missing');
  assert(text('.notice').includes('Synthetic data') && text('.notice').includes('Not affiliated with EverAI.'), 'Disclosure missing');
  assert(page.querySelector('.identity img').naturalWidth === 254, 'Logo not loaded');
  assert(page.fonts.check('16px Aspekta'), 'Local body font not loaded');
});
check('Small-phone layout fits at 375px and controls meet 44px minimum height', async () => {
  frame.style.width = '375px';
  await fresh();
  assert(page.documentElement.scrollWidth === frame.contentWindow.innerWidth, 'Horizontal overflow');
  for (const button of page.querySelectorAll('.answer-choices button, .view-switch button, #restart-session')) assert(button.getBoundingClientRect().height >= 44, 'Control too short');
  frame.style.width = '390px';
});
check('Treatment keeps the memory review hidden before message eight', async () => {
  await fresh();
  choose('Sam');
  assert(text('#message-count') === '4 messages' && !page.querySelector('.review-card'), 'Review arrived too early');
  choose('Sketching');
  assert(text('#message-count') === '6 messages' && !page.querySelector('.review-card'), 'Review arrived too early');
  choose('Gentle');
  assert(text('#message-count') === '8 messages', 'Review timing changed');
  assert(page.querySelectorAll('.review-card').length === 3, 'Three details not played back');
  assert(page.querySelector('#continue-session').disabled, 'Pending review can be skipped');
});
check('Keep updates memory and emits an event without answer values', () => {
  click('#keep-name');
  assert(text('#memory-count') === '1 retained', 'Keep did not retain');
  assert(text('#memory-list').includes('Sam'), 'Kept value absent');
  assert(text('#event-log').includes('memory_kept'), 'Keep event absent');
  for (const value of ['Sam', 'Sketching', 'Gentle']) assert(!text('#event-log').includes(value), 'Answer value leaked into events');
});
check('Edit opens inline and selecting an alternative updates memory', () => {
  click('#edit-interest');
  const select = page.querySelector('#editor-interest');
  assert(select && page.activeElement === select, 'Inline editor did not receive focus');
  select.value = 'Reading';
  select.dispatchEvent(new frame.contentWindow.Event('change', { bubbles: true }));
  assert(text('#memory-count') === '2 retained', 'Edit did not retain');
  assert(text('#memory-list').includes('Reading') && !text('#memory-list').includes('Sketching'), 'Edited memory incorrect');
  assert(text('#event-log').includes('memory_edited'), 'Edit event absent');
});
check('Forget clears the detail and continuation excludes it at message ten', () => {
  click('#forget-pace');
  assert(!text('#memory-list').includes('Gentle'), 'Forgotten detail still in memory');
  assert(text('#event-log').includes('memory_forgotten') && text('#event-log').includes('memory_review_completed'), 'Review events absent');
  click('#continue-session');
  assert(text('#message-count') === '10 messages', 'Continuation did not complete');
  const reply = page.querySelector('#transcript li:last-child p').textContent;
  assert(reply.includes('Sam') && reply.includes('reading') && !reply.includes('gentle'), 'Reply used incorrect memory');
  assert(text('#event-log').includes('session_completed'), 'Completion event absent');
});
check('Control toggle starts fresh and completes without memory review', () => {
  click('input[value="control"]');
  assert(text('#message-count') === '2 messages' && text('#memory-count') === '0 retained', 'Condition carried over state');
  completeQuestions();
  assert(text('#message-count') === '8 messages' && !page.querySelector('.review-card'), 'Control includes treatment');
  click('#continue-session');
  const reply = page.querySelector('#transcript li:last-child p').textContent;
  assert(!reply.includes('Sam') && !reply.includes('sketching') && !reply.includes('gentle'), 'Control uses retained details');
});
check('Forgetting every detail leaves zero memory and a neutral next reply', async () => {
  await fresh();
  completeQuestions();
  for (const key of ['name', 'interest', 'pace']) click(`#forget-${key}`);
  assert(text('#memory-count') === '0 retained', 'Forgotten memory retained');
  assert(page.querySelectorAll('.memory-actions button:not(:disabled)').length === 0, 'Forgotten details can be restored');
  click('#continue-session');
  assert(page.querySelector('#transcript li:last-child p').textContent === 'We can keep chatting, or leave it here for today. What would feel good?', 'Forgotten details resurfaced');
});
check('Restart clears chat and memory; clear log removes local events', () => {
  click('#restart-session');
  assert(text('#message-count') === '2 messages' && text('#memory-count') === '0 retained', 'Restart failed');
  assert(!page.querySelector('.review-card'), 'Review survives restart');
  click('#clear-events');
  assert(page.querySelectorAll('#event-log li').length === 0, 'Log did not clear');
});
check('Results view labels synthetic data and chart values honestly', () => {
  click('.view-switch button[data-view="results"]');
  assert(page.querySelector('#session-view').hidden && !page.querySelector('#results-view').hidden, 'View did not switch');
  assert(text('.synthetic-banner').includes('Illustrative synthetic numbers'), 'Synthetic label absent');
  assert(text('.control-bar') === '28%' && text('.treatment-bar') === '34%', 'Chart values incorrect');
  assert(text('.results-table').includes('280 (28%)') && text('.results-table').includes('340 (34%)'), 'Cohort values incorrect');
  assert(text('.decision').includes('Synthetic numbers cannot establish significance or justify shipping.'), 'Decision overclaims');
});
check('Returning from results preserves the current session', () => {
  click('.decision button');
  assert(!page.querySelector('#session-view').hidden && page.querySelector('#results-view').hidden, 'Session did not return');
  assert(text('#message-count') === '2 messages', 'View switch reset the session');
});
check('Condition control preserves focus while starting a fresh session', () => {
  const radio = page.querySelector('input[value="control"]');
  radio.focus();
  radio.click();
  assert(radio.checked && text('#answer-hint').includes('Question 1'), 'Condition did not start');
  assert(page.activeElement === radio, 'Radio focus lost');
});
runButton.addEventListener('click', async () => {
  runButton.disabled = true;
  const startedAt = new Date().toISOString();
  const results = [];
  const list = document.getElementById('checks');
  list.replaceChildren();
  document.getElementById('summary').textContent = 'Running checks against the real page…';
  for (const suite of suites) {
    let error;
    try { await suite.fn(); } catch (failure) { error = failure.message; }
    results.push({ name: suite.name, passed: !error, ...(error ? { error } : {}) });
    const row = document.createElement('li');
    row.textContent = `${error ? 'FAIL' : 'PASS'} — ${suite.name}${error ? `: ${error}` : ''}`;
    list.append(row);
  }
  const passed = results.filter(result => result.passed).length;
  const report = { startedAt, completedAt: new Date().toISOString(), passed, failed: results.length - passed, checks: results };
  document.getElementById('summary').textContent = `${passed} passed · ${report.failed} failed`;
  document.getElementById('report-json').textContent = JSON.stringify(report, null, 2);
  runButton.disabled = false;
});
