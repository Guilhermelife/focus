import React from 'react';
import { LayoutDashboard, ShieldAlert, BarChart3, Settings } from 'lucide-react';
import { AppView } from '../types';

interface BottomNavProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Início' },
    { view: AppView.APP_LIST, icon: ShieldAlert, label: 'Bloqueios' },
    { view: AppView.STATS, icon: BarChart3, label: 'Stats' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 pb-safe z-40">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setView(item.view)}
            className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
              currentView === item.view ? 'text-indigo-400' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <item.icon size={24} strokeWidth={currentView === item.view ? 2.5 : 2} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
