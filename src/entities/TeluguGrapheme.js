{
  "name": "TeluguGrapheme",
  "type": "object",
  "properties": {
    "glyph": {
      "type": "string",
      "description": "Telugu character or cluster"
    },
    "type": {
      "type": "string",
      "enum": [
        "hallulu",
        "hachchulu",
        "vattulu",
        "gugintalu",
        "deeghalu",
        "chillu",
        "yogavaha",
        "syllable",
        "word"
      ],
      "description": "Category of the grapheme"
    },
    "components": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Component tokens that make up this grapheme"
    },
    "transliteration": {
      "type": "string",
      "description": "Romanized form (IAST)"
    },
    "transliteration_simple": {
      "type": "string",
      "description": "Simplified ASCII transliteration"
    },
    "difficulty": {
      "type": "number",
      "minimum": 1,
      "maximum": 5,
      "description": "Difficulty level 1-5"
    },
    "module": {
      "type": "string",
      "description": "Learning module this belongs to"
    },
    "examples": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "IDs of words where this appears"
    },
    "confusable_with": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "IDs of similar-looking graphemes"
    },
    "prerequisite_components": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Component grapheme IDs that should be mastered first"
    }
  },
  "required": [
    "glyph",
    "type",
    "transliteration",
    "difficulty",
    "module"
  ]
}