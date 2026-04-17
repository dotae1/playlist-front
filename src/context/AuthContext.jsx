import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuth } from '../api/authApi';

const AuthContext = createContext(null);

// tempToken만 있는 경로 — checkAuth() 호출 시 401 발생하므로 제외
const PUBLIC_PATHS = ['/login', '/signup', '/profile/complete'];

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null); // { id, loginId, email, name, nickname, gender, age, provider, profileComplete }

  useEffect(() => {
    const path = window.location.pathname;

    // 공개 경로는 서버 체크 없이 바로 로딩 완료
    if (PUBLIC_PATHS.includes(path)) {
      const cached = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(cached);
      setIsLoading(false);
      return;
    }

    // localStorage에 있어도 항상 서버 확인해서 user 정보 세팅
    checkAuth()
      .then((result) => {
        if (result) {
          localStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
          setUser(result);
        } else {
          localStorage.removeItem('isLoggedIn');
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const signIn = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const signOut = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
