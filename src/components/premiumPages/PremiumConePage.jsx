import React, { useState, useMemo } from 'react';
import InteractiveSlider from '../InteractiveSlider';
import ExplorableFormula from '../ExplorableFormula';
import DiscoveryInsight from '../DiscoveryInsight';
import DiscoveryZone, { ComparisonView } from '../DiscoveryZone';

/**
 * Premium Cone Page Component
 * Implements "explorable explanation" for cone volume
 */
const PremiumConePage = ({ params, onParamsChange }) => {
  const [highlightedVar, setHighlightedVar] = useState(null);

  // Calculate volume
  const volume = useMemo(() => {
    return (1/3) * Math.PI * Math.pow(params.radius, 2) * params.height;
  }, [params.radius, params.height]);

  // Calculate slant height
  const slantHeight = useMemo(() => {
    return Math.sqrt(Math.pow(params.radius, 2) + Math.pow(params.height, 2));
  }, [params.radius, params.height]);

  // Calculate surface area
  const surfaceArea = useMemo(() => {
    return Math.PI * params.radius * (params.radius + slantHeight);
  }, [params.radius, slantHeight]);

  return (
    <div className="space-y-8">
      {/* Discovery Zone 1: Why 1/3? */}
      <DiscoveryZone
        title="Explore: Why Is It 1/3 of a Cylinder?"
        icon="🔍"
        variant="primary"
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          A cone with the same base and height as a cylinder holds exactly <strong>1/3</strong> the volume.
          But <em>why</em>? Let's explore this visually!
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
            color="blue"
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
            color="cyan"
          />
        </div>

        <ExplorableFormula
          formula="V = (1/3)πr²h"
          variables={{ r: params.radius, h: params.height }}
          highlight={highlightedVar}
          showSteps={true}
          result={volume}
          unit="cubic units"
        />

        <ComparisonView
          items={[
            {
              title: 'Cone Volume',
              value: volume.toFixed(2),
              description: `V = (1/3)πr²h`
            },
            {
              title: 'Equivalent Cylinder',
              value: (volume * 3).toFixed(2),
              description: '3 cones = 1 cylinder!'
            }
          ]}
        />

        <DiscoveryInsight
          triggerCondition={() => params.radius > 80 && params.height > 150}
          message="🎯 Fun Fact: You could fit 3 ice cream cones (filled to the brim) into one cylinder with the same base and height! The 1/3 factor works for ANY cone, regardless of size!"
          icon="🍦"
          type="discovery"
        />
      </DiscoveryZone>

      {/* Discovery Zone 2: Apex Angle Experiment */}
      <DiscoveryZone
        title="Experiment: Tall vs Wide - Which Holds More?"
        icon="⚗️"
        variant="tertiary"
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          Given a fixed slant height (the distance from tip to edge), what cone shape gives maximum volume?
          Is it tall and skinny, or short and wide?
        </p>

        <div className="p-6 bg-cyan-900/20 rounded-xl border border-cyan-500/20 mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-cyan-300">Slant Height (l):</span>
            <span className="text-2xl font-mono text-white">{slantHeight.toFixed(2)} units</span>
          </div>
          <div className="text-xs text-slate-400">
            Calculated as: l = √(r² + h²) = √({params.radius}² + {params.height}²)
          </div>
        </div>

        <ComparisonView
          items={[
            {
              title: 'Apex Angle',
              value: `${(2 * Math.atan(params.radius / params.height) * 180 / Math.PI).toFixed(1)}°`,
              description: 'Wider angle = flatter cone'
            },
            {
              title: 'Shape Efficiency',
              value: params.height > params.radius * 1.5 ? 'Tall & Efficient' : params.radius > params.height * 1.5 ? 'Wide & Stable' : 'Balanced',
              description: 'Tall cones hold more for same slant height!'
            }
          ]}
        />

        <DiscoveryInsight
          triggerCondition={() => Math.abs(params.height - params.radius) < 10}
          message="🔍 Discovery: When height ≈ radius (apex angle ≈ 53°), the cone has a balanced shape. But taller cones (smaller apex angle) actually hold MORE volume for the same slant height!"
          icon="📐"
          type="tip"
        />
      </DiscoveryZone>

      {/* Discovery Zone 3: Slant Height & Surface Area */}
      <DiscoveryZone
        title="The Slant Height Connection"
        icon="📏"
        variant="secondary"
      >
        <p className="text-slate-300 leading-relaxed mb-6">
          The slant height (l) connects the cone's volume to its surface area through the
          Pythagorean theorem: l = √(r² + h²)
        </p>

        <ExplorableFormula
          formula="l = √(r² + h²)"
          variables={{ r: params.radius, h: params.height }}
          showSteps={true}
          result={slantHeight}
          unit="units"
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/10">
            <h4 className="text-sm font-semibold text-purple-300 mb-2">Lateral Surface Area</h4>
            <div className="text-xl font-mono text-white">
              {(Math.PI * params.radius * slantHeight).toFixed(2)} units²
            </div>
            <div className="text-xs text-slate-400 mt-2">S = πrl (curved part only)</div>
          </div>

          <div className="p-4 bg-slate-950/40 rounded-xl border border-white/10">
            <h4 className="text-sm font-semibold text-blue-300 mb-2">Total Surface Area</h4>
            <div className="text-xl font-mono text-white">
              {surfaceArea.toFixed(2)} units²
            </div>
            <div className="text-xs text-slate-400 mt-2">S = πr(r+l) (includes base)</div>
          </div>
        </div>

        <DiscoveryInsight
          triggerCondition={() => slantHeight > 150}
          message="💡 Practical Insight: Cones with large slant heights have huge surface areas relative to their volume. This is why ice cream cones are made the way they are - they maximize the amount of ice cream that can fit while using minimal material for the cone itself!"
          icon="🍦"
          type="discovery"
        />
      </DiscoveryZone>

      {/* Discovery Zone 4: Real-World Applications */}
      <DiscoveryZone
        title="🌍 Real-World Cone Applications"
        icon="🏗️"
        variant="primary"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-orange-900/20 rounded-xl border border-orange-500/20">
            <h4 className="text-lg font-bold text-orange-300 mb-3">🏗️ Architecture & Design</h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Cone shapes are used in roofs, towers, and monuments because they naturally
              shed water and snow efficiently.
            </p>
            <div className="text-xs text-slate-400">
              Example: The Transamerica Pyramid in San Francisco uses a cone-based design
            </div>
          </div>

          <div className="p-6 bg-blue-900/20 rounded-xl border border-blue-500/20">
            <h4 className="text-lg font-bold text-blue-300 mb-3">🔊 Sound & Flow</h4>
            <p className="text-sm text-slate-300 leading-relaxed mb-3">
              Cones direct sound and fluid flow efficiently - from speaker systems
              to funnels and traffic cones.
            </p>
            <div className="text-xs text-slate-400">
              Fun fact: Your ear canal is shaped like a cone to amplify sound!
            </div>
          </div>
        </div>

        {/* Ice Cream Calculator */}
        <div className="mt-6 p-6 bg-pink-900/20 rounded-xl border border-pink-500/20">
          <h4 className="text-lg font-bold text-pink-300 mb-4">🍦 Ice Cream Cone Calculator</h4>
          <p className="text-sm text-slate-300 mb-4">
            Based on your current cone size (r={params.radius}, h={params.height}),
            here's how much ice cream you could fit:
          </p>
          <div className="text-3xl font-mono text-white mb-2">
            {volume.toFixed(2)} cubic units
          </div>
          <p className="text-xs text-slate-400">
            That's about {(volume / 30).toFixed(1)} scoops of ice cream! 🍨
          </p>
        </div>
      </DiscoveryZone>

      {/* Deep Dive: Historical Context */}
      <DiscoveryZone
        title="📚 Why the 1/3 Factor? Visual Proof"
        icon="📜"
        variant="secondary"
      >
        <details className="group">
          <summary className="cursor-pointer p-4 bg-slate-950/40 rounded-xl hover:bg-slate-950/60 transition-colors">
            <span className="text-lg font-semibold text-blue-300">
              See the visual proof of why V = (1/3)πr²h
            </span>
          </summary>
          <div className="mt-4 p-6 bg-slate-900/40 rounded-xl space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              Imagine taking a cone and a cylinder with the same base and height.
              Fill the cone with water and pour it into the cylinder. You'll need to do this
              exactly <strong>3 times</strong> to fill the cylinder!
            </p>

            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-blue-900/20 rounded-lg text-center">
                <div className="text-3xl mb-2">🍦</div>
                <div className="text-xs text-slate-400">Cone 1</div>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-lg text-center">
                <div className="text-3xl mb-2">🍦</div>
                <div className="text-xs text-slate-400">Cone 2</div>
              </div>
              <div className="p-4 bg-blue-900/20 rounded-lg text-center">
                <div className="text-3xl mb-2">🍦</div>
                <div className="text-xs text-slate-400">Cone 3</div>
              </div>
            </div>
            <div className="text-center text-2xl">↓ = ↓ = ↓</div>
            <div className="p-4 bg-cyan-900/20 rounded-lg text-center">
              <div className="text-3xl mb-2">🥫</div>
              <div className="text-sm font-bold text-cyan-300">1 Full Cylinder</div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              This works because of <strong>Cavalieri's Principle</strong>: if two solids have
              the same height and equal cross-sectional areas at every level, they have equal volumes.
            </p>

            <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/20">
              <h5 className="text-sm font-bold text-purple-300 mb-2">🎯 Try It Yourself</h5>
              <p className="text-xs text-slate-300">
                Get a party cup (cylinder) and a traffic cone (same height). Fill the cone with water
                and pour into the cup. Repeat until the cup is full - you'll need exactly 3 cone-fulls!
              </p>
            </div>
          </div>
        </details>
      </DiscoveryZone>
    </div>
  );
};

export default PremiumConePage;
