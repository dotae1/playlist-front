import { useState } from 'react';
import styles from './PlaylistForm.module.css';

export default function PlaylistForm({ onSubmit, loading }) {
  const [prompt, setPrompt] = useState('');
  const [songCount, setSongCount] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onSubmit({ prompt: prompt.trim(), songCount });
  };

  const examples = [
    '비 오는 날 카페에서 듣기 좋은 음악',
    '새벽 드라이브할 때 어울리는 곡들',
    '운동할 때 에너지 넘치는 곡',
    '기분 전환이 필요한 날의 플레이리스트',
  ];

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.textareaWrapper}>
        <textarea
          className={styles.textarea}
          placeholder="어떤 분위기의 플레이리스트를 원하시나요?&#10;예: 비 오는 날 카페에서 듣기 좋은 음악"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          disabled={loading}
        />
      </div>

      <div className={styles.examples}>
        {examples.map((ex) => (
          <button
            key={ex}
            type="button"
            className={styles.exampleChip}
            onClick={() => setPrompt(ex)}
            disabled={loading}
          >
            {ex}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <div className={styles.countControl}>
          <label className={styles.countLabel}>곡 수</label>
          <div className={styles.countButtons}>
            {[5, 10, 15, 20].map((n) => (
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
