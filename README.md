# First session lab

Independent concept by Ayo Ahmed. Synthetic data. Not affiliated with EverAI.

## In 30 seconds

Nova is a fictional companion in a phone-sized conversation. Answer three light questions using fictional presets. At message eight, treatment plays back the three details and lets you Keep, Edit or Forget each. Control reaches the same point without that review. A memory panel and live event log show what changes locally. The next scripted reply uses only retained details. The Results view illustrates day-seven return at 28% versus 34%; those numbers are made up. The proposed next decision is a limited real test.

## ELI5

Imagine Nova has three little sticky notes about you. You choose which notes to keep, change or throw away. Nova can use the notes you keep. The pretend chart helps explain what we would measure before deciding whether this helps real people.

## Open and check

Open `index.html` for the site. For repeatable browser checks, serve this folder as static files:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8766/tests/browser.html` and select **Run browser checks**. To run the conversation checks:

```sh
node --test --test-reporter=tap check.cjs
```

These commands only serve local files or execute local checks. The site has no backend.

## Documentation

- [Product requirements](docs/prd.md)
- [Five whys](docs/5-whys.md)
- [Jobs to be done](docs/jobs-to-be-done.md)
- [Metrics tree](docs/metrics-tree.md)
- [Experiment design](docs/experiment-design.md)
- [Test plan](docs/test-plan.md)
- [Recorded test results](docs/test-results.md)
- [Viability memo](docs/viability-memo.md)
- [V2 roadmap](docs/v2-roadmap.md)

## Honest limits

- All replies and answer choices are scripted and safe for work; conversation is not open-ended.
- Keep and Forget take one tap. Edit opens an inline list, then choosing an alternative applies it.
- State and events live only in this tab. Nothing is sent or saved; refresh resets them.
- Forget stops future use in this demo. It does not erase past transcript messages; Restart clears the current transcript.
- The event log records field names and counts, never answer values.
- The condition toggle is manual, not random assignment.
- Day-seven return, trust and comfort are not measured here. The chart and cohorts are illustrative synthetic data.
- Passing checks proves these tested behaviours, not a retention lift, production scalability or complete accessibility.
- Memory as the bottleneck is a hypothesis. A third-party review is not verified internal evidence.
- The follow-up tests are documented proposals, not implemented features.

## Sources

- [Public Senior Product Manager job post](https://jobs.ashbyhq.com/everai/67415245-9710-4d32-a544-735d779e1d44)
- [Third-party companion review](https://shouldieventry.com/products/candy-ai-review/)

Sources checked 1 October 2026. Source claims and our inference are labelled separately. Original brand artwork remains owned by its respective rights holders.
