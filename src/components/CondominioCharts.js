import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function CondominioChart({ dados }) {
  const data = {
    labels: dados.map((c) => c.nome),
    datasets: [
      {
        label: 'Frações',
        data: dados.map((c) => c.fracoes),
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Distribuição de Frações</h5>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default CondominioChart;
