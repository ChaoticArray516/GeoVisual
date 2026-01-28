import React, { useState, useEffect } from 'react';

/**
 * DiscoveryInsight Component
 * Shows "Aha!" moments when specific conditions are met during interaction
 *
 * @param {function} triggerCondition - Function that returns true when insight should show
 * @param {string} message - The insight message to display
 * @param {string} icon - Icon (removed in Swiss Style)
 * @param {string} type - Type of insight: 'discovery', 'warning', 'tip'
 */
const DiscoveryInsight = ({
  triggerCondition,
  message,
  icon,
  type = 'discovery'
}) => {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!dismissed && triggerCondition()) {
      setVisible(true);
    } else if (!triggerCondition()) {
      setVisible(false);
    }
  }, [triggerCondition, dismissed]);

  if (!visible || dismissed) return null;

  const typeStyles = {
    discovery: 'bg-math-blue-light border-math-blue',
    warning: 'bg-geo-red-light border-geo-red',
    tip: 'bg-swiss-offwhite border-swiss-black'
  };

  const typeLabels = {
    discovery: 'Discovery Insight',
    warning: 'Notice',
    tip: 'Tip'
  };

  return (
    <div className={`mt-6 p-6 rounded-swiss-sm border-2 ${typeStyles[type]} animate-[bounce-in_0.5s_ease-out]`}>
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2 uppercase tracking-wider">
            {typeLabels[type]}
          </h4>
          <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">{message}</p>
          <button
            onClick={() => setDismissed(true)}
            className="mt-3 font-sans-body text-display-sm text-swiss-charcoal hover:text-math-blue transition-colors underline"
          >
            Got it, dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * InsightCollection - Manages multiple insights
 */
export const InsightCollection = ({ insights }) => {
  return (
    <div className="space-y-4">
      {insights.map((insight, index) => (
        <DiscoveryInsight
          key={index}
          triggerCondition={insight.condition}
          message={insight.message}
          icon={insight.icon}
          type={insight.type}
        />
      ))}
    </div>
  );
};

export default DiscoveryInsight;
