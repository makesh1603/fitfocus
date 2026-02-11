
import React, { useState } from 'react';
// Added ChevronRight to the import list
import { Search, SlidersHorizontal, Sparkles, ArrowRight, CheckCircle, Target, Users, BookOpen, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_TRAINERS, SPECIALTY_DATA } from '../constants';
import TrainerCard from '../components/TrainerCard';
import { Trainer } from '../types';

const Home: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);


  const filteredTrainers = MOCK_TRAINERS.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || trainer.specialties.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const handleBook = (trainer: Trainer) => {
    // Basic booking logic - save to localStorage
    const savedBookings = JSON.parse(localStorage.getItem('fitfocus_bookings') || '[]');

    // Check if already booked
    if (savedBookings.some((b: any) => b.trainerId === trainer.id)) {
      alert(`${trainer.name} is already in your bookings!`);
      return;
    }

    // Confirmation Step
    const isConfirmed = window.confirm(`Do you want to reserve a spot with ${trainer.name}?`);

    if (isConfirmed) {
      const newBooking = {
        trainerId: trainer.id,
        name: trainer.name,
        type: trainer.specialties[0], // Use first specialty as type
        time: 'Upcoming Session', // Placeholder time
        img: trainer.imageUrl
      };

      localStorage.setItem('fitfocus_bookings', JSON.stringify([...savedBookings, newBooking]));
      alert(`Successfully booked a session with ${trainer.name}! Check your dashboard.`);
    }
  };

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="relative rounded-[48px] bg-slate-50 p-8 md:p-20 overflow-hidden shadow-sm border border-slate-100">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-50 to-transparent pointer-events-none opacity-50"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-white text-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-full text-xs font-black mb-8 tracking-[0.2em] uppercase shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span>AI Personal Concierge</span>
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tighter uppercase italic">
            Focus <br />
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-slate-900 py-4 -mx-4 -my-4">Your Energy</span>
          </h1>
          <p className="text-slate-600 text-lg md:text-2xl mb-12 max-w-2xl leading-relaxed font-bold">
            Elite coaching that understands you. Find expert trainers fluent in your preferred style.
          </p>
          <div className="flex flex-wrap gap-5">
            <Link to="/trainers" className="bg-slate-900 text-white px-10 py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-slate-200 hover:bg-indigo-600 hover:-translate-y-1 transition-all flex items-center gap-3">
              Book Now <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/ai-coach" className="bg-white text-slate-900 border-2 border-slate-200 px-10 py-6 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:border-slate-900 hover:-translate-y-1 transition-all flex items-center gap-3">
              Try AI Coach
            </Link>
          </div>
        </div>
      </section>

      {/* Core Platform Features - Enhanced with CTA to Exercises */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: "Expert Trainers",
            desc: "Connect with certified professionals tailored to your cultural and language preferences.",
            img: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?auto=format&fit=crop&q=80&w=800",
            icon: Users,
            link: "/trainers"
          },
          {
            title: "Movement Lab",
            desc: "Our scientific exercise library with over 100+ precision drill guides for every level.",
            img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
            icon: BookOpen,
            link: "/exercises"
          },
          {
            title: "AI Optimization",
            desc: "The Gemini engine tracks every rep and kilometer to refine your metabolic conditioning.",
            img: "https://images.unsplash.com/photo-1532384748853-8f54a8f476e2?auto=format&fit=crop&q=80&w=800",
            icon: Sparkles,
            link: "/ai-coach"
          }
        ].map((feature, idx) => (
          <Link to={feature.link} key={idx} className="group relative rounded-[40px] overflow-hidden aspect-[4/5] shadow-lg">
            <img src={feature.img} alt={feature.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
            <div className="absolute inset-0 p-10 flex flex-col justify-end">
              <div className="bg-white/10 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-4 group-hover:text-indigo-400 transition-colors">{feature.title}</h3>
              <p className="text-slate-200 font-bold text-sm leading-relaxed">{feature.desc}</p>
              <div className="mt-6 flex items-center gap-2 text-white text-[10px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                Explore <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Next Page CTA - Exercise Library Link */}
      <section className="relative rounded-[64px] bg-indigo-600 p-12 md:p-24 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
              Perfect Your <br /> Technique
            </h2>
            <p className="text-indigo-100 text-xl font-bold max-w-xl">
              Don't just move. Move with purpose. Access our interactive exercise library for professional form analysis.
            </p>
          </div>
          <Link to="/exercises" className="bg-white text-slate-900 px-12 py-8 rounded-[32px] font-black text-sm uppercase tracking-[0.3em] shadow-2xl hover:bg-slate-50 hover:-translate-y-2 transition-all flex items-center gap-4">
            Open Library <ChevronRight className="w-6 h-6 text-indigo-600" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
