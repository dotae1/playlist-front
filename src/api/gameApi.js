const BASE_URL = '/api/v1';

export async function fetchQuizTrack(decade) {
  const res = await fetch(`${BASE_URL}/game/quiz?decade=${decade}`);
  if (!res.ok) throw new Error('퀴즈 트랙을 불러오지 못했습니다.');
  return res.json();
}

export async function submitQuizAnswer(quizId, titleInput, artistInput) {
  const res = await fetch(`${BASE_URL}/game/quiz/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quizId, titleInput, artistInput }),
  });
  if (!res.ok) throw new Error('정답 제출 중 오류가 발생했습니다.');
  return res.json();
}

export async function collectQuizTracks(decade) {
  const res = await fetch(`${BASE_URL}/admin/game/collect?decade=${decade}`, {
    method: 'POST',
    credentials: 'include',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `서버 오류: ${res.status}`);
  }
  return res.json();
}
