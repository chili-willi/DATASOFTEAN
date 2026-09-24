import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../components/Layout';
import { UserPlus, Mail, Lock, AlertCircle, CheckCircle2, Sparkles, LogIn } from 'lucide-react';

const DJANGO_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Register() {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rol, setRol] = useState('Externo');
  const [error, setError] = useState(''); 
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${DJANGO_URL}/api/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password, rol }),
      });
      const data = await response.json();

      if (!response.ok) {
        const validationError = Object.values(data).flat().join(' ');
        setError(validationError || data.error || 'No fue posible registrar el usuario');
        return;
      }

      setSuccess('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
      setCorreo('');
      setPassword('');
      setConfirmPassword('');
      setRol('Externo');
    } catch (requestError) {
      setError('Error al conectar con el servidor backend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Crear cuenta - DataSoft Inventory</title>
      </Head>
      <div className="auth-wrapper">
        <div className="auth-card">
          <h2 className="card-title">Crear cuenta</h2>
          <p className="card-subtitle">Registra un nuevo usuario en DataSoft Inventory</p>

          {error && (
            <div className="alert alert-danger">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="correo">Correo Electrónico</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input id="correo" type="email" className="form-control" style={{ paddingLeft: '2.75rem' }} placeholder="ejemplo@correo.com" value={correo} onChange={(event) => setCorreo(event.target.value)} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rol">Rol</label>
              <select id="rol" className="form-control" value={rol} onChange={(event) => setRol(event.target.value)}>
                <option value="Externo">Externo</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input id="password" type="password" className="form-control" style={{ paddingLeft: '2.75rem' }} placeholder="Mínimo 8 caracteres" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="confirmPassword">Confirmar contraseña</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input id="confirmPassword" type="password" className="form-control" style={{ paddingLeft: '2.75rem' }} placeholder="Repite tu contraseña" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} minLength={8} required />
              </div>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <span>Registrando...</span>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Crear cuenta</span>
                </>
              )}
            </button>
          </form>

          <p className="card-subtitle" style={{ marginTop: '1.5rem', marginBottom: 0, color: 'var(--text-main)', display: 'flex', justifyContent: 'space-evenly' }}>
            ¿Ya tienes una cuenta? <button
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
              background: 'rgba(99, 102, 241, 0.1)'
            }}>
            <LogIn size={12} style={{ color: 'var(--primary)' }} />
            <span><Link href="/login" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Iniciar sesión</Link></span></button>
          </p>
        </div>
      </div>
    </Layout>
  );
}

Register.noLayout = true;
