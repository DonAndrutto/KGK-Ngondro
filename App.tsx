
import React, { useState, useEffect, useRef } from 'react';
import { TABS_DATA } from './constants';
import { AppSettings, PrayerBlock as PrayerBlockData } from './types';
import BottomBar from './components/BottomBar';
import Header from './components/Header';
import PrayerBlock from './components/PrayerBlock';
import RepeatGroup from './components/RepeatGroup';
import { Sparkles, Scroll, ArrowUp } from 'lucide-react';

type TabKey = 'YOGA' | 'NGONDRO';

// How the auto-scroll behaves around repeated formulas
const REPEAT_PAUSE_MS = 4000;      // how long to rest on a repetition
const RESUME_RAMP_MS = 1500;       // ease back up to speed afterwards
const SLOWDOWN_ZONE_PX = 160;      // start decelerating this far before it
const PAUSE_LINE_RATIO = 0.38;     // viewport line at which a repetition "arrives"

type RenderItem =
  | { kind: 'block'; block: PrayerBlockData }
  | { kind: 'repeat'; id: string; blocks: PrayerBlockData[] };

// Chunk consecutive 'repeated' blocks into groups so they can share one frame
const groupBlocks = (blocks: PrayerBlockData[]): RenderItem[] => {
  const items: RenderItem[] = [];
  let current: PrayerBlockData[] | null = null;
  for (const block of blocks) {
    if (block.variant === 'repeated') {
      if (!current) {
        current = [];
        items.push({ kind: 'repeat', id: `repeat-${block.id}`, blocks: current });
      }
      current.push(block);
    } else {
      current = null;
      items.push({ kind: 'block', block });
    }
  }
  return items;
};

const App: React.FC = () => {
  // --- State ---
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('tibetan-app-settings');
    return saved ? JSON.parse(saved) : {
      fontSize: 16,
      isDarkMode: false,
      showPhonetics: true,
      showTranslation: true,
      showTibetan: true,
    };
  });

  const [activeTab, setActiveTab] = useState<TabKey>('YOGA');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // --- Tilt Scroll State ---
  const [isTiltScrolling, setIsTiltScrolling] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const tiltRef = useRef<number>(0);

  // --- Refs for Auto Scrolling ---
  const scrollIntervalRef = useRef<number | null>(null);
  const previousScrollY = useRef(0);
  const stuckFrames = useRef(0);

  // --- Repetition pause state ---
  const [pausedGroupId, setPausedGroupId] = useState<string | null>(null);
  const triggeredGroupsRef = useRef<Set<string>>(new Set());
  const pauseUntilRef = useRef(0);
  const activePauseRef = useRef<string | null>(null);
  // Sub-pixel movement carry: browsers round fractional scrollBy calls, so
  // slow speeds would otherwise stall entirely
  const scrollCarryRef = useRef(0);
  
  // --- Effects ---
  
  // 1. Persist settings
  useEffect(() => {
    localStorage.setItem('tibetan-app-settings', JSON.stringify(settings));
  }, [settings]);

  // 2. Handle Dark Mode
  useEffect(() => {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.isDarkMode]);

  // 3. Robust Auto Scrolling Logic
  useEffect(() => {
    const stopScrolling = () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    };

    if (isAutoScrolling) {
      previousScrollY.current = window.scrollY;
      stuckFrames.current = 0;
      pauseUntilRef.current = 0;
      scrollCarryRef.current = 0;

      // Repetitions already above the pause line shouldn't trigger a pause
      const seedLine = window.innerHeight * PAUSE_LINE_RATIO;
      triggeredGroupsRef.current = new Set();
      document.querySelectorAll<HTMLElement>('[data-repeat-id]').forEach((el) => {
        if (el.getBoundingClientRect().top <= seedLine) {
          triggeredGroupsRef.current.add(el.dataset.repeatId!);
        }
      });

      scrollIntervalRef.current = window.setInterval(() => {
        const now = Date.now();
        const currentScrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;
        const pauseLine = winHeight * PAUSE_LINE_RATIO;

        // Hold position while resting on a repeated formula
        if (now < pauseUntilRef.current) {
          previousScrollY.current = currentScrollY;
          stuckFrames.current = 0;
          return;
        }
        if (activePauseRef.current) {
          activePauseRef.current = null;
          setPausedGroupId(null);
        }

        // Look for repeated formulas: one arriving at the pause line, or the
        // distance to the next one coming up
        let approachDistance = Infinity;
        let arrivedId: string | null = null;
        document.querySelectorAll<HTMLElement>('[data-repeat-id]').forEach((el) => {
          const id = el.dataset.repeatId!;
          if (triggeredGroupsRef.current.has(id)) return;
          const rect = el.getBoundingClientRect();
          if (rect.top <= pauseLine) {
            triggeredGroupsRef.current.add(id);
            if (rect.bottom > pauseLine) arrivedId = id;
          } else {
            approachDistance = Math.min(approachDistance, rect.top - pauseLine);
          }
        });

        if (arrivedId) {
          pauseUntilRef.current = now + REPEAT_PAUSE_MS;
          activePauseRef.current = arrivedId;
          setPausedGroupId(arrivedId);
          return;
        }

        // Ease out when approaching a repetition, ease back in after the rest
        let speedFactor = 1;
        if (pauseUntilRef.current !== 0) {
          const sinceResume = now - pauseUntilRef.current;
          if (sinceResume < RESUME_RAMP_MS) {
            speedFactor = Math.max(0.1, sinceResume / RESUME_RAMP_MS);
          }
        }
        if (approachDistance < SLOWDOWN_ZONE_PX) {
          speedFactor = Math.min(speedFactor, Math.max(0.2, approachDistance / SLOWDOWN_ZONE_PX));
        }

        // Stuck Detection (skipped while deliberately moving slowly)
        if (speedFactor === 1) {
          if (Math.abs(currentScrollY - previousScrollY.current) < 0.1) {
            stuckFrames.current += 1;
          } else {
            stuckFrames.current = 0;
            previousScrollY.current = currentScrollY;
          }
        } else {
          stuckFrames.current = 0;
          previousScrollY.current = currentScrollY;
        }

        // Stop Condition (Stop if bottom reached OR stuck for ~0.5s)
        if ((currentScrollY + winHeight >= docHeight - 2) || (stuckFrames.current > 30 && currentScrollY > 0)) {
          setIsAutoScrolling(false);
          stopScrolling();
          return;
        }

        // Move Logic (accumulate fractions, scroll by whole pixels)
        scrollCarryRef.current += Math.max(0.4, scrollSpeed * 0.3) * speedFactor;
        const step = Math.floor(scrollCarryRef.current);
        if (step >= 1) {
          scrollCarryRef.current -= step;
          window.scrollBy({ top: step, behavior: 'auto' });
        }

      }, 16); // ~60fps
    } else {
      stopScrolling();
      activePauseRef.current = null;
      setPausedGroupId(null);
    }

    return stopScrolling;
  }, [isAutoScrolling, scrollSpeed]);

  // 4. Tilt Scrolling Logic
  useEffect(() => {
    let animationFrameId: number | null = null;
    let referenceBeta: number | null = null;
  
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null) return;
  
      // Set the initial angle as "zero" when we start
      if (referenceBeta === null) {
        referenceBeta = event.beta;
      }
  
      // Calculate how far we tilted from the start point
      const tilt = event.beta - referenceBeta;
      
      // Calculate speed: Non-linear curve for control
      // (Tilt / 8)^2 makes small tilts slow and big tilts fast
      const speed = Math.pow(Math.abs(tilt) / 8, 2) * -Math.sign(tilt) * (scrollSpeed * 0.5);
      
      tiltRef.current = speed; 
  
      if (!animationFrameId) {
        const loop = () => {
          if (Math.abs(tiltRef.current) > 0.1) {
            window.scrollBy({ top: tiltRef.current, behavior: 'auto' });
          }
          animationFrameId = requestAnimationFrame(loop);
        };
        loop();
      }
    };
  
    const startTilt = () => {
      referenceBeta = null;
      window.addEventListener('deviceorientation', handleOrientation);
    };
  
    const stopTilt = () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
  
    if (isTiltScrolling && permissionGranted) {
      startTilt();
      setIsAutoScrolling(false); // Disable standard auto-scroll if tilt is active
    } else {
      stopTilt();
    }
  
    return stopTilt;
  }, [isTiltScrolling, permissionGranted, scrollSpeed]);

  // 5. Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsAutoScrolling(false);
    setIsTiltScrolling(false);
  }, [activeTab]);

  // 6. Track scroll position for scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (activeTab === 'NGONDRO') {
        const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300;
        setShowScrollTop(isAtBottom);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // --- Handlers ---
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNavigation = (targetTab: string) => {
    setActiveTab(targetTab as TabKey);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTiltScroll = async () => {
    if (isTiltScrolling) {
      setIsTiltScrolling(false);
      return;
    }

    // Check permission for iOS 13+
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          setIsTiltScrolling(true);
        } else {
          alert('Permission to access device orientation was denied.');
        }
      } catch (error) {
        console.error("Error requesting permission:", error);
      }
    } else {
      // Non-iOS devices
      setPermissionGranted(true);
      setIsTiltScrolling(true);
    }
  };

  const tabs = [
    { key: 'YOGA', label: 'Yoga of Arising', icon: Sparkles },
    { key: 'NGONDRO', label: 'Ngöndro', icon: Scroll },
  ] as const;

  return (
    <div 
      className="min-h-screen flex flex-col font-sans selection:bg-monk-saffron/30 dark:selection:bg-monk-saffron/50 relative select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      
      {/* Header - Hidden in Full Screen */}
      {!isFullScreen && (
        <Header 
          settings={settings}
          updateSetting={updateSetting}
        />
      )}

      {/* Tab Navigation - Hidden in Full Screen */}
      {!isFullScreen && (
        <div className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-14 z-40 transition-colors duration-300 shadow-sm">
          <div className="max-w-4xl mx-auto flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center py-2 gap-2 text-xs md:text-base font-medium transition-colors relative ${
                    isActive 
                      ? 'text-monk-red dark:text-monk-saffron bg-parchment dark:bg-parchment-dark' 
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
                  }`}
                >
                  <Icon size={14} className={`md:w-[18px] md:h-[18px] ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                  <span>{tab.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-monk-red dark:bg-monk-saffron" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`flex-grow container mx-auto px-4 ${isFullScreen ? 'pt-8 pb-12' : 'py-4 md:py-8'} max-w-3xl`}>
        
        {/* Title Card - Only show when not in full screen */}
        {!isFullScreen && (
          <div className="text-center mb-4 md:mb-12 mt-2 md:mt-6">
            <h1 className="text-xl md:text-4xl font-serif font-bold text-stone-800 dark:text-stone-100 transition-colors duration-300">
              {tabs.find(t => t.key === activeTab)?.label}
            </h1>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-12 md:space-y-16 min-h-[50vh]">
          {TABS_DATA[activeTab].map((section) => (
            <section key={section.id} className="relative animate-fadeIn">
              
              {/* Section Header */}
              {!isFullScreen && (
                <div className="relative py-2 md:py-4 mb-4 md:mb-6 border-b-2 border-monk-saffron/20 dark:border-monk-saffron/10 transition-colors duration-300">
                  <h2 className="text-base md:text-2xl font-bold text-monk-red dark:text-monk-saffron font-serif text-center">
                    {section.title}
                  </h2>
                </div>
              )}
              
              {/* Full Screen Section Title */}
              {isFullScreen && section.title && (
                <div className="py-6 mb-4 text-center">
                   <h2 className="text-lg font-bold text-monk-red/50 dark:text-monk-saffron/50 font-serif">
                    {section.title}
                  </h2>
                </div>
              )}

              {/* Prayer Blocks */}
              <div className="space-y-6 px-1 md:px-8">
                {groupBlocks(section.blocks).map((item) =>
                  item.kind === 'repeat' ? (
                    <RepeatGroup
                      key={item.id}
                      groupId={item.id}
                      isPausedHere={pausedGroupId === item.id}
                    >
                      {item.blocks.map((block) => (
                        <PrayerBlock
                          key={block.id}
                          block={block}
                          settings={settings}
                          onNavigate={handleNavigation}
                        />
                      ))}
                    </RepeatGroup>
                  ) : (
                    <PrayerBlock
                      key={item.block.id}
                      block={item.block}
                      settings={settings}
                      onNavigate={handleNavigation}
                    />
                  )
                )}
              </div>

              {/* Decorative Section End */}
              <div className="flex justify-center mt-12 opacity-30 text-monk-red dark:text-stone-500">
                <span className="text-xl">❖</span>
              </div>

            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 py-8 border-t border-stone-200 dark:border-stone-800 text-center text-sm text-stone-400">
          <p>Dedicate the merit for the benefit of all sentient beings.</p>
          <div className="mt-4 text-xs text-stone-500">
            <p>Web design: Andrzej R. Rybszleger</p>
            <p>rybszlegerr@gmail.com</p>
          </div>
        </footer>

      </main>

      {/* New Floating Bottom Bar */}
      <BottomBar 
        isAutoScrolling={isAutoScrolling}
        toggleAutoScroll={() => setIsAutoScrolling(prev => !prev)}
        scrollSpeed={scrollSpeed}
        setScrollSpeed={setScrollSpeed}
        fontSize={settings.fontSize}
        setFontSize={(val) => updateSetting('fontSize', val)}
        isFullScreen={isFullScreen}
        toggleFullScreen={() => setIsFullScreen(!isFullScreen)}
        isDarkMode={settings.isDarkMode}
        toggleTheme={() => updateSetting('isDarkMode', !settings.isDarkMode)}
        isTiltScrolling={isTiltScrolling}
        toggleTiltScroll={toggleTiltScroll}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-24 right-4 md:right-8 bg-monk-red dark:bg-monk-saffron text-white dark:text-stone-900 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-fadeIn"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default App;
