import React from 'react';
import { Lock, Unlock, Clock, AlertTriangle, Power, Layers } from 'lucide-react';
import { MockApp, BlockSchedule } from '../types';

interface AppListProps {
  apps: MockApp[];
  schedule: BlockSchedule;
  toggleAppBlock: (id: string) => void;
  toggleCategoryBlock: (category: string) => void;
  updateSchedule: (key: keyof BlockSchedule, value: any) => void;
  launchApp: (app: MockApp) => void;
}

export const AppList: React.FC<AppListProps> = ({ 
  apps, 
  schedule, 
  toggleAppBlock, 
  toggleCategoryBlock,
  updateSchedule, 
  launchApp 
}) => {
  // Extract unique categories
  const categories = Array.from(new Set(apps.map(app => app.category)));

  return (
    <div className="pb-24 pt-6 px-4">
      <h2 className="text-xl font-bold mb-6 px-2">Configuração de Bloqueio</h2>

      {/* Schedule Config */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        
        {/* Active Toggle */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <Power size={20} className={schedule.isActive ? "text-indigo-400" : "text-gray-500"} />
            <div>
              <p className="text-sm font-medium text-gray-200">Ativar Agendamento</p>
              <p className="text-[10px] text-gray-500">{schedule.isActive ? 'Bloqueio automático ativado' : 'Bloqueio pausado'}</p>
            </div>
          </div>
          <button 
            onClick={() => updateSchedule('isActive', !schedule.isActive)}
            className={`w-12 h-6 rounded-full transition-colors relative ${schedule.isActive ? 'bg-indigo-500' : 'bg-gray-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${schedule.isActive ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className={`transition-opacity duration-300 ${schedule.isActive ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <Clock size={16} /> Horário de Funcionamento
          </h3>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Início</label>
              <input 
                type="time" 
                value={schedule.startTime}
                onChange={(e) => updateSchedule('startTime', e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg p-3 text-center text-lg font-mono border border-gray-700 focus:border-indigo-500 outline-none"
              />
            </div>
            <div className="text-gray-600 font-bold">-</div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Fim</label>
              <input 
                type="time" 
                value={schedule.endTime}
                onChange={(e) => updateSchedule('endTime', e.target.value)}
                className="w-full bg-gray-800 text-white rounded-lg p-3 text-center text-lg font-mono border border-gray-700 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-800">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className={schedule.strictMode ? "text-red-500" : "text-gray-500"} />
              <div>
                <p className="text-sm font-medium text-gray-200">Modo Rígido</p>
                <p className="text-[10px] text-gray-500">Impede desbloqueio manual</p>
              </div>
            </div>
            <button 
              onClick={() => updateSchedule('strictMode', !schedule.strictMode)}
              className={`w-12 h-6 rounded-full transition-colors relative ${schedule.strictMode ? 'bg-red-500' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${schedule.strictMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Category Bulk Actions */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
          <Layers size={14} /> Categorias
        </h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-1">
          {categories.map(category => {
            const appsInCat = apps.filter(a => a.category === category);
            const isFullBlocked = appsInCat.every(a => a.isBlocked);
            
            return (
              <button
                key={category}
                onClick={() => toggleCategoryBlock(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap border ${
                  isFullBlocked 
                    ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20' 
                    : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                }`}
              >
                {isFullBlocked ? <Lock size={12} /> : <Unlock size={12} />}
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* App List */}
      <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3 px-2">Apps Instalados</h3>
      <div className="space-y-2">
        {apps.map((app) => (
          <div key={app.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors">
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => launchApp(app)} // Simulating opening the app
            >
              <div className={`w-10 h-10 rounded-lg ${app.iconColor} flex items-center justify-center shadow-lg`}>
                <span className="text-xs font-bold text-white opacity-80">{app.name.substring(0,2)}</span>
              </div>
              <div>
                <p className="font-medium text-gray-200">{app.name}</p>
                <p className="text-xs text-gray-500">{app.category}</p>
              </div>
            </div>
            
            <button 
              onClick={() => toggleAppBlock(app.id)}
              className={`p-2 rounded-full transition-all ${
                app.isBlocked 
                  ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
                  : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              }`}
            >
              {app.isBlocked ? <Lock size={20} /> : <Unlock size={20} />}
            </button>
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-gray-600 mt-6">
        Toque no ícone/nome para "abrir" e testar o bloqueio.
      </p>
    </div>
  );
};