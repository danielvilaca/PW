// src/pages/HomePage.js
import React from 'react';

export default function HomePage() {
  return (
    <div className="container mt-4">
      {/* Banner / Jumbotron */}
      <div className="p-5 text-center bg-light rounded-3">
        <h1 className="display-5 fw-bold">Bem-vindo(a) à WebApp de Gestão de Condomínios</h1>
        <p className="fs-5">
          Aqui você gere Pedidos, Faturas, Pagamentos e Contas conforme seu papel.
        </p>
        <img
          src="https://ipca.pt/wp-content/uploads/2023/03/Captura-de-ecra%CC%83-2023-01-12-a%CC%80s-14.20.10.png"
          alt="Banner de Gestão de Condomínios"
          className="img-fluid rounded"
        />
      </div>

      {/* Breve explicação / call to action */}
      <div className="mt-4">
        <p className="lead">
          Use o menu acima para navegar pela aplicação. Conforme o seu role (admin, senhorio ou inquilino), você verá diferentes funcionalidades:
        </p>
        <ul>
          <li><strong>Admin:</strong> acessa tudo, inclusive Gestão de Contas.</li>
          <li><strong>Senhorio:</strong> acessa Condominios, Pedidos, Faturas, Pagamentos e Gere Orçamentos (além de sua Conta).</li>
          <li><strong>Inquilino:</strong> acessa Pedidos, Faturas, Pagamentos e adiciona sugestões de Orçamentos (além de sua Conta).</li>
        </ul>
      </div>
    </div>
  );
}
