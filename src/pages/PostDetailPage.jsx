import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPost } from '../api/postApi';
import styles from './PostDetailPage.module.css';

const CATEGORY_LABEL = {
  SERVICE_PROPOSAL: '서비스 제의',
  COMPLAINT: '불편사항',
  QUESTION: '궁금증',
};

function formatDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleDateString('ko-KR', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPost(id)
      .then((res) => setPost(res.result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className={styles.center}>불러오는 중...</div>;
  if (error) return <div className={styles.center}>{error}</div>;

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.inner}>
        <Link to="/mypage" className={styles.backLink}>← 마이페이지로</Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div>
              <h1 className={styles.postTitle}>{post.title}</h1>
              <p className={styles.meta}>
                {CATEGORY_LABEL[post.category] ?? post.category} · {formatDate(post.createdAt)}
              </p>
            </div>
            <span className={`${styles.badge} ${post.status === 'ANSWERED' ? styles.badgeAnswered : styles.badgePending}`}>
              {post.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
            </span>
          </div>

          <div className={styles.divider} />

          <p className={styles.contentText}>{post.content}</p>

          {post.status === 'ANSWERED' && post.answer && (
            <div className={styles.answerSection}>
              <p className={styles.answerLabel}>관리자 답변</p>
              <p className={styles.answerText}>{post.answer}</p>
              {post.answeredAt && (
                <p className={styles.answerDate}>{formatDate(post.answeredAt)}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
