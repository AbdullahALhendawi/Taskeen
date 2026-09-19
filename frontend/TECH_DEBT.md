# Tech Debt & Known Trade-offs

This file tracks deliberate shortcuts, simplifications, or "good enough for now"
decisions made during development — so nothing gets forgotten, and every choice
can be explained and revisited later.

---

## Frontend

### 1. Alert system inconsistency
**What:** We built a proper Toast notification system (`ToastContext.tsx`) to
replace the browser's default `alert()` popups. Only one `alert()` call was
actually converted before we paused to move on to backend work.
**Why deferred:** Wanted to test the Toast pattern on one case first before a
full sweep; ran out of time before the full conversion.
**To fix:** Go through `DataContext.tsx` and remaining pages, replace every
`alert()`/`confirm()` with `showToast()` (confirm() calls need a different
solution — a custom confirm dialog component, not just a toast).

### 2. No automated tests
**What:** Every feature (assign/unassign, cascading delete, renumbering, etc.)
has been tested manually by clicking through the app, not with unit or
integration tests.
**Why deferred:** Prioritized building and validating features quickly given
time constraints; original plan allocated dedicated testing time on Day 4.
**To fix:** Add unit tests for the business logic in `DataContext.tsx`
(occupancy calculation, renumbering logic, validation rules) once the
equivalent logic moves to the backend.

### 3. `findNearestEmptyBed()` is a linear scan
**What:** This function loops through every building → floor → apartment →
room → bed in order until it finds an empty one. Fine for small test data.
**Why deferred:** Correct and simple; performance only matters at a scale
we're not testing at yet.
**To fix:** If building sizes grow large, this should be replaced with a
more efficient lookup (e.g. a pre-maintained list/index of empty beds)
rather than scanning everything each time.

### 4. Frontend runs on in-memory Context, not a real API
**What:** All data (buildings, floors, residents, etc.) lives in React
Context/state, reset on every page reload. This was the deliberate Day 1
plan — build and validate UI logic before building the real backend.
**Why deferred:** Intentional, not a mistake — matches the project's
"Frontend-First Strategy."
**To fix:** Day 3 work — replace all `DataContext` calls with real API
calls to the ASP.NET Core backend once it exists.

---

## Backend

*(Entries will be added here as we build, starting now.)*