import React, { useState, useMemo } from 'react';
import InteractiveSlider from '../InteractiveSlider';
import ExplorableFormula from '../ExplorableFormula';
import DiscoveryInsight from '../DiscoveryInsight';
import DiscoveryZone, { ComparisonView, ScaleReference } from '../DiscoveryZone';

/**
 * Premium Sphere Page Component
 * Implements "explorable explanation" for sphere volume
 */
const PremiumSpherePage = ({ params, onParamsChange }) => {
  const [initialRadius] = useState(params.radius);
  const [highlightedVar, setHighlightedVar] = useState(null);

  // Calculate volume
  const volume = useMemo(() => {
    return (4/3) * Math.PI * Math.pow(params.radius, 3);
  }, [params.radius]);

  // Calculate volume ratio for insights
  const volumeRatio = useMemo(() => {
    return volume / ((4/3) * Math.PI * Math.pow(initialRadius, 3));
  }, [volume, initialRadius]);

  // Scale reference comparisons
  const scaleComparisons = [
    { name: 'Baseball', size: 3.7, matches: Math.abs(params.radius - 3.7) < 5 },
    { name: 'Tennis Ball', size: 3.3, matches: Math.abs(params.radius - 3.3) < 5 },
    { name: 'Basketball', size: 12, matches: Math.abs(params.radius - 12) < 5 },
    { name: 'Beach Ball', size: 20, matches: Math.abs(params.radius - 20) < 5 },
    { name: 'Billiard Ball', size: 2.9, matches: Math.abs(params.radius - 2.9) < 5 },
  ];

  return (
    <div className="space-y-8">
      {/* Discovery Zone 1: Radius Exploration */}
      <DiscoveryZone
        title="Explore: How Does Radius Affect Volume?"
        variant="primary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          Drag the slider below and notice how dramatically the volume changes when you adjust the radius.
          The formula V = (4/3)πr³ means volume grows with the <strong>cubed power</strong> of the radius!
        </p>

        <InteractiveSlider
          label="Radius (r)"
          value={params.radius}
          onChange={(r) => {
            onParamsChange({ ...params, radius: r });
            setHighlightedVar('r');
          }}
          min={10}
          max={120}
          variableName="r"
          unit=" units"
          color="math-blue"
        />

        <ExplorableFormula
          formula="V = (4/3)πr³"
          variables={{ r: params.radius }}
          highlight={highlightedVar}
          showSteps={true}
          result={volume}
          unit="cubic units"
        />

        {/* Aha! Moment 1: Doubling radius */}
        <DiscoveryInsight
          triggerCondition={() => params.radius >= initialRadius * 2 - 2 && params.radius <= initialRadius * 2 + 2}
          message="Amazing Discovery! When you double the radius, volume increases by 8 times! This is because of the r³ (r cubed) in the formula: 2³ = 2×2×2 = 8"
          type="discovery"
        />

        {/* Aha! Moment 2: Tripling radius */}
        <DiscoveryInsight
          triggerCondition={() => params.radius >= initialRadius * 3 - 5 && params.radius <= initialRadius * 3 + 5}
          message="Incredible! Tripling the radius makes volume 27 times larger! 3³ = 3×3×3 = 27. This exponential growth is why small changes in radius create huge changes in volume."
          type="discovery"
        />
      </DiscoveryZone>

      {/* Discovery Zone 2: Archimedes' Discovery */}
      <DiscoveryZone
        title="Archimedes' Brilliant Discovery"
        variant="secondary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          Over 2,000 years ago, Archimedes discovered that a sphere's volume is exactly
          <strong className="text-math-blue"> 2/3 </strong> of its surrounding cylinder.
        </p>

        <ComparisonView
          items={[
            {
              title: 'Sphere Volume',
              value: volume.toFixed(2),
              description: `V = (4/3)πr³ with r=${params.radius}`
            },
            {
              title: 'Surrounding Cylinder',
              value: (volume * 1.5).toFixed(2),
              description: 'Same radius, height = 2r. Sphere is exactly 2/3 of cylinder!'
            }
          ]}
        />

        <div className="mt-6 p-6 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
          <h4 className="font-sans-body text-display-base font-semibold text-swiss-black mb-3">Why This Matters</h4>
          <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
            This elegant relationship shows the deep connection between simple 3D shapes.
            Archimedes was so proud of this discovery that he wanted it on his tombstone!
          </p>
        </div>
      </DiscoveryZone>

      {/* Discovery Zone 3: Real-World Scale */}
      <DiscoveryZone
        title="Real-World Size Comparisons"
        variant="tertiary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          Visualize the size of your sphere by comparing it to familiar objects:
        </p>

        <ScaleReference
          value={params.radius}
          unit="units"
          comparisons={scaleComparisons}
        />

        <div className="mt-6 p-6 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
          <h4 className="font-sans-body text-display-base font-semibold text-swiss-black mb-3">Scale in Nature</h4>
          <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
            Spherical shapes are everywhere in nature because they minimize surface area for a given volume.
            From water droplets to planets, spheres are nature's most efficient shape!
          </p>
        </div>
      </DiscoveryZone>

      {/* Discovery Zone 4: Surface Area vs Volume */}
      <DiscoveryZone
        title="Surface Area vs Volume: The Ratio Game"
        variant="primary"
      >
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          As spheres get larger, the ratio of surface area to volume decreases.
          This is why large objects cool slower than small objects!
        </p>

        <ComparisonView
          items={[
            {
              title: 'Surface Area',
              value: (4 * Math.PI * Math.pow(params.radius, 2)).toFixed(2),
              description: 'S = 4πr² - outer layer only'
            },
            {
              title: 'Surface-to-Volume Ratio',
              value: (3 / params.radius).toFixed(3),
              description: 'Lower ratio = more efficient for storing contents'
            }
          ]}
        />

        <DiscoveryInsight
          triggerCondition={() => params.radius > 80}
          message="Notice: Large spheres have very low surface-to-volume ratios. This is why large animals cool slower than small ones, and why planets stay hot inside for billions of years!"
          type="tip"
        />
      </DiscoveryZone>

      {/* Deep Dive: Collapsible History */}
      <DiscoveryZone
        title="Deep Dive: How Did Archimedes Discover This?"
        variant="secondary"
      >
        <details className="group">
          <summary className="cursor-pointer p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black hover:bg-swiss-white transition-colors">
            <span className="font-serif-display text-display-lg text-swiss-black">
              Click to explore the fascinating history
            </span>
          </summary>
          <div className="mt-4 p-6 bg-swiss-white rounded-swiss-sm border-2 border-swiss-black space-y-4">
            <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
              Archimedes of Syracuse (287-212 BC) made this discovery while investigating the relationship
              between spheres and cylinders. He used a method called "exhaustion" - dividing shapes into
              infinitely small pieces to compare their volumes.
            </p>
            <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
              His discovery was so groundbreaking that he requested a sphere and cylinder be carved
              on his tombstone. The Roman general Marcellus, who respected Archimedes, honored this wish.
            </p>
            <div className="mt-4 p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
              <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Try This Experiment</h5>
              <p className="font-sans-body text-display-base text-swiss-charcoal">
                Fill a cylindrical glass with water, then place a sphere of the same radius inside.
                The water that overflows is exactly 1/3 of the cylinder's volume - proving the sphere takes 2/3!
              </p>
            </div>
          </div>
        </details>
      </DiscoveryZone>
    </div>
  );
};

export default PremiumSpherePage;
