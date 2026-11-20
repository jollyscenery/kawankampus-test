# KawanKampus — Kegiatan on Firestore (Step 1)

## What this patch changes

- `src/context/DataContext.jsx`: reads signed-in users' events and their own registrations using Firestore realtime listeners. Creates an event together with the creator's attendance in a single batch; registers additional attendees via an idempotent transaction.
- `src/components/tabs/EventsTab.jsx`: awaits the asynchronous save and displays loading, retry, and error states.
- The UI no longer reads or writes `kk-events` and `kk-attendees` in localStorage. Those older browser records are **not migrated**. The initial sample events are not inserted into Firestore automatically.
- Guest visitors still see the existing sample landing agenda, not private Firestore events.

## Firestore data model

`events/{eventId}`:

- `community_id`: string
- `community_name`: string
- `title`: string
- `event_date`: local datetime string, e.g. `2026-12-05 08:30` (matches the current UI)
- `place`: string
- `description`: string
- `attendee_count`: number, initialized to 1
- `created_by`: Firebase Auth UID
- `created_at`: Firestore server timestamp

`eventAttendees/{eventId}_{uid}`:

- `event_id`: event document ID (string)
- `user_id`: Firebase Auth UID
- `created_at`: Firestore server timestamp

The deterministic attendance document ID prevents duplicate registration. The attendee document and event count are written together atomically.

## Security rules — configure before testing

The repository currently has a `firebase.json` Hosting configuration, **not** a versioned Firestore rules file. This patch deliberately does not replace your live Firestore rules because doing so could block existing `users`, `publicProfiles`, `communities`, `communityMemberships`, or `connections` operations.

In Firebase Console > Firestore Database > Rules, review your **existing** rules and merge policies for these two new collections. The minimum design requirements are:

1. Signed-in users may read `events`.
2. Only a signed-in user who belongs to the event's `community_id` may create that event, with `created_by` equal to their UID and `attendee_count` initialized to 1. The creator's registration must be in the same atomic write.
3. Signed-in users may query **only their own** `eventAttendees` using `where('user_id', '==', uid)`. A transaction must also be permitted to read the user's own attendance document even when it does not yet exist.
4. An attendance document may only be created for the authenticated UID and a real event; it must not be updated or deleted arbitrarily.
5. Event updates may change **only** `attendee_count`, increasing it by exactly 1 in the same transaction that creates the authenticated user's first attendance document. Do not allow arbitrary client-side count changes.
6. Existing non-event collection policies must be preserved. Do **not** use blanket `allow read, write: if true` rules.

These rules require checking the paired documents using Firestore Security Rules (`getAfter` and `exists` as appropriate). Validate the merged rules in the Firestore Rules Playground or Emulator before deploying. The patch **does not** deploy security rules.

## Local verification (PowerShell, repository root)

```powershell
git branch --show-current
git apply --check "$HOME\Downloads\KawanKampus_Step1_Events_Firestore.patch"
git apply "$HOME\Downloads\KawanKampus_Step1_Events_Firestore.patch"
npm ci
npm run lint
npm run build
git diff --check
git status --short
```

Test with two real Firebase Auth accounts that can see the same circle: create an event, check `events/{id}` and the creator's registration in Firestore, register the second user, verify the count increases to 2, then reload both browsers. Try registering the second user twice; the count must stay at 2. Also test error states with restrictive rules and a disconnected network.

Do not deploy to production before these checks and the Firestore rules review. Once validated, use a **preview channel** and test again before merging.
