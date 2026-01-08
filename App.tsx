import React, { useState, useEffect } from 'react';
import { Dashboard } from './views/Dashboard';
import { AppList } from './views/AppList';
import { Stats } from './views/Stats';
import { Onboarding } from './views/Onboarding';
import { BottomNav } from './components/BottomNav';
import { LockedOverlay } from './views/LockedOverlay';
import { AppView, BlockSchedule, MockApp, Profile } from './types';
import { DEFAULT_PROFILES } from './constants';
import { isTimeInRange } from './services/timeService';
import { nativeBridge } from './services/nativeBridge';

function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Initialize Profiles
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('focusGuard_profiles');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing saved profiles", e);
        }
      }
    }
    return DEFAULT_PROFILES;
  });

  // 2. Initialize Active Profile ID
  const [activeProfileId, setActiveProfileId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('focusGuard_activeProfileId');
      if (saved) return saved;
    }
    return DEFAULT_PROFILES[0].id; // Default to first profile (Work)
  });

  // 3. State for Apps (loaded from Native Bridge)
  const [apps, setApps] = useState<MockApp[]>([]);
  
  // Helper to get initial schedule based on profile
  const getScheduleForProfile = (profileId: string, allProfiles: Profile[]): BlockSchedule => {
    const profile = allProfiles.find(p => p.id === profileId) || allProfiles[0];
    return profile.schedule;
  };

  const [schedule, setSchedule] = useState<BlockSchedule>(() => getScheduleForProfile(activeProfileId, profiles));
  const [attemptedApp, setAttemptedApp] = useState<MockApp | null>(null);
  const [isBlockingActive, setIsBlockingActive] = useState(false);

  // INITIALIZATION EFFECT: Check permissions and Load Apps
  useEffect(() => {
    const initApp = async () => {
      // 1. Check Permissions
      const perms = await nativeBridge.checkPermissions();
      
      if (!perms.usage || !perms.overlay || !perms.accessibility) {
        setCurrentView(AppView.ONBOARDING);
      }

      // 2. Load Installed Apps
      const installedApps = await nativeBridge.getInstalledApps();
      
      // Apply block status from current profile to installed apps
      const currentProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];
      const mergedApps = installedApps.map(app => ({
        ...app,
        isBlocked: currentProfile.blockedAppIds.includes(app.id)
      }));

      setApps(mergedApps);
      setIsLoading(false);
    };

    initApp();
  }, []);

  // Persistence: Save Profiles List and Active ID
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('focusGuard_profiles', JSON.stringify(profiles));
    }
  }, [profiles, isLoading]);

  useEffect(() => {
    localStorage.setItem('focusGuard_activeProfileId', activeProfileId);
  }, [activeProfileId]);

  // SYNC: Update the current profile in the profiles list whenever apps or schedule change
  useEffect(() => {
    if (isLoading) return;
    
    setProfiles(prevProfiles => {
      return prevProfiles.map(p => {
        if (p.id === activeProfileId) {
          const blockedIds = apps.filter(a => a.isBlocked).map(a => a.id);
          return {
            ...p,
            schedule: schedule,
            blockedAppIds: blockedIds
          };
        }
        return p;
      });
    });
  }, [apps, schedule, activeProfileId, isLoading]);

  // CRITICAL: Send blocked list to Android Native Service
  useEffect(() => {
    if (isLoading) return;

    if (isBlockingActive) {
      // Send the list of IDs (package names) that are currently blocked
      const blockedPackageNames = apps
        .filter(app => app.isBlocked)
        .map(app => app.id);
      nativeBridge.updateBlockedPackages(blockedPackageNames);
    } else {
      // Clear the block list in native side
      nativeBridge.updateBlockedPackages([]);
    }
  }, [isBlockingActive, apps, isLoading]);

  // Handle Native Block Event (Called from Java)
  useEffect(() => {
    window.handleNativeBlock = (packageName: string, appName: string) => {
      // Find the app in our list or create a temp one
      const foundApp = apps.find(a => a.id === packageName) || {
        id: packageName,
        name: appName || packageName,
        category: 'Entertainment',
        iconColor: 'bg-red-600',
        isBlocked: true
      };
      
      setAttemptedApp(foundApp);
      setCurrentView(AppView.LOCKED_OVERLAY);
    };

    return () => {
      window.handleNativeBlock = undefined;
    };
  }, [apps]);

  // Time Check
  useEffect(() => {
    const checkTime = () => {
      const active = schedule.isActive && isTimeInRange(schedule.startTime, schedule.endTime);
      setIsBlockingActive(active);
    };

    checkTime();
    const interval = setInterval(checkTime, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [schedule]);

  // Handlers
  const toggleAppBlock = (id: string) => {
    setApps(prev => prev.map(app => 
      app.id === id ? { ...app, isBlocked: !app.isBlocked } : app
    ));
  };

  const toggleCategoryBlock = (category: string) => {
    setApps(prev => {
      const appsInCategory = prev.filter(a => a.category === category);
      const allBlocked = appsInCategory.every(a => a.isBlocked);
      const shouldBlock = !allBlocked;

      return prev.map(app => 
        app.category === category ? { ...app, isBlocked: shouldBlock } : app
      );
    });
  };

  const updateSchedule = (key: keyof BlockSchedule, value: any) => {
    setSchedule(prev => ({ ...prev, [key]: value }));
  };

  const handleSwitchProfile = (profileId: string) => {
    setActiveProfileId(profileId);
    // Find profile
    const profile = profiles.find(p => p.id === profileId) || profiles[0];
    
    // Update Schedule
    setSchedule(profile.schedule);
    
    // Update App Block Status based on Profile's ID list
    setApps(prevApps => prevApps.map(app => ({
      ...app,
      isBlocked: profile.blockedAppIds.includes(app.id)
    })));
  };

  const launchApp = (app: MockApp) => {
    if (app.isBlocked && isBlockingActive) {
      setAttemptedApp(app);
      setCurrentView(AppView.LOCKED_OVERLAY);
    } else {
      console.log(`Open ${app.name}`);
    }
  };

  const handleOnboardingComplete = () => {
    setCurrentView(AppView.DASHBOARD);
  };

  if (isLoading) {
    return (
      <div className="bg-gray-950 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case AppView.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            schedule={schedule} 
            apps={apps} 
            isBlockingActive={isBlockingActive} 
            onNavigate={setCurrentView}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSwitchProfile={handleSwitchProfile}
          />
        );
      case AppView.APP_LIST:
        return (
          <AppList 
            apps={apps} 
            schedule={schedule} 
            toggleAppBlock={toggleAppBlock}
            toggleCategoryBlock={toggleCategoryBlock}
            updateSchedule={updateSchedule}
            launchApp={launchApp}
          />
        );
      case AppView.STATS:
        return <Stats />;
      case AppView.LOCKED_OVERLAY:
        return (
          <LockedOverlay 
            app={attemptedApp} 
            schedule={schedule} 
            strictMode={schedule.strictMode}
            onExit={() => {
              setAttemptedApp(null);
              setCurrentView(AppView.DASHBOARD);
            }} 
          />
        );
      default:
        return (
          <Dashboard 
            schedule={schedule} 
            apps={apps} 
            isBlockingActive={isBlockingActive} 
            onNavigate={setCurrentView}
            profiles={profiles}
            activeProfileId={activeProfileId}
            onSwitchProfile={handleSwitchProfile}
          />
        );
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen text-white font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-900">
      <div className="h-full overflow-y-auto no-scrollbar">
        {renderView()}
      </div>
      
      {currentView !== AppView.LOCKED_OVERLAY && currentView !== AppView.ONBOARDING && (
        <BottomNav currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
}

export default App;