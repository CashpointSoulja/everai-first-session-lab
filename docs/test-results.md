# Recorded test results

## Completed run

Browser run completed **1 October 2026, 19:59:34 BST**. All results below are observed checks of this prototype, not synthetic test outcomes.

| Suite | Passed | Failed | Evidence |
|---|---:|---:|---|
| Automated conversation and structure checks | 18 | 0 | [Raw output](../tests/node-results.tap) |
| Automated real-page browser checks | 12 | 0 | [Recorded report](../tests/browser-results.json) |

The recorded browser report includes checksums of the tested source files. The conversation suite executes the same functions used by the page. The browser suite loads the actual site and drives its actual controls in a same-origin frame.

## Browser check details

| Check | Result |
|---|---|
| Page notice, real logo, local fonts and section order | Pass |
| Small-phone layout fits at 375px and controls meet 44px minimum height | Pass |
| Treatment keeps the memory review hidden before message eight | Pass |
| Keep updates memory and emits an event without answer values | Pass |
| Edit opens inline and selecting an alternative updates memory | Pass |
| Forget clears the detail and continuation excludes it at message ten | Pass |
| Control toggle starts fresh and completes without memory review | Pass |
| Forgetting every detail leaves zero memory and a neutral next reply | Pass |
| Restart clears chat and memory; clear log removes local events | Pass |
| Results view labels synthetic data and chart values honestly | Pass |
| Returning from results preserves the current session | Pass |
| Condition control preserves focus while starting a fresh session | Pass |

## Direct browser verification

- ArrowLeft selected control; ArrowRight selected treatment and began a fresh session.
- Sam, Sketching and Gentle produced exactly eight messages and three review cards.
- Keep Name, edit Unwinding to Reading and forget Chat pace produced a ten-message session.
- The subsequent reply read: “Thanks, Sam. Would you like to chat about reading?” It did not reuse Gentle or the replaced interest.
- The synthetic Results view displayed its disclosure, 28% versus 34%, and the limited-test decision.

[Session screenshot](../previews/session.jpg) · [Results screenshot](../previews/results.jpg)

## Development correction

An early percentage assertion failed because of strict floating-point comparison. The check now uses integer-first arithmetic; the complete 18-check suite passed afterward. The displayed percentages were unchanged. Focus after Forget was also made explicit so it moves to a remaining decision or the continuation control.

## What these passes do not prove

No real day-seven return, trust rating, permanent deletion, production load or full accessibility audit was measured. The 28% and 34% cohorts are illustrative synthetic data. Forget changes future use in this local session; historical transcript messages remain visible until restart.

## Repeat the checks

```sh
node --test --test-reporter=tap check.cjs
```

Serve the project as local static files, open `tests/browser.html`, and select **Run browser checks**. A fresh run shows its own timestamps and pass/fail results.
