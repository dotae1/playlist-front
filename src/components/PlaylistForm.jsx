import { useState } from 'react';
import styles from './PlaylistForm.module.css';

const CATEGORIES = ['HIPHOP', '발라드', 'J-POP', 'POP'];

export default function PlaylistForm({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState('');
  const [songCount, setSongCount] = useState(10);
  const [category, setCategory] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({ prompt: prompt.trim(), songCount, category });
  };

  const handleCategoryClick = (cat) => {
    setCategory((prev) => (prev === cat ? null : cat));
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <div className={styles.categoryButtons}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${styles.categoryBtn} ${category === cat ? styles.categoryBtnActive : ''}`}
              onClick={() => handleCategoryClick(cat)}
              disabled={loading}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className={styles.textareaWrapper}>
          <textarea
            className={styles.textarea}
            placeholder="어떤 분위기의 플레이리스트를 원하시나요?&#10;예: 비 오는 날 카페에서 듣기 좋은 음악"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            disabled={loading}
          />
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.countControl}>
          <label className={styles.countLabel}>곡 수</label>
          <div className={styles.countButtons}>
            {[5, 10, 15, 20, 25].map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.countBtn} ${songCount === n ? styles.countBtnActive : ''}`}
                onClick={() => setSongCount(n)}
                disabled={loading}
              >
                {n}곡
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <span className={styles.spinner} />
              AI가 곡을 고르는 중...
            </>
          ) : (
            '플레이리스트 생성'
          )}
        </button>
      </div>
    </form>
  );
}
