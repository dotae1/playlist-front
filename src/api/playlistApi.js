const BASE_URL = 'http://127.0.0.1:8080/api/v1';

export async function createPlaylist({ prompt, songCount, category }) {
  const response = await fetch(`${BASE_URL}/playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, songCount, category: category ?? null }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${response.status}`);
  }

  return response.json();
}
