import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  createTutor,
  updateTutor,
  fetchTutorById,
  clearCurrentTutor,
} from '@/features/tutors/tutorsSlice';
import {
  selectCurrentTutor,
  selectTutorsStatus,
} from '@/features/tutors/tutorsSelectors';
import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';
import { Card } from '@/components/Card/Card';
import type { CreateTutorDto } from '@/types/tutor';
import styles from './TutorForm.module.scss';

export const TutorForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentTutor = useAppSelector(selectCurrentTutor);
  const status = useAppSelector(selectTutorsStatus);

  const [formData, setFormData] = useState<CreateTutorDto>({
    bio: '',
    education: '',
    faculty: '',
    graduation_year: undefined,
    experience_years: 0,
    price_per_hour: 1000,
    format: 'BOTH',
    city: '',
    subject_ids: [1],
    level_codes: ['ege'],
  });

  const isEdit = !!id;

  useEffect(() => {
    if (isEdit && id) {
      dispatch(fetchTutorById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearCurrentTutor());
    };
  }, [id, isEdit, dispatch]);

  useEffect(() => {
    if (currentTutor && isEdit) {
      setFormData({
        bio: currentTutor.bio,
        education: currentTutor.education,
        faculty: currentTutor.faculty,
        graduation_year: currentTutor.graduation_year,
        experience_years: currentTutor.experience_years,
        price_per_hour: currentTutor.price_per_hour,
        format: currentTutor.format,
        city: currentTutor.city,
        subject_ids: currentTutor.subjects?.map((s) => s.subject_id) || [1],
        level_codes: currentTutor.levels?.map((l) => l.level_code) || ['ege'],
      });
    }
  }, [currentTutor, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit && id) {
        await dispatch(
          updateTutor({ id: parseInt(id, 10), data: formData })
        ).unwrap();
      } else {
        await dispatch(createTutor(formData)).unwrap();
      }
      navigate('/');
    } catch (error) {
      console.error('Failed to save tutor:', error);
    }
  };

  const handleChange = (field: keyof CreateTutorDto, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.tutorForm}>
      <div className={styles.container}>
        <Button
          variant="secondary"
          onClick={() => navigate('/')}
          className={styles.backButton}
        >
          ← Назад
        </Button>

        <Card variant="elevated" padding="large">
          <h1 className={styles.title}>
            {isEdit ? 'Редактировать профиль' : 'Создать профиль репетитора'}
          </h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <Input
              label="Образование"
              type="text"
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              placeholder="Например: МФТИ, ФПМИ, 2020"
              required
            />

            <Input
              label="Факультет"
              type="text"
              value={formData.faculty || ''}
              onChange={(e) => handleChange('faculty', e.target.value)}
              placeholder="ФПМИ, ФРКТ и т.д."
            />

            <Input
              label="Год окончания"
              type="number"
              value={formData.graduation_year || ''}
              onChange={(e) =>
                handleChange(
                  'graduation_year',
                  e.target.value ? parseInt(e.target.value, 10) : undefined
                )
              }
              placeholder="2024"
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>
                О себе <span className={styles.required}>*</span>
              </label>
              <textarea
                className={styles.textarea}
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Расскажите о себе, своем опыте преподавания..."
                required
                rows={6}
              />
            </div>

            <Input
              label="Опыт работы (лет)"
              type="number"
              value={formData.experience_years}
              onChange={(e) =>
                handleChange('experience_years', parseInt(e.target.value, 10))
              }
              required
            />

            <Input
              label="Стоимость (₽/час)"
              type="number"
              value={formData.price_per_hour}
              onChange={(e) =>
                handleChange('price_per_hour', parseInt(e.target.value, 10))
              }
              required
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Формат занятий <span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={formData.format}
                onChange={(e) =>
                  handleChange('format', e.target.value as any)
                }
                required
              >
                <option value="ONLINE">Онлайн</option>
                <option value="OFFLINE">Оффлайн</option>
                <option value="BOTH">Онлайн и Оффлайн</option>
              </select>
            </div>

            {(formData.format === 'OFFLINE' || formData.format === 'BOTH') && (
              <Input
                label="Город"
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Москва"
              />
            )}

            <div className={styles.actions}>
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? 'Сохранение...'
                  : isEdit
                  ? 'Сохранить изменения'
                  : 'Создать профиль'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="large"
                onClick={() => navigate('/')}
              >
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
