const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchQuizTrack(decade) {
  const res = await fetch(`${BASE_URL}/api/v1/game/quiz?decade=${decade}`);
  if (!res.ok) throw new Error('퀴즈 트랙을 불러오지 못했습니다.');
  return res.json();
}
