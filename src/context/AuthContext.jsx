import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

function getFriendlyErrorMessage(err) {
  if (!err) return 'Terjadi kesalahan autentikasi.';
  const code = err.code || '';
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Email ini sudah terdaftar. Silakan masuk.';
    case 'auth/invalid-email':
      return 'Format email tidak valid.';
    case 'auth/weak-password':
      return 'Kata sandi terlalu singkat (minimal 8 karakter).';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email atau kata sandi tidak sesuai.';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.';
    case 'auth/network-request-failed':
      return 'Gagal terhubung ke Firebase. Periksa koneksi internetmu.';
    case 'auth/operation-not-allowed':
      return 'Masuk dan daftar dengan email belum tersedia. Coba lagi nanti.';
    case 'permission-denied':
    case 'unavailable':
      return 'Profil kampus belum bisa dimuat atau disimpan. Coba lagi sebentar.';
    default:
      return err.code ? 'Layanan akun belum bisa dihubungi. Coba lagi sebentar.'
        : err.message || 'Terjadi kesalahan saat menghubungi server Firebase.';
  }
}

async function syncPublicProfile(userId, profile) {
  await setDoc(
    doc(db, 'publicProfiles', userId),
    {
      uid: userId,
      name: profile.name || 'Mahasiswa',
      major: profile.major || 'Mahasiswa',
      bio: profile.bio || '',
      interests: Array.isArray(profile.interests) ? profile.interests : [],
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}

async function withTimeout(promise, ms = 10000, errorMsg = 'Permintaan memakan waktu terlalu lama.') {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer);
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');

  const fetchUserProfile = async (firebaseUser) => {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    const extraData = userDoc.exists() ? userDoc.data() : {};

    return {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      name:
        firebaseUser.displayName ||
        extraData.name ||
        (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'Mahasiswa'),
      nim: extraData.nim || '',
      major: extraData.major || 'Mahasiswa',
      bio: extraData.bio || '',
      interests: extraData.interests || ['Fotografi', 'Musik'],
      social: extraData.social ?? 3,
      structure: extraData.structure ?? 3,
      activity: extraData.activity ?? 3,
    };
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    let active = true;
    let requestId = 0;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const request = ++requestId;
      try {
        const user = firebaseUser
          ? await withTimeout(fetchUserProfile(firebaseUser))
          : null;
        if (active && request === requestId) {
          setCurrentUser(user);
          setSessionError('');
        }
      } catch (err) {
        if (active && request === requestId) {
          console.error('onAuthStateChanged error:', err);
          setSessionError('Profil kampus belum bisa dimuat. Silakan masuk kembali.');
        }
      } finally {
        if (active && request === requestId) setLoading(false);
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const register = async (userData) => {
    const { name, nim, email, password, major, bio, interests, social, structure, activity } = userData;

    if (!name || !nim || !email || !password) {
      throw new Error('Mohon lengkapi data wajib.');
    }
    if (password.length < 8) {
      throw new Error('Kata sandi minimal 8 karakter.');
    }
    if (!interests || interests.length < 2 || interests.length > 4) {
      throw new Error('Pilih 2–4 minat yang paling menggambarkan dirimu.');
    }

    try {
      // 1. Create user in Firebase Auth with a 10s timeout
      const userCredential = await withTimeout(
        createUserWithEmailAndPassword(auth, email.trim(), password),
        10000,
        'Firebase tidak merespons. Pastikan koneksi aktif dan Email/Password diaktifkan di Firebase Console.'
      );
      const firebaseUser = userCredential.user;

      if (!firebaseUser) {
        throw new Error('Akun Firebase gagal dibuat. Silakan coba lagi.');
      }

      // 2. Update Firebase Auth displayName (background)
      await updateFirebaseProfile(firebaseUser, { displayName: name.trim() });
      
      // 3. Prepare profile data for Firestore
      const profileData = {
        name: name.trim(),
        nim: nim.trim(),
        email: email.trim().toLowerCase(),
        major: major ? major.trim() : 'Mahasiswa',
        bio: bio ? bio.trim() : '',
        interests,
        social: Number(social) || 5,
        structure: Number(structure) || 5,
        activity: Number(activity) || 5,
        updatedAt: new Date().toISOString()
      };

      // 4. Save to Firestore
      await setDoc(
        doc(db, 'users', firebaseUser.uid),
        {
          uid: firebaseUser.uid,
          ...profileData,
          createdAt: new Date().toISOString()
        },
        { merge: true }
      );

      await syncPublicProfile(firebaseUser.uid, profileData);

      // 5. Save the updated profile to Firestore
      const newUser = {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        ...profileData
      };

      setSessionError('');
      setCurrentUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Registration failed:', err);
      throw new Error(getFriendlyErrorMessage(err));
    }
  };

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const userCredential = await withTimeout(
        signInWithEmailAndPassword(auth, cleanEmail, password),
        10000,
        'Firebase tidak merespons. Periksa koneksi internetmu.'
      );
      const fullProfile = await fetchUserProfile(userCredential.user);
      await syncPublicProfile(userCredential.user.uid, fullProfile);
      
      setSessionError('');
      setCurrentUser(fullProfile);
      return fullProfile;
    } catch (err) {
      console.error('Login failed:', err);
      throw new Error(getFriendlyErrorMessage(err));
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setSessionError('');
    setCurrentUser(null);
  };

  const updateProfile = async (updatedFields) => {
    if (!currentUser) throw new Error('Tidak ada pengguna aktif.');

    if (updatedFields.interests) {
      if (updatedFields.interests.length < 2 || updatedFields.interests.length > 4) {
        throw new Error('Pilih 2–4 minat.');
      }
    }

    const updatedUser = {
      ...currentUser,
      ...updatedFields,
      social: updatedFields.social !== undefined ? Number(updatedFields.social) : currentUser.social,
      structure: updatedFields.structure !== undefined ? Number(updatedFields.structure) : currentUser.structure,
      activity: updatedFields.activity !== undefined ? Number(updatedFields.activity) : currentUser.activity
    };

    try {
      await setDoc(doc(db, 'users', currentUser.id), updatedUser, { merge: true });
      await syncPublicProfile(currentUser.id, updatedUser);
      if (auth.currentUser?.uid === updatedUser.id && updatedFields.name) {
        await updateFirebaseProfile(auth.currentUser, { displayName: updatedFields.name });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error('Perubahan profil belum tersimpan sepenuhnya. Coba simpan lagi.');
    }

    setCurrentUser((user) => user?.id === updatedUser.id ? updatedUser : user);
    return updatedUser;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        loading,
        sessionError,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
