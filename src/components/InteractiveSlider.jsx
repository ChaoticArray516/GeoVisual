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
 * @param {string} color - Accent color (default: math-blue)
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
  color = 'math-blue'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const colorClasses = {
    'math-blue': 'accent-math-blue',
    'geo-red': 'accent-geo-red'
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
      <div className="flex justify-between items-center font-sans-body text-display-sm font-semibold text-swiss-black">
        <span className="uppercase tracking-wider">{label}</span>
        {showValue && (
          <span className="font-mono-math text-display-xl text-swiss-black">
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
          className={`w-full ${colorClasses[color] || colorClasses['math-blue']}`}
        />

        {/* Value indicator overlay */}
        <div
          className="absolute top-0 h-0.5 bg-math-blue pointer-events-none transition-all duration-100"
          style={{
            width: `${((value - min) / (max - min)) * 100}%`
          }}
        />
      </div>

      {/* Interactive hint */}
      <div className="font-sans-body text-display-sm text-swiss-charcoal">
        {isDragging ? (
          <span className="text-math-blue">Adjusting...</span>
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
        <h3 className="font-sans-body text-display-sm font-semibold text-swiss-black uppercase tracking-wider mb-4">
          {label}
        </h3>
      )}
      {children}
    </div>
  );
};

export default InteractiveSlider;
