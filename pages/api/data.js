export default async function handler(req, res) {
  const { latitudeInput, longitudeInput } = req.body;
  const getWeatherData = await fetch(
    `https://api.open-meteo.com/v1/forecast?timezone=auto&current_weather=true&daily=sunrise,sunset&latitude=${latitudeInput}&longitude=${longitudeInput}`
  );
  const data = await getWeatherData.json();
  res.status(200).json(data);
}
