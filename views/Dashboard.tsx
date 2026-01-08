import React from 'react';
import { ShieldCheck, ShieldAlert, Zap, Clock, Briefcase, Moon, Book, Sparkles } from 'lucide-react';
import { BlockSchedule, MockApp, AppView, Profile } from '../types';

interface DashboardProps {
  schedule: BlockSchedule;
  apps: MockApp[];
  profiles: Profile[];
  activeProfileId: string;
  isBlockingActive: boolean;
  onNavigate: (view: AppView) => void;
  onSwitchProfile: (profileId: string) => void;
}

const getProfileIcon = (iconName: string, isActive: boolean) => {
  const size = 22;
  const strokeWidth = isActive ? 2.5 : 2;
  const className = isActive ? "text-indigo-100" : "text-gray-400 group-hover:text-gray-300";
  
  switch (iconName) {
    case 'briefcase': return <Briefcase size={size} strokeWidth={strokeWidth} className={className} />;
    case 'moon': return <Moon size={size} strokeWidth={strokeWidth} className={className} />;
    case 'book': return <Book size={size} strokeWidth={strokeWidth} className={className} />;
    case 'zap': return <Zap size={size} strokeWidth={strokeWidth} className={className} />;
    default: return <Sparkles size={size} strokeWidth={strokeWidth} className={className} />;
  }
};

export const Dashboard: React.FC<DashboardProps> = ({ 
  schedule, 
  apps, 
  isBlockingActive, 
  onNavigate,
  profiles,
  activeProfileId,
  onSwitchProfile
}) => {
  const blockedCount = apps.filter(a => a.isBlocked).length;

  return (
    <div className="p-6 space-y-6 pb-24">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Olá, Usuário</h1>
          <p className="text-gray-400 text-sm">Seu foco é nossa prioridade.</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 shadow-sm">
          <span className="font-bold text-indigo-400">US</span>
        </div>
      </header>

      {/* Status Card */}
      <div className={`rounded-2xl p-6 border transition-all duration-500 relative overflow-hidden ${
        isBlockingActive 
          ? 'bg-indigo-900/40 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.15)]' 
          : 'bg-gray-900 border-gray-800'
      }`}>
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {isBlockingActive ? (
                <>
                  <ShieldCheck className="text-indigo-400" />
                  <span className="text-indigo-100">Modo Foco Ativo</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="text-gray-400" />
                  <span className="text-gray-300">Modo Foco Inativo</span>
                </>
              )}
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {isBlockingActive 
                ? `Bloqueio ativado até ${schedule.endTime}` 
                : `Próximo bloqueio às ${schedule.startTime}`}
            </p>
          </div>
          <div className={`p-3 rounded-full ${isBlockingActive ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-500'}`}>
            <Zap size={24} fill={isBlockingActive ? "currentColor" : "none"} />
          </div>
        </div>

        {isBlockingActive && (
          <div className="relative z-10 w-full bg-gray-800 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-indigo-500 h-1.5 rounded-full animate-progress w-full origin-left"></div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <Clock size={16} />
            <span className="text-xs font-medium uppercase">Tempo Salvo</span>
          </div>
          <p className="text-2xl font-bold text-white">2h 15m</p>
          <p className="text-xs text-green-400 mt-1">+12% hoje</p>
        </div>
        <div 
          onClick={() => onNavigate(AppView.APP_LIST)}
          className="bg-gray-900 border border-gray-800 p-4 rounded-xl active:scale-95 transition-transform cursor-pointer shadow-sm hover:border-gray-700"
        >
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <ShieldAlert size={16} />
            <span className="text-xs font-medium uppercase">Apps Bloqueados</span>
          </div>
          <p className="text-2xl font-bold text-white">{blockedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Toque para gerenciar</p>
        </div>
      </div>

      {/* Profiles */}
      <div>
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4 px-1">Perfis de Bloqueio</h3>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-1">
          {profiles.map((profile) => {
            const isActive = profile.id === activeProfileId;
            return (
              <button
                key={profile.id}
                onClick={() => onSwitchProfile(profile.id)}
                className={`group flex-shrink-0 px-5 py-4 rounded-xl font-medium border flex flex-col items-center gap-3 min-w-[110px] transition-all duration-300 ${
                  isActive 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/30 scale-105' 
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:bg-gray-800 hover:border-gray-700 active:scale-95'
                }`}
              >
                <div className={`p-2 rounded-full transition-colors ${isActive ? 'bg-indigo-500' : 'bg-gray-800 group-hover:bg-gray-700'}`}>
                   {getProfileIcon(profile.icon, isActive)}
                </div>
                <span className={`text-sm ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}>
                  {profile.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};