# V2 roadmap — two follow-up tests

These are proposed follow-ups. Neither is implemented in the current site. Run them only after validating the base experience and its guardrails.

## Test 1: recall timing at message 3 versus message 8

**Hypothesis:** an earlier, low-pressure acknowledgement creates continuity sooner without feeling intrusive.

**Arms:** show the same brief acknowledgement of the chosen name after message three or after message eight. Keep wording, questions, layout and the final three-detail review constant.

At message three, only the name is known. Do not compare one detail early with three details late and call it a pure timing test. Use the same name-only acknowledgement in both arms, displayed inline without adding a counted conversation message. The later complete review remains at message eight in both arms.

**Primary metric:** day-seven return across all eligible assigned participants.

**Secondary metrics:** first-session completion, time to first continued reply, perceived continuity and comfort.

**Guardrails:** incorrect names, unwanted familiarity, abandonment immediately after acknowledgement, and forget integrity.

**Events:** `recall_acknowledgement_shown` with assigned timing and message position; no name value in the payload.

**Decision:** prefer early timing only after a real return benefit without worse comfort. If no reliable benefit appears, keep message eight and avoid an extra interruption.

## Test 2: Forget-control visibility and trust

**Hypothesis:** an obvious Forget action improves a user's sense of control and their ability to stop future recall.

**Arms:** a fully functional Forget action in an accessible Manage menu versus the same action visible directly on each detail. Neither arm loses the ability to forget. Keep wording and actual deletion behaviour constant.

This compares discoverability and interaction effort together; it cannot isolate placement alone. A later test could hold tap count constant if that distinction matters.

**Primary metric:** successful unprompted discovery and use of Forget in a voluntary task-based study.

**Secondary metrics:** time to find the action, post-task control/trust rating, mistaken beliefs about transcript deletion, and day-seven return in a later pilot.

**Guardrails:** zero forgotten-detail reuse, no pressure to retain information, and no misleading deletion claims. Tell both arms exactly what Forget changes.

**Events:** `forget_control_opened` and the existing `memory_forgotten`; no forgotten value in event details.

**Decision:** adopt the visible control if discovery and trust improve without comprehension regressions. Do not hide a safety-critical capability merely to maximise retention.

## Sequence and rollout gate

1. Validate that people understand Keep, Edit and Forget in the base prototype.
2. Run the timing test with stable assignment and the same primary definition.
3. Run the visibility/trust study independently so attribution remains clear.
4. Combine only independently useful changes, then recheck guardrails.

Each test needs a reviewed sample-size calculation, fixed analysis window and safety stop rule. The v1 synthetic display provides no evidence about either follow-up.

Sources: [public job post](https://jobs.ashbyhq.com/everai/67415245-9710-4d32-a544-735d779e1d44) and [third-party review](https://shouldieventry.com/products/candy-ai-review/). Hypotheses, variants and decisions are our independent proposal.
