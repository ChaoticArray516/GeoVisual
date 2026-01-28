import React, { useState } from 'react';
import DiscoveryZone from '../DiscoveryZone';

/**
 * Premium Pythagorean Theorem Page Component
 * Educational content (interactive visualization is in PythagoreanVisualization component in canvas area)
 */
const PremiumPythagoreanPage = () => {
  const [selectedProof, setSelectedProof] = useState(0);

  return (
    <div className="space-y-8">
      {/* Discovery Zone: Three Different Proofs */}
      <DiscoveryZone title="Three Ways to Prove a² + b² = c²" variant="secondary">
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          The Pythagorean theorem has hundreds of proofs! Here are three of the most famous ones.
          Use the interactive visualization above to explore the theorem dynamically.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedProof(0)}
            className={`px-4 py-2 rounded-swiss-sm font-sans-body text-display-sm font-semibold transition-all ${
              selectedProof === 0
                ? 'bg-math-blue text-swiss-white border-2 border-swiss-black'
                : 'bg-swiss-offwhite text-swiss-charcoal hover:bg-swiss-white border-2 border-swiss-black'
            }`}
          >
            1. Rearrangement
          </button>
          <button
            onClick={() => setSelectedProof(1)}
            className={`px-4 py-2 rounded-swiss-sm font-sans-body text-display-sm font-semibold transition-all ${
              selectedProof === 1
                ? 'bg-math-blue text-swiss-white border-2 border-swiss-black'
                : 'bg-swiss-offwhite text-swiss-charcoal hover:bg-swiss-white border-2 border-swiss-black'
            }`}
          >
            2. Similar Triangles
          </button>
          <button
            onClick={() => setSelectedProof(2)}
            className={`px-4 py-2 rounded-swiss-sm font-sans-body text-display-sm font-semibold transition-all ${
              selectedProof === 2
                ? 'bg-math-blue text-swiss-white border-2 border-swiss-black'
                : 'bg-swiss-offwhite text-swiss-charcoal hover:bg-swiss-white border-2 border-swiss-black'
            }`}
          >
            3. Euclid's Windmill
          </button>
        </div>

        <div className="p-6 bg-swiss-white rounded-swiss-sm border-2 border-swiss-black">
          {selectedProof === 0 && (
            <div className="space-y-4">
              <h4 className="font-serif-display text-display-lg text-swiss-black mb-3">Proof 1: Rearrangement (Bhaskara's Proof)</h4>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
                Imagine four identical right triangles arranged in two different ways to form the same large square.
                The area must be the same, proving a² + b² = c²!
              </p>
              <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="font-sans-body text-display-sm text-swiss-charcoal mb-2">Arrangement 1: c² + 4 triangles</div>
                  </div>
                  <div>
                    <div className="font-sans-body text-display-sm text-swiss-charcoal mb-2">Arrangement 2: a² + b² + 4 triangles</div>
                  </div>
                </div>
                <p className="font-sans-body text-display-sm text-swiss-charcoal mt-3 text-center">
                  Both form the same square, so c² = a² + b²!
                </p>
              </div>
            </div>
          )}

          {selectedProof === 1 && (
            <div className="space-y-4">
              <h4 className="font-serif-display text-display-lg text-swiss-black mb-3">Proof 2: Similar Triangles</h4>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
                Drop a perpendicular from the right angle to the hypotenuse. This creates two smaller triangles
                that are similar to the original triangle and to each other.
              </p>
              <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black space-y-3">
                <div className="font-sans-body text-display-base text-swiss-charcoal">
                  <strong>Step 1:</strong> The altitude divides the triangle into two smaller triangles
                </div>
                <div className="font-sans-body text-display-base text-swiss-charcoal">
                  <strong>Step 2:</strong> All three triangles are similar (same angles)
                </div>
                <div className="font-sans-body text-display-base text-swiss-charcoal">
                  <strong>Step 3:</strong> From similarity: a/c = (altitude)/b and b/c = (altitude)/a
                </div>
                <div className="font-sans-body text-display-base text-swiss-charcoal">
                  <strong>Step 4:</strong> Multiplying gives a² = c·(segment of c) and b² = c·(other segment)
                </div>
                <div className="font-sans-body text-display-base text-swiss-charcoal">
                  <strong>Result:</strong> a² + b² = c·(whole hypotenuse) = c²
                </div>
              </div>
            </div>
          )}

          {selectedProof === 2 && (
            <div className="space-y-4">
              <h4 className="font-serif-display text-display-lg text-swiss-black mb-3">Proof 3: Euclid's Windmill</h4>
              <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed">
                Euclid's original proof from 300 BC! He constructed squares on each side and showed
                that the areas of the smaller squares exactly fill the larger square.
              </p>
              <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
                <p className="font-sans-body text-display-base text-swiss-charcoal mb-2">
                  <strong>Key Insight:</strong> If you cut the two smaller squares and rearrange them,
                  they perfectly fill the square on the hypotenuse!
                </p>
                <p className="font-sans-body text-display-sm text-swiss-charcoal mt-3">
                  This visual proof is so elegant that it's still used in textbooks today, 2300 years later!
                </p>
              </div>
            </div>
          )}
        </div>
      </DiscoveryZone>

      {/* Discovery Zone: Real-World Applications */}
      <DiscoveryZone title="Real-World Applications" variant="tertiary">
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          The Pythagorean theorem isn't just theory - it's used everywhere in real life!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Ladder Problems</h5>
            <p className="font-sans-body text-display-base text-swiss-charcoal">
              A 10ft ladder leans against a wall. If the base is 6ft from the wall, how high does it reach?
              h = √(10² - 6²) = √64 = 8ft
            </p>
          </div>

          <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">TV Screen Sizes</h5>
            <p className="font-sans-body text-display-base text-swiss-charcoal">
              A 42" TV with 16:9 aspect ratio has width ≈ 36.6" and height ≈ 20.6".
              Diagonal: √(36.6² + 20.6²) ≈ 42"
            </p>
          </div>

          <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Construction</h5>
            <p className="font-sans-body text-display-base text-swiss-charcoal">
              Builders use 3-4-5 triangles to create perfect right angles.
              If a triangle has sides 3, 4, 5, it must be a right triangle!
            </p>
          </div>

          <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">GPS Navigation</h5>
            <p className="font-sans-body text-display-base text-swiss-charcoal">
              GPS uses trilateration (3D version of Pythagorean theorem) to calculate your position
              from distances to satellites.
            </p>
          </div>
        </div>
      </DiscoveryZone>

      {/* Discovery Zone: Famous Pythagorean Triples */}
      <DiscoveryZone title="Famous Pythagorean Triples" variant="primary">
        <p className="font-sans-body text-display-base text-swiss-charcoal leading-relaxed mb-6">
          Pythagorean triples are sets of three positive integers (a, b, c) that satisfy a² + b² = c².
          These were known to ancient civilizations over 4000 years ago!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black text-center">
            <div className="font-serif-display text-display-lg text-swiss-black">3 - 4 - 5</div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-2">
              Most famous! Used in ancient Egyptian construction
            </div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-1">
              3² + 4² = 9 + 16 = 25 = 5²
            </div>
          </div>

          <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black text-center">
            <div className="font-serif-display text-display-lg text-swiss-black">5 - 12 - 13</div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-2">
              One of the most commonly used triples
            </div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-1">
              5² + 12² = 25 + 144 = 169 = 13²
            </div>
          </div>

          <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black text-center">
            <div className="font-serif-display text-display-lg text-swiss-black">8 - 15 - 17</div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-2">
              Another primitive triple (not a multiple of 3-4-5)
            </div>
            <div className="font-sans-body text-display-sm text-swiss-charcoal mt-1">
              8² + 15² = 64 + 225 = 289 = 17²
            </div>
          </div>
        </div>

        <div className="p-4 bg-swiss-white rounded-swiss-sm border-2 border-swiss-black">
          <h4 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Challenge for You</h4>
          <p className="font-sans-body text-display-base text-swiss-charcoal">
            Can you find more Pythagorean triples? Try using the interactive visualization above!
            Adjust the sliders to find integer solutions. Here are some to test:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="px-2 py-1 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black font-sans-body text-display-sm text-swiss-charcoal">7-24-25</span>
            <span className="px-2 py-1 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black font-sans-body text-display-sm text-swiss-charcoal">9-40-41</span>
            <span className="px-2 py-1 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black font-sans-body text-display-sm text-swiss-charcoal">12-35-37</span>
            <span className="px-2 py-1 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black font-sans-body text-display-sm text-swiss-charcoal">20-21-29</span>
          </div>
        </div>
      </DiscoveryZone>

      {/* Deep Dive: History */}
      <DiscoveryZone title="4000 Years of History" variant="secondary">
        <details className="group">
          <summary className="cursor-pointer p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black hover:bg-swiss-white transition-colors">
            <span className="font-serif-display text-display-lg text-swiss-black">
              Explore the fascinating history of the Pythagorean theorem
            </span>
          </summary>
          <div className="mt-4 p-6 bg-swiss-white rounded-swiss-sm border-2 border-swiss-black space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
                <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Mesopotamia (2000 BC)</h5>
                <p className="font-sans-body text-display-base text-swiss-charcoal">
                  Babylonian clay tablets (Plimpton 322) show they knew Pythagorean triples
                  over 1000 years before Pythagoras!
                </p>
              </div>

              <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
                <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Ancient Egypt (2000 BC)</h5>
                <p className="font-sans-body text-display-base text-swiss-charcoal">
                  Egyptian builders used 3-4-5 triangles to construct perfect right angles
                  in the pyramids and temples.
                </p>
              </div>

              <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
                <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">India (800 BC)</h5>
                <p className="font-sans-body text-display-base text-swiss-charcoal">
                  The Baudhayana Sulba Sutra contains the earliest written statement of
                  the theorem: "The rope stretched across the diagonal produces an area..."
                </p>
              </div>

              <div className="p-4 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black">
                <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Greece (500 BC)</h5>
                <p className="font-sans-body text-display-base text-swiss-charcoal">
                  Pythagoras (or his followers) provided the first proof. The theorem
                  is named after him, though he didn't discover it.
                </p>
              </div>
            </div>

            <div className="p-4 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
              <h5 className="font-sans-body text-display-sm font-semibold text-swiss-black mb-2">Why Is It So Important?</h5>
              <p className="font-sans-body text-display-base text-swiss-charcoal">
                The Pythagorean theorem is one of the most important results in mathematics.
                It connects algebra and geometry, is fundamental to trigonometry, and has
                countless practical applications. It's been proved in over 350 different ways!
              </p>
            </div>
          </div>
        </details>
      </DiscoveryZone>
    </div>
  );
};

export default PremiumPythagoreanPage;
