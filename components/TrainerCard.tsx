
import React from 'react';
import { Star, Clock, Award, ChevronRight } from 'lucide-react';
import { Trainer } from '../types';

interface Props {
  trainer: Trainer;
  onBook: (trainer: Trainer) => void;
  showBookButton?: boolean;
}

const TrainerCard: React.FC<Props> = ({ trainer, onBook, showBookButton = true }) => {
  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={trainer.imageUrl}
          alt={trainer.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="text-sm font-bold text-slate-800">{trainer.rating}</span>
        </div>



        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent">
          <div className="flex flex-wrap gap-1">
            {trainer.specialties.map(s => (
              <span key={s} className="bg-indigo-600/90 text-white text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-black text-slate-900 leading-tight">{trainer.name}</h3>
            <div className="flex items-center gap-2 mt-1 text-slate-500 text-xs font-bold uppercase tracking-tight">
              <Award className="w-3.5 h-3.5 text-indigo-500" />
              <span>{trainer.experienceYears} YEARS EXPERIENCE</span>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-xl font-black text-indigo-600">₹{trainer.pricePerHour}</span>
            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">per month</span>
          </div>
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 mb-6 h-10 leading-relaxed italic">
          "{trainer.bio}"
        </p>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <div className="flex gap-1">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span
                  key={day}
                  className={`text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-md ${trainer.availability.includes(day)
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                    : 'bg-slate-50 text-slate-200'
                    }`}
                >
                  {day[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {showBookButton && (
          <button
            onClick={() => onBook(trainer)}
            className="w-full bg-slate-50 text-slate-900 border-2 border-transparent py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:border-slate-900 transition-all shadow-sm"
          >
            Reserve Spot
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-indigo-600" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrainerCard;
