import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
  const { isLoggedIn, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#080810',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.4)',
        fontSize: '14px',
      }}>
        로딩 중...
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) return <Navigate to="/" replace />;
  return children;
}
