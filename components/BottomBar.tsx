
import { Plus, Minus, Play, Pause, ZoomIn, ZoomOut, Move3d, Maximize, Minimize, Sun, Moon } from 'lucide-react';
import React from 'react';

interface BottomBarProps {
  // Scrolling
  isAutoScrolling: boolean;
  toggleAutoScroll: () => void;
  scrollSpeed: number;
  setScrollSpeed: (speed: number) => void;
  
  // Text Size
  fontSize: number;
  setFontSize: (size: number) => void;

  // Full Screen
  isFullScreen: boolean;
  toggleFullScreen: () => void;

  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Tilt (Optional)
  isTiltScrolling?: boolean;
  toggleTiltScroll?: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({
  isAutoScrolling,
  toggleAutoScroll,
  scrollSpeed,
  setScrollSpeed,
  fontSize,
  setFontSize,
  isFullScreen,
  toggleFullScreen,
  isDarkMode,
  toggleTheme,
  isTiltScrolling = false,
  toggleTiltScroll = () => {},
}) => {

  const handleSpeed = (amount: number) => {
    setScrollSpeed(Math.max(1, Math.min(scrollSpeed + amount, 10)));
  };

  const handleFontSize = (amount: number) => {
    setFontSize(Math.max(12, Math.min(fontSize + amount, 40)));
  };

  // Base styles for the glass containers
  const baseControlStyles = "flex items-center p-1 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg rounded-md border border-stone-200 dark:border-stone-800 shadow-sm transition-all duration-300";
  
  const btnStyles = "p-3 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition-colors";
  const activeBtnStyles = "bg-monk-red/10 text-monk-red dark:text-monk-saffron";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="relative max-w-lg mx-auto h-12 flex items-center justify-between pointer-events-auto">
        
        {/* Left Group: Speed & Play */}
        <div className={`${baseControlStyles} gap-0`}>
          <button onClick={() => handleSpeed(-1)} className={btnStyles} aria-label="Slower">
            <Minus size={18} />
          </button>
          
          <button 
            onClick={toggleAutoScroll} 
            className={`${btnStyles} ${isAutoScrolling ? activeBtnStyles : ''}`}
            aria-label={isAutoScrolling ? "Pause" : "Play"}
          >
            {isAutoScrolling ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <button onClick={() => handleSpeed(1)} className={btnStyles} aria-label="Faster">
            <Plus size={18} />
          </button>
        </div>

        {/* Center: Theme, Full Screen & Tilt */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-auto">
           <div className={`${baseControlStyles} gap-1`}>
             <button onClick={toggleTheme} className={btnStyles} aria-label="Toggle Theme">
                {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
             </button>
             <div className="w-px h-4 bg-stone-200 dark:bg-stone-700 mx-1"></div>
             <button 
                onClick={toggleFullScreen} 
                className={`${btnStyles} ${isFullScreen ? activeBtnStyles : ''}`} 
                aria-label="Full Screen"
             >
               {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
             </button>
             <button 
                onClick={toggleTiltScroll}
                className={`${btnStyles} ${isTiltScrolling ? activeBtnStyles : ''}`}
                aria-label="Tilt Scroll"
             >
               <Move3d size={18} />
             </button>
           </div>
        </div>

        {/* Right Group: Text Size */}
        <div className={`${baseControlStyles} gap-0`}>
          <button onClick={() => handleFontSize(-2)} className={btnStyles} aria-label="Decrease Text">
            <ZoomOut size={18} />
          </button>
          
          <button onClick={() => handleFontSize(2)} className={btnStyles} aria-label="Increase Text">
            <ZoomIn size={18} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default BottomBar;
