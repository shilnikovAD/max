export interface Tutor {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  photo_url?: string;
  bio: string;
  education: string;
  faculty?: string;
  graduation_year?: number;
  experience_years: number;
  price_per_hour: number;
  format: 'ONLINE' | 'OFFLINE' | 'BOTH';
  city?: string;
  avg_rating: number;
  reviews_count: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';
  created_at: string;
  updated_at: string;
}

export interface TutorSubject {
  subject_id: number;
  subject_name: string;
}

export interface TutorLevel {
  level_code: string;
  level_name: string;
}

export interface TutorDetails extends Tutor {
  subjects: TutorSubject[];
  levels: TutorLevel[];
}

export interface CreateTutorDto {
  bio: string;
  education: string;
  faculty?: string;
  graduation_year?: number;
  experience_years: number;
  price_per_hour: number;
  format: 'ONLINE' | 'OFFLINE' | 'BOTH';
  city?: string;
  subject_ids: number[];
  level_codes: string[];
}

export interface UpdateTutorDto extends Partial<CreateTutorDto> {}

export interface TutorFilters {
  subject_id?: number;
  level?: string;
  faculty?: string;
  price_min?: number;
  price_max?: number;
  rating_min?: number;
  city?: string;
  format?: 'ONLINE' | 'OFFLINE' | 'BOTH';
  sort?: 'rating_desc' | 'price_asc' | 'price_desc' | 'experience_desc';
  page?: number;
  page_size?: number;
}

export interface TutorsResponse {
  items: Tutor[];
  page: number;
  page_size: number;
  total: number;
}
