
import React from 'react';
import { Calendar, TrendingUp, Timer, ChevronRight, X, Check, Mail, User as UserIcon } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useAuth } from '../contexts/AuthContext';
import { Booking } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [progressData, setProgressData] = React.useState<any[]>([]);
  const [workouts, setWorkouts] = React.useState<any[]>([]);
  const [showLogModal, setShowLogModal] = React.useState(false);
  const [newWeight, setNewWeight] = React.useState('');
  const [duration, setDuration] = React.useState('');

  // Host specific state
  const [allBookings, setAllBookings] = React.useState<Booking[]>([]);
  const [hostTab, setHostTab] = React.useState<'pending' | 'confirmed'>('pending');

  React.useEffect(() => {
    const email = user?.email || 'default';

    if (user?.role === 'customer') {
      // Bookings
      const savedBookings = JSON.parse(localStorage.getItem(`fitfocus_bookings_${email}`) || '[]');
      setBookings(savedBookings);

      // Biometrics
      const savedBiometrics = JSON.parse(localStorage.getItem(`fitfocus_biometrics_${email}`) || '[]');
      setProgressData(savedBiometrics);

      // Workouts
      const savedWorkouts = JSON.parse(localStorage.getItem(`fitfocus_workouts_${email}`) || '[]');
      setWorkouts(savedWorkouts);
    } else if (user?.role === 'host') {
      const savedAll = JSON.parse(localStorage.getItem('fitfocus_all_bookings') || '[]');
      setAllBookings(savedAll);
    }
  }, [user]);

  const handleAction = (bookingId: string, newStatus: 'confirmed' | 'completed', userEmail: string) => {
    // Update global bookings
    const updatedAll = allBookings.map(b =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    localStorage.setItem('fitfocus_all_bookings', JSON.stringify(updatedAll));
    setAllBookings(updatedAll);

    // Update user-specific bookings
    const userBookingsKey = `fitfocus_bookings_${userEmail}`;
    const userBookings = JSON.parse(localStorage.getItem(userBookingsKey) || '[]');
    const updatedUserBookings = userBookings.map((b: any) =>
      b.id === bookingId ? { ...b, status: newStatus } : b
    );
    localStorage.setItem(userBookingsKey, JSON.stringify(updatedUserBookings));
  };

  const handleQuickLog = (e: React.FormEvent) => {
    // ... (existing logic)
  };

  const calculateWeeklyHours = () => {
    const totalMinutes = workouts.reduce((acc, curr) => acc + curr.duration_minutes, 0);
    return (totalMinutes / 60).toFixed(1);
  };

  const handleRemoveBooking = (indexToRemove: number) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const email = user?.email || 'default';
      const updatedBookings = bookings.filter((_, idx) => idx !== indexToRemove);
      setBookings(updatedBookings);
      localStorage.setItem(`fitfocus_bookings_${email}`, JSON.stringify(updatedBookings));

      // Also remove from global if needed, but usually host/admin manages that.
      // For now, let's just keep it simple.
    }
  };

  if (user?.role === 'host') {
    return (
      <div className="space-y-12 animate-fade-in">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Host Dashboard</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">{user.name}, you are managing reservations today.</p>
          </div>
        </header>

        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
          <button
            onClick={() => setHostTab('pending')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${hostTab === 'pending' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Pending ({allBookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setHostTab('confirmed')}
            className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${hostTab === 'confirmed' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Confirmed ({allBookings.filter(b => b.status === 'confirmed').length})
          </button>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {hostTab === 'pending' ? 'Pending Approvals' : 'Reserved Customers'}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Trainer</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Time</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {allBookings.filter(b => b.status === hostTab).length > 0 ? (
                  allBookings.filter(b => b.status === hostTab).map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-slate-400" />
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
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => handleAction(booking.id, 'confirmed', booking.userEmail)}
                                className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                title="Approve Reservation"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Reject this reservation?')) {
                                    const updated = allBookings.filter(b => b.id !== booking.id);
                                    localStorage.setItem('fitfocus_all_bookings', JSON.stringify(updated));
                                    setAllBookings(updated);
                                  }
                                }}
                                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                title="Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest">
                              Active Member
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-300">
                        <Mail className="w-12 h-12" />
                        <p className="font-black uppercase tracking-[0.2em] text-xs">No pending approvals</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">{user?.name}'s Hub</h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-2">Personal Fitness Performance Dashboard</p>
        </div>
        {user?.role === 'customer' && (
          <div className="flex gap-4">
            <button
              onClick={() => setShowLogModal(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-100 hover:bg-indigo-600 transition-all"
            >
              Quick Log
            </button>
          </div>
        )}
      </header>

      {/* Log Weight Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          {/* ... (existing modal code, can keep as is for legacy/simplicity) */}
        </div>
      )}

      {/* Stats and Charts (Mostly for customer) */}
      {user?.role === 'customer' ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: 'Upcoming', val: `${bookings.length} Session${bookings.length !== 1 ? 's' : ''}`, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: '+12%', trendColor: 'text-indigo-600' },
              { label: 'Weekly Active', val: `${calculateWeeklyHours()} Hours`, icon: Timer, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0.5h', trendColor: 'text-emerald-600' },
              { label: 'Goals Reached', val: '0 / 5', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'On Track', trendColor: 'text-amber-600' },
            ].map(stat => (
              <div key={stat.label} className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${stat.bg} ${stat.trendColor} uppercase tracking-wider`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">{stat.val}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Biometric Progress</h2>
                <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-black text-slate-900 uppercase tracking-widest">Weight (KG)</div>
              </div>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={progressData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="logged_date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} dy={15} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} domain={['dataMin - 2', 'dataMax + 2']} />
                    <Tooltip
                      contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'black' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={4} fillOpacity={1} fill="url(#colorWeight)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8">Up Next</h2>
              <div className="space-y-6 flex-1">
                {bookings.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-5 p-5 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group cursor-pointer">
                    <img src={s.img} alt={s.trainerName || s.name} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-slate-900 uppercase tracking-tight">{s.trainerName || s.name}</h4>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${s.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600' :
                          s.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                            'bg-slate-50 text-slate-400'
                          }`}>
                          {s.status || 'pending'}
                        </span>
                      </div>
                      <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-0.5">{s.type}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{s.time}</p>
                    </div>
                  </div>
                ))}
                {bookings.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <Calendar className="w-12 h-12 mb-4" />
                    <p className="font-black uppercase tracking-widest text-xs">No upcoming sessions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="py-20 text-center bg-slate-50 rounded-[48px] border border-dashed border-slate-200">
          <TrendingUp className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Dashboard Restricted</h3>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">Only customers can view personal performance metrics</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
