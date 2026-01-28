import React from 'react';

/**
 * DiscoveryZone Component
 * Container for interactive exploration zones
 *
 * @param {string} title - Zone title
 * @param {string} icon - Icon emoji (will be removed in Swiss Style)
 * @param {React.ReactNode} children - Content
 * @param {string} variant - Visual style: 'primary', 'secondary', 'tertiary'
 */
const DiscoveryZone = ({
  title,
  icon,
  children,
  variant = 'primary'
}) => {
  const variantStyles = {
    primary: 'bg-swiss-white border-swiss-black',
    secondary: 'bg-swiss-offwhite border-swiss-black',
    tertiary: 'bg-math-blue-light border-swiss-black'
  };

  return (
    <section className={`p-8 rounded-swiss-sm border-2 ${variantStyles[variant]} mb-6`}>
      <h2 className="font-serif-display text-display-2xl text-swiss-black mb-6">
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
    <div className="p-6 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black hover:border-math-blue transition-all">
      <h3 className="font-serif-display text-display-lg text-swiss-black mb-2">{title}</h3>
      {description && (
        <p className="font-sans-body text-display-base text-swiss-charcoal mb-4">{description}</p>
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
          className="p-6 bg-swiss-white rounded-swiss-sm border-2 border-swiss-black hover:border-math-blue transition-all"
        >
          <h4 className="font-sans-body text-display-base font-semibold text-swiss-black mb-2">{item.title}</h4>
          <div className="font-mono-math text-display-xl text-math-blue mb-3">{item.value}</div>
          <p className="font-sans-body text-display-sm text-swiss-charcoal">{item.description}</p>
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
    <div className="mt-6 p-6 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
      <h4 className="font-sans-body text-display-base font-semibold text-swiss-black mb-4">Real-World Scale Reference</h4>
      <div className="space-y-3">
        {comparisons.map((comparison, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-swiss-white border border-divider-gray">
            <div className="flex-1">
              <div className="font-sans-body text-display-sm text-swiss-black">{comparison.name}</div>
              <div className="font-sans-body text-display-sm text-swiss-charcoal">
                {comparison.size} {unit}
              </div>
            </div>
            {comparison.matches && (
              <span className="px-3 py-1 bg-math-blue text-swiss-white font-sans-body text-display-sm rounded-swiss-sm">
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
