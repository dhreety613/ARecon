import requests
from app.core.config import settings


class WeatherAPIService:
    OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
    OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"

    def get_weather(self, lat: float, lon: float) -> dict:
        if settings.WEATHER_API_KEY:
            try:
                return self._fetch_openweather(lat, lon)
            except ValueError:
                pass

        return self._fetch_open_meteo(lat, lon)

    def _fetch_openweather(self, lat: float, lon: float) -> dict:
        params = {
            "lat": lat,
            "lon": lon,
            "appid": settings.WEATHER_API_KEY,
            "units": "metric",
        }

        response = requests.get(self.OPENWEATHER_URL, params=params, timeout=10)

        if response.status_code != 200:
            raise ValueError("Weather API failed")

        data = response.json()

        return {
            "temperature_c": data["main"]["temp"],
            "wind_speed_mps": data["wind"]["speed"],
            "humidity_percent": data["main"]["humidity"],
            "pressure_hpa": data["main"]["pressure"],
            "visibility_m": data.get("visibility", 10000),
            "rainfall_mm": data.get("rain", {}).get("1h", 0),
            "condition": data["weather"][0]["description"],
        }

    def _fetch_open_meteo(self, lat: float, lon: float) -> dict:
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": ",".join(
                [
                    "temperature_2m",
                    "wind_speed_10m",
                    "relative_humidity_2m",
                    "surface_pressure",
                    "precipitation",
                    "weather_code",
                ]
            ),
        }

        response = requests.get(self.OPEN_METEO_URL, params=params, timeout=10)
        if response.status_code != 200:
            raise ValueError("Weather API failed")

        data = response.json()
        current = data.get("current", {})
        weather_code = int(current.get("weather_code", 0))

        return {
            "temperature_c": float(current.get("temperature_2m", 0.0)),
            "wind_speed_mps": float(current.get("wind_speed_10m", 0.0)),
            "humidity_percent": float(current.get("relative_humidity_2m", 0.0)),
            "pressure_hpa": float(current.get("surface_pressure", 1013.25)),
            "visibility_m": 10000.0,
            "rainfall_mm": float(current.get("precipitation", 0.0)),
            "condition": self._map_open_meteo_code(weather_code),
        }

    @staticmethod
    def _map_open_meteo_code(code: int) -> str:
        code_map = {
            0: "clear sky",
            1: "mainly clear",
            2: "partly cloudy",
            3: "overcast",
            45: "fog",
            48: "depositing rime fog",
            51: "light drizzle",
            53: "moderate drizzle",
            55: "dense drizzle",
            56: "light freezing drizzle",
            57: "dense freezing drizzle",
            61: "light rain",
            63: "moderate rain",
            65: "heavy rain",
            66: "light freezing rain",
            67: "heavy freezing rain",
            71: "light snow",
            73: "moderate snow",
            75: "heavy snow",
            77: "snow grains",
            80: "light rain showers",
            81: "moderate rain showers",
            82: "violent rain showers",
            85: "light snow showers",
            86: "heavy snow showers",
            95: "thunderstorm",
            96: "thunderstorm with slight hail",
            99: "thunderstorm with heavy hail",
        }
        return code_map.get(code, "unknown")
