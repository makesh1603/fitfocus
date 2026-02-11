
import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles } from 'lucide-react';
import { MOCK_TRAINERS, SPECIALTY_DATA } from '../constants';
import TrainerCard from '../components/TrainerCard';
import { Trainer } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Trainers: React.FC = () => {
    const { user } = useAuth();
    const isCustomer = user?.role === 'customer';
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);
    const [trainers, setTrainers] = useState<Trainer[]>([]);

    React.useEffect(() => {
        const savedTrainers = JSON.parse(localStorage.getItem('fitfocus_trainers') || '[]');
        if (savedTrainers.length > 0) {
            setTrainers(savedTrainers);
        } else {
            setTrainers(MOCK_TRAINERS);
            localStorage.setItem('fitfocus_trainers', JSON.stringify(MOCK_TRAINERS));
        }
    }, []);

    const filteredTrainers = trainers.filter(trainer => {
        const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trainer.bio.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = !selectedSpecialty || trainer.specialties.includes(selectedSpecialty);
        return matchesSearch && matchesSpecialty;
    });

    const handleBook = (trainer: Trainer) => {
        const user = JSON.parse(localStorage.getItem('fitfocus_user') || 'null');
        const email = user?.email || 'default';
        const storageKey = `fitfocus_bookings_${email}`;

        const savedBookings = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (savedBookings.some((b: any) => b.trainerId === trainer.id)) {
            alert(`${trainer.name} is already in your bookings!`);
            return;
        }
        const isConfirmed = window.confirm(`Do you want to reserve a spot with ${trainer.name}?`);
        if (isConfirmed) {
            const newBooking = {
                id: Math.random().toString(36).substr(2, 9),
                trainerId: trainer.id,
                trainerName: trainer.name,
                userEmail: email,
                type: trainer.specialties[0],
                time: 'Upcoming Session',
                date: new Date().toLocaleDateString(),
                img: trainer.imageUrl,
                status: 'pending'
            };

            // Save to user's bookings
            localStorage.setItem(storageKey, JSON.stringify([...savedBookings, newBooking]));

            // Save to global admin bookings for tracking
            const allBookings = JSON.parse(localStorage.getItem('fitfocus_all_bookings') || '[]');
            localStorage.setItem('fitfocus_all_bookings', JSON.stringify([...allBookings, newBooking]));

            alert(`Successfully joined ${trainer.name}'s monthly program! Check your dashboard for status.`);
        }
    };

    return (
        <div className="space-y-24 animate-fade-in">
            {/* Header Section */}
            <header className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    <Sparkles className="w-3 h-3" />
                    Elite Roster
                </div>
                <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase italic">
                    World-Class <br />
                    <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-slate-400 px-4 py-4 -mx-4 -my-4">Coaching</span>
                </h1>
                <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] max-w-lg">
                    Connect with industry-leading experts dedicated to your physical and mental transformation.
                </p>
            </header>

            {/* Specialty Filter */}
            <section className="space-y-12">
                <div className="flex items-end justify-between px-2">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Filter by Specialty</h2>
                    </div>
                    <button
                        onClick={() => setSelectedSpecialty(null)}
                        className="text-slate-900 font-black text-xs uppercase tracking-[0.2em] hover:text-indigo-600 transition-colors flex items-center gap-3"
                    >
                        Clear Filters <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {SPECIALTY_DATA.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setSelectedSpecialty(cat.name === selectedSpecialty ? null : cat.name)}
                            className={`relative group h-24 rounded-2xl overflow-hidden transition-all duration-300 ${selectedSpecialty === cat.name
                                ? 'ring-4 ring-indigo-600 ring-offset-2'
                                : 'hover:scale-[1.05] shadow-sm'
                                }`}
                        >
                            <img
                                src={cat.imageUrl}
                                alt={cat.name}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className={`absolute inset-0 transition-all ${selectedSpecialty === cat.name ? 'bg-indigo-900/40' : 'bg-black/50 group-hover:bg-indigo-900/20'}`}></div>
                            <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                                <span className="text-white text-[10px] font-black uppercase tracking-widest leading-tight">
                                    {cat.name}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            {/* Roster Section */}
            <section className="space-y-16 pb-32">
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">
                            {selectedSpecialty ? `${selectedSpecialty} Specialists` : "The Elite Roster"}
                        </h2>
                        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">{filteredTrainers.length} Experts Available</p>
                    </div>
                    <div className="relative w-full md:w-[400px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name or bio..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-[24px] focus:border-indigo-600 outline-none font-bold text-slate-900 shadow-xl transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {filteredTrainers.length > 0 ? (
                        filteredTrainers.map(trainer => (
                            <TrainerCard key={trainer.id} trainer={trainer} onBook={handleBook} showBookButton={isCustomer} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center space-y-6 bg-slate-50 rounded-[48px] border border-dashed border-slate-200">
                            <Search className="w-16 h-16 text-slate-200 mx-auto" />
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">No trainers found</h3>
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedSpecialty(null); }}
                                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all"
                            >
                                Reset Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Trainers;
