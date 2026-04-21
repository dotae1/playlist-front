import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPost } from '../api/postApi';
import styles from './AuthPage.module.css';

const CATEGORIES = [
  { value: 'SERVICE_PROPOSAL', label: '서비스 제의' },
  { value: 'COMPLAINT', label: '불편사항' },
  { value: 'QUESTION', label: '궁금증' },
];

export default function InquiryPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', category: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category) { setError('카테고리를 선택해주세요.'); return; }
    setError(null);
    setLoading(true);
    try {
      await createPost(form);
      navigate('/mypage');
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
          <h1 className={styles.title}>문의하기</h1>
          <p className={styles.sub}>궁금한 점이나 불편사항을 알려주세요</p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>카테고리 <span className={styles.required}>*</span></label>
              <div className={styles.genderRow}>
                {CATEGORIES.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    className={`${styles.genderBtn} ${form.category === value ? styles.genderBtnActive : ''}`}
                    onClick={() => setForm((prev) => ({ ...prev, category: value }))}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>제목 <span className={styles.required}>*</span></label>
              <input
                className={styles.input}
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="제목을 입력하세요"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>내용 <span className={styles.required}>*</span></label>
              <textarea
                className={styles.input}
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="내용을 입력하세요"
                required
                rows={6}
                style={{ resize: 'vertical', lineHeight: '1.5' }}
              />
            </div>

            {error && (
              <div className={styles.error}>
                <span>⚠</span> {error}
              </div>
            )}

            <div className={styles.btnRow}>
              <button type="button" className={styles.backBtn} onClick={() => navigate(-1)}>
                취소
              </button>
              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? '등록 중...' : '문의 등록'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
