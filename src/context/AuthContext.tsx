import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged, 
  updateProfile,
  db,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  type User
} from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

export interface ToastInfo {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  adminEmails: string[];
  addOwnerEmail: (email: string) => void;
  removeOwnerEmail: (email: string) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, pass: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
  isGoogleModalOpen: boolean;
  openGoogleModal: () => void;
  closeGoogleModal: () => void;
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  hideToast: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Primary Owner Emails configured for ELA Digital World
const DEFAULT_ADMIN_EMAILS = [
  'elae2379@gmail.com', // Primary Agency Owner Email ID
  'eladigitalw@gmail.com'
];

const LOCAL_STORAGE_SESSION_KEY = 'ela_active_auth_user';
const LOCAL_STORAGE_OWNERS_KEY = 'ela_custom_owner_emails';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastInfo | null>(null);
  const [adminEmails, setAdminEmails] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_OWNERS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...parsed.map(e => e.toLowerCase())]));
        }
      }
    } catch {
      // fallback to defaults
    }
    return DEFAULT_ADMIN_EMAILS;
  });

  const checkIsAdmin = (email?: string | null): boolean => {
    if (!email) return false;
    const clean = email.trim().toLowerCase();
    return adminEmails.some(adm => adm.toLowerCase() === clean);
  };

  const addOwnerEmail = (newEmail: string) => {
    const clean = newEmail.trim().toLowerCase();
    if (!clean || adminEmails.includes(clean)) return;
    const updated = [...adminEmails, clean];
    setAdminEmails(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_OWNERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save owner email to storage:', e);
    }
    if (userProfile && userProfile.email.toLowerCase() === clean) {
      setUserProfile(prev => prev ? { ...prev, role: 'admin' } : null);
    }
  };

  const removeOwnerEmail = (removeEmail: string) => {
    const clean = removeEmail.trim().toLowerCase();
    if (clean === 'elae2379@gmail.com' || clean === 'eladigitalw@gmail.com') {
      alert('Primary owner email cannot be removed.');
      return;
    }
    const updated = adminEmails.filter(e => e.toLowerCase() !== clean);
    setAdminEmails(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_OWNERS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save owner email to storage:', e);
    }
  };

  const saveUserToFirestoreAndLocal = async (
    uid: string, 
    name: string, 
    email: string, 
    role: UserRole, 
    photoURL?: string,
    authProvider: string = 'google'
  ): Promise<UserProfile> => {
    const profile: UserProfile = {
      uid,
      name: name || email.split('@')[0],
      email: email.toLowerCase(),
      photoURL: photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
      role: role,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // 1. Save to Local Storage immediately for instant access
    try {
      localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 2. Sync to Firestore
    try {
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      const existingCreatedAt = userSnap.exists() && userSnap.data()?.createdAt 
        ? userSnap.data().createdAt 
        : new Date().toISOString();

      await setDoc(userRef, {
        ...profile,
        createdAt: existingCreatedAt,
        updatedAt: serverTimestamp(),
        authProvider,
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore user save notice (running with local cache fallback):', err);
    }

    return profile;
  };

  const syncUserProfile = async (firebaseUser: User, customName?: string) => {
    try {
      const email = (firebaseUser.email || '').toLowerCase();
      const isOwner = checkIsAdmin(email);
      const role: UserRole = isOwner ? 'admin' : 'user';
      const name = customName || firebaseUser.displayName || email.split('@')[0] || 'User';
      const photo = firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`;

      const profile = await saveUserToFirestoreAndLocal(
        firebaseUser.uid,
        name,
        email,
        role,
        photo,
        firebaseUser.providerData?.[0]?.providerId || 'firebase_auth'
      );

      setUserProfile(profile);
    } catch (err: any) {
      console.warn('Firestore user sync fallback:', err);
      const email = (firebaseUser.email || '').toLowerCase();
      const isOwner = checkIsAdmin(email);
      const profile: UserProfile = {
        uid: firebaseUser.uid,
        name: customName || firebaseUser.displayName || email.split('@')[0] || 'User',
        email: email,
        photoURL: firebaseUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${firebaseUser.uid}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        role: isOwner ? 'admin' : 'user'
      };
      setUserProfile(profile);
      try {
        localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(profile));
      } catch {}
    }
  };

  // Restore session on boot
  useEffect(() => {
    let isMounted = true;

    // Check localStorage session first for instant responsiveness
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
      if (cached) {
        const parsedProfile: UserProfile = JSON.parse(cached);
        if (parsedProfile && parsedProfile.email) {
          const isOwner = checkIsAdmin(parsedProfile.email);
          parsedProfile.role = isOwner ? 'admin' : parsedProfile.role;
          setUserProfile(parsedProfile);
          // Create synthetic User object for compatibility
          const mockUser: any = {
            uid: parsedProfile.uid,
            email: parsedProfile.email,
            displayName: parsedProfile.name,
            photoURL: parsedProfile.photoURL
          };
          setUser(mockUser);
        }
      }
    } catch (e) {
      console.warn('Error reading stored session:', e);
    }

    // Subscribe to Firebase Auth state
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!isMounted) return;
      if (currentUser) {
        setUser(currentUser);
        await syncUserProfile(currentUser);
      } else {
        // If not in Firebase Auth, check if we have a locally stored active session
        try {
          const cached = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
          if (cached) {
            const parsedProfile: UserProfile = JSON.parse(cached);
            if (parsedProfile && parsedProfile.email) {
              const isOwner = checkIsAdmin(parsedProfile.email);
              parsedProfile.role = isOwner ? 'admin' : parsedProfile.role;
              setUserProfile(parsedProfile);
              setUser({
                uid: parsedProfile.uid,
                email: parsedProfile.email,
                displayName: parsedProfile.name,
                photoURL: parsedProfile.photoURL
              } as any);
            }
          }
        } catch {}
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = 'toast_' + Date.now();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const hideToast = () => {
    setToast(null);
  };

  /**
   * Real Google Authentication via Firebase Auth
   */
  const loginWithGoogle = async (): Promise<void> => {
    setAuthError(null);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await syncUserProfile(result.user);
        setIsGoogleModalOpen(false);
        const email = (result.user.email || '').toLowerCase();
        const isOwner = checkIsAdmin(email);
        showToast(
          isOwner 
            ? '✓ Welcome Agency Owner! Administrative features unlocked.' 
            : `✓ Welcome ${result.user.displayName || 'Client'}! Signed in with Google.`, 
          'success'
        );
        return;
      }
    } catch (err: any) {
      console.warn('Google popup auth notice:', err?.code, err?.message);
      let errorMsg = 'Google sign-in could not be completed.';
      
      if (err.code === 'auth/popup-blocked') {
        errorMsg = 'Sign-in popup was blocked by your browser. Please allow popups or use Email & Password below.';
      } else if (err.code === 'auth/popup-closed-by-user' || err.code === 'auth/cancelled-popup-request') {
        errorMsg = 'Sign-in cancelled (popup was closed).';
      } else if (err.code === 'auth/unauthorized-domain') {
        errorMsg = 'This domain is being authorized. You can sign in using Email & Password below.';
      } else if (err.message) {
        errorMsg = err.message;
      }

      setAuthError(errorMsg);
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
  };

  /**
   * Real Email & Password Sign-In via Firebase Auth
   */
  const loginWithEmail = async (email: string, pass: string): Promise<void> => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const msg = 'Please enter a valid email address.';
      setAuthError(msg);
      showToast(msg, 'error');
      throw new Error(msg);
    }
    if (!pass || pass.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setAuthError(msg);
      showToast(msg, 'error');
      throw new Error(msg);
    }

    try {
      const result = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (result.user) {
        await syncUserProfile(result.user);
        const isOwner = checkIsAdmin(cleanEmail);
        setIsGoogleModalOpen(false);
        showToast(
          isOwner 
            ? '✓ Signed in as Agency Owner! Full controls unlocked.' 
            : '✓ Welcome back! Signed in successfully.', 
          'success'
        );
        return;
      }
    } catch (err: any) {
      console.warn('SignIn error:', err?.code, err?.message);
      let errorMsg = 'Sign in failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = 'Invalid email or password. Please verify your credentials or click Create Account.';
      } else if (err.code === 'auth/too-many-requests') {
        errorMsg = 'Access disabled temporarily due to many failed attempts. Try again later or reset password.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
  };

  /**
   * Real Email & Password Account Registration via Firebase Auth
   */
  const signupWithEmail = async (name: string, email: string, pass: string): Promise<void> => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanName) {
      const msg = 'Please enter your full name.';
      setAuthError(msg);
      showToast(msg, 'error');
      throw new Error(msg);
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const msg = 'Please enter a valid email address.';
      setAuthError(msg);
      showToast(msg, 'error');
      throw new Error(msg);
    }
    if (!pass || pass.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setAuthError(msg);
      showToast(msg, 'error');
      throw new Error(msg);
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (result.user) {
        await updateProfile(result.user, { displayName: cleanName });
        await syncUserProfile(result.user, cleanName);
        setIsGoogleModalOpen(false);
        showToast(`✓ Account created! Welcome, ${cleanName}.`, 'success');
        return;
      }
    } catch (err: any) {
      console.warn('Signup error:', err?.code, err?.message);
      let errorMsg = 'Could not create account.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email is already registered. Please click Sign In instead.';
      } else if (err.code === 'auth/weak-password') {
        errorMsg = 'Password should be at least 6 characters.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }
  };

  /**
   * Real Password Reset via Firebase Auth
   */
  const resetPassword = async (email: string): Promise<void> => {
    setAuthError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      const msg = 'Please enter your registered email address.';
      setAuthError(msg);
      showToast(msg, 'error');
      throw new Error(msg);
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      showToast('✓ Password reset link dispatched to your email!', 'success');
    } catch (err: any) {
      const msg = err.message || 'Could not send password reset email.';
      setAuthError(msg);
      showToast(msg, 'error');
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.warn('Signout notice:', err);
    }
    try {
      localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
    } catch {}
    setUser(null);
    setUserProfile(null);
    showToast('Signed out of session', 'info');
  };

  const isAdmin = Boolean(
    userProfile?.role === 'admin' || 
    checkIsAdmin(userProfile?.email) || 
    checkIsAdmin(user?.email)
  );

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      isAdmin,
      isOwner: isAdmin,
      adminEmails,
      addOwnerEmail,
      removeOwnerEmail,
      loginWithGoogle,
      loginWithEmail,
      signupWithEmail,
      resetPassword,
      logout,
      authError,
      clearAuthError: () => setAuthError(null),
      isGoogleModalOpen,
      openGoogleModal: () => setIsGoogleModalOpen(true),
      closeGoogleModal: () => setIsGoogleModalOpen(false),
      toast,
      showToast,
      hideToast
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
