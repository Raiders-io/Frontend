# Search Flow Implementation Plan

This document tracks the work needed to support navbar search previews and a full search-results page.

## State Legend

- `DONE`: already available in the current codebase.
- `IN PROGRESS`: partially available and needs completion.
- `TODO`: not implemented yet.
- `BLOCKED`: cannot be completed until a dependency or contract is confirmed.

## Steps

### 1. Confirm the backend search contract

**State:** `BLOCKED`

Verify that `/api/v1/search` supports the parameters and response shape required by the UI:

- Search text.
- Resource filtering (`lesson`, `user`, `exam`, or supported alternatives).
- Tags.
- Sorting and direction.
- Pagination (`page` and `limit`).
- A response containing result items and pagination metadata.

The existing frontend service is `src/services/lesson_service.ts` and currently exposes `lessonService.searchLessons`.

**Completion criteria:** The accepted request parameters and response fields are documented or confirmed against the backend.

### 2. Define shared search types

**State:** `TODO`

Create shared TypeScript types for:

- Search query parameters.
- Resource options.
- Serialized search results (`kind` plus typed `data`).
- Preview results.
- Pagination metadata.

Avoid using `any` in `src/pages/search.tsx` and keep the result type compatible with `PaginatedGrid`.

**Completion criteria:** The navbar preview and full results page use the same query and result types.

### 3. Add the `/search` route

**State:** `TODO`

Register `src/pages/search.tsx` in `src/utils/router/index.tsx`.

The route must be directly loadable and must accept query parameters from the URL.

**Completion criteria:** Navigating to `/search` renders the search page instead of the not-found page.

### 4. Implement the full search-results page

**State:** `IN PROGRESS`

Complete `src/pages/search.tsx` by:

- Reading search parameters from React Router.
- Calling `lessonService.searchLessons`.
- Tracking loading, error, results, and pagination state.
- Mapping API data to the serialized result format.
- Rendering `PaginatedGrid` with all required props:
  - `items`
  - `renderItem`
  - `getKey`
  - `loading`
  - `limit`
- Rendering pagination controls from the API metadata.

The current empty `<PaginatedGrid>` is the source of the `PaginatedGripProps` TypeScript error because required props are missing.

**Completion criteria:** A valid search URL displays real results, loading states, empty states, errors, and pagination.

### 5. Add URL-based query state

**State:** `TODO`

Use URL parameters as the source of truth for the submitted search:

```text
/search?search=algebra&resource=lesson&sort=title&direction=asc&page=1
```

Preserve the selected resource, tags, sorting, and page when navigating or refreshing the page.

Reset the page to `1` whenever the submitted query or filters change.

**Completion criteria:** Refreshing or sharing a search URL produces the same result set and filter state.

### 6. Add Enter submission in the navbar search

**State:** `TODO`

Extend the navbar search flow so Enter submits the current query and filters instead of only relying on the debounce callback.

On submit:

- Build the search URL.
- Navigate to `/search`.
- Close any open preview dropdown.
- Preserve resource, tags, sorting, and direction.

The existing input is implemented in `src/components/homemade/searchbar_addons/searchbar_input.tsx`; the submit behavior should be owned by `CustomSearchBar`.

**Completion criteria:** Pressing Enter from the navbar opens the full results page with the current search state.

### 7. Fetch debounced preview results

**State:** `TODO`

When the user types:

- Debounce the request by the existing delay or a clearly defined delay.
- Request a small preview limit, such as five results.
- Avoid fetching for an empty or whitespace-only query unless the product explicitly requires it.
- Show loading, result, empty, and error states.
- Ignore or cancel stale requests when a newer query is entered.

The existing 300 ms debounce in `src/components/search/CustomSearchBar.tsx` can be reused.

**Completion criteria:** Typing a query displays current preview results without stale responses replacing newer results.

### 8. Build the preview dropdown

**State:** `TODO`

Render the preview below the navbar search input:

- Use compact result rows rather than the full paginated grid.
- Render each supported result type appropriately.
- Provide a final `View all results` action.
- Allow selecting a result to navigate directly to it.
- Close on Enter, Escape, outside click, or selection.
- Keep the dropdown usable on small screens.

**Completion criteria:** The preview is keyboard accessible, does not change navbar layout unexpectedly, and exposes a clear path to the full results page.

### 9. Connect resource-specific result rendering

**State:** `BLOCKED`

The navbar currently exposes `all`, `lesson`, `user`, and `exam`, but the known service is named `searchLessons` and the current result renderer only handles `lesson`.

Confirm whether the backend returns all resource types or whether separate services are required for users and exams.

**Completion criteria:** Every selectable resource either renders correctly or is disabled/labeled as unsupported until its API exists.

### 10. Add loading, empty, and error UI

**State:** `IN PROGRESS`

Reuse existing skeleton and empty-state patterns where appropriate:

- Preview loading state.
- Full-page loading state.
- Preview empty state.
- Full-page empty state.
- Request error with retry or a clear failure message.

`PaginatedGrid` already provides a basic loading and no-results state, but the search page still needs to pass valid state and handle request errors.

**Completion criteria:** No state renders a blank or broken search area.

### 11. Validate keyboard and navigation behavior

**State:** `TODO`

Test the following behavior manually and with automated tests where available:

- Type a query and see preview results.
- Continue typing while a request is pending.
- Press Enter to open full results.
- Press Escape to close the preview.
- Click outside the preview.
- Select a preview result.
- Open a copied search URL directly.
- Change page while preserving filters.
- Search with no results.
- Handle a failed API request.

**Completion criteria:** The navbar and full results page behave consistently across mouse and keyboard interactions.

## Current Implementation Summary

| Area | State | Current evidence |
| --- | --- | --- |
| Navbar search input | `DONE` | `CustomSearchBar` and `SearchBarInput` exist. |
| Debounced input value | `DONE` | `CustomSearchBar` updates `debouncedSearch` after 300 ms. |
| Search API wrapper | `IN PROGRESS` | `lessonService.searchLessons` exists, but the navbar only logs parameters. |
| Preview results | `TODO` | No preview request or dropdown exists. |
| Enter navigation | `TODO` | No submit handler or `/search` navigation exists. |
| Search route | `TODO` | `src/pages/search.tsx` exists but is not registered in the router. |
| Full results fetching | `TODO` | `search.tsx` has no API request. |
| Paginated grid wiring | `IN PROGRESS` | `PaginatedGrid` exists, but `search.tsx` passes no required props. |
| Resource-specific results | `BLOCKED` | Only lesson rendering and lesson search service are currently known. |
| Pagination | `DONE` / `TODO` | Pagination components exist; search-page state and API wiring are missing. |
| Error handling | `TODO` | Search requests are not currently handled by the navbar or search page. |
