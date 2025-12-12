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
    await expect(page.getByLabel(/Образование/i)).toBeVisible();
  });

  test('should fill and submit tutor form', async ({ page }) => {
    await page.goto('/tutor/create');

    // Fill form fields
    await page.getByLabel(/Образование/i).fill('МФТИ, ФПМИ, 2020');
    await page.getByLabel(/Факультет/i).fill('ФПМИ');
    await page.getByLabel(/Год окончания/i).fill('2020');
    await page.getByLabel(/О себе/i).fill('Опытный репетитор по математике');
    await page.getByLabel(/Опыт работы/i).fill('5');
    await page.getByLabel(/Стоимость/i).fill('2000');

    // Submit form
    await page
      .getByRole('button', { name: /Создать профиль/i })
      .click();

    // Wait for redirect to home page
    await page.waitForURL('/');
  });

  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');

    // Navigate to about page by changing URL (since there's no nav menu)
    await page.goto('/about');

    // Check about page content
    await expect(
      page.getByRole('heading', { name: /О проекте FizTech Tutors/i })
    ).toBeVisible();
    await expect(page.getByText(/Технический стек/i)).toBeVisible();
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
});
