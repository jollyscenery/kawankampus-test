# Kawan Kampus: Implementation Plan (2-day demo)

Scope: ORDER, SCHEDULE, and DEFINITION OF DONE. Features are defined in `prd.md`; technical details in `tech-spec.md`.

## 1. Constraints

- One builder directing an AI coding agent. The deadline was stated on 2026-10-19 as "two days": the demo is expected on **Wed 2026-10-21**, exact time TBD (Q-01).
- Working time is the real limit. Count only the hours you will actually work. If you have fewer than the 14-16 hours of agent-assisted work below, cut from the end of the cut list (section 4), not from testing.
- **Feature freeze:** at least 6 hours before the demo. After the freeze, only bug fixes, seed data, and rehearsal.

## 2. Schedule

Times are estimates including your review of the agent's output (about 45-90 minutes per prompt).

| Block | When | Work | Prompts |
|---|---|---|---|
| B0 | Tue 20 Oct, morning (do first if not done) | Put docs into the repo (`docs/`, `DESIGN.md` at root). Audit existing code. Baseline rules and role model. | 0, 1 |
| B1 | Tue morning to midday | Email verification gate. Profile and onboarding. | 2, 3 |
| B2 | Tue afternoon | Matching with tests, seed script, Discover screen. Communities. | 4, 5 |
| B3 | Tue evening | Events browse, registration, demo ticket. Revenue view. | 6, 7 |
| Freeze check | Tue night | Run journeys J-01, J-02, J-03, J-06 end to end. Commit. | none |
| B4 | Wed 21 Oct, early | Event submission and admin approval (P1) only if B1-B3 are stable. | 8 |
| B5 | Wed, before the freeze | Polish against `DESIGN.md`, desktop layout, rules review, demo accounts, hosted backup. | 9 |
| Rehearsal | Wed, after the freeze | Two full run-throughs of the demo script. Record a backup video. | none |

## 3. Tasks and definition of done

| # | Task | Owner | Depends on | Done when |
|---|---|---|---|---|
| 0 | Audit existing code; list stack, routing, styling, Firebase setup | You + agent | none | A written summary exists; Q-06 answered; nothing changed |
| 1 | Baseline `firestore.rules` and role model; deploy rules | You + agent | 0 | The 5 rules test cases from `tech-spec.md` pass in the Rules Playground |
| 2 | F-01 verification gate and route guards | You + agent | 1 | F-01 acceptance criteria checked with a real inbox |
| 3 | F-02 profile and onboarding | You + agent | 2 | F-02 acceptance criteria checked |
| 4 | F-03 matching function, unit tests, seed script, Discover screen | You + agent | 3 | Tests pass (including the 67% example); Discover shows ranked seeded users |
| 5 | F-04 communities | You + agent | 3 | F-04 acceptance criteria checked |
| 6 | F-05, F-06 events and demo ticket | You + agent | 4 (seed) | F-05 and F-06 criteria checked, including the DEMO banner |
| 7 | F-08 revenue view | You + agent | 6 | Numbers on screen equal a manual calculation from 3 demo tickets |
| 8 | F-07 event submission and admin approval (P1) | You + agent | 6 | F-07 criteria checked with user, EO, and admin accounts |
| 9 | Polish, desktop layout, final rules review, hosted backup | You + agent | 7 | Journeys pass on a phone-width and a laptop-width window |

Every task ends with: build passes, tests pass, the change is committed, and the agent has reported what it tested and what it did not.

## 4. Cut order (if behind schedule)

Cut from the top of this list first:
1. Hosted backup URL (keep localhost).
2. Polish beyond the main screens.
3. F-07 admin approval page (events stay seeded; mention that approval is designed in the data model).
4. Community member list detail (keep join and count).
5. Profile optional fields (major, year, bio, photo).

Never cut: email verification (owner requirement), matching with tests, event registration with demo ticket, revenue view, security rules testing, the DEMO banner.

## 5. Testing checkpoints

- After tasks 1, 4, and 9: test security rules cases in the Rules Playground.
- After tasks 2, 6, and 7: run the relevant journey by hand with a fresh account.
- Freeze check: run J-01, J-02, J-03, J-06 in order on a fresh browser profile (no cached login).
- Before the demo: clear stale test data that would confuse the story (test events, duplicate registrations), but keep the seeded data.

## 6. Demo preparation

**Accounts (create and verify them before the demo, not live).** Use real inboxes you control; Gmail plus-aliases work.
- `demo-student`: verified, onboarded, role `user`.
- `demo-eo`: verified, onboarded, role set to `eo` in the Firestore console; organizer of the seeded events.
- `demo-admin`: verified, onboarded, role set to `admin` in the console.
- `demo-unverified`: signed up but not verified, to show the verification gate without waiting for email.

**Backup plan.** Run locally, have a hosted copy if available, and keep a screen recording of the full flow. Know how to reset a demo registration in the console.

**Demo script (6-8 minutes).**
1. The problem in one sentence, from `prd.md` section 1 (30 s).
2. Show the verification gate with `demo-unverified`, then log in as `demo-student` (45 s).
3. Discover: ranked friends, match percentages, and shared interests; explain the formula in one sentence (60 s).
4. Join a community (30 s).
5. Register for a paid event and press "I have transferred (demo)" (60 s).
6. Switch to `demo-eo`: the revenue view shows the ticket and the commission (60 s).
7. If F-07 is done: submit an event as a user and approve it as `demo-admin` (60 s).
8. Business close: revenue model, cold-start plan, roadmap, and what is real vs. simulated (90 s). Use the lists in `prd.md` sections 3 and 4.

**Questions to prepare answers for.** What happens with real payments (section 7 of `tech-spec.md`)? How do you prove users are students (Phase 1: campus email or ID card review)? How do you keep users safe (mutual connect, report, block, moderation)? How do you get the first users and EOs (seeding through orientation committees, BEM, UKM)? What is the commission and why (placeholder until market research; gateway fees may eat much of it on cheap tickets)?

## 7. Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| The agent breaks the existing auth code | Medium | High | Commit before every prompt; audit first; one feature per prompt |
| Security rules lock everyone out, or are too open | Medium | High | Test the 5 cases; deploy rules early, not on demo day |
| Verification email is delayed or spam-filtered | Medium | Medium | Pre-verified accounts; the unverified account is for the gate screen only |
| Scope too large for the available hours | High | High | Cut order in section 4; the freeze rule |
| Demo laptop, network, or Firebase issue on the day | Medium | High | Backup video; hosted copy; test the venue setup if possible |
| Desktop layout looks broken (DESIGN.md has no desktop spec) | Medium | Medium | Check it explicitly in task 9 |
| Agent token or rate limits run out mid-build | Medium | Medium | Short, focused prompts; do not paste whole files; commit often |
| Evaluators probe the business case beyond the demo | Medium | Medium | Prepare the questions in section 6; do not claim interview results that do not exist |
