function CondominioCard({ nome, morada, fracoes, weather }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{nome}</h5>
        <p className="card-text"><strong>Morada:</strong> {morada}</p>
        <p className="card-text"><strong>Frações:</strong> {fracoes}</p>

        {weather ? (
          <div className="mt-3">
            <h6 className="text-muted">🌤️ Tempo Atual</h6>
            <p className="mb-1"><strong>Temperatura:</strong> {weather.temperature}°C</p>
            <p className="mb-1"><strong>Vento:</strong> {weather.windspeed} km/h</p>
            <p className="mb-0"><strong>Direção do vento:</strong> {weather.winddirection}°</p>
          </div>
        ) : (
          <p className="text-muted mt-3">A carregar dados meteorológicos...</p>
        )}
      </div>
    </div>
  );
}

export default CondominioCard;
