import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { login, clearError } from '@/features/auth/authSlice';
import {
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
} from '@/features/auth/authSelectors';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { Card } from '@/components/Card/Card';
import styles from './Login.module.scss';

export const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ email, password }));
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <Card variant="elevated" padding="large" className={styles.card}>
          <h1 className={styles.title}>Вход в FizTech Tutors</h1>
          <p className={styles.subtitle}>
            Войдите, чтобы продолжить работу с платформой
          </p>

          {error && <div className={styles.errorMessage}>⚠️ {error}</div>}

          <div className={styles.demoInfo}>
            <p className={styles.demoTitle}>🔐 Демо аккаунты:</p>
            <div className={styles.demoAccounts}>
              <div className={styles.demoAccount}>
                <strong>Ученик:</strong>
                <br />
                Email: student@test.com
                <br />
                Пароль: student123
              </div>
              <div className={styles.demoAccount}>
                <strong>Репетитор:</strong>
                <br />
                Email: tutor@test.com
                <br />
                Пароль: tutor123
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />

            <Input
              label="Пароль"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={status === 'loading'}
              className={styles.submitButton}
            >
              {status === 'loading' ? 'Вход...' : 'Войти'}
            </Button>
          </form>

          <div className={styles.footer}>
            <p>
              Нет аккаунта?{' '}
              <Link to="/register" className={styles.link}>
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

