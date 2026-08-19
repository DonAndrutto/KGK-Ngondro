import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { INTRO_SECTIONS, IntroBlock, IntroSection } from '../introContent';

interface IntroductionProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Renders **double asterisk** spans as emphasis, everything else as plain text. */
const renderInline = (text: string): React.ReactNode =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-stone-800 dark:text-stone-100">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );

const Block: React.FC<{ block: IntroBlock }> = ({ block }) => {
  switch (block.kind) {
    case 'heading':
      return (
        <h3 className="font-serif font-bold text-lg md:text-xl text-monk-red dark:text-monk-saffron text-center mb-5">
          {block.text}
        </h3>
      );

    case 'subheading':
      return (
        <h4 className="font-serif font-bold text-base md:text-lg text-stone-800 dark:text-stone-100 mt-7 mb-2">
          {block.text}
        </h4>
      );

    case 'paragraph':
      return (
        <p className="font-serif text-sm md:text-base leading-relaxed text-stone-600 dark:text-stone-300 mb-3">
          {renderInline(block.text)}
        </p>
      );

    case 'list':
      return (
        <ul className="mb-3 space-y-1.5">
          {block.items.map((item) => (
            <li
              key={item}
              className="relative pl-5 font-serif text-sm md:text-base leading-relaxed text-stone-600 dark:text-stone-300"
            >
              <span className="absolute left-0 top-0 text-monk-saffron">&#10022;</span>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );

    case 'pairs':
      return (
        <div className="my-4 space-y-3 border-l-2 border-monk-saffron/30 pl-4">
          {block.items.map((item) => (
            <div key={item.term}>
              <div className="font-serif font-bold text-sm md:text-base text-stone-800 dark:text-stone-100">
                {item.term}
              </div>
              <div className="font-serif italic text-sm md:text-base text-stone-500 dark:text-stone-400">
                {item.gloss}
              </div>
            </div>
          ))}
        </div>
      );
  }
};

interface SectionProps {
  section: IntroSection;
  isExpanded: boolean;
  onToggle: () => void;
}

const Section: React.FC<SectionProps> = ({ section, isExpanded, onToggle }) => {
  const panelId = `intro-panel-${section.id}`;

  return (
    <section className="rounded-xl border border-stone-200 dark:border-stone-700/70 bg-white/60 dark:bg-stone-900/40 overflow-hidden transition-colors duration-300">
      <button
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-stone-100/70 dark:hover:bg-stone-800/50 transition-colors"
      >
        <h2 className="font-serif font-bold text-base md:text-lg text-monk-red dark:text-monk-saffron">
          {section.title}
        </h2>
        <ChevronDown
          size={18}
          className={`shrink-0 text-stone-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      <div id={panelId}>
        {isExpanded ? (
          <div className="px-4 pb-6">
            {section.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
            <button
              onClick={onToggle}
              className="mt-5 text-xs font-sans font-semibold uppercase tracking-[0.14em] text-stone-400 hover:text-monk-red dark:hover:text-monk-saffron transition-colors"
            >
              Show less
            </button>
          </div>
        ) : (
          <button onClick={onToggle} className="block w-full px-4 pb-4 text-left group">
            <p className="font-serif text-sm md:text-base leading-relaxed text-stone-500 dark:text-stone-400">
              {section.preview}
            </p>
            <span className="mt-2 inline-block text-xs font-sans font-semibold uppercase tracking-[0.14em] text-monk-red/70 dark:text-monk-saffron/70 group-hover:text-monk-red dark:group-hover:text-monk-saffron transition-colors">
              Read more
            </span>
          </button>
        )}
      </div>
    </section>
  );
};

/**
 * Introduction pop-up. Sits above everything as a fixed overlay, so it appears
 * wherever the practitioner happens to be in the liturgy, blurring the text
 * behind it. Closes with the X in the upper left, with Escape, or by tapping
 * anywhere outside the panel.
 */
const Introduction: React.FC<IntroductionProps> = ({ isOpen, onClose }) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Kept in a ref so a new onClose identity from a parent re-render cannot
  // re-run the effect below and collapse the sections mid-read.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;

    // Always open showing the previews, scrolled to the top.
    setExpanded({});
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTop = 0;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    // Hold the liturgy still behind the overlay.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSection = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-stone-900/40 dark:bg-black/60 backdrop-blur-md animate-introFade"
      onClick={(event) => {
        // Only a tap on the backdrop itself closes the pop-up.
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="introduction-title"
        className="relative flex w-full max-w-2xl h-[88vh] flex-col rounded-2xl border border-stone-200 dark:border-stone-700 bg-parchment dark:bg-parchment-dark shadow-2xl overflow-hidden animate-introPanel"
      >
        {/* Panel header: close in the upper left, title centred */}
        <div className="relative flex items-center justify-center border-b border-stone-200 dark:border-stone-800 px-14 py-3 shrink-0">
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close introduction"
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-stone-500 hover:text-monk-red dark:hover:text-monk-saffron hover:bg-stone-200/70 dark:hover:bg-stone-800 transition-colors"
          >
            <X size={20} />
          </button>
          <h1
            id="introduction-title"
            className="font-serif font-bold text-lg md:text-xl text-stone-800 dark:text-stone-100"
          >
            Introduction
          </h1>
        </div>

        {/* Body */}
        <div ref={scrollAreaRef} className="flex-1 overflow-y-auto overscroll-contain">
          {/* min-h-full keeps the ornament on the bottom edge while the
              sections are still collapsed, instead of leaving dead space */}
          <div className="min-h-full flex flex-col px-3 sm:px-5 py-5">
            <div className="space-y-4">
              {INTRO_SECTIONS.map((section) => (
                <Section
                  key={section.id}
                  section={section}
                  isExpanded={!!expanded[section.id]}
                  onToggle={() => toggleSection(section.id)}
                />
              ))}
            </div>

            <div className="mt-auto flex justify-center pt-8 opacity-30 text-monk-red dark:text-stone-500">
              <span className="text-xl">&#10070;</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Introduction;
