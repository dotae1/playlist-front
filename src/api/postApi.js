const BASE_URL = '/api/v1';

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${res.status}`);
  }
  return res.json();
}

export async function getMyPage() {
  const res = await fetch(`${BASE_URL}/members/mypage`, {
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function createPost({ title, content, category }) {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ title, content, category }),
  });
  return handleResponse(res);
}

export async function getPost(id) {
  const res = await fetch(`${BASE_URL}/posts/${id}`, {
    credentials: 'include',
  });
  return handleResponse(res);
}

// Admin
export async function getAdminPosts() {
  const res = await fetch(`${BASE_URL}/admin/posts`, {
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function getAdminPost(id) {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}`, {
    credentials: 'include',
  });
  return handleResponse(res);
}

export async function answerPost(id, answer) {
  const res = await fetch(`${BASE_URL}/admin/posts/${id}/answer`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ answer }),
  });
  return handleResponse(res);
}
