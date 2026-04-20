import { useState, useEffect } from 'react';
import { getMySpotifyPlaylists } from '../api/playlistApi';
import styles from './SpotifySaveModal.module.css';

/**
 * 기존 Spotify 플레이리스트 선택 모달
 * - onSelect(playlistId, playlistName): 기존 플레이리스트 선택 후 확인
 * - onCreateNew(): 플레이리스트가 없을 때 새로 생성 요청
 * - onClose(): 모달 닫기
 */
export default function SpotifySaveModal({ onSelect, onCreateNew, onClose }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMySpotifyPlaylists()
      .then((data) => setPlaylists(data?.items ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected.id, selected.name);
  };

  const isEmpty = !loading && !error && playlists.length === 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>플레이리스트 선택</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.body}>
          {loading && (
            <div className={styles.center}>
              <div className={styles.spinner} />
              <p>플레이리스트 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className={styles.errorBox}>
              <p>{error}</p>
            </div>
          )}

          {isEmpty && (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>🎵</div>
              <p className={styles.emptyTitle}>플레이리스트가 없어요</p>
              <p className={styles.emptyDesc}>
                Spotify에 아직 플레이리스트가 없습니다.<br />
                새로 만들어볼까요?
              </p>
              <button
                className={styles.createBtn}
                onClick={() => { onClose(); onCreateNew(); }}
              >
                + 새 플레이리스트 생성하기
              </button>
            </div>
          )}

          {!loading && !error && playlists.length > 0 && (
            <ul className={styles.list}>
              {playlists.map((pl) => (
                <li
                  key={pl.id}
                  className={`${styles.item} ${selected?.id === pl.id ? styles.itemSelected : ''}`}
                  onClick={() => setSelected(pl)}
                >
                  <div className={styles.itemImage}>
                    {pl.images?.[0]?.url ? (
                      <img src={pl.images[0].url} alt={pl.name} />
                    ) : (
                      <span>♪</span>
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{pl.name}</p>
                    <p className={styles.itemCount}>{pl.tracks?.total ?? 0}곡</p>
                  </div>
                  {selected?.id === pl.id && (
                    <span className={styles.check}>✓</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 플레이리스트가 있을 때만 하단 버튼 표시 */}
        {!isEmpty && !error && (
          <div className={styles.footer}>
            <button className={styles.cancelBtn} onClick={onClose}>취소</button>
            <button
              className={styles.confirmBtn}
              onClick={handleConfirm}
              disabled={!selected || loading}
            >
              추가하기
            </button>
          </div>
        )}

        {/* 에러 시에는 닫기 버튼만 */}
        {error && (
          <div className={styles.footer}>
            <button className={styles.cancelBtn} onClick={onClose}>닫기</button>
          </div>
        )}
      </div>
    </div>
  );
}
