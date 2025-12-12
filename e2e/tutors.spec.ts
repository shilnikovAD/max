import { test, expect } from '@playwright/test';

test.describe('Tutors Flow', () => {
  test('should display home page and tutor catalog', async ({ page }) => {
    await page.goto('/');

    // Check hero section
    await expect(
      page.getByRole('heading', {
        name: /Репетиторы МФТИ — быстро, честно, эффективно/i,
      })
    ).toBeVisible();

    // Wait for tutors to load
    await page.waitForTimeout(1000);

    // Check that tutor cards are displayed
    const tutorCards = page.locator('[class*="tutorCard"]');
    await expect(tutorCards.first()).toBeVisible();
  });

  test('should navigate to tutor detail page', async ({ page }) => {
    await page.goto('/');

    // Wait for tutors to load
    await page.waitForTimeout(1000);

    // Click on first tutor card
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    // Wait for navigation
    await page.waitForURL(/\/tutor\/\d+/);

    // Check that we're on the detail page
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.getByText(/О репетиторе/i)).toBeVisible();
  });

  test('should filter tutors by price', async ({ page }) => {
    await page.goto('/');

    // Wait for tutors to load
    await page.waitForTimeout(1000);

    // Enter price filter
    const priceInput = page.getByPlaceholder(/Макс. цена/i);
    await priceInput.fill('1800');

    // Click apply filters button
    await page.getByRole('button', { name: /Применить фильтры/i }).click();

    // Wait for filtered results
    await page.waitForTimeout(1000);

    // Verify that tutors are displayed (mock data will show filtered results)
    const tutorCards = page.locator('[class*="tutorCard"]');
    await expect(tutorCards.first()).toBeVisible();
  });

  test('should navigate to create tutor form', async ({ page }) => {
    await page.goto('/');

    // Click "Стать репетитором" button
    await page
      .getByRole('button', { name: /Стать репетитором/i })
      .click();

    // Wait for navigation
    await page.waitForURL(/\/tutor\/create/);

    // Check form is displayed
    await expect(
      page.getByRole('heading', {
        name: /Создать профиль репетитора/i,
      })
    ).toBeVisible();

    // Check that form inputs are visible
    await expect(page.getByPlaceholder(/Например: МФТИ, ФПМИ/i)).toBeVisible();
  });

  test('should fill and submit tutor form', async ({ page }) => {
    await page.goto('/tutor/create');

    // Fill form fields using placeholders
    await page.getByPlaceholder(/Например: МФТИ, ФПМИ/i).fill('МФТИ, ФПМИ, 2020');
    await page.getByPlaceholder(/ФПМИ, ФРКТ/i).fill('ФПМИ');
    await page.getByPlaceholder(/2024/i).fill('2020');
    await page.getByPlaceholder(/Расскажите о себе/i).fill('Опытный репетитор по математике');

    // Find and fill experience and price fields
    const inputs = await page.locator('input[type="number"]').all();
    if (inputs.length >= 3) {
      await inputs[1].fill('5'); // Experience years
      await inputs[2].fill('2000'); // Price per hour
    }

    // Submit form
    await page
      .getByRole('button', { name: /Создать профиль/i })
      .click();

    // Wait for redirect to home page
    await page.waitForURL('/');
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/about');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check about page content
    await expect(
      page.getByRole('heading', { name: /О проекте FizTech Tutors/i })
    ).toBeVisible();

    // Check for technical stack section
    await expect(
      page.getByRole('heading', { name: /Технический стек/i })
    ).toBeVisible();
  });

  test('should search tutors by name', async ({ page }) => {
    await page.goto('/');

    // Wait for tutors to load
    await page.waitForTimeout(1000);

    // Enter search term
    const searchInput = page.getByPlaceholder(
      /Поиск по имени или описанию/i
    );
    await searchInput.fill('Алексей');

    // Wait for results to filter
    await page.waitForTimeout(500);

    // Verify that results are shown (client-side filtering)
    const tutorCards = page.locator('[class*="tutorCard"]');
    await expect(tutorCards.first()).toBeVisible();
  });

  test('should add and remove tutor from favorites', async ({ page }) => {
    await page.goto('/');

    // Wait for first tutor card to be visible
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await expect(firstTutorCard).toBeVisible();

    // Click on first tutor card to go to detail page
    await firstTutorCard.click();

    // Wait for navigation to detail page
    await page.waitForURL(/\/tutor\/\d+/);

    // Find and click the favorites button (should show "Добавить в избранное" initially)
    const favButton = page.getByRole('button', {
      name: /добавить в избранное/i,
    });
    await expect(favButton).toBeVisible();
    await favButton.click();

    // After clicking, button text should change to "Убрать из избранного"
    await expect(
      page.getByRole('button', { name: /убрать из избранного/i })
    ).toBeVisible();

    // Navigate back to home and then back to detail page
    await page.goto('/');
    await expect(firstTutorCard).toBeVisible();
    await firstTutorCard.click();
    await page.waitForURL(/\/tutor\/\d+/);

    // Verify favorites state persisted (button should show "Убрать из избранного")
    await expect(
      page.getByRole('button', { name: /убрать из избранного/i })
    ).toBeVisible();

    // Click to remove from favorites
    const removeButton = page.getByRole('button', {
      name: /убрать из избранного/i,
    });
    await removeButton.click();

    // Button should change back to "Добавить в избранное"
    await expect(
      page.getByRole('button', { name: /добавить в избранное/i })
    ).toBeVisible();
  });

  test('should navigate to favorites page and display favorites', async ({ page }) => {
    // First, add a tutor to favorites
    await page.goto('/');

    // Wait for tutors to load
    await page.waitForTimeout(1000);

    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await expect(firstTutorCard).toBeVisible();
    await firstTutorCard.click();

    // Wait for navigation to detail page
    await page.waitForURL(/\/tutor\/\d+/);

    // Add to favorites
    const favButton = page.getByRole('button', {
      name: /добавить в избранное/i,
    });
    await favButton.click();

    // Go back to home
    await page.goto('/');

    // Click on Favorites button
    const favoritesButton = page.getByRole('button', { name: /⭐ Избранное/i });
    await expect(favoritesButton).toBeVisible();
    await favoritesButton.click();

    // Wait for navigation to favorites page
    await page.waitForURL('/favorites');

    // Check page heading
    await expect(
      page.getByRole('heading', { name: /Избранные репетиторы/i })
    ).toBeVisible();

    // Check that at least one tutor card is displayed
    const tutorCards = page.locator('[class*="tutorCard"]');
    await expect(tutorCards.first()).toBeVisible();
  });

  test('should show empty state on favorites page when no favorites', async ({ page }) => {
    // Clear localStorage to ensure no favorites
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());

    // Navigate to favorites page
    await page.goto('/favorites');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Check page heading is visible
    await expect(
      page.getByRole('heading', { name: /Избранные репетиторы/i })
    ).toBeVisible();

    // Check empty state message - using heading instead of generic text
    await expect(
      page.getByRole('heading', { name: /У вас пока нет избранных репетиторов/i })
    ).toBeVisible();

    // Check that "Перейти к каталогу" button is visible
    const catalogButton = page.getByRole('button', {
      name: /Перейти к каталогу/i,
    });
    await expect(catalogButton).toBeVisible();
  });
});
