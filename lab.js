const questions = [
  { key: 'name', label: 'Name', text: 'What should I call you here?', choices: ['Sam', 'Alex', 'Riley'] },
  { key: 'interest', label: 'Unwinding', text: 'What do you enjoy doing to unwind?', choices: ['Sketching', 'Reading', 'Walking'] },
  { key: 'pace', label: 'Chat pace', text: 'What pace would you like for our chat?', choices: ['Gentle', 'Playful', 'Curious'] }
];

function startConversation(condition) {
  if (!['control', 'treatment'].includes(condition)) throw new Error('Unknown condition');
  return { condition, step: 0, candidates: [], memory: [], finished: false, messages: [
    { speaker: 'Nova', text: 'Hi, I’m Nova. We can start with three light questions. You choose what feels comfortable.' },
    { speaker: 'Nova', text: questions[0].text }
  ] };
}

function answerQuestion(session, value) {
  const question = questions[session.step];
  if (!question || !question.choices.includes(value)) throw new Error('Choose a fictional answer');
  session.messages.push({ speaker: 'You', text: value });
  session.candidates.push({ key: question.key, label: question.label, value, status: 'pending' });
  session.step += 1;
  if (session.step < questions.length) {
    session.messages.push({ speaker: 'Nova', text: questions[session.step].text });
  } else {
    const review = session.condition === 'treatment';
    session.memory = review ? session.candidates : [];
    session.candidates = [];
    session.messages.push({ speaker: 'Nova', review, text: review
      ? 'Here are the three things you shared. Keep what fits, edit what needs changing, or forget anything.'
      : 'Thanks for sharing. Want to keep chatting about your day?' });
  }
}

function changeMemory(session, key, action, value) {
  const item = session.memory.find(item => item.key === key);
  if (!item || item.status === 'forgotten') throw new Error('This detail is not available');
  if (action === 'keep') item.status = 'kept';
  else if (action === 'forget') { item.status = 'forgotten'; item.value = ''; }
  else if (action === 'edit') {
    if (!questions.find(question => question.key === key).choices.includes(value)) throw new Error('Choose a fictional alternative');
    item.value = value;
    item.status = 'edited';
  } else throw new Error('Unknown memory action');
}

function retainedMemory(session) {
  return session.memory.filter(item => ['kept', 'edited'].includes(item.status));
}

function continueConversation(session) {
  if (session.step !== 3 || session.finished || session.memory.some(item => item.status === 'pending')) throw new Error('Finish the memory review first');
  const retained = Object.fromEntries(retainedMemory(session).map(item => [item.key, item.value]));
  const parts = [];
  if (retained.name) parts.push(`Thanks, ${retained.name}.`);
  if (retained.pace) parts.push(`We can keep the pace ${retained.pace.toLowerCase()}.`);
  if (retained.interest) parts.push(`Would you like to chat about ${retained.interest.toLowerCase()}?`);
  session.messages.push({ speaker: 'You', text: 'Let’s keep chatting.' });
  session.messages.push({ speaker: 'Nova', text: parts.length ? parts.join(' ') : 'We can keep chatting, or leave it here for today. What would feel good?' });
  session.finished = true;
}

if (typeof document !== 'undefined') {
  const transcript = document.getElementById('transcript');
  const choices = document.getElementById('answer-choices');
  const memoryList = document.getElementById('memory-list');
  const eventLog = document.getElementById('event-log');
  const continueButton = document.getElementById('continue-session');
  const status = document.getElementById('session-status');
  let session = startConversation('treatment');
  let editingKey = null;
  let reviewLogged = false;

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function log(event, details = {}) {
    const row = element('li', 'event');
    const heading = element('div', 'event-heading');
    const now = new Date();
    const time = element('time', '', now.toLocaleTimeString('en-GB'));
    time.dateTime = now.toISOString();
    heading.append(element('span', '', event), time);
    row.append(heading, element('pre', '', JSON.stringify({ condition: session.condition, ...details })));
    eventLog.append(row);
    eventLog.scrollTop = eventLog.scrollHeight;
  }

  function updateMemory(action, key, value) {
    changeMemory(session, key, action, value);
    editingKey = null;
    log(`memory_${action === 'keep' ? 'kept' : action === 'edit' ? 'edited' : 'forgotten'}`, { field: key });
    if (!reviewLogged && session.memory.every(item => item.status !== 'pending')) {
      reviewLogged = true;
      log('memory_review_completed', { retained: retainedMemory(session).length });
    }
    render();
    status.textContent = `${questions.find(question => question.key === key).label}: ${action === 'forget' ? 'forgotten' : action === 'edit' ? 'edited and retained' : 'retained'}.`;
    const next = document.getElementById(`edit-${key}`);
    if (next && !next.disabled) next.focus();
    else {
      const pending = session.memory.find(item => item.status === 'pending');
      const target = pending ? document.getElementById(`keep-${pending.key}`) : continueButton.disabled ? transcript : continueButton;
      target.focus();
    }
  }

  function reviewCards() {
    const cards = element('div', 'review-cards');
    for (const item of session.memory) {
      const card = element('div', 'review-card');
      const heading = element('div', 'review-card-header');
      heading.append(element('span', '', item.label), element('span', '', item.status === 'pending' ? 'Your choice' : item.status));
      card.append(heading, element('strong', 'review-value', item.value || 'Not stored'));
      const actions = element('div', 'memory-actions');
      for (const action of ['keep', 'edit', 'forget']) {
        const button = element('button', action, action[0].toUpperCase() + action.slice(1));
        button.type = 'button';
        button.setAttribute('aria-label', `${button.textContent} ${item.label.toLowerCase()}`);
        button.id = `${action}-${item.key}`;
        button.disabled = item.status === 'forgotten' || (action === 'keep' && ['kept', 'edited'].includes(item.status));
        if (action === 'edit') {
          button.setAttribute('aria-expanded', String(editingKey === item.key));
          button.addEventListener('click', () => {
            editingKey = editingKey === item.key ? null : item.key;
            render();
            document.getElementById(editingKey ? `editor-${item.key}` : `edit-${item.key}`).focus();
          });
        } else button.addEventListener('click', () => updateMemory(action, item.key));
        actions.append(button);
      }
      card.append(actions);
      if (editingKey === item.key) {
        const select = element('select', 'memory-editor');
        select.id = `editor-${item.key}`;
        select.setAttribute('aria-label', `New ${item.label.toLowerCase()}`);
        for (const value of questions.find(question => question.key === item.key).choices) {
          const option = element('option', '', value);
          option.value = value;
          option.selected = value === item.value;
          select.append(option);
        }
        select.addEventListener('change', () => updateMemory('edit', item.key, select.value));
        select.addEventListener('keydown', event => {
          if (event.key === 'Escape') { editingKey = null; render(); document.getElementById(`edit-${item.key}`).focus(); }
        });
        card.append(select);
      }
      cards.append(card);
    }
    return cards;
  }

  function render() {
    transcript.replaceChildren();
    for (const message of session.messages) {
      const row = element('li', `chat-message ${message.speaker === 'You' ? 'user' : 'nova'}${message.review ? ' review-message' : ''}`);
      row.append(element('span', '', message.speaker), element('p', '', message.text));
      if (message.review) row.append(reviewCards());
      transcript.append(row);
    }
    transcript.scrollTop = transcript.scrollHeight;
    document.getElementById('message-count').textContent = `${session.messages.length} messages`;
    choices.replaceChildren();
    if (session.step < 3) {
      const question = questions[session.step];
      document.getElementById('answer-hint').textContent = `Question ${session.step + 1} of 3 · Choose a fictional answer`;
      for (const value of question.choices) {
        const button = element('button', '', value);
        button.type = 'button';
        button.addEventListener('click', () => {
          const field = question.key;
          answerQuestion(session, value);
          log('answer_submitted', { field, message: session.messages.length - 1 });
          if (session.step < 3) log('question_shown', { question: session.step + 1, message: session.messages.length });
          else log(session.condition === 'treatment' ? 'memory_review_shown' : 'control_next_step_shown', { message: 8, items: session.memory.length });
          render();
          const next = choices.querySelector('button') || document.getElementById('keep-name') || continueButton;
          next.focus();
        });
        choices.append(button);
      }
    } else document.getElementById('answer-hint').textContent = session.finished ? 'Ten messages · First session complete' : session.condition === 'treatment' ? 'Message 8 · Review each detail to continue' : 'Message 8 · Continue without a memory review';
    continueButton.hidden = session.step < 3;
    continueButton.disabled = session.finished || session.memory.some(item => item.status === 'pending');
    continueButton.textContent = session.finished ? 'Session complete' : 'Continue with Nova';
    memoryList.replaceChildren();
    if (!session.memory.length) memoryList.append(element('li', 'memory-empty', session.condition === 'control' ? 'Control does not retain or review details.' : 'Waiting for the three-detail review at message 8.'));
    for (const item of session.memory) {
      const row = element('li', 'memory-item');
      row.append(element('span', '', item.label), element('strong', '', item.value || 'Not stored'), element('small', '', item.status));
      memoryList.append(row);
    }
    document.getElementById('memory-count').textContent = `${retainedMemory(session).length} retained`;
  }

  function reset(condition) {
    session = startConversation(condition);
    editingKey = null;
    reviewLogged = false;
    log('session_started', { messages: 2 });
    log('question_shown', { question: 1, message: 2 });
    render();
    status.textContent = `Fresh ${condition} session started.`;
  }

  for (const input of document.querySelectorAll('input[name="condition"]')) input.addEventListener('change', () => {
    if (input.checked) reset(input.value);
  });
  document.getElementById('restart-session').addEventListener('click', () => reset(session.condition));
  continueButton.addEventListener('click', () => {
    continueConversation(session);
    log('session_completed', { messages: 10, retained: retainedMemory(session).length });
    render();
    status.textContent = 'The scripted first session is complete.';
  });
  document.getElementById('clear-events').addEventListener('click', () => {
    eventLog.replaceChildren();
    status.textContent = 'Local event log cleared.';
  });
  for (const button of document.querySelectorAll('[data-view]')) button.addEventListener('click', () => {
    const view = button.dataset.view;
    document.getElementById('session-view').hidden = view !== 'session';
    document.getElementById('results-view').hidden = view !== 'results';
    for (const tab of document.querySelectorAll('.view-switch button')) tab.setAttribute('aria-pressed', String(tab.dataset.view === view));
    log('view_changed', { view });
    status.textContent = view === 'results' ? 'Illustrative synthetic results shown.' : 'Nova session shown.';
  });
  reset('treatment');
}
