import { MockApp, UserStats, Profile } from './types';

export const MOCK_APPS: MockApp[] = [
  { id: '1', name: 'Instagram', category: 'Social', iconColor: 'bg-gradient-to-tr from-yellow-400 to-purple-600', isBlocked: false },
  { id: '2', name: 'TikTok', category: 'Entertainment', iconColor: 'bg-black border border-gray-700', isBlocked: false },
  { id: '3', name: 'WhatsApp', category: 'Social', iconColor: 'bg-green-500', isBlocked: false },
  { id: '4', name: 'YouTube', category: 'Entertainment', iconColor: 'bg-red-600', isBlocked: false },
  { id: '5', name: 'Clash Royale', category: 'Game', iconColor: 'bg-blue-500', isBlocked: false },
  { id: '6', name: 'Twitter / X', category: 'Social', iconColor: 'bg-gray-800', isBlocked: false },
  { id: '7', name: 'Netflix', category: 'Entertainment', iconColor: 'bg-red-700', isBlocked: false },
  { id: '8', name: 'Snapchat', category: 'Social', iconColor: 'bg-yellow-300', isBlocked: false },
];

export const MOTIVATIONAL_QUOTES = [
  "A disciplina é a ponte entre metas e realizações.",
  "Concentre-se no ser produtivo em vez de ocupado.",
  "O futuro depende do que você faz hoje.",
  "Você não precisa de mais tempo, precisa de mais foco.",
  "Desconecte para reconectar com o que importa.",
  "Não troque o que você mais quer pelo que você quer agora."
];

export const INITIAL_STATS: UserStats[] = [
  { date: 'Seg', minutesSaved: 45, attempts: 12 },
  { date: 'Ter', minutesSaved: 120, attempts: 5 },
  { date: 'Qua', minutesSaved: 90, attempts: 8 },
  { date: 'Qui', minutesSaved: 60, attempts: 15 },
  { date: 'Sex', minutesSaved: 30, attempts: 20 },
  { date: 'Sáb', minutesSaved: 180, attempts: 2 },
  { date: 'Dom', minutesSaved: 200, attempts: 1 },
];

export const DEFAULT_PROFILES: Profile[] = [
  {
    id: 'work',
    name: 'Trabalho',
    icon: 'briefcase',
    schedule: {
      id: 'work',
      name: 'Horário Comercial',
      startTime: '09:00',
      endTime: '18:00',
      days: [1, 2, 3, 4, 5],
      isActive: true,
      strictMode: true
    },
    blockedAppIds: ['1', '2', '5', '7', '8'] // Instagram, TikTok, Games, Netflix, Snapchat
  },
  {
    id: 'sleep',
    name: 'Sono',
    icon: 'moon',
    schedule: {
      id: 'sleep',
      name: 'Hora de Dormir',
      startTime: '22:00',
      endTime: '07:00',
      days: [0, 1, 2, 3, 4, 5, 6],
      isActive: true,
      strictMode: true
    },
    blockedAppIds: ['1', '2', '3', '4', '5', '6', '7', '8'] // All blocked
  },
  {
    id: 'study',
    name: 'Estudo',
    icon: 'book',
    schedule: {
      id: 'study',
      name: 'Sessão de Foco',
      startTime: '14:00',
      endTime: '16:00',
      days: [1, 3, 5],
      isActive: true,
      strictMode: false
    },
    blockedAppIds: ['1', '2', '4', '5'] // Social + Video + Games
  }
];