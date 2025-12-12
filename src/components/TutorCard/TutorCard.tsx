import React from 'react';
import { Card } from '../Card/Card';
import type { Tutor } from '@/types/tutor';
import styles from './TutorCard.module.scss';

interface TutorCardProps {
  tutor: Tutor;
  onClick?: () => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, onClick }) => {
  return (
    <Card variant="elevated" onClick={onClick} className={styles.tutorCard}>
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
        <div className={styles.info}>
          <h3 className={styles.name}>
            {tutor.first_name} {tutor.last_name}
          </h3>
          {tutor.faculty && <p className={styles.faculty}>{tutor.faculty}</p>}
        </div>
      </div>

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
          <span className={styles.statValue}>{tutor.experience_years}</span>
          <span className={styles.statLabel}>лет опыта</span>
        </div>
      </div>

      <p className={styles.bio}>{tutor.bio}</p>

      <div className={styles.footer}>
        <div className={styles.price}>
          <span className={styles.priceValue}>{tutor.price_per_hour} ₽</span>
          <span className={styles.priceLabel}>/час</span>
        </div>
        <div className={styles.format}>
          {tutor.format === 'ONLINE' && '💻 Онлайн'}
          {tutor.format === 'OFFLINE' && '🏫 Оффлайн'}
          {tutor.format === 'BOTH' && '💻 Онлайн / 🏫 Оффлайн'}
        </div>
      </div>
    </Card>
  );
};
