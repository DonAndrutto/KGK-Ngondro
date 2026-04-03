import React from 'react';
import { Heart } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
}

const Header: React.FC<HeaderProps> = ({ settings, updateSetting }) => {
  
  const toggleBtnClass = (isActive: boolean) => 
    `text-xs px-2 py-1 rounded font-medium transition-colors border ${
      isActive 
        ? 'bg-monk-red/10 border-monk-red/20 text-monk-red dark:text-monk-saffron dark:border-monk-saffron/30' 
        : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg h-14">
      <div className="container mx-auto h-full max-w-4xl px-4 flex items-center justify-between">
        
        {/* Left: Branding */}
        <div className="font-serif font-bold text-stone-700 dark:text-stone-200">
          KGK Ngöndro
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-4">
          
          {/* Language Toggles */}
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-md">
            <button 
              onClick={() => updateSetting('showTibetan', !settings.showTibetan)}
              className={toggleBtnClass(settings.showTibetan)}
            >
              TIB
            </button>
            <button 
              onClick={() => updateSetting('showPhonetics', !settings.showPhonetics)}
              className={toggleBtnClass(settings.showPhonetics)}
            >
              PHO
            </button>
            <button 
              onClick={() => updateSetting('showTranslation', !settings.showTranslation)}
              className={toggleBtnClass(settings.showTranslation)}
            >
              ENG
            </button>
          </div>

          <div className="w-px h-6 bg-stone-200 dark:bg-stone-800"></div>

          {/* Donate Button (PayPal Link) */}
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
        </div>

      </div>
    </header>
  );
};

export default Header;