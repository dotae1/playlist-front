const BASE_URL = 'http://localhost:8080/api/v1';

async function handleResponse(res) {
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `서버 오류: ${res.status}`);
  }
  return res.json();
}

export async function sendVerificationMail(email) {
  const res = await fetch(`${BASE_URL}/mail/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return handleResponse(res);
}

export async function verifyMailCode(email, code) {
  const res = await fetch(`${BASE_URL}/mail/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  });
  return handleResponse(res);
}

export async function join({ loginId, email, name, nickname, password, gender, age }) {
  const res = await fetch(`${BASE_URL}/members/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ loginId, email, name, nickname, password, gender: gender || null, age: age ? Number(age) : 0 }),
  });
  return handleResponse(res);
}

export async function login(loginId, password) {
  const res = await fetch(`${BASE_URL}/members/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ loginId, password }),
  });
  return handleResponse(res);
}

export async function logout() {
  const res = await fetch(`${BASE_URL}/members/logout`, {
    method: 'POST',
    credentials: 'include',
  });
  return handleResponse(res);
}
