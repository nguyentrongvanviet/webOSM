import { useEffect, useState } from 'react';
import { isAuthConfigured, listenToAuthChanges, signInWithGoogle, signOutUser } from '../firebase';

const errorMessages = {
  'auth/popup-blocked': 'Trình duyệt đã chặn popup. Hãy bật popup cho trang này.',
  'auth/popup-closed-by-user': 'Cửa sổ đăng nhập đã bị đóng. Vui lòng thử lại.',
  'auth/cancelled-popup-request': 'Đang có phiên popup khác. Hãy thử lại.',
  'auth/unauthorized-domain': 'Tên miền hiện tại chưa được thêm vào Authorized domains trong Firebase Auth.',
  'auth/invalid-oauth-client-id': 'OAuth client ID không hợp lệ. Kiểm tra cấu hình Firebase.',
  'auth/operation-not-supported-in-this-environment': 'Môi trường không hỗ trợ popup. Thử dùng trình duyệt khác.',
  'auth/network-request-failed': 'Kết nối mạng gặp sự cố. Kiểm tra internet hoặc chặn popup/cookie.',
  'auth/configuration-not-found': 'Chưa bật Google trong Firebase Authentication. Vào Firebase Console → Authentication → Sign-in method → bật Google và đặt email hỗ trợ.',
};

const getErrorMessage = (code) => {
  const base = errorMessages[code] || 'Không thể đăng nhập bằng Google. Vui lòng thử lại.';
  return `${base}${code ? ` (mã: ${code})` : ''}`;
};

export function useAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState('');

  const authEnabled = isAuthConfigured();

  useEffect(() => {
    if (!authEnabled) {
      setAuthReady(true);
      return () => {};
    }

    const unsubscribe = listenToAuthChanges((currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
      setAuthError('');
    });

    return () => unsubscribe();
  }, [authEnabled]);

  const signIn = async () => {
    if (!authEnabled) {
      setAuthError('Chưa cấu hình Firebase. Thêm REACT_APP_FIREBASE_* và khởi động lại.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    try {
      await signInWithGoogle();
    } catch (err) {
      const code = err?.code || 'unknown';
      setAuthError(getErrorMessage(code));
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = async () => {
    if (!authEnabled) {
      setAuthError('Chưa cấu hình Firebase.');
      return;
    }

    setAuthLoading(true);
    setAuthError('');
    try {
      await signOutUser();
    } catch (err) {
      const code = err?.code || 'sign-out-error';
      setAuthError(getErrorMessage(code));
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    authEnabled,
    authReady,
    authLoading,
    authError,
    signIn,
    signOut,
  };
}
