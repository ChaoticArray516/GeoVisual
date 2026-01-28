import React, { useState, useMemo } from 'react';

/**
 * 2D Interactive Pythagorean Visualization
 * Replaces 3D canvas when Pythagorean theorem is selected
 */
const PythagoreanVisualization = ({ sideA, sideB, onSideAChange, onSideBChange }) => {
  // Calculate hypotenuse
  const sideC = useMemo(() => {
    return Math.sqrt(sideA ** 2 + sideB ** 2);
  }, [sideA, sideB]);

  // Calculate areas of squares on each side
  const areaA = sideA ** 2;
  const areaB = sideB ** 2;
  const areaC = sideC ** 2;

  // Scale factor for visualization - adjusted for better layout
  const scale = 20;

  // Check if it's a famous Pythagorean triple
  const isFamousTriple = useMemo(() => {
    const c = sideC;
    return (sideA === 3 && sideB === 4 && Math.abs(c - 5) < 0.1) ||
           (sideA === 4 && sideB === 3 && Math.abs(c - 5) < 0.1) ||
           (sideA === 5 && sideB === 12 && Math.abs(c - 13) < 0.1) ||
           (sideA === 12 && sideB === 5 && Math.abs(c - 13) < 0.1) ||
           (sideA === 8 && sideB === 15 && Math.abs(c - 17) < 0.1) ||
           (sideA === 15 && sideB === 8 && Math.abs(c - 17) < 0.1);
  }, [sideA, sideB, sideC]);

  // Triangle vertices - right triangle with right angle at origin
  const trianglePoints = {
    origin: { x: 200, y: 300 }, // Right angle vertex
    aPoint: { x: 200, y: 300 - sideA * scale }, // Vertical side a
    bPoint: { x: 200 + sideB * scale, y: 300 } // Horizontal side b
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start p-3 pointer-events-none overflow-y-auto">
      {/* Controls - At Very Top */}
      <div className="w-full max-w-2xl mb-3 grid grid-cols-2 gap-6 pointer-events-auto z-50 relative shrink-0">
        <div>
          <label className="block font-sans-body text-display-sm font-semibold text-swiss-black mb-1">
            Side a: {sideA}
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={sideA}
            onChange={(e) => onSideAChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block font-sans-body text-display-sm font-semibold text-swiss-black mb-1">
            Side b: {sideB}
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={sideB}
            onChange={(e) => onSideBChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Visual Proof - Main Content */}
      <div className="w-full max-w-5xl bg-swiss-white rounded-swiss-sm border-2 border-swiss-black p-6 pointer-events-auto shrink-0">
        <svg
          width="100%"
          height="500"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid meet"
          className="mx-auto"
        >
          {/* Square on side a (vertical) - to the left of triangle */}
          <rect
            x={trianglePoints.origin.x - sideA * scale}
            y={trianglePoints.aPoint.y}
            width={sideA * scale}
            height={sideA * scale}
            fill="#E6F0FF"
            stroke="#0055FF"
            strokeWidth="2"
          />
          <text
            x={trianglePoints.origin.x - (sideA * scale) / 2}
            y={trianglePoints.aPoint.y + (sideA * scale) / 2 + 5}
            fill="#0055FF"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className="font-sans-body"
          >
            a² = {areaA}
          </text>

          {/* Square on side b (horizontal) - below triangle */}
          <rect
            x={trianglePoints.origin.x}
            y={trianglePoints.origin.y}
            width={sideB * scale}
            height={sideB * scale}
            fill="#E6F0FF"
            stroke="#0055FF"
            strokeWidth="2"
          />
          <text
            x={trianglePoints.origin.x + (sideB * scale) / 2}
            y={trianglePoints.origin.y + (sideB * scale) / 2 + 5}
            fill="#0055FF"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
            className="font-sans-body"
          >
            b² = {areaB}
          </text>

          {/* Square on hypotenuse c - aligned with the hypotenuse */}
          {
            (() => {
              // Calculate angle of the hypotenuse (from aPoint to bPoint)
              const hypotenuseAngle = Math.atan2(
                trianglePoints.bPoint.y - trianglePoints.aPoint.y,
                trianglePoints.bPoint.x - trianglePoints.aPoint.x
              ) * 180 / Math.PI;

              // Calculate the perpendicular angle (90 degrees offset from hypotenuse)
              const perpendicularAngle = hypotenuseAngle + 90;

              // Calculate the offset distance for the square (perpendicular to hypotenuse)
              // We want the square to be positioned so that the opposite edge aligns with the hypotenuse
              const offsetDistance = sideC * scale * 0.5;

              // Calculate the perpendicular offset (negative to move in opposite direction)
              const offsetX = -offsetDistance * Math.cos(perpendicularAngle * Math.PI / 180);
              const offsetY = -offsetDistance * Math.sin(perpendicularAngle * Math.PI / 180);

              // Position for the hypotenuse square (centered on the hypotenuse)
              const centerX = (trianglePoints.aPoint.x + trianglePoints.bPoint.x) / 2 + offsetX;
              const centerY = (trianglePoints.aPoint.y + trianglePoints.bPoint.y) / 2 + offsetY;

              // Calculate the top-left corner of the square
              const squareX = centerX - (sideC * scale) / 2;
              const squareY = centerY - (sideC * scale) / 2;

              return (
                <g>
                  <rect
                    x={squareX}
                    y={squareY}
                    width={sideC * scale}
                    height={sideC * scale}
                    fill="#FAFAFA"
                    stroke="#000000"
                    strokeWidth="2"
                    transform={`rotate(${hypotenuseAngle} ${centerX} ${centerY})`}
                  />
                  <text
                    x={centerX}
                    y={centerY + 5}
                    fill="#000000"
                    fontSize="14"
                    fontWeight="600"
                    textAnchor="middle"
                    className="font-sans-body"
                  >
                    c² = {areaC.toFixed(2)}
                  </text>
                </g>
              );
            })()
          }

          {/* Triangle - Right triangle with right angle at origin */}
          <path
            d={`M ${trianglePoints.origin.x} ${trianglePoints.origin.y}
                 L ${trianglePoints.aPoint.x} ${trianglePoints.aPoint.y}
                 L ${trianglePoints.bPoint.x} ${trianglePoints.bPoint.y}
                 Z`}
            fill="#0055FF"
            fillOpacity="0.3"
            stroke="#0055FF"
            strokeWidth="3"
          />

          {/* Right angle marker */}
          <polyline
            points={`
              ${trianglePoints.origin.x + 20} ${trianglePoints.origin.y - 20}
              ${trianglePoints.origin.x + 20} ${trianglePoints.origin.y}
              ${trianglePoints.origin.x} ${trianglePoints.origin.y - 20}
            `}
            fill="none"
            stroke="#000000"
            strokeWidth="2"
          />

        </svg>

        {/* Stats - Compact */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <div className="font-sans-body text-display-sm text-swiss-black mb-1">a²</div>
            <div className="font-mono-math text-display-xl text-math-blue">{areaA}</div>
          </div>
          <div className="p-3 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <div className="font-sans-body text-display-sm text-swiss-black mb-1">b²</div>
            <div className="font-mono-math text-display-xl text-math-blue">{areaB}</div>
          </div>
          <div className="p-3 bg-swiss-offwhite rounded-swiss-sm border-2 border-swiss-black">
            <div className="font-sans-body text-display-sm text-swiss-black mb-1">c²</div>
            <div className="font-mono-math text-display-xl text-swiss-black">{areaC.toFixed(2)}</div>
          </div>
        </div>

        {/* Famous Triple Detection */}
        {isFamousTriple && (
          <div className="mt-2 p-3 bg-math-blue-light rounded-swiss-sm border-2 border-swiss-black text-center">
            <div className="font-sans-body text-display-sm font-semibold text-swiss-black">
              {sideA}-{sideB}-{sideC.toFixed(0)} Famous Triple!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PythagoreanVisualization;
