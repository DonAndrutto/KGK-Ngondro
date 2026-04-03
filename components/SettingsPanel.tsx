import React from 'react';
import { AppSettings } from '../types';
import { Type, Moon, Sun, Play, Pause, Plus, Minus, Heart, Maximize } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  isAutoScrolling: boolean;
  scrollSpeed: number;
  toggleAutoScroll: () => void;
  increaseSpeed: () => void;
  decreaseSpeed: () => void;
  toggleFullScreen: () => void;
}

const DonateButton = () => (
  <a
    href="https://www.paypal.com/donate/?business=JZS5LVZKPPY5J&no_recurring=0&item_name=Help+fund+Dharma+translation+projects.&currency_code=USD"
    target="_blank"
    rel="noopener noreferrer"
    className="group relative p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-monk-red transition-colors"
    aria-label="Donate"
  >
    <Heart size={16} />
    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 text-xs text-white bg-stone-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
      Donate
    </span>
  </a>
);

const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  settings, 
  updateSetting,
  isAutoScrolling,
  scrollSpeed,
  toggleAutoScroll,
  increaseSpeed,
  decreaseSpeed,
  toggleFullScreen
}) => {
  return (
    <div className="sticky top-0 z-50 w-full bg-parchment/95 dark:bg-parchment-dark/95 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800 shadow-sm transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-2 md:px-4 py-1 flex flex-wrap items-center justify-between gap-2">
        
        {/* Left Group: Fonts & Scroll */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Font Size */}
          <div className="flex items-center space-x-1">
            <Type size={14} className="text-stone-500 dark:text-stone-400" />
            <input
              type="range"
              min="12"
              max="20"
              step="1"
              value={settings.fontSize}
              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
              className="w-16 md:w-20 h-1.5 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-monk-red"
              aria-label="Font Size"
            />
          </div>

          {/* Auto Scroll */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded-full px-1.5 py-0.5 border border-stone-200 dark:border-stone-700">
            <button 
              onClick={decreaseSpeed}
              className="p-0.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full text-stone-600 dark:text-stone-400 disabled:opacity-30"
              disabled={scrollSpeed <= 1}
            >
              <Minus size={12} />
            </button>
            <button 
              onClick={toggleAutoScroll}
              className={`mx-1 p-1 rounded-full ${isAutoScrolling ? 'bg-monk-red text-white' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}
            >
              {isAutoScrolling ? <Pause size={10} fill="currentColor" /> : <Play size={10} fill="currentColor" />}
            </button>
            <button 
              onClick={increaseSpeed}
              className="p-0.5 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-full text-stone-600 dark:text-stone-400 disabled:opacity-30"
              disabled={scrollSpeed >= 10}
            >
              <Plus size={12} />
            </button>
            <div className="ml-1.5 w-4 text-[9px] font-bold text-center text-stone-400">{scrollSpeed}x</div>
          </div>
        </div>

        {/* Middle: Donate Button (Flex Flow) */}
        <div className="hidden md:flex shrink-0">
          <DonateButton />
        </div>

        {/* Right Group: Toggles & Actions */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Language Toggles */}
          <div className="flex items-center space-x-0.5 md:space-x-1 bg-stone-50 dark:bg-stone-900/50 rounded p-0.5">
            {[
              { label: 'Tibetan', key: 'showTibetan' },
              { label: 'Phonetics', key: 'showPhonetics' },
              { label: 'English', key: 'showTranslation' }
            ].map((lang) => (
              <button
                key={lang.key}
                onClick={() => updateSetting(lang.key as keyof AppSettings, !settings[lang.key as keyof AppSettings])}
                className={`text-[10px] md:text-xs font-medium px-2 py-0.5 rounded transition-colors ${
                  settings[lang.key as keyof AppSettings]
                    ? 'bg-white dark:bg-stone-700 text-monk-red dark:text-monk-saffron shadow-sm'
                    : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-stone-300 dark:bg-stone-700"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <div className="md:hidden">
              <DonateButton />
            </div>
            
            <button
              onClick={() => updateSetting('isDarkMode', !settings.isDarkMode)}
              className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              {settings.isDarkMode ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            <button
              onClick={toggleFullScreen}
              className="p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              <Maximize size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;