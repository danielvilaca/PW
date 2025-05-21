import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from 'react-chartjs-2';
  
  // Regista os módulos do Chart.js
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
  
    return <Bar data={data} options={options} />;
  }
  
  export default CondominioChart;
  