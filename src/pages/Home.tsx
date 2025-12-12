import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchTutors, setFilters } from '@/features/tutors/tutorsSlice';
import {
  selectTutors,
  selectTutorsStatus,
  selectTutorsError,
} from '@/features/tutors/tutorsSelectors';
import { TutorCard } from '@/components/TutorCard/TutorCard';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import styles from './Home.module.scss';

export const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tutors = useAppSelector(selectTutors);
  const status = useAppSelector(selectTutorsStatus);
  const error = useAppSelector(selectTutorsError);

  const [priceMax, setPriceMax] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    dispatch(fetchTutors());
  }, [dispatch]);

  const handleFilterChange = () => {
    const filters: { price_max?: number } = {};
    if (priceMax) {
      filters.price_max = parseInt(priceMax, 10);
    }
    dispatch(setFilters(filters));
    dispatch(fetchTutors(filters));
  };

  const handleTutorClick = (tutorId: number) => {
    navigate(`/tutor/${tutorId}`);
  };

  const filteredTutors = tutors.filter((tutor) =>
    `${tutor.first_name} ${tutor.last_name} ${tutor.bio}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>
            Репетиторы МФТИ — быстро, честно, эффективно
          </h1>
          <p className={styles.subtitle}>
            Найдите идеального репетитора среди студентов и выпускников
            Физтеха. Безопасно, только реальные отзывы, проверенные
            преподаватели.
          </p>
          <div className={styles.heroButtons}>
            <Button variant="primary" size="large" onClick={() => {}}>
              Найти репетитора
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => navigate('/tutor/create')}
            >
              Стать репетитором
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.filters}>
          <Input
            type="text"
            placeholder="Поиск по имени или описанию..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <Input
            type="number"
            placeholder="Макс. цена"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
          />
          <Button onClick={handleFilterChange}>Применить фильтры</Button>
        </div>

        {status === 'loading' && (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Загрузка репетиторов...</p>
          </div>
        )}

        {status === 'failed' && (
          <div className={styles.error}>
            <p>Ошибка загрузки: {error}</p>
            <p className={styles.errorHint}>
              Показаны тестовые данные для демонстрации
            </p>
          </div>
        )}

        {status === 'succeeded' && filteredTutors.length === 0 && (
          <div className={styles.empty}>
            <p>Репетиторы не найдены. Попробуйте изменить фильтры.</p>
          </div>
        )}

        <div className={styles.tutorsGrid}>
          {filteredTutors.map((tutor) => (
            <TutorCard
              key={tutor.id}
              tutor={tutor}
              onClick={() => handleTutorClick(tutor.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
