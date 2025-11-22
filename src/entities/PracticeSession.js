{
  "name": "PracticeSession",
  "type": "object",
  "properties": {
    "user_email": {
      "type": "string",
      "description": "User's email"
    },
    "grapheme_id": {
      "type": "string",
      "description": "Grapheme being practiced"
    },
    "puzzle_type": {
      "type": "string",
      "enum": [
        "grapheme_match",
        "decompose_rebuild",
        "sequence_sort",
        "transliteration",
        "spot_difference"
      ],
      "description": "Type of puzzle"
    },
    "was_successful": {
      "type": "boolean",
      "description": "Whether answer was correct"
    },
    "response_time": {
      "type": "number",
      "description": "Time taken in milliseconds"
    },
    "attempts_taken": {
      "type": "number",
      "default": 1,
      "description": "Number of attempts before success"
    },
    "is_adaptive_practice": {
      "type": "boolean",
      "default": false,
      "description": "Whether this was a targeted micro-practice"
    },
    "session_date": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "user_email",
    "grapheme_id",
    "puzzle_type",
    "was_successful",
    "response_time"
  ]
}