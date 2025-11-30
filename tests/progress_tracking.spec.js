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
    glyph: 'ఈ',
    type: 'hallulu',
    transliteration: 'ii',
    transliteration_simple: 'ee',
    difficulty: 1,
    module: 'hallulu',
    components: ['ఈ']
  }
];

test.describe('Progress Tracking', () => {
  let masteryRecords = [];
  let sessionRecords = [];

  test.beforeEach(async ({ page }) => {
    masteryRecords = [];
    sessionRecords = [];

    // Inject mock base44 before page loads
    await page.addInitScript((mockGraphemes) => {
      window.base44 = {
        auth: {
          me: async () => ({ id: 'user1', username: 'testuser', name: 'Test User' })
        },
        entities: {
          TeluguGrapheme: {
            filter: async () => mockGraphemes,
            list: async () => mockGraphemes
          },
          UserProfile: {
            filter: async () => [{
              user_id: 'user1',
              display_name: 'Test User',
              total_stars: 0,
              total_practice_time: 0
            }],
            update: async (id, updates) => ({ user_id: id, ...updates })
          },
          GraphemeMastery: {
            _records: [],
            filter: async () => window.base44.entities.GraphemeMastery._records,
            create: async (data) => {
              const newRecord = { id: `mastery_${Date.now()}`, ...data };
              window.base44.entities.GraphemeMastery._records.push(newRecord);
              window.masteryCreated = (window.masteryCreated || 0) + 1;
              console.log('[Mock] Created mastery:', newRecord);
              return newRecord;
            },
            update: async (id, updates) => {
              const records = window.base44.entities.GraphemeMastery._records;
              const idx = records.findIndex(r => r.id === id);
              if (idx !== -1) {
                records[idx] = { ...records[idx], ...updates };
                window.masteryUpdated = (window.masteryUpdated || 0) + 1;
                console.log('[Mock] Updated mastery:', records[idx]);
                return records[idx];
              }
              return null;
            }
          },
          PracticeSession: {
            create: async (data) => {
              window.sessionCreated = (window.sessionCreated || 0) + 1;
              console.log('[Mock] Created session:', data);
              return { id: `session_${Date.now()}`, ...data };
            }
          }
        }
      };
    }, MOCK_GRAPHEMES);
  });

  test('Progress counter increments correctly without skipping', async ({ page }) => {
    // Force grapheme_match puzzle type for predictable testing
    await page.addInitScript(() => {
      Math.random = () => 0.1; // Always select grapheme_match (rand < 0.3)
    });

    await page.goto('/learn?module=hallulu');

    // Wait for loader to disappear
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });

    // Initial progress should be 1/4
    await expect(page.getByText('1 / 4')).toBeVisible();

    // Find and click the correct answer (the transliteration shown matches one glyph option)
    const prompt = await page.locator('.bg-secondary .text-6xl').innerText();
    console.log('Looking for glyph with transliteration:', prompt);

    // Find the grapheme with this transliteration
    const targetGrapheme = MOCK_GRAPHEMES.find(g => g.transliteration === prompt);
    if (targetGrapheme) {
      // Click the correct option
      await page.getByRole('button', { name: targetGrapheme.glyph }).first().click();
    }

    // Wait for result and transition
    await page.waitForTimeout(2000);

    // Progress should now be 2/4
    await expect(page.getByText('2 / 4')).toBeVisible();
  });

  test('Session data is recorded on answer', async ({ page }) => {
    await page.addInitScript(() => {
      Math.random = () => 0.1;
    });

    await page.goto('/learn?module=hallulu');
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });

    // Click any option to answer
    const options = page.locator('button').filter({ has: page.locator('.text-7xl') });
    await options.first().click();

    // Wait for mutation to complete
    await page.waitForTimeout(2500);

    // Check that session was created
    const sessionCount = await page.evaluate(() => window.sessionCreated || 0);
    expect(sessionCount).toBeGreaterThanOrEqual(1);
  });

  test('Mastery data is created for new graphemes', async ({ page }) => {
    await page.addInitScript(() => {
      Math.random = () => 0.1;
    });

    await page.goto('/learn?module=hallulu');
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });

    // Answer first question
    const options = page.locator('button').filter({ has: page.locator('.text-7xl') });
    await options.first().click();

    // Wait for mutation
    await page.waitForTimeout(2500);

    // Check mastery was created
    const masteryCount = await page.evaluate(() => window.masteryCreated || 0);
    expect(masteryCount).toBeGreaterThanOrEqual(1);
  });

  test('Progress does not reset after answering', async ({ page }) => {
    await page.addInitScript(() => {
      Math.random = () => 0.1;
    });

    await page.goto('/learn?module=hallulu');
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });

    // Verify initial state
    await expect(page.getByText('1 / 4')).toBeVisible();

    // Answer 3 questions
    for (let i = 0; i < 3; i++) {
      const options = page.locator('button').filter({ has: page.locator('.text-7xl, .text-3xl') });
      const count = await options.count();
      if (count > 0) {
        await options.first().click();
        await page.waitForTimeout(2000);
      }
    }

    // Progress should not have reset - should be at 4/4 or show completion
    const progressText = await page.locator('text=/\\d+ \\/ 4/').first().innerText().catch(() => 'Module Complete');
    console.log('Final progress:', progressText);
    
    // Should NOT be back at 1/4 unless module completed and restarted
    const progressMatch = progressText.match(/(\d+) \/ 4/);
    if (progressMatch) {
      const current = parseInt(progressMatch[1]);
      expect(current).toBeGreaterThan(1);
    }
  });

  test('Random question ordering works', async ({ page }) => {
    // Use actual Math.random for this test
    await page.goto('/learn?module=hallulu');
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });

    // Get the first question's transliteration
    const firstPrompt = await page.locator('.bg-secondary .text-6xl, .bg-secondary .text-8xl').first().innerText();

    // Reload the page to get new random order
    await page.reload();
    await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 10000 });

    // Get the prompt again - it might be different due to shuffling
    const secondPrompt = await page.locator('.bg-secondary .text-6xl, .bg-secondary .text-8xl').first().innerText();

    // Both should be valid transliterations
    const validTransliterations = MOCK_GRAPHEMES.map(g => g.transliteration);
    expect(validTransliterations).toContain(firstPrompt);
    expect(validTransliterations).toContain(secondPrompt);

    // Note: Due to random shuffling, they might be the same or different
    // This test mainly ensures no errors occur
  });
});
