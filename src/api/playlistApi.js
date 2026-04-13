const BASE_URL = '/api/v1';

export async function createPlaylist({ prompt, songCount }) {
  const response = await fetch(`${BASE_URL}/playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, songCount }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${response.status}`);
  }

  return response.json();
}
