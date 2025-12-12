import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTutorById, clearCurrentTutor } from '@/features/tutors/tutorsSlice';
import {
  selectCurrentTutor,
  selectTutorsStatus,
  selectTutorsError,
} from '@/features/tutors/tutorsSelectors';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import styles from './TutorDetail.module.scss';

export const TutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tutor = useAppSelector(selectCurrentTutor);
  const status = useAppSelector(selectTutorsStatus);
  const error = useAppSelector(selectTutorsError);

  useEffect(() => {
    if (id) {
      dispatch(fetchTutorById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearCurrentTutor());
    };
  }, [id, dispatch]);

  if (status === 'loading') {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Загрузка информации о репетиторе...</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className={styles.error}>
        <p>Ошибка загрузки: {error}</p>
        <Button onClick={() => navigate('/')}>Назад к списку</Button>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className={styles.error}>
        <p>Репетитор не найден</p>
        <Button onClick={() => navigate('/')}>Назад к списку</Button>
      </div>
    );
  }

  return (
    <div className={styles.tutorDetail}>
      <div className={styles.container}>
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          ← Назад к списку
        </Button>

        <Card variant="elevated" padding="large">
          <div className={styles.header}>
            {tutor.photo_url ? (
              <img
                src={tutor.photo_url}
                alt={`${tutor.first_name} ${tutor.last_name}`}
                className={styles.photo}
              />
            ) : (
              <div className={styles.photoPlaceholder}>
                {tutor.first_name[0]}
                {tutor.last_name[0]}
              </div>
            )}
            <div className={styles.headerInfo}>
              <h1 className={styles.name}>
                {tutor.first_name} {tutor.last_name}
              </h1>
              {tutor.faculty && (
                <p className={styles.faculty}>{tutor.faculty}</p>
              )}
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>⭐</span>
                  <span className={styles.statValue}>
                    {tutor.avg_rating.toFixed(1)}
                  </span>
                  <span className={styles.statLabel}>
                    ({tutor.reviews_count} отзывов)
                  </span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>💼</span>
                  <span className={styles.statValue}>
                    {tutor.experience_years}
                  </span>
                  <span className={styles.statLabel}>лет опыта</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statIcon}>💰</span>
                  <span className={styles.statValue}>
                    {tutor.price_per_hour} ₽
                  </span>
                  <span className={styles.statLabel}>/час</span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>О репетиторе</h2>
            <p className={styles.bio}>{tutor.bio}</p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Образование</h2>
            <p className={styles.education}>{tutor.education}</p>
          </div>

          {tutor.subjects && tutor.subjects.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Предметы</h2>
              <div className={styles.tags}>
                {tutor.subjects.map((subject) => (
                  <span key={subject.subject_id} className={styles.tag}>
                    {subject.subject_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {tutor.levels && tutor.levels.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Уровни подготовки</h2>
              <div className={styles.tags}>
                {tutor.levels.map((level) => (
                  <span key={level.level_code} className={styles.tag}>
                    {level.level_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Формат занятий</h2>
            <p className={styles.format}>
              {tutor.format === 'ONLINE' && '💻 Онлайн'}
              {tutor.format === 'OFFLINE' && '🏫 Оффлайн'}
              {tutor.format === 'BOTH' && '💻 Онлайн / 🏫 Оффлайн'}
              {tutor.city && ` (${tutor.city})`}
            </p>
          </div>

          <div className={styles.actions}>
            <Button variant="primary" size="large">
              Отправить заявку
            </Button>
            <Button variant="secondary" size="large">
              Добавить в избранное
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
