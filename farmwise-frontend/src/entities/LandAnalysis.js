export const LandAnalysis = {
  "name": "LandAnalysis",
  "type": "object",
  "properties": {
    "farm_name": {
      "type": "string",
      "description": "Name of the farm"
    },
    "area": {
      "type": "number",
      "description": "Farm area in acres"
    },
    "soil_type": {
      "type": "string",
      "enum": [
        "alluvial",
        "black_soil",
        "red_soil",
        "laterite",
        "desert_soil",
        "mountain_soil"
      ],
      "description": "Primary soil type"
    },
    "ph_level": {
      "type": "number",
      "description": "Soil pH level"
    },
    "organic_matter": {
      "type": "number",
      "description": "Organic matter percentage"
    },
    "drainage": {
      "type": "string",
      "enum": [
        "excellent",
        "good",
        "moderate",
        "poor"
      ],
      "description": "Drainage quality"
    },
    "water_source": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "tube_well",
          "canal",
          "river",
          "rainwater",
          "pond"
        ]
      },
      "description": "Available water sources"
    },
    "topography": {
      "type": "string",
      "enum": [
        "flat",
        "gently_sloped",
        "hilly",
        "terraced"
      ],
      "description": "Land topography"
    },
    "recommendations": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Soil improvement recommendations"
    }
  },
  "required": [
    "farm_name",
    "area",
    "soil_type"
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