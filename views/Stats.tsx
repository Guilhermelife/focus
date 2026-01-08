import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { UserStats } from '../types';
import { INITIAL_STATS } from '../constants';

export const Stats: React.FC = () => {
  return (
    <div className="p-6 pb-24 h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6">Estatísticas</h1>

      <div className="flex-1 flex flex-col gap-6">
        {/* Main Chart */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex-1 max-h-80">
          <h3 className="text-sm font-medium text-gray-400 mb-4">Tempo Economizado (min)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={INITIAL_STATS}>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                dy={10}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
              />
              <Bar dataKey="minutesSaved" radius={[4, 4, 4, 4]}>
                {INITIAL_STATS.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.minutesSaved > 100 ? '#6366F1' : '#4338ca'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insight Cards */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Total Hoje</p>
              <p className="text-2xl font-bold text-white mt-1">45 min</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400 font-bold">
              +5%
            </div>
          </div>
          
          <div className="bg-gray-900 border border-gray-800 p-5 rounded-xl flex items-center justify-between">
             <div>
              <p className="text-gray-400 text-xs uppercase font-bold tracking-wider">Tentativas de Acesso</p>
              <p className="text-2xl font-bold text-white mt-1">12</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 font-bold">
              -3
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-5 rounded-xl mt-auto">
          <p className="font-medium text-indigo-100">"A consistência é a chave para o sucesso."</p>
          <p className="text-xs text-indigo-300 mt-2">Continue assim!</p>
        </div>
      </div>
    </div>
  );
};
