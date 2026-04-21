import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAdminPosts, getAdminPost, answerPost } from '../api/postApi';
import styles from './AdminPage.module.css';

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

export default function AdminPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selected, setSelected] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [answer, setAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);

  useEffect(() => {
    getAdminPosts()
      .then((res) => setPosts(res.result ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (post) => {
    if (selected?.id === post.id) { setSelected(null); return; }
    setDetailLoading(true);
    setSubmitMsg(null);
    setAnswer('');
    try {
      const res = await getAdminPost(post.id);
      setSelected(res.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAnswer = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      await answerPost(selected.id, answer);
      setSubmitMsg('success');
      // 목록 + 상세 갱신
      const [listRes, detailRes] = await Promise.all([
        getAdminPosts(),
        getAdminPost(selected.id),
      ]);
      setPosts(listRes.result ?? []);
      setSelected(detailRes.result);
      setAnswer('');
    } catch (err) {
      setSubmitMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className={styles.center}>불러오는 중...</div>;
  if (error) return <div className={styles.center}>{error}</div>;

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.inner}>
        <Link to="/" className={styles.backLink}>← 홈으로</Link>

        <h1 className={styles.pageTitle}>
          문의 관리
          <span className={styles.adminBadge}>Admin</span>
        </h1>

        {/* 목록 */}
        {posts.length === 0 ? (
          <p className={styles.emptyMsg}>접수된 문의가 없습니다</p>
        ) : (
          <div className={styles.list}>
            {posts.map((post) => (
              <div key={post.id}>
                <div
                  className={styles.postRow}
                  onClick={() => handleSelect(post)}
                >
                  <div className={styles.postRowHeader}>
                    <div>
                      <p className={styles.postRowTitle}>{post.title}</p>
                      <p className={styles.postRowMeta}>
                        {CATEGORY_LABEL[post.category] ?? post.category} · {formatDate(post.createdAt)}
                      </p>
                    </div>
                    <span className={`${styles.badge} ${post.status === 'ANSWERED' ? styles.badgeAnswered : styles.badgePending}`}>
                      {post.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
                    </span>
                  </div>
                </div>

                {/* 선택된 항목 상세 */}
                {selected?.id === post.id && (
                  <div className={styles.detail} style={{ marginTop: 8 }}>
                    {detailLoading ? (
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>불러오는 중...</p>
                    ) : (
                      <>
                        <div className={styles.detailHeader}>
                          <div>
                            <h2 className={styles.detailTitle}>{selected.title}</h2>
                            <p className={styles.detailMeta}>
                              {CATEGORY_LABEL[selected.category] ?? selected.category} · {formatDate(selected.createdAt)}
                            </p>
                          </div>
                          <span className={`${styles.badge} ${selected.status === 'ANSWERED' ? styles.badgeAnswered : styles.badgePending}`}>
                            {selected.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
                          </span>
                        </div>

                        <div className={styles.divider} />

                        <p className={styles.contentText}>{selected.content}</p>

                        {selected.status === 'ANSWERED' && selected.answer && (
                          <div className={styles.existingAnswer}>
                            <p className={styles.answerLabel}>등록된 답변</p>
                            <p className={styles.answerText}>{selected.answer}</p>
                          </div>
                        )}

                        {/* 답변 입력 */}
                        <div className={styles.answerForm}>
                          <p className={styles.answerFormLabel}>
                            {selected.status === 'ANSWERED' ? '답변 수정' : '답변 등록'}
                          </p>
                          <textarea
                            className={styles.textarea}
                            rows={5}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder="답변 내용을 입력하세요"
                          />
                          {submitMsg === 'success' && (
                            <p className={styles.successMsg}>답변이 등록되었습니다.</p>
                          )}
                          {submitMsg && submitMsg !== 'success' && (
                            <p className={styles.errorMsg}>{submitMsg}</p>
                          )}
                          <button
                            className={styles.submitBtn}
                            onClick={handleAnswer}
                            disabled={submitting || !answer.trim()}
                          >
                            {submitting ? '등록 중...' : '답변 등록'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
