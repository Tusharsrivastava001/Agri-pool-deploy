const axios = require("axios");

const buildAdvisory = ({ temperature, humidity, rainfall }) => {
  const messages = [];

  if (temperature > 35) {
    messages.push("High temperature detected. Avoid sowing today and plan irrigation to reduce crop stress.");
  }

  if (humidity > 80) {
    messages.push("Humidity is high, so fungal disease risk is elevated. Monitor leaves and avoid over-irrigation.");
  }

  if (rainfall > 10) {
    messages.push("Rainfall is significant. Delay fertilizer application to reduce nutrient loss.");
  }

  if (!messages.length) {
    messages.push("Conditions look favorable for regular field operations and sowing decisions.");
  }

  return messages.join(" ");
};

exports.getWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ error: "City or district name is required" });
    }

    if (!process.env.WEATHER_API_KEY) {
      return res.status(500).json({ error: "Weather API key is not configured" });
    }

    const response = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: city,
        appid: process.env.WEATHER_API_KEY,
        units: "metric",
      },
      timeout: 12000,
    });

    const data = response.data;
    const weather = {
      city: data.name,
      temperature: data.main?.temp || 0,
      humidity: data.main?.humidity || 0,
      rainfall: data.rain?.["1h"] || data.rain?.["3h"] || 0,
      wind: data.wind?.speed || 0,
      condition: data.weather?.[0]?.description || "Current weather",
    };

    res.json({ weather, advisory: buildAdvisory(weather) });
  } catch (error) {
    console.error("Weather error:", error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "City not found. Try a nearby city or district name." });
    }

    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Weather API key is invalid or not activated yet." });
    }

    res.status(502).json({ error: "Unable to fetch weather data right now" });
  }
};
