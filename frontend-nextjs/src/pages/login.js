import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Mail, Lock, LogIn, AlertCircle, UserPlus } from 'lucide-react';

const DJANGO_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Login() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${DJANGO_URL}/api/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem(
          'user',
          JSON.stringify({
            correo: data.correo,
            rol: data.rol,
          })
        );
        router.push('/');
      } else {
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('Error al conectar con el servidor backend', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Iniciar Sesión - DataSoft Inventory</title>
      </Head>
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="card-title">Bienvenido</h2>
          <p className="card-subtitle">Ingresa tus credenciales para continuar</p>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="correo">
                Correo Electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="correo"
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="ejemplo@correo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                  }}
                />
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '2.75rem' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span>Ingresando...</span>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Ingresar</span>
                </>
              )}
            </button>
          </form>

          <p
            className="card-subtitle"
            style={{
              marginTop: '1.5rem',
              marginBottom: 0,
              color: 'var(--text-main)',
              display: 'flex',
              justifyContent: 'space-evenly',
            }}
          >
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.6rem',
                borderColor: 'var(--primary)',
                color: 'var(--text-main)',
                fontSize: '0.75rem',
                background: 'rgba(99, 102, 241, 0.1)',
              }}
            >
              <UserPlus size={12} style={{ color: 'var(--primary)' }} />
              <span>
                <Link
                  href="/register"
                  style={{ color: 'var(--text-main)', textDecoration: 'none' }}
                >
                  Crear cuenta
                </Link>
              </span>
            </button>
          </p>
        </div>
      </div>
    </Layout>
  );
}
// Desactivar renderizado automático del Navbar para esta página
Login.noLayout = true;
