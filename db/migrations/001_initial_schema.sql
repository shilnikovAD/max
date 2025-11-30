-- FizTech Tutors Database Schema
-- Migration: 001_initial_schema
-- Description: Initial database schema with all core tables, enums, and indexes

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User role enum
CREATE TYPE user_role AS ENUM ('STUDENT', 'TUTOR', 'ADMIN');

-- Tutor profile moderation status
CREATE TYPE tutor_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'HIDDEN');

-- Teaching format preference
CREATE TYPE tutor_format AS ENUM ('ONLINE', 'OFFLINE', 'BOTH');

-- Lesson request status
CREATE TYPE lesson_request_status AS ENUM ('NEW', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- Review moderation status
CREATE TYPE review_status AS ENUM ('VISIBLE', 'HIDDEN', 'PENDING');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table: Core user accounts
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- bcrypt/argon2 hash
    role user_role NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students table: Student profile details (1:1 with users)
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    grade VARCHAR(50),           -- Class/course level (e.g., "11 класс", "2 курс")
    city VARCHAR(100),           -- Student's city
    telegram VARCHAR(100)        -- Optional Telegram handle
);

-- Tutors table: Tutor profile details (1:1 with users)
CREATE TABLE tutors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    faculty VARCHAR(100) NOT NULL,        -- MIPT faculty/school
    study_year VARCHAR(50) NOT NULL,      -- Current year or graduation status
    about TEXT,                           -- About me section
    price_per_hour INTEGER NOT NULL,      -- Price in rubles
    format tutor_format NOT NULL,         -- ONLINE/OFFLINE/BOTH
    city VARCHAR(100),                    -- City for offline tutoring
    status tutor_status NOT NULL DEFAULT 'PENDING',
    avg_rating NUMERIC(3,2) DEFAULT 0,    -- Denormalized average rating (1.00-5.00)
    reviews_count INTEGER DEFAULT 0,       -- Denormalized reviews count
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT tutors_price_check CHECK (price_per_hour >= 100 AND price_per_hour <= 50000),
    CONSTRAINT tutors_rating_check CHECK (avg_rating >= 0 AND avg_rating <= 5)
);

-- Subjects reference table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- Tutor-Subject many-to-many relationship
CREATE TABLE tutor_subjects (
    tutor_id INTEGER NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, subject_id)
);

-- Education levels reference table
CREATE TABLE levels (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,     -- e.g., "ege", "oge", "olymp"
    name VARCHAR(100) NOT NULL            -- e.g., "ЕГЭ", "ОГЭ", "Олимпиады"
);

-- Tutor-Level many-to-many relationship
CREATE TABLE tutor_levels (
    tutor_id INTEGER NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE CASCADE,
    PRIMARY KEY (tutor_id, level_id)
);

-- MIPT Faculties reference table
CREATE TABLE faculties (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,     -- e.g., "frkt", "fpmi"
    name VARCHAR(100) NOT NULL            -- e.g., "ФРКТ", "ФПМИ"
);

-- Lesson requests table
CREATE TABLE lesson_requests (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    tutor_id INTEGER NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE RESTRICT,
    level_id INTEGER NOT NULL REFERENCES levels(id) ON DELETE RESTRICT,
    goal TEXT,                            -- Learning goal
    preferred_time VARCHAR(200),          -- Preferred time (free text for MVP)
    comment TEXT,                         -- Additional comments
    status lesson_request_status NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    tutor_id INTEGER NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    lesson_request_id INTEGER NOT NULL REFERENCES lesson_requests(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL,
    text TEXT,
    status review_status NOT NULL DEFAULT 'VISIBLE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT reviews_rating_check CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT reviews_unique_lesson UNIQUE (lesson_request_id)  -- One review per lesson request
);

-- Favorites table (Student -> Tutor bookmarks)
CREATE TABLE favorites (
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    tutor_id INTEGER NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, tutor_id)
);

-- Messages table (Chat within lesson requests)
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    lesson_request_id INTEGER NOT NULL REFERENCES lesson_requests(id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table (for JWT refresh token management)
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Tutors indexes for filtering
CREATE INDEX idx_tutors_status ON tutors(status);
CREATE INDEX idx_tutors_city ON tutors(city);
CREATE INDEX idx_tutors_price ON tutors(price_per_hour);
CREATE INDEX idx_tutors_rating ON tutors(avg_rating DESC);
CREATE INDEX idx_tutors_format ON tutors(format);
CREATE INDEX idx_tutors_faculty ON tutors(faculty);

-- Composite index for common filter combinations
CREATE INDEX idx_tutors_status_rating ON tutors(status, avg_rating DESC);
CREATE INDEX idx_tutors_status_price ON tutors(status, price_per_hour);

-- Tutor subjects indexes
CREATE INDEX idx_tutor_subjects_subject ON tutor_subjects(subject_id);
CREATE INDEX idx_tutor_subjects_tutor ON tutor_subjects(tutor_id);

-- Tutor levels indexes
CREATE INDEX idx_tutor_levels_level ON tutor_levels(level_id);
CREATE INDEX idx_tutor_levels_tutor ON tutor_levels(tutor_id);

-- Reviews indexes
CREATE INDEX idx_reviews_tutor_status ON reviews(tutor_id, status);
CREATE INDEX idx_reviews_student ON reviews(student_id);

-- Lesson requests indexes
CREATE INDEX idx_lesson_requests_tutor_status ON lesson_requests(tutor_id, status);
CREATE INDEX idx_lesson_requests_student_status ON lesson_requests(student_id, status);
CREATE INDEX idx_lesson_requests_created ON lesson_requests(created_at DESC);

-- Messages indexes
CREATE INDEX idx_messages_lesson_request ON messages(lesson_request_id);
CREATE INDEX idx_messages_created ON messages(lesson_request_id, created_at);

-- Favorites indexes
CREATE INDEX idx_favorites_tutor ON favorites(tutor_id);

-- Refresh tokens indexes
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutors_updated_at
    BEFORE UPDATE ON tutors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_requests_updated_at
    BEFORE UPDATE ON lesson_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to recalculate tutor average rating
CREATE OR REPLACE FUNCTION recalculate_tutor_rating()
RETURNS TRIGGER AS $$
DECLARE
    tutor_id_val INTEGER;
    new_avg NUMERIC(3,2);
    new_count INTEGER;
BEGIN
    -- Determine which tutor_id to use
    IF TG_OP = 'DELETE' THEN
        tutor_id_val := OLD.tutor_id;
    ELSE
        tutor_id_val := NEW.tutor_id;
    END IF;
    
    -- Calculate new average and count from visible reviews
    SELECT 
        COALESCE(AVG(rating)::NUMERIC(3,2), 0),
        COUNT(*)
    INTO new_avg, new_count
    FROM reviews
    WHERE tutor_id = tutor_id_val
    AND status = 'VISIBLE';
    
    -- Update tutor's denormalized fields
    UPDATE tutors
    SET avg_rating = new_avg,
        reviews_count = new_count
    WHERE id = tutor_id_val;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for rating recalculation
CREATE TRIGGER trigger_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_tutor_rating();

CREATE TRIGGER trigger_review_update
    AFTER UPDATE OF rating, status ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_tutor_rating();

CREATE TRIGGER trigger_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_tutor_rating();

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert default subjects
INSERT INTO subjects (name) VALUES
    ('Физика'),
    ('Математика'),
    ('Информатика'),
    ('Химия'),
    ('Биология'),
    ('Русский язык'),
    ('Английский язык'),
    ('Программирование'),
    ('Механика'),
    ('Электроника');

-- Insert default education levels
INSERT INTO levels (code, name) VALUES
    ('ege', 'ЕГЭ'),
    ('oge', 'ОГЭ'),
    ('school', 'Школьная программа'),
    ('olymp', 'Олимпиады'),
    ('mipt_exam', 'МФТИ-вступительные'),
    ('university', 'Вузовская программа');

-- Insert MIPT faculties
INSERT INTO faculties (code, name) VALUES
    ('frkt', 'ФРКТ'),
    ('fpmi', 'ФПМИ'),
    ('fopf', 'ФОПФ'),
    ('fefm', 'ФЭФМ'),
    ('fbmf', 'ФБМФ'),
    ('ffke', 'ФФКЭ'),
    ('falt', 'ФАКТ'),
    ('fmbb', 'ФМББ'),
    ('lfi', 'ЛФИ'),
    ('vshpi', 'ВШПИ');

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE users IS 'Core user accounts for all roles';
COMMENT ON TABLE students IS 'Student profile details, linked 1:1 with users';
COMMENT ON TABLE tutors IS 'Tutor profile details, linked 1:1 with users';
COMMENT ON TABLE subjects IS 'Reference table for available subjects';
COMMENT ON TABLE tutor_subjects IS 'Many-to-many relationship between tutors and subjects';
COMMENT ON TABLE levels IS 'Reference table for education levels (ЕГЭ, ОГЭ, etc.)';
COMMENT ON TABLE tutor_levels IS 'Many-to-many relationship between tutors and levels';
COMMENT ON TABLE faculties IS 'Reference table for MIPT faculties';
COMMENT ON TABLE lesson_requests IS 'Lesson requests from students to tutors';
COMMENT ON TABLE reviews IS 'Student reviews of tutors after completed lessons';
COMMENT ON TABLE favorites IS 'Student bookmarks/favorites for tutors';
COMMENT ON TABLE messages IS 'Chat messages within lesson requests';
COMMENT ON TABLE refresh_tokens IS 'JWT refresh tokens for authentication';

COMMENT ON COLUMN tutors.avg_rating IS 'Denormalized average rating, updated by trigger';
COMMENT ON COLUMN tutors.reviews_count IS 'Denormalized review count, updated by trigger';
