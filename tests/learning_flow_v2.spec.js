import { test, expect } from '@playwright/test';

const MOCK_GRAPHEMES = [
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
    components: ['క', '్', 'ష'] // Complex grapheme
  }
];

test.describe('Learning Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((mockGraphemes) => {
      window.base44 = {
        auth: {
          me: async () => ({ email: 'test@example.com' })
        },
        entities: {
          TeluguGrapheme: {
            filter: async () => mockGraphemes,
            list: async () => mockGraphemes
          },
          GraphemeMastery: {
            filter: async () => [],
            create: async () => ({ id: 'mastery1' }),
            update: async () => ({ id: 'mastery1' })
          },
          PracticeSession: {
            create: async () => ({ id: 'session1' })
          }
        }
      };
    }, MOCK_GRAPHEMES);
  });

  test('GraphemeMatch: Shows Transliteration, Asks for Glyph', async ({ page }) => {
    // Force Math.random to return 0.1 to select GraphemeMatch
    await page.addInitScript(() => {
      Math.random = () => 0.1;
    });

    await page.goto('/learn?module=hallulu');
    
    // Verify Header
    await expect(page.getByText('Find the letter that sounds like:')).toBeVisible();
    
    // Verify Prompt is Transliteration (e.g. 'a')
    const prompt = page.locator('.text-6xl');
    await expect(prompt).toHaveText('a');
    
    // Verify Options are Glyphs (Telugu characters)
    // We expect to see 'అ' as one of the options
    const correctOption = page.getByRole('button', { name: 'అ' }).first();
    await expect(correctOption).toBeVisible();
  });

  test('TransliterationChallenge: Shows Glyph, Asks for Transliteration', async ({ page }) => {
    // Force Math.random to return 0.4 to select TransliterationChallenge
    await page.addInitScript(() => {
      Math.random = () => 0.4;
    });

    await page.goto('/learn?module=hallulu');
    
    // Verify Header
    await expect(page.getByText('What is the sound of this letter?')).toBeVisible();
    
    // Verify Prompt is Glyph (e.g. 'అ')
    const prompt = page.locator('.text-8xl');
    await expect(prompt).toHaveText('అ');
    
    // Verify Options are Transliterations (English text)
    const correctOption = page.getByRole('button', { name: 'a', exact: true });
    await expect(correctOption).toBeVisible();
  });

  test('DecomposeRebuild: Only appears for complex graphemes', async ({ page }) => {
    // Force Math.random to return 0.8 to select DecomposeRebuild
    // But it should only select it if the grapheme is complex.
    // Our mock data has 'g1' (simple) and 'g4' (complex).
    // The app sorts by difficulty. g1 is diff 1, g4 is diff 2.
    // So it starts with g1.
    
    await page.addInitScript(() => {
      Math.random = () => 0.8;
    });

    await page.goto('/learn?module=hallulu');
    
    // First grapheme is 'అ' (simple). Even with random=0.8, it should NOT show DecomposeRebuild
    // because availableTypes won't include it.
    // It should fall back to Transliteration or GraphemeMatch?
    // Wait, if availableTypes doesn't have it, the random logic might pick something else?
    // The logic was:
    // if (availableTypes.includes('decompose_rebuild') && rand > 0.6) ...
    
    // So for 'అ', it should NOT show DecomposeRebuild.
    await expect(page.getByText('Break down and rebuild')).not.toBeVisible();
  });

  test('DecomposeRebuild: Works for complex grapheme', async ({ page }) => {
    // Mock only complex grapheme
    const complexGrapheme = MOCK_GRAPHEMES.find(g => g.id === 'g4');
    await page.addInitScript((complexGrapheme) => {
       if (window.base44) {
         window.base44.entities.TeluguGrapheme.filter = async () => [complexGrapheme];
       }
    }, complexGrapheme);

    await page.addInitScript(() => {
      Math.random = () => 0.8;
    });

    await page.goto('/learn?module=hallulu');

    // Should show DecomposeRebuild
    await expect(page.getByText('Build the letter for the sound:')).toBeVisible();
    
    // Prompt should be Transliteration 'ksha'
    await expect(page.getByText('ksha')).toBeVisible();
    
    // Should have component tiles
    await expect(page.getByRole('button', { name: 'క' })).toBeVisible();
    await expect(page.getByRole('button', { name: '్' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'ష' })).toBeVisible();
  });
});
