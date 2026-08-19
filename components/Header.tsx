import React from 'react';
import { Heart, BookOpen } from 'lucide-react';
import { AppSettings } from '../types';

interface HeaderProps {
  settings: AppSettings;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  onOpenIntroduction: () => void;
}

const Header: React.FC<HeaderProps> = ({ settings, updateSetting, onOpenIntroduction }) => {
  
  const toggleBtnClass = (isActive: boolean) => 
    `text-xs px-2 py-1 rounded font-medium transition-colors border ${
      isActive 
        ? 'bg-monk-red/10 border-monk-red/20 text-monk-red dark:text-monk-saffron dark:border-monk-saffron/30' 
        : 'border-transparent text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg h-20 md:h-16">
      {/*
        Narrow screens wrap into two rows: Introduction and the controls on top,
        the title centred beneath them. From md upwards it collapses to a single
        row with the title absolutely centred between the two control groups.
      */}
      <div className="container mx-auto h-full max-w-4xl px-3 md:px-4 flex flex-wrap md:flex-nowrap items-center content-center relative">
        
        {/* Upper left: Introduction */}
        <div className="order-1 flex flex-auto min-w-0 justify-start">
          <button
            onClick={onOpenIntroduction}
            className="flex items-center gap-1.5 rounded-full border border-stone-200 dark:border-stone-700 px-2.5 py-1.5 text-stone-600 dark:text-stone-300 hover:text-monk-red dark:hover:text-monk-saffron hover:border-monk-red/30 dark:hover:border-monk-saffron/30 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Open the introduction"
          >
            <BookOpen size={15} className="shrink-0" />
            <span className="text-xs font-medium whitespace-nowrap">Introduction</span>
          </button>
        </div>

        {/* Right: Controls */}
        <div className="order-2 flex flex-auto min-w-0 items-center justify-end gap-2 md:gap-4">
          
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

          <div className="hidden md:block w-px h-6 bg-stone-200 dark:bg-stone-800"></div>

          {/* Donate Button (PayPal Link) */}
          <a
            href="https://www.paypal.com/donate/?business=JZS5LVZKPPY5J&no_recurring=0&item_name=Help+fund+Dharma+translation+projects.&currency_code=USD"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-1.5 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-monk-red transition-colors"
            aria-label="Donate"
          >
            <Heart size={16} />
            <span className="absolute top-full right-0 mt-2 px-2 py-1 text-xs text-white bg-stone-800 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md z-50">
              Donate
            </span>
          </a>
        </div>

        {/* Title */}
        <h1 className="order-3 w-full basis-full md:order-none md:w-auto md:basis-auto md:absolute md:left-1/2 md:-translate-x-1/2 md:pointer-events-none text-center font-serif font-bold leading-tight tracking-tight text-stone-800 dark:text-stone-100 text-lg sm:text-xl md:text-2xl">
          Künzang Gongdü Ngöndro
        </h1>

      </div>
    </header>
  );
};

export default Header;
