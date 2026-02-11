const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Trainer = require('./models/Trainer');

dotenv.config();

const MOCK_TRAINERS = [
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

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Check if trainers already exist
        const count = await Trainer.countDocuments();
        if (count === 0) {
            await Trainer.insertMany(MOCK_TRAINERS);
            console.log('Trainers seeded');
        } else {
            console.log('Trainers already exist, skipping seed');
        }

        mongoose.disconnect();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
