import { useAuth } from '../auth/AuthContext';
import CondominioCard from '../components/CondominioCard';
import React, { useEffect, useState } from 'react';
import CondominioChart from '../components/CondominioCharts';
import { getCurrentWeather } from '../services/weatherService';


function CondominiosPage() {
  const { logout } = useAuth();

  const [condominios, setCondominios] = useState([
    {
      id: 1,
      nome: 'Condomínio Sol Nascente',
      morada: 'Rua das Flores, 123 - Braga',
      fracoes: 12,
      latitude: 41.55,
      longitude: -8.42,
    },
    {
      id: 2,
      nome: 'Edifício Mar Azul',
      morada: 'Av. da Praia, 45 - Esposende',
      fracoes: 8,
      latitude: 41.53,
      longitude: -8.78,
    },
    {
      id: 3,
      nome: 'Residencial Monte Verde',
      morada: 'Travessa do Campo, 7 - Guimarães',
      fracoes: 16,
      latitude: 41.44,
      longitude: -8.29,
    },
  ]);

  useEffect(() => {
    async function fetchAllWeather() {
      const updated = await Promise.all(
        condominios.map(async (cond) => {
          try {
            const weather = await getCurrentWeather(cond.latitude, cond.longitude);
            return { ...cond, weather };
          } catch {
            return { ...cond, weather: null };
          }
        })
      );
      setCondominios(updated);
    }

    fetchAllWeather();
  }, []);

  return (
    <div className="container mt-5 py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Dashboard SmartCondo</h1>
        <button className="btn btn-outline-danger" onClick={logout}>
          Terminar Sessão
        </button>
      </div>

      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-bg-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Condomínios Ativos</h5>
              <p className="display-6">{condominios.length}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total de Frações</h5>
              <p className="display-6">
                {condominios.reduce((acc, c) => acc + c.fracoes, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-bg-warning shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Média por Condomínio</h5>
              <p className="display-6">
                {Math.round(
                  condominios.reduce((acc, c) => acc + c.fracoes, 0) / condominios.length
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {condominios.map((cond) => (
          <div key={cond.id} className="col-md-4 mb-4">
            <CondominioCard
              nome={cond.nome}
              morada={cond.morada}
              fracoes={cond.fracoes}
              weather={cond.weather}
            />
          </div>
        ))}
      </div>

      <div className="mt-5">
        <h4>Distribuição de frações por condomínio</h4>
        <CondominioChart dados={condominios} />
      </div>
    </div>
  );
}

export default CondominiosPage;
