# Test plan

## Automated logic checks

Run `node --test --test-reporter=tap check.cjs` from the project folder. These checks execute the same conversation functions used by the page; they do not replace them with alternate logic.

Coverage: section order, required notice, local files, fresh state, invalid conditions and answers, review timing, control isolation, Keep, Edit, Forget, forgotten-detail exclusion, neutral continuation, completion guards, restart and synthetic-chart arithmetic.

## Automated browser checks

Serve the folder as static files, open `tests/browser.html`, then select **Run browser checks**. The page loads the actual site in a same-origin frame and activates its real controls. No external service is required.

Coverage: loaded logo and font; source-section order; 375px layout and touch sizes; message-eight review; pending-review gate; memory actions; event payloads; condition reset; forgotten-detail exclusion; restart; event clearing; synthetic results; view state and focus.

The frame suite exercises browser events and DOM state. Its final radio check is a focus check, not a physical keyboard simulation. Direct browser keyboard interaction is checked separately.

## Direct browser walkthrough

1. Open the page and navigate to the experiment.
2. Answer Sam, Sketching and Gentle. Verify exactly eight messages and three review cards.
3. Keep Name, edit Unwinding to Reading, and forget Chat pace.
4. Continue. Verify ten messages, recall of Sam and Reading, and no use of Gentle.
5. Switch to control. Confirm a fresh session and a neutral continuation.
6. Select Results. Verify synthetic labels, 28% versus 34%, and the limited-test decision.
7. Check keyboard navigation, small-phone layout and the visible focus ring.
8. Refresh. Confirm chat, retained details and event history reset.

## Completion criteria

All automated checks pass. No horizontal overflow at the tested small-phone width. Keep/Forget effects are immediate, Edit receives focus, forgotten details are not reused, and the source/results labels remain visible in their relevant views.

## Limits

These checks do not establish day-seven return, perceived trust, production scalability, persistent deletion, a full accessibility audit or compatibility with every browser. Real-user outcomes require a separately approved pilot.

See [recorded results](test-results.md), [raw logic output](../tests/node-results.tap) and [raw browser output](../tests/browser-results.json).
