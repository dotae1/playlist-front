const BASE_URL = '/api/v1';

export async function createPlaylist({ prompt, songCount, category }) {
  const response = await fetch(`${BASE_URL}/playlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ prompt, songCount, category: category ?? null }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${response.status}`);
  }

  return response.json();
}

/** 내 Spotify 플레이리스트 목록 조회 */
export async function getMySpotifyPlaylists() {
  const res = await fetch(`${BASE_URL}/playlist/spotify/my-playlists`, {
    method: 'GET',
    credentials: 'include',
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${res.status}`);
  }
  const data = await res.json();
  return data.result;
}

/** 새 Spotify 플레이리스트 생성 후 저장 */
export async function saveAsNewPlaylist({ playlistName, prompt, tracks }) {
  const res = await fetch(`${BASE_URL}/playlist/spotify/save-new`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ playlistName, prompt, tracks }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${res.status}`);
  }
  return res.json();
}

/** 기존 Spotify 플레이리스트에 트랙 추가 후 저장 */
export async function saveToExistingPlaylist({ targetSpotifyPlaylistId, playlistName, prompt, tracks }) {
  const res = await fetch(`${BASE_URL}/playlist/spotify/save-existing`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ targetSpotifyPlaylistId, playlistName, prompt, tracks }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${res.status}`);
  }
  return res.json();
}
