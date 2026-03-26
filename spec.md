# GreenSprout Seeds

## Current State
Full e-commerce plant seeds app with shop, cart, checkout, admin portal, and seasonal trending. Navigation has Home, Shop, About links. AppView type covers shop, admin-login, admin-dashboard, user-login.

## Requested Changes (Diff)

### Add
- A new "Dating" page accessible from the main navigation bar
- DatingPage component with 6 profile cards (Sarah, James, Priya, Arjun, Emily, Rahul) each showing a generated photo, name, age, interests (plant/nature themed), and a "Connect" button
- AppView extended with "dating" value

### Modify
- App.tsx: extend AppView type to include "dating"
- Nav bar: add "Dating" link alongside Home, Shop, About
- Main render: show DatingPage when appView === "dating"

### Remove
- Nothing removed

## Implementation Plan
1. Create src/frontend/src/components/DatingPage.tsx with profile cards grid
2. Update App.tsx: add "dating" to AppView, add nav link, render DatingPage on that view
