
import React, { useState } from 'react';
import { Sparkles, Dumbbell, UserCheck, ChevronRight, CheckCircle2, PlayCircle } from 'lucide-react';
import { getAIRecommendation, generateWorkoutPlan } from '../services/geminiService';
import { MOCK_TRAINERS } from '../constants';
import { UserProfile, WorkoutPlan } from '../types';

const AICoach: React.FC = () => {
  const [step, setStep] = useState<'form' | 'results'>('form');
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [trainers, setTrainers] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await fetch('/api/trainers');
        const result = await res.json();
        if (result.data) setTrainers(result.data);
      } catch (error) {
        console.error("Failed to fetch trainers for AI Coach", error);
      }
    };
    fetchTrainers();
  }, []);

  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    fitnessLevel: 'Beginner',
    goals: [],
    preferredSpecialties: []
  });

  const fitnessLevels = [
    { name: 'Beginner', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=200' },
    { name: 'Intermediate', img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=200' },
    { name: 'Advanced', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200' },
  ];

  const fitnessObjectives = [
    { name: 'Lose Weight', img: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=300' },
    { name: 'Build Muscle', img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=300' },
    { name: 'Increase Flexibility', img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=300' },
    { name: 'Improve Stamina', img: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?auto=format&fit=crop&q=80&w=300' },
    { name: 'Athletic Power', img: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=300' },
    { name: 'Pilates', img: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=300' },
    { name: 'Mobility', img: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&q=80&w=300' },
  ];

  const toggleGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal) ? prev.goals.filter(g => g !== goal) : [...prev.goals, goal]
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStep('results');

    try {
      const [rec, plan] = await Promise.all([
        getAIRecommendation(profile, trainers),
        generateWorkoutPlan(profile, "Bodyweight, Dumbbells")
      ]);
      setAiResponse(rec);
      setWorkoutPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      {step === 'form' ? (
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-2xl p-8 md:p-16">
          <div className="flex items-center gap-5 mb-12">
            <div className="p-4 bg-slate-900 rounded-[20px] shadow-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">AI Fitness Architect</h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Harness Gemini Intelligence for Your Goal</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-12">
            <div className="space-y-6">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Biological Performance Level</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fitnessLevels.map(level => (
                  <button
                    key={level.name}
                    type="button"
                    onClick={() => setProfile({ ...profile, fitnessLevel: level.name as any })}
                    className={`relative h-24 rounded-[24px] overflow-hidden border-2 transition-all flex items-center justify-center ${profile.fitnessLevel === level.name
                      ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-2xl'
                      : 'border-slate-50 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                      }`}
                  >
                    <img src={level.img} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 ${profile.fitnessLevel === level.name ? 'bg-indigo-600/20' : 'bg-black/30'}`}></div>
                    <span className={`relative font-black uppercase text-xs tracking-[0.2em] ${profile.fitnessLevel === level.name ? 'text-slate-900 bg-white/90 px-4 py-1.5 rounded-full' : 'text-white'}`}>
                      {level.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Primary Fitness Objectives</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {fitnessObjectives.map(goal => (
                  <button
                    key={goal.name}
                    type="button"
                    onClick={() => toggleGoal(goal.name)}
                    className={`relative h-32 rounded-[24px] overflow-hidden border-2 transition-all flex items-center justify-center text-center p-4 ${profile.goals.includes(goal.name)
                      ? 'border-indigo-600 ring-4 ring-indigo-50'
                      : 'border-slate-50 opacity-60 grayscale hover:grayscale-0'
                      }`}
                  >
                    <img src={goal.img} className="absolute inset-0 w-full h-full object-cover" />
                    <div className={`absolute inset-0 ${profile.goals.includes(goal.name) ? 'bg-indigo-100/40' : 'bg-black/40'}`}></div>
                    <span className={`relative font-black uppercase text-[10px] tracking-widest leading-tight ${profile.goals.includes(goal.name) ? 'text-slate-900 bg-white/90 px-3 py-1 rounded-full' : 'text-white'}`}>
                      {goal.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-50 text-slate-900 border-2 border-slate-200 py-8 rounded-[32px] font-black text-lg uppercase tracking-[0.3em] flex items-center justify-center gap-5 hover:border-slate-900 transition-all shadow-xl shadow-slate-100"
            >
              Construct Plan
              <ChevronRight className="w-6 h-6 text-indigo-600" />
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-12">
          <button
            onClick={() => setStep('form')}
            className="text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-100 px-6 py-3 rounded-full transition-all"
          >
            ← Re-Architect Plan
          </button>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-8">
              <div className="relative">
                <div className="w-32 h-32 border-[12px] border-slate-50 rounded-full"></div>
                <div className="w-32 h-32 border-[12px] border-slate-900 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                <Sparkles className="w-10 h-10 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">AI Logic Synthesizing</h3>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Personalizing biomechanics for {profile.fitnessLevel} tier</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-lg">
                  <div className="flex items-center gap-3 mb-8">
                    <UserCheck className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">AI Matches</h2>
                  </div>
                  <div className="prose prose-slate prose-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap italic border-l-4 border-indigo-100 pl-6">
                    {aiResponse}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-8">
                {workoutPlan && (
                  <div className="bg-slate-900 rounded-[48px] text-white p-10 md:p-16 shadow-2xl relative overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=2000" className="absolute inset-0 opacity-10 w-full h-full object-cover" />
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/10 pb-12">
                        <div className="flex items-center gap-6">
                          <div className="p-5 bg-indigo-600 rounded-[24px] shadow-2xl shadow-indigo-600/20">
                            <Dumbbell className="w-10 h-10 text-white" />
                          </div>
                          <div>
                            <h2 className="text-4xl font-black uppercase tracking-tight">{workoutPlan.title}</h2>
                            <p className="text-indigo-300 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">{workoutPlan.summary}</p>
                          </div>
                        </div>
                        <button className="bg-white text-slate-900 px-10 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-50 transition-all">
                          Save to Vault
                        </button>
                      </div>

                      <div className="grid gap-8">
                        {workoutPlan.exercises.map((ex, idx) => (
                          <div key={idx} className="bg-white/5 border border-white/10 p-10 rounded-[40px] hover:bg-white/10 transition-all group">
                            <div className="flex flex-col md:flex-row gap-10">
                              <div className="w-full md:w-1/3 aspect-video rounded-3xl overflow-hidden bg-slate-800 relative">
                                <img src={`https://images.unsplash.com/photo-${1517836357463 + idx}-d25dfeac3438?auto=format&fit=crop&q=80&w=400`} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white transition-colors cursor-pointer" />
                                </div>
                              </div>
                              <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-4">
                                  <span className="text-indigo-500 text-sm font-black uppercase tracking-widest">No. {idx + 1}</span>
                                  <h3 className="text-2xl font-black uppercase tracking-tight">{ex.name}</h3>
                                </div>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{ex.description}</p>
                                <div className="flex items-center gap-12 pt-4">
                                  <div className="flex flex-col">
                                    <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Sets</span>
                                    <span className="text-3xl font-black text-indigo-400">{ex.sets}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Target</span>
                                    <span className="text-3xl font-black text-white">{ex.reps}</span>
                                  </div>
                                  <button className="ml-auto p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-400 opacity-40 group-hover:opacity-100 transition-opacity" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AICoach;
