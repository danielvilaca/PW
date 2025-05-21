import { useState } from 'react';
import { useAuth } from '../auth/AuthContext'; // <--- esta linha estava a faltar




function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);

    if (!success) {
      alert('Login falhou: credenciais inválidas');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light px-3">
      <div className="bg-white p-4 p-md-5 rounded-4 shadow-sm w-100" style={{ maxWidth: '380px' }}>

        {/* LOGO */}
        <div className="text-center mb-2">
          <img
            src="/logo.png"
            alt="SmartCondo Logo"
            className="img-fluid"
            style={{ maxWidth: '120px' }}
          />
        </div>

        {/* TÍTULO */}
        <h2 className="text-center mb-4 text-dark fw-semibold">Iniciar Sessão</h2>

        {/* FORMULÁRIO */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              placeholder="Insere o teu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Senha</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {erro && (
            <div className="alert alert-danger text-center py-2 mb-3" role="alert">
              {erro}
            </div>
          )}

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              Entrar
            </button>
          </div>
        </form>

        {/* MENSAGEM OPCIONAL */}
        <p className="text-center text-muted mt-3 small">
          © {new Date().getFullYear()} SmartCondo. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}

export default Login;
