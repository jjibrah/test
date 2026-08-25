# Orders Debugging Interview — Scoring Rubric

This rubric totals 100 points. Score demonstrated behavior, not merely the number of planted issues found. A candidate can score strongly without finishing the exercise if they prioritize well, validate fixes, and communicate clearly.

## Environment and setup — 10 points

**Excellent (9–10):** Quickly inspects both repositories, verifies runtime versions, follows and questions documentation, diagnoses startup/configuration errors from evidence, and gets useful backend/frontend feedback loops running without random changes.

**Average (5–8):** Gets most of the stack running with some trial and error, recognizes at least one configuration mismatch, but spends unnecessary time or relies on broad changes without confirming the cause.

**Weak (0–4):** Cannot establish a repeatable run loop, repeatedly guesses at commands/configuration, or makes unrelated environment changes without reading errors.

## Debugging process — 25 points

**Excellent (21–25):** Reproduces issues, separates frontend/backend/integration hypotheses, uses logs, tests, browser Network tools or direct API calls effectively, changes one coherent cause at a time, and regression-checks important fixes. Maintains a prioritized queue and adapts it based on evidence.

**Average (13–20):** Finds and fixes several issues with generally sensible reasoning, but occasionally shotgun-debugs, skips verification, or follows symptoms without identifying root causes.

**Weak (0–12):** Makes speculative edits, does not reproduce failures, ignores diagnostics, becomes stuck on low-impact polish, or cannot explain whether a change worked.

## Backend understanding — 20 points

**Excellent (17–20):** Correctly reasons about FastAPI routing/response models, Pydantic validation and PATCH semantics, SQLAlchemy types/session/transactions, HTTP status behavior, and at least one data-integrity concern. Fixes are narrow and preserve the API contract.

**Average (10–16):** Resolves obvious routing/schema issues and shows working API knowledge, but misses deeper ORM, transaction, pagination, async, or modeling implications.

**Weak (0–9):** Treats validation/ORM failures as opaque, changes contracts arbitrarily, or introduces unsafe workarounds such as removing response models and validation wholesale.

## Frontend understanding — 15 points

**Excellent (13–15):** Uses TypeScript errors constructively, follows data through fetch/types/components, handles React async state correctly, and distinguishes loading/error/empty/mutation states. Preserves accessible, readable UI behavior.

**Average (7–12):** Restores primary rendering and one mutation flow, but leaves weak typing, stale state, or confusing error/loading behavior.

**Weak (0–6):** Uses unsafe casts broadly, cannot trace component state or request payloads, or leaves the main page unstable.

## API and integration reasoning — 10 points

**Excellent (9–10):** Compares the client contract directly with OpenAPI/routes, understands fetch response behavior, CORS/preflight, methods, headers, environment exposure, and verifies end-to-end behavior in the browser.

**Average (5–8):** Finds the main URL/payload/method mismatches but explains CORS or HTTP errors only partially, or validates only one side of the integration.

**Weak (0–4):** Confuses browser CORS with server availability, changes both sides without determining the intended contract, or cannot interpret request/response evidence.

## Code quality — 5 points

**Excellent (5):** Produces small, idiomatic, consistent fixes; avoids duplicated ad hoc handling; preserves typing; and adds or updates focused regression coverage where valuable.

**Average (3–4):** Fixes are readable and mostly scoped, with minor duplication or incomplete cleanup.

**Weak (0–2):** Workarounds obscure causes, weaken validation/types, introduce unrelated refactors, or leave dead/inconsistent code.

## UI improvement — 5 points

**Excellent (5):** Makes one focused improvement that materially clarifies loading, errors, mutation progress, responsive layout, or data readability and verifies it with realistic states.

**Average (3–4):** Adds a useful but limited visual/interaction improvement with minor state or consistency gaps.

**Weak (0–2):** Makes only cosmetic changes while core behavior remains unclear, or introduces inaccessible/confusing UI.

## Communication and thinking aloud — 10 points

**Excellent (9–10):** Consistently states observations, hypotheses, intended checks, tradeoffs, and results in concise language. Explicitly prioritizes user impact and time, acknowledges uncertainty, and summarizes remaining risks.

**Average (5–8):** Explains most actions and can answer follow-ups, but reasoning is intermittent, retrospective, or imprecise about evidence and priority.

**Weak (0–4):** Works silently, narrates keystrokes rather than reasoning, cannot explain changes, or claims success without evidence.

## Score interpretation

- **85–100:** Excellent junior performance; systematic, productive, and trustworthy under time pressure.
- **70–84:** Strong performance; good fundamentals with a few depth or completeness gaps.
- **55–69:** Mixed/average performance; meaningful progress but inconsistent process or understanding.
- **40–54:** Below expected level; some useful fixes but substantial gaps in diagnosis or communication.
- **0–39:** Weak performance; unable to establish or drive a reliable debugging process.

## Interviewer notes

Record which workflows were demonstrated end to end (list, create, detail, status, summary), what evidence the candidate used, whether fixes were regression-checked, and the highest-impact unresolved issue they identified. Do not convert issue count directly into points.
