import unittest
from unittest.mock import patch

from app.core.config import settings
from app.services.weather_api_service import WeatherAPIService


class _FakeResponse:
    def __init__(self, status_code: int, payload: dict) -> None:
        self.status_code = status_code
        self._payload = payload

    def json(self) -> dict:
        return self._payload


class WeatherAPIServiceTests(unittest.TestCase):
    def test_uses_open_meteo_when_api_key_is_missing(self) -> None:
        service = WeatherAPIService()

        def fake_get(url: str, params: dict, **kwargs) -> _FakeResponse:
            self.assertIn("open-meteo", url)
            self.assertEqual(kwargs.get("timeout"), 10)
            return _FakeResponse(
                200,
                {
                    "current": {
                        "temperature_2m": 23.2,
                        "wind_speed_10m": 4.1,
                        "relative_humidity_2m": 78,
                        "surface_pressure": 1009.4,
                        "precipitation": 0.3,
                        "weather_code": 61,
                    }
                },
            )

        with patch.object(settings, "WEATHER_API_KEY", None):
            with patch("app.services.weather_api_service.requests.get", side_effect=fake_get):
                data = service.get_weather(26.72, 88.39)

        self.assertEqual(data["temperature_c"], 23.2)
        self.assertEqual(data["wind_speed_mps"], 4.1)
        self.assertEqual(data["humidity_percent"], 78.0)
        self.assertEqual(data["pressure_hpa"], 1009.4)
        self.assertEqual(data["rainfall_mm"], 0.3)
        self.assertEqual(data["condition"], "light rain")

    def test_uses_openweather_when_api_key_is_present(self) -> None:
        service = WeatherAPIService()

        def fake_get(url: str, params: dict, **kwargs) -> _FakeResponse:
            self.assertIn("openweathermap", url)
            self.assertEqual(kwargs.get("timeout"), 10)
            return _FakeResponse(
                200,
                {
                    "main": {"temp": 28.4, "humidity": 66, "pressure": 1007},
                    "wind": {"speed": 6.8},
                    "visibility": 9000,
                    "rain": {"1h": 0.1},
                    "weather": [{"description": "clear sky"}],
                },
            )

        with patch.object(settings, "WEATHER_API_KEY", "dummy-key"):
            with patch("app.services.weather_api_service.requests.get", side_effect=fake_get):
                data = service.get_weather(26.72, 88.39)

        self.assertEqual(data["temperature_c"], 28.4)
        self.assertEqual(data["wind_speed_mps"], 6.8)
        self.assertEqual(data["humidity_percent"], 66.0)
        self.assertEqual(data["pressure_hpa"], 1007.0)
        self.assertEqual(data["visibility_m"], 9000.0)
        self.assertEqual(data["rainfall_mm"], 0.1)
        self.assertEqual(data["condition"], "clear sky")


if __name__ == "__main__":
    unittest.main()
