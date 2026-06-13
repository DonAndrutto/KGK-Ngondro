import React from 'react';
import { PrayerBlock as PrayerBlockType, BlockType, AppSettings } from '../types';
import { ArrowRight } from 'lucide-react';

interface PrayerBlockProps {
  block: PrayerBlockType;
  settings: AppSettings;
  onNavigate: (tab: string) => void;
}

const PrayerBlock: React.FC<PrayerBlockProps> = ({ block, settings, onNavigate }) => {
  const isInstruction = block.type === BlockType.INSTRUCTION;
  const isNavigation = block.type === BlockType.NAVIGATION;
  const isTitle = block.type === BlockType.TITLE;
  const isImage = block.type === BlockType.IMAGE;
  const isRepeated = block.variant === 'repeated';

  // Base font size calculations
  const tibetanSize = { fontSize: `${settings.fontSize * 1.5}px` };
  const phoneticsSize = { fontSize: `${settings.fontSize * 0.9}px` };
  const translationSize = { fontSize: `${settings.fontSize}px` };
  const instructionTibetanSize = { fontSize: `${settings.fontSize * 1.2}px` };

  if (isTitle) {
    return (
      <div className="mb-12 text-center animate-fadeIn">
        {block.tibetan && (
           <h1 className="font-tibetan text-2xl md:text-3xl lg:text-4xl leading-relaxed text-monk-red dark:text-monk-saffron mb-6">
             {block.tibetan}
           </h1>
        )}
        {block.phonetics && (
          <h2 className="font-sans font-bold text-lg md:text-xl text-stone-800 dark:text-stone-200 uppercase tracking-widest mb-2">
            {block.phonetics}
          </h2>
        )}
        {block.translation && (
           <h3 className="font-serif italic text-stone-600 dark:text-stone-400 text-sm md:text-base max-w-xl mx-auto">
             {block.translation}
           </h3>
        )}
        <div className="w-24 h-1 bg-monk-red/20 dark:bg-monk-saffron/20 mx-auto mt-8 rounded-full"></div>
      </div>
    );
  }

  if (isImage && block.imageUrl) {
    return (
      <figure className="my-8 md:my-10 animate-fadeIn">
        <div className="mx-auto w-full max-w-[280px] md:max-w-sm p-2 md:p-2.5 bg-white dark:bg-stone-800/80 rounded-xl shadow-lg ring-1 ring-stone-200 dark:ring-stone-700">
          <img
            src={block.imageUrl}
            alt={block.translation}
            width={block.imageWidth}
            height={block.imageHeight}
            loading="lazy"
            draggable={false}
            className="w-full h-auto rounded-lg select-none pointer-events-none"
          />
        </div>
        {block.translation && (
          <figcaption
            className="mt-3 text-center font-serif italic text-stone-500 dark:text-stone-400"
            style={{ fontSize: `${settings.fontSize * 0.85}px` }}
          >
            {block.translation}
          </figcaption>
        )}
      </figure>
    );
  }

  if (isNavigation && block.targetTab) {
    return (
      <div className="flex justify-center mt-8 mb-6 animate-fadeIn">
        <button
          onClick={() => onNavigate(block.targetTab!)}
          className="group flex items-center gap-3 px-8 py-4 bg-stone-100 dark:bg-stone-800 hover:bg-monk-red hover:text-white dark:hover:bg-monk-red border border-stone-300 dark:border-stone-700 rounded-lg shadow-sm transition-all duration-300 text-stone-600 dark:text-stone-300 font-serif text-lg"
        >
          <span>{block.translation}</span>
          <ArrowRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  // Define dynamic classes based on variant
  const tibetanColorClass = isInstruction
    ? 'text-stone-600 dark:text-stone-400 italic'
    : isRepeated
      ? 'text-[#5D4037] dark:text-[#D7CCC8] font-normal' // Dark Brown / Light Brown in dark mode
      : 'text-black dark:text-stone-100 font-normal';

  const phoneticsFontClass = isRepeated ? 'font-bold' : 'font-semibold';

  return (
    <div className={`mb-4 transition-opacity duration-500 ${isInstruction ? 'opacity-90' : 'opacity-100'}`}>
      
      {/* Tibetan Script */}
      {settings.showTibetan && block.tibetan && (
        <div 
          className={`font-tibetan leading-loose mb-2 text-center transition-colors duration-300 whitespace-pre-wrap ${tibetanColorClass}`}
          style={{ ...(isInstruction ? instructionTibetanSize : tibetanSize), lineHeight: '2.4' }}
        >
          {block.tibetan}
        </div>
      )}

      {/* Phonetics */}
      {!isInstruction && settings.showPhonetics && block.phonetics && (
        <div 
          className={`font-sans ${phoneticsFontClass} text-stone-700 dark:text-stone-300 mb-1 text-center tracking-wide whitespace-pre-wrap`}
          style={phoneticsSize}
        >
          {block.phonetics}
        </div>
      )}

      {/* Translation & Instruction Text */}
      {settings.showTranslation && block.translation && (
        <div 
          className={`font-serif leading-relaxed text-center max-w-2xl mx-auto whitespace-pre-wrap ${
            isInstruction
              ? 'text-stone-600 dark:text-stone-400 italic'
              : 'text-stone-600 dark:text-stone-300'
          }`}
          style={translationSize}
        >
          {block.translation}
        </div>
      )}
    </div>
  );
};

export default PrayerBlock;