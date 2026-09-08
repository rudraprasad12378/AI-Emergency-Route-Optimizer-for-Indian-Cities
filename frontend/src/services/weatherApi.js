export const weatherApi = {
  getCurrentWeather: async () => {
    return {
      city: 'Bhubaneswar, Odisha',
      temperature: 31,
      condition: 'Heavy Overcast / Monsoon Showers',
      rainProbability: 70,
      windSpeedKmph: 18,
      visibilityKm: 4.5,
      waterloggingRisk: 'Moderate-High',
    };
  },
};
