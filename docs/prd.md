# Product requirements — First session lab

Independent concept by Ayo Ahmed. Synthetic data. Not affiliated with EverAI.

## Problem and evidence

Working hypothesis: visible, accurate memory under the user's control may make a first companion session worth returning to. We do not have internal retention data or proof that memory is the leading bottleneck.

The [public Senior Product Manager post](https://jobs.ashbyhq.com/everai/67415245-9710-4d32-a544-735d779e1d44) provides the product and role context. A [third-party companion review](https://shouldieventry.com/products/candy-ai-review/) reports mixed memory behaviour. That review motivates investigation; it does not validate our proposed intervention.

## User and job

A fictional first-time user wants an easy conversation without repeating basic preferences or surrendering control of what is remembered. See [jobs to be done](jobs-to-be-done.md).

## Scope

- Three sections: public product brief, third-party evidence and our inference, then the experiment.
- Phone-sized Nova conversation using only fictional answer presets and safe-for-work scripted replies.
- Control and treatment share the same three questions.
- Treatment reviews all three details at exactly message eight; control continues without a review.
- Keep and Forget take one tap. Edit takes one tap to open an inline list, then choosing an alternative applies it without a separate Save step.
- Memory panel reflects pending, kept, edited and forgotten states.
- Event log reflects actual local interactions and contains no answer values.
- Both conditions can complete ten messages.
- Results view labels all numerical outcomes as illustrative synthetic data.

## Acceptance criteria

1. The independent-concept notice and real logo appear at the top.
2. The three questions collect a name, an unwinding interest and a chat pace.
3. No memory card appears before message eight.
4. No pending treatment detail is silently retained; the user reviews each before continuing.
5. An edited detail replaces its prior value; a forgotten value is cleared and excluded from subsequent replies.
6. Forgetting all details produces a neutral reply.
7. Switching condition or restarting begins with two messages and zero retained details.
8. Refresh removes session state and local events.
9. Interactive controls support keyboard focus and touch; the layout fits small screens.
10. Sources, inference, illustrative data and measured test results remain distinct.

## Success

Primary future metric: day-seven return. Secondary metrics: first-session completion, time to completion, review completion and user confidence. See [experiment design](experiment-design.md).

## Out of scope

Accounts, persistent storage, external telemetry, actual day-seven tracking, production integration, open-ended conversation and real-user research. The current site is a local interaction prototype, not a live retention experiment.
