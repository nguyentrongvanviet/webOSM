import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length) {
  // Provide a clear hint during local development when env vars are missing
  // eslint-disable-next-line no-console
  console.warn(
    `Firebase config is missing keys: ${missingKeys.join(', ')}. ` +
      'Authentication is disabled until environment variables are set.'
  );
}

let firebaseApp = null;
let auth = null;

if (missingKeys.length === 0) {
  try {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Firebase failed to initialize. Check your env vars.', error);
  }
}

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

const ensureAuth = () => {
  if (!auth) {
    throw new Error('Firebase Authentication is not configured. Please set REACT_APP_FIREBASE_* env vars.');
  }
  return auth;
};

export const isAuthConfigured = () => Boolean(auth);

export const signInWithGoogle = () => signInWithPopup(ensureAuth(), googleProvider);
export const signOutUser = () => (auth ? signOut(auth) : Promise.resolve());
export const listenToAuthChanges = (callback) => {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

export { auth };
