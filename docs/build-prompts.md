# Kawan Kampus: Build Prompts for the AI Coding Agent

Use one prompt per session or task. Paste the **Standing instructions** at the top of each prompt. Commit your work before running a prompt so that a bad result can be reverted.

Antigravity may or may not load a project instruction file automatically; I could not verify how it does this [Low confidence, check its documentation]. Until verified, paste the standing instructions into every prompt.

Put these files in the repository first: `docs/README.md`, `docs/prd.md`, `docs/tech-spec.md`, `docs/implementation-plan.md`, `DESIGN.md`.

## Standing instructions (paste at the top of every prompt)

```
You are working on Kawan Kampus, a React + Vite + Firebase web app.
Before changing anything, read docs/README.md, docs/tech-spec.md, and only the
parts of docs/prd.md for the feature named below. Read DESIGN.md before any UI work.

Rules:
1. Do only the task named below. Do not refactor or restyle unrelated files.
2. Start with a short plan: the files you will create or modify. Then implement.
3. Follow the existing code style, language (JS or TS), and styling method.
4. Do not add a dependency without saying why in your final report.
5. Never put secrets, service account keys, or private tokens in the repo.
6. UI must follow DESIGN.md through tokens (CSS variables), not hardcoded hex values.
7. Use the exact collection names, field names, statuses, and formulas in docs/tech-spec.md.
8. If the docs are missing information or contradict each other, stop and ask. Do not guess.
9. When done, run the build and the tests. Report: files changed, what you tested,
   what you did not test, and anything that deviates from the docs.
10. Do not claim something works unless you ran it.
```

## Prompt 0: Audit the existing code (no code changes)

```
Task: audit only. Do not modify any file.
List: the language (JS or TS), the router, the styling method, the Firebase setup
(which services are initialized, where the config lives), the folder structure,
existing routes and screens, and how auth state is handled.
Compare with docs/tech-spec.md section 2 and list what is missing or conflicting.
Answer open question Q-06 from docs/README.md.
Output a short summary only.
```

## Prompt 1: Security rules and role model (review before accepting)

```
Task: baseline security and roles. Stop after your plan and wait for approval before editing.
1. Create firestore.rules from the draft in docs/tech-spec.md section 5. Fix any
   syntax errors you find and tell me what you changed.
2. Add a firebase.json entry for the rules if it is missing.
3. Do not touch any UI.
4. In your report, list the 5 rules test cases from section 5 as a checklist that I
   will run in the Firebase Rules Playground.
```

## Prompt 2: F-01 email verification gate

```
Task: implement F-01 from docs/prd.md.
Use docs/tech-spec.md section 3. Include: sign up, send verification email, /verify
screen with Resend (60 s cooldown) and "I have verified" (reload the user and force
a token refresh with getIdToken(true)), route guards that keep unverified users on
/verify, login, logout, and clear error messages. Do not build profile or onboarding yet.
```

## Prompt 3: F-02 profile and onboarding

```
Task: implement F-02 from docs/prd.md.
Fields and rules: docs/tech-spec.md section 4 (users) and the tag list in section 8.
Onboarding creates the users/{uid} document with role "user" and onboardingComplete
true. Sliders 1-5 with labeled ends. Add an edit-profile screen. The client must never
send a role other than "user". Add route guards: verified but not onboarded goes to /onboarding.
```

## Prompt 4: F-03 matching, seed script, Discover (two steps)

Step 4a:
```
Task: implement the matching function only, with tests.
Create src/config/matching and src/lib/matching exactly as specified in
docs/tech-spec.md section 6. Use Vitest. Write all the tests listed there, including
the worked example that must give 67%. No UI in this step. Show me the test output.
```
Step 4b:
```
Task: seed script and Discover screen (F-03 in docs/prd.md).
1. Create scripts/seed.mjs using the Firebase Admin SDK, as described in
   docs/tech-spec.md section 9: 12 invented students (isDemo true), 4 communities
   with a few members, and 5 approved events. The service account key path comes from an
   environment variable; add the key file pattern to .gitignore; never commit a key.
   Use the demo EO uid from an environment variable for organizerId.
2. Build the Discover screen with the card layout and the empty state from F-03.
Do not run the seed script against production data without telling me; tell me the
command to run it.
```

## Prompt 5: F-04 communities

```
Task: implement F-04 from docs/prd.md using docs/tech-spec.md section 4.
List, create, detail with member list, join and leave, member count through a count
query on the members subcollection. Empty states from docs/prd.md section 8.
```

## Prompt 6: F-05 and F-06 events and demo ticket (review before accepting)

```
Task: implement F-05 and F-06 from docs/prd.md.
Use docs/tech-spec.md sections 4, 5 (query constraints), and 7.
Registration must write the registration document and the attendee document in one
batch, with the deterministic id eventId_uid. Copy priceIdr and organizerId from the
event. Capacity check: count the attendees subcollection before registering; accept
that it can oversell. The ticket page shows the "Payment (DEMO)" card with the
"I have transferred (demo)" button and a visible DEMO MODE banner. Cancel deletes the
attendee document. Format money as "Rp 25.000". Stop after your plan and wait for approval.
```

## Prompt 7: F-08 revenue view

```
Task: implement F-08 from docs/prd.md.
COMMISSION_RATE comes from src/config/app. Only paid_demo registrations count. EO
queries use where organizerId == uid; admin has no filter. Show the PLACEHOLDER rate
label and the "Demo figures. Gateway fees not included." note. Add a unit test for the
revenue calculation using 3 sample tickets.
```

## Prompt 8: F-07 event submission and admin approval (P1)

```
Task: implement F-07 from docs/prd.md.
A create-event form; status is "pending" for role user and "approved" for role eo;
a "My events" screen showing status; a minimal /admin/events page with Approve and
Reject (optional reason). The UI guard is not enough: verify the matching security
rules in docs/tech-spec.md section 5 and tell me if any change is needed.
```

## Prompt 9: Polish and final review

```
Task: polish and review. No new features.
1. Check every screen against DESIGN.md. Fix spacing, typography, and component
   styles. Check the desktop layout assumption in docs/tech-spec.md section 10.
2. Review firestore.rules against the code: list every Firestore query in the app and
   confirm each one satisfies the rules (the constraints listed in section 5).
3. Check empty and error states from docs/prd.md section 8.
4. Report anything that does not match the docs. Do not silently change behavior.
```

## Prompt 10: Real payment gateway (after the demo, not before)

Do not run this before the demo. When you do, add the new requirements to `tech-spec.md` first (server-side transaction, signature-verified webhook, idempotent status update, removal of the DEMO_ONLY rule), then prompt the agent against that updated spec.

## Tips for saving tokens

- Do not paste whole files into prompts; refer to the docs by path.
- Keep each prompt to one feature, and use the two-step split for prompt 4.
- If the agent starts rewriting unrelated files, stop it, revert, and repeat the prompt with "touch only these files: ...".
- Commit after every successful prompt. Revert instead of asking the agent to undo.
