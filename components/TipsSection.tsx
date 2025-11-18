import React from 'react';
import { Info, CheckCircle } from './Icons';

interface TipsSectionProps {
  tips: {
    posture: string;
    readingMusic: string;
    handPosition: string;
  };
}

const TipsSection: React.FC<TipsSectionProps> = ({ tips }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-piano-accent/50 transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Info size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg">Posture</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{tips.posture}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-piano-accent/50 transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
            <Info size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg">Reading Music</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{tips.readingMusic}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-piano-accent/50 transition-colors">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <Info size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg">Hand Position</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{tips.handPosition}</p>
      </div>
    </div>
  );
};

export default TipsSection;