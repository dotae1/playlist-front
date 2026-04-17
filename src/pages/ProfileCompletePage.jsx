import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { completeProfile } from '../api/authApi';
import { useAuth } from '../context/AuthContext';
import styles from './AuthPage.module.css';

const INITIAL_FORM = { nickname: '', gender: '', age: '' };

export default function ProfileCompletePage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nickname.trim()) { setError('닉네임을 입력해주세요.'); return; }
    setError(null);
    setLoading(true);
    try {
      await completeProfile({
        nickname: form.nickname,
        gender: form.gender || null,
        age: form.age,
      });
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
          <span className={styles.logo}>AI Playlist</span>
          <p className={styles.logoSub}>Gemini AI × Spotify</p>
        </div>

        <div className={styles.card}>
          <h1 className={styles.title}>추가 정보 입력</h1>
          <p className={styles.sub}>소셜 로그인 완료! 마지막 정보를 입력해주세요</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>닉네임 <span className={styles.required}>*</span></label>
              <input
                className={styles.input}
                type="text"
                name="nickname"
                value={form.nickname}
                onChange={handleChange}
                placeholder="사용할 닉네임을 입력하세요"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>나이</label>
              <input
                className={styles.input}
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="나이 (선택)"
                min="0"
                max="150"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>성별</label>
              <div className={styles.genderRow}>
                {[{ value: 'MAN', label: '남성' }, { value: 'WOMAN', label: '여성' }].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.genderBtn} ${form.gender === value ? styles.genderBtnActive : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, gender: prev.gender === value ? '' : value }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className={styles.error}>
                <span>⚠</span> {error}
              </div>
            )}

            <button className={styles.submitBtn} type="submit" disabled={loading}>
              {loading ? '저장 중...' : '시작하기'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
