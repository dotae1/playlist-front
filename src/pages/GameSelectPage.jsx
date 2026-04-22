import { useNavigate, Link } from 'react-router-dom';
import styles from './GameSelectPage.module.css';

const DECADES = [
  { value: '1990_EARLY', label: '1990년대 초', sub: '1990~1994', color: '#e040fb' },
  { value: '1990_LATE', label: '1990년대 말', sub: '1995~1999', color: '#c158dc' },
  { value: '2000', label: '2000년대', sub: '2000s Bangers', color: '#ff6d00' },
  { value: '2010', label: '2010년대', sub: '2010s Classics', color: '#00bcd4' },
  { value: '2020', label: '2020년대', sub: '2020s Fresh', color: '#1db954' },
];

export default function GameSelectPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.root}>
      <div className={styles.bg} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <header className={styles.header}>
        <Link to="/" className={styles.logo}>AI Playlist</Link>
      </header>

      <main className={styles.main}>
        <div className={styles.inner}>
          <div className={styles.badge}>Music Quiz Game</div>
          <h1 className={styles.title}>
            어떤 연대의<br />
            <span className={styles.highlight}>음악</span>을 맞춰볼까요?
          </h1>
          <p className={styles.sub}>연대를 선택하면 퀴즈가 시작돼요. 곡 제목과 아티스트를 모두 맞춰야 정답!</p>

          <div className={styles.grid}>
            {DECADES.map((d) => (
              <button
                key={d.value}
                className={styles.card}
                style={{ '--accent': d.color }}
                onClick={() => navigate(`/game/quiz?decade=${d.value}`)}
              >
                <span className={styles.cardLabel}>{d.label}</span>
                <span className={styles.cardSub}>{d.sub}</span>
                <span className={styles.cardArrow}>→</span>
              </button>
            ))}
          </div>

          <Link to="/" className={styles.homeLink}>← 홈으로 돌아가기</Link>
        </div>
      </main>
    </div>
  );
}
