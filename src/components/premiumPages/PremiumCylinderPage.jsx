import React, { useState, useMemo } from 'react';
import InteractiveSlider from '../InteractiveSlider';
import ExplorableFormula from '../ExplorableFormula';
import DiscoveryInsight from '../DiscoveryInsight';
import DiscoveryZone, { ComparisonView } from '../DiscoveryZone';

/**
 * Premium Cylinder Page Component
 * Implements "explorable explanation" for cylinder volume
 */
const PremiumCylinderPage = ({ params, onParamsChange }) => {
  const [highlightedVar, setHighlightedVar] = useState(null);

  // Calculate volume
  const volume = useMemo(() => {
    return Math.PI * Math.pow(params.radius, 2) * params.height;
  }, [params.radius, params.height]);

  // Calculate surface area
  const surfaceArea = useMemo(() => {
    return 2 * Math.PI * params.radius * (params.radius + params.height);
  }, [params.radius, params.height]);

  // Calculate equivalent sphere volume
  const sphereVolume = useMemo(() => {
    return (4/3) * Math.PI * Math.pow(params.radius, 3);
  }, [params.radius]);

  // Calculate equivalent cone volume
  const coneVolume = useMemo(() => {
    return (1/3) * Math.PI * Math.pow(params.radius, 2) * params.height;
  }, [params.radius, params.height]);

  return (
    <div className="space-y-8">
      {/* Discovery Zone 1: Unrolling the Cylinder */}
      <DiscoveryZone title="Explore: What Happens When We Unroll a Cylinder?" variant="primary">
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          Imagine peeling off the curved surface of a cylinder and flattening it out.
          What shape do you get? A rectangle! This reveals why the surface area formula works.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <InteractiveSlider
            label="Radius (r)"
            value={params.radius}
            onChange={(r) => {
              onParamsChange({ ...params, radius: r });
              setHighlightedVar('r');
            }}
            min={30}
            max={100}
            variableName="r"
            unit=" units"
            color="math-blue"
          />
          <InteractiveSlider
            label="Height (h)"
            value={params.height}
            onChange={(h) => {
              onParamsChange({ ...params, height: h });
              setHighlightedVar('h');
            }}
            min={40}
            max={200}
            variableName="h"
            unit=" units"
            color="math-blue"
          />
        </div>

        <ExplorableFormula
          formula="V = πr²h"
          variables={{ r: params.radius, h: params.height }}
          highlight={highlightedVar}
          showSteps={true}
          result={volume}
          unit="cubic units"
        />

        <ComparisonView
          items={[
            {
              title: 'Curved Surface Area',
              value: (2 * Math.PI * params.radius * params.height).toFixed(2),
              description: 'Unrolled: rectangle with height h and width 2πr'
            },
            {
              title: 'Top + Bottom Area',
              value: (2 * Math.PI * params.radius * params.radius).toFixed(2),
              description: 'Two circles, each with area πr²'
            }
          ]}
        />

        <DiscoveryInsight
          triggerCondition={() => params.height > params.radius * 3}
          message="Insight: When you unroll the curved surface, you get a rectangle! Height = cylinder height, Width = circumference of circle (2πr). Area = h × 2πr = 2πrh"
          type="discovery"
        />
      </DiscoveryZone>

      {/* Discovery Zone 2: Three Shapes Comparison */}
      <DiscoveryZone title="Volume Comparison: Cylinder vs Sphere vs Cone" variant="tertiary">
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          All three shapes can have the same radius and height. But their volumes are dramatically different!
        </p>

        <ComparisonView
          items={[
            {
              title: 'Cylinder',
              value: volume.toFixed(2),
              description: 'V = πr²h (baseline)',
            },
            {
              title: 'Sphere',
              value: sphereVolume.toFixed(2),
              description: `V = (4/3)πr³ = ${(sphereVolume / volume * 100).toFixed(1)}% of cylinder`,
            },
            {
              title: 'Cone',
              value: coneVolume.toFixed(2),
              description: `V = (1/3)πr²h = ${(coneVolume / volume * 100).toFixed(1)}% of cylinder`,
            },
          ]}
        />

        <div className="mt-6 p-6 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
          <h4 className="font-sans-body text-display-base font-semibold text-swiss-black mb-3">Key Insight</h4>
          <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
            With the same radius and height, a sphere holds <strong>2/3</strong> of the cylinder's volume,
            while a cone holds only <strong>1/3</strong>. This is why cones are used for holding things
            (like ice cream) - you get less for the same base area!
          </p>
        </div>

        <DiscoveryInsight
          triggerCondition={() => params.radius > 80 && params.height < 100}
          message="Discovery: Short, wide cylinders have much more volume than tall, narrow ones with the same radius. The radius is squared (r²), so small changes in radius create huge changes in volume!"
          type="tip"
        />
      </DiscoveryZone>

      {/* Discovery Zone 3: Soda Can Optimization */}
      <DiscoveryZone title="Real-World Puzzle: Soda Can Optimization" variant="secondary">
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          If you need to hold 330ml of soda, what radius and height minimizes the aluminum needed?
          This is a real optimization problem solved by beverage companies!
        </p>

        <div className="p-6 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black mb-6">
          <h4 className="font-sans-body text-display-base font-semibold text-swiss-black mb-4">Current Volume</h4>
          <div className="font-mono-math text-display-4xl text-swiss-black mb-2">
            {volume.toFixed(2)} cubic units
          </div>
          <p className="font-sans-body text-display-base text-swiss-charcoal">
            Target: 330ml (typical soda can). {volume > 300 && volume < 360 ? 'Close to optimal!' : 'Adjust to get closer to 330ml'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <h4 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Surface Area</h4>
            <div className="font-mono-math text-display-2xl text-swiss-black">{surfaceArea.toFixed(2)} units²</div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-2">Aluminum needed</div>
          </div>

          <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <h4 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Surface-to-Volume Ratio</h4>
            <div className="font-mono-math text-display-2xl text-swiss-black">{(surfaceArea / volume).toFixed(3)}</div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-2">Lower = more efficient</div>
          </div>
        </div>

        <DiscoveryInsight
          triggerCondition={() => Math.abs(volume - 330) < 30}
          message="Great! You're close to the optimal soda can size. Real soda cans are designed with h ≈ 2r to minimize aluminum while holding 330ml. Current best ratio: height = 2×radius!"
          type="discovery"
        />
      </DiscoveryZone>

      {/* Discovery Zone 4: Pipe Flow Applications */}
      <DiscoveryZone title="Pipe Flow: Cross-Section Matters" variant="primary">
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          Cylinders are everywhere as pipes! The amount of water that can flow through a pipe
          depends on its cross-sectional area (πr²), not the length.
        </p>

        <div className="p-6 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black mb-6">
          <h4 className="font-sans-body text-display-base font-semibold text-swiss-black mb-3">Cross-Sectional Area</h4>
          <div className="font-mono-math text-display-4xl text-swiss-black mb-2">
            {(Math.PI * params.radius * params.radius).toFixed(2)} units²
          </div>
          <p className="font-sans-body text-display-base text-swiss-charcoal">
            This is the "opening" through which water flows. Double the radius = 4× the flow!
          </p>
        </div>

        <ComparisonView
          items={[
            {
              title: 'Radius r',
              value: params.radius,
              description: 'Current pipe radius',
            },
            {
              title: 'If r × 2',
              value: (params.radius * 2).toFixed(0),
              description: `Cross-section = ${(4 * Math.PI * params.radius * params.radius).toFixed(2)} (4× flow!)`,
            },
          ]}
        />

        <DiscoveryInsight
          triggerCondition={() => params.radius > 90}
          message="Amazing! A pipe with twice the radius can carry 4 times as much water! This is because area scales with r². Small increases in pipe diameter create huge increases in flow capacity."
          type="discovery"
        />
      </DiscoveryZone>

      {/* Deep Dive: Historical Context */}
      <DiscoveryZone title="The History of Cylinders" variant="secondary">
        <details className="group">
          <summary className="cursor-pointer p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black hover:bg-swiss-white transition-colors">
            <span className="font-serif-display text-display-lg text-swiss-black">
              Discover how ancient civilizations used cylinders
            </span>
          </summary>
          <div className="mt-4 p-6 bg-swiss-white rounded-swiss-sm border-2 border-swiss-black space-y-4">
            <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
              Cylinders are one of the oldest and most useful shapes invented by humans.
              Ancient Mesopotamians used cylinder seals for writing as early as 3500 BCE!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
                <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Architecture</h5>
                <p className="font-sans-body text-display-base text-swiss-charcoal">
                  Classical columns in Greek and Roman temples are cylinders. The fluting (vertical grooves) isn't just decorative - it reduces weight while maintaining strength!
                </p>
              </div>

              <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
                <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Engineering</h5>
                <p className="font-sans-body text-display-base text-swiss-charcoal">
                  Engine cylinders, hydraulic systems, and pressure vessels all use cylindrical shapes. They're perfect for containing pressure and linear motion.
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
              <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Try This Experiment</h5>
              <p className="font-sans-body text-display-base text-swiss-charcoal">
                Roll a piece of paper into a cylinder. Notice how the height and circumference relate? Try calculating: if you know the height and radius, can you predict the paper's area? (Hint: A = 2πrh + 2πr²)
              </p>
            </div>
          </div>
        </details>
      </DiscoveryZone>
    </div>
  );
};

export default PremiumCylinderPage;
