
import React, { useState } from 'react';
import { Search, Info, PlayCircle, Clock, Award, Target, ChevronRight, X, Sparkles } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  instructions: string[];
  imageUrl: string;
  muscles: string[];
}

const EXERCISES: Exercise[] = [
  // MUSCLE GAIN
  {
    id: 'mg-1',
    name: 'Barbell Bench Press',
    category: 'Muscle Gain',
    difficulty: 'Intermediate',
    muscles: ['Chest', 'Triceps', 'Front Delts'],
    description: 'The definitive upper body compound movement for building maximum horizontal pressing power and chest hypertrophy.',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Lie flat on the bench with feet planted firmly on the floor.',
      'Grip the bar slightly wider than shoulder-width.',
      'Lower the bar slowly to your mid-chest while keeping elbows at 45 degrees.',
      'Press the bar back up explosively while maintaining a slight arch in the lower back.',
      'Focus on driving through your chest and triceps.'
    ]
  },
  {
    id: 'mg-2',
    name: 'Barbell Row',
    category: 'Muscle Gain',
    difficulty: 'Intermediate',
    muscles: ['Lats', 'Rhomboids', 'Biceps'],
    description: 'A critical pull movement for developing back thickness and improving overall posture and pulling strength.',
    imageUrl: 'https://images.unsplash.com/photo-1434596922112-19c563067271?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Stand with feet shoulder-width apart, knees slightly bent.',
      'Hinge forward until your torso is nearly parallel to the floor.',
      'Grasp the bar with an overhand grip.',
      'Pull the bar toward your lower ribs, squeezing shoulder blades together.',
      'Lower the bar under control to the starting position.'
    ]
  },
  // WEIGHT LOSS
  {
    id: 'wl-1',
    name: 'Burpee Overload',
    category: 'Weight Loss',
    difficulty: 'Intermediate',
    muscles: ['Full Body', 'Heart Rate'],
    description: 'An explosive full-body movement designed to skyrocket metabolic demand and maximize caloric burn.',
    imageUrl: 'https://ksquaredfitness.com/wp-content/uploads/2020/12/How-to-do-a-burpee.jpg',
    instructions: [
      'Start in a standing position, then drop into a squat.',
      'Kick your feet back into a plank and perform a push-up.',
      'Jump your feet back to your hands and stand up.',
      'Immediately perform a vertical jump with arms overhead.',
      'Maintain a fast, rhythmic pace to keep heart rate elevated.'
    ]
  },
  {
    id: 'wl-2',
    name: 'Mountain Climbers',
    category: 'Weight Loss',
    difficulty: 'Beginner',
    muscles: ['Core', 'Shoulders', 'Cardio'],
    description: 'A dynamic core-focused cardio movement that builds endurance while tightening the abdominal wall.',
    imageUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Start in a high plank position with hands under shoulders.',
      'Drive your right knee toward your chest.',
      'Switch legs quickly, driving the left knee forward while extending the right.',
      'Keep your hips level and core tight.',
      'Increase speed as you gain confidence in the rhythm.'
    ]
  },
  // YOGA
  {
    id: 'yo-1',
    name: 'Warrior II (Virabhadrasana)',
    category: 'Yoga',
    difficulty: 'Beginner',
    muscles: ['Legs', 'Hips', 'Shoulders'],
    description: 'A foundational standing pose that builds strength, stability, and concentration while opening the hips.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Stand with feet wide apart, about 4-5 feet.',
      'Turn your right foot out 90 degrees and left foot in slightly.',
      'Bend your right knee over the right ankle.',
      'Stretch your arms out to the sides, parallel to the floor.',
      'Gaze over your right hand and hold for 5 deep breaths.'
    ]
  },
  {
    id: 'yo-2',
    name: 'Downward Facing Dog',
    category: 'Yoga',
    difficulty: 'Beginner',
    muscles: ['Hamstrings', 'Shoulders', 'Spine'],
    description: 'A classic inversion that stretches the entire posterior chain while strengthening the upper body.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Start on all fours with hands slightly ahead of shoulders.',
      'Lift your knees and push your sit-bones toward the ceiling.',
      'Press firmly into your palms and lengthen your spine.',
      'Heels move toward the floor (they don’t have to touch).',
      'Relax your neck and breathe deeply into the back body.'
    ]
  },
  // HIIT
  {
    id: 'hi-1',
    name: 'Kettlebell Swings',
    category: 'HIIT',
    difficulty: 'Intermediate',
    muscles: ['Glutes', 'Hamstrings', 'Core'],
    description: 'The king of posterior chain conditioning, blending power development with extreme cardiovascular demand.',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Stand with feet wider than shoulders, kettlebell between feet.',
      'Hinge at the hips to grab the handle.',
      'Hike the bell between your legs.',
      'Snap your hips forward explosively to swing the bell to chest height.',
      'Let the bell fall back through your legs as you hinge again.'
    ]
  },
  // CROSSFIT
  {
    id: 'cf-1',
    name: 'Thrusters',
    category: 'CrossFit',
    difficulty: 'Advanced',
    muscles: ['Full Body', 'Quads', 'Shoulders'],
    description: 'A brutal combination of a front squat and an overhead press, widely considered one of the most taxing CrossFit movements.',
    imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Hold a barbell or dumbbells in the front rack position.',
      'Perform a full front squat, maintaining an upright torso.',
      'Drive up explosively from the bottom of the squat.',
      'Use the momentum to press the weight overhead to full lockout.',
      'Return weight to rack position and repeat in one fluid motion.'
    ]
  },
  // PILATES
  {
    id: 'pi-1',
    name: 'Plank to Pike',
    category: 'Pilates',
    difficulty: 'Intermediate',
    muscles: ['Core', 'Shoulders', 'Flexors'],
    description: 'A core-stability powerhouse that challenges abdominal control and shoulder endurance through a controlled range of motion.',
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/2020-bicycling-weekendworkouts-ep43-pikevariations-jc-v02-index-1608662822.jpg?crop=0.7414019427671305xw:1xh;center,top&resize=1200:*',
    instructions: [
      'Start in a high plank position with feet on gliders or a smooth floor.',
      'Engage your lower abs to pull your hips toward the ceiling.',
      'Keep your legs straight as you slide your feet toward your hands.',
      'Slowly extend back out to a perfectly flat plank.',
      'Avoid dipping the lower back at the bottom of the movement.'
    ]
  },
  // MOBILITY
  {
    id: 'mo-1',
    name: "World's Greatest Stretch",
    category: 'Mobility',
    difficulty: 'Beginner',
    muscles: ['Hips', 'T-Spine', 'Ankles'],
    description: 'A comprehensive mobility drill that addresses tightness in the hips, thoracic spine, and ankles in one flow.',
    imageUrl: 'https://media.gq.com/photos/59a9a273dc3ba42b1cdca2e9/16:9/w_2560%2Cc_limit/2017-09_GQ-FITNESS-Stretching_3x2.jpg',
    instructions: [
      'Step into a deep lunge with your right foot forward.',
      'Place your left hand on the floor and right elbow to right instep.',
      'Rotate your right arm toward the ceiling, looking at your thumb.',
      'Return hand to floor and push hips back to stretch the front hamstring.',
      'Switch sides and repeat for 5 reps per side.'
    ]
  },
  // STRENGTH & CONDITIONING
  {
    id: 'sc-1',
    name: 'Barbell Back Squat',
    category: 'Strength & Conditioning',
    difficulty: 'Intermediate',
    muscles: ['Quads', 'Glutes', 'Lower Back'],
    description: 'The foundation of lower body strength, essential for building raw power and athletic performance.',
    imageUrl: 'https://connect.healthkart.com/wp-content/uploads/2024/04/900X500-8.jpg',
    instructions: [
      'Rest the bar across your upper traps, not your neck.',
      'Stand with feet shoulder-width apart, toes slightly out.',
      'Inhale deeply and squat down by pushing hips back.',
      'Keep your chest up and spine neutral throughout.',
      'Drive through your mid-foot to stand back up to the top.'
    ]
  },
  {
    id: 'sc-2',
    name: 'Strict Pull-Up',
    category: 'Strength & Conditioning',
    difficulty: 'Intermediate',
    muscles: ['Lats', 'Biceps', 'Grip'],
    description: 'A gold-standard measurement of relative strength, targeting the entire back and pulling muscles.',
    imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800',
    instructions: [
      'Hang from a pull-up bar with an overhand grip.',
      'Pull your shoulder blades down and back.',
      'Pull yourself up until your chin is clearly over the bar.',
      'Lower yourself slowly to a full dead-hang position.',
      'Avoid using leg momentum or "kipping" for this version.'
    ]
  }
];

const Exercises: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filtered = EXERCISES.filter(ex =>
    ex.name.toLowerCase().includes(search.toLowerCase()) ||
    ex.category.toLowerCase().includes(search.toLowerCase()) ||
    ex.muscles.some(m => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-16 pb-32 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Sparkles className="w-3 h-3" />
            Interactive Guide
          </div>
          <h1 className="text-5xl md:text-8xl font-black text-slate-900 leading-[0.85] tracking-tighter uppercase italic">
            Exercise <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-slate-400">Mastery</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.3em] max-w-lg">
            Science-backed movement library for high-performance training across all disciplines.
          </p>
        </div>
        <div className="relative w-full md:w-[400px]">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search movement, category or muscle..."
            className="w-full pl-16 pr-8 py-5 bg-white border-2 border-slate-100 rounded-[28px] focus:border-indigo-600 outline-none font-bold text-slate-900 shadow-xl transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {filtered.map((ex, i) => (
          <div
            key={ex.id}
            className="group bg-white rounded-[48px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-3 transition-all cursor-pointer"
            style={{ animationDelay: `${i * 100}ms` }}
            onClick={() => setSelectedExercise(ex)}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={ex.imageUrl} alt={ex.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg">
                {ex.difficulty}
              </div>
              <div className="absolute bottom-6 left-6 flex gap-2">
                {ex.muscles.slice(0, 2).map(m => (
                  <span key={m} className="bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-md">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-10">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-2">{ex.name}</h3>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{ex.category}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl group-hover:bg-slate-900 group-hover:text-white transition-all shadow-inner">
                  <PlayCircle className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 font-medium italic">
                "{ex.description}"
              </p>
              <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between text-slate-900">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                  <Target className="w-4 h-4 text-indigo-600" />
                  View Drill
                </span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-fade-in" onClick={() => setSelectedExercise(null)}></div>
          <div className="relative bg-white w-full max-w-5xl max-h-[92vh] rounded-[64px] overflow-hidden shadow-2xl flex flex-col lg:flex-row animate-fade-in ring-1 ring-white/20">
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-8 right-8 z-20 p-4 bg-slate-900 text-white rounded-full hover:bg-indigo-600 transition-all shadow-2xl"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-full lg:w-5/12 relative h-80 lg:h-auto">
              <img src={selectedExercise.imageUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12 text-white">
                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {selectedExercise.difficulty}
                  </span>
                  <span className="bg-indigo-600/90 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl">
                    {selectedExercise.category}
                  </span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tighter mb-4 italic">{selectedExercise.name}</h2>
                <div className="flex gap-4">
                  {selectedExercise.muscles.map(m => (
                    <span key={m} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60"># {m}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex-1 p-10 md:p-20 overflow-y-auto bg-white">
              <div className="space-y-12">
                <section>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6">Philosophy</h4>
                  <p className="text-slate-800 text-2xl font-bold leading-snug tracking-tight">
                    {selectedExercise.description}
                  </p>
                </section>

                <section className="bg-slate-50 rounded-[48px] p-10 md:p-12 border border-slate-100 shadow-inner">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10">Step-by-Step Blueprint</h4>
                  <div className="space-y-8">
                    {selectedExercise.instructions.map((step, i) => (
                      <div key={i} className="flex gap-8 group/item">
                        <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xs font-black text-indigo-600 shadow-sm border border-slate-100 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all">
                          {i + 1}
                        </div>
                        <p className="text-slate-700 text-base md:text-lg font-bold leading-relaxed pt-1">{step}</p>
                      </div>
                    ))}
                  </div>
                </section>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-8 bg-slate-900 rounded-[32px] text-white">
                    <Clock className="w-8 h-8 text-indigo-400 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Pacing</p>
                    <p className="text-xl font-bold">Controlled Flow</p>
                  </div>
                  <div className="p-8 bg-white border-2 border-slate-100 rounded-[32px]">
                    <Award className="w-8 h-8 text-amber-500 mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Target</p>
                    <p className="text-xl font-bold">Perfect Form</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedExercise(null)}
                className="w-full mt-16 bg-slate-900 text-white py-8 rounded-[32px] font-black uppercase tracking-[0.3em] text-sm hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-4"
              >
                End Session Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercises;
