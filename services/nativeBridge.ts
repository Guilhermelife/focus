import { MOCK_APPS } from '../constants';
import { MockApp } from '../types';

export interface NativePermissions {
  usage: boolean;
  overlay: boolean;
  accessibility: boolean;
}

// Global declaration for the Android Interface injected via WebView
declare global {
  interface Window {
    Android?: {
      getInstalledApps: () => string; // Returns JSON string
      checkPermissions: () => string; // Returns JSON string
      requestPermission: (type: string) => boolean;
      showToast: (message: string) => void;
      blockApp: (packageName: string) => void;
      unblockApp: (packageName: string) => void;
    }
  }
}

export interface NativeInterface {
  getInstalledApps: () => Promise<MockApp[]>;
  checkPermissions: () => Promise<NativePermissions>;
  requestPermission: (type: keyof NativePermissions) => Promise<boolean>;
}

// Helper to assign random UI properties to real Android apps
const normalizeAndroidApps = (rawApps: any[]): MockApp[] => {
  const categories = ['Social', 'Game', 'Entertainment', 'Productivity'] as const;
  const colors = [
    'bg-gradient-to-tr from-yellow-400 to-purple-600',
    'bg-black border border-gray-700',
    'bg-green-500',
    'bg-red-600',
    'bg-blue-500',
    'bg-gray-800'
  ];

  return rawApps.map((app, index) => {
    // Determine category based on keywords or random
    let category: any = 'Productivity';
    const nameLower = app.name.toLowerCase();
    const pkgLower = app.id.toLowerCase();
    
    if (nameLower.includes('gram') || nameLower.includes('book') || nameLower.includes('twitter') || nameLower.includes('social')) category = 'Social';
    else if (nameLower.includes('game') || pkgLower.includes('game') || nameLower.includes('crush')) category = 'Game';
    else if (nameLower.includes('tube') || nameLower.includes('flix') || nameLower.includes('video')) category = 'Entertainment';
    else {
      // If no keyword match, deterministic random based on string length
      category = categories[nameLower.length % categories.length];
    }

    return {
      id: app.id,
      name: app.name,
      category: category,
      iconColor: colors[index % colors.length], // Assign colors in rotation
      isBlocked: false // Default state, will be merged with profile later
    };
  });
};

const webBridge: NativeInterface = {
  getInstalledApps: async () => {
    // 1. Try Real Android Interface
    if (window.Android && window.Android.getInstalledApps) {
      try {
        const jsonString = window.Android.getInstalledApps();
        const rawApps = JSON.parse(jsonString);
        return normalizeAndroidApps(rawApps);
      } catch (e) {
        console.error("Failed to parse apps from Android", e);
        return MOCK_APPS;
      }
    }

    // 2. Fallback to Web Simulation
    await new Promise(r => setTimeout(r, 800));
    return MOCK_APPS;
  },

  checkPermissions: async () => {
    // 1. Try Real Android Interface
    if (window.Android && window.Android.checkPermissions) {
      try {
        const jsonString = window.Android.checkPermissions();
        return JSON.parse(jsonString);
      } catch (e) {
        console.error("Failed to check permissions from Android", e);
      }
    }

    // 2. Fallback to Web Simulation
    const p = localStorage.getItem('focusGuard_permissions');
    return p ? JSON.parse(p) : { usage: false, overlay: false, accessibility: false };
  },

  requestPermission: async (type) => {
    // 1. Try Real Android Interface
    if (window.Android && window.Android.requestPermission) {
      // In Android, requestPermission usually triggers an Intent and returns immediately.
      return window.Android.requestPermission(type);
    }

    // 2. Fallback to Web Simulation
    console.log(`Requesting native permission: ${type}`);
    
    const currentStr = localStorage.getItem('focusGuard_permissions');
    const current = currentStr ? JSON.parse(currentStr) : { usage: false, overlay: false, accessibility: false };
    
    current[type] = true;
    localStorage.setItem('focusGuard_permissions', JSON.stringify(current));
    
    await new Promise(r => setTimeout(r, 1000));
    return true;
  }
};

export const nativeBridge = webBridge;