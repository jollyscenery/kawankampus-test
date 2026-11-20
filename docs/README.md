# Kawan Kampus: Project Docs (README)

> Read this file first. It is the index, the decision log, and the source of truth for conventions.

## 1. Product summary

Kawan Kampus is a mobile-first, responsive **web app** that helps new university students find compatible friends, join communities, and register for campus events. Students pay nothing. Revenue comes from a commission on paid events run by external event organizers (EOs).

- **Current target:** a live demo in about 2 days (deadline stated on 2026-10-19; exact date and time: TBD).
- **Evaluation:** live demo, judged on how usable and viable the product is from a business point of view. Code quality is not graded.
- **Builder:** one person directing an AI coding agent (Antigravity). The team has 4 members, but only one builds.
- **Existing assets:** a rough React + Vite site with Firebase Authentication already connected; `DESIGN.md` (design system); the original Indonesian project plan ("Project Plan: Kawan Kampus").

## 2. Documents

| File | Read it when | Contains |
|---|---|---|
| `README.md` | Always first | Summary, decisions, glossary, conventions, global open questions |
| `prd.md` | You need to know WHAT to build and WHY | Problem, users, business model, features F-01..F-08 with acceptance criteria, journeys, screens, error states, metrics |
| `tech-spec.md` | You need to know HOW it is built | Stack, roles, Firestore schema, security rules draft, matching formula, demo payment flow, design notes |
| `implementation-plan.md` | You need to know the ORDER and the SCHEDULE | 2-day timeline, tasks with definition of done, cut order, demo script, risks |
| `build-prompts.md` | You are about to prompt the AI agent | Standing instructions and one prompt per feature |
| `DESIGN.md` | You are building any UI | Colors, typography, spacing, components (not duplicated in these docs) |

## 3. Decision log

| ID | Decision | Reason | Revisit when |
|---|---|---|---|
| D-01 | Web first: React + Vite (keep the language, JS or TS, that the existing code uses) | Rough code already exists; deadline is 2 days | After the demo |
| D-02 | Firebase: Authentication + Firestore. Firebase Hosting optional for a hosted demo URL | Already connected | Never for the demo |
| D-03 | **Zero Cloud Functions in the demo.** Matching runs client-side; payment is a demo button | Keeps cost and complexity minimal | When real payment is added |
| D-04 | **No full template.** Keep the existing codebase. Copying single UI components from a template is allowed if the license permits | Reconciling a template with existing code can cost more tokens than it saves | Only if the existing code is unusable |
| D-05 | Payment gateway integration is the last item (post-demo). Demo uses an "I have transferred (demo)" button, labeled DEMO everywhere | Decision deferred by the owner | After the demo |
| D-06 | Email verification is required. Any email provider is accepted | Owner decision | Before real students join |
| D-07 | Email verification does NOT prove a person is a student. Student verification is a later phase | Honest limitation to state in the demo | Phase 1 after the demo |
| D-08 | Matching is client-side, using dummy users only | Firestore has no ranking queries; real student data would need privacy controls | Before any pilot with real students |
| D-09 | Roles: `user`, `eo`, `admin`. EO and admin are assigned manually in the Firebase console | No EO verification flow in the demo | Phase 2 |
| D-10 | UI follows `DESIGN.md`. Stitch is not used | The design file and rough site already exist | Never for the demo |
| D-11 | Mobile later. Reusable: Firebase project, Firestore schema, security rules, the matching function (plain TypeScript/JavaScript). NOT reusable: React DOM UI components (React Native needs a separate UI). Cheaper alternatives to a full Expo rewrite: make the web app a PWA or wrap it with Capacitor [verify before committing] | Prevents a wrong assumption that "React = mobile ready" | After the demo |
| D-12 | One feature per AI prompt, each ending with a build, a test, and a commit | Limits token use and the blast radius of bad changes | Never |

## 4. Glossary

- **EO (event organizer):** an external organization or committee that runs events and sells tickets.
- **UKM:** Unit Kegiatan Mahasiswa, a student activity club.
- **BEM:** student executive body.
- **Tag / interest:** an item from a fixed interest list (see `tech-spec.md`).
- **Style scores:** three 1-5 sliders describing how a person likes to socialize (see `tech-spec.md`).
- **Match score:** 0-100% similarity between two users (see `tech-spec.md`).
- **Registration:** a user's claim on an event, with a status (`reserved`, `paid_demo`, `cancelled`, `checked_in`).
- **Demo payment:** a button that marks a registration as paid without moving any money.
- **Commission:** the percentage of ticket revenue Kawan Kampus keeps. Placeholder value only.
- **Connect (mutual):** a later feature where chat opens only after both users agree. Not in the demo.

## 5. Conventions

- **Feature IDs:** `F-01`, `F-02`, ... Priority: `P0` (must be in the demo), `P1` (build if time allows), `P2` (after the demo).
- **TBD:** an unresolved value is written as `TBD`. Never invent a value to fill a `TBD`; ask the owner.
- **Placeholder:** a value that is a working default but not researched is marked `PLACEHOLDER`.
- **Conflict rule:** this README's decision log wins over `prd.md` (scope), which wins over `tech-spec.md` (details), which wins over `implementation-plan.md` (order). `DESIGN.md` wins for anything visual.
- **Language:** docs and code identifiers in English. User-facing UI language: see Open Questions.
- **Demo data:** only invented dummy people. Never real student data.
- **Secrets:** no service account keys or private tokens in the repository. The Firebase web config is not secret, but security rules are the only protection for the data.

## 6. Open questions (global)

| # | Question | Default used until answered |
|---|---|---|
| Q-01 | Exact demo date and time | Assume the evening of 2026-10-21; feature freeze 6 hours before |
| Q-02 | UI language shown to evaluators (English or Indonesian) | English labels, kept in one place so they can be translated |
| Q-03 | Final interest tag list | The 15 tags proposed in `tech-spec.md` |
| Q-04 | Commission percentage | 10% PLACEHOLDER, not researched |
| Q-05 | Desktop layout | Answered: see "Desktop Layout" in `DESIGN.md` |
| Q-06 | Is the existing code JavaScript or TypeScript? Is it using Tailwind or another styling method? | The agent must check and follow what exists |
| Q-07 | Will the demo run from a laptop (localhost) or a hosted URL? | Both: host on Firebase Hosting as a backup |
