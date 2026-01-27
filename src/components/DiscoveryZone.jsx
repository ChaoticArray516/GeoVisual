import React from 'react';

/**
 * DiscoveryZone Component
 * Container for interactive exploration zones
 *
 * @param {string} title - Zone title
 * @param {string} icon - Icon emoji
 * @param {React.ReactNode} children - Content
 * @param {string} variant - Visual style: 'primary', 'secondary', 'tertiary'
 */
const DiscoveryZone = ({
  title,
  icon = '🔍',
  children,
  variant = 'primary'
}) => {
  const variantStyles = {
    primary: 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/20',
    secondary: 'bg-gradient-to-br from-slate-900/50 to-slate-800/30 border-slate-700/30',
    tertiary: 'bg-gradient-to-br from-cyan-900/30 to-teal-900/30 border-cyan-500/20'
  };

  return (
    <section className={`p-8 rounded-3xl border-2 backdrop-blur-md ${variantStyles[variant]} mb-6`}>
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="text-3xl">{icon}</span>
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
};

/**
 * ExperimentCard - Card for experiments within discovery zones
 */
export const ExperimentCard = ({ title, description, children }) => {
  return (
    <div className="p-6 bg-slate-950/40 rounded-2xl border border-white/10 hover:border-blue-500/30 transition-all">
      <h3 className="text-lg font-semibold text-blue-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
};

/**
 * ComparisonView - Side-by-side comparison component
 */
export const ComparisonView = ({ items }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {items.map((item, index) => (
        <div
          key={index}
          className="p-6 bg-slate-950/60 rounded-2xl border-2 border-blue-500/20 hover:border-blue-500/40 transition-all"
        >
          <h4 className="text-base font-bold text-white mb-2">{item.title}</h4>
          <div className="text-3xl font-mono text-cyan-400 mb-3">{item.value}</div>
          <p className="text-xs text-slate-400">{item.description}</p>
        </div>
      ))}
    </div>
  );
};

/**
 * ScaleReference - Real-world object size comparison
 */
export const ScaleReference = ({ value, unit, comparisons }) => {
  return (
    <div className="mt-6 p-6 bg-slate-950/40 rounded-2xl border border-purple-500/20">
      <h4 className="text-base font-semibold text-purple-300 mb-4">📏 Real-World Scale</h4>
      <div className="space-y-3">
        {comparisons.map((comparison, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-2xl">{comparison.icon}</span>
            <div className="flex-1">
              <div className="text-sm text-white">{comparison.name}</div>
              <div className="text-xs text-slate-400">
                {comparison.size} {unit}
              </div>
            </div>
            {comparison.matches && (
              <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                Current size
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryZone;
