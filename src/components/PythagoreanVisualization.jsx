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
          <label className="block text-xs font-semibold text-blue-300 mb-1">
            Side a: {sideA}
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={sideA}
            onChange={(e) => onSideAChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-green-300 mb-1">
            Side b: {sideB}
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={sideB}
            onChange={(e) => onSideBChange(Number(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-green-500 hover:accent-green-400 focus:outline-none focus:ring-2 focus:ring-green-500/50"
          />
        </div>
      </div>

      {/* Visual Proof - Main Content */}
      <div className="w-full max-w-5xl bg-slate-950/40 rounded-2xl border border-white/10 p-4 pointer-events-auto shrink-0">
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
            fill="rgba(59, 130, 246, 0.25)"
            stroke="#3b82f6"
            strokeWidth="3"
          />
          <text
            x={trianglePoints.origin.x - (sideA * scale) / 2}
            y={trianglePoints.aPoint.y + (sideA * scale) / 2 + 5}
            fill="#3b82f6"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
          >
            a² = {areaA}
          </text>

          {/* Square on side b (horizontal) - below triangle */}
          <rect
            x={trianglePoints.origin.x}
            y={trianglePoints.origin.y}
            width={sideB * scale}
            height={sideB * scale}
            fill="rgba(34, 197, 94, 0.25)"
            stroke="#22c55e"
            strokeWidth="3"
          />
          <text
            x={trianglePoints.origin.x + (sideB * scale) / 2}
            y={trianglePoints.origin.y + (sideB * scale) / 2 + 5}
            fill="#22c55e"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
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
                    fill="rgba(168, 85, 247, 0.25)"
                    stroke="#a855f7"
                    strokeWidth="3"
                    transform={`rotate(${hypotenuseAngle} ${centerX} ${centerY})`}
                  />
                  <text
                    x={centerX}
                    y={centerY + 5}
                    fill="#a855f7"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
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
            fill="rgba(59, 130, 246, 0.4)"
            stroke="#3b82f6"
            strokeWidth="4"
          />

          {/* Right angle marker */}
          <polyline
            points={`
              ${trianglePoints.origin.x + 20} ${trianglePoints.origin.y - 20}
              ${trianglePoints.origin.x + 20} ${trianglePoints.origin.y}
              ${trianglePoints.origin.x} ${trianglePoints.origin.y - 20}
            `}
            fill="none"
            stroke="#fff"
            strokeWidth="3"
          />

        </svg>

        {/* Stats - Compact */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-blue-900/30 rounded-lg border border-blue-500/30">
            <div className="text-blue-300 text-xs mb-1">a²</div>
            <div className="text-white text-xl font-bold">{areaA}</div>
          </div>
          <div className="p-2 bg-green-900/30 rounded-lg border border-green-500/30">
            <div className="text-green-300 text-xs mb-1">b²</div>
            <div className="text-white text-xl font-bold">{areaB}</div>
          </div>
          <div className="p-2 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <div className="text-purple-300 text-xs mb-1">c²</div>
            <div className="text-white text-xl font-bold">{areaC.toFixed(2)}</div>
          </div>
        </div>

        {/* Famous Triple Detection */}
        {isFamousTriple && (
          <div className="mt-2 p-2 bg-yellow-900/30 rounded-lg border border-yellow-500/30 text-center">
            <div className="text-yellow-300 text-xs font-bold">
              🎉 {sideA}-{sideB}-{sideC.toFixed(0)} Famous Triple!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PythagoreanVisualization;
