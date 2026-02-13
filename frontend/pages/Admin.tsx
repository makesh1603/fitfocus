
import React, { useState, useEffect } from 'react';
import { Check, X, User, Calendar, Mail, ShieldCheck, Plus, Trash2, Tag, Info, DollarSign, Image as ImageIcon, Award, Edit2 } from 'lucide-react';
import { Booking, Trainer } from '../types';
import { MOCK_TRAINERS, SPECIALTIES } from '../constants';

const Admin: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [trainers, setTrainers] = useState<Trainer[]>([]);
    const [activeTab, setActiveTab] = useState<'bookings' | 'trainers'>('trainers');

    // New Trainer Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newTrainer, setNewTrainer] = useState<Partial<Trainer>>({
        name: '',
        specialties: [],
        rating: 5.0,
        pricePerHour: 0,
        bio: '',
        imageUrl: '',
        experienceYears: 0,
        availability: ['Mon', 'Wed', 'Fri']
    });

    const [editingTrainerId, setEditingTrainerId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trainersRes = await fetch('/api/trainers');
                const trainersData = await trainersRes.json();
                if (trainersData.data) setTrainers(trainersData.data);

                const bookingsRes = await fetch('/api/bookings');
                const bookingsData = await bookingsRes.json();
                if (bookingsData.data) setBookings(bookingsData.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            }
        };
        fetchData();
    }, []);

    const handleAction = async (bookingId: string, newStatus: 'confirmed' | 'completed') => {
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                const result = await res.json();
                setBookings(bookings.map(b => b.id === bookingId || b._id === bookingId ? result.data : b));
            }
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    const handleRemoveBooking = async (bookingId: string) => {
        if (!window.confirm('Are you sure you want to remove this booking?')) return;
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setBookings(bookings.filter(b => b.id !== bookingId && b._id !== bookingId));
            }
        } catch (error) {
            console.error("Remove booking failed", error);
        }
    };

    const handleAddTrainer = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const method = editingTrainerId ? 'PUT' : 'POST';
            const url = editingTrainerId ? `/api/trainers/${editingTrainerId}` : '/api/trainers';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTrainer)
            });

            if (res.ok) {
                const result = await res.json();
                if (editingTrainerId) {
                    setTrainers(trainers.map(t => t.id === editingTrainerId ? result.data : t));
                } else {
                    setTrainers([...trainers, result.data]);
                }
                setShowAddForm(false);
                setEditingTrainerId(null);
                setNewTrainer({
                    name: '',
                    specialties: [],
                    rating: 5.0,
                    pricePerHour: 0,
                    bio: '',
                    imageUrl: '',
                    experienceYears: 0,
                    availability: ['Mon', 'Wed', 'Fri']
                });
            }
        } catch (error) {
            console.error("Trainer save failed", error);
        }
    };

    const handleEditTrainer = (trainer: Trainer) => {
        setNewTrainer(trainer);
        setEditingTrainerId(trainer.id);
        setShowAddForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelAdd = () => {
        setShowAddForm(false);
        setEditingTrainerId(null);
        setNewTrainer({
            name: '',
            specialties: [],
            rating: 5.0,
            pricePerHour: 0,
            bio: '',
            imageUrl: '',
            experienceYears: 0,
            availability: ['Mon', 'Wed', 'Fri']
        });
    };

    const handleRemoveTrainer = async (id: string) => {
        if (!window.confirm('Are you sure you want to remove this trainer?')) return;
        try {
            const res = await fetch(`/api/trainers/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setTrainers(trainers.filter(t => t.id !== id && t._id !== id));
            }
        } catch (error) {
            console.error("Remove trainer failed", error);
        }
    };

    const toggleSpecialty = (specialty: string) => {
        const current = newTrainer.specialties || [];
        if (current.includes(specialty)) {
            setNewTrainer({ ...newTrainer, specialties: current.filter(s => s !== specialty) });
        } else {
            setNewTrainer({ ...newTrainer, specialties: [...current, specialty] });
        }
    };

    return (
        <div className="space-y-12 animate-fade-in pb-20">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <ShieldCheck className="w-3 h-3" />
                        Admin Headquarters
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">System Control</h1>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">{activeTab === 'bookings' ? 'Manage Reservations' : 'Manage Elite Roster'}</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('trainers')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'trainers' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Trainers
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'bookings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Bookings
                    </button>
                </div>
            </header>

            {activeTab === 'trainers' ? (
                <div className="space-y-8">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Trainers ({trainers.length})</h2>
                        <button
                            onClick={showAddForm ? handleCancelAdd : () => setShowAddForm(true)}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100"
                        >
                            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {showAddForm ? 'Cancel' : 'Add Trainer'}
                        </button>
                    </div>

                    {showAddForm && (
                        <div className="bg-white p-10 rounded-[48px] border-2 border-indigo-100 shadow-xl animate-in slide-in-from-top-4 duration-500">
                            <form onSubmit={handleAddTrainer} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            <User className="w-3 h-3" /> Full Name
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newTrainer.name}
                                            onChange={e => setNewTrainer({ ...newTrainer, name: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all"
                                            placeholder="e.g. John Doe"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            <ImageIcon className="w-3 h-3" /> Image URL
                                        </label>
                                        <input
                                            type="url"
                                            required
                                            value={newTrainer.imageUrl}
                                            onChange={e => setNewTrainer({ ...newTrainer, imageUrl: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                                <DollarSign className="w-3 h-3" /> Price/Month
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={newTrainer.pricePerHour}
                                                onChange={e => setNewTrainer({ ...newTrainer, pricePerHour: parseInt(e.target.value) })}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                                <Award className="w-3 h-3" /> Experience (Yrs)
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={newTrainer.experienceYears}
                                                onChange={e => setNewTrainer({ ...newTrainer, experienceYears: parseInt(e.target.value) })}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            <Tag className="w-3 h-3" /> Specialties
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {SPECIALTIES.map(s => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => toggleSpecialty(s)}
                                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newTrainer.specialties?.includes(s) ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                                            <Info className="w-3 h-3" /> Bio
                                        </label>
                                        <textarea
                                            required
                                            value={newTrainer.bio}
                                            onChange={e => setNewTrainer({ ...newTrainer, bio: e.target.value })}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-900 focus:border-indigo-600 outline-none transition-all h-32 resize-none"
                                            placeholder="Write a short bio..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-600 transition-all shadow-xl"
                                    >
                                        {editingTrainerId ? 'Update Trainer Profile' : 'Create Trainer Profile'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {trainers.map(trainer => (
                            <div key={trainer.id} className="group bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex gap-6">
                                <img src={trainer.imageUrl} alt={trainer.name} className="w-24 h-24 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{trainer.name}</h3>
                                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{trainer.specialties.join(' • ')}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditTrainer(trainer)}
                                                className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"
                                                title="Edit Trainer"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveTrainer(trainer.id)}
                                                className="p-3 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                                                title="Remove Trainer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4">
                                        <div className="text-center">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Price / Hour</p>
                                            <p className="font-black text-slate-900 leading-none mt-1">₹{trainer.pricePerHour}</p>
                                        </div>
                                        <div className="text-center border-l border-slate-100 pl-6">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Experience</p>
                                            <p className="font-black text-slate-900 leading-none mt-1">{trainer.experienceYears}Y</p>
                                        </div>
                                        <div className="text-center border-l border-slate-100 pl-6">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating</p>
                                            <p className="font-black text-slate-900 leading-none mt-1">{trainer.rating}★</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-100">
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User / Email</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trainer</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Time</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-slate-400" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-900">{booking.userEmail.split('@')[0]}</p>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{booking.userEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <img src={booking.img} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                                    <span className="font-bold text-slate-700">{booking.trainerName}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                                        <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                                                        {booking.date}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase pl-5">{booking.time}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                                                    booking.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                                                        'bg-slate-50 text-slate-400'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {booking.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleAction(booking.id || booking._id, 'confirmed')}
                                                        className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="Confirm Booking"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveBooking(booking.id || booking._id)}
                                                    className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                    title="Cancel/Remove"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 text-slate-300">
                                                <Mail className="w-12 h-12" />
                                                <p className="font-black uppercase tracking-[0.2em] text-xs">No bookings to manage</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
