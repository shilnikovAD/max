import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  fetchTutorById,
  clearCurrentTutor,
} from '@/features/tutors/tutorsSlice';
import {
  selectCurrentTutor,
  selectTutorsStatus,
  selectTutorsError,
} from '@/features/tutors/tutorsSelectors';
import { toggleFavorite } from '@/features/favorites/favoritesSlice';
import { selectIsFavorite } from '@/features/favorites/favoritesSelectors';
import { selectIsAuthenticated, selectUser } from '@/features/auth/authSelectors';
import { createConversation } from '@/features/chat/chatSlice';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Modal } from '@/components/Modal/Modal';
import { Input } from '@/components/Input/Input';
import { Chat } from '@/components/Chat/Chat';
import styles from './TutorDetail.module.scss';

export const TutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const tutor = useAppSelector(selectCurrentTutor);
  const status = useAppSelector(selectTutorsStatus);
  const error = useAppSelector(selectTutorsError);
  const isFavorite = useAppSelector(selectIsFavorite(tutor?.id ?? -1));

  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [chatConversationId, setChatConversationId] = useState<number | null>(null);
  const [requestForm, setRequestForm] = useState({
    name: '',
    goal: '',
    level: '',
    experience: '',
    message: '',
  });
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchTutorById(parseInt(id, 10)));
    }
    return () => {
      dispatch(clearCurrentTutor());
    };
  }, [id, dispatch]);

  const handleOpenRequestModal = () => {
    setIsRequestModalOpen(true);
    setRequestSubmitted(false);
  };

  const handleCloseRequestModal = () => {
    setIsRequestModalOpen(false);
    setRequestForm({
      name: '',
      goal: '',
      level: '',
      experience: '',
      message: '',
    });
  };

  const handleOpenChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user || !tutor) return;

    // Создаем новую беседу
    const result = await dispatch(
      createConversation({
        tutorId: tutor.id,
        studentId: user.id,
        tutorName: `${tutor.first_name} ${tutor.last_name}`,
        studentName: user.name,
      })
    );

    if (createConversation.fulfilled.match(result)) {
      setChatConversationId(result.payload.id);
      setIsChatModalOpen(true);
    }
  };

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Симуляция отправки запроса
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setRequestSubmitted(true);

    // Закрываем модальное окно через 3 секунды
    setTimeout(() => {
      handleCloseRequestModal();
    }, 3000);
  };

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
            <Button
              variant="primary"
              size="large"
              onClick={handleOpenRequestModal}
            >
              📨 Отправить заявку
            </Button>
            <Button
              variant="primary"
              size="large"
              onClick={handleOpenChat}
            >
              💬 Написать сообщение
            </Button>
            <Button
              variant="secondary"
              size="large"
              onClick={() => tutor && dispatch(toggleFavorite(tutor.id))}
            >
              {isFavorite ? '❤️ Убрать из избранного' : '🤍 Добавить в избранное'}
            </Button>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={isRequestModalOpen}
        onClose={handleCloseRequestModal}
        title={`Заявка к репетитору ${tutor.first_name} ${tutor.last_name}`}
        footer={
          !requestSubmitted && (
            <>
              <Button variant="secondary" onClick={handleCloseRequestModal}>
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={(e) => handleSubmitRequest(e as any)}
                disabled={
                  isSubmitting ||
                  !requestForm.name ||
                  !requestForm.goal ||
                  !requestForm.level
                }
              >
                {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
              </Button>
            </>
          )
        }
      >
        {!requestSubmitted ? (
          <form onSubmit={handleSubmitRequest} className={styles.requestForm}>
            <div className={styles.formInfo}>
              <p className={styles.formDescription}>
                Расскажите о себе и ваших целях обучения. Репетитор получит вашу
                заявку и сможет связаться с вами.
              </p>
            </div>

            <Input
              label="Ваше имя"
              type="text"
              value={requestForm.name}
              onChange={(e) =>
                setRequestForm({ ...requestForm, name: e.target.value })
              }
              placeholder="Например: Иван"
              required
            />

            <Input
              label="Цель обучения"
              type="text"
              value={requestForm.goal}
              onChange={(e) =>
                setRequestForm({ ...requestForm, goal: e.target.value })
              }
              placeholder="Например: Подготовка к ЕГЭ по математике"
              required
            />

            <Input
              label="Ваш уровень"
              type="text"
              value={requestForm.level}
              onChange={(e) =>
                setRequestForm({ ...requestForm, level: e.target.value })
              }
              placeholder="Например: 11 класс, решаю базовые задачи"
              required
            />

            <Input
              label="Опыт занятий с репетиторами"
              type="text"
              value={requestForm.experience}
              onChange={(e) =>
                setRequestForm({ ...requestForm, experience: e.target.value })
              }
              placeholder="Например: Занимался 6 месяцев"
            />

            <div className={styles.formGroup}>
              <label className={styles.label}>Дополнительная информация</label>
              <textarea
                className={styles.textarea}
                value={requestForm.message}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, message: e.target.value })
                }
                placeholder="Расскажите о ваших навыках, предпочтениях по времени занятий, особых пожеланиях..."
                rows={4}
              />
            </div>
          </form>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✅</div>
            <h3 className={styles.successTitle}>Заявка успешно отправлена!</h3>
            <p className={styles.successText}>
              Репетитор получил вашу заявку и скоро свяжется с вами. Ожидайте
              уведомления о принятии заявки на вашу почту или в личном кабинете.
            </p>
            <div className={styles.successDetails}>
              <p>
                <strong>Репетитор:</strong> {tutor.first_name}{' '}
                {tutor.last_name}
              </p>
              <p>
                <strong>Ваше имя:</strong> {requestForm.name}
              </p>
              <p>
                <strong>Цель:</strong> {requestForm.goal}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        title={`Чат с ${tutor.first_name} ${tutor.last_name}`}
      >
        {chatConversationId && (
          <Chat
            conversationId={chatConversationId}
            recipientName={`${tutor.first_name} ${tutor.last_name}`}
          />
        )}
      </Modal>
    </div>
  );
};
