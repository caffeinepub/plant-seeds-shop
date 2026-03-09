# Plant Seeds Shop

## Current State
The shop has 60 products seeded in the backend across 6 categories. Product loading uses an `initAttempted` ref that gates initialization to run only once per React session. The `useActor` hook returns an actor for anonymous users without Internet Identity. Products are loaded via `useProductsByCategory` and `useAllProducts`, both gated on an `initDone` state flag.

## Requested Changes (Diff)

### Add
- Nothing new to add.

### Modify
- Fix the product loading logic in `App.tsx`: remove the `initAttempted` ref and `initDone` state gate. Instead, directly fetch products as soon as the actor is ready (no init gate). If the product list comes back empty, call `initialize()` then refetch. This ensures products always load regardless of session state or canister resets.
- Simplify `useProductsByCategory` and `useAllProducts` in `useQueries.ts` to not require an `initDone` parameter — always enabled when actor is present.

### Remove
- Remove `initAttempted` ref, `initDone` state, and the `useEffect` initialization block in `App.tsx`.
- Remove `initDone` parameter from `useAllProducts` and `useProductsByCategory` hooks.

## Implementation Plan
1. Update `useQueries.ts`: remove `initDone` param from `useAllProducts` and `useProductsByCategory`, always enable when actor is ready.
2. Update `App.tsx`: remove `initAttempted` ref, `initDone` state, and the init `useEffect`. Add a simpler `useEffect` that watches for actor + empty products and calls `initialize()` then invalidates queries. Pass no `initDone` to the hooks.
