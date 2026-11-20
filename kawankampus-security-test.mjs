/**
 * KawanKampus Kegiatan Firestore Security Rules tests.
 * LOCAL EMULATOR ONLY: 127.0.0.1:8080, database ID "default".
 * This script never initializes a production Firestore connection.
 *
 * Place this file in the repository root and run:
 *   node .\kawankampus-security-test.mjs
 *
 * Requires the existing "firebase" package in package.json.
 */
import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp } from 'firebase/app';
import {
  getFirestore, connectFirestoreEmulator,
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  writeBatch, increment, serverTimestamp, terminate
} from 'firebase/firestore';

const PROJECT = 'kawan-kampus-venture';
const DATABASE = 'default';
const HOST = '127.0.0.1';
const PORT = 8080;
const API = `http://${HOST}:${PORT}/v1/projects/${PROJECT}/databases/${DATABASE}/documents`;
const suffix = randomUUID().replaceAll('-', '').slice(0, 12);
const aliceId = `security-alice-${suffix}`;
const bobId = `security-bob-${suffix}`;
const victimId = `security-victim-${suffix}`;
const circleId = `security-circle-${suffix}`;
const eventId = `security-event-${suffix}`;
const nonmemberEventId = `security-no-member-${suffix}`;
const missingCircleId = `security-missing-circle-${suffix}`;
const circleName = `Security test circle ${suffix}`;
const resources = [
  `eventAttendees/${eventId}_${aliceId}`,
  `eventAttendees/${eventId}_${bobId}`,
  `eventAttendees/${eventId}_${victimId}`,
  `eventAttendees/${nonmemberEventId}_${bobId}`,
  `events/${eventId}`,
  `events/${nonmemberEventId}`,
  `communityMemberships/${circleId}_${aliceId}`,
  `communityMemberships/${circleId}_${bobId}`,
  `communityMemberships/${circleId}_${victimId}`,
  `communityMemberships/${missingCircleId}_${bobId}`,
  `communities/${circleId}`
];

const apps = [];
const databases = [];
let passed = 0;
let failed = 0;

function client(name, uid) {
  const app = initializeApp({
    projectId: PROJECT,
    appId: `security-test-${name}`,
    apiKey: 'emulator-only-not-a-real-api-key'
  }, `kawankampus-security-${name}-${suffix}`);
  apps.push(app);
  const db = getFirestore(app, DATABASE); // Named database, not (default)
  databases.push(db);
  connectFirestoreEmulator(db, HOST, PORT,
    uid ? { mockUserToken: { sub: uid } } : undefined);
  return db;
}

async function adminRequest(path, method = 'GET', fields) {
  const response = await fetch(`${API}/${path}`, {
    method,
    headers: {
      'Authorization': 'Bearer owner',
      ...(fields ? { 'Content-Type': 'application/json' } : {})
    },
    ...(fields ? { body: JSON.stringify({ fields }) } : {})
  });
  if (!response.ok && !(method === 'DELETE' && response.status === 404)) {
    throw new Error(`Local admin ${method} ${path}: HTTP ${response.status}: ${await response.text()}`);
  }
  return response;
}

function eventData(creator) {
  return {
    community_id: circleId,
    community_name: circleName,
    title: `Emulator security test ${suffix}`,
    event_date: '2026-12-15 10:00',
    place: 'Local emulator only',
    description: 'Temporary fixture for security-rule testing',
    attendee_count: 1,
    created_by: creator,
    created_at: serverTimestamp()
  };
}

function joinData(event, uid) {
  return { event_id: event, user_id: uid, created_at: serverTimestamp() };
}

async function test(label, shouldAllow, action) {
  try {
    await action();
    if (shouldAllow) {
      passed++;
      console.log(`PASS | ${label} — allowed`);
      return true;
    }
    failed++;
    console.error(`FAIL | ${label} — UNEXPECTEDLY ALLOWED`);
    return false;
  } catch (error) {
    if (!shouldAllow && error?.code === 'permission-denied') {
      passed++;
      console.log(`PASS | ${label} — permission-denied`);
      return true;
    }
    failed++;
    console.error(`FAIL | ${label} — ${error?.code || 'error'}: ${error?.message || error}`);
    return false;
  }
}

async function main() {
  // The REST preflight guarantees an actual emulator is listening before
  // any clients or writes are constructed. There are NO production URLs.
  const preflight = await adminRequest('events');
  if (!preflight.ok) throw new Error('Local emulator not reachable');
  console.log(`Checking LOCAL Firestore Emulator: ${HOST}:${PORT}, project=${PROJECT}, database=${DATABASE}`);
  console.log(`Temporary fixture suffix: ${suffix}\n`);

  // Administrative setup happens only on the local emulator.
  await adminRequest(`communities/${circleId}`, 'PATCH', {
    name: { stringValue: circleName },
    interest_tag: { stringValue: 'Teknologi' },
    description: { stringValue: 'Local security fixture' },
    created_by: { stringValue: aliceId }
  });
  await adminRequest(`communityMemberships/${circleId}_${aliceId}`, 'PATCH', {
    community_id: { stringValue: circleId },
    user_id: { stringValue: aliceId }
  });

  const alice = client('alice', aliceId);
  const bob = client('bob', bobId);
  const anonymous = client('anonymous', null);

  // Positive control: creates the event and the creator's registration atomically.
  const created = await test('Circle member creates event with own registration', true, async () => {
    const batch = writeBatch(alice);
    batch.set(doc(alice, 'events', eventId), eventData(aliceId));
    batch.set(doc(alice, 'eventAttendees', `${eventId}_${aliceId}`), joinData(eventId, aliceId));
    await batch.commit();
  });
  if (!created) {
    console.error('Stopping further tests: valid event creation was not allowed. Check that named database rules are loaded.');
    return;
  }

  await test('Signed-in user reads event', true, async () => {
    const snap = await getDoc(doc(bob, 'events', eventId));
    if (!snap.exists()) throw new Error('Temporary event missing');
  });

  await test('Anonymous user reads event', false, () =>
    getDoc(doc(anonymous, 'events', eventId)));

  await test('Non-member creates event despite missing Circle membership', false, async () => {
    const batch = writeBatch(bob);
    batch.set(doc(bob, 'events', nonmemberEventId), eventData(bobId));
    batch.set(doc(bob, 'eventAttendees', `${nonmemberEventId}_${bobId}`), joinData(nonmemberEventId, bobId));
    await batch.commit();
  });

  // Membership regressions: checks the newly tightened communityMemberships rule.
  // These run after the non-member event test so Bob remains a non-member for it.
  await test('Membership with forged document UID is rejected', false, () =>
    setDoc(doc(bob, 'communityMemberships', `${circleId}_${victimId}`), {
      community_id: circleId,
      user_id: bobId
    }));

  await test('Membership referencing missing Circle is rejected', false, () =>
    setDoc(doc(bob, 'communityMemberships', `${missingCircleId}_${bobId}`), {
      community_id: missingCircleId,
      user_id: bobId
    }));

  await test('Membership with correct UID and existing Circle is allowed', true, () =>
    setDoc(doc(bob, 'communityMemberships', `${circleId}_${bobId}`), {
      community_id: circleId,
      user_id: bobId
    }));

  await test('Another user changes event title', false, () =>
    updateDoc(doc(bob, 'events', eventId), { title: 'Unauthorized event edit' }));

  await test('User increases attendance count without creating registration', false, () =>
    updateDoc(doc(alice, 'events', eventId), { attendee_count: increment(5) }));

  await test('User registers a different UID by forged attendance and count batch', false, async () => {
    const batch = writeBatch(bob);
    batch.set(doc(bob, 'eventAttendees', `${eventId}_${victimId}`), joinData(eventId, victimId));
    batch.update(doc(bob, 'events', eventId), { attendee_count: increment(1) });
    await batch.commit();
  });

  await test('User registers self and increments count atomically', true, async () => {
    const batch = writeBatch(bob);
    batch.set(doc(bob, 'eventAttendees', `${eventId}_${bobId}`), joinData(eventId, bobId));
    batch.update(doc(bob, 'events', eventId), { attendee_count: increment(1) });
    await batch.commit();
  });

  await test('Repeat registration of same user', false, async () => {
    const batch = writeBatch(bob);
    batch.set(doc(bob, 'eventAttendees', `${eventId}_${bobId}`), joinData(eventId, bobId));
    batch.update(doc(bob, 'events', eventId), { attendee_count: increment(1) });
    await batch.commit();
  });

  await test('Another user deletes someone else attendance record', false, () =>
    deleteDoc(doc(bob, 'eventAttendees', `${eventId}_${aliceId}`)));

  await test('Another user deletes event', false, () =>
    deleteDoc(doc(bob, 'events', eventId)));

  const finalSnap = await getDoc(doc(alice, 'events', eventId));
  const count = finalSnap.data()?.attendee_count;
  if (count === 2) {
    passed++;
    console.log('PASS | Attendance count remains exactly 2');
  } else {
    failed++;
    console.error(`FAIL | Attendance count expected 2, found ${count}`);
  }
}

try {
  await main();
} catch (error) {
  failed++;
  console.error(`TEST SETUP ERROR | ${error?.message || error}`);
} finally {
  // No existing KawanKampus records are touched. Every cleanup path starts
  // with this script's unique suffix, and the DELETEs go to localhost only.
  for (const path of resources) {
    try { await adminRequest(path, 'DELETE'); }
    catch (error) { console.error(`Cleanup warning: ${error?.message || error}`); }
  }
  await Promise.allSettled(databases.map(db => terminate(db)));
  await Promise.allSettled(apps.map(app => deleteApp(app)));
  console.log(`\nRESULT: ${passed} passed, ${failed} failed. Temporary test documents cleaned up where possible.`);
  if (failed) process.exitCode = 1;
}
