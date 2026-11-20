import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  setDoc,
  getCountFromServer,
  onSnapshot,
  writeBatch,
  runTransaction,
  increment
} from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const DataContext = createContext();

const EMPTY_LIST = [];


export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const readsRemoteData = !!userId;
  const [people, setPeople] = useState([]);
  const [peopleRead, setPeopleRead] = useState(null);
  const [connectionsRead, setConnectionsRead] = useState(null);
  const [communitiesRead, setCommunitiesRead] = useState(null);
  const [membershipsRead, setMembershipsRead] = useState(null);
  const [peopleAttempt, setPeopleAttempt] = useState(0);
  const [circleAttempt, setCircleAttempt] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = setToastMessage;
  const hideToast = useCallback(() => setToastMessage(null), []);
  const retryPeople = () => setPeopleAttempt((attempt) => attempt + 1);
  const retryCircles = () => setCircleAttempt((attempt) => attempt + 1);

  useEffect(() => {
    let cancelled = false;

    const loadPeople = async () => {
      let message = '';
      if (!userId) {
        setPeople([]);
        setPeopleRead(null);
        return;
      }


      try {
        const snapshot = await getDocs(collection(db, 'publicProfiles'));

        const realPeople = snapshot.docs
          .map((userDoc) => {
            const data = userDoc.data();
            return {
              id: userDoc.id,
              uid: userDoc.id,
              name: data.name || data.email || 'Mahasiswa',
              major: data.major || 'Mahasiswa',
              bio: data.bio || '',
              interests: Array.isArray(data.interests) ? data.interests : []
            };
          })
          .filter((person) => person.id !== userId);

        if (!cancelled) {
          setPeople(realPeople);
        }
      } catch (error) {
        console.error('Error loading people from Firestore:', error);

        if (!cancelled) {
          setPeople([]);
          message = 'Daftar teman belum bisa dimuat.';
        }
      } finally {
        if (!cancelled) {
          setPeopleRead({ userId, attempt: peopleAttempt, error: message });
        }
      }
    };

    loadPeople();

    return () => {
      cancelled = true;
    };
  }, [userId, peopleAttempt]);



  // Communities: loaded from Firestore
  const [communities, setCommunities] = useState([]);

  // Memberships: stored in Firestore
  const [memberships, setMemberships] = useState([]);

  // Events and attendance are shared Firestore data, never browser-local state.
  const [events, setEvents] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [attendeesLoading, setAttendeesLoading] = useState(false);
  const [eventsError, setEventsError] = useState('');
  const [attendeesError, setAttendeesError] = useState('');
  const [eventsAttempt, setEventsAttempt] = useState(0);
  const retryEvents = () => setEventsAttempt((attempt) => attempt + 1);

  useEffect(() => {
    if (!userId) {
      setEvents([]);
      setEventsError('');
      setEventsLoading(false);
      return undefined;
    }

    setEvents([]);
    setEventsLoading(true);
    setEventsError('');
    return onSnapshot(
      collection(db, 'events'),
      (snapshot) => {
        const loaded = snapshot.docs.map((eventDoc) => ({
          ...eventDoc.data(),
          id: eventDoc.id
        }));
        loaded.sort((a, b) => String(b.event_date || '').localeCompare(String(a.event_date || '')));
        setEvents(loaded);
        setEventsError('');
        setEventsLoading(false);
      },
      (error) => {
        console.error('Error loading events:', error);
        setEvents([]);
        setEventsError('Daftar kegiatan belum bisa dimuat.');
        setEventsLoading(false);
      }
    );
  }, [userId, eventsAttempt]);

  useEffect(() => {
    if (!userId) {
      setAttendees([]);
      setAttendeesError('');
      setAttendeesLoading(false);
      return undefined;
    }

    setAttendees([]);
    setAttendeesLoading(true);
    setAttendeesError('');
    const attendanceQuery = query(
      collection(db, 'eventAttendees'),
      where('user_id', '==', userId)
    );

    return onSnapshot(
      attendanceQuery,
      (snapshot) => {
        setAttendees(snapshot.docs.map((attendeeDoc) => attendeeDoc.data()));
        setAttendeesError('');
        setAttendeesLoading(false);
      },
      (error) => {
        console.error('Error loading event attendance:', error);
        setAttendees([]);
        setAttendeesError('Pendaftaran kegiatan belum bisa dimuat.');
        setAttendeesLoading(false);
      }
    );
  }, [userId, eventsAttempt]);

  // Connection requests from Firestore
  const [connections, setConnections] = useState([]);

  // Load real connection requests for the signed-in Firebase user
useEffect(() => {
  let cancelled = false;

  const loadConnections = async () => {
    let message = '';
    if (!userId) {
      setConnections([]);
      setConnectionsRead(null);
      return;
    }


    try {
      const connectionsRef = collection(db, 'connections');

      const outgoingQuery = query(
        connectionsRef,
        where('fromUid', '==', userId)
      );

      const incomingQuery = query(
        connectionsRef,
        where('toUid', '==', userId)
      );

      const [outgoingSnapshot, incomingSnapshot] = await Promise.all([
        getDocs(outgoingQuery),
        getDocs(incomingQuery)
      ]);

      const connectionMap = new Map();

      [...outgoingSnapshot.docs, ...incomingSnapshot.docs].forEach(
        (connectionDoc) => {
          connectionMap.set(connectionDoc.id, {
            id: connectionDoc.id,
            ...connectionDoc.data()
          });
        }
      );

      if (!cancelled) {
        setConnections(Array.from(connectionMap.values()));
      }
    } catch (error) {
      console.error('Error loading connections:', error);

      if (!cancelled) {
        setConnections([]);
        message = 'Status koneksi belum bisa dimuat.';
      }
    } finally {
      if (!cancelled) setConnectionsRead({ userId, attempt: peopleAttempt, error: message });
    }
  };

  loadConnections();

  return () => {
    cancelled = true;
  };
}, [userId, peopleAttempt]);

  // Load communities from Firestore
  useEffect(() => {
    let cancelled = false;

    const loadCommunities = async () => {
    let message = '';
      if (!userId) {
        setCommunities([]);
        setCommunitiesRead(null);
        return;
    }


    try {
      const snapshot = await getDocs(collection(db, 'communities'));

      const loadedCommunities = await Promise.all(
        snapshot.docs.map(async (communityDoc) => {
          const data = communityDoc.data();

          const membersRef = collection(
            db,
            'communities',
            communityDoc.id,
            'members'
          );

          const countSnapshot = await getCountFromServer(membersRef);

          return {
            id: communityDoc.id,
            name: data.name || '',
            interest_tag: data.interest_tag || '',
            description: data.description || '',
            created_by: data.created_by || '',
            created_at: data.created_at || null,
            member_count: countSnapshot.data().count
          };
        })
      );

      if (!cancelled) {
        setCommunities(loadedCommunities);
      }
    } catch (error) {
      console.error('Error loading communities:', error);

      if (!cancelled) {
        setCommunities([]);
        message = 'Daftar circle belum bisa dimuat.';
      }
    } finally {
      if (!cancelled) {
        setCommunitiesRead({ userId, attempt: circleAttempt, error: message });
      }
    }
  };

  loadCommunities();

  return () => {
    cancelled = true;
  };
}, [userId, circleAttempt]);

// Load memberships for the signed-in user
useEffect(() => {
  let cancelled = false;

  const loadMemberships = async () => {
    let message = '';
    if (!userId) {
      setMemberships([]);
      setMembershipsRead(null);
      return;
    }


    try {
      const membershipsQuery = query(
        collection(db, 'communityMemberships'),
        where('user_id', '==', userId)
      );

      const snapshot = await getDocs(membershipsQuery);

      if (!cancelled) {
        setMemberships(
          snapshot.docs.map((membershipDoc) => ({
            id: membershipDoc.id,
            ...membershipDoc.data()
          }))
        );
      }
    } catch (error) {
      console.error('Error loading memberships:', error);

      if (!cancelled) {
        setMemberships([]);
        message = 'Keanggotaan circle belum bisa dimuat.';
      }
    } finally {
      if (!cancelled) {
        setMembershipsRead({ userId, attempt: circleAttempt, error: message });
      }
    }
  };

  loadMemberships();

  return () => {
    cancelled = true;
  };
}, [userId, circleAttempt]);

  const ensureUserCommunity = async (user) => {
    const firstInterest = user?.interests?.[0]?.trim();
    if (!firstInterest) return;

    const snapshot = await getDocs(collection(db, 'communities'));
    const existing = snapshot.docs.find((entry) =>
      entry.data().interest_tag?.toLowerCase() === firstInterest.toLowerCase()
    );

    if (existing) {
      await joinCommunity(existing.id, user);
    } else {
      await createCommunity({
        name: `Circle ${firstInterest}`,
        interest_tag: firstInterest,
        description: `Ruang kenalan untuk mahasiswa yang menyukai ${firstInterest}.`
      }, user);
    }
    retryCircles();
  };

// Community Actions
const createCommunity = async ({ name, interest_tag, description }, user = currentUser) => {
  if (!user) {
    throw new Error('Silakan masuk dengan akun terdaftar.');
  }

  if (!name?.trim() || !interest_tag?.trim()) {
    throw new Error('Nama dan minat komunitas wajib diisi.');
  }

  try {
    const communityData = {
      name: name.trim(),
      interest_tag: interest_tag.trim(),
      description: description?.trim() ||
        'Temukan teman dengan minat yang sama.',
      created_by: user.id,
      created_at: new Date().toISOString()
    };

    const communityRef = await addDoc(
      collection(db, 'communities'),
      communityData
    );

    const newCommunity = {
      id: communityRef.id,
      ...communityData,
      member_count: 0
    };

    await setDoc(
      doc(db, 'communityMemberships', `${communityRef.id}_${user.id}`),
      {
        community_id: communityRef.id,
        user_id: user.id,
        joined_at: serverTimestamp()
      }
    );

    await setDoc(
      doc(db, 'communities', communityRef.id, 'members', user.id),
      {
        user_id: user.id,
        joined_at: serverTimestamp()
      }
    );

    setCommunities((previous) => [
      { ...newCommunity, member_count: 1 },
      ...previous
    ]);

    setMemberships((previous) => [
      ...previous,
      {
        id: `${communityRef.id}_${user.id}`,
        community_id: communityRef.id,
        user_id: user.id
      }
    ]);

    showToast('Komunitas berhasil dibuat!');
    return newCommunity;
  } catch (error) {
    console.error('Error creating community:', error);
    showToast('Gagal membuat komunitas.');
    throw error;
  }
};

const joinCommunity = async (communityId, user = currentUser) => {
  if (!user) {
    throw new Error('Silakan masuk dengan akun terdaftar.');
  }

  const communityIdString = String(communityId);

  const alreadyJoined = memberships.some(
    (membership) =>
      membership.community_id === communityIdString &&
      membership.user_id === user.id
  );

  if (alreadyJoined) {
    showToast('Kamu sudah menjadi anggota komunitas ini.');
    return;
  }

  try {
    const membershipId = `${communityIdString}_${user.id}`;

    await setDoc(
      doc(db, 'communityMemberships', membershipId),
      {
        community_id: communityIdString,
        user_id: user.id,
        joined_at: serverTimestamp()
      }
    );

    await setDoc(
      doc(db, 'communities', communityIdString, 'members', user.id),
      {
        user_id: user.id,
        joined_at: serverTimestamp()
      }
    );

    setMemberships((previous) => [
      ...previous,
      {
        id: membershipId,
        community_id: communityIdString,
        user_id: user.id
      }
    ]);

    setCommunities((previous) =>
      previous.map((community) =>
        community.id === communityIdString
          ? {
              ...community,
              member_count: community.member_count + 1
            }
          : community
      )
    );

    showToast('Berhasil bergabung ke komunitas!');
  } catch (error) {
    console.error('Error joining community:', error);
    showToast('Gagal bergabung ke komunitas.');
    throw error;
  }
};

const isCommunityJoined = (communityId) => {
  if (!currentUser) return false;

  return memberships.some(
    (membership) =>
      membership.community_id === String(communityId) &&
      membership.user_id === currentUser.id
  );
};

  // Event Actions: create and register atomically in Firestore.
  const createEvent = async ({ title, community_id, event_date, place, description }) => {
    if (!currentUser) throw new Error('Silakan masuk terlebih dahulu.');
    if (!title?.trim() || !event_date || !place?.trim() || !community_id) {
      throw new Error('Lengkapi judul, komunitas, tanggal, dan lokasi.');
    }
    if (Number.isNaN(new Date(event_date).getTime())) {
      throw new Error('Tanggal kegiatan tidak valid.');
    }
    if (!memberships.some((membership) =>
      membership.community_id === String(community_id) && membership.user_id === currentUser.id
    )) {
      throw new Error('Gabung circle terlebih dahulu untuk membuat kegiatan.');
    }

    const comm = communities.find((community) => String(community.id) === String(community_id));
    if (!comm) throw new Error('Circle tidak ditemukan.');

    const eventRef = doc(collection(db, 'events'));
    const attendanceRef = doc(db, 'eventAttendees', `${eventRef.id}_${currentUser.id}`);
    const publicEventRef = doc(db, 'publicEvents', eventRef.id);
    const eventData = {
      community_id: String(comm.id),
      community_name: comm.name,
      title: title.trim(),
      event_date: event_date.replace('T', ' '),
      place: place.trim(),
      description: description?.trim() || '',
      attendee_count: 1,
      created_by: currentUser.id,
      created_at: serverTimestamp()
    };

    try {
      const batch = writeBatch(db);
      batch.set(eventRef, eventData);
      batch.set(attendanceRef, {
        event_id: eventRef.id,
        user_id: currentUser.id,
        created_at: serverTimestamp()
      });
      // A public-safe projection published atomically with the real event.
      // Never copy author UIDs, registration details, or private fields here.
      batch.set(publicEventRef, {
        title: eventData.title,
        event_date: eventData.event_date,
        place: eventData.place,
        community_name: eventData.community_name,
        published_at: serverTimestamp()
      });
      await batch.commit();
      showToast('Kegiatan berhasil dibuat!');
      return { id: eventRef.id, ...eventData };
    } catch (error) {
      console.error('Error creating event:', error);
      throw new Error('Kegiatan belum bisa disimpan di Firestore. Periksa izin dan koneksi.');
    }
  };

  const attendEvent = async (eventId) => {
    if (!currentUser) throw new Error('Silakan masuk terlebih dahulu.');

    const id = String(eventId);
    const eventRef = doc(db, 'events', id);
    const attendanceRef = doc(db, 'eventAttendees', `${id}_${currentUser.id}`);

    try {
      const added = await runTransaction(db, async (transaction) => {
        const [eventSnapshot, attendanceSnapshot] = await Promise.all([
          transaction.get(eventRef),
          transaction.get(attendanceRef)
        ]);
        if (!eventSnapshot.exists()) throw new Error('Kegiatan tidak ditemukan.');
        if (attendanceSnapshot.exists()) return false;

        transaction.set(attendanceRef, {
          event_id: id,
          user_id: currentUser.id,
          created_at: serverTimestamp()
        });
        transaction.update(eventRef, { attendee_count: increment(1) });
        return true;
      });

      showToast(added ? 'Kamu terdaftar hadir!' : 'Kamu sudah terdaftar dalam kegiatan ini.');
      return added;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw new Error('Pendaftaran kegiatan gagal disimpan di Firestore.');
    }
  };

  const isEventAttending = (eventId) => {
    if (!currentUser) return false;
    return attendees.some((attendee) =>
      attendee.event_id === String(eventId) && attendee.user_id === currentUser.id
    );
  };

  // Connection Actions
  const sendConnection = async (personId) => {
    if (!currentUser) {
      throw new Error('Silakan masuk dengan akun terdaftar.');
  }

  if (personId === currentUser.id) {
    throw new Error('Tidak bisa mengirim koneksi ke diri sendiri.');
  }

  const exists = connections.find(
  (connection) =>
    (
      connection.fromUid === currentUser.id &&
      connection.toUid === personId
    ) ||
    (
      connection.fromUid === personId &&
      connection.toUid === currentUser.id
    )
);

if (exists && exists.status !== 'declined') {
  showToast('Permintaan koneksi atau koneksi sudah ada.');
  return;
}

  if (exists) {
    showToast('Permintaan koneksi atau koneksi sudah ada.');
    return;
  }

  try {
    const connectionData = {
      fromUid: currentUser.id,
      toUid: personId,
      status: 'pending',
      createdAt: serverTimestamp()
    };

    const connectionRef = await addDoc(
      collection(db, 'connections'),
      connectionData
    );

    setConnections((previous) => [
      ...previous,
      {
        id: connectionRef.id,
        fromUid: currentUser.id,
        toUid: personId,
        status: 'pending'
      }
    ]);

    showToast('Permintaan koneksi terkirim!');
  } catch (error) {
    console.error('Error sending connection:', error);
    showToast('Gagal mengirim permintaan koneksi.');
    throw error;
  }
};

const acceptConnection = async (connectionId, status = 'accepted') => {
  if (!currentUser) {
    throw new Error('Silakan masuk dengan akun terdaftar.');
  }

  if (!['accepted', 'declined'].includes(status)) {
    throw new Error('Status koneksi tidak valid.');
  }

  const connection = connections.find(
    (item) => item.id === connectionId
  );

  if (
    !connection ||
    connection.toUid !== currentUser.id ||
    connection.status !== 'pending'
  ) {
    showToast('Permintaan tidak ditemukan atau sudah diproses.');
    return;
  }

  try {
    await updateDoc(doc(db, 'connections', connectionId), {
      status
    });

    setConnections((previous) =>
      previous.map((item) =>
        item.id === connectionId
          ? { ...item, status }
          : item
      )
    );

    showToast(
      status === 'accepted'
        ? 'Koneksi diterima!'
        : 'Permintaan koneksi ditolak.'
    );
  } catch (error) {
    console.error('Error updating connection:', error);
    showToast('Gagal memperbarui koneksi.');
    throw error;
  }
};

const getConnectionStatus = (personId) => {
  if (!currentUser) return null;

  return (
    connections.find(
      (connection) =>
        (connection.fromUid === currentUser.id &&
          connection.toUid === personId) ||
        (connection.fromUid === personId &&
          connection.toUid === currentUser.id)
    ) || null
  );
};

  

  // A result applies only to the account and retry that requested it.
  const isPending = (result, attempt) =>
    readsRemoteData && (result?.userId !== userId || result?.attempt !== attempt);

  const peopleLoading = isPending(peopleRead, peopleAttempt) || isPending(connectionsRead, peopleAttempt);
  const communitiesLoading = isPending(communitiesRead, circleAttempt);
  const membershipsLoading = isPending(membershipsRead, circleAttempt);

  return (
    <DataContext.Provider
      value={{
        communities: readsRemoteData && !communitiesLoading ? communities : EMPTY_LIST,
        createCommunity,
        joinCommunity,
        isCommunityJoined,
        events,
        eventsLoading,
        attendeesLoading,
        eventsError,
        attendeesError,
        retryEvents,
        createEvent,
        attendEvent,
        isEventAttending,
        people: readsRemoteData && !peopleLoading ? people : EMPTY_LIST,
        peopleLoading,
        peopleError: readsRemoteData && !peopleLoading ? peopleRead?.error || connectionsRead?.error : '',
        communitiesLoading,
        membershipsLoading,
        communitiesError: readsRemoteData && !communitiesLoading ? communitiesRead?.error : '',
        membershipsError: readsRemoteData && !membershipsLoading ? membershipsRead?.error : '',
        retryPeople,
        retryCircles,
        sendConnection,
        acceptConnection,
        getConnectionStatus,
        ensureUserCommunity,
        toastMessage,
        showToast,
        hideToast
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
