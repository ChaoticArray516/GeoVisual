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
    { name: 'Standard Die', size: 16, matches: Math.abs(params.length - 16) < 10 },
    { name: 'Ice Cube', size: 30, matches: Math.abs(params.length - 30) < 15 },
    { name: 'Small Box', size: 100, matches: Math.abs(params.length - 100) < 30 },
    { name: 'Medium Box', size: 200, matches: Math.abs(params.length - 200) < 50 },
    { name: 'Large Container', size: 400, matches: Math.abs(params.length - 400) < 100 },
  ];

  return (
    <div className="space-y-8">
      {/* Discovery Zone 1: Length Exploration */}
      <DiscoveryZone
        title="Explore: How Does Side Length Affect Volume?"
        variant="primary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
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
          color="math-blue"
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
          message="Amazing Discovery! When you double the side length, volume increases by 8 times! This is because of the s³ (s cubed) in the formula: 2³ = 2×2×2 = 8"
          type="discovery"
        />

        {/* Aha! Moment 2: Tripling side length */}
        <DiscoveryInsight
          triggerCondition={() => params.length >= initialLength * 3 - 15 && params.length <= initialLength * 3 + 15}
          message="Incredible! Tripling the side length makes volume 27 times larger! 3³ = 3×3×3 = 27. This exponential growth is why small changes in dimensions create huge changes in volume."
          type="discovery"
        />
      </DiscoveryZone>

      {/* Discovery Zone 2: Surface Area vs Volume */}
      <DiscoveryZone
        title="Compare: Surface Area vs Volume"
        variant="secondary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
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
              color: 'math-blue',
              ratio: surfaceAreaRatio,
            },
            {
              label: 'Volume',
              value: volume,
              formula: 'V = s³',
              unit: 'cubic units',
              color: 'math-blue',
              ratio: volumeRatio,
            }
          ]}
        />

        <DiscoveryInsight
          triggerCondition={() => params.length >= initialLength * 2 - 10 && params.length <= initialLength * 2 + 10}
          message="Key Insight: When side length doubles, surface area increases by 4x (2² = 4) but volume increases by 8x (2³ = 8). This is why larger objects have less surface area relative to their volume - important for heat retention in animals!"
          type="insight"
        />
      </DiscoveryZone>

      {/* Discovery Zone 3: Real-World Scale */}
      <DiscoveryZone
        title="Discover: Real-World Scale References"
        variant="tertiary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          Visualize the cube size with familiar objects from everyday life.
        </p>

        <ScaleReference
          currentValue={params.length}
          comparisons={scaleComparisons}
          unit=" units"
        />

        <DiscoveryInsight
          triggerCondition={() => params.length > 200}
          message="Wow! This cube is now larger than a shipping container! Imagine how much space this would occupy in real life."
          type="milestone"
        />

        <DiscoveryInsight
          triggerCondition={() => params.length < 60}
          message="Tiny! This cube is smaller than a standard die. Notice how small cubes have very high surface area-to-volume ratios compared to large cubes."
          type="insight"
        />
      </DiscoveryZone>

      {/* Discovery Zone 4: Mathematical Properties */}
      <DiscoveryZone
        title="Explore: Space Diagonal of a Cube"
        variant="primary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
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

        <div className="bg-swiss-offwhite rounded-swiss-sm p-6 border-2 border-swiss-black">
          <p className="font-sans-body text-display-base text-swiss-charcoal mb-3">
            <strong className="text-swiss-black">The Diagonal Pattern:</strong>
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-swiss-white rounded-swiss-sm p-3 border-2 border-swiss-black">
              <div className="font-sans-body text-display-sm text-swiss-charcoal mb-1">Side (s)</div>
              <div className="font-mono-math text-display-base font-semibold text-math-blue">{params.length.toFixed(1)} units</div>
            </div>
            <div className="bg-swiss-white rounded-swiss-sm p-3 border-2 border-swiss-black">
              <div className="font-sans-body text-display-sm text-swiss-charcoal mb-1">Space Diagonal (d)</div>
              <div className="font-mono-math text-display-base font-semibold text-math-blue">{(params.length * Math.sqrt(3)).toFixed(2)} units</div>
            </div>
            <div className="bg-swiss-white rounded-swiss-sm p-3 col-span-2 border-2 border-swiss-black">
              <div className="font-sans-body text-display-sm text-swiss-charcoal mb-1">Ratio (d/s)</div>
              <div className="font-mono-math text-display-base font-semibold text-math-blue">≈ {Math.sqrt(3).toFixed(4)} (constant!)</div>
            </div>
          </div>
        </div>

        <DiscoveryInsight
          triggerCondition={() => params.length > 100}
          message="Fascinating! No matter how large the cube is, the space diagonal is always about 1.732 times the side length. This constant ratio (√3) is true for ALL cubes!"
          type="discovery"
        />
      </DiscoveryZone>
    </div>
  );
};

export default PremiumCubePage;
