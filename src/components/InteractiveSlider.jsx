import React, { useState, useRef, useEffect } from 'react';

/**
 * InteractiveSlider Component
 * Touch-friendly slider with formula highlighting and value display
 *
 * @param {string} label - Label for the slider
 * @param {number} value - Current value
 * @param {function} onChange - Callback when value changes
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} variableName - Variable name to highlight in formula (e.g., "r")
 * @param {string} unit - Unit to display (e.g., "cm")
 * @param {boolean} showValue - Whether to show current value
 * @param {string} color - Accent color (default: blue)
 */
const InteractiveSlider = ({
  label,
  value,
  onChange,
  min = 1,
  max = 100,
  variableName = null,
  unit = '',
  showValue = true,
  color = 'blue'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const colorClasses = {
    blue: 'accent-blue-500',
    cyan: 'accent-cyan-500',
    purple: 'accent-purple-500',
    green: 'accent-green-500',
    orange: 'accent-orange-500'
  };

  // Emit highlight event when slider changes
  const handleChange = (e) => {
    const newValue = Number(e.target.value);
    onChange(newValue);

    // Emit custom event for formula highlighting
    if (variableName) {
      window.dispatchEvent(new CustomEvent('sliderChange', {
        detail: { variable: variableName, value: newValue }
      }));
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
        <span className="uppercase tracking-wider">{label}</span>
        {showValue && (
          <span className="text-lg font-mono text-white">
            {value}{unit}
          </span>
        )}
      </div>

      <div className="relative">
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleChange}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          className={`w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer
            ${colorClasses[color]}
            transition-all duration-200
            ${isDragging ? 'scale-105' : ''}`}
        />

        {/* Value indicator overlay */}
        <div
          className="absolute top-0 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg pointer-events-none transition-all duration-100"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`
          }}
        />
      </div>

      {/* Interactive hint */}
      <div className="text-[9px] text-slate-500 italic">
        {isDragging ? (
          <span className="text-blue-400">✨ Adjusting...</span>
        ) : (
          <span>Drag to explore</span>
        )}
      </div>
    </div>
  );
};

/**
 * SliderGroup - Group multiple sliders together
 */
export const SliderGroup = ({ children, label }) => {
  return (
    <div className="space-y-6">
      {label && (
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
          {label}
        </h3>
      )}
      {children}
    </div>
  );
};

export default InteractiveSlider;
