export async function getCurrentWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Erro ao obter dados do tempo');
  }

  const data = await response.json();
  return data.current_weather;
}
