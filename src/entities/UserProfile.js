{
  "name": "UserProfile",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "User's email"
    },
    "display_name": {
      "type": "string",
      "description": "Child's name"
    },
    "age": {
      "type": "number",
      "minimum": 3,
      "maximum": 18
    },
    "current_module": {
      "type": "string",
      "default": "hallulu",
      "description": "Currently active learning module"
    },
    "total_stars": {
      "type": "number",
      "default": 0
    },
    "total_practice_time": {
      "type": "number",
      "default": 0,
      "description": "Total time in minutes"
    },
    "badges_earned": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "List of badge IDs earned"
    },
    "unlocked_word_puzzles": {
      "type": "boolean",
      "default": false,
      "description": "Whether advanced word puzzles are unlocked"
    },
    "last_active": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "user_email",
    "display_name"
  ]
}