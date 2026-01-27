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
      return <span className="text-xl font-bold">{formula}</span>;
    }

    // Split formula by variable names and wrap the highlighted one
    const parts = formula.split(new RegExp(`(${highlight})`, 'g'));

    return (
      <span className="text-xl font-bold">
        {parts.map((part, index) => {
          if (part === highlight) {
            return (
              <span
                key={index}
                className="bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded transition-all duration-300 animate-pulse"
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
          <div className="space-y-2 text-sm font-mono">
            <div className="text-slate-400">Step 1: V = (4/3) × π × {r}³</div>
            <div className="text-slate-400">Step 2: V = (4/3) × π × {r3.toFixed(2)}</div>
            <div className="text-blue-300 font-bold">Step 3: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      // Cone: V = (1/3)πr²h
      if (formula.includes('1/3') && formula.includes('πr²h')) {
        const { r, h } = variables;
        const r2 = Math.pow(r, 2);
        const step2 = (1/3) * Math.PI * r2 * h;

        return (
          <div className="space-y-2 text-sm font-mono">
            <div className="text-slate-400">Step 1: V = (1/3) × π × {r}² × {h}</div>
            <div className="text-slate-400">Step 2: V = (1/3) × π × {r2.toFixed(2)} × {h}</div>
            <div className="text-blue-300 font-bold">Step 3: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      // Cylinder: V = πr²h
      if (formula.includes('πr²h')) {
        const { r, h } = variables;
        const r2 = Math.pow(r, 2);
        const step2 = Math.PI * r2 * h;

        return (
          <div className="space-y-2 text-sm font-mono">
            <div className="text-slate-400">Step 1: V = π × {r}² × {h}</div>
            <div className="text-slate-400">Step 2: V = π × {r2.toFixed(2)} × {h}</div>
            <div className="text-blue-300 font-bold">Step 3: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      // Cube: V = l·w·h
      if (formula.includes('l·w·h')) {
        const { l, w, h } = variables;
        const step2 = l * w * h;

        return (
          <div className="space-y-2 text-sm font-mono">
            <div className="text-slate-400">Step 1: V = {l} × {w} × {h}</div>
            <div className="text-blue-300 font-bold">Step 2: V = {step2.toFixed(2)} {unit}</div>
          </div>
        );
      }

      return null;
    };

    return (
      <div className="mt-4 p-4 bg-slate-950/40 rounded-xl border border-white/5">
        {generateSteps()}
      </div>
    );
  };

  return (
    <div className="p-6 bg-slate-950/60 rounded-xl border border-blue-500/20">
      <div className="mb-2 text-xs text-slate-500 uppercase tracking-widest">Live Formula</div>
      {renderFormula()}
      {renderSteps()}
      {result !== null && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="text-sm text-slate-400">Result:</div>
          <div className="text-2xl font-bold text-cyan-400">
            {result.toFixed(2)} {unit}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorableFormula;
