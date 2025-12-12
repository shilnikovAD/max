import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import styles from './About.module.scss';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.about}>
      <div className={styles.container}>
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          ← Назад на главную
        </Button>

        <Card variant="elevated" padding="large">
          <h1 className={styles.title}>О проекте FizTech Tutors</h1>

          <div className={styles.content}>
            <section className={styles.section}>
              <h2>Что это такое?</h2>
              <p>
                FizTech Tutors — это платформа, которая связывает студентов и
                родителей с репетиторами из МФТИ (Московский Физико-Технический
                Институт). Мы создали простой способ найти качественное
                образование по физике, математике, информатике и другим
                предметам.
              </p>
            </section>

            <section className={styles.section}>
              <h2>Наши преимущества</h2>
              <div className={styles.features}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✅</span>
                  <div>
                    <h3>Безопасность и честность</h3>
                    <p>
                      Только проверенные студенты и выпускники МФТИ с реальными
                      отзывами
                    </p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>⭐</span>
                  <div>
                    <h3>Реальные отзывы</h3>
                    <p>
                      Только аутентифицированные отзывы от реальных учеников
                    </p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>💬</span>
                  <div>
                    <h3>Встроенный чат</h3>
                    <p>Прямое общение с репетиторами внутри платформы</p>
                  </div>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>🎯</span>
                  <div>
                    <h3>Умный подбор</h3>
                    <p>
                      Рекомендации репетиторов на основе анкеты и требований
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h2>Технический стек</h2>
              <p>
                Этот проект реализован с использованием современных технологий:
              </p>
              <ul className={styles.techList}>
                <li>
                  <strong>TypeScript</strong> — строгая типизация для надежного
                  кода
                </li>
                <li>
                  <strong>React</strong> — современная библиотека для создания
                  пользовательских интерфейсов
                </li>
                <li>
                  <strong>Redux Toolkit</strong> — эффективное управление
                  состоянием приложения
                </li>
                <li>
                  <strong>React Router</strong> — клиентская маршрутизация
                </li>
                <li>
                  <strong>Vite</strong> — быстрая сборка и разработка
                </li>
                <li>
                  <strong>SCSS Modules</strong> — модульные стили
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Тестирование</h2>
              <p>Проект включает полное покрытие тестами:</p>
              <ul>
                <li>
                  <strong>Unit-тесты</strong> — Jest + React Testing Library
                </li>
                <li>
                  <strong>Компонентные тесты</strong> — Storybook + скриншот
                  тестирование
                </li>
                <li>
                  <strong>E2E-тесты</strong> — Playwright для тестирования
                  пользовательских сценариев
                </li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2>Контакты</h2>
              <p>
                <strong>Email:</strong> support@fiztechtutors.ru
                <br />
                <strong>Telegram:</strong> @fiztech_support
              </p>
            </section>
          </div>

          <div className={styles.actions}>
            <Button
              variant="primary"
              size="large"
              onClick={() => navigate('/')}
            >
              Найти репетитора
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
