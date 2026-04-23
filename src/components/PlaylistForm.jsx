import { useState } from 'react';
import styles from './PlaylistForm.module.css';

const CATEGORIES = ['HIPHOP', '발라드', 'J-POP', 'POP', 'R&B', '인디'];

export default function PlaylistForm({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState('');
  const [songCount, setSongCount] = useState(10);
  const [customCount, setCustomCount] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [category, setCategory] = useState(null);

  const handleCategoryClick = (cat) => {
    setCategory((prev) => (prev === cat ? null : cat));
  };

  const handleCountClick = (n) => {
    setUseCustom(false);
    setCustomCount('');
    setSongCount(n);
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val === '') {
      setCustomCount('');
      return;
    }
    const num = Math.min(30, Math.max(1, Number(val)));
    setCustomCount(String(num));
    setSongCount(num);
  };

  const handleCustomFocus = () => {
    setUseCustom(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({ prompt: prompt.trim(), songCount, category });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 1행: 장르 */}
      <div className={styles.fieldBlock}>
        <span className={styles.fieldLabel}>장르</span>
        <div className={styles.categoryRow}>
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
      </div>

      {/* 2행: 곡 수 */}
      <div className={styles.fieldBlock}>
        <span className={styles.fieldLabel}>곡 수</span>
        <div className={styles.countRow}>
          <div className={styles.countButtons}>
            {[10, 20].map((n) => (
              <button
                key={n}
                type="button"
                className={`${styles.countBtn} ${!useCustom && songCount === n ? styles.countBtnActive : ''}`}
                onClick={() => handleCountClick(n)}
                disabled={loading}
              >
                {n}곡
              </button>
            ))}
            <input
              className={`${styles.countInput} ${useCustom ? styles.countInputActive : ''}`}
              type="text"
              inputMode="numeric"
              placeholder="직접 입력"
              value={customCount}
              onFocus={handleCustomFocus}
              onChange={handleCustomChange}
              disabled={loading}
              maxLength={2}
            />
            <span className={styles.countMax}>최대 30곡</span>
          </div>
        </div>
      </div>

      {/* 3행: 프롬프트 입력창 */}
      <textarea
        className={styles.textarea}
        placeholder="어떤 분위기의 플레이리스트를 원하시나요?&#10;예: 비 오는 날 카페에서 듣기 좋은 음악"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={7}
        disabled={loading}
      />

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
    </form>
  );
}
