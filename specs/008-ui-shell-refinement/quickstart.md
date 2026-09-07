# Quickstart: UI Shell Refinement

## Prerequisites

- Node.js and npm installed.
- Frontend dependencies installed in `frontend/`.
- A running backend and authenticated test account for protected workspace checks.

## Automated Validation

From the repository root:

```sh
cd frontend
npm run build
npm run lint
```

Expected result: TypeScript/Vite build succeeds and lint reports no new errors.

## Browser Validation

Start the frontend:

```sh
cd frontend
npm run dev
```

Open the reported local URL and sign in with a test account. Verify the following viewport classes:

| Class   | Example viewport | Checks                                                                            |
| ------- | ---------------: | --------------------------------------------------------------------------------- |
| Desktop |       1440 x 900 | Wider content area, Menu before Logo, visible Search, Profile at right, no footer |
| Laptop  |       1280 x 800 | No excessive side gap, no clipped top-bar controls, menu routes work              |
| Tablet  |       768 x 1024 | Menu/search adapt without horizontal scrolling; menu remains usable               |
| Mobile  |        390 x 844 | Menu + Logo + Search + Profile remain usable; no overlap or overflow              |

## Acceptance Walkthrough

1. On `/`, confirm there is no Overview heading, Overview navigation item, or empty Overview-sized gap.
2. Confirm the top bar reads visually as Menu, Logo, Search, Profile.
3. Open Menu and confirm it contains Skill Gap and Digital Passport only.
4. Confirm Find & Ingest is absent from the top bar and menu.
5. Select Skill Gap and verify `/skill-graph` loads; reopen Menu, select Digital Passport, and verify `/passport` loads.
6. Use keyboard focus to open Menu, reach both destinations, and dismiss the menu.
7. Scroll to the end of home, graph, passport, login, and registration screens and confirm there is no shared footer, footer border, or footer-sized empty region.
8. Resize or repeat at all four viewport classes and confirm no horizontal scroll, clipped controls, or overlap.

## References

- UI behavior contract: [contracts/ui-shell.md](contracts/ui-shell.md)
- Relevant transient state and route metadata: [data-model.md](data-model.md)
- Feature requirements: [spec.md](spec.md)
