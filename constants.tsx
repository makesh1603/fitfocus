
import { Trainer } from './types';

export interface SpecialtyCategory {
  name: string;
  imageUrl: string;
}

export const SPECIALTY_DATA: SpecialtyCategory[] = [
  {
    name: "Weight Loss",
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Muscle Gain",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Yoga",
    imageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "HIIT",
    imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "CrossFit",
    imageUrl: "https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Pilates",
    imageUrl: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Mobility",
    imageUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=800"
  },
  {
    name: "Strength & Conditioning",
    imageUrl: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800"
  }
];

export const SPECIALTIES = SPECIALTY_DATA.map(item => item.name);

export const MOCK_TRAINERS: Trainer[] = [
  {
    id: "6",
    name: "Karthik Raja",
    specialties: ["Strength & Conditioning", "Weight Loss"],
    rating: 4.9,
    pricePerHour: 45,
    bio: "Certified personal trainer with 10+ years experience. I specialize in traditional strength training combined with modern diet planning. தமிழிலும் பயிற்சி அளிக்கப்படும்.",
    imageUrl: "https://www.firstbeat.com/wp-content/uploads/2022/07/FB-Luke-W-1-1300x867.jpg",
    experienceYears: 10,
    availability: ["Mon", "Wed", "Fri", "Sat"]
  },
  {
    id: "7",
    name: "Meera Sundaram",
    specialties: ["Yoga", "Mobility"],
    rating: 5.0,
    pricePerHour: 55,
    bio: "Yoga acharya focusing on holistic wellness and breathwork. Expertise in hatha and vinyasa styles for all age groups. ஆரோக்கியமான வாழ்விற்கு யோகா!",
    imageUrl: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=400",
    experienceYears: 15,
    availability: ["Tue", "Thu", "Sat", "Sun"]
  },
  {
    id: "8",
    name: "Ravi Chandran",
    specialties: ["CrossFit", "Muscle Gain"],
    rating: 4.7,
    pricePerHour: 50,
    bio: "Former state-level weightlifter. I help clients build raw power and functional strength. சென்னையில் சிறந்த உடற்பயிற்சி நிபுணர்.",
    imageUrl: "https://media.istockphoto.com/id/1040501222/photo/portrait-of-a-personal-trainer-in-the-gym.jpg?s=612x612&w=0&k=20&c=Xdmp8LM2OCBkwtbWELRkYoQlsT9OZECtq--7gE5BPLg=",
    experienceYears: 6,
    availability: ["Mon", "Tue", "Thu", "Fri"]
  },
  {
    id: "1",
    name: "Alex Rivera",
    specialties: ["Strength & Conditioning", "Muscle Gain"],
    rating: 4.9,
    pricePerHour: 65,
    bio: "Ex-collegiate athlete focusing on powerlifting and hypertrophy. I help busy professionals transform their physique.",
    imageUrl: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&q=80&w=400",
    experienceYears: 8,
    availability: ["Mon", "Tue", "Thu", "Sat"]
  },
  {
    id: "2",
    name: "Sarah Chen",
    specialties: ["Yoga", "Mobility", "Pilates"],
    rating: 5.0,
    pricePerHour: 80,
    bio: "Specializing in mindful movement and functional mobility. Certified Yoga therapist.",
    imageUrl: "https://t3.ftcdn.net/jpg/01/59/75/90/360_F_159759088_VnP0F95eUsQfNSI5GqMZgdp5Xn6c3ZjO.jpg",
    experienceYears: 12,
    availability: ["Mon", "Wed", "Fri", "Sun"]
  }
];
