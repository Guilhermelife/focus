
import React, { useState } from 'react';
import { Shield, Layers, Smartphone, Check, ArrowRight, Settings } from 'lucide-react';
import { nativeBridge, NativePermissions } from '../services/nativeBridge';
import { AppView } from '../types';

interface OnboardingProps {
  onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<NativePermissions>({
    usage: false,
    overlay: false,
    accessibility: false
  });

  const handleRequest = async (type: keyof NativePermissions) => {
    setLoading(true);
    await nativeBridge.requestPermission(type);
    setPermissions(prev => ({ ...prev, [type]: true }));
    setLoading(false);
    
    // Auto advance if not last step
    if (step < 3) {
      setTimeout(() => setStep(s => s + 1), 500);
    }
  };

  const steps = [
    {
      title: "Bem-vindo ao FocusGuard",
      desc: "Para funcionar corretamente e ajudar você a manter o foco, precisamos de algumas permissões do Android.",
      icon: <Shield size={64} className="text-indigo-500" />,
      action: null,
      buttonText: "Começar Configuração"
    },
    {
      title: "Acesso de Uso",
      desc: "Necessário para detectar qual aplicativo está aberto e contar seu tempo de uso.",
      icon: <Smartphone size={64} className="text-blue-500" />,
      permType: 'usage' as const,
      buttonText: "Permitir Acesso de Uso"
    },
    {
      title: "Sobreposição de Tela",
      desc: "Permite que o FocusGuard exiba a tela de bloqueio sobre os apps que você quer evitar.",
      icon: <Layers size={64} className="text-purple-500" />,
      permType: 'overlay' as const,
      buttonText: "Permitir Sobreposição"
    },
    {
      title: "Acessibilidade",
      desc: "O recurso mais importante. Permite bloqueio instantâneo e proteção contra desinstalação.",
      icon: <Settings size={64} className="text-red-500" />,
      permType: 'accessibility' as const,
      buttonText: "Ativar Acessibilidade"
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="h-full flex flex-col p-8 bg-gray-950 text-white justify-between animate-in fade-in duration-500">
      
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-indigo-500' : 'bg-gray-800'}`} 
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center text-center justify-center">
        <div className="w-32 h-32 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          {currentStep.icon}
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{currentStep.title}</h1>
        <p className="text-gray-400 leading-relaxed max-w-xs mx-auto">
          {currentStep.desc}
        </p>

        {currentStep.permType && permissions[currentStep.permType] && (
          <div className="mt-6 flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full text-sm font-bold">
            <Check size={16} />
            <span>Permissão Concedida</span>
          </div>
        )}
      </div>

      <div className="mt-8">
        {step === 0 ? (
          <button 
            onClick={() => setStep(1)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            Começar <ArrowRight size={20} />
          </button>
        ) : step < 3 ? (
          <button 
            onClick={() => currentStep.permType && handleRequest(currentStep.permType)}
            disabled={loading || (currentStep.permType ? permissions[currentStep.permType] : false)}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${
               loading || (currentStep.permType && permissions[currentStep.permType])
                 ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                 : 'bg-white text-gray-900 hover:bg-gray-200'
            }`}
          >
            {loading ? "Verificando..." : currentStep.buttonText}
          </button>
        ) : (
          <button 
            onClick={async () => {
              if (!permissions.accessibility) {
                await handleRequest('accessibility');
              }
              onComplete();
            }}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-green-900/20"
          >
            Concluir Configuração <Check size={20} />
          </button>
        )}
        
        {step > 0 && (
          <button 
            onClick={onComplete}
            className="w-full text-center text-gray-600 text-xs mt-4 py-2 hover:text-gray-400"
          >
            Pular (Modo Demo)
          </button>
        )}
      </div>
    </div>
  );
};
