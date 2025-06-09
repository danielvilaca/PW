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

      {/* Acessos / call to action */}
      <div className="mt-4">
        <p className="lead">
          Use o Navbar acima para navegar pela aplicação. Conforme o seu role (admin, senhorio ou inquilino), você verá diferentes funcionalidades:
        </p>
        <ul>
          <li><strong>Admin:</strong> acessa tudo, inclusive Gestão de Contas.</li>
          <li><strong>Senhorio:</strong> acessa Condominios, Pedidos, Faturas, Pagamentos e Gere Orçamentos (além da sua Conta).</li>
          <li><strong>Inquilino:</strong> acessa Pedidos, Faturas, Pagamentos e adiciona sugestões de Orçamentos (além da sua Conta).</li>
        </ul>
      </div>

      {/* Contexto */}
      <div className="mt-4">
        <p className="lead">
          Contexto relativo às funcionalidades disponíveis:
        </p>
        <ul>
          <li><strong>Condominios:</strong> Gestao de Condominios com Condominios correspodentes do Senhorio com API de Meteorologia e
          Contagem de quartos alugados/ativo. (Acesso: Admin | Senhorio)</li>
          <li><strong>Pedidos:</strong> Visualização de Pedidos de reparação ao Senhorio, para eventual submissão/escolha de um
          respetivo orçamento. (Acesso: Admin | Senhorio | Inquilino)</li>
          <li><strong>Faturas: </strong> Visualização das Faturas atribuidas à respetiva conta. (Acesso: Admin | Senhorio | Inquilino)</li>
          <li><strong>Pagamentos:</strong> Visualização de Pagamentos existentes (Por pagar / Pagos) e Criação de pagamento
          atribuindo o mesmo a um respetivo inquilino (Acesso: Admin | Senhorio | Inquilino - Apenas pagamentos associados).</li>
          <li><strong>Orçamentos:</strong>Visualização dos orçamentos dentro dos containers de pedidos (visto que para existir
          um orçamento será necessário existir um pedido de reparação), CRUD e escolha final pelo Senhorio (data de validade de 30 dias ou
          data especifica) (Acesso: Admin | Senhorio | Inquilino)</li>
          <li><strong>Minha conta:</strong> Visualização da conta atualmente logada, com alteração do ícone, nome e email associado.
          (Acesso: Admin | Senhorio | Inquilino) </li>
          <li><strong>Gestao de Contas:</strong> Visualização de todas as contas, Válidas e Não Válidas, com CRUD e detalhes da mesma.
          (Acesso: Admin) </li>
        </ul>
      </div>

    </div>
  );
}
