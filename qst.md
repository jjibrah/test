# Junior Software Engineer Debugging Interview

## Scenario

You have inherited a small internal Orders application consisting of:

- A Python and FastAPI backend
- A Next.js and TypeScript frontend
- A SQLite database

The application is intended for an internal operations team. It should allow users to view orders, create new orders, inspect an individual order, update an order's status, and see summary metrics.

The project should already run or be close to running, but it contains multiple realistic issues. There are intentionally more issues than you are expected to fix during the interview.

## Your task

You have **60 minutes** to:

1. Get the backend and frontend running.
2. Explore the application and identify the most important problems.
3. Fix as many meaningful issues as possible.
4. Verify your fixes as you work.
5. Make one small improvement to the dashboard.

## Expected application behavior

An operations user should be able to:

- View a list of orders
- Create a new order
- View an individual order
- Update an order's status
- See the total number of orders
- See pending and completed order counts
- See the total order value

The backend should expose order CRUD endpoints and a health endpoint.

## Interview expectations

Please think aloud throughout the exercise. For each problem, explain:

- What you observed
- What you think may be causing it
- How you plan to test your hypothesis
- What evidence you found
- Why you chose your proposed fix
- How you verified that the change worked

You are not expected to fix everything. Prioritization, debugging process, and communication are more important than completing every issue.

You may:

- Inspect all source files
- Use the terminal
- Run automated tests
- Call API endpoints directly
- Use browser developer tools
- Consult framework documentation when appropriate

Avoid large rewrites unless you can clearly justify them. Prefer focused changes that address verified problems.

## Starting point

The project contains two folders:

```text
orders-api
orders-dashboard
```

Begin by inspecting the repositories and their README files. Start your 60-minute timer when you are ready.
