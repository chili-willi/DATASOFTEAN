import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Navbar from './Navbar';

export default function Layout({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isPublicPage = ['/login', '/register'].includes(router.pathname);

    const hasToken = Boolean(token);

    // Evitamos ejecutar setState de forma síncrona envolviendo el bloque en una microtarea
    queueMicrotask(() => {
      setIsAuthenticated(hasToken);

      if (!hasToken) {
        if (!isPublicPage) {
          router.push('/login');
        } else {
          setLoading(false);
        }
      } else {
        if (isPublicPage) {
          router.push('/');
        } else {
          setLoading(false);
        }
      }
    });
  }, [router, router.pathname]);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          gap: '1rem',
          backgroundColor: '#0b0f19',
        }}
      >
        <div
          style={{
            width: '2.5rem',
            height: '2.5rem',
            border: '3px solid rgba(99, 102, 241, 0.2)',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>
          Cargando inventario...
        </span>
        <style>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  const isPublicPage = ['/login', '/register'].includes(router.pathname);

  return (
    <div className="app-container">
      {isAuthenticated && !isPublicPage && <Navbar />}
      <main className={isPublicPage ? '' : 'main-content'}>{children}</main>
    </div>
  );
}
