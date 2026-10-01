# Experiment design

Status: proposed. No real users or observed retention results.

## Hypothesis

For eligible new users, a correct three-detail review with Keep, Edit and Forget at message eight will increase day-seven return compared with the same opening questions and a generic continuation, without increasing incorrect recall or unwanted familiarity.

## Arms and assignment

- Control: three identical questions; no memory review; generic continuation.
- Treatment: the three-detail review at message eight; only kept or edited details shape the next reply.
- Future assignment: 50/50 at the start of the first session, before either experience is shown. Keep assignment stable per consented participant.
- Eligibility: consenting adult first-time participants in a safe-for-work pilot. Establish duplicate, staff and automated-traffic exclusions before assignment.
- Analyse the whole assigned cohort, including people who leave early. Do not limit the primary denominator to review completers.

This prototype uses a manual condition toggle. It does not implement random assignment or a live pilot.

## Primary metric: day 7 return

Numerator: unique eligible assigned participants who send at least one qualifying conversation message during `[assignment time + 7 days, assignment time + 8 days)`.

Denominator: all eligible assigned participants with a fully elapsed observation window. Use UTC timestamps and the same qualifying-message definition in both arms. Do not count opening the page, an automatic reply or an event-log entry as a return.

## Secondary metrics

First-session completion, answer completion, memory-review completion, time to completion, voluntary comfort and memory-confidence ratings. Treat these as explanatory measures, not substitutes for the primary outcome.

## Guardrails

- Zero tolerance for a verified forgotten detail resurfacing in a subsequent reply.
- Pause if unwanted-familiarity complaints exceed control by more than one percentage point.
- Pause if session-blocking errors exceed 1% of pilot sessions.
- Check whether correction actually changes subsequent recall.
- Preserve the ability to retain no details; do not pressure users to choose Keep.

The numerical pause limits are proposed operating thresholds. Validate them against the actual baseline and agree them before enrolment.

## Sample-size note

For planning only, suppose control return is 28% and the smallest worthwhile increase is six percentage points, to 34%. A two-sided 5% test with 80% power and equal arms gives approximately **932 eligible participants per arm** under a normal approximation. A practical initial target is **1,000 per arm**, subject to a reviewed calculation using a real baseline.

With `p = (0.28 + 0.34) / 2`, the approximation is:

```text
n per arm ≈ [1.96 × √(2p(1−p)) + 0.842 × √(0.28×0.72 + 0.34×0.66)]² / 0.06²
```

These are design assumptions, not measured traffic or conversion rates. A smaller detectable lift needs more people. Do not exclude drop-outs to achieve a tidy sample.

## Stop rule

1. Pause immediately for a verified forget-integrity breach or another serious safety issue.
2. Monitor the agreed guardrails during enrolment; do not stop early because the return chart briefly looks promising.
3. Enrol until 1,000 eligible participants per arm, or a pre-agreed 21-day enrolment cap, whichever comes first.
4. Wait until the last assigned participant's full day-seven window has elapsed: eight days after assignment.
5. Perform one planned primary comparison. If the cap yields insufficient sample, report an inconclusive result rather than a win.

## Decision

Expand only after a real positive result with an interval excluding no difference and acceptable guardrails. A null or negative result calls for revision or stopping. The synthetic 28% versus 34% display supports discussion only; it cannot establish significance or justify shipping.

## Evidence

[Public job post](https://jobs.ashbyhq.com/everai/67415245-9710-4d32-a544-735d779e1d44); [third-party review](https://shouldieventry.com/products/candy-ai-review/). Neither supplies the baseline, effect size or sample size used in the illustrative plan.
