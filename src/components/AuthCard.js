import React from 'react';

const defaultAvatar = 'https://www.gravatar.com/avatar/?d=mp&s=80';

function AuthCard({ user, authEnabled, authReady, authLoading, authError, onSignIn, onSignOut }) {
  return (
    <div className="auth-card">
      <div className="auth-title">Đăng nhập bằng Google</div>
      {!authEnabled ? (
        <div className="auth-error">
          Chưa cấu hình Firebase. Thêm REACT_APP_FIREBASE_* vào file .env.local và khởi động lại.
        </div>
      ) : !authReady ? (
        <div className="auth-loading">Đang kiểm tra phiên đăng nhập...</div>
      ) : user ? (
        <div className="auth-user">
          <div className="auth-user-info">
            <img
              src={user.photoURL || defaultAvatar}
              alt={user.displayName || 'Người dùng'}
              className="auth-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <div>
              <div className="auth-name">{user.displayName || 'Người dùng'}</div>
              <div className="auth-email">{user.email}</div>
            </div>
          </div>
          <button
            className="auth-button secondary"
            onClick={onSignOut}
            disabled={authLoading}
          >
            {authLoading ? 'Đang xử lý...' : 'Đăng xuất'}
          </button>
        </div>
      ) : (
        <button
          className="auth-button"
          onClick={onSignIn}
          disabled={authLoading}
        >
          {authLoading ? 'Đang xử lý...' : 'Đăng kí / Đăng nhập Google'}
        </button>
      )}
      {authError && <div className="auth-error">{authError}</div>}
    </div>
  );
}

export default AuthCard;
