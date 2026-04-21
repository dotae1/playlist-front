import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getPlaylist, deletePlaylist } from '../api/playlistApi';
import styles from './PlaylistDetailPage.module.css';

function formatDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
}

export default function PlaylistDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    getPlaylist(id)
      .then(setPlaylist)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deletePlaylist(id);
      navigate('/mypage');
    } catch (err) {
      setError(err.message);
      setShowConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className={styles.center}>불러오는 중...</div>;
  if (error) return <div className={styles.center}>{error}</div>;

  const songs = playlist?.songs ?? [];

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.inner}>
        <Link to="/mypage" className={styles.backLink}>← 마이페이지로</Link>

        {/* 헤더 */}
        <div className={styles.headerCard}>
          <div className={styles.headerLeft}>
            <h1 className={styles.playlistTitle}>{playlist.name}</h1>
            {playlist.prompt && (
              <p className={styles.playlistPrompt}>"{playlist.prompt}"</p>
            )}
            <p className={styles.playlistMeta}>
              {songs.length}곡 · {formatDate(playlist.createdAt)}
            </p>
          </div>
          <button className={styles.deleteBtn} onClick={() => setShowConfirm(true)}>
            삭제
          </button>
        </div>

        {/* 곡 목록 */}
        <div className={styles.songsCard}>
          <p className={styles.sectionTitle}>트랙 목록</p>
          <div className={styles.songList}>
            {songs.map((song, i) => (
              <div key={song.id ?? i} className={styles.songRow}>
                <span className={styles.songIndex}>{i + 1}</span>
                <div className={styles.songInfo}>
                  <p className={styles.songTitle}>{song.title}</p>
                  <p className={styles.songArtist}>{song.artist}</p>
                </div>
                <span className={styles.songAlbum}>{song.album}</span>
                {song.spotifyTrackId && (
                  <a
                    className={styles.spotifyLink}
                    href={`https://open.spotify.com/track/${song.spotifyTrackId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Spotify에서 듣기"
                  >
                    ▶
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showConfirm && (
        <div className={styles.overlay} onClick={() => setShowConfirm(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>플레이리스트 삭제</h2>
            <p className={styles.modalDesc}>
              "{playlist.name}"을 삭제하면 복구할 수 없어요. 정말 삭제할까요?
            </p>
            <div className={styles.modalBtns}>
              <button className={styles.cancelBtn} onClick={() => setShowConfirm(false)}>
                취소
              </button>
              <button className={styles.confirmBtn} onClick={handleDelete} disabled={deleting}>
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
