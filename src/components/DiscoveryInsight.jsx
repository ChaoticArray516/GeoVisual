import React, { useState, useEffect } from 'react';

/**
 * DiscoveryInsight Component
 * Shows "Aha!" moments when specific conditions are met during interaction
 *
 * @param {function} triggerCondition - Function that returns true when insight should show
 * @param {string} message - The insight message to display
 * @param {string} icon - Icon to display (default: 🔍)
 * @param {string} type - Type of insight: 'discovery', 'warning', 'tip'
 */
const DiscoveryInsight = ({
  triggerCondition,
  message,
  icon = '🔍',
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
    discovery: 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-500/30',
    warning: 'bg-gradient-to-r from-orange-900/40 to-red-900/40 border-orange-500/30',
    tip: 'bg-gradient-to-r from-green-900/40 to-cyan-900/40 border-green-500/30'
  };

  return (
    <div className={`mt-6 p-5 rounded-xl border-2 ${typeStyles[type]} backdrop-blur-md animate-[bounce-in_0.5s_ease-out]`}>
      <div className="flex items-start gap-3">
        <span className="text-3xl">{icon}</span>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white mb-2 uppercase tracking-wider">
            {type === 'discovery' ? '🎉 Discovery Insight!' : type === 'warning' ? '⚠️ Notice' : '💡 Tip'}
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed">{message}</p>
          <button
            onClick={() => setDismissed(true)}
            className="mt-3 text-xs text-slate-400 hover:text-white transition-colors underline"
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
