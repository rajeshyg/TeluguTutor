const defaultBase44 = {
  auth: {
    me: async () => ({ email: 'test@example.com', name: 'Test User' })
  },
  entities: {
    TeluguGrapheme: {
      filter: async () => [
        {
          id: 'g1',
          glyph: 'అ',
          type: 'hallulu',
          transliteration: 'a',
          transliteration_simple: 'a',
          difficulty: 1,
          module: 'hallulu',
          components: ['అ']
        },
        {
          id: 'g2',
          glyph: 'ఆ',
          type: 'hallulu',
          transliteration: 'aa',
          transliteration_simple: 'aa',
          difficulty: 1,
          module: 'hallulu',
          components: ['ఆ']
        },
        {
          id: 'g3',
          glyph: 'ఇ',
          type: 'hallulu',
          transliteration: 'i',
          transliteration_simple: 'i',
          difficulty: 1,
          module: 'hallulu',
          components: ['ఇ']
        },
        {
          id: 'g4',
          glyph: 'క్ష',
          type: 'hallulu',
          transliteration: 'ksha',
          transliteration_simple: 'ksha',
          difficulty: 2,
          module: 'hallulu',
          components: ['క', '్', 'ష']
        }
      ],
      list: async () => []
    },
    GraphemeMastery: {
      filter: async () => [],
      create: async () => {},
      update: async () => {}
    },
    PracticeSession: {
      create: async () => {}
    }
  }
};

// Use a Proxy to allow dynamic switching of the implementation (e.g. for testing)
export const base44 = new Proxy({}, {
  get: (target, prop) => {
    const implementation = (typeof window !== 'undefined' && window.base44) ? window.base44 : defaultBase44;
    return implementation[prop];
  }
});

if (typeof window !== 'undefined' && !window.base44) {
  window.base44 = defaultBase44; // Initialize with default if not present
}
