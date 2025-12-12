import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTutors } from '@/features/tutors/tutorsSlice';
import { selectTutors, selectTutorsStatus } from '@/features/tutors/tutorsSelectors';
import { selectFavorites } from '@/features/favorites/favoritesSelectors';
import { TutorCard } from '@/components/TutorCard/TutorCard';
import { Button } from '@/components/Button/Button';
import styles from './Favorites.module.scss';

export const Favorites: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tutors = useAppSelector(selectTutors);
  const favoriteIds = useAppSelector(selectFavorites);
  const status = useAppSelector(selectTutorsStatus);

  useEffect(() => {
    if (tutors.length === 0) {
      dispatch(fetchTutors());
    }
  }, [dispatch, tutors.length]);

  const favoriteTutors = tutors.filter((tutor) =>
    favoriteIds.includes(tutor.id)
  );

  const handleTutorClick = (tutorId: number) => {
    navigate(`/tutor/${tutorId}`);
  };

  const handleBackHome = () => {
    navigate('/');
  };

  return (
    <div className={styles.favorites}>
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <h1>FizTech Tutors</h1>
            <nav className={styles.nav}>
              <Button variant="secondary" onClick={handleBackHome}>
                Главная
              </Button>
              <Button variant="secondary" onClick={() => navigate('/about')}>
                О платформе
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.titleSection}>
          <h2 className={styles.title}>Избранные репетиторы</h2>
          <p className={styles.subtitle}>
            Здесь вы можете посмотреть всех репетиторов, которых добавили в избранное
          </p>
        </div>

        {status === 'loading' && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка...</p>
          </div>
        )}

        {status === 'succeeded' && favoriteTutors.length === 0 && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>⭐</div>
            <h3>У вас пока нет избранных репетиторов</h3>
            <p>
              Добавляйте понравившихся репетиторов в избранное, чтобы легко находить
              их позже
            </p>
            <Button variant="primary" size="large" onClick={handleBackHome}>
              Перейти к каталогу
            </Button>
          </div>
        )}

        {status === 'succeeded' && favoriteTutors.length > 0 && (
          <>
            <div className={styles.stats}>
              <p>
                Найдено репетиторов: <strong>{favoriteTutors.length}</strong>
              </p>
            </div>
            <div className={styles.tutorGrid}>
              {favoriteTutors.map((tutor) => (
                <TutorCard
                  key={tutor.id}
                  tutor={tutor}
                  onClick={() => handleTutorClick(tutor.id)}
                />
              ))}
            </div>
          </>
        )}

        {status === 'failed' && (
          <div className={styles.error}>
            <p>Ошибка загрузки избранных репетиторов</p>
            <Button onClick={() => dispatch(fetchTutors())}>
              Попробовать снова
            </Button>
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <p>&copy; 2024 FizTech Tutors. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

