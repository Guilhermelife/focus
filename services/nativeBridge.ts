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

const webBridge: NativeInterface = {
  getInstalledApps: async () => {
    // 1. Try Real Android Interface
    if (window.Android && window.Android.getInstalledApps) {
      try {
        const jsonString = window.Android.getInstalledApps();
        const apps = JSON.parse(jsonString);
        return apps;
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
      // The app resumes later. Here we assume the Android method returns true if intent launched successfully.
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