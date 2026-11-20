# Public landing agenda — Firestore patch

## Scope

The landing page no longer generates fallback events. It shows:
- **Signed-in visitors:** real events from the existing authenticated `events` listener. This preserves older events that have not been republished.
- **Guests:** intentionally public summaries from `publicEvents`. These are updated in real time with a Firestore listener.

When no upcoming event exists, the UI displays `Belum ada kegiatan mendatang yang dipublikasikan.` Loading and permission failures have their own state instead of being disguised as sample data.

## Publication model

The existing event-creation batch now writes three documents atomically:
1. `events/{eventId}`: full event, including creator UID, with existing signed-in read rules.
2. `eventAttendees/{eventId}_{uid}`: creator's own registration, with existing user-scoped rules.
3. `publicEvents/{eventId}`: a sanitized summary for the public landing page.

The public summary contains **only** `title`, `event_date`, `place`, `community_name`, and `published_at`. It does **not** expose `created_by`, attendee records, or event descriptions. Firestore Security Rules permit a public summary to be created only by the author in the same batch as the new source event, with matching fields. Public summaries are otherwise immutable. Never broaden `events` or `eventAttendees` to anonymous reads.

The `publicEvents` collection is **not a backfill of historical events**. New events are published automatically after the new client code and rules are deployed. Existing records must be reviewed before any public copy is created.

## Backfill for already-published events (optional, administrator-only)

If you have existing activities in `events` that should be publicly announced, selectively create the corresponding document in `publicEvents` through Firebase Console or a reviewed Admin SDK migration. Use the **same document ID** and copy only:
- `title` (string)
- `event_date` (string, e.g. `2026-12-05 08:30`)
- `place` (string)
- `community_name` (string)
- `published_at` (Firestore timestamp)

Do not publish private/cancelled events or documents from your old localStorage/demo fixtures. Console/Admin SDK access bypasses client Security Rules, so confirm the data is intended to be publicly visible before backfilling.

## Deployment and verification (PowerShell)

Work from a clean local checkout, on the **new fix branch**:

```powershell
git fetch origin
git switch --track origin/fix/live-public-landing-agenda
npm ci
npm run lint
npm run build
```

Review your live Firestore rules to ensure the branch's complete `firestore.rules` matches your intended policies for all collections. Test the rules in the Firestore emulator before deployment. **Do not overwrite newer live rules blindly.**

After review, deploy rules first, then a Hosting preview:

```powershell
firebase.cmd deploy --only firestore:rules --project kawan-kampus-venture
firebase.cmd hosting:channel:deploy kegiatan-preview --project kawan-kampus-venture
```

Test both logged-out and logged-in states at the returned preview URL:
1. No upcoming activities -> empty state, never the 3 hardcoded demo titles.
2. Signed in -> historical real `events` show, even if not backfilled yet.
3. Create a future event as a member of a circle -> confirm 3 documents with the same event ID and public preview fields.
4. Guest / incognito -> newly published activity appears; list updates when new events are created.
5. Guest cannot query `events` or `eventAttendees`, write `publicEvents`, or modify a preview. Signed-in user cannot create a preview for an unrelated event.
6. Simulate a Firestore permission/network failure -> explicit error state, not fallback demo data.

After preview and Firestore permission tests pass, deploy Hosting to production:

```powershell
firebase.cmd deploy --only hosting --project kawan-kampus-venture
```

## Separate issue

The public `Circle kampus` section in `LandingPage.jsx` still uses `INITIAL_COMMUNITIES` when signed out. That is unrelated to the activity preview and needs its own public-community-feed or clearly labeled examples if the goal is to eliminate *all* simulated public content.
