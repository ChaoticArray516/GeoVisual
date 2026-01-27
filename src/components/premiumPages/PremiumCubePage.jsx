import React, { useState, useMemo } from 'react';
import InteractiveSlider from '../InteractiveSlider';
import ExplorableFormula from '../ExplorableFormula';
import DiscoveryInsight from '../DiscoveryInsight';
import DiscoveryZone, { ComparisonView, ScaleReference } from '../DiscoveryZone';

/**
 * Premium Cube Page Component
 * Implements "explorable explanation" for cube volume and surface area
 */
const PremiumCubePage = ({ params, onParamsChange }) => {
  const [initialLength] = useState(params.length);
  const [highlightedVar, setHighlightedVar] = useState(null);

  // Calculate volume
  const volume = useMemo(() => {
    return Math.pow(params.length, 3);
  }, [params.length]);

  // Calculate surface area
  const surfaceArea = useMemo(() => {
    return 6 * Math.pow(params.length, 2);
  }, [params.length]);

  // Calculate volume ratio for insights
  const volumeRatio = useMemo(() => {
    return volume / Math.pow(initialLength, 3);
  }, [volume, initialLength]);

  // Calculate surface area ratio
  const surfaceAreaRatio = useMemo(() => {
    return surfaceArea / (6 * Math.pow(initialLength, 2));
  }, [surfaceArea, initialLength]);

  // Scale reference comparisons
  const scaleComparisons = [
    { icon: '🎲', name: 'Standard Die', size: 16, matches: Math.abs(params.length - 16) < 10 },
    { icon: '🧊', name: 'Ice Cube', size: 30, matches: Math.abs(params.length - 30) < 15 },
    { icon: '📦', name: 'Small Box', size: 100, matches: Math.abs(params.length - 100) < 30 },
    { icon: '📦', name: 'Medium Box', size: 200, matches: Math.abs(params.length - 200) < 50 },
    { icon: '🏢', name: 'Large Container', size: 400, matches: Math.abs(params.length - 400) < 100 },
  ];

  return (
    <div className="space-y-8">
      {/* Discovery Zone 1: Length Exploration */}
      <DiscoveryZone
        title="Explore: How Does Side Length Affect Volume?"
        icon="🔍"
        variant="primary"
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          Drag the slider below and notice how dramatically the volume changes when you adjust the side length.
          The formula V = s³ means volume grows with the <strong>cube</strong> of the side length!
        </p>

        <InteractiveSlider
          label="Side Length (s)"
          value={params.length}
          onChange={(s) => {
            onParamsChange({ ...params, length: s, width: s, height: s });
            setHighlightedVar('s');
          }}
          min={40}
          max={220}
          variableName="s"
          unit=" units"
          color="blue"
        />

        <ExplorableFormula
          formula="V = s³"
          variables={{ s: params.length }}
          highlight={highlightedVar}
          showSteps={true}
          result={volume}
          unit="cubic units"
        />

        {/* Aha! Moment 1: Doubling side length */}
        <DiscoveryInsight
          triggerCondition={() => params.length >= initialLength * 2 - 10 && params.length <= initialLength * 2 + 10}
          message="🎉 Amazing Discovery! When you double the side length, volume increases by 8 times! This is because of the s³ (s cubed) in the formula: 2³ = 2×2×2 = 8"
          icon="💡"
          type="discovery"
        />

        {/* Aha! Moment 2: Tripling side length */}
        <DiscoveryInsight
          triggerCondition={() => params.length >= initialLength * 3 - 15 && params.length <= initialLength * 3 + 15}
          message="🤯 Incredible! Tripling the side length makes volume 27 times larger! 3³ = 3×3×3 = 27. This exponential growth is why small changes in dimensions create huge changes in volume."
          icon="🚀"
          type="discovery"
        />
      </DiscoveryZone>

      {/* Discovery Zone 2: Surface Area vs Volume */}
      <DiscoveryZone
        title="Compare: Surface Area vs Volume"
        icon="📐"
        variant="secondary"
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          Notice how surface area and volume grow at different rates. Surface area grows with s² (squared),
          while volume grows with s³ (cubed). This has profound implications in nature and engineering!
        </p>

        <ComparisonView
          items={[
            {
              label: 'Surface Area',
              value: surfaceArea,
              formula: 'SA = 6s²',
              unit: 'square units',
              color: 'green',
              ratio: surfaceAreaRatio,
              icon: '🔲'
            },
            {
              label: 'Volume',
              value: volume,
              formula: 'V = s³',
              unit: 'cubic units',
              color: 'blue',
              ratio: volumeRatio,
              icon: '📦'
            }
          ]}
        />

        <DiscoveryInsight
          triggerCondition={() => params.length >= initialLength * 2 - 10 && params.length <= initialLength * 2 + 10}
          message="🔍 Key Insight: When side length doubles, surface area increases by 4x (2² = 4) but volume increases by 8x (2³ = 8). This is why larger objects have less surface area relative to their volume - important for heat retention in animals!"
          icon="🌡️"
          type="insight"
        />
      </DiscoveryZone>

      {/* Discovery Zone 3: Real-World Scale */}
      <DiscoveryZone
        title="Discover: Real-World Scale References"
        icon="🌍"
        variant="accent"
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          Visualize the cube size with familiar objects from everyday life.
        </p>

        <ScaleReference
          currentValue={params.length}
          comparisons={scaleComparisons}
          unit=" units"
        />

        <DiscoveryInsight
          triggerCondition={() => params.length > 200}
          message="🏗️ Wow! This cube is now larger than a shipping container! Imagine how much space this would occupy in real life."
          icon="🏢"
          type="milestone"
        />

        <DiscoveryInsight
          triggerCondition={() => params.length < 60}
          message="🎲 Tiny! This cube is smaller than a standard die. Notice how small cubes have very high surface area-to-volume ratios compared to large cubes."
          icon="🔬"
          type="insight"
        />
      </DiscoveryZone>

      {/* Discovery Zone 4: Mathematical Properties */}
      <DiscoveryZone
        title="Explore: Space Diagonal of a Cube"
        icon="📏"
        variant="neutral"
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          The space diagonal (the longest distance between any two corners) follows a beautiful pattern.
          Can you discover it?
        </p>

        <ExplorableFormula
          formula="d = s√3"
          variables={{
            s: params.length,
            '√3': Math.sqrt(3).toFixed(4)
          }}
          showSteps={true}
          result={params.length * Math.sqrt(3)}
          unit=" units"
        />

        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
          <p className="text-slate-300 text-sm mb-3">
            <strong className="text-white">The Diagonal Pattern:</strong>
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Side (s)</div>
              <div className="text-blue-400 font-bold">{params.length.toFixed(1)} units</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">Space Diagonal (d)</div>
              <div className="text-purple-400 font-bold">{(params.length * Math.sqrt(3)).toFixed(2)} units</div>
            </div>
            <div className="bg-slate-900/50 rounded-lg p-3 col-span-2">
              <div className="text-slate-400 mb-1">Ratio (d/s)</div>
              <div className="text-green-400 font-bold">≈ {Math.sqrt(3).toFixed(4)} (constant!)</div>
            </div>
          </div>
        </div>

        <DiscoveryInsight
          triggerCondition={() => params.length > 100}
          message="🧩 Fascinating! No matter how large the cube is, the space diagonal is always about 1.732 times the side length. This constant ratio (√3) is true for ALL cubes!"
          icon="✨"
          type="discovery"
        />
      </DiscoveryZone>
    </div>
  );
};

export default PremiumCubePage;
