# Kawan Kampus: Technical Specification

Scope: HOW the demo is built. Behavior and acceptance criteria live in `prd.md`. If this file conflicts with `README.md` decisions or `prd.md` scope, those win.

## 1. Stack

| Layer | Choice | Reason | Known limitation |
|---|---|---|---|
| Frontend | React + Vite (follow the existing code: JS or TS, styling method: TBD, Q-06) | Rough site already exists | Not reusable as UI in React Native |
| Routing | React Router (check what the project already uses) | Standard | None for the demo |
| Backend | Firebase Authentication + Cloud Firestore | Already connected, no server to run | No ranking queries; rules are the only data protection |
| Hosting | Local dev server; Firebase Hosting optional as a backup URL | Safer if venue network or laptop fails | Verify Hosting free-tier limits on Firebase's pricing page |
| Cloud Functions | **Not used in the demo** | Decision D-03 | Real payments will need a webhook function. Deploying functions likely requires a billing-enabled Firebase plan [Medium confidence, verify on Firebase's pricing page] |
| Payments | None (demo button) | Decision D-05 | Real gateway (Midtrans) later |
| Tests | Vitest for the matching function (works natively with Vite) | Cheap, fast | UI tests are out of scope for the demo |
| Fonts | Manrope and Inter, bundled with `@fontsource` packages | Avoids dependence on venue wifi | Adds a little bundle size |

## 2. Architecture

- Browser app talks directly to Firebase Auth and Firestore. No custom server.
- Matching is a pure function `computeMatches(me, others)` in `src/lib/matching.*`, with its constants in `src/config/matching.*`.
- App-wide constants (commission rate, tag list, demo banner text) live in `src/config/app.*`.
- Route guards in the UI are a convenience only. **Security rules are the real enforcement.**
- A seed script (`scripts/seed.mjs`, run locally with the Firebase Admin SDK) creates dummy users, communities, and events. Its service account key stays outside the repository and is gitignored.

Suggested folders (adapt to what exists):
```
src/config/      app constants, matching weights, tag list
src/lib/         matching, firebase helpers, formatters
src/features/    auth, profile, discover, communities, events, tickets, admin, revenue
scripts/         seed.mjs
firestore.rules
docs/            these files
```

## 3. Authentication and email verification

Flow:
1. `createUserWithEmailAndPassword`, then `sendEmailVerification`.
2. Route the user to `/verify` while `user.emailVerified` is false.
3. "I have verified" runs `await user.reload()` then `await user.getIdToken(true)`. **The token refresh is required**, otherwise `request.auth.token.email_verified` stays false in security rules and every Firestore call is denied. [High confidence]
4. When verified, if no `users/{uid}` document exists or `onboardingComplete` is false, route to `/onboarding`; the onboarding submit creates the document.
5. Verification emails can land in spam and delivery on the day is not guaranteed. Pre-create and pre-verify the demo accounts (see `implementation-plan.md`). Gmail "plus" aliases (name+eo@gmail.com) arrive in one inbox.
6. Firebase Auth "Authorized domains" must include any hosted demo domain (localhost is allowed by default). Verify in the Firebase console.

Roles are stored in `users/{uid}.role` (`user` default, `eo`, `admin`). The admin and EO roles are set by hand in the Firebase console. Console edits bypass security rules. Users cannot change their own role (see rules).

## 4. Firestore data model

Money is stored as an integer in IDR (rupiah), never as a float. Timestamps are Firestore `Timestamp`.

### `users/{uid}`
| Field | Type | Required | Notes |
|---|---|---|---|
| displayName | string | yes | 1-60 chars |
| email | string | yes | copy of the auth email |
| photoURL | string | no | |
| major | string | no | |
| yearOfStudy | number | no | |
| bio | string | no | max 200 chars |
| interests | string[] | yes | slugs from the fixed tag list, at least 1 |
| styleSocial | number | yes | 1-5, 1 = small group, 5 = crowd |
| styleSchedule | number | yes | 1-5, 1 = relaxed, 5 = structured |
| styleActivity | number | yes | 1-5, 1 = time to chat, 5 = many activities |
| role | string | yes | `user` \| `eo` \| `admin` |
| onboardingComplete | boolean | yes | |
| isDemo | boolean | no | true for seeded users |
| createdAt, updatedAt | timestamp | yes | |

### `communities/{id}`
| Field | Type | Required |
|---|---|---|
| name | string | yes |
| description | string | no |
| category | string (tag slug) | no |
| createdBy | string (uid) | yes |
| createdByName | string | yes |
| createdAt | timestamp | yes |

Subcollection `communities/{id}/members/{uid}`: `uid`, `displayName`, `joinedAt`. Member count is computed with a count query on this subcollection, not stored.

### `events/{id}`
| Field | Type | Required | Notes |
|---|---|---|---|
| title | string | yes | |
| description | string | yes | |
| location | string | yes | |
| startsAt | timestamp | yes | |
| priceIdr | number | yes | integer, 0 = free |
| capacity | number or null | no | null = unlimited |
| organizerId | string (uid) | yes | |
| organizerName | string | yes | |
| status | string | yes | `pending` \| `approved` \| `rejected` |
| rejectReason | string | no | |
| decidedBy, decidedAt | string, timestamp | no | set by admin |
| createdAt | timestamp | yes | |

Subcollection `events/{id}/attendees/{uid}`: `uid`, `createdAt`. It exists so that any verified user can count spots taken without being able to read other people's registrations (which are private).

### `registrations/{eventId}_{uid}` (deterministic ID prevents duplicates)
| Field | Type | Required | Notes |
|---|---|---|---|
| eventId | string | yes | |
| userId | string | yes | |
| organizerId | string | yes | copied from the event at creation, used for EO queries |
| priceIdr | number | yes | copied from the event at creation |
| status | string | yes | `reserved` \| `paid_demo` \| `cancelled` \| `checked_in` (unused) |
| createdAt | timestamp | yes | |
| paidAt, cancelledAt | timestamp | no | |

Registration writes happen in one batch: registration document + attendee document. Cancel deletes the attendee document.

### Relationships
- user 1..n communities (through `members`), user 1..n registrations, event 1..n registrations, user (organizer) 1..n events.

## 5. Security rules (DRAFT, must be tested)

This is a starting draft for `firestore.rules`. Test at least these cases in the Firebase Rules Playground before the demo: (1) unverified user is denied everywhere; (2) a user cannot change their own role; (3) a user cannot read another user's registration; (4) a non-admin cannot approve an event; (5) a user cannot create an `approved` event unless their role is `eo`.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function verified() {
      return request.auth != null && request.auth.token.email_verified == true;
    }
    function me() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    function isAdmin() { return verified() && me().role == 'admin'; }
    function isEO()    { return verified() && me().role == 'eo'; }

    match /users/{uid} {
      allow read: if verified();
      allow create: if verified() && request.auth.uid == uid
                    && request.resource.data.role == 'user';
      allow update: if verified() && request.auth.uid == uid
                    && request.resource.data.role == resource.data.role;
    }

    match /communities/{cid} {
      allow read: if verified();
      allow create: if verified() && request.resource.data.createdBy == request.auth.uid;
      match /members/{uid} {
        allow read: if verified();
        allow create, delete: if verified() && request.auth.uid == uid;
      }
    }

    match /events/{eid} {
      allow read: if verified() && (resource.data.status == 'approved'
                    || resource.data.organizerId == request.auth.uid
                    || isAdmin());
      allow create: if verified()
                    && request.resource.data.organizerId == request.auth.uid
                    && (request.resource.data.status == 'pending'
                        || (isEO() && request.resource.data.status == 'approved'));
      allow update: if isAdmin();
      match /attendees/{uid} {
        allow read: if verified();
        allow create, delete: if verified() && request.auth.uid == uid;
      }
    }

    match /registrations/{rid} {
      allow read: if verified() && (resource.data.userId == request.auth.uid
                    || resource.data.organizerId == request.auth.uid
                    || isAdmin());
      allow create: if verified()
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.status == 'reserved'
        && rid == request.resource.data.eventId + '_' + request.auth.uid
        && get(/databases/$(database)/documents/events/$(request.resource.data.eventId)).data.status == 'approved'
        && get(/databases/$(database)/documents/events/$(request.resource.data.eventId)).data.priceIdr == request.resource.data.priceIdr
        && get(/databases/$(database)/documents/events/$(request.resource.data.eventId)).data.organizerId == request.resource.data.organizerId;
      // DEMO_ONLY: lets the client mark itself paid. Remove when the real gateway is added.
      allow update: if verified() && resource.data.userId == request.auth.uid
        && request.resource.data.userId == resource.data.userId
        && request.resource.data.eventId == resource.data.eventId
        && request.resource.data.priceIdr == resource.data.priceIdr
        && request.resource.data.status in ['paid_demo', 'cancelled'];
    }

    match /{document=**} { allow read, write: if false; }
  }
}
```

Query constraints the client must respect (otherwise Firestore rejects the whole query):
- Public events list: `where('status', '==', 'approved')`.
- "My events": `where('organizerId', '==', uid)`.
- "My tickets": `where('userId', '==', uid)`.
- EO revenue: `where('organizerId', '==', uid)`; admin revenue: no filter.
- Admin pending list: `where('status', '==', 'pending')` (allowed through `isAdmin()`).

Known gaps accepted for the demo: any verified user can read all user profiles (needed for client-side matching; unacceptable with real students); the attendee count can be inflated by a malicious client; the paid status is client-writable (DEMO_ONLY).

## 6. Matching specification

Inputs: the current user and the list of other users (onboarded only, excluding self).

Constants in `src/config/matching` (single place, labeled "to be tuned after pilot"):
```
WEIGHT_INTEREST = 0.5
WEIGHT_STYLE    = 0.5
MIN_SHARED_INTERESTS = 1
MAX_RESULTS = 20
```

Formulas:
- `interestScore = |A ∩ B| / |A ∪ B|` (Jaccard similarity of interest tags). If the union is empty, 0.
- `dimScore = 1 - |a - b| / 4` for each of the three style scores (range 1-5).
- `styleScore = average of the three dimScores`.
- `finalScore = WEIGHT_INTEREST * interestScore + WEIGHT_STYLE * styleScore`, displayed as `Math.round(finalScore * 100)` percent.
- Exclude candidates with fewer than `MIN_SHARED_INTERESTS` shared tags. Sort by `finalScore` descending, break ties by display name. Return at most `MAX_RESULTS`.
- Return per candidate: `uid`, `finalScore`, `percent`, `sharedInterests`.

Worked example (use as a unit test):
- A: interests {music, coding, gaming}, style (2, 4, 3). B: interests {coding, gaming, film}, style (3, 4, 4).
- Shared = 2, union = 4, `interestScore = 0.5`.
- `dimScores = 0.75, 1.0, 0.75`, `styleScore = 0.8333`.
- `finalScore = 0.25 + 0.41667 = 0.66667`, displayed **67%**.

Additional tests: identical users give 100%; no shared tags returns the candidate excluded; self excluded; empty interests handled without division by zero; ordering and tie-break; more than 20 candidates truncated.

Limitations to state honestly: the 50/50 weights are arbitrary, and nothing validates that these dimensions predict friendship. Popular personality tests such as MBTI are scientifically weak, which is why concrete preference questions are used instead.

## 7. Demo payment flow

1. User presses Register on an approved event: batch-create the `registrations/{eventId}_{uid}` document (`reserved`) and the attendee document.
2. Ticket page: if `priceIdr > 0`, show the "Payment (DEMO)" card with the amount and the text "No real payment is made." Use no real bank account number.
3. "I have transferred (demo)" sets `status = 'paid_demo'` and `paidAt`.
4. Free events: `reserved` is displayed as "Registered".
5. Cancel: set `cancelled` and delete the attendee document.

What production needs later (do not build now): a Midtrans Snap transaction created server-side; a webhook that verifies the signature and updates the status idempotently; no client write access to the status; refund and event-cancellation policy; payout to EOs, tax treatment, and legal review (needs a lawyer or accountant, TBD); gateway fee allocation.

## 8. Config constants (`src/config/app`)

| Constant | Value | Status |
|---|---|---|
| `COMMISSION_RATE` | 0.10 | PLACEHOLDER |
| `CURRENCY` | IDR, formatted as "Rp 25.000" | Decided |
| `DEMO_MODE` | true | Shows the DEMO banner on payment and revenue screens |
| `INTEREST_TAGS` | music, sports, gaming, coding, design, photography, reading, film, hiking, cooking, art, entrepreneurship, volunteering, anime, travel | Proposed (Q-03), change freely |

## 9. Seed data

Created by `scripts/seed.mjs` with the Admin SDK, documented in `build-prompts.md` (prompt 4):
- 12 invented students with `isDemo: true`, varied interests and style scores (so match percentages differ). The document IDs are arbitrary strings like `demo_01`; these users have no Auth account.
- 4 communities, each with a few seeded members.
- 5 approved events: mixed free and paid (for example Rp 0, 25000, 50000, 75000), one with a small capacity, organizer = the demo EO account's uid.
- Names must be invented. No real person or real organization may appear.

## 10. Design implementation notes (from `DESIGN.md`)

- **Tokens:** copy the color, typography, radius, and spacing values from `DESIGN.md` into CSS variables (or the existing styling system). Components use the tokens, never raw hex values.
- **Color conflict:** the YAML `primary` token is `#006b5f`, while the prose names `#00A896` as the primary accent and CTA color. Rule for this project: brand accents follow the prose (`#00A896` CTA, `#FF7F51` coral, `#FFB703` mango); surfaces and neutrals follow the YAML tokens.
- **Contrast:** resolved in `DESIGN.md`, section "Accessible color pairings" (dark label `#00352E` on the `#00A896` button, `#006B5F` for teal text). It overrides the white foreground values listed under Components. Values are hand-calculated [Medium confidence]; verify with a contrast checker.
- **Desktop layout:** defined in `DESIGN.md`, section "Desktop Layout" (12 columns, top navigation bar from 1024 px, container 1120 px at xl and 1280 px at 2xl, per-screen layouts). Check it at the sizes listed under "Demo-day checks".
- **Components to follow:** primary button 48 px high, inputs 48 px high with a teal focus halo, cards with 16 px padding and a 1 px border, pill shapes only for badges and tags, touch targets at least 44 x 44 px.
- A DEMO badge style: use the coral critical-pill style so it is unmistakable.

## 11. Limitations and production needs (summary)

Client-side matching reads other users' profiles; client-writable paid status; capacity can oversell; roles assigned by hand; email verification does not prove student status; no moderation; no data-protection compliance work yet. Each of these is acceptable only for a dummy-data demo.

## 12. Open questions

See `README.md` section 6. Additional: TBD whether to enforce a maximum number of communities per user (not needed for the demo).
