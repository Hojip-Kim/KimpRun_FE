export const fetchUserInfo = async (statusUrl) => {
  const response = await fetch(statusUrl, {
    method: 'GET',
    credentials: 'include',
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    throw new Error('사용자 정보 가져오기 실패');
  }
};
