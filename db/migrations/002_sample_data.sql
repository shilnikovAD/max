-- FizTech Tutors Sample Data
-- Migration: 002_sample_data
-- Description: Sample/test data for development and testing

-- ============================================================================
-- SAMPLE USERS
-- ============================================================================

-- Admin user (password: admin123)
INSERT INTO users (email, password, role, name) VALUES
    ('admin@fiztechtutors.ru', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'ADMIN', 'Администратор');

-- Sample students (password: student123)
INSERT INTO users (email, password, role, name) VALUES
    ('student1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'STUDENT', 'Мария Сидорова'),
    ('student2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'STUDENT', 'Алексей Козлов'),
    ('student3@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'STUDENT', 'Елена Новикова');

-- Sample tutors (password: tutor123)
INSERT INTO users (email, password, role, name) VALUES
    ('tutor1@phystech.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'TUTOR', 'Иван Петров'),
    ('tutor2@phystech.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'TUTOR', 'Анна Смирнова'),
    ('tutor3@phystech.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'TUTOR', 'Дмитрий Волков'),
    ('tutor4@phystech.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'TUTOR', 'Ольга Федорова'),
    ('tutor5@phystech.edu', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/X4.Ej8cQF8GK8QXPi', 'TUTOR', 'Сергей Николаев');

-- ============================================================================
-- SAMPLE STUDENT PROFILES
-- ============================================================================

INSERT INTO students (user_id, grade, city, telegram) VALUES
    (2, '11 класс', 'Москва', '@maria_student'),
    (3, '10 класс', 'Санкт-Петербург', '@alex_kozlov'),
    (4, '2 курс', 'Долгопрудный', '@elena_nov');

-- ============================================================================
-- SAMPLE TUTOR PROFILES
-- ============================================================================

INSERT INTO tutors (user_id, faculty, study_year, about, price_per_hour, format, city, status, avg_rating, reviews_count) VALUES
    (5, 'ФРКТ', '4 курс', 
     'Студент 4 курса ФРКТ МФТИ. Специализируюсь на подготовке к ЕГЭ по физике и математике. Мои ученики в среднем повышают баллы на 25-30. Использую авторские методики и современные подходы к обучению. Готовлю к олимпиадам различного уровня.', 
     1500, 'BOTH', 'Москва', 'APPROVED', 4.90, 15),
     
    (6, 'ФПМИ', '3 курс', 
     'Студентка ФПМИ, призёр олимпиад по информатике. Готовлю к ЕГЭ и олимпиадам по информатике и программированию. Обучаю Python, C++, алгоритмам и структурам данных. Помогу с подготовкой к вступительным МФТИ.', 
     1800, 'ONLINE', NULL, 'APPROVED', 4.85, 12),
     
    (7, 'ФОПФ', 'выпускник 2022', 
     'Выпускник ФОПФ МФТИ, работаю в научной сфере. Более 5 лет опыта репетиторства. Готовлю к ЕГЭ/ОГЭ по физике, математике. Особенно силён в механике, электродинамике и термодинамике. Провожу занятия в формате разбора задач и системного изучения теории.', 
     2500, 'BOTH', 'Москва', 'APPROVED', 4.95, 28),
     
    (8, 'ФБМФ', '2 курс', 
     'Студентка 2 курса ФБМФ. Помогаю школьникам с химией и биологией. Готовлю к ЕГЭ, ОГЭ, помогаю с школьной программой. Стараюсь объяснять сложные темы простым языком и использую много визуальных материалов.', 
     1200, 'ONLINE', NULL, 'APPROVED', 4.70, 8),
     
    (9, 'ФРКТ', '5 курс', 
     'Магистрант ФРКТ. Специализируюсь на подготовке к олимпиадам по физике и математике высокого уровня (Всерос, Физтех и др.). Сам являюсь призёром Всероса по физике. Работаю только с мотивированными учениками.', 
     3000, 'BOTH', 'Долгопрудный', 'APPROVED', 4.92, 18);

-- ============================================================================
-- TUTOR SUBJECTS
-- ============================================================================

-- Tutor 1: Физика, Математика
INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (1, 1), (1, 2);

-- Tutor 2: Информатика, Программирование
INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (2, 3), (2, 8);

-- Tutor 3: Физика, Математика, Механика
INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (3, 1), (3, 2), (3, 9);

-- Tutor 4: Химия, Биология
INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (4, 4), (4, 5);

-- Tutor 5: Физика, Математика
INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (5, 1), (5, 2);

-- ============================================================================
-- TUTOR LEVELS
-- ============================================================================

-- Tutor 1: ЕГЭ, ОГЭ, Олимпиады
INSERT INTO tutor_levels (tutor_id, level_id) VALUES (1, 1), (1, 2), (1, 4);

-- Tutor 2: ЕГЭ, Олимпиады, МФТИ-вступительные
INSERT INTO tutor_levels (tutor_id, level_id) VALUES (2, 1), (2, 4), (2, 5);

-- Tutor 3: ЕГЭ, ОГЭ, Олимпиады, Вуз
INSERT INTO tutor_levels (tutor_id, level_id) VALUES (3, 1), (3, 2), (3, 4), (3, 6);

-- Tutor 4: ЕГЭ, ОГЭ, Школьная программа
INSERT INTO tutor_levels (tutor_id, level_id) VALUES (4, 1), (4, 2), (4, 3);

-- Tutor 5: Олимпиады, МФТИ-вступительные
INSERT INTO tutor_levels (tutor_id, level_id) VALUES (5, 4), (5, 5);

-- ============================================================================
-- SAMPLE LESSON REQUESTS
-- ============================================================================

INSERT INTO lesson_requests (student_id, tutor_id, subject_id, level_id, goal, preferred_time, comment, status) VALUES
    (1, 1, 1, 1, 'Подготовка к ЕГЭ по физике с 70 до 90+ баллов', 'вечер будних, кроме четверга', '11 класс, уже решаю 18-19 задачи', 'IN_PROGRESS'),
    (1, 3, 2, 1, 'Подготовка к ЕГЭ по математике профиль', 'выходные, утро', 'Хочу 90+ баллов, сейчас ~75', 'COMPLETED'),
    (2, 2, 3, 4, 'Подготовка к олимпиаде по информатике', 'любое удобное время', '10 класс, хочу попасть на Всерос', 'NEW'),
    (3, 4, 4, 1, 'Повторение и подготовка к ЕГЭ по химии', 'будни вечер после 18:00', '2 курс, нужно сдать ЕГЭ для поступления в магистратуру', 'IN_PROGRESS');

-- ============================================================================
-- SAMPLE REVIEWS
-- ============================================================================

INSERT INTO reviews (tutor_id, student_id, lesson_request_id, rating, text, status) VALUES
    (3, 1, 2, 5, 'Отличный преподаватель! Дмитрий помог мне подготовиться к ЕГЭ по математике. Очень понятно объясняет, даёт много полезных материалов. Рекомендую!', 'VISIBLE');

-- ============================================================================
-- SAMPLE FAVORITES
-- ============================================================================

INSERT INTO favorites (student_id, tutor_id) VALUES
    (1, 1),
    (1, 3),
    (2, 2),
    (3, 4);

-- ============================================================================
-- SAMPLE MESSAGES
-- ============================================================================

INSERT INTO messages (lesson_request_id, sender_id, text) VALUES
    (1, 2, 'Здравствуйте! Я отправила заявку на занятия по физике. Когда можно начать?'),
    (1, 5, 'Здравствуйте, Мария! Давайте созвонимся завтра в 18:00, обсудим детали. Вам удобно?'),
    (1, 2, 'Да, отлично! Буду ждать звонка.');
