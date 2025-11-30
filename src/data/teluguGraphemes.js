export const TELUGU_GRAPHEMES = [
  // --- ACHCHULU (Vowels) - Module: achchulu ---
  // FIX: Changed module from 'hallulu' to 'achchulu'
  // FIX: Changed 'ru' to 'ṛ'
  { id: 'v1', glyph: 'అ', transliteration: 'a', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['అ'] },
  { id: 'v2', glyph: 'ఆ', transliteration: 'ā', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఆ'] },
  { id: 'v3', glyph: 'ఇ', transliteration: 'i', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఇ'] },
  { id: 'v4', glyph: 'ఈ', transliteration: 'ī', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఈ'] },
  { id: 'v5', glyph: 'ఉ', transliteration: 'u', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఉ'] },
  { id: 'v6', glyph: 'ఊ', transliteration: 'ū', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఊ'] },
  { id: 'v7', glyph: 'ఋ', transliteration: 'ṛ', type: 'vowel', module: 'achchulu', difficulty: 2, components: ['ఋ'] },
  { id: 'v8', glyph: 'ఎ', transliteration: 'e', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఎ'] },
  { id: 'v9', glyph: 'ఏ', transliteration: 'ē', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఏ'] },
  { id: 'v10', glyph: 'ఐ', transliteration: 'ai', type: 'vowel', module: 'achchulu', difficulty: 2, components: ['ఐ'] },
  { id: 'v11', glyph: 'ఒ', transliteration: 'o', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఒ'] },
  { id: 'v12', glyph: 'ఓ', transliteration: 'ō', type: 'vowel', module: 'achchulu', difficulty: 1, components: ['ఓ'] },
  { id: 'v13', glyph: 'ఔ', transliteration: 'au', type: 'vowel', module: 'achchulu', difficulty: 2, components: ['ఔ'] },
  { id: 'v14', glyph: 'అం', transliteration: 'aṃ', type: 'vowel', module: 'achchulu', difficulty: 2, components: ['అ', 'ం'] },
  { id: 'v15', glyph: 'అః', transliteration: 'aḥ', type: 'vowel', module: 'achchulu', difficulty: 2, components: ['అ', 'ః'] },

  // --- HALLULU (Consonants) - Module: hallulu ---
  // FIX: Added dots for retroflex letters (ṭ, ḍ, ṇ, ḷ) and distinct sibilants (ś, ṣ)
  { id: 'c1', glyph: 'క', transliteration: 'ka', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['క'] },
  { id: 'c2', glyph: 'ఖ', transliteration: 'kha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఖ'] },
  { id: 'c3', glyph: 'గ', transliteration: 'ga', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['గ'] },
  { id: 'c4', glyph: 'ఘ', transliteration: 'gha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఘ'] },
  { id: 'c5', glyph: 'ఙ', transliteration: 'ṅa', type: 'consonant', module: 'hallulu', difficulty: 3, components: ['ఙ'] },
  { id: 'c6', glyph: 'చ', transliteration: 'ca', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['చ'] }, // or 'cha' depending on preference, standard is 'ca'
  { id: 'c7', glyph: 'ఛ', transliteration: 'cha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఛ'] }, // or 'chha'
  { id: 'c8', glyph: 'జ', transliteration: 'ja', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['జ'] },
  { id: 'c9', glyph: 'ఝ', transliteration: 'jha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఝ'] },
  { id: 'c10', glyph: 'ఞ', transliteration: 'ña', type: 'consonant', module: 'hallulu', difficulty: 3, components: ['ఞ'] },
  
  // Retroflex Consonants (The "Dot" group)
  { id: 'c11', glyph: 'ట', transliteration: 'ṭa', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['ట'] },
  { id: 'c12', glyph: 'ఠ', transliteration: 'ṭha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఠ'] },
  { id: 'c13', glyph: 'డ', transliteration: 'ḍa', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['డ'] },
  { id: 'c14', glyph: 'ఢ', transliteration: 'ḍha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఢ'] },
  { id: 'c15', glyph: 'ణ', transliteration: 'ṇa', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ణ'] },
  
  // Dental Consonants
  { id: 'c16', glyph: 'త', transliteration: 'ta', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['త'] },
  { id: 'c17', glyph: 'థ', transliteration: 'tha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['థ'] },
  { id: 'c18', glyph: 'ద', transliteration: 'da', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['ద'] },
  { id: 'c19', glyph: 'ధ', transliteration: 'dha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ధ'] },
  { id: 'c20', glyph: 'న', transliteration: 'na', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['న'] },
  
  { id: 'c21', glyph: 'ప', transliteration: 'pa', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['ప'] },
  { id: 'c22', glyph: 'ఫ', transliteration: 'pha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఫ'] },
  { id: 'c23', glyph: 'బ', transliteration: 'ba', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['బ'] },
  { id: 'c24', glyph: 'భ', transliteration: 'bha', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['భ'] },
  { id: 'c25', glyph: 'మ', transliteration: 'ma', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['మ'] },
  { id: 'c26', glyph: 'య', transliteration: 'ya', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['య'] },
  { id: 'c27', glyph: 'ర', transliteration: 'ra', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['ర'] },
  { id: 'c28', glyph: 'ల', transliteration: 'la', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['ల'] },
  { id: 'c29', glyph: 'వ', transliteration: 'va', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['వ'] },
  
  // Sibilants (Changes based on your example 'śrī' and 'viṣame')
  { id: 'c30', glyph: 'శ', transliteration: 'śa', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['శ'] },
  { id: 'c31', glyph: 'ష', transliteration: 'ṣa', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ష'] },
  { id: 'c32', glyph: 'స', transliteration: 'sa', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['స'] },
  { id: 'c33', glyph: 'హ', transliteration: 'ha', type: 'consonant', module: 'hallulu', difficulty: 1, components: ['హ'] },
  
  // Other
  { id: 'c34', glyph: 'ళ', transliteration: 'ḷa', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ళ'] }, // L dot
  { id: 'c35', glyph: 'క్ష', transliteration: 'kṣa', type: 'consonant', module: 'hallulu', difficulty: 3, components: ['క', '్', 'ష'] },
  { id: 'c36', glyph: 'ఱ', transliteration: 'ṛa', type: 'consonant', module: 'hallulu', difficulty: 2, components: ['ఱ'] }, // or rra

  // --- GUNINTALU (Vowel Signs) ---
  { id: 'gs1', glyph: 'ా', transliteration: 'ā', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ా'] },
  { id: 'gs2', glyph: 'ి', transliteration: 'i', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ి'] },
  { id: 'gs3', glyph: 'ీ', transliteration: 'ī', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ీ'] },
  { id: 'gs4', glyph: 'ు', transliteration: 'u', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ు'] },
  { id: 'gs5', glyph: 'ూ', transliteration: 'ū', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ూ'] },
  { id: 'gs6', glyph: 'ృ', transliteration: 'ṛ', type: 'sign', module: 'gunintalu', difficulty: 2, components: ['ృ'] },
  { id: 'gs7', glyph: 'ె', transliteration: 'e', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ె'] },
  { id: 'gs8', glyph: 'ే', transliteration: 'ē', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ే'] },
  { id: 'gs9', glyph: 'ై', transliteration: 'ai', type: 'sign', module: 'gunintalu', difficulty: 2, components: ['ై'] },
  { id: 'gs10', glyph: 'ొ', transliteration: 'o', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ొ'] },
  { id: 'gs11', glyph: 'ో', transliteration: 'ō', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ో'] },
  { id: 'gs12', glyph: 'ౌ', transliteration: 'au', type: 'sign', module: 'gunintalu', difficulty: 2, components: ['ౌ'] },
  { id: 'gs13', glyph: 'ం', transliteration: 'ṃ', type: 'sign', module: 'gunintalu', difficulty: 1, components: ['ం'] },
  { id: 'gs14', glyph: 'ః', transliteration: 'ḥ', type: 'sign', module: 'gunintalu', difficulty: 2, components: ['ః'] },

  // --- HACHCHULU (Consonant + Vowel Forms) ---
  { id: 'h1', glyph: 'కా', transliteration: 'kā', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ా'] },
  { id: 'h2', glyph: 'కి', transliteration: 'ki', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ి'] },
  { id: 'h3', glyph: 'కీ', transliteration: 'kī', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ీ'] },
  { id: 'h4', glyph: 'కు', transliteration: 'ku', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ు'] },
  { id: 'h5', glyph: 'కూ', transliteration: 'kū', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ూ'] },
  { id: 'h6', glyph: 'కృ', transliteration: 'kṛ', type: 'gunintam', module: 'hachchulu', difficulty: 2, components: ['క', 'ృ'] },
  { id: 'h7', glyph: 'కె', transliteration: 'ke', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ె'] },
  { id: 'h8', glyph: 'కే', transliteration: 'kē', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ే'] },
  { id: 'h9', glyph: 'కై', transliteration: 'kai', type: 'gunintam', module: 'hachchulu', difficulty: 2, components: ['క', 'ై'] },
  { id: 'h10', glyph: 'కొ', transliteration: 'ko', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ొ'] },
  { id: 'h11', glyph: 'కో', transliteration: 'kō', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ో'] },
  { id: 'h12', glyph: 'కౌ', transliteration: 'kau', type: 'gunintam', module: 'hachchulu', difficulty: 2, components: ['క', 'ౌ'] },
  { id: 'h13', glyph: 'కం', transliteration: 'kaṃ', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['క', 'ం'] },
  { id: 'h14', glyph: 'కః', transliteration: 'kaḥ', type: 'gunintam', module: 'hachchulu', difficulty: 2, components: ['క', 'ః'] },
  
  { id: 'h15', glyph: 'గా', transliteration: 'gā', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['గ', 'ా'] },
  { id: 'h16', glyph: 'గి', transliteration: 'gi', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['గ', 'ి'] },
  { id: 'h17', glyph: 'గీ', transliteration: 'gī', type: 'gunintam', module: 'hachchulu', difficulty: 1, components: ['గ', 'ీ'] },

  // --- VATTULU (Conjuncts) ---
  // Updated to reflect diacritics
  { id: 'vt1', glyph: 'క్క', transliteration: 'kka', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['క', '్', 'క'] },
  { id: 'vt2', glyph: 'గ్గ', transliteration: 'gga', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['గ', '్', 'గ'] },
  { id: 'vt3', glyph: 'చ్చ', transliteration: 'cca', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['చ', '్', 'చ'] },
  { id: 'vt4', glyph: 'జ్జ', transliteration: 'jja', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['జ', '్', 'జ'] },
  { id: 'vt5', glyph: 'ట్ట', transliteration: 'ṭṭa', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['ట', '్', 'ట'] },
  { id: 'vt6', glyph: 'డ్డ', transliteration: 'ḍḍa', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['డ', '్', 'డ'] },
  { id: 'vt7', glyph: 'త్త', transliteration: 'tta', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['త', '్', 'త'] },
  { id: 'vt8', glyph: 'ద్ద', transliteration: 'dda', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['ద', '్', 'ద'] },
  { id: 'vt9', glyph: 'న్న', transliteration: 'nna', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['న', '్', 'న'] },
  { id: 'vt10', glyph: 'ప్ప', transliteration: 'ppa', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['ప', '్', 'ప'] },
  { id: 'vt11', glyph: 'బ్బ', transliteration: 'bba', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['బ', '్', 'బ'] },
  { id: 'vt12', glyph: 'మ్మ', transliteration: 'mma', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['మ', '్', 'మ'] },
  { id: 'vt13', glyph: 'య్య', transliteration: 'yya', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['య', '్', 'య'] },
  { id: 'vt14', glyph: 'ర్ర', transliteration: 'rra', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['ర', '్', 'ర'] },
  { id: 'vt15', glyph: 'ల్ల', transliteration: 'lla', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['ల', '్', 'ల'] },
  { id: 'vt16', glyph: 'వ్వ', transliteration: 'vva', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['వ', '్', 'వ'] },
  { id: 'vt17', glyph: 'స్స', transliteration: 'ssa', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['స', '్', 'స'] },
  { id: 'vt18', glyph: 'ష్ష', transliteration: 'ṣṣa', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['ష', '్', 'ష'] },
  { id: 'vt19', glyph: 'శ్శ', transliteration: 'śśa', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['శ', '్', 'శ'] },
  { id: 'vt20', glyph: 'ళ్ళ', transliteration: 'ḷḷa', type: 'vattu', module: 'vattulu', difficulty: 2, components: ['ళ', '్', 'ళ'] },
  
  // Mixed conjuncts
  { id: 'vt21', glyph: 'క్త', transliteration: 'kta', type: 'vattu', module: 'vattulu', difficulty: 3, components: ['క', '్', 'త'] },
  { id: 'vt22', glyph: 'ర్ణ', transliteration: 'rṇa', type: 'vattu', module: 'vattulu', difficulty: 3, components: ['ర', '్', 'ణ'] },
  { id: 'vt23', glyph: 'న్య', transliteration: 'nya', type: 'vattu', module: 'vattulu', difficulty: 3, components: ['న', '్', 'య'] },
  { id: 'vt24', glyph: 'త్ర', transliteration: 'tra', type: 'vattu', module: 'vattulu', difficulty: 3, components: ['త', '్', 'ర'] },

  // --- WORDS - Module: words ---
  { id: 'w1', glyph: 'అమ్మ', transliteration: 'amma', type: 'word', module: 'words', difficulty: 1, components: ['అ', 'మ్మ'] },
  { id: 'w2', glyph: 'నాన్న', transliteration: 'nānna', type: 'word', module: 'words', difficulty: 1, components: ['నా', 'న్న'] },
  { id: 'w3', glyph: 'ఆవు', transliteration: 'āvu', type: 'word', module: 'words', difficulty: 1, components: ['ఆ', 'వు'] },
  { id: 'w4', glyph: 'ఇల్లు', transliteration: 'illu', type: 'word', module: 'words', difficulty: 1, components: ['ఇ', 'ల్లు'] },
  { id: 'w5', glyph: 'ఈగ', transliteration: 'īga', type: 'word', module: 'words', difficulty: 1, components: ['ఈ', 'గ'] },
  { id: 'w6', glyph: 'ఉడుత', transliteration: 'uḍuta', type: 'word', module: 'words', difficulty: 2, components: ['ఉ', 'డు', 'త'] },
  { id: 'w7', glyph: 'ఊయల', transliteration: 'ūyala', type: 'word', module: 'words', difficulty: 2, components: ['ఊ', 'య', 'ల'] },
  { id: 'w8', glyph: 'ఎలుక', transliteration: 'eluka', type: 'word', module: 'words', difficulty: 2, components: ['ఎ', 'లు', 'క'] },
  { id: 'w9', glyph: 'ఏనుగు', transliteration: 'ēnugu', type: 'word', module: 'words', difficulty: 2, components: ['ఏ', 'ను', 'గు'] },
  { id: 'w10', glyph: 'ఒంటె', transliteration: 'oṇṭe', type: 'word', module: 'words', difficulty: 2, components: ['ఒ', 'ంటె'] },
];