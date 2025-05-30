import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function TopBar() {
  const { perfil, logout } = useAuth();
  const navigate = useNavigate();

  if (!perfil) return null;

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm mb-3 fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/condominios">Gestão</Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/condominios">Condomínios</Nav.Link>

            {perfil.role === 'inquilino' &&
              <Nav.Link as={Link} to="/novo-pedido">Novo&nbsp;Pedido</Nav.Link>}

            {['admin', 'senhorio'].includes(perfil.role) &&
              <Nav.Link as={Link} to="/gestao-pedidos">Gestão&nbsp;Pedidos</Nav.Link>}

            <Nav.Link as={Link} to="/faturas">Faturas</Nav.Link>
            <Nav.Link as={Link} to="/conta">Conta</Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              align="end"
              title={
                <img
                  src={perfil.foto_url || 'https://placehold.co/32'}
                  alt="avatar"
                  className="rounded-circle"
                  width="32" height="32"
                />
              }
            >
              <NavDropdown.Item onClick={() => { logout(); navigate('/login'); }}>
                <FiLogOut className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
