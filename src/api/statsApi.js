const BASE_URL = '/api/v1';

export async function getVisitorStats(days = 7) {
  const res = await fetch(`${BASE_URL}/admin/stats/visitors?days=${days}`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('통계를 불러오지 못했습니다.');
  return res.json();
}
