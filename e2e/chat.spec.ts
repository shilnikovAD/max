import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Очищаем localStorage перед каждым тестом
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should show login prompt when trying to chat without authentication', async ({
    page,
  }) => {
    await page.goto('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    // Ждем загрузки страницы
    await page.waitForURL(/\/tutor\/\d+/);

    // Нажимаем "Написать сообщение"
    const chatButton = page.getByRole('button', {
      name: /Написать сообщение/i,
    });
    await chatButton.click();

    // Должен произойти редирект на /login
    await page.waitForURL(/\/login/);

    // Проверяем, что мы на странице входа
    await expect(
      page.getByRole('heading', { name: /Вход в FizTech Tutors/i })
    ).toBeVisible();
  });

  test('should open chat modal after authentication', async ({ page }) => {
    // Логинимся
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    // Ждем редиректа на главную
    await page.waitForURL('/');

    // Проверяем, что мы авторизованы
    await expect(page.getByText(/Иван Студентов/i)).toBeVisible();

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    // Ждем загрузки страницы
    await page.waitForURL(/\/tutor\/\d+/);

    // Нажимаем "Написать сообщение"
    const chatButton = page.getByRole('button', {
      name: /Написать сообщение/i,
    });
    await chatButton.click();

    // Проверяем, что модальное окно чата открылось (h2 в Modal title)
    await expect(page.locator('h2').filter({ hasText: /Чат с/i })).toBeVisible();

    // Проверяем наличие поля ввода
    await expect(
      page.getByPlaceholder(/Напишите сообщение/i)
    ).toBeVisible();

    // Проверяем наличие кнопки отправки (точное совпадение, не "Отправить заявку")
    await expect(
      page.getByRole('button', { name: 'Отправить', exact: true })
    ).toBeVisible();
  });

  test('should show empty state in chat', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Логинимся
    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    await page.waitForURL('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    await page.waitForURL(/\/tutor\/\d+/);

    // Открываем чат
    await page.getByRole('button', { name: /Написать сообщение/i }).click();

    // Проверяем пустое состояние
    await expect(page.getByText(/Пока нет сообщений/i)).toBeVisible();
    await expect(page.getByText(/Начните общение/i)).toBeVisible();

    // Проверяем иконку пустого состояния (в emptyIcon div, не в кнопке)
    const emptyIcon = page.locator('[class*="emptyIcon"]');
    await expect(emptyIcon).toBeVisible();
  });

  test('should send message in chat', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Логинимся
    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    await page.waitForURL('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    await page.waitForURL(/\/tutor\/\d+/);

    // Открываем чат
    await page.getByRole('button', { name: /Написать сообщение/i }).click();

    // Ждем появления чата
    await page.waitForLoadState('networkidle');

    // Вводим сообщение
    const messageInput = page.getByPlaceholder(/Напишите сообщение/i);
    const testMessage = 'Здравствуйте! Это тестовое сообщение.';
    await messageInput.fill(testMessage);

    // Отправляем сообщение (ищем именно кнопку в чате, не "Отправить заявку")
    const sendButton = page.getByRole('button', { name: 'Отправить', exact: true });
    await sendButton.click();

    // Ждем появления сообщения
    await expect(page.getByText(testMessage)).toBeVisible({ timeout: 5000 });

    // Проверяем, что поле ввода очистилось
    await expect(messageInput).toHaveValue('');

    // Проверяем, что больше нет пустого состояния
    await expect(page.getByText(/Пока нет сообщений/i)).not.toBeVisible();
  });

  test('should send multiple messages and display them correctly', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Логинимся
    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    await page.waitForURL('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    await page.waitForURL(/\/tutor\/\d+/);

    // Открываем чат
    await page.getByRole('button', { name: /Написать сообщение/i }).click();

    await page.waitForLoadState('networkidle');

    const messageInput = page.getByPlaceholder(/Напишите сообщение/i);
    const sendButton = page.getByRole('button', { name: 'Отправить', exact: true });

    // Отправляем первое сообщение
    const message1 = 'Первое сообщение';
    await messageInput.fill(message1);
    await sendButton.click();
    await expect(page.getByText(message1)).toBeVisible();

    // Отправляем второе сообщение
    const message2 = 'Второе сообщение';
    await messageInput.fill(message2);
    await sendButton.click();
    await expect(page.getByText(message2)).toBeVisible();

    // Отправляем третье сообщение
    const message3 = 'Третье сообщение';
    await messageInput.fill(message3);
    await sendButton.click();
    await expect(page.getByText(message3)).toBeVisible();

    // Проверяем, что все три сообщения видны (ищем только контейнеры сообщений)
    const messages = page.locator('[class*="messageOwn"], [class*="messageOther"]');
    await expect(messages).toHaveCount(3);

    // Проверяем порядок сообщений
    const messageTexts = await messages.allTextContents();
    expect(messageTexts.join(' ')).toContain(message1);
    expect(messageTexts.join(' ')).toContain(message2);
    expect(messageTexts.join(' ')).toContain(message3);
  });

  test('should disable send button when input is empty', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Логинимся
    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    await page.waitForURL('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    await page.waitForURL(/\/tutor\/\d+/);

    // Открываем чат
    await page.getByRole('button', { name: /Написать сообщение/i }).click();

    await page.waitForLoadState('networkidle');

    const sendButton = page.getByRole('button', { name: 'Отправить', exact: true });

    // Проверяем, что кнопка заблокирована при пустом поле
    await expect(sendButton).toBeDisabled();

    // Вводим текст
    const messageInput = page.getByPlaceholder(/Напишите сообщение/i);
    await messageInput.fill('Тест');

    // Проверяем, что кнопка стала активной
    await expect(sendButton).toBeEnabled();

    // Очищаем поле
    await messageInput.clear();

    // Проверяем, что кнопка снова заблокирована
    await expect(sendButton).toBeDisabled();
  });

  test('should close chat modal on X button click', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Логинимся
    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    await page.waitForURL('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    await page.waitForURL(/\/tutor\/\d+/);

    // Открываем чат
    await page.getByRole('button', { name: /Написать сообщение/i }).click();

    // Проверяем, что чат открылся
    await expect(page.locator('h2').filter({ hasText: /Чат с/i })).toBeVisible();

    // Закрываем чат
    const closeButton = page.locator('button[class*="closeButton"]');
    await closeButton.click();

    // Проверяем, что чат закрылся
    await expect(
      page.locator('h2').filter({ hasText: /Чат с/i })
    ).not.toBeVisible();
  });

  test('should display sender name and timestamp for messages', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Логинимся
    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    await page.waitForURL('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    await page.waitForURL(/\/tutor\/\d+/);

    // Открываем чат
    await page.getByRole('button', { name: /Написать сообщение/i }).click();

    await page.waitForLoadState('networkidle');

    // Отправляем сообщение
    const messageInput = page.getByPlaceholder(/Напишите сообщение/i);
    await messageInput.fill('Тестовое сообщение');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();

    // Ждем появления сообщения
    await page.waitForTimeout(500);

    // Проверяем, что отображается имя отправителя
    await expect(page.getByText(/Иван Студентов/i)).toBeVisible();

    // Проверяем, что есть временная метка (формат ЧЧ:ММ)
    const timeRegex = /\d{2}:\d{2}/;
    const messageTime = page.locator('[class*="messageTime"]').first();
    const timeText = await messageTime.textContent();
    expect(timeText).toMatch(timeRegex);
  });

  test('should show different visual styles for own and other messages', async ({
    page,
  }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');

    // Логинимся
    await page.getByLabel(/Email/i).fill('student@test.com');
    await page.getByLabel(/Пароль/i).fill('student123');
    await page.getByRole('button', { name: /Войти/i }).click();

    await page.waitForURL('/');

    // Открываем профиль репетитора
    const firstTutorCard = page.locator('[class*="tutorCard"]').first();
    await firstTutorCard.click();

    await page.waitForURL(/\/tutor\/\d+/);

    // Открываем чат
    await page.getByRole('button', { name: /Написать сообщение/i }).click();

    await page.waitForLoadState('networkidle');

    // Отправляем сообщение
    const messageInput = page.getByPlaceholder(/Напишите сообщение/i);
    await messageInput.fill('Моё сообщение');
    await page.getByRole('button', { name: 'Отправить', exact: true }).click();

    await page.waitForTimeout(500);

    // Проверяем, что сообщение имеет класс "messageOwn"
    const ownMessage = page.locator('[class*="messageOwn"]').first();
    await expect(ownMessage).toBeVisible();

    // Проверяем, что сообщение выровнено справа (flex-end)
    const styles = await ownMessage.evaluate((el) => {
      const computed = window.getComputedStyle(el);
      return {
        alignSelf: computed.alignSelf,
      };
    });

    expect(styles.alignSelf).toBe('flex-end');
  });
});

