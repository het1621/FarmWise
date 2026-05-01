export const Weather={
  "name": "Weather",
  "type": "object",
  "properties": {
    "location": {
      "type": "string",
      "description": "Farm location"
    },
    "temperature": {
      "type": "number",
      "description": "Current temperature in Celsius"
    },
    "humidity": {
      "type": "number",
      "description": "Humidity percentage"
    },
    "rainfall": {
      "type": "number",
      "description": "Rainfall in mm"
    },
    "wind_speed": {
      "type": "number",
      "description": "Wind speed in km/h"
    },
    "condition": {
      "type": "string",
      "enum": [
        "sunny",
        "cloudy",
        "rainy",
        "stormy",
        "foggy"
      ],
      "description": "Weather condition"
    },
    "forecast_7_days": {
      "type": "array",
      "description": "7-day weather forecast",
      "items": {
        "type": "object",
        "properties": {
          "date": {
            "type": "string",
            "format": "date"
          },
          "max_temp": {
            "type": "number"
          },
          "min_temp": {
            "type": "number"
          },
          "condition": {
            "type": "string"
          },
          "rainfall_chance": {
            "type": "number"
          }
        }
      }
    }
  },
  "required": [
    "location",
    "temperature",
    "condition"
  ],
  "rls": {
    "write": {
      "$or": [
        {
          "created_by": "{{user.email}}"
        },
        {
          "user_condition": {
            "role": "admin"
          }
        }
      ]
    }
  }
}