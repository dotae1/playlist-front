import { useState } from 'react';
import { createPlaylist } from './api/playlistApi';
import PlaylistForm from './components/PlaylistForm';
import TrackCard from './components/TrackCard';
import styles from './App.module.css';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async ({ prompt, songCount }) => {
    setLoading(true);
    setError(null);
    setPlaylist(null);

    try {
      const data = await createPlaylist({ prompt, songCount });
      setPlaylist(data);
    } catch (err) {
      setError(err.message || '플레이리스트 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.bg} />

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <svg viewBox="0 0 24 24" fill="#1db954" width="32" height="32">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span>AI Playlist</span>
          </div>
          <p className={styles.subtitle}>분위기를 입력하면 AI가 딱 맞는 플레이리스트를 만들어 드려요</p>
        </header>

        <div className={playlist && !loading ? styles.content : undefined}>
          <div className={playlist && !loading ? styles.left : styles.centerWrap}>
            <section className={styles.formSection}>
              <PlaylistForm onSubmit={handleSubmit} loading={loading} />
            </section>

            {error && (
              <div className={styles.error}>
                <span>⚠</span> {error}
              </div>
            )}

            {loading && (
              <div className={styles.loadingArea}>
                <div className={styles.wave}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
                <p>Gemini가 분위기를 분석하고 Spotify에서 곡을 찾는 중...</p>
              </div>
            )}
          </div>

          {playlist && !loading && (
            <div className={styles.right}>
              <section className={styles.result}>
                <div className={styles.resultHeader}>
                  <div>
                    <h2 className={styles.playlistTitle}>{playlist.playlistTitle}</h2>
                    <p className={styles.trackCount}>{playlist.tracks?.length ?? 0}곡</p>
                  </div>
                </div>

                <div className={styles.trackList}>
                  {playlist.tracks?.map((track, i) => (
                    <TrackCard key={track.trackId ?? i} track={track} index={i} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
