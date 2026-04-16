import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ loginId: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

          <p className={styles.switchText}>
            계정이 없으신가요?{' '}
            <Link to="/signup" className={styles.switchLink}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
