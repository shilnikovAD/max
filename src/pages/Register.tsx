import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { register, clearError } from '@/features/auth/authSlice';
import {
  selectIsAuthenticated,
  selectAuthStatus,
  selectAuthError,
} from '@/features/auth/authSelectors';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { Card } from '@/components/Card/Card';
import styles from './Register.module.scss';

export const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT' as 'STUDENT' | 'TUTOR',
  });

  const [validationError, setValidationError] = useState('');

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
    setValidationError('');

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setValidationError('Пароль должен быть не менее 6 символов');
      return;
    }

    await dispatch(
      register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      })
    );
  };

  return (
    <div className={styles.registerPage}>
      <div className={styles.container}>
        <Card variant="elevated" padding="large" className={styles.card}>
          <h1 className={styles.title}>Регистрация</h1>
          <p className={styles.subtitle}>
            Создайте аккаунт для работы с платформой
          </p>

          {(error || validationError) && (
            <div className={styles.errorMessage}>
              ⚠️ {error || validationError}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Имя"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ваше имя"
              required
            />

            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="your@email.com"
              required
            />

            <Input
              label="Пароль"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Минимум 6 символов"
              required
            />

            <Input
              label="Подтвердите пароль"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              placeholder="Повторите пароль"
              required
            />

            <div className={styles.roleSelect}>
              <label className={styles.roleLabel}>Я хочу быть:</label>
              <div className={styles.roleOptions}>
                <label className={styles.roleOption}>
                  <input
                    type="radio"
                    name="role"
                    value="STUDENT"
                    checked={formData.role === 'STUDENT'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'STUDENT',
                      })
                    }
                  />
                  <div className={styles.roleCard}>
                    <span className={styles.roleIcon}>🎓</span>
                    <span className={styles.roleName}>Учеником</span>
                    <span className={styles.roleDescription}>
                      Искать репетиторов
                    </span>
                  </div>
                </label>

                <label className={styles.roleOption}>
                  <input
                    type="radio"
                    name="role"
                    value="TUTOR"
                    checked={formData.role === 'TUTOR'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as 'TUTOR',
                      })
                    }
                  />
                  <div className={styles.roleCard}>
                    <span className={styles.roleIcon}>👨‍🏫</span>
                    <span className={styles.roleName}>Репетитором</span>
                    <span className={styles.roleDescription}>
                      Давать уроки
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              disabled={status === 'loading'}
              className={styles.submitButton}
            >
              {status === 'loading' ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>

          <div className={styles.footer}>
            <p>
              Уже есть аккаунт?{' '}
              <Link to="/login" className={styles.link}>
                Войти
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

