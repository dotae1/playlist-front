import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const GOOGLE_OAUTH_URL = 'http://127.0.0.1:8080/api/v1/oauth2/authorization/google';
const SPOTIFY_OAUTH_URL = 'http://127.0.0.1:8080/api/v1/oauth2/authorization/spotify';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ loginId: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const signupSuccess = location.state?.signupSuccess;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(form.loginId, form.password);
      signIn();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.container}>
        <div className={styles.logoArea}>
          <Link to="/" className={styles.logo}>AI Playlist</Link>
          <p className={styles.logoSub}>Gemini AI × Spotify</p>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>로그인</h1>
          <p className={styles.sub}>계정에 로그인하세요</p>

          {signupSuccess && (
            <div className={styles.success}>회원가입이 완료되었습니다. 로그인해주세요.</div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>아이디</label>
              <input
                className={styles.input}
                type="text"
                name="loginId"
                value={form.loginId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>비밀번호</label>
              <input
                className={styles.input}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="비밀번호를 입력하세요"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className={styles.error}>
                <span>⚠</span> {error}
              </div>
            )}

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 소셜 로그인 구분선 */}
          <div className={styles.divider}>
            <span className={styles.dividerLine} />
            <span className={styles.dividerText}>또는</span>
            <span className={styles.dividerLine} />
          </div>

          {/* 소셜 로그인 버튼 */}
          <div className={styles.socialGroup}>
            <button
              type="button"
              className={`${styles.socialBtn} ${styles.googleBtn}`}
              onClick={() => { window.location.href = GOOGLE_OAUTH_URL; }}
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google로 계속하기
            </button>

            <button
              type="button"
              className={`${styles.socialBtn} ${styles.spotifyBtn}`}
              onClick={() => { window.location.href = SPOTIFY_OAUTH_URL; }}
            >
              <svg className={styles.socialIcon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" fill="currentColor"/>
              </svg>
              Spotify로 계속하기
            </button>
          </div>

          <p className={styles.switchText}>
            계정이 없으신가요?{' '}
            <Link to="/signup" className={styles.switchLink}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
