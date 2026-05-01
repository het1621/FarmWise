export const CropRecommendation = {
  "name": "CropRecommendation",
  "type": "object",
  "properties": {
    "crop_name": {
      "type": "string",
      "description": "Name of the recommended crop"
    },
    "category": {
      "type": "string",
      "enum": [
        "cereals",
        "vegetables",
        "fruits",
        "pulses",
        "cash_crops"
      ],
      "description": "Crop category"
    },
    "season": {
      "type": "string",
      "enum": [
        "kharif",
        "rabi",
        "summer"
      ],
      "description": "Growing season"
    },
    "profit_potential": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high",
        "very_high"
      ],
      "description": "Expected profit potential"
    },
    "water_requirement": {
      "type": "string",
      "enum": [
        "low",
        "medium",
        "high"
      ],
      "description": "Water requirement level"
    },
    "growing_period": {
      "type": "number",
      "description": "Growing period in days"
    },
    "suitable_soil": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Suitable soil types"
    },
    "expected_yield": {
      "type": "string",
      "description": "Expected yield per acre"
    },
    "market_price_range": {
      "type": "string",
      "description": "Current market price range"
    }
  },
  "required": [
    "crop_name",
    "category",
    "season"
  ],
  "rls": {
    "read": {},
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