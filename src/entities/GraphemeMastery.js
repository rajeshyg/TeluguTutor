{
  "name": "GraphemeMastery",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "User's email"
    },
    "grapheme_id": {
      "type": "string",
      "description": "ID of the TeluguGrapheme"
    },
    "confidence_score": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "default": 0,
      "description": "Overall confidence 0-100"
    },
    "accuracy_rate": {
      "type": "number",
      "minimum": 0,
      "maximum": 100,
      "default": 0,
      "description": "Success percentage"
    },
    "total_attempts": {
      "type": "number",
      "default": 0
    },
    "successful_attempts": {
      "type": "number",
      "default": 0
    },
    "consecutive_successes": {
      "type": "number",
      "default": 0,
      "description": "Current streak"
    },
    "last_practiced": {
      "type": "string",
      "format": "date-time",
      "description": "Last practice timestamp"
    },
    "mastery_level": {
      "type": "string",
      "enum": [
        "not_started",
        "learning",
        "practicing",
        "proficient",
        "mastered"
      ],
      "default": "not_started"
    },
    "average_response_time": {
      "type": "number",
      "description": "Average time to correct answer in ms"
    },
    "needs_adaptive_practice": {
      "type": "boolean",
      "default": false,
      "description": "Flag for struggling graphemes"
    },
    "struggle_count": {
      "type": "number",
      "default": 0,
      "description": "Recent failures triggering adaptive practice"
    }
  },
  "required": [
    "user_email",
    "grapheme_id"
  ]
}