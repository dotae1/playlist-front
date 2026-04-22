import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { fetchQuizTrack } from '../api/gameApi';
import styles from './GameQuizPage.module.css';

const MAX_RETRIES = 5;

const DECADE_LABELS = {
  '1990_EARLY': '1990년대 초 (1990~1994)',
  '1990_LATE': '1990년대 말 (1995~1999)',
  '2000': '2000년대',
  '2010': '2010년대',
  '2020': '2020년대',
};

function normalize(str) {
  return str.replace(/\s+/g, '').toLowerCase();
}

export default function GameQuizPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const decade = searchParams.get('decade');

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [titleInput, setTitleInput] = useState('');
  const [artistInput, setArtistInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);

  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const audioRef = useRef(null);
  const retryCountRef = useRef(0);

  const loadTrack = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSubmitted(false);
    setTitleInput('');
    setArtistInput('');
    setIsPlaying(false);
    setHintUsed(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    let attempts = 0;
    while (attempts < MAX_RETRIES) {
      try {
        const data = await fetchQuizTrack(decade);
        if (data.previewUrl) {
          retryCountRef.current = 0;
          setTrack(data);
          setLoading(false);
          return;
        }
        // previewUrl이 null이면 재시도
        attempts++;
      } catch {
        setError('트랙을 불러오는 중 오류가 발생했습니다.');
        setLoading(false);
        return;
      }
    }

    setError('재생 가능한 트랙을 찾지 못했습니다. 다시 시도해 주세요.');
    setLoading(false);
  }, [decade]);

  useEffect(() => {
    if (!decade || !DECADE_LABELS[decade]) {
      navigate('/game');
      return;
    }
    loadTrack();
  }, [decade, loadTrack, navigate]);

  // 오디오 재생/일시정지
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => setIsPlaying(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitted || !track) return;

    const titleOk = normalize(titleInput) === track.titleNormalized;
    const artistOk = normalize(artistInput) === track.artistNormalized;
    const isCorrect = titleOk && artistOk;

    setCorrect(isCorrect);
    setSubmitted(true);
    setTotal((t) => t + 1);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    loadTrack();
  };

  if (!decade || !DECADE_LABELS[decade]) return null;

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* 헤더 */}
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>AI Playlist</Link>
        <div className={styles.headerCenter}>
          <span className={styles.decadeBadge}>{DECADE_LABELS[decade]}</span>
        </div>
        <div className={styles.scoreBox}>
          <span className={styles.scoreLabel}>점수</span>
          <span className={styles.scoreVal}>{score} / {total}</span>
        </div>
      </header>

      <main className={styles.main}>
        {loading && (
          <div className={styles.loadingWrap}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>곡을 불러오는 중...</p>
          </div>
        )}

        {error && !loading && (
          <div className={styles.errorWrap}>
            <p className={styles.errorText}>{error}</p>
            <button className={styles.retryBtn} onClick={loadTrack}>다시 시도</button>
          </div>
        )}

        {track && !loading && !error && (
          <div className={styles.quizCard}>
            {/* 앨범 커버 + 재생 버튼 */}
            <div className={styles.albumWrap}>
              {hintUsed || submitted ? (
                <img
                  src={track.albumImageUrl}
                  alt="album cover"
                  className={styles.albumImg}
                />
              ) : (
                <div className={styles.albumPlaceholder}>
                  <span className={styles.questionMark}>?</span>
                </div>
              )}
              {submitted && (
                <div className={styles.albumOverlay}>
                  <p className={styles.revealTitle}>{track.title}</p>
                  <p className={styles.revealArtist}>{track.artist}</p>
                </div>
              )}
              <button
                className={`${styles.playBtn} ${isPlaying ? styles.playing : ''}`}
                onClick={togglePlay}
                aria-label={isPlaying ? '일시정지' : '재생'}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {!submitted && !hintUsed && (
                <button
                  className={styles.hintBtn}
                  onClick={() => setHintUsed(true)}
                  aria-label="앨범 커버 힌트 보기"
                >
                  힌트
                </button>
              )}

              <audio
                ref={audioRef}
                src={track.previewUrl}
                onEnded={handleAudioEnded}
              />
            </div>

            {/* 힌트 텍스트 */}
            {!submitted && (
              <p className={styles.hint}>재생 버튼을 눌러 곡을 듣고 제목과 아티스트를 맞춰보세요</p>
            )}

            {/* 정답 입력 폼 */}
            {!submitted ? (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>곡 제목</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="곡 제목을 입력하세요"
                    value={titleInput}
                    onChange={(e) => setTitleInput(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.inputLabel}>아티스트</label>
                  <input
                    className={styles.input}
                    type="text"
                    placeholder="아티스트 이름을 입력하세요"
                    value={artistInput}
                    onChange={(e) => setArtistInput(e.target.value)}
                    autoComplete="off"
                  />
                </div>
                <button
                  className={styles.submitBtn}
                  type="submit"
                  disabled={!titleInput.trim() || !artistInput.trim()}
                >
                  정답 확인
                </button>
              </form>
            ) : (
              <div className={styles.feedback}>
                <div className={`${styles.resultBadge} ${correct ? styles.correct : styles.wrong}`}>
                  {correct ? '정답!' : '오답'}
                </div>
                {!correct && (
                  <div className={styles.answerReveal}>
                    <p className={styles.answerRow}>
                      <span className={styles.answerField}>제목</span>
                      <span className={styles.answerVal}>{track.title}</span>
                    </p>
                    <p className={styles.answerRow}>
                      <span className={styles.answerField}>아티스트</span>
                      <span className={styles.answerVal}>{track.artist}</span>
                    </p>
                  </div>
                )}
                <div className={styles.actionRow}>
                  <button className={styles.nextBtn} onClick={handleNext}>다음 곡 →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 하단 네비게이션 */}
        <div className={styles.bottomNav}>
          <Link to="/game" className={styles.backLink}>← 연대 선택으로</Link>
          <Link to="/" className={styles.homeLink}>홈으로</Link>
        </div>
      </main>
    </div>
  );
}
