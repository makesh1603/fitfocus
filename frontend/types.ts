
export interface Trainer {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  pricePerHour: number;
  bio: string;
  imageUrl: string;
  experienceYears: number;
  availability: string[]; // e.g., ["Mon", "Wed", "Fri"]
}

export type UserRole = 'customer' | 'host' | 'admin';

export interface User {
  name: string;
  email: string;
  photoUrl?: string;
  role: UserRole;
}

export interface Booking {
  id: string;
  trainerId: string;
  trainerName: string;
  userEmail: string;
  date: string;
  time: string;
  img: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface UserProfile {
  name: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: string[];
  preferredSpecialties: string[];
}

export interface WorkoutPlan {
  title: string;
  summary: string;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    description: string;
  }[];
}
