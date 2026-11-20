# Kawan Kampus: Product Requirements (PRD + App Flow)

Scope of this file: WHAT the product does and WHY. Technical details are in `tech-spec.md`. Order and schedule are in `implementation-plan.md`.

## 1. Problem and goal

**Problem.** New university students struggle to find friends with compatible interests or character. Today they rely on class WhatsApp groups, student clubs (UKM), and Instagram.

**Goal of the product.**
- A new user gets friend recommendations in their first session.
- Users can create and join communities, and register for events, including paid ones.

**Goal of the 2-day demo.** Show a working end-to-end prototype that makes the business case clear: a two-sided platform (students and event organizers) where revenue comes from commission on paid events.

## 2. Users and roles

| Role | Who | Can do |
|---|---|---|
| `user` | A new student with a verified email | Complete profile, see recommendations, create/join communities, browse events, register, hold a demo ticket, submit an event for approval |
| `eo` | A verified event organizer (set manually) | Everything a user can, plus publish events without approval and see revenue for own events |
| `admin` | The Kawan Kampus team (set manually) | Approve or reject submitted events, see revenue across all events |

An unverified email can only see the sign-up, login, and "verify your email" screens.

## 3. Business model and value (for the evaluators)

**Two-sided value.**
- Students: find compatible friends and relevant events in one place, free of charge.
- EOs: reach students who opted in with interests, and collect registration and payment in one flow.

**Revenue model (from the project plan).**
- Students pay nothing. No ads.
- Commission on registration fees of paid events from external EOs. Real payments (via Midtrans) come after the demo.
- Optional EO subscription tier (analytics, featured events), only after the platform proves itself.

**What the demo shows about revenue.** A revenue view where `commission = sum of paid_demo ticket prices x commission rate`. The commission rate is a PLACEHOLDER (10%) until market research is done. Payment gateway fees are ignored in the demo. In production they can consume most of the commission on cheap tickets, and who bears them (EO, attendee, or Kawan Kampus) is TBD.

**Cold start (two-sided problem).** The app is useless without students, and EOs will not join without students. Mitigation from the plan: launch in one campus and one cohort, seed users through orientation committees, BEM and UKM, and help EOs create their first events.

**Pilot plan (from the project plan).** Closed beta with 20-50 students, then one cohort, then other campuses. Success numbers are TBD until the pilot.

**Evidence status.** The project plan lists interviews (8-10 new students, 3-5 EOs) as to-do items. This document does not claim any interview results. If interviews have been done, add the findings here: TBD.

**What is real vs. simulated in the demo (state this out loud).**
- Real: email verification, profile, matching math, communities, event listing and registration, role-based access.
- Simulated: payment (a button), revenue (computed from demo tickets), EO and admin roles (assigned by hand), student status (email verification does not prove it).
- Not built: chat/connect, push notifications, report/block, EO verification, real payments, QR check-in.

**Known weakness to prepare for.** A recommendation card has no action after it (no connect or chat) because mutual connect, report, and block are Phase 1. Reason to give: friendship features with real identities carry stalking and harassment risk, so they ship together with moderation, not before.

## 4. Scope

### P0 (must be in the demo)
F-01 Auth and email verification, F-02 Profile and onboarding, F-03 Friend recommendations, F-04 Communities, F-05 Events (browse), F-06 Event registration and demo ticket, F-08 Revenue view.

### P1 (build if time allows)
F-07 Event submission, admin approval, and EO auto-approval.

If F-07 is cut, events are seeded by hand and approved in the database.

### Non-goals (explicitly NOT in this version)
- Real payment gateway, refunds, payouts, tax handling
- Chat, mutual connect, push notifications
- Report, block, content moderation
- Student verification (campus email, student ID card)
- EO verification flow and EO subscription tiers
- QR tickets and check-in (`checked_in` status exists but is unused)
- Ticket tiers, discount codes, waitlists
- Native mobile app (see decision D-11 in `README.md`)
- Real student data (dummy data only)
- Analytics beyond the simple revenue view

## 5. Features

Each feature lists a user story and acceptance criteria (AC). A feature is done only when every AC is checked.

### F-01 Auth and email verification (P0)
**Story:** As a new student, I sign up with email and password and verify my email so that I can use the app.
- [ ] Sign up with email and password creates an account and sends a verification email.
- [ ] After sign-up the user sees a "Verify your email" screen with "Resend email" and "I have verified" actions.
- [ ] While unverified, the user cannot reach any other screen and cannot read or write Firestore data.
- [ ] After verification and a token refresh, the user continues to onboarding without logging in again.
- [ ] Login and logout work. Wrong password and unknown email show a clear error.
- [ ] Resend is rate-limited in the UI (disable the button for 60 seconds after a send).

### F-02 Profile and onboarding (P0)
**Story:** As a verified user, I fill in my interests and style so that I can get recommendations.
- [ ] Onboarding is shown until the profile is complete (`onboardingComplete = true`).
- [ ] Required: display name, at least 1 interest tag, and all three style scores.
- [ ] Optional: major, year of study, short bio (max 200 characters), photo URL.
- [ ] Style inputs are 1-5 sliders with clear labels at both ends (see `tech-spec.md`).
- [ ] The user can edit the profile later. A user can never change their own role.

### F-03 Friend recommendations (P0)
**Story:** As a user with a complete profile, I see other students ranked by compatibility.
- [ ] Discover shows other onboarded users sorted by match score (highest first), max 20.
- [ ] Each card shows name, major, match percentage, and the shared interest tags.
- [ ] Users with zero shared interests are not shown.
- [ ] The current user never appears in their own list.
- [ ] Empty state if no matches: explains that the user may need more interests, with an "Edit profile" button.
- [ ] The scoring formula follows `tech-spec.md` exactly and is covered by unit tests.

### F-04 Communities (P0)
**Story:** As a user, I create or join communities around an interest.
- [ ] List of communities with name, description, and member count.
- [ ] Any verified user can create a community (name required, description optional).
- [ ] Joining is open (no approval). Join and leave are one tap each.
- [ ] Community detail shows description and the member list (display names).
- [ ] Empty state if there are no communities, with a "Create community" button.

### F-05 Events: browse (P0)
**Story:** As a user, I browse upcoming approved events.
- [ ] List shows only `approved` events, soonest first, with title, date, location, and price ("Free" or "Rp X").
- [ ] Event detail shows description, organizer name, date, location, price, capacity, and spots taken.
- [ ] Empty state if no events.

### F-06 Event registration and demo ticket (P0)
**Story:** As a user, I register for an event and pay (demo) to receive a ticket.
- [ ] "Register" creates a registration with status `reserved`. One registration per user per event.
- [ ] If the event has a capacity and spots taken has reached it, registration is blocked with a "Full" message. This check is client-side and can oversell under simultaneous registration (accepted limitation for the demo).
- [ ] For a paid event, the ticket page shows a "Payment (DEMO)" card with an "I have transferred (demo)" button. Pressing it sets `paid_demo` and shows a "PAID (DEMO)" badge.
- [ ] A free event is confirmed immediately (`reserved` is displayed as "Registered").
- [ ] "My tickets" lists the user's registrations with status.
- [ ] The user can cancel a registration (`cancelled`).
- [ ] A visible "DEMO MODE: no real payment" banner appears on every payment screen.

### F-07 Event submission and admin approval (P1)
**Story:** As a user, I submit an event. As an admin, I approve or reject it. As a verified EO, my events publish immediately.
- [ ] A "Create event" form: title, description, location, date and time, price (0 = free), capacity (optional).
- [ ] An event from a `user` is saved as `pending` and does not appear in the public list.
- [ ] An event from an `eo` is saved as `approved`.
- [ ] A minimal admin page lists `pending` events with Approve and Reject (optional reason).
- [ ] The submitter sees the status of their own events.
- [ ] The admin page is not reachable by non-admins (UI guard and security rules).

### F-08 Revenue view (P0)
**Story:** As an EO or admin, I see ticket sales and the simulated commission.
- [ ] Table per event: title, price, paid tickets, gross revenue, commission, EO net.
- [ ] Totals row. Admin sees all events; an EO sees only own events.
- [ ] Only `paid_demo` registrations count toward revenue.
- [ ] The commission rate is read from one config value and shown on screen with the label "PLACEHOLDER rate".
- [ ] A note on screen: "Demo figures. Gateway fees not included."

## 6. User journeys

| ID | Journey | Steps | Outcome |
|---|---|---|---|
| J-01 | New student happy path | Sign up, verify email, onboarding (interests and style), Discover | Sees ranked recommendations |
| J-02 | Join a community | Communities, open one, Join | Appears in the member list |
| J-03 | Buy a ticket (demo) | Events, event detail, Register, ticket page, "I have transferred (demo)" | Ticket shows PAID (DEMO) |
| J-04 | EO publishes an event | Log in as EO, Create event | Event is visible immediately |
| J-05 | User proposes an event | Log in as user, Create event, status pending; admin approves | Event becomes public |
| J-06 | EO checks revenue | Log in as EO, Revenue | Sees paid tickets and commission |
| J-07 | Unverified user is blocked | Sign up, try to open a page | Redirected to the verify screen |

The happy path that the whole demo must support is J-01, J-02, J-03, J-06 in that order.

## 7. Screens

| Screen | Route (suggested) | Purpose | Roles |
|---|---|---|---|
| Sign up | `/signup` | Create account | Public |
| Log in | `/login` | Authenticate | Public |
| Verify email | `/verify` | Gate until verified | Signed in, unverified |
| Onboarding | `/onboarding` | Interests and style | Verified, not onboarded |
| Discover | `/` | Recommendations | Verified, onboarded |
| Profile | `/profile` | View and edit profile | Verified, onboarded |
| Communities | `/communities` | List and create | Verified, onboarded |
| Community detail | `/communities/:id` | Info, join/leave, members | Verified, onboarded |
| Events | `/events` | Approved events | Verified, onboarded |
| Event detail | `/events/:id` | Info and Register | Verified, onboarded |
| My tickets | `/tickets` | Registrations and demo payment | Verified, onboarded |
| Create event | `/events/new` | Submit an event (F-07) | Verified, onboarded |
| My events | `/events/mine` | Status of submitted events (F-07) | Verified, onboarded |
| Admin: pending | `/admin/events` | Approve or reject (F-07) | `admin` |
| Revenue | `/revenue` | Sales and commission | `eo`, `admin` |

Navigation: bottom tab bar below 1024 px, top bar from 1024 px (see `tech-spec.md`, design notes).

## 8. Error and empty states

| Situation | Behavior |
|---|---|
| No network or Firestore error | Inline error with a "Try again" button; never a blank screen |
| Verification email not received | "Resend" button; hint to check the spam folder |
| Email already in use | Message with a link to log in |
| Weak password | Show the rule (Firebase minimum is 6 characters) |
| No recommendations | Explain why, link to edit profile |
| No communities or events | Empty-state illustration or text with a primary action |
| Event full | Disable Register and show "Full" |
| Already registered | Show the existing ticket instead of the Register button |
| Permission denied (rules) | "You don't have access to this page", link back home |
| Payment screens | Always show the DEMO banner |

## 9. Success metrics

| Metric | Demo | Pilot |
|---|---|---|
| Journeys J-01, J-02, J-03, J-06 run end to end without errors in rehearsal | Required | n/a |
| Share of new users connected with at least one friend within 7 days | n/a | TBD (needs the connect feature) |
| Share of users who join at least one community | n/a | TBD |
| Paid registrations per event | n/a | TBD |
| EOs willing to use the platform and pay commission | n/a | TBD (interviews needed) |

## 10. Risks relevant to the product (from the project plan)

- **User safety:** friendship with real identities invites stalking and harassment. Mutual connect, report, block, and moderation are required before real students join.
- **Privacy:** the app processes personal data. Check obligations under Indonesia's personal data protection law (UU No. 27 Tahun 2022), including user consent. Some new students may be under 18. Needs legal verification.
- **EO fraud:** fake organizers collecting fees. Needs EO verification and delayed payouts.
- **Conflict of interest:** paid or sponsored events must not influence match results and must be labeled.
- **Payments:** a paid status must come only from a verified server notification, never from the client. The demo button is deliberately insecure and labeled as such.
- **Merchant registration:** real payments need a Midtrans merchant account, which may require business identity documents. Start this check early.

## 11. Assumptions and open questions

Assumptions: see `README.md` section 6 (Q-01 to Q-07). Additional:
- A-01: Evaluators see only the live demo and the presentation, not the code.
- A-02: Dummy data represents roughly 12 invented students, 4 communities, and 5 events (see `tech-spec.md`).
- A-03: The commission rate and ticket prices in demo data are illustrative, not market data.
