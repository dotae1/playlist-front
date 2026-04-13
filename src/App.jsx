import { useState } from 'react';
import { createPlaylist } from './api/playlistApi';
import PlaylistForm from './components/PlaylistForm';
import TrackCard from './components/TrackCard';
import styles from './App.module.css';

const EXAMPLES = [
  {
    emoji: '☔',
    tag: '날씨',
    prompt: '비 오는 날 창가에서 멍하니 듣기 좋은 음악',
    desc: '날씨 + 상황을 조합하면 분위기가 더 잘 전달돼요',
  },
  {
    emoji: '🌙',
    tag: '시간대',
    prompt: '새벽 3시, 혼자 드라이브하면서 듣는 감성적인 곡',
    desc: '시간대와 행동을 함께 쓰면 정확도가 올라가요',
  },
  {
    emoji: '💪',
    tag: '활동',
    prompt: '헬스장에서 한계를 넘을 때 듣는 하드한 곡들',
    desc: '활동의 강도나 감정 상태를 구체적으로 써보세요',
  },
  {
    emoji: '🍂',
    tag: '계절',
    prompt: '가을 낙엽 밟으며 공원 산책할 때 어울리는 노래',
    desc: '계절 + 감각적 묘사로 더 생생한 추천이 가능해요',
  },
  {
    emoji: '💼',
    tag: '상황',
    prompt: '마감 전 집중해서 코딩할 때 방해 안 되는 음악',
    desc: '상황과 원하는 효과를 함께 적어보세요',
  },
  {
    emoji: '🥂',
    tag: '감정',
    prompt: '오랜 친구들과 오랜만에 만나서 신나게 즐길 파티 플레이리스트',
    desc: '분위기와 함께할 사람을 넣으면 더 좋아요',
  },
];

const FEATURES = [
  {
    icon: '🤖',
    title: 'Gemini AI 분석',
    desc: 'Google의 최신 AI가 입력한 분위기를 깊이 이해하고, 그에 맞는 곡을 선별합니다.',
  },
  {
    icon: '🎵',
    title: 'Spotify 실시간 연동',
    desc: '선별된 곡을 Spotify 라이브러리에서 실시간으로 검색해 실제 스트리밍 가능한 곡만 추천합니다.',
  },
  {
    icon: '✨',
    title: '맞춤형 플레이리스트',
    desc: '단순 키워드 매칭이 아닌 맥락과 감정을 AI가 해석해 나만을 위한 리스트를 만들어 드려요.',
  },
  {
    icon: '⚡',
    title: '빠른 생성',
    desc: '텍스트 한 줄로 수십 곡의 플레이리스트를 수 초 만에 완성합니다.',
  },
];

const PAGE_SIZE = 10;

export default function App() {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  const handleSubmit = async ({ prompt, songCount }) => {
    setLoading(true);
    setError(null);
    setPlaylist(null);
    setPage(1);

    try {
      const data = await createPlaylist({ prompt, songCount });
      setPlaylist(data);
    } catch (err) {
      setError(err.message || '플레이리스트 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const tracks = playlist?.tracks ?? [];
  const totalPages = Math.ceil(tracks.length / PAGE_SIZE);
  const pagedTracks = tracks.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.root}>
      {/* 배경 */}
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      {/* 히어로 섹션 */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>

          {/* 좌우 2분할 */}
          <div className={styles.heroLayout}>

            {/* 왼쪽: 폼 */}
            <div className={styles.heroLeft}>
              <div className={styles.badge}>
                <span className={styles.badgeDot} />
                Powered by Gemini AI × Spotify
              </div>
              <div className={styles.formCard}>
                <PlaylistForm onSubmit={handleSubmit} loading={loading} />
              </div>
              {error && (
                <div className={styles.error}>
                  <span>⚠</span> {error}
                </div>
              )}
            </div>

            {/* 오른쪽: 타이틀(기본) or 결과(생성 후) */}
            <div className={styles.heroRight}>
              {!playlist && !loading && (
                <div className={styles.heroText}>
                  <h1 className={styles.heroTitle}>
                    분위기를 말하면<br />
                    <span className={styles.gradientText}>AI가 플레이리스트를</span><br />
                    만들어 드려요
                  </h1>
                  <p className={styles.heroSub}>
                    감정, 날씨, 상황, 장르 — 어떤 말이든 좋아요.<br />
                    Gemini가 분석하고 Spotify에서 찾아드립니다.
                  </p>
                  <div className={styles.scrollHint}>
                    <span>더 잘 쓰는 법 보기</span>
                    <div className={styles.scrollArrow}>↓</div>
                  </div>
                </div>
              )}

              {loading && (
                <div className={styles.loadingArea}>
                  <div className={styles.wave}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} style={{ animationDelay: `${i * 0.12}s` }} />
                    ))}
                  </div>
                  <p className={styles.loadingText}>Gemini가 분위기를 분석하는 중...</p>
                  <p className={styles.loadingSubText}>Spotify에서 딱 맞는 곡을 찾고 있어요</p>
                </div>
              )}

              {playlist && !loading && (
                <div className={styles.resultBox}>
                  <div className={styles.resultHeader}>
                    <h2 className={styles.playlistTitle}>{playlist.playlistTitle}</h2>
                    <p className={styles.trackCount}>{tracks.length}곡</p>
                  </div>
                  <div className={styles.trackScroll}>
                    {pagedTracks.map((track, i) => (
                      <TrackCard
                        key={track.trackId ?? i}
                        track={track}
                        index={(page - 1) * PAGE_SIZE + i}
                      />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageBtn}
                        onClick={() => setPage((p) => p - 1)}
                        disabled={page === 1}
                      >←</button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          className={`${styles.pageBtn} ${page === p ? styles.pageBtnActive : ''}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        className={styles.pageBtn}
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page === totalPages}
                      >→</button>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 예시 섹션 */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionBadge}>Tips</div>
          <h2 className={styles.sectionTitle}>이렇게 입력하면 더 잘 나와요</h2>
          <p className={styles.sectionSub}>구체적일수록 AI가 더 정확하게 분석합니다</p>

          <div className={styles.exampleGrid}>
            {EXAMPLES.map((ex) => (
              <div key={ex.prompt} className={styles.exampleCard}>
                <div className={styles.exampleTop}>
                  <span className={styles.exampleEmoji}>{ex.emoji}</span>
                  <span className={styles.exampleTag}>{ex.tag}</span>
                </div>
                <p className={styles.examplePrompt}>"{ex.prompt}"</p>
                <p className={styles.exampleDesc}>{ex.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 기능 소개 섹션 */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionBadge}>Features</div>
          <h2 className={styles.sectionTitle}>AI Playlist가 특별한 이유</h2>
          <p className={styles.sectionSub}>단순한 검색이 아닌, 맥락을 이해하는 추천</p>

          <div className={styles.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{f.icon}</div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 푸터 */}
      <footer className={styles.footer}>
        <p>AI Playlist · Gemini AI × Spotify</p>
      </footer>
    </div>
  );
}
