import React from 'react';

/**
 * ExplorableFormula Component
 * Displays mathematical formulas with highlighted variables and step-by-step calculations
 *
 * @param {string} formula - The formula to display (e.g., "V = (4/3)πr³")
 * @param {object} variables - Object mapping variable names to values { r: 5, h: 10 }
 * @param {string} highlight - Which variable to highlight (e.g., "r")
 * @param {boolean} showSteps - Whether to show calculation steps
 * @param {number} result - The calculated result
 * @param {string} unit - Unit for the result (e.g., "cm³")
 */
const ExplorableFormula = ({
  formula,
  variables = {},
  highlight = null,
  showSteps = false,
  result = null,
  unit = ''
}) => {
  // Parse formula and highlight specified variable
  const renderFormula = () => {
    if (!highlight) {
      return <span className="font-serif-display text-display-xl font-semibold text-swiss-black">{formula}</span>;
    }

    // Split formula by variable names and wrap the highlighted one
    const parts = formula.split(new RegExp(`(${highlight})`, 'g'));

    return (
      <span className="font-serif-display text-display-xl font-semibold text-swiss-black">
        {parts.map((part, index) => {
          if (part === highlight) {
            return (
              <span
                key={index}
                className="bg-math-blue-light text-math-blue px-2 py-1 rounded-swiss-sm transition-all duration-300"
              >
                {part}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  // Render calculation steps
  const renderSteps = () => {
    if (!showSteps || !variables) return null;

    // Generate steps based on formula type
    const generateSteps = () => {
      // Sphere: V = (4/3)πr³
      if (formula.includes('4/3') && formula.includes('πr³')) {
        const r = variables.r;
        const r3 = Math.pow(r, 3);
        const step2 = (4/3) * Math.PI * r3;

        return (
          <div className="space-y-2 font-mono-math text-display-base">
            <div className="text-swiss-charcoal">Step 1: V = (4/3) × π × {r}³</div>
            <div className="text-swiss-charcoal">Step 2: V = (4/3) × π × {r3.toFixed(2)}</div>
            <div className="text-math-blue font-semibold">Step 3: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      // Cone: V = (1/3)πr²h
      if (formula.includes('1/3') && formula.includes('πr²h')) {
        const { r, h } = variables;
        const r2 = Math.pow(r, 2);
        const step2 = (1/3) * Math.PI * r2 * h;

        return (
          <div className="space-y-2 font-mono-math text-display-base">
            <div className="text-swiss-charcoal">Step 1: V = (1/3) × π × {r}² × {h}</div>
            <div className="text-swiss-charcoal">Step 2: V = (1/3) × π × {r2.toFixed(2)} × {h}</div>
            <div className="text-math-blue font-semibold">Step 3: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      // Cylinder: V = πr²h
      if (formula.includes('πr²h')) {
        const { r, h } = variables;
        const r2 = Math.pow(r, 2);
        const step2 = Math.PI * r2 * h;

        return (
          <div className="space-y-2 font-mono-math text-display-base">
            <div className="text-swiss-charcoal">Step 1: V = π × {r}² × {h}</div>
            <div className="text-swiss-charcoal">Step 2: V = π × {r2.toFixed(2)} × {h}</div>
            <div className="text-math-blue font-semibold">Step 3: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      // Cube: V = l·w·h
      if (formula.includes('l·w·h')) {
        const { l, w, h } = variables;
        const step2 = l * w * h;

        return (
          <div className="space-y-2 font-mono-math text-display-base">
            <div className="text-swiss-charcoal">Step 1: V = {l} × {w} × {h}</div>
            <div className="text-math-blue font-semibold">Step 2: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      return null;
    };

    return (
      <div className="mt-4 p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
        {generateSteps()}
      </div>
    );
  };

  return (
    <div className="p-6 bg-swiss-white rounded-swiss-sm border-2 border-swiss-black">
      <div className="mb-2 font-sans-body text-display-sm text-swiss-charcoal uppercase tracking-wider">Live Formula</div>
      {renderFormula()}
      {renderSteps()}
      {result !== null && (
        <div className="mt-4 pt-4 border-t-2 border-divider-gray">
          <div className="font-sans-body text-display-base text-swiss-charcoal">Result:</div>
          <div className="font-mono-math text-display-2xl font-semibold text-math-blue">
            {result.toFixed(2)} {unit}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorableFormula;
