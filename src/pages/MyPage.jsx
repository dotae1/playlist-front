import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyPage } from '../api/postApi';
import styles from './MyPage.module.css';

const CATEGORY_LABEL = {
  SERVICE_PROPOSAL: '서비스 제의',
  COMPLAINT: '불편사항',
  QUESTION: '궁금증',
};

const GENDER_LABEL = { MAN: '남성', WOMAN: '여성' };

function formatDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export default function MyPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getMyPage()
      .then((res) => setData(res.result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.center}>불러오는 중...</div>;
  if (error) return <div className={styles.center}>{error}</div>;

  const playlists = data?.playlists ?? [];
  const posts = data?.posts ?? [];

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.inner}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>마이페이지</h1>
          <Link to="/inquiry/new" className={styles.inquiryBtn}>문의하기</Link>
        </div>

        {/* 프로필 정보 */}
        <div className={styles.card}>
          <p className={styles.sectionTitle}>내 정보</p>
          <div className={styles.profileGrid}>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>이름</span>
              <span className={styles.profileValue}>{data?.name ?? '-'}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>닉네임</span>
              <span className={styles.profileValue}>{data?.nickname ?? '-'}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>이메일</span>
              <span className={styles.profileValue}>{data?.email ?? '-'}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>나이</span>
              <span className={styles.profileValue}>{data?.age ? data.age : '-'}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>성별</span>
              <span className={styles.profileValue}>{GENDER_LABEL[data?.gender] ?? '-'}</span>
            </div>
          </div>
        </div>

        {/* 내 플레이리스트 */}
        <div className={styles.card}>
          <p className={styles.sectionTitle}>내 플레이리스트 ({playlists.length})</p>
          {playlists.length === 0 ? (
            <p className={styles.emptyMsg}>아직 생성한 플레이리스트가 없어요</p>
          ) : (
            <div className={styles.list}>
              {playlists.map((pl) => (
                <Link key={pl.id} to={`/playlist/${pl.id}`} className={styles.playlistItem}>
                  <p className={styles.playlistTitle}>{pl.name ?? pl.playlistTitle ?? pl.title ?? '제목 없음'}</p>
                  {pl.prompt && <p className={styles.playlistPrompt}>{pl.prompt}</p>}
                  <p className={styles.playlistDate}>{formatDate(pl.createdAt)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 내 문의 목록 */}
        <div className={styles.card}>
          <p className={styles.sectionTitle}>내 문의 ({posts.length})</p>
          {posts.length === 0 ? (
            <p className={styles.emptyMsg}>아직 작성한 문의가 없어요</p>
          ) : (
            <div className={styles.list}>
              {posts.map((post) => (
                <Link key={post.id} to={`/inquiry/${post.id}`} className={styles.postItem}>
                  <div className={styles.postLeft}>
                    <p className={styles.postTitle}>{post.title}</p>
                    <p className={styles.postMeta}>
                      {CATEGORY_LABEL[post.category] ?? post.category} · {formatDate(post.createdAt)}
                    </p>
                  </div>
                  <span className={`${styles.badge} ${post.status === 'ANSWERED' ? styles.badgeAnswered : styles.badgePending}`}>
                    {post.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
