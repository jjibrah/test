# Interviewer Instructions — Orders Debugging Exercise

This document contains the answer key. The candidate should not read it before or during the exercise.

## Intended exercise shape

The repositories contain more work than a candidate should finish in 60 minutes. A strong junior should establish a useful debugging loop, fix the highest-impact setup and integration failures, verify important behavior, and explain what they would address next. Do not reward raw bug count over deliberate prioritization and verification.

When the candidate asks for help, first ask what they observed, what layer they believe is failing, and what evidence would distinguish their hypotheses. Offer only a narrow directional hint after they have exhausted a reasonable debugging step.

## Planted backend issues

### B1. Backend README uses the wrong Uvicorn import path

- Severity: High / setup blocker
- Diagnosis: From the repository root, `uvicorn main:app` cannot import `main`; the module lives at `app.main`.
- Expected fix: Use `uvicorn app.main:app --reload --port 8000`, or add an intentional entry point/package configuration.
- Skill tested: Reading project structure, interpreting startup errors, Python imports.
- Priority: 1
- Follow-up: Why does the working directory affect Python module imports?

### B2. SQLite engine is not configured for multi-threaded request/test use

- Severity: Medium
- Diagnosis: The SQLite engine lacks `connect_args={"check_same_thread": False}`. Threaded FastAPI/TestClient use can raise SQLite thread-affinity errors depending on connection reuse and environment.
- Expected fix: Apply SQLite-specific connect args when constructing the engine (without blindly applying them to other database drivers).
- Skill tested: FastAPI dependency lifecycle, SQLAlchemy engine configuration, environment-aware configuration.
- Priority: 5
- Follow-up: Would you use the same option with PostgreSQL?

### B3. Money is stored as an integer

- Severity: High / data integrity
- Diagnosis: `unit_price` is an SQLAlchemy `Integer` while the API schema accepts decimal values, and creation explicitly converts the value with `int(...)`. Cents are silently lost.
- Expected fix: Use `Numeric(precision, scale)` (and decide how Decimal is serialized), then migrate/recreate the development database.
- Skill tested: Relational modeling, money representation, schema alignment.
- Priority: 4
- Follow-up: Why are binary floats risky for currency?

### B4. Customer email is incorrectly unique across all orders

- Severity: High / common workflow failure
- Diagnosis: `customer_email` has a unique database constraint, preventing a returning customer from placing another order. The unhandled `IntegrityError` becomes a 500 and leaves transaction state problematic for continued use.
- Expected fix: Remove the uniqueness constraint for this business model, migrate/recreate the table, and add appropriate integrity-error handling where genuine constraints exist.
- Skill tested: Translating business concepts into constraints, database exception handling.
- Priority: 7
- Follow-up: Where would idempotency or duplicate-submission prevention belong instead?

### B5. All model instances share an import-time timestamp default

- Severity: Medium
- Diagnosis: `default=datetime.utcnow()` calls the function once during module import. Orders created later reuse that same value.
- Expected fix: Pass the callable: `default=datetime.utcnow` (or use a database/server default and timezone-aware timestamps).
- Skill tested: Callable defaults, Python evaluation timing, audit data.
- Priority: 8
- Follow-up: What timezone policy would you choose for production?

### B6. Quantity validation permits zero

- Severity: Medium / business validation
- Diagnosis: Both create and update schemas use `ge=0`; a zero-quantity order is accepted.
- Expected fix: Require `gt=0` (or `ge=1`) in both schemas and retain database/domain safeguards as appropriate.
- Skill tested: Pydantic constraints, boundary-value testing.
- Priority: 6
- Follow-up: Which validation belongs in the API versus the database?

### B7. List pagination ignores offset and reports a page count as the total

- Severity: Medium
- Diagnosis: `skip` is never applied, `limit + 1` returns too many records, and `total = len(orders)` is not the total number of matching rows.
- Expected fix: Apply `.offset(skip).limit(limit)`, run an explicit count query, and clarify the response contract.
- Skill tested: SQLAlchemy querying, pagination semantics, API contracts.
- Priority: 10
- Follow-up: What changes for cursor pagination on a frequently updated table?

### B8. Order detail has the wrong response model

- Severity: High / core flow blocker
- Diagnosis: `GET /orders/{id}` returns an `Order`, but declares `OrderListResponse`, causing response validation failure for an existing order.
- Expected fix: Declare `response_model=OrderResponse`.
- Skill tested: FastAPI response validation, interpreting 500 logs, contract reasoning.
- Priority: 3
- Follow-up: Why validate outgoing responses at all?

### B9. Partial update overwrites omitted fields with null

- Severity: High / core flow and data integrity
- Diagnosis: `OrderUpdate.model_dump()` includes every optional field with `None`. A status-only patch sets required columns to null and fails at commit.
- Expected fix: Use `model_dump(exclude_unset=True)` and deliberately define the meaning of explicit null values; roll back on database exceptions.
- Skill tested: PATCH semantics, Pydantic v2, transaction safety.
- Priority: 3
- Follow-up: How would you distinguish omitted from explicitly null?

### B10. Delete coroutine is never awaited

- Severity: High
- Diagnosis: CRUD deletion is declared `async`, but the sync route calls it without awaiting. The route reports success while no deletion occurs and emits a coroutine warning.
- Expected fix: Keep this database operation synchronous and call it normally, or make the route async and await it. With a synchronous SQLAlchemy session, the former is clearer.
- Skill tested: Async/sync boundaries, reading runtime warnings.
- Priority: 9
- Follow-up: Does marking a function async make blocking database work non-blocking?

### B11. Delete returns content with HTTP 204

- Severity: Medium
- Diagnosis: A 204 response must not contain a response body, yet the route returns a JSON object. Framework/version behavior may discard it or raise a protocol inconsistency.
- Expected fix: Return `Response(status_code=204)` with no body, or return a 200 response with the message.
- Skill tested: HTTP semantics and framework response behavior.
- Priority: 11
- Follow-up: When would 202 Accepted be appropriate for deletion?

### B12. CORS configuration does not match the dashboard or mutation methods

- Severity: High / integration blocker
- Diagnosis: The allowed origin is port 3001 while Next.js runs on 3000; allowed methods omit PATCH and DELETE. `FRONTEND_ORIGIN` exists but is unused.
- Expected fix: Read a correctly named origin from configuration and allow the required methods (explicitly or with a considered wildcard).
- Skill tested: Browser security model, preflight requests, environment configuration.
- Priority: 2
- Follow-up: Why might GET appear to work in some tools while browser mutations fail?

## Planted frontend and integration issues

### F1. Example environment points at the wrong backend port

- Severity: High / integration blocker
- Diagnosis: `.env.local.example` uses port 8001 while backend instructions specify 8000. Copying it makes all dashboard requests fail.
- Expected fix: Set `NEXT_PUBLIC_API_URL=http://localhost:8000` and restart Next.js after changing the environment.
- Skill tested: Configuration tracing, public Next.js environment variables.
- Priority: 1
- Follow-up: Why is a restart commonly required after changing `.env.local`?

### F2. Completed summary comparison is not a valid status

- Severity: High / build blocker and logic error
- Diagnosis: Code compares the `OrderStatus` union with `"complete"`, which TypeScript rejects; the API value is `"completed"`.
- Expected fix: Compare with `"completed"`.
- Skill tested: Reading compiler errors, discriminated string unions, contract consistency.
- Priority: 1
- Follow-up: How could shared/generated API types reduce this drift?

### F3. Customer name type uses camelCase while the API uses snake_case

- Severity: High / broken rendering and creation
- Diagnosis: `Order` and `CreateOrderInput` define `customerName`, while backend responses/requests use `customer_name`. List and detail render blank names; create sends an unrecognized field and omits the required one.
- Expected fix: Align types and all consumers to `customer_name`, or introduce explicit mapping at the API boundary.
- Skill tested: Type/API contract tracing, naming strategies.
- Priority: 3
- Follow-up: When is a mapping layer worth the extra code?

### F4. Create request omits the JSON Content-Type header

- Severity: High / core flow blocker
- Diagnosis: The body is JSON text but has no `Content-Type: application/json`, so FastAPI does not parse it as the expected model and returns 422.
- Expected fix: Add the header (typically through a reusable fetch helper).
- Skill tested: HTTP request construction, interpreting 422 responses.
- Priority: 2
- Follow-up: What request details would you inspect in browser DevTools?

### F5. API helpers accept any HTTP response as success

- Severity: High / misleading UI
- Diagnosis: None of the fetch helpers checks `response.ok`. Error payloads are treated as `Order` data, leading to success messages, corrupt local state, or confusing downstream crashes.
- Expected fix: Check `response.ok`, parse/report useful error details safely, and throw a consistent application error.
- Skill tested: Fetch semantics, defensive integration code, error propagation.
- Priority: 2
- Follow-up: Does `fetch` reject its promise for an HTTP 422 or 500?

### F6. Create form has no failure cleanup

- Severity: Medium
- Diagnosis: `handleSubmit` has no try/catch/finally. A rejected request leaves `submitting` true, provides no feedback, and may produce an unhandled rejection.
- Expected fix: Use try/catch/finally, display an actionable error, clear stale success state, and only reset on success.
- Skill tested: Async React event handling and resilient UX.
- Priority: 5
- Follow-up: Which errors should be shown verbatim to internal users?

### F7. Form numeric inputs permit invalid business values

- Severity: Medium
- Diagnosis: Quantity and unit price lack required/min constraints; `parseInt` can yield `NaN` or silently truncate a decimal quantity. Client-side validation does not match backend intent.
- Expected fix: Add `required`, suitable `min`/`step`, validate conversions, and still rely on server validation as authoritative.
- Skill tested: Form validation, JavaScript numeric conversion, layered validation.
- Priority: 7
- Follow-up: Why is frontend validation insufficient on its own?

### F8. Status update uses PUT instead of PATCH

- Severity: High / core flow blocker
- Diagnosis: Backend exposes PATCH only, while the client sends PUT, producing 405 (after CORS is fixed).
- Expected fix: Send PATCH and retain JSON headers/body.
- Skill tested: REST method semantics, comparing route definitions with client code.
- Priority: 4
- Follow-up: What behavioral difference do you expect between PUT and PATCH?

### F9. Optimistic status control has no error recovery

- Severity: Medium
- Diagnosis: The select awaits a mutation with no loading/disabled state or error handling. Rapid changes race, failures are invisible, and a malformed error response may replace the order.
- Expected fix: Track mutation state/error, prevent or sequence concurrent updates, and update state only on verified success.
- Skill tested: UI mutation state, race awareness, error UX.
- Priority: 8
- Follow-up: When would optimistic UI be suitable here?

### F10. Total order value ignores quantity

- Severity: Medium / incorrect metric
- Diagnosis: Summary adds unit prices instead of `quantity * unit_price`.
- Expected fix: Multiply each unit price by quantity, with an agreed money/rounding representation.
- Skill tested: Requirements reading, aggregation logic, money handling.
- Priority: 6
- Follow-up: Should cancelled orders contribute to total order value?

### F11. Initial list loading state is indistinguishable from an empty database

- Severity: Low / UI improvement
- Diagnosis: Orders begin as an empty array, so the dashboard briefly reports zeroes and “No orders” before the request completes. There is no retry path.
- Expected fix: Model loading/empty/error as distinct states and add a useful retry or refresh action.
- Skill tested: Async UI state modeling and polish.
- Priority: 10
- Follow-up: Would a skeleton, spinner, or retained data be best here?

### F12. Local state append can be stale and orders are inserted in the wrong position

- Severity: Medium
- Diagnosis: `setOrders([...orders, order])` closes over a render's `orders`, so closely spaced updates can be lost; it also puts the newest order last despite “Recent orders” and backend descending order.
- Expected fix: Use a functional update such as `setOrders(current => [order, ...current])`, or refetch/revalidate authoritative data after mutation.
- Skill tested: React state closures, cache consistency, ordering semantics.
- Priority: 9
- Follow-up: What are the tradeoffs between local updates and refetching?

## Suggested interviewer prioritization

Encourage this broad sequence without prescribing individual fixes:

1. Establish known-good startup commands and inspect compiler/runtime output.
2. Verify backend health and list endpoints independently of the browser.
3. Restore browser connectivity and render the list correctly.
4. Fix create and status-update paths end to end.
5. Address data integrity and partial-update correctness.
6. Correct summary calculations and improve loading/error UX.
7. Use remaining time for pagination, delete behavior, timestamping, and architectural cleanup.

High-value evidence includes terminal tracebacks, browser Network inspection, direct API calls/OpenAPI, focused tests, and small regression checks after each change.
