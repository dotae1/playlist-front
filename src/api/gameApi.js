const BASE_URL = '/api/v1';

export async function fetchQuizTrack(decade) {
  const res = await fetch(`${BASE_URL}/game/quiz?decade=${decade}`);
  if (!res.ok) throw new Error('퀴즈 트랙을 불러오지 못했습니다.');
  return res.json();
}
