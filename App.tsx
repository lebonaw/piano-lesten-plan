import React, { useState, useEffect } from 'react';
import { generateLessonPlan } from './services/gemini';
import { PianoCourse, AppState, WeekPlan } from './types';
import { Sparkles, Loader2, Music, PlayCircle } from './components/Icons';
import DayCard from './components/DayCard';
import TipsSection from './components/TipsSection';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.IDLE);
  const [course, setCourse] = useState<PianoCourse | null>(null);
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  const handleGenerate = async () => {
    setState(AppState.GENERATING);
    try {
      const plan = await generateLessonPlan();
      setCourse(plan);
      setState(AppState.VIEWING);
    } catch (error) {
      console.error(error);
      setState(AppState.ERROR);
    }
  };

  const toggleDayCompletion = (weekNum: number, dayNum: number) => {
    const key = `w${weekNum}d${dayNum}`;
    setCompletedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const getProgress = () => {
    if (!course) return 0;
    const totalDays = course.weeks.reduce((acc, week) => acc + week.days.length, 0);
    const completed = completedDays.size;
    return Math.round((completed / totalDays) * 100);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-piano-black font-sans">
      
      {/* Navigation / Header */}
      <nav className="bg-piano-black text-white p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-piano-accent rounded flex items-center justify-center text-piano-black">
              <Music size={20} />
            </div>
            <span className="font-serif font-bold text-xl tracking-wide">Maestro AI</span>
          </div>
          {state === AppState.VIEWING && (
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-400 hidden sm:inline">Progress</span>
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-piano-accent transition-all duration-500 ease-out"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <span className="text-piano-accent font-bold">{getProgress()}%</span>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        
        {/* IDLE STATE */}
        {state === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-fade-in">
            <div className="w-24 h-24 bg-piano-black rounded-full flex items-center justify-center mb-4 shadow-xl">
              <Sparkles size={40} className="text-piano-accent" />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900">
              Begin Your Piano Journey
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl">
              Generate a custom 4-week curriculum designed specifically for absolute beginners. 
              Master the basics with daily routines, exercises, and songs.
            </p>
            <button 
              onClick={handleGenerate}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-piano-black text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Sparkles size={20} />
              Generate My 4-Week Plan
            </button>
            <p className="text-sm text-gray-400 mt-4">Powered by Gemini 2.5 Flash</p>
          </div>
        )}

        {/* LOADING STATE */}
        {state === AppState.GENERATING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <Loader2 size={48} className="text-piano-accent animate-spin" />
            <h2 className="text-2xl font-serif font-bold">Composing your curriculum...</h2>
            <p className="text-gray-500">Analyzing learning patterns and selecting beginner repertoire.</p>
          </div>
        )}

        {/* ERROR STATE */}
        {state === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
            <div className="text-red-500 text-6xl">!</div>
            <h2 className="text-2xl font-bold text-gray-800">Something went off-key.</h2>
            <p className="text-gray-600">We couldn't generate the plan right now. Please try again.</p>
            <button 
              onClick={handleGenerate}
              className="px-6 py-2 bg-piano-black text-white rounded-lg hover:bg-gray-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* VIEWING STATE */}
        {state === AppState.VIEWING && course && (
          <div className="animate-fade-in-up">
            {/* Course Header */}
            <header className="mb-10 text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">{course.title}</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">{course.description}</p>
            </header>

            {/* Tips Section */}
            <TipsSection tips={course.tips} />

            {/* Weekly Navigation */}
            <div className="flex overflow-x-auto gap-2 mb-8 pb-2 justify-start md:justify-center border-b border-gray-200">
              {course.weeks.map((week) => (
                <button
                  key={week.weekNumber}
                  onClick={() => setActiveWeek(week.weekNumber)}
                  className={`px-6 py-3 rounded-t-lg font-medium text-sm transition-colors whitespace-nowrap relative
                    ${activeWeek === week.weekNumber 
                      ? 'text-piano-black bg-white border-t border-x border-gray-200' 
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                    }
                  `}
                >
                  Week {week.weekNumber}
                  {activeWeek === week.weekNumber && (
                    <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-white z-10"></span>
                  )}
                </button>
              ))}
            </div>

            {/* Weekly Content */}
            {course.weeks.map((week) => (
              <div 
                key={week.weekNumber}
                className={activeWeek === week.weekNumber ? 'block' : 'hidden'}
              >
                <div className="mb-8 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="text-piano-accent uppercase tracking-wider text-sm font-bold mb-1">Week {week.weekNumber} Theme</h2>
                      <h3 className="text-2xl font-serif font-bold">{week.theme}</h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/10">
                      <span className="text-gray-300 text-sm block">Weekly Goal</span>
                      <span className="font-medium">{week.goal}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {week.days.map((day) => (
                    <DayCard 
                      key={day.dayNumber}
                      day={day}
                      isCompleted={completedDays.has(`w${week.weekNumber}d${day.dayNumber}`)}
                      onToggleComplete={() => toggleDayCompletion(week.weekNumber, day.dayNumber)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default App;