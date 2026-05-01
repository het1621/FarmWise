export const MarketPrice ={
  "name": "MarketPrice",
  "type": "object",
  "properties": {
    "item_name": {
      "type": "string",
      "description": "Name of crop/vegetable/fruit"
    },
    "category": {
      "type": "string",
      "enum": [
        "crops",
        "vegetables",
        "fruits",
        "seeds"
      ],
      "description": "Item category"
    },
    "current_price": {
      "type": "number",
      "description": "Current price per kg/quintal"
    },
    "unit": {
      "type": "string",
      "enum": [
        "kg",
        "quintal",
        "ton"
      ],
      "description": "Price unit"
    },
    "price_trend": {
      "type": "string",
      "enum": [
        "increasing",
        "decreasing",
        "stable"
      ],
      "description": "Price trend"
    },
    "market_location": {
      "type": "string",
      "description": "Market location"
    },
    "last_updated": {
      "type": "string",
      "format": "date",
      "description": "Last price update date"
    },
    "seasonal_high": {
      "type": "number",
      "description": "Seasonal high price"
    },
    "seasonal_low": {
      "type": "number",
      "description": "Seasonal low price"
    }
  },
  "required": [
    "item_name",
    "category",
    "current_price",
    "unit"
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