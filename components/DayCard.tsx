import React, { useState } from 'react';
import { Clock, Music, BookOpen, CheckCircle, ChevronDown, ChevronRight } from './Icons';
import { DayPlan } from '../types';

interface DayCardProps {
  day: DayPlan;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

const DayCard: React.FC<DayCardProps> = ({ day, isCompleted, onToggleComplete }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`mb-4 rounded-xl border transition-all duration-300 ${isCompleted ? 'bg-gray-50 border-gray-200 opacity-75' : 'bg-white border-gray-200 shadow-sm hover:shadow-md'}`}>
      
      {/* Header - Always Visible */}
      <div 
        className="p-5 cursor-pointer flex items-center justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold font-serif text-lg ${isCompleted ? 'bg-gray-200 text-gray-500' : 'bg-piano-black text-piano-accent'}`}>
            {day.dayNumber}
          </div>
          <div>
            <h3 className={`font-semibold text-lg ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
              {day.title}
            </h3>
            <div className="flex items-center text-xs text-gray-500 gap-3 mt-1">
              <span className="flex items-center gap-1"><Clock size={12} /> {day.timeEstimate}</span>
              {day.songs && day.songs.length > 0 && (
                <span className="flex items-center gap-1"><Music size={12} /> Song Practice</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete();
            }}
            className={`p-2 rounded-full transition-colors ${isCompleted ? 'text-green-600 bg-green-50' : 'text-gray-300 hover:text-green-500 hover:bg-green-50'}`}
          >
            <CheckCircle size={24} fill={isCompleted ? "currentColor" : "none"} />
          </button>
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} text-gray-400`}>
            <ChevronDown size={20} />
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="px-5 pb-6 border-t border-gray-100 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Practice Routine */}
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Clock size={14} /> Daily Routine
              </h4>
              <ul className="space-y-2">
                {day.practiceRoutine.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-piano-accent rounded-full flex-shrink-0"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Exercises & Theory */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BookOpen size={14} /> Exercises & Theory
                </h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 font-medium mb-1">Focus: {day.theoryFocus}</p>
                  <ul className="list-disc list-inside text-xs text-gray-600 ml-1">
                    {day.exercises.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {day.songs && day.songs.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Music size={14} /> Repertoire
                  </h4>
                   <div className="flex flex-wrap gap-2">
                    {day.songs.map((song, idx) => (
                      <span key={idx} className="px-3 py-1 bg-piano-black text-piano-white text-xs rounded-full">
                        {song}
                      </span>
                    ))}
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayCard;